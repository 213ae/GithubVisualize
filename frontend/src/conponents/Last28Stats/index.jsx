import React, { useEffect, useState } from 'react'
import { LoadingOutlined } from '@ant-design/icons'
import { Column, Line } from '@ant-design/plots';
import axios from 'axios';
import './index.scss'

const columConf = {
    xField: 'current_period_day',
    label: {
        position: 'middle',
        style: {
            fill: '#FFFFFF',
            opacity: 0,
        },
    },
    xAxis: {
        tickCount: 5,
        label: {
            autoHide: true,
            autoRotate: false,
        },
    },
    meta: {
        current_period_day_stars: {
            alias: 'Stars',
        },
        current_period_day: {
            formatter: val => val.split('-')[1] + '-' + val.split('-')[2]
        }
    },
    theme: 'dark',
    backgroundColor: '#18191a',
    maxColumnWidth: 10
}

const lineConf = {
    xField: 'date',
    yField: 'num',
    seriesField: 'category',
    xAxis: {
        tickCount: 5,
    },
    meta: {
        date: {
            formatter: val => val.split('-')[1] + '-' + val.split('-')[2]
        }
    },
    theme: 'dark',
    color: ['#63c16d', '#904dc9'],
    smooth: true
};

export default function Last28Stats({ id }) {
    const [days28stars, set28stars] = useState(undefined);
    const [starConfig, setStarConfig] = useState({ data: [] });

    const [days28prs, set28prs] = useState({ opened: undefined, merged: undefined });
    const [prConfig, setPrConfig] = useState({ data: [] });

    const [days28issues, set28issues] = useState({ opened: undefined, closed: undefined });
    const [issueConfig, setIssueConfig] = useState({ data: [] });

    const [days28commits, set28commits] = useState(undefined);
    const [commitConfig, setCommitConfig] = useState({ data: [] });

    const handleIssues = data => {
        const ret = [];
        for (let issue of data) {
            const date = issue.current_period_day.replace('T00:00:00.000Z', '');
            const opened = {
                num: issue.current_period_opened_day_issues,
                date,
                category: 'Opened'
            }
            const closed = {
                num: issue.current_period_closed_day_issues,
                date,
                category: 'Closed'
            }
            ret.push(opened, closed);
        }
        return ret;
    }

    const handlePRs = data => {
        const ret = [];
        for (let PR of data) {
            const date = PR.current_period_day.replace('T00:00:00.000Z', '');
            const opened = {
                num: PR.current_period_opened_day_prs,
                date,
                category: 'Opened'
            }
            const merged = {
                num: PR.current_period_merged_day_prs,
                date,
                category: 'Merged'
            }
            ret.push(opened, merged);
        }
        return ret;
    }

    useEffect(() => {
        set28stars(undefined);
        setStarConfig({ data: [] });
        set28prs({ opened: undefined, merged: undefined });
        setPrConfig({ data: [] });
        set28issues({ opened: undefined, closed: undefined });
        setIssueConfig({ data: [] });
        set28commits(undefined);
        setCommitConfig({ data: [] });
        if (id) {
            axios.get(`/api/q/analyze-recent-stars?repoId=${id}`)
                .then(res => {
                    const data = res.data.data.reverse();
                    set28stars(data[0].current_period_stars);
                    for (let obj of data) obj.current_period_day = obj.current_period_day.replace('T00:00:00.000Z', '')
                    setStarConfig({ data, color: '#f58a00', yField: 'current_period_day_stars', ...columConf })
                })
            axios.get(`/api/q/analyze-recent-commits?repoId=${id}`)
                .then(res => {
                    const data = res.data.data.reverse();
                    set28commits(data[0].current_period_commits);
                    for (let obj of data) obj.current_period_day = obj.current_period_day.replace('T00:00:00.000Z', '')
                    setCommitConfig({ data, color: '#309cf2', yField: 'current_period_day_commits', ...columConf })
                })
            axios.get(`/api/q/analyze-recent-pull-requests?repoId=${id}`)
                .then(res => {
                    let data = res.data.data.reverse();
                    const { current_period_opened_prs: opened, current_period_merged_prs: merged } = data[0];
                    set28prs({ opened, merged });
                    data = handlePRs(data);
                    setPrConfig({ data, ...lineConf })
                })
            axios.get(`/api/q/analyze-recent-issues?repoId=${id}`)
                .then(res => {
                    let data = res.data.data.reverse();
                    const { current_period_opened_issues: openedNum, current_period_closed_issues: closedNum } = data[0];
                    set28issues({ opened: openedNum, closed: closedNum });
                    data = handleIssues(data);
                    setIssueConfig({ data, ...lineConf })
                })
        }
    }, [id])
    return (
        <>
            <h3 className="fr-title top">Last 28 days Stats</h3>
            <div className="fr-onethree">
                <div className="fr13-left">
                    <h5><i className='iconfont icon-star'></i>Stars</h5>
                    <div className='orange'>{days28stars === 0 ? 0 : days28stars || <LoadingOutlined />}</div>
                </div>
                <div className="fr13-right">
                    <Column {...starConfig} />
                </div>
            </div>

            <div className="fr-two">
                <div className="fr-two-lr fl">
                    <div className="fr2-up">
                        <h5><i className='iconfont icon-PR'></i>Pull Requests</h5>
                        <div className="OMOC">
                            <h6>Opened</h6>
                            <div className='green'>{days28prs.opened === 0 ? 0 : days28prs.opened || <LoadingOutlined />}</div>
                        </div>
                        <div className="OMOC">
                            <h6>Merged</h6>
                            <div className='purple'>{days28prs.merged === 0 ? 0 : days28prs.merged || <LoadingOutlined />}</div>
                        </div>
                    </div>
                    <div className="fr2-down">
                        <Line {...prConfig} />
                    </div>
                </div>
                <div className="fr-two-lr fr">
                    <h5><i className='iconfont icon-issue'></i>Issues</h5>
                    <div className="OMOC">
                        <h6>Opened</h6>
                        <div className='green'>{days28issues.opened === 0 ? 0 : days28issues.opened || <LoadingOutlined />}</div>
                    </div>
                    <div className="OMOC">
                        <h6>Closed</h6>
                        <div className='purple'>{days28issues.closed === 0 ? 0 : days28issues.closed || <LoadingOutlined />}</div>
                    </div>
                    <div className="fr2-down">
                        <Line {...issueConfig} />
                    </div>
                </div>
            </div>

            <div className="fr-onethree">
                <div className="fr13-left">
                    <h5><i className='iconfont icon-commit'></i>Commits</h5>
                    <div className='blue'>{days28commits === 0 ? 0 : days28commits || <LoadingOutlined />}</div>
                </div>
                <div className="fr13-right">
                    <Column {...commitConfig} />
                </div>
            </div>
        </>
    )
}
