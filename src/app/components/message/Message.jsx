import React from "react";
import "./Message.css";
import { Avatar } from "../../icons/Icon";

function Message({ message, username, timestamp, avatar }) {
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "";
    
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <div className="message">
      <Avatar src={avatar} />
      <div className="message__info">
        <p className="timestamp">
          {username || "Unknown User"}
          <span className="message__info-timestamp">
            {formatTimestamp(timestamp)}
          </span>
        </p>
        <p>{message || "No message content"}</p>
      </div>
    </div>
  );
}

export default Message;
