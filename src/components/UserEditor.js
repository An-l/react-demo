import React, {PropTypes} from 'react'
import {
    Form,
    Input,
    InputNumber,
    Select,
    Button,
    message
} from 'antd';

import request, {get} from '../utils/request'

const FormItem = Form.Item;
const formLayout = {
    labelCol: {
        span: 4
    },
    wrapperCol: {
        span: 16
    }
};

class UserEditor extends React.Component {

    static contextTypes = {
        router: PropTypes.object.isRequired
    };

    handleSubmit(e) {
        e.preventDefault();

        const {form, editTarget} = this.props;

        this.props.form.validateFields((err, values) => {
            if (!err) {
                // 默认为添加组件
                let editType = '添加';
                let apiUrl = 'http://localhost:3000/user';
                let method = 'post';

                // 检查是否收到一个editTarget的props来判断这次的操作是添加操作还是编辑操作
                if (editTarget) {
                    editType = '编辑';
                    apiUrl += '/' + editTarget.id;
                    method = 'put';
                }

                request(method, apiUrl, {
                    name: name.value,
                    age: age.value,
                    gender: gender.value
                }).then((res) => {
                    if (res.id) {
                        alert(editType + '用户成功');
                        this.context.router.push('/user/list');
                        return;
                    } else {
                        alert(editType + '失败');
                    }
                }).catch((err) => console.error(err));
            } else {
                message.warn(err);
            }
        });
    }

    // 在UserEditor加载的时候检查是否存在props.editTarget
    // 如果存在，使用props.setFormValues方法将editTarget的值设置到表单
    componentDidMount() {
        const {editTarget, form} = this.props;
        if (editTarget) {
            form.setFieldsValue(editTarget);
        }
    }

    render() {
        const {form} = this.props;
        const {getFieldDecorator} = form;
        return (
            <div style={{
                width: '400px'
            }}>
                <Form onSubmit={(e) => this.handleSubmit(e)}>
                    <FormItem label="用户名：" {...formLayout}>
                        {getFieldDecorator('name', {
                            rules: [
                                {
                                    required: true,
                                    message: '请输入用户名'
                                }, {
                                    pattern: /^.{1,4}$/,
                                    message: '用户名最多4个字符'
                                }
                            ]
                        })(<Input type="text"/>)}
                    </FormItem>
                    <FormItem label="年龄：" {...formLayout}>
                        {getFieldDecorator('age', {
                            rules: [
                                {
                                    required: true,
                                    message: '请输入年龄',
                                    type: 'number'
                                }, {
                                    min: 1,
                                    max: 100,
                                    message: '请输入1~100的年龄',
                                    type: 'number'
                                }
                            ]
                        })(<InputNumber/>)}
                    </FormItem>
                    <FormItem label="性别：" {...formLayout}>
                        {getFieldDecorator('gender', {
                            rules: [
                                {
                                    required: true,
                                    message: '请选择性别'
                                }
                            ]
                        })(
                            <Select placeholder="请选择">
                                <Select.Option value="male">男</Select.Option>
                                <Select.Option value="female">女</Select.Option>
                            </Select>
                        )}
                    </FormItem>
                    <FormItem wrapperCol={{
                        ...formLayout.wrapperCol,
                        offset: formLayout.labelCol.span
                    }}>
                        <Button type="primary" htmlType="submit">提交</Button>
                    </FormItem>
                </Form>
            </div>
        );
    }
}

UserEditor = Form.create()(UserEditor);

export default UserEditor;
