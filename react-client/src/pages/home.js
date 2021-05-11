import React, {Component} from 'react';
import Grid from "@material-ui/core/Grid";
import axios from "axios";

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
            console.log(res);
            this.setState({
                posts: res.data
            });
        })
        .catch(err => console.log(err));
    }

    render() {
        return (
            <Grid container spacing={10}>
                <Grid item sm={8} xs={12}>
                    <p>Content</p>
                </Grid>
                <Grid item sm={4} xs={12}>
                    <p>Profile</p>
                </Grid>
            </Grid>
        );
    }
}

export default Home;
