import React, { useState, useEffect } from 'react'
import { Column } from '@ant-design/plots';
import { orderBy, max } from 'lodash'
import axios from 'axios';
import './index.scss'

const yMaxList = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 60, 70, 80, 90, 100,
    120, 150, 200, 250, 300, 350, 400, 450, 500, 600, 700, 800, 900, 1000,
    1200, 1500, 2000, 2500, 3000, 3500, 4000, 4500, 5000, 6000, 7000, 8000, 9000, 10000];
let yMaxIdx = 0;
export default function CommitsHistory(props) {
    const isCompareMode = props[0] !== undefined && props[1] !== undefined;
    const repos = isCompareMode ? props : [props, {}];

    const [datas, setDatas] = useState([[], []]);

    useEffect(() => {
        Promise.all([fetchData(0), fetchData(1)])
            .then(datas => handleDatas(datas))
            .then(datas => setDatas(datas))
            .catch(err => console.log(err))
    }, [props])

    const fetchData = idx => {
        if (repos[idx].id) {
            return axios.get(`/api/q/analyze-pushes-and-commits-per-month?repoId=${repos[idx].id}`)
                .then(res => res.data.data)
        } else {
            return [];
        }
    }

    const handleDatas = datas => {
        const handled = [[], []];
        const monthSet = [[], []];
        const diff = [[], []];
        let maxVal = 0;

        for (let i = 0; i < 2; i++) {
            for (let item of datas[i]) {
                monthSet[i].push(item.event_month)
            }
        }

        diff[0] = monthSet[1].filter(item => !monthSet[0].includes(item));
        diff[1] = monthSet[0].filter(item => !monthSet[1].includes(item));

        for (let i = 0; i < 2; i++) {
            for (let item of diff[i]) {
                datas[i].push({ event_month: item});
            }
            datas[i] = orderBy(datas[i], ['event_month'])
        }

        for (let i = 0; i < 2; i++) {
            for (let item of datas[i]) {
                maxVal = max([maxVal, item.pushes, item.commits]);
                handled[i].push({ type: 'pushes', value: item.pushes, event_month: item.event_month.replace('-01', '') });
                handled[i].push({ type: 'commits', value: item.commits, event_month: item.event_month.replace('-01', '') });
            }
        }

        yMaxIdx = 0;
        while (maxVal > yMaxList[yMaxIdx]) yMaxIdx++;
        return handled;
    }

    const config = {
        isGroup: true,
        xField: 'event_month',
        yField: 'value',
        seriesField: 'type',
        theme: 'dark',
        xAxis: {
            tickCount: 7,
        },
        yAxis: { max: yMaxList[yMaxIdx] },
        color: ['#dd6a65', '#759aa0'],

    };

    return (
        <div className={'CommitsHistory ' + (isCompareMode ? 'compare-mode' : '')}>
            <h3>Commits & Pushes History</h3>
            <p>The trend of the total number of commits/pushes per months in a repository since it was created.</p>
            <div className='container'>
                <div className='graph'><Column {...{ data: datas[0], ...config }} /></div>
                {isCompareMode ? <div className='graph'><Column {...{ data: datas[1], ...config }} /></div> : ''}
            </div>
        </div>
    )

}
