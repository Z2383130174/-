import React from 'react';
import ReactDOM from 'react-dom';
import { Route,HashRouter as Router,Switch, Redirect } from 'react-router-dom';
import {homeRoutes } from './router';
import App from './App'
ReactDOM.render(
  <Router>
    <Switch>
      <Route path="/admin" render={routeProps => <App{...routeProps}/>}/>
    {homeRoutes.map(route => { 
      return <Route key={route.path} {...route}/>
    })}
      <Redirect from="/" to="admin/accountManagement" />
    </Switch>
  </Router>,
    document.getElementById('root')
);
