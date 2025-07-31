import React, { useState, useEffect, useRef } from "react";
import "../styles/Chat.css";
import ChatHeader from "../app/components/chatHeader/ChatHeader";
import Message from "../app/components/message/Message";
import Icons from "../app/icons/Icon";
import { useSelector } from "react-redux";
import { selectUser } from "../app/features/userSlice";
import {
  selectChannelId,
  selectChannelName,
} from "../app/features/serverSlice";
import socketService from "../app/services/socketService";

function Chat() {
  const user = useSelector(selectUser);
  const channelId = useSelector(selectChannelId);
  const channelName = useSelector(selectChannelName);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const previousChannelId = useRef(null);
  const typingTimeout = useRef(null);
  const messagesEndRef = useRef(null);

  // Connect to socket when component mounts
  useEffect(() => {
    if (user) {
      socketService.connect();
    }

    return () => {
      socketService.disconnect();
    };
  }, [user]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Load messages when channel changes
  useEffect(() => {
    const loadChannelMessages = async () => {
      if (channelId && channelId !== previousChannelId.current) {
        console.log(`Loading messages for channel: ${channelId}`); // Debug log

        // Leave previous channel
        if (previousChannelId.current) {
          socketService.leaveChannel(previousChannelId.current);
        }

        // Join new channel
        socketService.joinChannel(channelId);
        previousChannelId.current = channelId;

        // Load previous messages
        setLoading(true);
        setMessages([]); // Clear previous messages

        try {
          const response = await socketService.fetchChannelMessages(channelId);
          console.log("API Response:", response); // Debug log

          if (response.success && response.data) {
            console.log(`Loaded ${response.data.length} messages`); // Debug log
            setMessages(response.data);
          } else {
            console.log("No messages found or API error"); // Debug log
            setMessages([]);
          }
        } catch (error) {
          console.error("Error loading messages:", error);
          setMessages([]);
        } finally {
          setLoading(false);
        }
      }
    };

    // Only load if we have a channelId
    if (channelId) {
      loadChannelMessages();
    }
  }, [channelId]);

  // Listen for new messages
  useEffect(() => {
    const handleNewMessage = (messageData) => {
      console.log("New message received:", messageData); // Debug log
      setMessages((prev) => [...prev, messageData]);
    };

    const handleUserTyping = (data) => {
      setTypingUsers((prev) => {
        if (!prev.find((u) => u.userId === data.userId)) {
          return [...prev, data];
        }
        return prev;
      });
    };

    const handleUserStopTyping = (data) => {
      setTypingUsers((prev) => prev.filter((u) => u.userId !== data.userId));
    };

    const handleMessageSaved = (data) => {
      // Update the temporary message with the saved message data
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === data.tempId
            ? { ...data.savedMessage, id: data.savedMessage._id }
            : msg
        )
      );
    };

    const handleMessageError = (data) => {
      console.error("Message failed to save:", data.error);
      // Optionally show user notification
    };

    socketService.onNewMessage(handleNewMessage);
    socketService.onUserTyping(handleUserTyping);
    socketService.onUserStopTyping(handleUserStopTyping);
    socketService.onMessageSaved(handleMessageSaved);
    socketService.onMessageError(handleMessageError);

    return () => {
      socketService.offNewMessage();
      // Clean up other listeners as needed
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && channelId && user) {
      socketService.sendMessage(channelId, input.trim(), {
        id: user.id,
        username: user.username,
        avatar: user.avatar,
      });
      setInput("");

      // Stop typing indicator
      if (isTyping) {
        socketService.stopTyping(channelId, user.id);
        setIsTyping(false);
      }
    }
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);

    // Handle typing indicator
    if (!isTyping && e.target.value.trim()) {
      setIsTyping(true);
      socketService.startTyping(channelId, user.id, user.username);
    }

    // Clear existing timeout
    if (typingTimeout.current) {
      clearTimeout(typingTimeout.current);
    }

    // Set new timeout to stop typing
    typingTimeout.current = setTimeout(() => {
      if (isTyping) {
        socketService.stopTyping(channelId, user.id);
        setIsTyping(false);
      }
    }, 2000);
  };

  if (!channelId) {
    return (
      <div className="chat">
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            color: "var(--light-grey-color)",
          }}
        >
          Select a channel to start chatting
        </div>
      </div>
    );
  }

  return (
    <div className="chat">
      <ChatHeader channelName={channelName} />

      <div className="chat__messages">
        {loading ? (
          <div
            style={{
              textAlign: "center",
              padding: "20px",
              color: "var(--light-grey-color)",
            }}
          >
            Loading messages...
          </div>
        ) : (
          <>
            {messages.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "20px",
                  color: "var(--light-grey-color)",
                }}
              >
                No messages yet. Start the conversation!
              </div>
            ) : (
              messages.map((message) => (
                <Message
                  key={message.id || message._id}
                  message={message.message}
                  user={message.user}
                  timestamp={message.timestamp}
                />
              ))
            )}

            {/* Typing indicator */}
            {typingUsers.length > 0 && (
              <div
                style={{
                  padding: "10px",
                  color: "var(--light-grey-color)",
                  fontSize: "12px",
                }}
              >
                {typingUsers.map((u) => u.username).join(", ")}{" "}
                {typingUsers.length === 1 ? "is" : "are"} typing...
              </div>
            )}

            {/* Auto-scroll anchor */}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      <div className="chat__input">
        <Icons.AddCircle className="chat__input-icon" />
        <form onSubmit={handleSubmit} className="chat__inputForm">
          <input
            value={input}
            onChange={handleInputChange}
            placeholder={`Message #${channelName}`}
          />
          <button className="chat__inputForm-button" type="submit">
            Send
          </button>
        </form>

        <div className="chat__inputIcons">
          <Icons.GifBox className="chat__inputIcons-icon" />
          <Icons.EmojiEmotions className="chat__inputIcons-icon" />
        </div>
      </div>
    </div>
  );
}

export default Chat;
