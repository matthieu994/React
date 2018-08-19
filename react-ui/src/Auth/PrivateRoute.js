import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';
import verifAuth from './verifAuth';

class PrivateRoute extends Component {
    state = {
        loading: true,
        isAuthenticated: false,
    }

    componentWillUpdate() {
        verifAuth().then((isAuthenticated) => {
            this.setState({
                loading: false,
                isAuthenticated,
            });
        });
    }

    componentDidMount() {
        verifAuth().then((isAuthenticated) => {
            this.setState({
                loading: false,
                isAuthenticated,
            });
        });
    }

    render() {
        const { component: Component, ...rest } = this.props;
        if (this.state.loading) {
            return (<div>LOADING</div>)
        } else {
            return (
                <Route {...rest} render={props => (
                    <div>
                        {!this.state.isAuthenticated && <Redirect to={{ pathname: '/login', state: { from: this.props.location } }} />}
                        <Component {...this.props} />
                    </div>
                )}
                />
            )
        }
    }
}
// var PrivateRoute = ({ component: Component, ...rest }) => {
//     let isAuth;
//     verifAuth().then((res) => { isAuth = res });

//     return (
//         <Route {...rest} render={(props) => (
//             isAuth
//                 ? <Component {...props} />
//                 : <Redirect to={{
//                     pathname: '/login',
//                     state: { from: props.location }
//                 }} />
//         )} />
//     )

// }

export default PrivateRoute;