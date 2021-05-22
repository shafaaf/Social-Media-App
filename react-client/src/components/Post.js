import React, {Component} from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import {Link} from "react-router-dom";

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';


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
                    // TODO: Show real profile image instead of placeholder image
                    image='https://i.stack.imgur.com/l60Hf.png'
                    title="User Profile Image"
                />
                <CardContent className={classes.content}>
                    <Typography variant="h5" color="primary" component={Link} to={`/users/${post.userHandle}`}>{post.userHandle}</Typography>
                    <Typography variant="body2" color="textSecondary">{dayjs(post.createdAt).fromNow()}</Typography>
                    <Typography variant="body1">{post.body}</Typography>
                </CardContent>

            </Card>
        );
    }
}

export default withStyles(styles)(Post);
