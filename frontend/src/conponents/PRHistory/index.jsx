import React, { useState, useEffect } from 'react'
import { DualAxes } from '@ant-design/plots';
import axios from 'axios';
import './index.scss'

export default function PRHistory({ id }) {
    const [data, setData] = useState([[], []]);
    useEffect(() => {
        if (id) {
            axios.get(`/api/q/analyze-pull-requests-size-per-month?repoId=${id}`)
                .then(res => handleData(res.data.data))
                .then(data => setData(data))
        }
    }, [id])
    const handleData = raw => {
        const stack = [];
        const line = [];
        let total = 0;
        for (let item of raw) {
            total += item.all_size;
            stack.push({ type: 'xl', value: item.xl, event_month: item.event_month.replace('-01', '') })
            stack.push({ type: 'l', value: item.l, event_month: item.event_month.replace('-01', '') })
            stack.push({ type: 'm', value: item.m, event_month: item.event_month.replace('-01', '') })
            stack.push({ type: 's', value: item.s, event_month: item.event_month.replace('-01', '') })
            stack.push({ type: 'xs', value: item.xs, event_month: item.event_month.replace('-01', '') })
            line.push({ total, event_month: item.event_month.replace('-01', '') })
        }
        return [stack, line];
    }
    const config = {
        data,
        xField: 'event_month',
        yField: ['value', 'total'],
        geometryOptions: [
            {
                geometry: 'column',
                isStack: true,
                seriesField: 'type',
                color: ['#eb7d54', '#8dc1aa', '#e69c87', '#759aa0', '#dd6a65'],
            },
            {
                geometry: 'line',
                color: '#ffe895',
            },
        ],
        theme: 'dark',
        xAxis: {
            tickCount: 7,
        },

    };
    return (
        <div className='pr-history'>
            <h3>Pull Request History</h3>
            <p>We divide the size of Pull Request into six intervals, from xs to xxl (based on the changes of code lines). </p>
            <div className='graph'>
                <DualAxes {...config} />
            </div>
        </div>
    )
}
