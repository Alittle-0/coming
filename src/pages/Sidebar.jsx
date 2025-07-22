import React from 'react'
import '../styles/Sidebar.css'
import Icons, { Avatar } from '../app/icons/Icon';
import SidebarChannel from '../app/components/sidebarChannel/SidebarChannel';
import { useDispatch } from 'react-redux';
import { signOut } from '../app/features/userSlice';
import apiService from "../app/services/apiServices";

function Sidebar() {
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await apiService.logout();
      dispatch(signOut());
      console.log("Logout successful");
    } catch (error) {
      console.error("Logout error:", error);
      // Even if API call fails, clear local state
      localStorage.removeItem('accessToken');
      dispatch(signOut());
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
        <Avatar className='sidebar_profileAvatar' />
        <div className="sidebar_profileInfo">
          <p className="sidebar_profileName">Hung</p>
          <p className="sidebar_profileID">1233456789</p>
        </div>

        <div className="sidebar_profileIcons">
          <Icons.Mic className="sidebar_profile-icon" />
          <Icons.Headset className="sidebar_profile-icon" />
          <Icons.Settings className="sidebar_profile-icon" onClick={handleLogout}/>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
