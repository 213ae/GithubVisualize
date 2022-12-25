import React, { useState, useEffect } from 'react'
import { LoadingOutlined } from '@ant-design/icons'
import axios from 'axios'
import './index.scss'

export default function IssuesOverview(props) {
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
            return axios.get(`/api/q/analyze-repo-issue-overview?repoId=${repos[idx].id}`)
                .then(res => ({ ...res.data.data[0], ...repos[idx] }));
        } else {
            return {};
        }
    }

    return (
        <div className={'issues-overview ' + (isCompareMode ? 'compare-mode' : '')}>
            <h3 className="fl-title top">Overview</h3>
            <div className='fl-layer'>
                <div className="layer-left"></div>
                <div className="layer-right layer1-right">{overviews[0].repo_name || <LoadingOutlined className='yellow-loading' />}</div>
                {isCompareMode ? <div className="layer-right layer1-right">{overviews[1].repo_name || <LoadingOutlined className='yellow-loading' />}</div> : ''}
            </div>
            <div className='fl-layer'>
                <div className="layer-left"><span>Total Issues</span></div>
                <div className="layer-right">{overviews[0].issues === 0 ? 0 : overviews[0].issues || <LoadingOutlined className='yellow-loading' />}</div>
                {isCompareMode ? <div className="layer-right">{overviews[1].issues === 0 ? 0 : overviews[1].issues || <LoadingOutlined className='yellow-loading' />}</div> : ''}
            </div>
            <div className='fl-layer'>
                <div className="layer-left"><span>Creators</span></div>
                <div className="layer-right">{overviews[0].issue_creators === 0 ? 0 : overviews[0].issue_creators || <LoadingOutlined className='yellow-loading' />}</div>
                {isCompareMode ? <div className="layer-right">{overviews[1].issue_creators === 0 ? 0 : overviews[1].issue_creators || <LoadingOutlined className='yellow-loading' />}</div> : ''}
            </div>
            <div className='fl-layer'>
                <div className="layer-left"><span>Comments</span></div>
                <div className="layer-right">{overviews[0].issue_comments === 0 ? 0 : overviews[0].issue_comments || <LoadingOutlined className='yellow-loading' />}</div>
                {isCompareMode ? <div className="layer-right">{overviews[1].issue_comments === 0 ? 0 : overviews[1].issue_comments || <LoadingOutlined className='yellow-loading' />}</div> : ''}
            </div>
            <div className='fl-layer'>
                <div className="layer-left"><span>Commenters</span></div>
                <div className="layer-right">{overviews[0].issue_commenters === 0 ? 0 : overviews[0].issue_commenters || <LoadingOutlined className='yellow-loading' />}</div>
                {isCompareMode ? <div className="layer-right">{overviews[1].issue_commenters === 0 ? 0 : overviews[1].issue_commenters || <LoadingOutlined className='yellow-loading' />}</div> : ''}
            </div>
        </div>
    )
}
