import { useRef, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { SearchOutlined } from '@ant-design/icons'
import AutoComplete from './AutoComplete'
import Loading from './Loading'
import './index.scss'

let searchCache = {};

export default function SearchBar(props) {
    const navigate = useNavigate();
    const _input = useRef(null);

    const [content, setContent] = useState('');
    const [isShow, setShow] = useState(false);
    const [isLoading, setLoading] = useState(true);
    const [entries, setEntries] = useState([]);
    const [active, setActive] = useState(-1);

    useEffect(() => {
        axios.get('/api/gh/repos/search?keyword=recommend-repo-list-1-keyword')
            .then(res => handleResponse('#default', res.data.data))
            .catch(err => console.log(err))
    }, [])

    const handleSearch = () => {
        if (active !== -1) {
            navigate(`/analyze/${entries[active].fullName}`)
        }
    }

    const pickEntry = () => {
        setContent(entries[active]);
        handleSearch();
    }

    const displayFrame = () => {
        if (isShow) {
            if (isLoading) {
                return <Loading />
            } else {
                if (entries.length === 0) {
                    return (
                        <div className='no-repo'>No repo</div>
                    )
                } else {
                    const props = { pickEntry, entries, active, setActive }
                    return <AutoComplete {...props} />
                }
            }
        }
    }
    const handleChange = (e) => {
        const key = e.target.value;
        setActive(-1);
        setContent(key);
        setLoading(true);
        if (key === '') {
            setEntries(searchCache['#default']);
            setLoading(false)
        } else if (key in searchCache) {
            setEntries(searchCache[key]);
            setLoading(false)
        } else {
            axios.get(`/api/gh/repos/search?keyword=${key}`)
                .then(res => handleResponse(key, res.data.data))
                .catch(err => console.log(err))
        }

    }
    const handleResponse = (key, data) => {
        if (key === '#default') searchCache[key] = data;
        else searchCache[key] = data.filter(obj => obj.fullName.indexOf(key) !== -1);
        setEntries(searchCache[key]);
        setLoading(false)
    }
    const handleKeyDown = (e) => {
        if (e.key === 'Tab') e.preventDefault();
        setShow(true);
        switch (e.key) {
            case 'Enter': handleSearch(); break;
            case 'Escape': setShow(false); setActive(-1); break;
            case 'Tab': setActive((active + 1) % entries.length); break;
            case 'ArrowDown': setActive((active + 1) % entries.length); break;
            case 'ArrowUp': setActive((entries.length + active - 1) % entries.length); break;
            default: break;
        }
    }
    return (
        <div className='search-bar' >
            <label className='logo'></label>
            <div className='input-area' tabIndex='1' onClick={() => _input.current.focus()}>
                <span className='search-icon'><SearchOutlined /></span>
                <input type="text" autoComplete='off' ref={_input} value={content}
                    placeholder='Search a repo'
                    onChange={e => handleChange(e)}
                    onKeyDown={e => handleKeyDown(e)}
                    onFocus={() => { setShow(true); _input.current.placeholder = 'Enter a Github Repo Name' }}
                    onBlur={() => { setShow(false); _input.current.placeholder = 'Search a repo' }}
                    onClick={() => { setShow(true); }}
                />
            </div>
            {displayFrame()}
        </div>
    );
}