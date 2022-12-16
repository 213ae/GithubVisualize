import React from 'react'
import SearchBar from '../../conponents/SearchBar'
import TrendingRepos from '../../conponents/TrendingRepos'
import './index.scss'

export default function HomePage() {
    return (
        <div className='home-page'>
            <SearchBar />
            <TrendingRepos />
        </div>
    )
}
