import React from "react";
import { useState, useEffect, useCallback } from "react";
import "../styles/Sidebar.css";
import Icons, { Avatar } from "../app/icons/Icon";
import SidebarChannel from "../app/components/sidebarChannel/SidebarChannel";
import { useSelector, useDispatch } from "react-redux";
import { selectUser } from "../app/features/userSlice";
import {
  selectServers,
  selectCurrentServer,
  setCurrentServer,
  updateServerInList,
} from "../app/features/appSlice";
import apiService from "../app/services/apiServices";
import { signOut } from "../app/features/userSlice";
import AddChannelModal from "../app/components/addChannel/AddChannel";

function Sidebar() {
  const user = useSelector(selectUser);
  const servers = useSelector(selectServers);
  const currentServer = useSelector(selectCurrentServer);
  const [loadingServer, setLoadingServer] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch();

  // Current server variables
  const serverName = currentServer?.name || "No Server";
  const serverChannels = currentServer?.channels || [];

  // Function to fetch a specific server by ID
  const fetchServerById = useCallback(
    async (serverId) => {
      try {
        setLoadingServer(true);

        // Add validation before making API call
        if (!serverId || typeof serverId !== "string") {
          console.error("Invalid server ID:", serverId);
          return;
        }

        console.log("Fetching server details for:", serverId);
        console.log("Server ID type:", typeof serverId);
        console.log("Server ID length:", serverId.length);

        const serverData = await apiService.getServerById(serverId);
        console.log("Server data received:", serverData);

        // Set as current server
        dispatch(setCurrentServer(serverData));

        // Update the server in the servers list with full data (optional)
        dispatch(updateServerInList({ ...serverData, isLoaded: true }));
      } catch (error) {
        console.error("Error fetching server:", error);
        // Add more detailed error logging
        console.error("Failed server ID:", serverId);
        console.error("Error details:", error.message);
      } finally {
        setLoadingServer(false);
      }
    },
    [dispatch]
  );

  // Handle server selection
  const handleServerSelect = useCallback(
    async (serverId) => {
      console.log("Server selected:", serverId);
      console.log("Server ID received type:", typeof serverId);

      // Validate serverId
      if (!serverId) {
        console.error("No server ID provided");
        return;
      }

      // Don't refetch if this server is already selected
      if (currentServer?._id === serverId) {
        console.log("Server already selected");
        return;
      }

      // Fetch the server data
      console.log("Fetching server data from API");
      await fetchServerById(serverId);
    },
    [currentServer?._id, fetchServerById]
  );

  // Auto-select first server when servers are loaded and no current server is set
  useEffect(() => {
    if (servers.length > 0 && !currentServer) {
      // Use _id instead of id, and check if servers array has the correct structure
      const firstServer = servers[0];
      const firstServerId = firstServer._id || firstServer.id;

      console.log("Available servers:", servers);
      console.log("First server object:", firstServer);
      console.log("Auto-selecting first server:", firstServerId);

      if (firstServerId) {
        handleServerSelect(firstServerId);
      } else {
        console.error("No valid server ID found in first server:", firstServer);
      }
    }
  }, [servers, currentServer, handleServerSelect]);

  const handleLogout = async () => {
    try {
      await apiService.logout();
      dispatch(signOut());
      console.log("Logout successful");
    } catch (error) {
      console.error("Logout error:", error);
      dispatch(signOut());
    }
  };

  const handleAddChannel = () => {
    setIsModalOpen(true);
  };

  // This function gets called when a channel is successfully created
  const handleChannelCreated = (newChannel) => {
    // Update current server with new channel
    const updatedServer = {
      ...currentServer,
      channels: [...currentServer.channels, newChannel],
    };

    // Update both current server and the server in the servers list
    dispatch(setCurrentServer(updatedServer));
    dispatch(updateServerInList(updatedServer));

    console.log("Channel added to sidebar:", newChannel);
  };

  // Show loading if no user
  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="sidebar">
      {/* Server List */}
      <div className="sidebar_servers">
        <div className="sidebar_serversList">
          {servers.length === 0 ? (
            <div className="sidebar_noServers">No servers</div>
          ) : (
            servers.map((serverInfo) => {
              const serverId = serverInfo._id || serverInfo.id;
              const isActive = currentServer?._id === serverId;

              return (
                <div
                  key={serverId}
                  className={`sidebar_server ${isActive ? "active" : ""}`}
                  onClick={() => handleServerSelect(serverId)}
                  title={serverInfo.name}
                >
                  <span>{serverInfo.name.charAt(0).toUpperCase()}</span>
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="sidebar_top">
        <p>{loadingServer ? "Loading..." : serverName}</p>
        <Icons.ExpandMore />
      </div>

      <div className="sidebar_channels">
        <div className="sidebar_channelsHeader">
          <div className="sidebar-header">
            <Icons.ExpandMore />
            <p>Text Channels</p>
          </div>
          <Icons.Add
            className="sidebar_addChannel"
            onClick={handleAddChannel}
          />
        </div>

        <div className="sidebar_channelsList">
          {serverChannels.map((channel) => (
            <SidebarChannel
              key={channel._id}
              channelId={channel._id}
              channelName={channel.name}
              channelType={channel.type}
              channelDescription={channel.description}
            />
          ))}
        </div>
      </div>

      <div className="sidebar_voice">
        <Icons.Wifi className="sidebar_voiceIcon" fontSize="large" />
        <div className="sidebar_voiceInfo">
          <p className="sidebar_conection">Voice Connected</p>
          <p className="sidebar_stream">Stream</p>
        </div>

        <div className="sidebar_voiceIcons">
          <Icons.Info className="sidebar_voice-icon" />
          <Icons.Call className="sidebar_voice-icon" />
        </div>
      </div>

      <div className="sidebar_profile">
        <Avatar
          src={user.avatar}
          className="sidebar_profileAvatar"
          onClick={handleLogout}
        />
        <div className="sidebar_profileInfo">
          <p className="sidebar_profileName">
            {user.username || "Unknown User"}
          </p>
          <p className="sidebar_profileID">
            {user.id ? user.id.substring(0, 5) : "N/A"}
          </p>
        </div>

        <div className="sidebar_profileIcons">
          <Icons.Mic className="sidebar_profile-icon" />
          <Icons.Headset className="sidebar_profile-icon" />
          <Icons.Settings className="sidebar_profile-icon" />
        </div>
      </div>

      {/* Add Channel Modal */}
      <AddChannelModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        serverId={currentServer?._id}
        onChannelCreated={handleChannelCreated}
      />
    </div>
  );
}

export default Sidebar;
