import React from 'react'
import { Outlet, NavLink } from 'react-router-dom'
import './index.scss'

export default function UserCenterPage() {
    return (
        <div className='user-center-page'>
            <div className="left-nav">
                <NavLink className='sec-nav' to='bookmarks'>Bookmarks</NavLink>
                <NavLink className='sec-nav' to='mystarred'>Github Stars</NavLink>
                <NavLink className='sec-nav' to='myrepos'> Github Repos</NavLink>
            </div>
            <div className="right-content">
                <Outlet />
            </div>
        </div>
    )
}
