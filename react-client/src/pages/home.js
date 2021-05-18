import React, {Component} from 'react';
import Grid from "@material-ui/core/Grid";
import axios from "axios";
import Post from "../components/Post";

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            posts: null
        }
    }

    componentDidMount() {
        axios.get(`http://localhost:5000/social-media-app-22252/us-central1/api/posts`)
        .then(res => {
            this.setState({
                posts: res.data
            });
        })
        .catch(err => console.error(err));
    }

    showRecentPosts = () => {
        if (this.state.posts) {
            return this.state.posts.map((post) => {
                return <Post key={post.postId} post={post}/>;
            })
        } else {
            return <p>Loading</p>;
        }
    }

    render() {
        return (
            <Grid container spacing={10}>
                <Grid item sm={8} xs={12}>
                    {this.showRecentPosts()}
                </Grid>
                <Grid item sm={4} xs={12}>
                    <p>Profile</p>
                </Grid>
            </Grid>
        );
    }
}

export default Home;
