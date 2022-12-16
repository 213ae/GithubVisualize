import React, { useState, useEffect } from 'react'
import { LoadingOutlined } from '@ant-design/icons'
import axios from 'axios'
import './index.scss'

let prevId = undefined;
export default function RepoOverview(repoObj) {
    const [overviewObj, setOverview] = useState({});
    const { repo_name, stars, commits, issues, forks, pull_request_creators: PRC, language } = overviewObj;

    useEffect(() => {
        setOverview({});
        if (repoObj.id && prevId !== repoObj.id) {
            prevId = repoObj.id
            console.log(repoObj)
            axios.get(`/api/q/analyze-repo-overview?repoId=${repoObj.id}`)
                .then(res => setOverview({ ...res.data.data[0], ...repoObj }))
                .catch(err => console.log(err));
        }
    }, [repoObj])

    return (
        <>
            <h3 className="fl-title">Overview</h3>
            <div className='fl-layer'>
                <div className="layer-left"></div>
                <div className="layer-right layer1-right">{repo_name || <LoadingOutlined className='yellow-loading' />}</div>
            </div>
            <div className='fl-layer'>
                <div className="layer-left"><span className='iconfont icon-star'></span><span>Stars</span></div>
                <div className="layer-right">{stars === 0 ? 0 : stars || <LoadingOutlined className='yellow-loading' />}</div>
            </div>
            <div className='fl-layer'>
                <div className="layer-left"><span className='iconfont icon-commit'></span><span>Commits</span></div>
                <div className="layer-right">{commits === 0 ? 0 : commits || <LoadingOutlined className='yellow-loading' />}</div>
            </div>
            <div className='fl-layer'>
                <div className="layer-left"><span className='iconfont icon-issue'></span><span>Issues</span></div>
                <div className="layer-right">{issues === 0 ? 0 : issues || <LoadingOutlined className='yellow-loading' />}</div>
            </div>
            <div className='fl-layer'>
                <div className="layer-left"><span className='iconfont icon-fork'></span><span>Forks</span></div>
                <div className="layer-right">{forks === 0 ? 0 : forks || <LoadingOutlined className='yellow-loading' />}</div>
            </div>
            <div className='fl-layer'>
                <div className="layer-left"><span className='iconfont icon-PRC'></span><span>PR Creators</span></div>
                <div className="layer-right">{PRC === 0 ? 0 : PRC || <LoadingOutlined className='yellow-loading' />}</div>
            </div>
            <div className='fl-layer'>
                <div className="layer-left"><span className='iconfont icon-lang'></span><span>Language</span></div>
                <div className="layer-right">{language === null ? 'null' : language || <LoadingOutlined className='yellow-loading' />}</div>
            </div>
        </>
    )
}
