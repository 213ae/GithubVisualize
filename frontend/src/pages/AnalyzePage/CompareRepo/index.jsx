import React, { useState, useEffect } from 'react'
import { Anchor } from 'antd'
import RepoOverview from '../../../conponents/RepoOverview';
import StarHistory from '../../../conponents/StarHistory'
import CompaniesInfo from '../../../conponents/CompaniesInfo'
import ContriesInfo from '../../../conponents/CountryInfo'
import CommitsHistory from '../../../conponents/CommitsHistory'
import PROverview from '../../../conponents/PROverview'
import PRHistory from '../../../conponents/PRHistory'
import IssuesOverview from '../../../conponents/IssuesOverview'
import IssuesHistory from '../../../conponents/IssuesHistory'
import './index.scss'

const { Link } = Anchor;

export default function CompareRepo(repos) {
    const repoObj = repos[0]
    return (
        <div className="compare-repo">
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
                </Anchor>
            </div>
            <div className="content-container">
                <div className="analyze-content">
                    <section id="Overview">
                        <div className="first-layer">
                            <div className="first-left">
                                <RepoOverview {...repos} />
                            </div>
                            <div className="first-right">
                                <StarHistory {...repos} />
                            </div>
                        </div>
                    </section>
                    <section id="People">
                        <h2 className="sec-title">People</h2>
                        <ContriesInfo {...repos} />
                        <CompaniesInfo {...repos} />
                    </section>
                    <section id="Commits">
                        <h2 className="sec-title">Commits</h2>
                        <CommitsHistory {...repos} />
                    </section>
                    <section id="Pull Requests">
                        <h2 className="sec-title">Pull Requests</h2>
                        <PROverview {...repos} />
                        <PRHistory {...repoObj} />
                    </section>
                    <section id="Issues">
                        <h2 className="sec-title">Issues</h2>
                        <IssuesOverview {...repos} />
                        <IssuesHistory {...repoObj} />
                    </section>
                </div>
            </div>
        </div>
    )
}
