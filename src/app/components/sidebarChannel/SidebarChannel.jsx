import React from "react";
import "./SidebarChannel.css";
import { useDispatch } from "react-redux";
import { setChannelInfo } from "../../features/serverSlice";

function SidebarChannel({
  channelId,
  channelName,
  channelType,
  channelDescription,
}) {
  const dispatch = useDispatch();

  return (
    <div
      className="sidebarChannel"
      onClick={() => dispatch(setChannelInfo({
        channelId: channelId,
        channelName: channelName,
        channelType: channelType,
        channelDescription: channelDescription,
      }))}
    >
      <p className="sidebarChannel_name">
        <span className="sidebarChannel_hash">
          {channelType === "voice" ? "!" : "#"}
        </span>
        {channelName}
      </p>

      {/* Tooltip that appears on hover */}
      <div className="sidebarChannel_tooltip">
        <div className="tooltip_content">
          <h4>{channelName}</h4>
          <p>
            <strong>Type:</strong> {channelType}
          </p>
          <p>
            <strong>ID:</strong> {channelId}
          </p>
          {channelDescription && (
            <p>
              <strong>Description:</strong> {channelDescription}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default SidebarChannel;
