import React, { useState, useEffect } from 'react'
import { DualAxes } from '@ant-design/plots';
import { orderBy, max } from 'lodash'
import axios from 'axios';
import './index.scss'

const yMaxList = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 60, 70, 80, 90, 100,
    120, 150, 200, 250, 300, 350, 400, 450, 500, 600, 700, 800, 900, 1000,
    1200, 1500, 2000, 2500, 3000, 3500, 4000, 4500, 5000, 6000, 7000, 8000, 9000, 10000];

let yMaxIdx = [0, 0];
export default function IssuesHistory(props) {
    const isCompareMode = props[0] !== undefined && props[1] !== undefined;
    const repos = isCompareMode ? props : [props, {}];

    const [datas, setDatas] = useState([[[], []], [[], []]])

    useEffect(() => {
        Promise.all([fetchData(0), fetchData(1)])
            .then(datas => handleData(datas))
            .then(datas => setDatas(datas))
            .catch(err => console.log(err))
    }, [props])

    const fetchData = idx => {
        if (repos[idx].id) {
            return axios.get(`/api/q/analyze-issue-opened-and-closed?repoId=${repos[idx].id}`)
                .then(res => res.data.data);
        } else {
            return [];
        }
    }

    const handleData = datas => {
        const groups = [[], []];
        const lines = [[], []];
        const monthSet = [[], []];
        const diff = [[], []];
        let maxVal = [0, 0];

        for (let i = 0; i < 2; i++) {
            for (let item of datas[i]) {
                monthSet[i].push(item.event_month)
            }
        }
        diff[0] = monthSet[1].filter(item => !monthSet[0].includes(item));
        diff[1] = monthSet[0].filter(item => !monthSet[1].includes(item));

        for (let i = 0; i < 2; i++) {
            for (let item of diff[i]) {
                datas[i].push({ event_month: item, closed: 0, opened: 0 });
            }
            datas[i] = orderBy(datas[i], ['event_month'])
        }

        for (let i = 0; i < 2; i++) {
            let opendTotal = 0;
            let closedTotal = 0;
            for (let item of datas[i]) {
                maxVal[0] = max([maxVal[0], item.closed, item.opened]);
                opendTotal += item.opened;
                closedTotal += item.closed;
                if (closedTotal > 0) {
                    groups[i].push({ type: 'New Closed', value: item.closed, event_month: item.event_month.replace('-01', '') })
                    lines[i].push({ type: 'Total Closed', total: closedTotal, event_month: item.event_month.replace('-01', '') })
                }
                else {
                    groups[i].push({ type: 'New Closed', event_month: item.event_month.replace('-01', '') })
                    lines[i].push({ type: 'Total Closed', event_month: item.event_month.replace('-01', '') })
                }
                if (opendTotal > 0) {
                    groups[i].push({ type: 'New Opened', value: item.opened, event_month: item.event_month.replace('-01', '') })
                    lines[i].push({ type: 'Total Opened', total: opendTotal, event_month: item.event_month.replace('-01', '') })
                }
                else {
                    groups[i].push({ type: 'New Opened', event_month: item.event_month.replace('-01', '') })
                    lines[i].push({ type: 'Total Opened', event_month: item.event_month.replace('-01', '') })
                }
            }
            maxVal[1] = max([maxVal[1], opendTotal, closedTotal])
        }

        yMaxIdx = [0, 0];
        while (maxVal[0] > yMaxList[yMaxIdx[0]]) yMaxIdx[0]++;
        while (maxVal[1] > 10 * yMaxList[yMaxIdx[1]]) yMaxIdx[1]++;



        const handled = [[groups[0], lines[0]], [groups[1], lines[1]]]
        return handled;
    }

    const config = {
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
        yAxis: {
            value: {
                max: yMaxList[yMaxIdx[0]]
            },
            total: {
                max: 10 * yMaxList[yMaxIdx[1]]
            }
        },
        theme: 'dark',
    };

    return (
        <div className={'issue-history ' + (isCompareMode ? 'compare-mode' : '')}>
            <h3>Issue History</h3>
            <p>Monthly opened/closed issues and the historical totals.</p>
            <div className='container'>
                <div className='graph'><DualAxes {...{ data: datas[0], ...config }} /></div>
                {isCompareMode ? <div className='graph'><DualAxes {...{ data: datas[1], ...config }} /></div> : ''}
            </div>
        </div>
    )
}
