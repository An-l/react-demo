import React, { PropTypes } from 'react'
import style from '../styles/home-page.css'

class Home extends React.Component {
    render () {
        return (
            <div className={style.welcome}>
                Welcome
            </div>
            // <HomeLayout title='Welcome'>
            //     <Link to="/user/list">用户列表</Link>
            //     <br/>
            //     <Link to="/user/add">添加用户</Link>
            //     <br/><hr/><br/>
            //     <Link to="/book/list">图书列表</Link>
            //     <br/>
            //     <Link to="/book/add">添加图书</Link>
            // </HomeLayout>
        )
    }
}

export default Home;
