import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Anchor } from 'antd'
import RepoOverview from '../../../conponents/RepoOverview';
import Last28Stats from '../../../conponents/Last28Stats';
import StarHistory from '../../../conponents/StarHistory'
import CompaniesInfo from '../../../conponents/CompaniesInfo'
import ContriesInfo from '../../../conponents/CountryInfo'
import CommitsHistory from '../../../conponents/CommitsHistory'
import PROverview from '../../../conponents/PROverview'
import PRHistory from '../../../conponents/PRHistory'
import IssuesOverview from '../../../conponents/IssuesOverview'
import IssuesHistory from '../../../conponents/IssuesHistory'
import ContributorRankings from '../../../conponents/ContributorRankings'
import Bookmark from '../../../conponents/Bookmark'
import './index.scss'

const { Link } = Anchor;

export default function SingleRepo(repoObj) {
    const { user, repo } = useParams();
    return (
        <div className="single-repo">
            <div className="left-nav">
                <Anchor offsetTop={116}
                    affix={false}
                    showInkInFixed={false}
                    onClick={e => e.preventDefault()}>
                    <Link className='sec-nav' href='#Overview' title={`Overview`} />
                    <Link className='sec-nav' href='#People' title={`People`} />
                    <Link className='sec-nav' href='#Commits' title={`Commits`} />
                    <Link className='sec-nav' href='#Pull Requests' title={`Pull Requests`} />
                    <Link className='sec-nav' href='#Issues' title={`Issues`} />
                    <Link className='sec-nav' href='#Contributors' title={`Contributors`} />
                </Anchor>
            </div>
            <div className="content-container">
                <div className="analyze-content">
                    <section id="Overview">
                        <h1 className="title" >
                            <div className="star">{repoObj.id ? <Bookmark {...repoObj} /> : ''}</div>
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
                        <div className='second-layer'>
                            <StarHistory {...repoObj} />
                        </div>
                    </section>
                    <section id="People">
                        <h2 className="sec-title">People</h2>
                        <ContriesInfo {...repoObj} />
                        <CompaniesInfo {...repoObj} />
                    </section>
                    <section id="Commits">
                        <h2 className="sec-title">Commits</h2>
                        <CommitsHistory {...repoObj} />
                    </section>
                    <section id="Pull Requests">
                        <h2 className="sec-title">Pull Requests</h2>
                        <PROverview {...repoObj} />
                        <PRHistory {...repoObj} />
                    </section>
                    <section id="Issues">
                        <h2 className="sec-title">Issues</h2>
                        <IssuesOverview {...repoObj} />
                        <IssuesHistory {...repoObj} />
                    </section>
                    <section id="Contributors">
                        <h2 className="sec-title">Contributor Rankings</h2>
                        <ContributorRankings {...repoObj} />
                    </section>
                </div>
            </div>
        </div>
    )
}
