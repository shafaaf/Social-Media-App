import React, {Component} from 'react';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';

import {Link} from "react-router-dom";
import PropTypes from "prop-types";


class Navbar extends Component {

    render() {
        const {authenticated, logoutOnClick} = this.props;
        return (
            <AppBar position="static">
                <Toolbar className="toolbar">
                    <Button color="inherit" component={Link} to='/login'>Login</Button>
                    <Button color="inherit" component={Link} to='/'>Home</Button>
                    <Button color="inherit" component={Link} to='/signup'>Signup</Button>
                    {   authenticated &&
                        <Button color="inherit" onClick={() => {logoutOnClick()}}>
                            Primary
                        </Button>

                    }
                </Toolbar>
            </AppBar>
        );
    }
}

Navbar.propTypes = {
    authenticated: PropTypes.bool.isRequired,
    logoutOnClick: PropTypes.func.isRequired
};

export default Navbar;
