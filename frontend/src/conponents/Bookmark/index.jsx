import React, { useState, useEffect } from 'react'
import { StarFilled } from '@ant-design/icons';
import axios from 'axios'
import './index.scss'

let bookmarkObjs = JSON.parse(localStorage.getItem('bookmarkRepos')) || {};
export default function Bookmark(repoObj) {
    const [bookmarkRepos, setBookmarkRepos] = useState([]);
    useEffect(() => {
        bookmarkObjs = JSON.parse(localStorage.getItem('bookmarkRepos')) || {};
        setBookmarkRepos(Object.keys(bookmarkObjs));
    }, [])

    const markRepo = repo => {
        return async () => {
            setBookmarkRepos([repo, ...bookmarkRepos]);

            axios.get(`/api/q/analyze-repo-overview?repoId=${repoObj.id}`)
                .then(res => repoObj = { ...res.data.data[0], ...repoObj })
                .then(() => {
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
    if (bookmarkRepos.includes(repoObj.repo_name)) {
        return (
            <div className='star'>
                <StarFilled className='animate__animated animate__flip'
                    style={{ color: '#ffe895' }}
                    onClick={unmarkRepo(repoObj.repo_name)} />
            </div>)
    } else {
        return (
            <div className='star'>
                <StarFilled className='animate__animated  animate__heartBeat'
                    style={{ color: '#e3e3e3' }}
                    onClick={markRepo(repoObj.repo_name)} />
            </div>)
    }
}
