import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import axios from 'axios';
import { isEqual, uniqWith } from 'lodash';
import { Table, message } from 'antd'
import { StarFilled } from '@ant-design/icons';
import UserBinder from './UserBinder';
import './index.scss'

const { Column } = Table;
const gitToken = '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'


let bookmarkObjs = JSON.parse(localStorage.getItem('bookmarkRepos')) || {};
export default function DataTable({ label, field }) {
    const needUserInfo = field === 'starred' || field === 'repos';
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || '');
    const needBindUser = needUserInfo;
    
    const [bookmarkRepos, setBookmarkRepos] = useState([]);
    useEffect(() => {
        bookmarkObjs = JSON.parse(localStorage.getItem('bookmarkRepos')) || {};
        setBookmarkRepos(Object.keys(bookmarkObjs));
    }, [])
    const [isLoading, setLoading] = useState(needUserInfo);
    const [repos, setRepos] = useState([]);

    useEffect(() => {
        if (needUserInfo) {
            if (user) {
                setLoading(true);
                let items = [];
                axios.get(`https://api.github.com/users/${user}/${field}?per_page=100`, { headers: { "Authorization": `token${gitToken}` } })
                    .then(res => {
                        const promises = [];
                        for (let { full_name: repo_name, language, id: repo_id, forks } of res.data) {
                            let repoObj = { repo_name, language, repo_id, forks };
                            promises.push(axios.get(`/api/q/analyze-repo-overview?repoId=${repo_id}`)
                                .then(res => {
                                    repoObj = { ...res.data.data[0], ...repoObj }
                                    items.push(repoObj);
                                }));
                        }
                        return Promise.all(promises);
                    })
                    .then(() => { setLoading(false); setRepos(items) })
                    .catch(err => console.log(err));
            } else { message.info('Please Bind a User First!'); }
        }
    }, [user]);

    const sort = (attr) => (a, b) => a[attr] - b[attr];
    const repoLink = text => <Link className='repo-link' to={`/analyze/${text}`}>{text}</Link>;
    const languageFilter = () => {
        const langs = [];
        for (let obj of Object.values(bookmarkObjs)) {
            const value = obj.language;
            const text = obj.language || 'null';
            langs.push({ value, text });
        }
        return {
            filterMultiple: false,
            filterSearch: true,
            onFilter: (value, record) => record.language === value,
            filters: uniqWith(langs, isEqual)
        }
    }

    const star = (repoName, tableDatas) => {
        const { repo_id } = tableDatas;
        const markRepo = repo => {
            return async () => {
                setBookmarkRepos([repo, ...bookmarkRepos]);

                let repoObj = { repo_name: repo };
                Promise.all([
                    axios.get(`/api/q/analyze-repo-overview?repoId=${repo_id}`)
                        .then(res => repoObj = { ...res.data.data[0], ...repoObj })
                        .catch(err => console.log(err)),
                    axios.get(`/api/gh/repo/${repoName}`)
                        .then(res => {
                            const { forks, language } = res.data.data;
                            repoObj = { forks, language, ...repoObj };
                        })
                        .catch(err => console.log(err))
                ]).then(() => {
                    bookmarkObjs = { [repo]: repoObj, ...bookmarkObjs };
                    localStorage.setItem('bookmarkRepos', JSON.stringify(bookmarkObjs));
                })
            }
        }
        const unmarkRepo = repo => {
            return () => {
                delete bookmarkObjs[repo];
                setBookmarkRepos(Object.keys(bookmarkObjs));
                localStorage.setItem('bookmarkRepos', JSON.stringify(bookmarkObjs));
            }
        }

        if (bookmarkRepos.includes(`${repoName}`)) {
            return (
                <div className='star'>
                    <StarFilled className='animate__animated animate__flip'
                        style={{ color: '#ffe895' }}
                        onClick={unmarkRepo(repoName)} />
                </div>)
        } else {
            return (
                <div className='star '>
                    <StarFilled className='animate__animated  animate__heartBeat'
                        style={{ color: '#e3e3e3' }}
                        onClick={markRepo(repoName)} />
                </div>)
        }
    }

    const dataSource = () => field === 'bookmarkRepos' ? Object.values(bookmarkObjs) : repos;
    return (
        <div className="data-table">
            <div className='title'>
                {label}
                {needBindUser ? <UserBinder user={user} setUser={setUser} /> : ''}
            </div>

            <Table dataSource={dataSource()} pagination={false} rowKey='repo_name' sticky={{ offsetHeader: 60 }} loading={isLoading}>
                <Column title="Repository" dataIndex="repo_name" width={400} render={repoLink} />
                <Column title="Stars" dataIndex="stars" sorter={sort('stars')} />
                <Column title="Commits" dataIndex="commits" sorter={sort('commits')} />
                <Column title="Issues" dataIndex="issues" sorter={sort('issues')} />
                <Column title="Forks" dataIndex="forks" sorter={sort('forks')} />
                <Column title="PR Creators" dataIndex="pull_request_creators" sorter={sort('pull_request_creators')} />
                <Column title="Language" dataIndex="language" width={200}{...languageFilter()} render={text => text || 'null'} />
                <Column title="Bookmark" dataIndex="repo_name" key="repo_id" render={star} />
            </Table>
        </div>
    )
}
