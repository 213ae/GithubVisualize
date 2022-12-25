import React, { useState, useEffect } from 'react'
import { Column } from '@ant-design/plots';
import { Select } from 'antd'
import { CaretDownOutlined } from '@ant-design/icons';
import axios from 'axios';
import './index.scss'
export default function ContributorRankings({ id }) {
    const [selected, setSelected] = useState('activities');
    const [button, setButton] = useState(0);
    const [data, setData] = useState([]);
    const timeSelectConfig = {
        suffixIcon: <CaretDownOutlined />,
        defaultValue: "activities",
        className: 'activity-select',
        popupClassName: 'activity-dropdown',
        onChange: val => setSelected(val),
        options: [
            { value: 'activities', label: 'All Activities' },
            { value: 'code', label: 'Push and Commits' },
            { value: 'code-pr', label: 'PR Contribution' },
            { value: 'issue', label: 'Issue Open' },
            { value: 'issue-comment', label: 'Issue Comment' },
            { value: 'issue-close', label: 'Issue Close' },
            { value: 'code-review-comments', label: 'Code Review Comments' },
            { value: 'code-review-prs', label: 'Code Review PRs' },
            { value: 'code-review-submits', label: 'Code Review Submits' },
        ]
    }
    useEffect(() => {
        setData([])
        if (id) {
            axios.get(`/api/q/analyze-people-${selected}-contribution-rank?repoId=${id}&excludeBots=false`)
                .then(res => setData(res.data.data))
        }
    }, [id, selected])
    const avatar = user => <a href={`https://github.com/${user}`}> <img src={`https://github.com/${user}.png`} alt='' onError={e => e.target.src = '/default.png'} /></a >
    const statics = item => {
        if (button === 0) {
            return `${item.last_month_events} (` + (item.last_month_events >= item.last_2nd_month_events ? '+' : '') + `${item.last_month_events - item.last_2nd_month_events})`;
        } else {
            return Number(item.proportion * 100).toFixed(1) + '%';
        }
    }
    const stripLen = val => {
        const maxVal = data[0].last_month_events;
        return 1100 * val / maxVal;
    }
    return (
        <div className='contributor-rankings'>
            <p>Check the activity of contributors in the repository last month here, including push and commit events, issue open/close/comment events, code review comments/PRs/submits.</p>

            <Select {...timeSelectConfig} />
            <div className='two-button'>
                <div className={"total-evts " + (button === 0 ? 'active' : '')} onClick={() => setButton(0)}># TOTAL EVENTS</div>
                <div className={"percentage " + (button === 1 ? 'active' : '')} onClick={() => setButton(1)}>% PERCENTAGE</div>
            </div>


            <div className="contributor-list">
                {
                    data.map((item, idx) =>
                        <div key={idx} className='list-item'>
                            <span className='user-pic'>{avatar(item.actor_login)}</span>
                            <span className='user-name'>{item.actor_login}</span>
                            <span className='strip' style={{ width: stripLen(item.last_month_events) }}></span>
                            <span className='statics'>{statics(item)}</span>
                        </div>)
                }
            </div>
        </div>
    )
}
