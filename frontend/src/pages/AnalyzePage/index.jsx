import React, { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { Spin } from 'antd'
import axios from 'axios'
import CompareSearch from '../../conponents/CompareSearch'
import SingleRepo from './SingleRepo'
import CompareRepo from './CompareRepo'
import './index.scss'

export default function AnalyzePage() {
    const { user, repo } = useParams();
    const main = user + '/' + repo;

    const [search] = useSearchParams();
    const vs = search.get('vs');

    const [repos, setRepos] = useState([{}, {}]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        const tempRepos = new Array(2).fill({});
        const promises = [];
        promises.push(axios.get(`/api/gh/repo/${main}`)
            .then(res => res.data.data)
            .then(({ full_name: repo_name, language, id, forks, description }) => {
                tempRepos[0] = { repo_name, language, id, forks, description }
            }));
        if (vs) {
            promises.push(axios.get(`/api/gh/repo/${vs}`)
                .then(res => res.data.data)
                .then(({ full_name: repo_name, language, id, forks, description }) => {
                    tempRepos[1] = { repo_name, language, id, forks, description }
                }))
        }
        Promise.all(promises)
            .then(() => {
                setRepos(tempRepos);
                setLoading(false);
            })
            .catch(err => console.log(err));
    }, [main, vs])

    return (
        <div className='analyze-page'>
            <CompareSearch />
            {
                loading ? <Spin className='loading' size='large'/> :
                    vs ? <CompareRepo  {...repos} /> : <SingleRepo {...repos[0]} />}
        </div>
    )
}