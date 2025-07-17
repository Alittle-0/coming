import React from 'react'
import './SidebarChannel.css'

function SidebarChannel({id, channel}) {
  return (
    <div className='sidebarChannel'>
      <p className="sidebarChannel_name">
        <span className="sidebarChannel_hash">#</span>Test channel</p>
    </div>
  )
}

export default SidebarChannel
