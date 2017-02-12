import React, { PropTypes } from 'react'

import HomeLayout from '../layouts/HomeLayout'
import UserEditor from '../components/UserEditor'

class UserEdit extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            user: null
        };
    }

    static contextTypes = {
      router: PropTypes.object.isRequired
    };

    componentWillMount() {
        // 根据路由中名为id的参数（this.context.router.params.id）
        // 来调用接口获取用户数据（保存在this.state.user中）
        const userId = this.context.router.params.id;

        fetch('http://localhost:3000/user/' + userId)
            .then(res => res.json())
            .then(res => {
                this.setState({
                    user: res
                });
            })
    }

    render () {
        const {user} = this.state;

        return (
            <HomeLayout title='编辑用户'>
                {
                    // user数据未就绪时
                    // 当this.state.user有值时渲染UserEditor组件，否则显示文本“加载中…”
                    user ? <UserEditor editTarget={user} /> : '加载中...'
                }
            </HomeLayout>
        );
    }
}

export default UserEdit;
