import React, { useState, useEffect } from 'react'
import qs from 'querystring'
import LangSelector from './LangSelector';
import ReposTable from './ReposTable';
import Loading from './Loading';
import './index.scss'
import axios from 'axios';


export default function TrendingRepos() {
    const [langsWidth, setLangsWidth] = useState(document.body.offsetWidth - 390);
    const [period, setPeriod] = useState('past_24_hours');
    const [language, setLanguage] = useState('All');
    const [records, setRecords] = useState([]);
    const [isLoading, setLoading] = useState(true);

    window.addEventListener('resize', () => setLangsWidth(document.body.offsetWidth - 390))

    useEffect(() => {
        setLoading(true);
        const queryObj = { language, period };
        const query = qs.stringify(queryObj);
        axios.get(`/api/q/trending-repos?${query}`)
            .then(res => { setRecords(res.data.data); setLoading(false) })
            .catch(err => console.log(err));
    }, [language, period])

    const get = (key, val) => {
        switch (key) {
            case 'period': setPeriod(val); break;
            case 'language': setLanguage(val); break;
            default: break;
        }
    }

    return (
        <div className='trending-repos' id='trending-repos'>
            <a className='title' href='#trending-repos' >Trending Repos</a>
            <LangSelector langsWidth={langsWidth} get={get} />
            {isLoading ? <Loading /> : <ReposTable records={records} />}
        </div>
    )
}
