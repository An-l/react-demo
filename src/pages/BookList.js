import React, {PropTypes} from 'react'

import HomeLayout from '../layouts/HomeLayout'

class BookList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            bookList: []
        };
    }

    static contextTypes = {
      router: PropTypes.object.isRequired
    };

    componentWillMount() {
        fetch('http://localhost:3000/book')
            .then(res => res.json())
            .then(res => {
                this.setState({bookList: res});
            });
    }

    handleEdit (book) {
        this.context.router.push('/book/edit/' + book.id);
    }

    handleDel (book){
        const confirmed = confirm(`确定要删除图书 ${book.name} 吗？`);


        if (confirmed) {
            fetch('http://localhost:3000/book/' + book.id, {
                method: 'delete'
            })
                .then(res => res.json())
                .then(res => {
                    this.setState({
                        bookList: this.state.bookList.filter(item => item.id !== book.id)
                    });
                    alert('删除图书成功')
                })
                .catch(err => {
                    console.error(err);
                    alert('删除图书失败！')
                })
        }
    }

    render() {
        const {bookList} = this.state;

        return (
            <HomeLayout title='图书列表'>
                <table>
                    <thead>
                        <tr>
                            <th>图书ID</th>
                            <th>图书名</th>
                            <th>价格</th>
                            <th>作者</th>
                            <th>操作</th>
                        </tr>
                    </thead>

                    <tbody>
                        {bookList.map((book) => {
                            return (
                                <tr key={book.id}>
                                    <td>{book.id}</td>
                                    <td>{book.name}</td>
                                    <td>{book.price}</td>
                                    <td>{book.owner_id}</td>
                                    <td>
                                        <a href='javascript:void(0)'
                                            onClick={this.handleEdit.bind(this, book)}>
                                            编辑
                                        </a>
                                        &nbsp;
                                        <a href='javascript:void(0)'
                                            onClick={this.handleDel.bind(this, book)}>
                                            删除
                                        </a>
                                    </td>
                                </tr>
                            );
                        })
}
                    </tbody>
                </table>
            </HomeLayout>
        )
    }
}

export default BookList;
