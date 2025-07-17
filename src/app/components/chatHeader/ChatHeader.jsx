import React from "react";
import "./ChatHeader.css";
import Icons from "../../icons/Icon";

function ChatHeader() {
  return (
    <div className="chatHeader">
      <div className="chatHeader__left">
        <p className="chatHeader__left-name">
          <span className="chatHeader__left-hash">#</span>
          Channel name
        </p>
      </div>

      <div className="chatHeader__right">
        <Icons.Notifications className="chatHeader__right-icon" />
        <Icons.EditLocation className="chatHeader__right-icon" />
        <Icons.People className="chatHeader__right-icon" />
      <div className="chatHeader__search">
        <input type="text" name="" id="" placeholder="Search" className="chatHeader__searchbar"/>
        <Icons.Search className="chatHeader__search-icon"/>
      </div>

      <Icons.Help className="chatHeader__right-icon" />
      </div>
    </div>
  );
}

export default ChatHeader;
