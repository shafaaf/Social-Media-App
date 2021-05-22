import React, {Component} from 'react';
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import {connect} from "react-redux";
import CardContent from "@material-ui/core/CardContent";
import {Card, CardActionArea, CardActions} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import CardMedia from "@material-ui/core/CardMedia";

import CalendarToday from '@material-ui/icons/CalendarToday';
import LinkIcon from '@material-ui/icons/Link';
import LocationOn from '@material-ui/icons/LocationOn';

import dayjs from "dayjs";



const styles = {
    root: {
        maxWidth: 345,
    },
    media: {
        height: 140,
    },
    cardActionArea: {
        textAlign: 'center'
    },
    link: {
        color: 'inherit',
        textDecoration: 'none'
    }
};

class Profile extends Component {

    render() {
        const {classes} = this.props;
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
                    <Card className={classes.root}>
                        <CardActionArea className={classes.cardActionArea}>
                            <CardMedia
                                className={classes.media}
                                image={user.credentials.profilePicUrl}
                                title="Profile Picture"
                            />
                            <CardContent>
                                {
                                    user.credentials.handle &&
                                    <Typography gutterBottom variant="h5" component="h2">
                                        @{user.credentials.handle}
                                    </Typography>
                                }
                                {
                                    user.credentials.bio &&
                                    <Typography variant="body2" color="textSecondary" component="p">
                                        {user.credentials.bio}
                                    </Typography>
                                }
                                <br/>
                                {
                                    user.credentials.location &&
                                    <Typography variant="body2" color="textSecondary" component="p">
                                        <LocationOn fontSize = 'inherit' color="primary" /> {user.credentials.location}
                                    </Typography>
                                }
                                {
                                    user.credentials.website &&
                                    <Typography variant="body2" color="textSecondary" component="p">
                                        <LinkIcon fontSize = 'inherit' color="primary" />
                                        <a className={classes.link} href={user.credentials.website} target="_blank" rel="noopener noreferrer">
                                            {' '}
                                            {user.credentials.website}
                                        </a>
                                    </Typography>
                                }
                                {
                                    user.credentials.createdAt &&
                                    <Typography variant="body2" color="textSecondary" component="p">
                                        <CalendarToday fontSize="inherit" color="primary" />{' '}
                                        Joined {dayjs(user.credentials.createdAt).format('MMM YYYY')}
                                    </Typography>
                                }
                            </CardContent>
                        </CardActionArea>
                        <CardActions>
                            <Button size="small" color="primary">
                                Share
                            </Button>
                            <Button size="small" color="primary">
                                Learn More
                            </Button>
                        </CardActions>
                    </Card>
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
