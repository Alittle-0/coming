import React from "react";
import "./Message.css";
import Icons, { Avatar } from "../../icons/Icon";

function Message() {
  return (
    <div className="message">
      <Avatar />
      <div className="message__info">
        <p className="timestamp">
          vuidrvjkd
          <span className="message__info-timestamp">This is timestamp</span>
        </p>
        <p>this is message block</p>
      </div>
    </div>
  );
}

export default Message;
