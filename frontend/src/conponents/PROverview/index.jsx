import React, { useState, useEffect } from 'react'
import { LoadingOutlined } from '@ant-design/icons'
import axios from 'axios'
import './index.scss'

export default function PROverview(props) {
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
            return axios.get(`/api/q/analyze-repo-pr-overview?repoId=${repos[idx].id}`)
                .then(res => ({ ...res.data.data[0], ...repos[idx] }));
        } else {
            return {};
        }
    }
    return (
        <div className={'pr-overview ' + (isCompareMode ? 'compare-mode' : '')}>
            <h3 className="fl-title top">Overview</h3>
            <div className='fl-layer'>
                <div className="layer-left"></div>
                <div className="layer-right layer1-right">{overviews[0].repo_name || <LoadingOutlined className='yellow-loading' />}</div>
                {isCompareMode ? <div className="layer-right layer1-right">{overviews[1].repo_name || <LoadingOutlined className='yellow-loading' />}</div> : ''}
            </div>
            <div className='fl-layer'>
                <div className="layer-left"><span>Total PRs</span></div>
                <div className="layer-right">{overviews[0].pull_requests === 0 ? 0 : overviews[0].pull_requests || <LoadingOutlined className='yellow-loading' />}</div>
                {isCompareMode ? <div className="layer-right">{overviews[1].pull_requests === 0 ? 0 : overviews[1].pull_requests || <LoadingOutlined className='yellow-loading' />}</div> : ''}
            </div>
            <div className='fl-layer'>
                <div className="layer-left"><span>Creators</span></div>
                <div className="layer-right">{overviews[0].pull_request_creators === 0 ? 0 : overviews[0].pull_request_creators || <LoadingOutlined className='yellow-loading' />}</div>
                {isCompareMode ? <div className="layer-right">{overviews[1].pull_request_creators === 0 ? 0 : overviews[1].pull_request_creators || <LoadingOutlined className='yellow-loading' />}</div> : ''}
            </div>
            <div className='fl-layer'>
                <div className="layer-left"><span>Reviews</span></div>
                <div className="layer-right">{overviews[0].pull_request_reviews === 0 ? 0 : overviews[0].pull_request_reviews || <LoadingOutlined className='yellow-loading' />}</div>
                {isCompareMode ? <div className="layer-right">{overviews[1].pull_request_reviews === 0 ? 0 : overviews[1].pull_request_reviews || <LoadingOutlined className='yellow-loading' />}</div> : ''}
            </div>
            <div className='fl-layer'>
                <div className="layer-left"><span>Reviewers</span></div>
                <div className="layer-right">{overviews[0].pull_request_reviewers === 0 ? 0 : overviews[0].pull_request_reviewers || <LoadingOutlined className='yellow-loading' />}</div>
                {isCompareMode ? <div className="layer-right">{overviews[1].pull_request_reviewers === 0 ? 0 : overviews[1].pull_request_reviewers || <LoadingOutlined className='yellow-loading' />}</div> : ''}
            </div>
        </div>
    )
}
