import React from 'react'
import TrendingRepos from '../../../conponents/TrendingRepos'
import './index.scss'

export default function HistoryPage() {
    return (
        <div className='history-page'>
            <div className='title'>Browse History</div>
            <TrendingRepos />
        </div>
    )
}
