import React, {Component} from 'react';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import {Link} from "react-router-dom";
import {connect} from "react-redux";
import withStyles from "@material-ui/core/styles/withStyles";
import PropTypes from "prop-types";

import HomeIcon from '@material-ui/icons/Home';
import NotificationsIcon from '@material-ui/icons/Notifications';
import AddIcon from '@material-ui/icons/Add';
import Grid from "@material-ui/core/Grid";

const styles = {

};

class Navbar extends Component {

    render() {
        const { authenticated } = this.props.user;
        if (authenticated) {
            return (
                <AppBar position="static">
                    <Toolbar className="toolbar">
                        <Grid container spacing={10}>
                            <Grid item>
                                <HomeIcon/>
                            </Grid>
                            <Grid item>
                                <AddIcon/>
                            </Grid>
                            <Grid item>
                                <NotificationsIcon/>
                            </Grid>
                        </Grid>

                        {/*<HomeIcon/>*/}
                        {/*<NotificationsIcon/>*/}
                        {/*<AddIcon/>*/}
                    </Toolbar>
                </AppBar>
            );
        } else {
            return (
                <AppBar position="static">
                    <Toolbar className="toolbar">
                        <Button color="inherit" component={Link} to='/login'>Login</Button>
                        <Button color="inherit" component={Link} to='/'>Home</Button>
                        <Button color="inherit" component={Link} to='/signup'>Signup</Button>
                    </Toolbar>
                </AppBar>
            );
        }

    }
}

const MapStateToProps = (state) => {
    return {
        user: state.user
    };
};

Navbar.propTypes = {
    classes: PropTypes.object.isRequired,
    user : PropTypes.object.isRequired
};


export default connect(MapStateToProps)(withStyles(styles)(Navbar));