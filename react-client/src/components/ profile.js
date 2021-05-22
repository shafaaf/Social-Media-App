import React, {Component} from 'react';
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import {connect} from "react-redux";

const styles = {

};

class Profile extends Component {

    render() {
        const {user} = this.props;
        const {ui} = this.props;

        if (Object.keys(ui.errors).length > 0) {
            const errorList = Object.entries(ui.errors).map(([key, value]) => {
                return <p>{key} : {value}</p>
            });
            return (
                <div> Errors loading profile:
                    <ol>
                        {errorList.map((error, index) => (
                            <li key={index}>{error}</li>
                        ))}
                    </ol>
                </div>);
        }

        if (user.authenticated) {
            if (ui.loading) {
                return <p>Loading</p>;
            } else {
                return (
                    <div>
                        <img src={user.credentials.profilePicUrl} alt="profilePicUrl"/>
                        <p>Email: {user.credentials.email}</p>
                        <p>User handle: {user.credentials.handle}</p>
                        {user.credentials.bio? (<p>Bio: {user.credentials.bio}</p>) : null}
                        {user.credentials.website? (<p>Website: {user.credentials.website}</p>) : null}
                        {user.credentials.location? (<p>Location: {user.credentials.location}</p>) : null}
                    </div>
                );
            }
        } else {
            return <p>User not authenticated</p>;
        }
    }
}

const MapStateToProps = (state) => {
    return {
        user: state.user,
        ui: state.ui
    };
};

Profile.propTypes = {
    classes: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    ui : PropTypes.object.isRequired
};

export default connect(MapStateToProps)(withStyles(styles)(Profile));
