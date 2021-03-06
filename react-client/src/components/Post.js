import React, {Component} from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import {Link} from "react-router-dom";

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import {connect} from "react-redux";
import PropTypes from "prop-types";
import LikeButton from "./LikeButton";
import ChatIcon from '@material-ui/icons/Chat';

const styles = {
    card: {
        position: 'relative',
        display: 'flex',
        marginBottom: 20
    },
    image: {
        minWidth: 200
    },
    content: {
        padding: 25,
        objectFit: 'cover'
    },
    grid: {
        textAlign: "center",
        margin: "0 auto"
    },
    iconWrapper: {
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap'
    }
};

class Post extends Component {
    render() {
       dayjs.extend(relativeTime);

        const {classes} = this.props;
        const {post} = this.props;

        return (
            <Card className={classes.card}>
                <CardMedia className={classes.image}
                    image={post.profilePicUrl}
                    title="User Profile Image"
                />
                <CardContent className={classes.content}>
                    <Typography variant="h5" color="primary" component={Link} to={`/users/${post.userHandle}`}>{post.userHandle}</Typography>
                    <Typography variant="body2" color="textSecondary">{dayjs(post.createdAt).fromNow()}</Typography>
                    <Typography variant="body1">{post.body}</Typography>

                    <br/>
                    <div className={classes.iconWrapper}>
                        <LikeButton postId={post.postId}/>
                        <span>&nbsp;{post.likeCount} Likes</span>
                    </div>
                    <br/>
                    <div className={classes.iconWrapper}>
                        <ChatIcon color="primary"/>
                        <span>&nbsp;{post.commentCount} Comments</span>
                    </div>

                </CardContent>
            </Card>
        );
    }
}

const MapStateToProps = (state) => {
    return {
        user: state.user
    };
};

Post.propTypes = {
    classes: PropTypes.object.isRequired,
    post: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
};

export default connect(MapStateToProps)(withStyles(styles)(Post));
