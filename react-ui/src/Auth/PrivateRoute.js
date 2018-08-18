import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { verifAuth } from './verifAuth';

var PrivateRoute = ({ component: Component, ...rest }) => {
    let isAuth;
    verifAuth().then((res) => { isAuth = res });

    return (
        <Route {...rest} render={(props) => (
            isAuth
                ? <Component {...props} />
                : <Redirect to={{
                    pathname: '/login',
                    state: { from: props.location }
                }} />
        )} />
    )

}

export default PrivateRoute;