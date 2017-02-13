import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';

import HomePage from './pages/Home';
import LoginPage from './pages/Login';
import UserAddPage from './pages/UserAdd';
import UserEditPage from './pages/UserEdit';
import UserListPage from './pages/UserList';
import BookAddPage from './pages/BookAdd';
import BookEditPage from './pages/BookEdit';
import BookListPage from './pages/BookList';

import HomeLayout from './layouts/HomeLayout'

ReactDOM.render((
    <Router history={hashHistory}>
        <Route path='/' component={HomeLayout}>
            <IndexRoute component={HomePage} />
            <Route path='/login' component={LoginPage} />
            <Route path='/user/list' component={UserListPage} />
            <Route path='/user/add' component={UserAddPage} />
            <Route path='/user/edit/:id' component={UserEditPage} />
            <Route path='/book/list' component={BookListPage} />
            <Route path='/book/add' component={BookAddPage} />
            <Route path='/book/edit/:id' component={BookEditPage} />
        </Route>

    </Router>
    ),
    document.getElementById('app')
);
