import React, {Component} from 'react';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';

import {Link} from "react-router-dom";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import store from "../redux/store";
import {logoutUser} from "../redux/actions/userActions";


class Navbar extends Component {

    render() {
        const {authenticated} = this.props;
        return (
            <AppBar position="static">
                <Toolbar className="toolbar">
                    <Button color="inherit" component={Link} to='/login'>Login</Button>
                    <Button color="inherit" component={Link} to='/'>Home</Button>
                    <Button color="inherit" component={Link} to='/signup'>Signup</Button>
                    {   authenticated &&
                        <Button color="inherit" onClick={() => {store.dispatch(logoutUser());}}>
                            Log Out
                        </Button>
                    }
                </Toolbar>
            </AppBar>
        );
    }
}

Navbar.propTypes = {
    authenticated: PropTypes.bool.isRequired
};

const MapStateToProps = (state) => {
    return {
        authenticated: state.user.authenticated
    };
};

export default connect(MapStateToProps)(Navbar);