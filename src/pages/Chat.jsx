import React, { useState, useEffect } from "react";
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
import apiService from "../app/services/apiServices";

function Chat() {
  const user = useSelector(selectUser);
  const channelId = useSelector(selectChannelId);
  const channelName = useSelector(selectChannelName);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);

  // Fetch messages when channel changes
  useEffect(() => {
    const fetchMessages = async () => {
      if (!channelId) return;

      try {
        setLoading(true);
        const messagesData = await apiService.getMessages(channelId);
        setMessages(messagesData);
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [channelId]);

  const sendMessage = async (e) => {
    e.preventDefault();

    if (!input.trim() || !channelId || sendingMessage) return;

    let messageContent = ""; // Declare messageContent outside the try block
    try {
      setSendingMessage(true);
      messageContent = input.trim();
      setInput(""); // Clear input immediately for better UX

      const response = await apiService.sendMessage(channelId, messageContent);

      // Add the new message to the messages array
      setMessages((prevMessages) => [...prevMessages, response.message]);

      console.log("Message sent successfully:", response);
    } catch (error) {
      console.error("Error sending message:", error);
      // Restore input if sending failed
      setInput(messageContent);
    } finally {
      setSendingMessage(false);
    }
  };

  return (
    <div className="chat">
      <ChatHeader channelName={channelName} />

      <div className="chat__messages">
        {loading ? (
          <div style={{ padding: "20px", color: "var(--light-grey-color)" }}>
            Loading messages...
          </div>
        ) : messages.length === 0 ? (
          <div style={{ padding: "20px", color: "var(--light-grey-color)" }}>
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((message) => (
            <Message
              key={message.id}
              message={message.message}
              username={message.username}
              timestamp={message.createdAt}
              avatar={null} // You can add avatar logic later
            />
          ))
        )}
      </div>

      <div className="chat__input">
        <Icons.AddCircle className="chat__input-icon" />
        <form onSubmit={sendMessage} className="chat__inputForm">
          <input
            disabled={!channelId || sendingMessage}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              channelId
                ? `Message #${channelName}`
                : "Select a channel to start messaging"
            }
          />
          <button
            className="chat__inputForm-button"
            type="submit"
            disabled={!channelId || sendingMessage || !input.trim()}
          >
            {sendingMessage ? "Sending..." : "Send"}
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
