import React, { useState } from "react";
import "../styles/Chat.css";
import ChatHeader from "../app/components/chatHeader/ChatHeader";
import Message from "../app/components/message/Message";
import Icons from "../app/icons/Icon";
import { useSelector } from "react-redux";
import { selectUser } from "../app/features/userSlice";
import { selectChannelId, selectChannelName } from "../app/features/serverSlice";

function Chat() {

  const user = useSelector(selectUser);
  const channelId = useSelector(selectChannelId);
  const channelName = useSelector(selectChannelName);
  const [input, setInput] = React.useState("");
  const [messages, setMessages] = useState([]);

  useEffect(()=> {
    
  })

  return (
    <div className="chat">
      <ChatHeader channelName = {channelName} />

      <div className="chat__messages">
        {messages.map((messages) => (
          <Message/>
        ))}
      </div>

      <div className="chat__input">
        <Icons.AddCircle className="chat__input-icon" />
        <form action="" className="chat__inputForm">
          <input value={input} onChange={(e) => setInput(e.target.value)} placeholder={`#${channelName}`} />
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
