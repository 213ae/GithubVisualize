import React from 'react'
import { ArrowUpOutlined, ArrowDownOutlined, EnterOutlined } from '@ant-design/icons'
import './index.scss'

export default function AutoComplete(props) {
    const { entries, pickEntry, active, setActive } = props;
    const handleEnter = (e, index) => {
        setActive(index);
    }
    return (
        <div className='autocomplete'>
            <div className='header'><div className='tag'>Repo</div></div>
            {
                entries.map((obj, index) => {
                    const userName = obj.fullName.split('/')[0]
                    return (
                        <li key={index} className={'autocomplete-item' + (index === active ? ' active' : '')}
                            onMouseDown={() => pickEntry()}
                            onMouseEnter={(e) => handleEnter(e, index)}
                        >
                            <img className='avatar' src={`https://github.com/${userName}.png`} alt='' />
                            <span>{obj.fullName}</span>
                            {index === active ? <div className='enter-info'><EnterOutlined />Enter</div> : ''}
                        </li>
                    )
                })
            }
            <div className='instruction'>
                <span className='nav'>
                    <span className='highlight'>TAB</span>
                    <span className='highlight'><ArrowUpOutlined /></span>
                    <span className='highlight'><ArrowDownOutlined /></span>
                    <span className='text'>To Navigate</span>
                </span>
                <span className='cancel'>
                    <span className='highlight'>ESC</span>
                    <span className='text'>To Cancel</span>
                </span>
                <span className='enter'>
                    <span className='highlight'><EnterOutlined /></span>
                    <span className='text'>To Enter</span>
                </span>
            </div>
        </div>
    )
}
