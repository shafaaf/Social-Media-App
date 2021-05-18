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
import {loginUser} from '../redux/actions/userActions';

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

class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: ''
        };
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const userData = {
            email: this.state.email,
            password: this.state.password
        };
        this.props.loginUser(userData, this.props.history, this.props.changeAuthStatus);
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
                        <Typography variant="h2" className={classes.pageTitle}>Login</Typography>

                        <form noValidate onSubmit={this.handleSubmit}>
                            <TextField id="email" name="email" type="email" label="Email" className={classes.textField}
                                value={this.state.email} onChange={this.handleChange}
                                helperText={errors.email} error={errors.email ? true : false} fullWidth/>
                            <TextField id="password" name="password" type="password" label="Password" className={classes.textField}
                                value={this.state.password} onChange={this.handleChange}
                               helperText={errors.password} error={errors.password ? true : false} fullWidth/>

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
                                {loading === true ? <CircularProgress />: <span>Login</span>}
                            </Button>
                            <br/>
                            <br/>
                            <small>Dont have an account? Sign up <Link to='/signup'>here</Link></small>
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
    loginUser
};

Login.propTypes = {
    classes: PropTypes.object.isRequired,
    loginUser : PropTypes.func.isRequired,
    user : PropTypes.object.isRequired,
    ui : PropTypes.object.isRequired
};

export default connect(MapStateToProps, MapActionsToProps)(withStyles(styles)(Login));
