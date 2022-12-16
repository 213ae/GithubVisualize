import React, { useState } from 'react'
import { AutoComplete } from 'antd'
import './index.scss'
import axios from 'axios';

export default function UserBinder({ user, setUser }) {
    const [value, setValue] = useState(user);
    const [options, setOptions] = useState([]);
    const [isBind, setBind] = useState(user !== '');

    const handleChange = data => {
        setValue(data);
        setOptions([]);
        if (data) {
            setOptions([{ label: 'Loading...', disabled: true }]);
            axios.get(`/api/gh/users/search?keyword=${data}&type=user`)
                .then(res => {
                    const opts = [];
                    res.data.data.forEach(val => {
                        if (val.login && val.login.indexOf(data) !== -1)
                            opts.push({ value: val.login })
                    });
                    setOptions(opts);
                })
                .catch(err => console.log(err));
        }
    }

    const handleSelect = data => {
        localStorage.setItem('user', JSON.stringify(data));
        setUser(data);
        setBind(true);
    }
    const handleBlur = () => {
        setBind(user !== '');
    }
    const userSwitch = () => {
        setValue(user);
        setBind(false);
    }

    return (
        <div className='user-binder'>

            {isBind ?
                <div className='welcome'>
                    Welcome! User:&nbsp;
                    <span className='user-switch'
                        onClick={userSwitch}>
                        {user}
                    </span>
                </div> :
                <AutoComplete
                    value={value}
                    options={options}
                    style={{ width: 200 }}
                    onChange={handleChange}
                    onSelect={handleSelect}
                    onBlur={handleBlur}
                    autoFocus={value !== ''}
                    spellCheck="false"
                    placeholder="Bind a User"
                />
            }
        </div>
    )
}