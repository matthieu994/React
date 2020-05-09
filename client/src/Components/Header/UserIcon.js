import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import {
    Button,
    Fa,
    MDBDropdown,
    MDBDropdownItem,
    MDBDropdownToggle,
    MDBDropdownMenu,
    Dropdown,
} from "mdbreact";
import Axios from "axios";
import { DEFAULT_IMG } from "../../Const/const";

class UserIcon extends Component {
    state = {
        isMounted: false,
        user: [],
    };

    componentDidMount() {
        this.getData();

        this.unlisten = this.props.history.listen(() => {
            this.getData();
        });
    }

    getData() {
        Axios.get("/Profile/data").then((data) => {
            this.setState({ isMounted: true, user: data.data });
        });
    }

    componentWillUnmount() {
        this.unlisten();
    }

    logout() {
        localStorage.removeItem("token");
        this.props.history.push("/login");
    }

    redirectProfile() {
        this.props.history.push("/Profile");
    }

    render() {
        if (!this.state.isMounted) return null;

        return (
            <div className="user">
                <DropdownPage>
                    {this.props.location.pathname !== "/Profile" && (
                        <div className="user-buttons">
                            <span>{this.state.user.username}</span>
                            <img
                                src={this.state.user.image ? this.state.user.image : DEFAULT_IMG}
                                onClick={this.redirectProfile.bind(this)}
                                alt="profile"
                            />
                        </div>
                    )}
                </DropdownPage>
            </div>
        );
    }
}
export default withRouter(UserIcon);

const DropdownPage = (props) => {
    return (
        <MDBDropdown>
            <MDBDropdownToggle caret color="primary">
                {props.children}
            </MDBDropdownToggle>
            <MDBDropdownMenu basic>
                <MDBDropdownItem>Déconnexion</MDBDropdownItem>
            </MDBDropdownMenu>
        </MDBDropdown>
    );
};
