import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react'
import axios from 'axios';
import { CirclePacking } from '@ant-design/plots';
import { LoadingOutlined } from '@ant-design/icons'
import './index.scss'
const linkMap = ['stars', 'issue-creators', 'pull-request-creators'];
const countryMap = {
    AD: 'Andorra',
    AE: 'United Arab Emirates',
    AF: 'Afghanistan',
    AG: 'Antigua and Barbuda',
    AI: 'Anguilla',
    AL: 'Albania',
    AM: 'Armenia',
    AO: 'Angola',
    AR: 'Argentina',
    AT: 'Austria',
    AU: 'Australia',
    AZ: 'Azerbaijan',
    BB: 'Barbados',
    BD: 'Bangladesh',
    BE: 'Belgium',
    BF: 'Burkina-faso',
    BG: 'Bulgaria',
    BH: 'Bahrain',
    BI: 'Burundi',
    BJ: 'Benin',
    BL: 'Palestine',
    BM: 'Bermuda Is.',
    BN: 'Brunei',
    BO: 'Bolivia',
    BR: 'Brazil',
    BS: 'Bahamas',
    BW: 'Botswana',
    BY: 'Belarus',
    BZ: 'Belize',
    CA: 'Canada',
    CF: 'Central African Republic',
    CG: 'Congo',
    CH: 'Switzerland',
    CK: 'Cook Is.',
    CL: 'Chile',
    CM: 'Cameroon',
    CN: 'China',
    CO: 'Colombia',
    CR: 'Costa Rica',
    CS: 'Czech',
    CU: 'Cuba',
    CY: 'Cyprus',
    CZ: 'Czech Republic',
    DE: 'Germany',
    DJ: 'Djibouti',
    DK: 'Denmark',
    DO: 'Dominica Rep.',
    DZ: 'Algeria',
    EC: 'Ecuador',
    EE: 'Estonia',
    EG: 'Egypt',
    ES: 'Spain',
    ET: 'Ethiopia',
    FI: 'Finland',
    FJ: 'Fiji',
    FR: 'France',
    GA: 'Gabon',
    GB: 'United Kiongdom',
    GD: 'Grenada',
    GE: 'Georgia',
    GF: 'French Guiana',
    GH: 'Ghana',
    GI: 'Gibraltar',
    GM: 'Gambia',
    GN: 'Guinea',
    GR: 'Greece',
    GT: 'Guatemala',
    GU: 'Guam',
    GY: 'Guyana',
    HK: 'Chinese Hongkong',
    HN: 'Honduras',
    HT: 'Haiti',
    HU: 'Hungary',
    ID: 'Indonesia',
    IE: 'Ireland',
    IL: 'Israel',
    IN: 'India',
    IQ: 'Iraq',
    IR: 'Iran',
    IS: 'Iceland',
    IT: 'Italy',
    JM: 'Jamaica',
    JO: 'Jordan',
    JP: 'Japan',
    KE: 'Kenya',
    KG: 'Kyrgyzstan',
    KH: 'Kampuchea (Cambodia )',
    KP: 'North Korea',
    KR: 'Korea',
    KT: 'Republic of Ivory Coast',
    KW: 'Kuwait',
    KZ: 'Kazakstan',
    LA: 'Laos',
    LB: 'Lebanon',
    LC: 'St.Lucia',
    LI: 'Liechtenstein',
    LK: 'Sri Lanka',
    LR: 'Liberia',
    LS: 'Lesotho',
    LT: 'Lithuania',
    LU: 'Luxembourg',
    LV: 'Latvia',
    LY: 'Libya',
    MA: 'Morocco',
    MC: 'Monaco',
    MD: 'Moldova, Republic of',
    MG: 'Madagascar',
    ML: 'Mali',
    MM: 'Burma',
    MN: 'Mongolia',
    MO: 'Chinese Macao',
    MS: 'Montserrat Is',
    MT: 'Malta',
    MU: 'Mauritius',
    MV: 'Maldives',
    MW: 'Malawi',
    MX: 'Mexico',
    MY: 'Malaysia',
    MZ: 'Mozambique',
    NA: 'Namibia',
    NE: 'Niger',
    NG: 'Nigeria',
    NI: 'Nicaragua',
    NL: 'Netherlands',
    NO: 'Norway',
    NP: 'Nepal',
    NR: 'Nauru',
    NZ: 'New Zealand',
    OM: 'Oman',
    PA: 'Panama',
    PE: 'Peru',
    PF: 'French Polynesia',
    PG: 'Papua New Cuinea',
    PH: 'Philippines',
    PK: 'Pakistan',
    PL: 'Poland',
    PR: 'Puerto Rico',
    PT: 'Portugal',
    PY: 'Paraguay',
    QA: 'Qatar',
    RO: 'Romania',
    RU: 'Russia',
    SA: 'Saudi Arabia',
    SB: 'Solomon Is',
    SC: 'Seychelles',
    SD: 'Sudan',
    SE: 'Sweden',
    SG: 'Singapore',
    SI: 'Slovenia',
    SK: 'Slovakia',
    SL: 'Sierra Leone',
    SM: 'San Marino',
    SN: 'Senegal',
    SO: 'Somali',
    SR: 'Suriname',
    ST: 'Sao Tome and Principe',
    SV: 'EI Salvador',
    SY: 'Syria',
    SZ: 'Swaziland',
    TD: 'Chad',
    TG: 'Togo',
    TH: 'Thailand',
    TJ: 'Tajikstan',
    TM: 'Turkmenistan',
    TN: 'Tunisia',
    TO: 'Tonga',
    TR: 'Turkey',
    TT: 'Trinidad and Tobago',
    TW: 'Chinese Taiwan',
    TZ: 'Tanzania',
    UA: 'Ukraine',
    UG: 'Uganda',
    US: 'United States of America',
    UY: 'Uruguay',
    UZ: 'Uzbekistan',
    VC: 'Saint Vincent',
    VE: 'Venezuela',
    VN: 'Vietnam',
    YE: 'Yemen',
    YU: 'Yugoslavia',
    ZA: 'South Africa',
    ZM: 'Zambia',
    ZR: 'Zaire',
    ZW: 'Zimbabwe',
}
const emptyArray = new Array(10).fill(undefined);
export default function ContriesInfo(props) {
    const isCompareMode = props[0] !== undefined && props[1] !== undefined;
    const repos = isCompareMode ? props : [props, {}];

    const [selected, setSelected] = useState(0);
    const [datas, setDatas] = useState([[], []]);

    useEffect(() => {
        setDatas([[], []])
        Promise.all([fetchData(0), fetchData(1)])
            .then(datas => setDatas([datas[0], datas[1]]))
            .catch(err => console.log(err))
    }, [props, selected])

    const fetchData = idx => {
        if (repos[idx].id) {
            return axios.get(`/api/q/${linkMap[selected]}-map?repoId=${repos[idx].id}`)
                .then(res => handleRawData(res.data.data, idx))
        } else {
            return []
        }
    }
    const handleRawData = (raw, idx) => {
        const handled = [];
        for (let item of raw) {
            handled.push({
                name: countryMap[item.country_or_area] + ' - ' + repos[idx].repo_name,
                value: item.count,
                proportion: item.percentage,
            })
        }
        return handled;
    }

    const config = {
        autoFit: true,
        padding: 0,
        data: { name: 'total', children: [...datas[0], ...datas[1]] },
        sizeField: 'r',
        pointStyle: ({ name }) => {
            if (name === 'total') return { fill: '#141414' }
            if (name.split(' - ')[1] === repos[0].repo_name) return { fill: '#dd6a65' }
            else return { fill: '#759aa0' }
        },
        theme: 'dark',
        label: {
            formatter: ({ name }) => {
                return name !== 'total' ? name.split(' - ')[0] : '';
            },
            offsetY: 12,
            style: {
                fontSize: 12,
                textAlign: 'center',
                fill: 'rgba(0,0,0,0.65)',
            },
        },
        legend: false,
    };

    return (
        <div className='country-info'>
            <h3>Geographical Distribution</h3>
            <p>Stargazers,Issue creators and Pull Request creators’ geographical distribution around the world.</p>
            <div className="dashboard-nav">
                <div className={'button ' + (selected === 0 ? 'active' : '')} onClick={() => setSelected(0)}>Stargazers</div>
                <div className={'button ' + (selected === 1 ? 'active' : '')} onClick={() => setSelected(1)}>Issue Creators</div>
                <div className={'button ' + (selected === 2 ? 'active' : '')} onClick={() => setSelected(2)}>Pull Requests Creators</div>
            </div>
            <div className={'dashboard ' + (isCompareMode ? 'compare-mode' : '')}>
                <div className="left-gragh">
                    <CirclePacking {...config} />
                </div>
                <div className="right-list">
                    <div className="list-title">Top 10 Geo-Locations</div>
                    <div className="list fl">
                        {isCompareMode ? <div className='repo-name'><span className='dot'></span><span>{repos[0].repo_name}</span></div> : ''}
                        {
                            datas[0].length ?
                                datas[0].map((val, idx) => {
                                    if (idx < 10) {
                                        return (
                                            <div key={idx} className="list-item">
                                                <span className='fl'>{val.name.split(' - ')[0]}</span>
                                                <span className='fr'>{Number(val.proportion * 100).toFixed(1)}%</span>
                                            </div>
                                        )
                                    }
                                }) :
                                emptyArray.map((_, idx) => {
                                    return (
                                        <div key={idx} className="list-item">
                                            <span className='fl'><LoadingOutlined className='yellow' /></span>
                                            <span className='fr'><LoadingOutlined className='yellow' /></span>
                                        </div>
                                    )
                                })
                        }
                    </div>
                    <div className="list fr">
                        {isCompareMode ?
                            <>
                                <div className='repo-name'><span className='dot'></span><span>{repos[1].repo_name}</span></div>
                                {
                                    datas[1].length ?
                                        datas[1].map((val, idx) => {
                                            if (idx < 10) {
                                                return (
                                                    <div key={idx} className="list-item">
                                                        <span className='fl'>{val.name.split(' - ')[0]}</span>
                                                        <span className='fr'>{Number(val.proportion * 100).toFixed(1)}%</span>
                                                    </div>
                                                )
                                            }
                                        }) :
                                        emptyArray.map((_, idx) => {
                                            return (
                                                <div key={idx} className="list-item">
                                                    <span className='fl'><LoadingOutlined className='yellow' /></span>
                                                    <span className='fr'><LoadingOutlined className='yellow' /></span>
                                                </div>
                                            )
                                        })}
                            </>
                            : ''
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}
