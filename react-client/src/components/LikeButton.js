import React, {Component} from 'react';
import {connect} from "react-redux";
import {likePost, unlikePost} from "../redux/actions/dataActions";
import PropTypes from "prop-types";
import {Link} from "react-router-dom";

import FavoriteIcon from '@material-ui/icons/Favorite';
import {FavoriteBorder} from "@material-ui/icons";
import withStyles from "@material-ui/core/styles/withStyles";

const styles = {
    favoriteIconClickable: {
        cursor: 'pointer'
    }
};

class LikeButton extends Component {
    likedPost = () => {
        if (
            this.props.user.likes.length > 0 &&
            this.props.user.likes.find(
                (like) => like.postId === this.props.postId
            )
        ) {
            return true;
        }
        else return false;
    };

    likePost = () => {
        this.props.likePost(this.props.postId);
    };
    unlikePost = () => {
        this.props.unlikePost(this.props.postId);
    };

    render() {
        const {classes} = this.props;

        const { authenticated } = this.props.user;
        const likeButton = !authenticated ? (
            <Link to="/login">
                <FavoriteBorder color="primary" />
            </Link>
        ) : this.likedPost() ? (
            <FavoriteIcon
                color="primary"
                className={classes.favoriteIconClickable}
                onClick={this.unlikePost}
            />
        ) : (
            <FavoriteBorder
                color="primary"
                className={classes.favoriteIconClickable}
                onClick={this.likePost}/>
        );
        return likeButton;
    }

}

const mapStateToProps = (state) => ({
    user: state.user
});

const mapActionsToProps = {
    likePost,
    unlikePost
};

LikeButton.propTypes = {
    classes: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    likePost: PropTypes.func.isRequired,
    unlikePost: PropTypes.func.isRequired,
    postId: PropTypes.string.isRequired,
};

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(LikeButton));
