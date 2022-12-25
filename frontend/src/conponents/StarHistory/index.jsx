import React, { useEffect, useState } from 'react'
import { Line } from '@ant-design/plots';
import axios from 'axios'

export default function StarHistory(props) {
    const isCompareMode = props[0] !== undefined && props[1] !== undefined;
    const repos = isCompareMode ? props : [props, {}];

    const [datas, setDatas] = useState([[], []])

    const starHistoryConfig = {
        xField: 'event_month',
        yField: 'total',
        seriesField: 'repo',
        data: datas[0].length > datas[1].length ? [...datas[0], ...datas[1]] : [...datas[1], ...datas[0]],
        meta: {
            event_month: {
                formatter: val => val.replace('-01', '')
            }
        },
        xAxis: {
            tickCount: 7,
        },
        theme: 'dark',
        title: 'History Stars',
        color: ['#dd6b66', '#759aa0'],
        smooth: true
    };

    useEffect(() => {
        Promise.all([fetchData(0), fetchData(1)])
            .then(datas => setDatas(datas))
            .catch(err => console.log(err))
    }, [props])

    const fetchData = idx => {
        if (repos[idx].id) {
            return axios.get(`/api/q/analyze-stars-history?repoId=${repos[idx].id}`)
                .then(res => {
                    let data = res.data.data;
                    for (let item of data) item.repo = repos[idx].repo_name;
                    return data;
                });
        } else {
            return [];
        }
    }

    return (
        <div className='star-history'>
            <h3 className='top'>Star History</h3>
            <div className='graph'><Line {...starHistoryConfig} /></div>
        </div>
    )
}
