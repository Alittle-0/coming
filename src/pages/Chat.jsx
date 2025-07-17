import React from "react";
import "../styles/Chat.css";
import ChatHeader from "../app/components/chatHeader/ChatHeader";
import Message from "../app/components/message/Message";
import Icons from "../app/icons/Icon";

function Chat() {
  return (
    <div className="chat">
      <ChatHeader />

      <div className="chat__messages">
        <Message />
        <Message />
        <Message />
      </div>

      <div className="chat__input">
        <Icons.AddCircle className="chat__input-icon" />
        <form action="" className="chat__inputForm">
          <input name="" id="" placeholder="Message" />
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
