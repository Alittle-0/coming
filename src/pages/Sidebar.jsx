import React from 'react'
import '../styles/Sidebar.css'
import Icons, { Avatar } from '../app/icons/Icon';
import SidebarChannel from '../app/components/sidebarChannel/SidebarChannel';
import { useSelector } from 'react-redux';
import { selectUser } from '../app/features/userSlice';
import apiService from "../app/services/apiServices";

function Sidebar() {

  const user = useSelector(selectUser);

  const handleLogout = async () => {
    try {
      await apiService.logout();
      console.log("Logout successful");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className='sidebar'>
      <div className='sidebar_top'>
        <p>Nothing</p>
      <Icons.ExpandMore />
      </div>

      <div className="sidebar_channels">
        <div className="sidebar_channelsHeader">
          <div className="sidebar-header">
            <Icons.ExpandMore />
            <p>Channels</p>
          </div>
        
          <Icons.Add className="sidebar_addChannel" />
        </div>

        <div className="sidebar_channelsList">
          <SidebarChannel />
          <SidebarChannel />
          <SidebarChannel />
          <SidebarChannel />
        </div>
      </div>

      <div className="sidebar_voice">
        <Icons.Wifi className='sidebar_voiceIcon' fontSize='large' />
        <div className="sidebar_voiceInfo">
          <p className="sidebar_conection"> Voice Connected</p>
          <p className="sidebar_stream" >Stream</p>
        </div>

        <div className="sidebar_voiceIcons">
          <Icons.Info className='sidebar_voice-icon' />
          <Icons.Call className='sidebar_voice-icon' />
        </div>
      </div>

      <div className="sidebar_profile">
        <Avatar src={user.photo} className='sidebar_profileAvatar' onClick={handleLogout} />
        <div className="sidebar_profileInfo">
          <p className="sidebar_profileName">{user.username}</p>
          <p className="sidebar_profileID">{user.id.substring(0,5)}</p>
        </div>

        <div className="sidebar_profileIcons">
          <Icons.Mic className="sidebar_profile-icon" />
          <Icons.Headset className="sidebar_profile-icon" />
          <Icons.Settings className="sidebar_profile-icon"/>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
