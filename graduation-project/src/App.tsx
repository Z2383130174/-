import React, { Component } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import { adminRoutes } from './router'
import Admin from './component/App/admin'

export default class App extends Component{
    render() {
        return (
            <Admin>
                <Switch>
                    {adminRoutes.map(route => (
                        route.routes ? route.routes.map((item:any) => (
                            <Route key={item.path} path={item.path} exact={ item.exact} render={routeProps => (
                                <item.component {...routeProps} />
                        )         
                            }/>
                        )
                        )     :<Route key={route.path} path={route.path} exact={ route.exact} render={routeProps => (
                                <route.component {...routeProps} />
                        )         
                            }/>
                    )
                    )}
                    <Redirect to={ adminRoutes[0].path} from="/admin"/>
                    <Redirect to='/404'/>
                </Switch>
            </Admin>
        )
    }
}
