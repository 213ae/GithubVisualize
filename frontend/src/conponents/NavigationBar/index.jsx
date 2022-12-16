import React from 'react'
import { useNavigate, useLocation, NavLink, Link } from 'react-router-dom'
import SearchBar from '../../conponents/SearchBar'
import { Button } from 'antd'
import './index.scss'

export default function NavigationBar(props) {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const handleJump = (target) => {
        return evt => {
            if (pathname === target) evt.preventDefault();
        }
    }
    return (
        <nav className={'navigate-bar'}>
            <Link className='nav-link' to='/index'><span className='logo'></span></Link>
            <NavLink className='nav-link' to='/explore'>Explore</NavLink>
            <NavLink className='nav-link' to='/usercenter'>User Center</NavLink>
            <NavLink className='nav-link' to='/readme'>Readme</NavLink>
            <NavLink className='nav-link' to='/aboutus'>About Us</NavLink>
        </nav>

    )
}
