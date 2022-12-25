import React, { useEffect, useRef, useState } from 'react'
import { SearchOutlined, CloseOutlined, PlusOutlined } from '@ant-design/icons'
import { AutoComplete } from 'antd'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import axios from 'axios'
import './index.scss'


export default function CompareSearch() {
    const navigate = useNavigate();

    const { user, repo } = useParams();
    let curRepo1 = user + '/' + repo;

    const [search] = useSearchParams();
    let curRepo2 = search.get('vs') || '';

    const [value1, setValue1] = useState(curRepo1);
    const [value2, setValue2] = useState(curRepo2);
    const [options, setOptions] = useState([]);

    useEffect(() => {
        setValue1(curRepo1);
        setValue2(curRepo2);
    }, [curRepo1, curRepo2])

    const handleChange = setValue => {
        return data => {
            setValue(data);
            setOptions([]);
            if (data) {
                setOptions([{ label: 'Loading...', disabled: true }]);
                axios.get(`/api/gh/repos/search?keyword=${data}`)
                    .then(res => {
                        const opts = [];
                        res.data.data.forEach(val => {
                            if (val.fullName && val.fullName.indexOf(data) !== -1 && val.fullName !== curRepo1)
                                opts.push({ value: val.fullName })
                        });
                        setOptions(opts);
                    })
                    .catch(err => console.log(err));
            }
        }

    }
    const autoSelectAll = cls => {
        document.getElementsByClassName(cls)[0].getElementsByTagName('input')[0].select();
    }

    const VSRepo = () => {
        if (curRepo2) {
            return <>
                <span className='repo2'>
                    <span>&nbsp;{value2}</span>
                    <AutoComplete
                        className='auto-complete2'
                        popupClassName='ACpopup'
                        value={value2}
                        options={options}
                        onClick={() => autoSelectAll('auto-complete2')}
                        onChange={handleChange(setValue2)}
                        onSelect={data => navigate('/analyze/' + curRepo1 + '?vs=' + data)}
                        onFocus={handleFocus(2)}
                        onBlur={() => setValue2(curRepo2)}
                        getPopupContainer={triggerNode => triggerNode.parentNode}
                        spellCheck="false"
                    />
                </span>
                <span className='close-vs'><CloseOutlined onClick={() => { setValue2(''); navigate('/analyze/' + curRepo1) }} /></span>
            </>
        } else {
            return <>
                <span className='repo2-empty'>
                    <PlusOutlined className='plus-icon' />
                    <AutoComplete
                        className='auto-complete2-empty'
                        style={{ width: 132 }}
                        popupClassName='ACpopup'
                        value={value2}
                        options={options}
                        onChange={handleChange(setValue2)}
                        onSelect={data => navigate('/analyze/' + curRepo1 + '?vs=' + data)}
                        onFocus={handleFocus(2)}
                        onBlur={() => setValue2(curRepo2)}
                        getPopupContainer={triggerNode => triggerNode.parentNode}
                        spellCheck="false"
                        placeholder="add another one"
                    />
                </span>
            </>
        }
    }
    const handleFocus = n => {
        return () => {
            setOptions([{ label: 'Loading...', disabled: true }]);
            axios.get(`/api/gh/repos/search?keyword=recommend-repo-list-${n}-keyword`)
                .then(res => {
                    const opts = [];
                    res.data.data.forEach(val => {
                        opts.push({ value: val.fullName })
                    });
                    setOptions(opts);
                })
                .catch(err => console.log(err));
        }
    }

    return (
        <div className="compare-search">
            <SearchOutlined className='search-icon' />
            <span className='repo1'>
                <span>&nbsp;{value1}</span>
                <AutoComplete
                    className='auto-complete1'
                    dropdownMatchSelectWidth={400}
                    popupClassName='ACpopup'
                    value={value1}
                    options={options}
                    onClick={() => autoSelectAll('auto-complete1')}
                    onChange={handleChange(setValue1)}
                    onSelect={data => navigate('/analyze/' + data + (curRepo2 ? ('?vs=' + curRepo2) : ''))}
                    onFocus={handleFocus(1)}
                    onBlur={() => setValue1(curRepo1)}
                    getPopupContainer={triggerNode => triggerNode.parentNode}
                    spellCheck="false"
                />
            </span>
            <span className='vs'>VS.</span>
            {VSRepo()}
        </div >
    )
}