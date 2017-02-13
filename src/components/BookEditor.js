import React, { PropTypes } from 'react'

import formProvider from '../utils/formProvider'
import FormItem from '../components/FormItem'
import AutoComplete from './AotuComplete'

import request, {get} from '../utils/request'

class BookEditor extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            recommendUsers: []
        }
    }

    static contextTypes = {
      router: PropTypes.object.isRequired
    };

    handleSubmit(e) {
        e.preventDefault();

        const { form: {id, name, price, owner_id}, formValid, editTarget } = this.props;

        if(!formValid){
            alert('请填写正确的信息后重试');
            return;
        }

        // 默认为添加组件
        let editType = '添加';
        let apiUrl = 'http://localhost:3000/book';
        let method = 'post';

        // 检查是否收到一个editTarget的props来判断这次的操作是添加操作还是编辑操作
        if (editTarget) {
            editType = '编辑';
            apiUrl += '/' + editTarget.id;
            method = 'put';
        }

        request(method, apiUrl, {
            name: name.value,
            price: price.value,
            owner_id: owner_id.value
        })
            .then((res) => {
                if(res.id) {
                    alert(editType + '图书成功');
                    this.context.router.push('/book/list');
                    return;
                }else {
                    alert(editType + '失败');
                }
            })
            .catch((err) => console.error(err));

    }

    getRecommendUsers (partialUserId) {
        get('http://localhost:3000/user?id_like=' + partialUserId)
            .then((res) => {
                if (res) {
                    if (res.length === 1 && (res[0].id+'') === partialUserId) {
                         // 如果结果只有1条且id与输入的id一致，说明输入的id已经完整了，没必要再设置建议列表
                        return;
                    }

                    this.setState({
                        recommendUsers: res.map((user) => {
                            return {
                                text: `${user.id} (${user.name})`,
                                value: user.id + ''
                            }
                        })
                    });
                }
            });
    }

    timer = 0;
    handleOwnerIdChange (value) {
        this.props.onFormChange('owner_id', value);
        this.setState({
            recommendUsers: []
        });

        if (this.timer) {
            clearTimeout(this.timer);
        }

        if (value) {
            this.timer = setTimeout(() => {
                this.getRecommendUsers(value);
                this.timer = 0;
            }, 200);
        }
    }

    // 在BookEditor加载的时候检查是否存在props.editTarget
    // 如果存在，使用props.setFormValues方法将editTarget的值设置到表单
    componentWillMount() {
        const {editTarget, setFormValues} = this.props;
        if (editTarget) {
            setFormValues(editTarget);
        }
    }

    render () {
        const {recommendUsers} = this.state;
        const { form: {name, price, owner_id}, onFormChange } = this.props;

        return (
            // <HomeLayout title='添加用户'>
                <form onSubmit={(e) => this.handleSubmit(e)}>
                    <FormItem label='图书名：' valid={name.valid} error={name.error} >
                        <input type='text'
                            value={name.value}
                            onChange={(e) => onFormChange('name', e.target.value)} />
                    </FormItem>
                    <br/>

                    <FormItem label='价格：' valid={price.valid} error={price.error} >
                        <input type='number'
                            value={price.value}
                            onChange={(e) => onFormChange('price', e.target.value)} />
                    </FormItem>
                    <br/>

                    <FormItem label='作者：' valid={owner_id.valid} error={owner_id.error} >
                        {/* <input type='text'
                            value={owner_id.value}
                            onChange={(e) => onFormChange('owner_id', e.target.value)} /> */}
                        <AutoComplete
                            value={owner_id.value ? owner_id.value+'' : ''}
                            options={recommendUsers}
                            onValueChange={value => this.handleOwnerIdChange(value)} />
                    </FormItem>
                    <br/>
                    <br/>

                    <input type='submit' value='提交' />
                </form>
            // </HomeLayout>
        );
    }
}

BookEditor = formProvider({
    name: {
        defaultValue: '',
        rules: [
            {
                pattern: function (value) {
                    return value.length > 0;
                },
                error: '请输入图书名'
            },
            {
                pattern: /^.{1,14}$/,
                error: '图书名最多14个字符'
            }
        ]
    },
    price: {
        defaultValue: 0,
        rules: [
            {
                pattern: function (value) {
                    return value >= 0;
                },
                error: '请正确的价格'
            }
        ]
    },
    owner_id: {
        defaultValue: '',
        rules: [
            {
                pattern: function (value) {
                    return value.length > 0;
                },
                error: '请输入作者'
            }
        ]
    }
})(BookEditor);


export default BookEditor;
