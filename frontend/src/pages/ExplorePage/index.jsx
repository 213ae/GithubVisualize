import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import { ArrowDownOutlined, ArrowUpOutlined, SearchOutlined } from '@ant-design/icons';
import { orderBy, max } from 'lodash'
import axios from 'axios';
import SearchBar from '../../conponents/SearchBar'
import './index.scss'

export default function ExplorePage() {
    const [data, setData] = useState({});
    const [displayItems, setDisplayItems] = useState([]);
    const [borderHighlight, setBorderHighlight] = useState(false);

    useEffect(() => {
        axios.get('/api/q/recent-hot-collections')
            .then(res => handleData(res.data.data))
            .then(data => { setData(data); setDisplayItems(Object.keys(data)) })
            .catch(err => console.log(err))
    }, [])

    const handleData = data => {
        const dataObj = {};
        for (let item of data) {
            const { name, rank, rank_changes, repo_name } = item;
            if (!dataObj[name]) {
                dataObj[name] = [{ rank, rank_changes, repo_name }];
            } else {
                dataObj[name].push({ rank, rank_changes, repo_name });
            }
        }
        for (let key in dataObj) {
            dataObj[key] = orderBy(dataObj[key], ['rank']);
        }
        console.log(dataObj)
        return dataObj;
    }
    const handleInput = input => {
        const keys = [];
        if (true) {
            for (let key in data) {
                if (key.toLowerCase().indexOf(input.toLowerCase()) != -1) keys.push(key);
            }
            setDisplayItems(keys);
        }
    }

    const avatar = user => <a href={`https://github.com/${user}`}><img src={`https://github.com/${user}.png`} alt='' onError={e => e.target.src = '/default.png'} /></a >
    const rankChange = rank_changes => {
        if (rank_changes < 0) {
            return <span className="red"><ArrowDownOutlined />{-rank_changes}</span>
        } else if (rank_changes > 0) {
            return <span className="green"><ArrowUpOutlined />{rank_changes}</span>
        } else return '';
    }

    return (
        <div className='explore-page'>
            <div className="w">
                <h1>Explore Collections</h1>
                <p>Find insights about the monthly or historical rankings and trends in technical fields with curated repository lists.</p>
                <div className="search-container">
                    <div className={"search " + (borderHighlight ? 'highlight-border' : '')}>
                        <SearchOutlined />
                        <input type="text"
                            placeholder='Search...'
                            onFocus={() => setBorderHighlight(true)}
                            onBlur={() => setBorderHighlight(false)}
                            onChange={e => handleInput(e.target.value)}
                        />
                    </div>
                </div>
                <div className="display-board clearfix">
                    {
                        displayItems.map((val, idx) =>
                            <div key={idx} className="card">
                                <div className="title">{val}</div>
                                {data[val].map((item, idx) =>
                                    <div key={idx} className="repo">
                                        <div className="rank">{item.rank}{rankChange(item.rank_changes)}</div>
                                        <div className="avatar">{avatar(item.repo_name.split('/')[0])}</div>
                                        <Link className="link" to={`/analyze/${item.repo_name}`}>{item.repo_name}</Link>
                                    </div>
                                )}
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    )
}
