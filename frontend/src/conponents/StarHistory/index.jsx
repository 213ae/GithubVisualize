import React, { useEffect, useState } from 'react'
import { Line } from '@ant-design/plots';
import axios from 'axios'

let prevId = undefined;

export default function StarHistory({ repo_name, id }) {
    const [starHistoryConfig, setStarHistoryConfig] = useState({ data: [] })
    const initConf = {
        xField: 'event_month',
        yField: 'total',
        seriesField: 'repo',
        meta: {
            event_month: {
                formatter: val => val.replace('-01', '')
            },
            total: {
                formatter: val => val / 1000 + 'k',
                alias: repo_name
            }
        },
        theme: 'dark',
        title: 'History Stars',
        color: ['#dd6b66', '#759aa0'],
        smooth: true
    };
    useEffect(() => {
        if (id && prevId !== id) {
            prevId = id;
            axios.get(`/api/q/analyze-stars-history?repoId=${id}`)
                .then(res => {
                    let data = res.data.data;
                    for (let item of data) item.repo = repo_name;
                    setStarHistoryConfig({ data, ...initConf })
                })
                .catch(err => console.log(err))
        }
    })
    return (
        <Line {...starHistoryConfig} />
    )
}
