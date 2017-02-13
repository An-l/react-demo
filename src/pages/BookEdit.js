import React, {PropTypes} from 'react'

import BookEditor from '../components/BookEditor'

import {get} from '../utils/request'

class BookEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            book: null
        };
    }

    static contextTypes = {
        router: PropTypes.object.isRequired
    };

    componentWillMount() {
        // 根据路由中名为id的参数（this.context.router.params.id）
        // 来调用接口获取用户数据（保存在this.state.book中）
        const bookId = this.context.router.params.id;

        get('http://localhost:3000/book/' + bookId).then(res => {
            this.setState({book: res});
        })
    }

    render() {
        const {book} = this.state;

        return (
        // user数据未就绪时
        // 当this.state.user有值时渲染BookEditor组件，否则显示文本“加载中…”
        book
            ? <BookEditor editTarget={book}/>
            : '加载中...');
    }
}

export default BookEdit;
