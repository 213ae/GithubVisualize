import React, { useState } from 'react'
import { Select } from 'antd'
import { CaretDownOutlined } from '@ant-design/icons';
import { findIndex } from 'lodash'
import './index.scss'

const langs = ['All', 'JavaScript', 'Java', 'Python', 'PHP',
    'C++', 'C#', 'TypeScript', 'Shell', 'C', 'Ruby', 'Rust',
    'Go', 'Kotlin', 'HCL', 'PowerShell', 'CMake', 'Groovy',
    'PLpgSQL', 'TSQL', 'Dart', 'Swift', 'HTML', 'CSS', 'Elixir',
    'Haskell', 'Solidity', 'Assembly', 'R', 'Scala', 'Julia',
    'Lua', 'Clojure', 'Erlang', 'Common Lisp', 'Emacs Lisp',
    'OCaml', 'MATLAB', 'Objective-C', 'Perl', 'Fortan']

export default function LangSelector(props) {
    const { langsWidth, get } = props;
    const [activeIdx, setActiveIdx] = useState(0);

    const timeSelectConfig = {
        suffixIcon: <CaretDownOutlined />,
        defaultValue: "past_24_hours",
        className: 'period-select',
        onChange: val => get('period', val),
        options: [
            { value: 'past_24_hours', label: 'Past 24 hours' },
            { value: 'past_week', label: 'Past week' },
            { value: 'past_month', label: 'Past month' },
            { value: 'past_3_months', label: 'Past 3 months' },
        ]
    }

    let widthSum = 0, div = 0;
    for (; div < langs.length; div++) {
        widthSum += 40 + langs[div].length * 8;
        if (widthSum > langsWidth) break;
    }

    const langsDom = () => {
        return langs.map((lang, idx) => {
            if (idx < div) {
                return (
                    <span key={lang} className='lang-wrapper'>
                        <span className={'lang ' + (activeIdx === idx ? 'active' : '')}
                            onClick={() => { setActiveIdx(idx); get('language', langs[idx]); }}
                        >
                            {lang}
                        </span>
                    </span>
                )
            }
            return '';
        });
    }

    const selectDom = () => {
        if (div < langs.length) {
            const options = [];
            for (let j = div; j < langs.length; j++) {
                options.push({ value: langs[j], label: langs[j] });
            }

            const langSelectConfig = {
                value: activeIdx >= div ? langs[activeIdx] : undefined,
                suffixIcon: <CaretDownOutlined />,
                placeholder: "Others",
                className: 'lang-select ' + (activeIdx >= div ? 'active' : ''),
                popupClassName: 'langs-dropdown',
                options: options,
                onChange: val => {
                    const idx = div + findIndex(options, o => o.value === val);
                    setActiveIdx(idx);
                    get('language', langs[idx]);
                }
            }
            return <Select {...langSelectConfig} />
        }
    }

    return (
        <div className="lang-selector">
            <Select {...timeSelectConfig} />
            <label>Language : </label>
            <div className="langs">
                {langsDom()}
                {selectDom()}
            </div>
        </div>
    )
}
