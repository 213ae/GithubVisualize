import React, { useState, useEffect } from 'react'
import { DualAxes } from '@ant-design/plots';
import axios from 'axios';
import './index.scss'

export default function IssuesHistory({ id }) {
    const [data, setData] = useState([[], []]);
    useEffect(() => {
        if (id) {
            axios.get(`/api/q/analyze-issue-opened-and-closed?repoId=${id}`)
                .then(res => handleData(res.data.data))
                .then(data => setData(data))
        }
    }, [id])
    const handleData = raw => {
        const group = [];
        const line = [];
        let opendTotal = 0;
        let closedTotal = 0;
        for (let item of raw) {
            opendTotal += item.opened;
            closedTotal += item.closed;
            group.push({ type: 'New Closed', value: item.closed, event_month: item.event_month.replace('-01', '') })
            group.push({ type: 'New Opened', value: item.opened, event_month: item.event_month.replace('-01', '') })
            line.push({ type: 'Total Closed', total: closedTotal, event_month: item.event_month.replace('-01', '') })
            line.push({ type: 'Total Opened', total: opendTotal, event_month: item.event_month.replace('-01', '') })
        }
        return [group, line];
    }
    const config = {
        data,
        xField: 'event_month',
        yField: ['value', 'total'],
        geometryOptions: [
            {
                geometry: 'column',
                isGroup: true,
                seriesField: 'type',
                color: ['#759aa0', '#dd6a65'],
            },
            {
                geometry: 'line',
                seriesField: 'type',
                color: ['#8dc1aa', '#e69c87'],
            },
        ],
        xAxis: {
            tickCount: 7,
        },
        theme: 'dark',
    };
    return (
        <div className='issues-history'>
            <h3>Issue History</h3>
            <p>Monthly opened/closed issues and the historical totals.</p>
            <div className='graph'>
                <DualAxes {...config} />
            </div>
        </div>
    )
}
