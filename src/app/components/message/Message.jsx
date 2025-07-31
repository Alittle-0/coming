import React from "react";
import "./Message.css";
import { Avatar } from "../../icons/Icon";

function Message({ message, user, timestamp }) {
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "";

    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();

    if (isToday) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else {
      return date.toLocaleDateString([], {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  };

  return (
    <div className="message">
      {/* Use user avatar if available, otherwise default Avatar */}
      {user?.avatar ? (
        <img
          src={user.avatar}
          alt={user.username}
          className="message__avatar"
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            objectFit: "cover",
          }}
        />
      ) : (
        <Avatar />
      )}

      <div className="message__info">
        <p className="timestamp">
          {user?.username || "Unknown User"}
          <span className="message__info-timestamp">
            {formatTimestamp(timestamp)}
          </span>
        </p>
        <p>{message}</p>
      </div>
    </div>
  );
}

export default Message;
