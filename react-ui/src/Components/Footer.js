import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import apps from './apps.json'

class Footer extends Component {
    render() {
        return (
            <footer className="page-footer text-light p-3">
                <div className="container-fluid text-center">
                    <div className="row">
                        <h3 className="col font-weight-bold">Applications</h3>
                    </div>
                    <div className="row">
                        {
                            apps.map((app, index) =>
                                <div className="col" key={index}>
                                    <Link to={app.Component}>{app.title}</Link>
                                </div>
                            )
                        }
                    </div>
                </div>
            </footer>
        )
    }
}
export default withRouter(Footer)