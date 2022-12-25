import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react'
import axios from 'axios';
import { CirclePacking } from '@ant-design/plots';
import { LoadingOutlined } from '@ant-design/icons'
import './index.scss'
const linkMap = ['stars', 'issue-creators', 'pull-request-creators'];
const keyMap = ['stargazers', 'issue_creators', 'code_contributors']
const emptyArray = new Array(10).fill(undefined);
export default function CompaniesInfo(props) {
    const isCompareMode = props[0] !== undefined && props[1] !== undefined;
    const repos = isCompareMode ? props : [props, {}];

    const [selected, setSelected] = useState(0);
    const [datas, setDatas] = useState([[], []]);

    useEffect(() => {
        setDatas([[], []])
        Promise.all([fetchData(0), fetchData(1)])
            .then(datas => setDatas([datas[0], datas[1]]))
            .catch(err => console.log(err))
    }, [props, selected])

    const fetchData = idx => {
        if (repos[idx].id) {
            return axios.get(`/api/q/analyze-${linkMap[selected]}-company?repoId=${repos[idx].id}&limit=50`)
                .then(res => handleRawData(res.data.data, idx))
        } else {
            return []
        }
    }

    const handleRawData = (raw, idx) => {
        const handled = [];
        for (let item of raw) {
            handled.push({
                name: item.company_name + ' - ' + repos[idx].repo_name,
                value: item[keyMap[selected]],
                proportion: item.proportion,
            })
        }
        return handled;
    }

    const config = {
        autoFit: true,
        padding: 0,
        data: { name: 'total', children: [...datas[0], ...datas[1]] },
        sizeField: 'r',
        pointStyle: ({ name }) => {
            if (name === 'total') return { fill: '#141414' }
            if (name.split(' - ')[1] === repos[0].repo_name) return { fill: '#dd6a65' }
            else return { fill: '#759aa0' }
        },
        theme: 'dark',
        label: {
            formatter: ({ name }) => {
                return name !== 'total' ? name.split(' - ')[0] : '';
            },
            offsetY: 12,
            style: {
                fontSize: 12,
                textAlign: 'center',
                fill: 'rgba(0,0,0,0.65)',
            },
        },
        legend: false,
    };
    return (
        <div className='companies-info'>
            <h3>Companies</h3>
            <p>Company information about Stargazers, Issue creators, and Pull Request creators.</p>
            <div className="dashboard-nav">
                <div className={'button ' + (selected === 0 ? 'active' : '')} onClick={() => setSelected(0)}>Stargazers</div>
                <div className={'button ' + (selected === 1 ? 'active' : '')} onClick={() => setSelected(1)}>Issue Creators</div>
                <div className={'button ' + (selected === 2 ? 'active' : '')} onClick={() => setSelected(2)}>Pull Requests Creators</div>
            </div>
            <div className={'dashboard ' + (isCompareMode ? 'compare-mode' : '')}>
                <div className="left-gragh">
                    <CirclePacking {...config} />
                </div>
                <div className="right-list">
                    <div className="list-title">Top 10 Companies</div>
                    <div className="list fl">
                        {isCompareMode ? <div className='repo-name'><span className='dot'></span><span>{repos[0].repo_name}</span></div> : ''}
                        {
                            datas[0].length ?
                                datas[0].map((val, idx) => {
                                    if (idx < 10) {
                                        return (
                                            <div key={idx} className="list-item">
                                                <span className='fl'>{val.name.split(' - ')[0]}</span>
                                                <span className='fr'>{Number(val.proportion * 100).toFixed(1)}%</span>
                                            </div>
                                        )
                                    }
                                }) :
                                emptyArray.map((_, idx) => {
                                    return (
                                        <div key={idx} className="list-item">
                                            <span className='fl'><LoadingOutlined className='yellow' /></span>
                                            <span className='fr'><LoadingOutlined className='yellow' /></span>
                                        </div>
                                    )
                                })
                        }
                    </div>
                    <div className="list fr">
                        {isCompareMode ?
                            <>
                                <div className='repo-name'><span className='dot'></span><span>{repos[1].repo_name}</span></div>
                                {
                                    datas[1].length ?
                                        datas[1].map((val, idx) => {
                                            if (idx < 10) {
                                                return (
                                                    <div key={idx} className="list-item">
                                                        <span className='fl'>{val.name.split(' - ')[0]}</span>
                                                        <span className='fr'>{Number(val.proportion * 100).toFixed(1)}%</span>
                                                    </div>
                                                )
                                            }
                                        }) :
                                        emptyArray.map((_, idx) => {
                                            return (
                                                <div key={idx} className="list-item">
                                                    <span className='fl'><LoadingOutlined className='yellow' /></span>
                                                    <span className='fr'><LoadingOutlined className='yellow' /></span>
                                                </div>
                                            )
                                        })}
                            </>
                            : ''
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}
