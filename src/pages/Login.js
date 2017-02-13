import React, { PropTypes } from 'react'
import {Icon, Form, Input, Button, message} from 'antd'

import { post } from '../utils/request'
import formProvider from '../utils/formProvider'
import style from '../styles/login-page.css';

const FormItem = Form.Item;

class Login extends React.Component {
    constructor () {
        super();
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    static contextTypes = {
        router: PropTypes.object.isRequired
    }

    handleSubmit (e) {
        e.preventDefault();

        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                post('http://localhost:3000/login',values)
                    .then((res) => {
                        if (res) {
                            this.context.router.push('/');
                        } else {
                            alert('登录失败，账户或密码错误');
                        }
                    })
            }
        });


    }

    render () {
        const {form: {account, password}, onFormChange} = this.props;
        const { getFieldDecorator } = this.props.form;

        return (
            <div className={style.wrapper}>
                <div className={style.body}>
                    <header className={style.header}>
                        ReactManager
                    </header>

                    <section  className={style.form}>
                        <Form onSubmit={this.handleSubmit} className='login-form'>
                            <FormItem>
                                {
                                    getFieldDecorator('userName', {
                                        rules: [
                                            {
                                                required: true,
                                                 message: 'Please input your username!',
                                                 type: 'string'
                                             }
                                        ]
                                    })(
                                        <Input type='text' addonBefore={<Icon type="user" />} placeholder="Username" />
                                    )}
                            </FormItem>

                            <FormItem>
                                {
                                    getFieldDecorator('passWord', {
                                        rules: [
                                            {
                                                required: true,
                                                 message: 'Please input your Password!',
                                                 type: 'string'
                                             }
                                        ]
                                    })(
                                        <Input type='password' addonBefore={<Icon type="lock" />} placeholder="Password" />
                                    )}
                            </FormItem>

                             <Button className={style.btn} type="primary" htmlType="submit">Log in</Button>
                        </Form>
                    </section>
                </div>
            </div>
        )
    }
}

Login = Form.create()(Login);

export default Login;
