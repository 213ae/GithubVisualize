import { LockOutlined, MobileOutlined, UserOutlined, MailOutlined } from '@ant-design/icons';
import { LoginForm, ProConfigProvider, ProFormCaptcha, ProFormText } from '@ant-design/pro-components';
import { message, Tabs } from 'antd';
import axios from 'axios';
import qs from 'querystring';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import serverAddress from '../../server_address';
import './index.scss';

export default function LoginPage() {
    const [loginType, setLoginType] = useState('login');
    const formRef = useRef();
    const navigate = useNavigate();

    return (
        <ProConfigProvider hashed={false}>
            <div style={{ backgroundColor: 'white' }}>
                <LoginForm
                    title="Insight"
                    subTitle="Github数据可视化系统"
                    formRef={formRef}
                    submitter={{
                        searchConfig: {
                            submitText: loginType === 'login' ? '登录' : '注册',
                        }
                    }}
                    onFinish={values => {
                        if (loginType === 'login') {
                            axios.post(`${serverAddress}/user/login?${qs.stringify(values)}`)
                                .then(res => {
                                    if (res.data.code === 0) {
                                        message.success(res.data.msg);
                                        localStorage.setItem('token', res.data.data);
                                        navigate('/')
                                    } else {
                                        message.error(res.data.msg);
                                    }
                                })
                        } else {
                            axios.post(`${serverAddress}/user/register`, values)
                                .then(res => {
                                    if (res.data.code === 0) {
                                        message.success(res.data.msg);
                                        navigate('/')
                                    } else {
                                        message.error(res.data.msg);
                                    }
                                })
                        }

                    }}>
                    <Tabs centered activeKey={loginType} onChange={(activeKey) => setLoginType(activeKey)}>
                        <Tabs.TabPane key={'login'} tab={'登录'} />
                        <Tabs.TabPane key={'register'} tab={'注册'} />
                    </Tabs>
                    {loginType === 'login' &&
                        (<>
                            <ProFormText name="username" fieldProps={{
                                size: 'large',
                                prefix: <UserOutlined className={'prefixIcon'} />,
                            }} placeholder={'请输入用户名'} rules={[
                                {
                                    required: true,
                                    message: '请输入用户名!',
                                },
                                {
                                    min: 5,
                                    message: '用户名长度过短!'
                                },
                                {
                                    validator: (_, val) =>
                                        new Promise((resolve, reject) => {
                                            axios.get(`${serverAddress}/user/check_name?username=${val}`)
                                                .then(res => {
                                                    if (res.data.code === 0) {
                                                        if (val) reject('用户名未注册!');
                                                        else resolve();
                                                    } else {
                                                        resolve();
                                                    }
                                                })
                                        })
                                }
                            ]} />
                            <ProFormText.Password name="password" fieldProps={{
                                size: 'large',
                                prefix: <LockOutlined className={'prefixIcon'} />,
                            }} placeholder={'请输入密码'} rules={[
                                {
                                    required: true,
                                    message: '请输入密码!',
                                },
                                {
                                    min: 6,
                                    message: '密码长度过短!'
                                }
                            ]} />
                        </>)
                    }
                    {loginType === 'register' &&
                        (<>
                            <ProFormText name="username" fieldProps={{
                                size: 'large',
                                prefix: <UserOutlined className={'prefixIcon'} />,
                            }} placeholder={'请输入用户名'} rules={[
                                {
                                    required: true,
                                    message: '请输入用户名!',
                                },
                                {
                                    min: 5,
                                    message: '用户名长度过短!'
                                },
                                {
                                    validator: (_, val) =>
                                        new Promise((resolve, reject) => {
                                            axios.get(`${serverAddress}/user/check_name?username=${val}`)
                                                .then(res => {
                                                    if (res.data.code === -1) {
                                                        reject('用户名已存在!');
                                                    } else {
                                                        resolve();
                                                    }
                                                })
                                        })
                                }
                            ]} />
                            <ProFormText.Password name="password" fieldProps={{
                                size: 'large',
                                prefix: <LockOutlined className={'prefixIcon'} />,
                            }} placeholder={'请输入密码'} rules={[
                                {
                                    required: true,
                                    message: '请输入密码!',
                                },
                                {
                                    min: 6,
                                    message: '密码长度过短!'
                                }
                            ]} />
                            <ProFormText.Password name="re_password" fieldProps={{
                                size: 'large',
                                prefix: <LockOutlined className={'prefixIcon'} />,
                            }} placeholder={'请再次输入密码'} rules={[
                                {
                                    required: true,
                                    message: '请再次输入密码!',
                                },
                                {
                                    validator: (_, val, callback) => {
                                        if (val && val !== formRef?.current?.getFieldValue('password')) {
                                            callback('两次输入密码不一致!');
                                        }
                                        callback();
                                    }
                                }
                            ]} />
                            <ProFormText fieldProps={{
                                size: 'large',
                                prefix: <MailOutlined className={'prefixIcon'} />,
                            }} name="mail" placeholder={'请输入邮箱'} rules={[
                                {
                                    required: true,
                                    message: '请输入邮箱!',
                                },
                                {
                                    pattern: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
                                    message: '邮箱格式错误!',
                                },
                                {
                                    validator: (_, val) =>
                                        new Promise((resolve, reject) => {
                                            axios.get(`${serverAddress}/user/check_mail?mail=${val}`,{})
                                                .then(res => {
                                                    if (res.data.code === -1) {
                                                        reject('邮箱已使用!');
                                                    } else {
                                                        resolve();
                                                    }
                                                })
                                        })
                                }
                            ]} />
                            <ProFormCaptcha fieldProps={{
                                size: 'large',
                                prefix: <LockOutlined className={'prefixIcon'} />,
                            }} captchaProps={{
                                size: 'large',
                            }} placeholder={'请输入验证码'} captchaTextRender={(timing, count) => {
                                if (timing) {
                                    return `${count} ${'获取验证码'}`;
                                }
                                return '获取验证码';
                            }} name="captcha" rules={[
                                {
                                    required: true,
                                    message: '请输入验证码!',
                                },
                                {
                                    validator: (_, val, callback) => {
                                        if (val && val !== '1234') {
                                            callback('验证码错误!');
                                        }
                                        callback();
                                    }
                                }
                            ]} onGetCaptcha={() => {
                                message.success('获取验证码成功!验证码为：1234');
                            }} />
                        </>)
                    }
                </LoginForm>
            </div>
        </ProConfigProvider>);
};