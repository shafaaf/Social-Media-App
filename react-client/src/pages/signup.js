import React, {Component} from 'react';

import withStyles from '@material-ui/core/styles/withStyles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import TwitterIcon from'../images/twitter.jpeg';
import {CircularProgress, TextField} from "@material-ui/core";
import Button from '@material-ui/core/Button';
import {Link} from "react-router-dom";
import {connect} from "react-redux";
import {signupUser} from "../redux/actions/userActions";
import store from "../redux/store";
import {CLEAR_UI_ERRORS} from "../redux/types";

const styles = {
    form: {
        textAlign: 'center'
    },
    image: {
        width: '70%',
        margin: '-10% auto 10% auto'
    },
    pageTitle: {
        // margin: '-10% auto 10% auto'
    },
    textField: {
        margin: '5% auto 5% auto'
    },
    button : {
        marginTop: '5%'
    },
    generalError : {
        color: 'red'
    }
};

class Signup extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            confirmPassword: '',
            handle: ''
        };
    }

    componentDidMount() { // remove previous errors
        store.dispatch({
            type : CLEAR_UI_ERRORS
        });
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const newUserData = {
            email: this.state.email,
            password: this.state.password,
            confirmPassword: this.state.confirmPassword,
            handle: this.state.handle
        };
        this.props.signupUser(newUserData, this.props.history);
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name] : e.target.value
        })
    }

    render() {
        const {classes} = this.props;
        const {errors, loading} = this.props.ui;

        return (
            <div>
                <Grid container className={classes.form}>
                    <Grid item sm />
                    <Grid item sm>
                        <img src={TwitterIcon} alt='Twitter Icon' className={classes.image}/>
                        <Typography variant="h2" className={classes.pageTitle}>Signup</Typography>

                        <form noValidate onSubmit={this.handleSubmit}>
                            <TextField id="email" name="email" type="email" label="Email" className={classes.textField}
                                       value={this.state.email} onChange={this.handleChange}
                                       helperText={errors.email} error={errors.email ? true : false} fullWidth/>
                            <TextField id="password" name="password" type="password" label="Password" className={classes.textField}
                                       value={this.state.password} onChange={this.handleChange}
                                       helperText={errors.password} error={errors.password ? true : false} fullWidth/>
                             <TextField id="confirmPassword" name="confirmPassword" type="password" label="Confirm Password" className={classes.textField}
                                       value={this.state.confirmPassword} onChange={this.handleChange}
                                       helperText={errors.confirmPassword} error={errors.confirmPassword  ? true : false} fullWidth/>

                            <TextField id="handle" name="handle" type="text" label="Handle" className={classes.textField}
                                       value={this.state.handle} onChange={this.handleChange}
                                       helperText={errors.handle} error={errors.handle  ? true : false} fullWidth/>

                            {
                                errors.general && (
                                    <Typography variant="body2" className={classes.generalError}>
                                        {errors.general}
                                    </Typography>
                                )
                            }

                            <Button
                                type="submit" variant="contained" color="primary"
                                className={classes.button} disabled={loading}>
                                {loading === true ? <CircularProgress />: <span>Signup </span>}
                            </Button>
                            <br/>
                            <br/>
                            <small>Already have an account? Login <Link to='/login'>here</Link></small>
                        </form>


                    </Grid>
                    <Grid item sm />
                </Grid>

            </div>
        );
    }
}

const MapStateToProps = (state) => {
    return {
        user: state.user,
        ui: state.ui
    };
};

const MapActionsToProps = {
    signupUser
};

Signup.propTypes = {
    classes: PropTypes.object.isRequired,
    signupUser : PropTypes.func.isRequired,
    user : PropTypes.object.isRequired,
    ui : PropTypes.object.isRequired
};

export default connect(MapStateToProps, MapActionsToProps)(withStyles(styles)(Signup));
