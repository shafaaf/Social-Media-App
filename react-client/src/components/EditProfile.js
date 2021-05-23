import React, {Component, Fragment} from 'react';
import {connect} from "react-redux";
import withStyles from "@material-ui/core/styles/withStyles";
import {editUserData} from "../redux/actions/userActions";
import PropTypes from "prop-types";
import {Dialog, DialogActions, DialogContent, DialogTitle, TextField, Tooltip} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import EditIcon from "@material-ui/icons/Edit";

const styles = {
    textField: {
        marginTop: '10%'
    }
};

class EditProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            bio: '',
            website: '',
            location: '',
            open: false
        };
    }

    componentDidMount() {
        const {credentials} = this.props.user;
        this.mapUserDetailsToState(credentials);
    }

    mapUserDetailsToState(credentials) {
        this.setState({
            bio: credentials.bio ? credentials.bio : '',
            website: credentials.website ? credentials.website : '',
            location: credentials.location ? credentials.location : ''
        });
    }

    handleOpen = () => {
        console.log("Hi");
        this.mapUserDetailsToState(this.props.user.credentials);
        this.setState({ open: true });
    }

    handleClose = () => {
        this.setState({ open: false });
    };

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        });
    };

    handleSave = () => {
        const userDetails = {
            bio: this.state.bio,
            website: this.state.website,
            location: this.state.location
        };
        this.props.editUserData(userDetails);
        this.handleClose();
    };

    render() {
        const { classes } = this.props;
        const { open } = this.state;
        return (
            <Fragment>
                <Tooltip title="Edit profile" placement="left">
                    <EditIcon color="primary" onClick={this.handleOpen}/>
                </Tooltip>

                <Dialog
                    open={open}
                    onClose={this.handleClose}
                    fullWidth
                    maxWidth="sm"
                >
                    <DialogTitle>Edit your details</DialogTitle>
                    <DialogContent>
                        <form>
                            <TextField
                                name="bio"
                                tpye="text"
                                label="Bio"
                                multiline
                                rows="3"
                                placeholder="A short bio about yourself"
                                className={classes.textField}
                                value={this.state.bio}
                                onChange={this.handleChange}
                                fullWidth
                            />
                            <TextField
                                name="website"
                                tpye="text"
                                label="Website"
                                placeholder="Your personal/professinal website"
                                className={classes.textField}
                                value={this.state.website}
                                onChange={this.handleChange}
                                fullWidth
                            />
                            <TextField
                                name="location"
                                tpye="text"
                                label="Location"
                                placeholder="Where you live"
                                className={classes.textField}
                                value={this.state.location}
                                onChange={this.handleChange}
                                fullWidth
                            />
                        </form>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={this.handleSave} color="primary">
                            Save
                        </Button>
                    </DialogActions>
                </Dialog>
            </Fragment>

        );
    }
}

const MapStateToProps = (state) => {
    return {
        user: state.user
    };
};

const MapActionsToProps = {
    editUserData
};

EditProfile.propTypes = {
    classes: PropTypes.object.isRequired,
    editUserData: PropTypes.func.isRequired,
};


export default connect(MapStateToProps, MapActionsToProps)(withStyles(styles)(EditProfile));
