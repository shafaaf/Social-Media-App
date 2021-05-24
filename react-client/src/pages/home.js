import React, {Component} from 'react';
import Grid from "@material-ui/core/Grid";
import axios from "axios";
import Post from "../components/Post";
import Profile from "../components/Profile";
import {CircularProgress} from "@material-ui/core";
import {connect} from "react-redux";
import PropTypes from "prop-types";
import {getAllPosts} from "../redux/actions/dataActions";

class Home extends Component {

    componentDidMount() {
        this.props.getAllPosts();
    }

    showRecentPosts = () => {
        const { posts, loading } = this.props.data;

        if (loading) {
            return <CircularProgress />;
        } else {
            return posts.map((post) => {
                return <Post key={post.postId} post={post}/>;
            })
        }
    }

    render() {
        return (
            <Grid container spacing={10}>
                <Grid item sm={8} xs={12}>
                    {this.showRecentPosts()}
                </Grid>
                <Grid item sm={4} xs={12}>
                    <Profile/>
                </Grid>
            </Grid>
        );
    }
}

const MapStateToProps = (state) => {
    return {
        data: state.data
    };
};

const MapActionsToProps = {
    getAllPosts
};

Home.propTypes = {
    getAllPosts: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired
};

export default connect(MapStateToProps, MapActionsToProps)(Home);
