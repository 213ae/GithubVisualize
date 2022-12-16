import React, { useEffect, useState, useRef } from 'react'
import { useParams, NavLink, useSearchParams } from 'react-router-dom'
import { Anchor } from 'antd'
import axios from 'axios'
import { isArray, result, set } from 'lodash'
import CompareSearch from '../../conponents/CompareSearch'
import RepoOverview from '../../conponents/RepoOverview';
import Last28Stats from '../../conponents/Last28Stats';
import StarHistory from '../../conponents/StarHistory'
import './index.scss'

const { Link } = Anchor;

export default function AnalyzePage() {
    const { user, repo } = useParams();
    const [repoObj, setRepoObj] = useState({});

    useEffect(() => {
        let repoObj = {};
        axios.get(`/api/gh/repo/${user}/${repo}`)
            .then(res => res.data.data)
            .then(({ full_name: repo_name, language, id, forks, description }) => {
                repoObj = { repo_name, language, id, forks, description }
                setRepoObj(repoObj);
            })
            .catch(err => console.log(err));
    }, [user, repo])

    return (
        <div className='analyze-page'>
            <CompareSearch />
            <div className="left-nav">
                <Anchor offsetTop={116}
                    affix={false}
                    showInkInFixed={false}
                    onClick={e => e.preventDefault()}>
                    <Link className='sec-nav' href='#Overview' title={`Overview`} />
                    <Link className='sec-nav' href='#a2' title={`a2`} />
                    <Link className='sec-nav' href='#a3' title={`a3`} />
                    <Link className='sec-nav' href='#a4' title={`a4`} />
                </Anchor>
            </div>
            <div className="content-container">
                <div className="analyze-content">
                    <section id="Overview">
                        <h1 className="title" >
                            <img src={`https://github.com/${user}.png`} />
                            <a href={`https://github.com/${user}/${repo}`}>
                                {`${user}/${repo}`}
                            </a>
                        </h1>
                        <p>{repoObj.description}&nbsp;</p>
                        <div className="first-layer">
                            <div className="first-left">
                                <RepoOverview {...repoObj} />
                            </div>
                            <div className="first-right">
                                <Last28Stats {...repoObj} />
                            </div>
                        </div>
                        <h4>Star History</h4>
                        <div className='second-layer'>
                            <StarHistory {...repoObj} />
                        </div>
                    </section>
                    <section id="a2"><h3 className="title">a2</h3></section>
                    <section id="a3"><h3 className="title">a3</h3></section>
                    <section id="a4"><h3 className="title">a4</h3></section>
                </div>
            </div>

        </div>
    )
}