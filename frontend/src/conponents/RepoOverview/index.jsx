import React, { useState, useEffect } from 'react'
import { LoadingOutlined } from '@ant-design/icons'
import axios from 'axios'
import './index.scss'

export default function RepoOverview(props) {
    const isCompareMode = props[0] !== undefined && props[1] !== undefined;
    const repos = isCompareMode ? props : [props, {}];

    const [overviews, setOverviews] = useState([{}, {}]);

    useEffect(() => {
        setOverviews([{}, {}]);
        Promise.all([getOverview(0), getOverview(1)])
            .then(res => setOverviews(res))
            .catch(err => console.log(err))
    }, [props])

    const getOverview = idx => {
        if (repos[idx].id) {
            return axios.get(`/api/q/analyze-repo-overview?repoId=${repos[idx].id}`)
                .then(res => ({ ...res.data.data[0], ...repos[idx] }));
        } else {
            return {};
        }
    }

    return (
        <div className='repo-overview'>
            <h3 className="fl-title top">Overview</h3>
            <div className='fl-layer'>
                <div className="layer-left"></div>
                <div className={"layer-right layer1-right " + (isCompareMode ? 'half' : '')}>{overviews[0].repo_name || <LoadingOutlined className='yellow-loading' />}</div>
                {isCompareMode ? <div className="layer-right layer1-right half">{overviews[1].repo_name || <LoadingOutlined className='yellow-loading' />}</div> : ''}
            </div>
            <div className='fl-layer'>
                <div className="layer-left"><span className='iconfont icon-star'></span><span>Stars</span></div>
                <div className={"layer-right " + (isCompareMode ? 'half' : '')}>{overviews[0].stars === 0 ? 0 : overviews[0].stars || <LoadingOutlined className='yellow-loading' />}</div>
                {isCompareMode ? <div className="layer-right half">{overviews[1].stars === 0 ? 0 : overviews[1].stars || <LoadingOutlined className='yellow-loading' />}</div> : ''}
            </div>
            <div className='fl-layer'>
                <div className="layer-left"><span className='iconfont icon-commit'></span><span>Commits</span></div>
                <div className={"layer-right " + (isCompareMode ? 'half' : '')}>{overviews[0].commits === 0 ? 0 : overviews[0].commits || <LoadingOutlined className='yellow-loading' />}</div>
                {isCompareMode ? <div className="layer-right half">{overviews[1].commits === 0 ? 0 : overviews[1].commits || <LoadingOutlined className='yellow-loading' />}</div> : ''}
            </div>
            <div className='fl-layer'>
                <div className="layer-left"><span className='iconfont icon-issue'></span><span>Issues</span></div>
                <div className={"layer-right " + (isCompareMode ? 'half' : '')}>{overviews[0].issues === 0 ? 0 : overviews[0].issues || <LoadingOutlined className='yellow-loading' />}</div>
                {isCompareMode ? <div className="layer-right half">{overviews[1].issues === 0 ? 0 : overviews[1].issues || <LoadingOutlined className='yellow-loading' />}</div> : ''}
            </div>
            <div className='fl-layer'>
                <div className="layer-left"><span className='iconfont icon-fork'></span><span>Forks</span></div>
                <div className={"layer-right " + (isCompareMode ? 'half' : '')}>{overviews[0].forks === 0 ? 0 : overviews[0].forks || <LoadingOutlined className='yellow-loading' />}</div>
                {isCompareMode ? <div className="layer-right half">{overviews[1].forks === 0 ? 0 : overviews[1].forks || <LoadingOutlined className='yellow-loading' />}</div> : ''}
            </div>
            <div className='fl-layer'>
                <div className="layer-left"><span className='iconfont icon-PRC'></span><span>PR Creators</span></div>
                <div className={"layer-right " + (isCompareMode ? 'half' : '')}>{overviews[0].pull_request_creators === 0 ? 0 : overviews[0].pull_request_creators || <LoadingOutlined className='yellow-loading' />}</div>
                {isCompareMode ? <div className="layer-right half">{overviews[1].pull_request_creators === 0 ? 0 : overviews[1].pull_request_creators || <LoadingOutlined className='yellow-loading' />}</div> : ''}
            </div>
            <div className='fl-layer'>
                <div className="layer-left"><span className='iconfont icon-lang'></span><span>Language</span></div>
                <div className={"layer-right " + (isCompareMode ? 'half' : '')}>{overviews[0].language === null ? 'null' : overviews[0].language || <LoadingOutlined className='yellow-loading' />}</div>
                {isCompareMode ? <div className="layer-right half">{overviews[1].language === null ? 'null' : overviews[1].language || <LoadingOutlined className='yellow-loading' />}</div> : ''}
            </div>
        </div>
    )
}
