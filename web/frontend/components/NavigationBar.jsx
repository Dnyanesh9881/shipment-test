import React from 'react'
import { NavLink } from 'react-router-dom'
import HomeIcon from '@mui/icons-material/Home';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import ChatIcon from '@mui/icons-material/Chat';
import InfoIcon from '@mui/icons-material/Info';
import BarChartIcon from '@mui/icons-material/BarChart';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import GroupIcon from '@mui/icons-material/Group';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
export function NavigationBar() {
  return (
    <div className='navmenu-section'>
        <ul>
        <li title='Home'>
          <NavLink to="/" className={({isActive}) => isActive ? "active": ""}> 
            <HomeIcon /> 
          </NavLink>
        </li>
        <li title='Menu'><NavLink to="/menu" className={({isActive}) => isActive ? "active": ""}> <ShoppingCartIcon /> </NavLink></li>
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