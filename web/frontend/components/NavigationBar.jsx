import React from 'react'
import { NavLink } from 'react-router-dom'
import { Icon } from '@shopify/polaris';
export function NavigationBar() {
  return (
    <div className='navmenu-section'>
        <ul>
        <li title='Home'>
          <NavLink to="/" className={({isActive}) => isActive ? "active": ""}> 
            Home
          </NavLink>
        </li>
        <li title='Menu'><NavLink to="/menu" className={({isActive}) => isActive ? "active": ""}> Orders</NavLink></li>
        {/* <li title='Search'><NavLink to="/search" className={({isActive}) => isActive ? "active": ""}> <SearchIcon /> </NavLink></li>
        <li title='Chat'><NavLink to="chat" className={({isActive}) => isActive ? "active": ""}> <ChatIcon /> </NavLink></li>
        <li title='About us'><NavLink to="/about" className={({isActive}) => isActive ? "active": ""}> <InfoIcon /> </NavLink></li>
        <li title='Graphs'><NavLink to="/graph" className={({isActive}) => isActive ? "active": ""}> <BarChartIcon /> </NavLink></li>
        <li title='Statistics'><NavLink to="/statistics" className={({isActive}) => isActive ? "active": ""}> <TrendingUpIcon /> </NavLink></li>
        <li title='Users'><NavLink to="/user" className={({isActive}) => isActive ? "active": ""}> <GroupIcon /> </NavLink></li>*/}
       {/* <li title='Order'><NavLink to="/order" className={({isActive}) => isActive ? "active": ""}> <SettingsIcon /> </NavLink></li>  */}
      </ul>
    </div>
  )
}