import React, { useState } from 'react'
import { Select, Table } from 'antd'
import { CaretDownOutlined, LeftOutlined, RightOutlined, StarFilled } from '@ant-design/icons';
import './index.scss'
import { Link } from 'react-router-dom';
import axios from 'axios';

const { Column } = Table;

const colorMap = {
    "JavaScript": '#f1e05a', "Java": '#b07219', "Python": '#3572a5', "PHP": '#4f5d95',
    "C++": '#f34b7d', "C#": '#178600', "TypeScript": '#3178c6', "Shell": '#89e051',
    "C": '#555555', "Ruby": '#701516', "Rust": '#dea584', "Go": '#00add8', "Kotlin": '#a97bff',
    "HCL": '#cccccc', "PowerShell": '#012456', "CMake": '#da3434', "Groovy": '#4298b8',
    "PLpgSQL": '#336790', "TSQL": '#e38c00', "Dart": '#00b4ab', "Swift": '#f05138',
    "HTML": '#e34c26', "CSS": '#563d7c', "Elixir": '#6e4a7e', "Haskell": '#5e5086',
    "Solidity": '#aa6746', "Assembly": '#6e4c13', "R": '#198ce7', "Scala": '#c22d40',
    "Julia": '#a270ba', "Lua": '#000080', "Clojure": '#db5855', "Erlang": '#b83998',
    "Common Lisp": '#3fb68b', "Emacs Lisp": '#c0650b', "OCaml": '#3be133',
    "MATLAB": '#e16737', "Objective": '#438eff', "Perl": '#0298c3', "Fortan": '#4d41b1',
}

let bookmarkObjs = JSON.parse(localStorage.getItem('bookmarkRepos')) || {};

export default function ReposTable(props) {
    const { records } = props;
    const total = records.length;

    const [bookmarkRepos, setBookmarkRepos] = useState(Object.keys(bookmarkObjs));

    const [page, setPage] = useState({ idx: 0, size: 20 });
    const { idx, size } = page;

    const pageSelectConfig = {
        suffixIcon: <CaretDownOutlined className='arrow' />,
        defaultValue: "20",
        onChange: size => setPage({ idx: 0, size }),
        popupClassName: 'page-dropdown',
        options: [
            { value: '20', label: '20' },
            { value: '50', label: '50' },
            { value: '100', label: '100' }
        ]
    };

    const handleText = text => <span className='text'>{text ? text : 0}</span>;
    const rank = (_, __, i) => <span className='rank'>#{i + idx * size + 1}</span>;
    const avatar = user => <a key={user} href={`https://github.com/${user}`}> <img src={`https://github.com/${user}.png`} alt='' onError={e => e.target.src = '/default.png'} /></a >
    const repository = (_, record) => (<>
        <Link className='repo-link' to={`/analyze/${record.repo_name}`}>{record.repo_name}</Link>
        <div className='desc'>{record.description}</div>
        <div className='main-lang'>
            <span className='lang-color'
                style={{ backgroundColor: colorMap[record.language] }}
            >
            </span>
            {record.language || 'null'}
        </div>
    </>)
    const contributors = text => {
        if (text === null) return '';
        const contributors = text.split(',');
        return <div className='contributors'>{contributors.map(avatar)}</div>;
    }
    const star = (repoName, tableDatas) => {
        const { repo_id } = tableDatas;
        const markRepo = repo => {
            return async () => {
                setBookmarkRepos([repo, ...bookmarkRepos]);

                let repoObj = { repo_name: repoName };
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

    const isPrevUnable = () => idx === 0 ? 'unable' : '';
    const isNextUnable = () => (idx + 1 >= total / size) ? 'unable' : '';
    const prevPage = () => { if (idx !== 0) setPage({ idx: idx - 1, size }) }
    const nextPage = () => { if (idx + 1 < total / size) setPage({ idx: idx + 1, size }) }

    return (
        <div className="repos-table">
            <div className="pager">
                <label className='plain-text'>Rows per page:</label>
                <Select {...pageSelectConfig} />
                <span className='plain-text'>{idx * size + 1}-{Math.min((idx + 1) * size, total)} of {total}</span>
                <button className={isPrevUnable()} onClick={prevPage}><LeftOutlined /></button>
                <button className={isNextUnable()} onClick={nextPage}><RightOutlined /></button>
            </div>
            <Table dataSource={records.slice(idx * size, (idx + 1) * size)} pagination={false} rowKey={'repo_id'}>
                <Column title="Rank" render={rank} />
                <Column title="Repository" render={repository} />
                <Column title="Stars" dataIndex="stars" render={handleText} />
                <Column title="Forks" dataIndex="forks" render={handleText} />
                <Column title="Pushes" dataIndex="pushes" render={handleText} />
                <Column title="PRs" dataIndex="pull_requests" render={handleText} />
                <Column title="Top Contributors" dataIndex="contributor_logins" render={contributors} />
                <Column title="Bookmark" dataIndex="repo_name" render={star} />
            </Table>
        </div>
    )
}
