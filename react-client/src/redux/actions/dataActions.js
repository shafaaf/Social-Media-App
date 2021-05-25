import axios from "axios";
import {LIKE_POST, LOADING_DATA, SET_DATA_ERRORS, SET_POSTS, UNLIKE_POST} from "../types";

export const getAllPosts = () => (dispatch) => {
    dispatch({type: LOADING_DATA});
    axios.get(`http://localhost:5000/social-media-app-22252/us-central1/api/posts`)
        .then(res => {
            dispatch({
                type: SET_POSTS,
                payload: res.data
            });
        })
        .catch((err) => {
            if (err.response) {
                console.error(err.response.data);
                dispatch({
                    type : SET_DATA_ERRORS,
                    payload: err.response.data
                });
            } else {
                dispatch({
                    type : SET_DATA_ERRORS,
                    payload: {
                        "general" : "Cannot connect due to network issue."
                    }
                });
            }
        });
}

export const likePost = (postId) => (dispatch) => {
    axios
        .post(`http://localhost:5000/social-media-app-22252/us-central1/api/posts/${postId}/like`)
        .then((res) => {
            dispatch({
                type: LIKE_POST,
                payload: res.data
            });
        })
        .catch((err) => {
            // TODO: Catch errors here
            console.log(err);
        });
};

export const unlikePost = (postId) => (dispatch) => {
    axios
        .post(`http://localhost:5000/social-media-app-22252/us-central1/api/posts/${postId}/unlike`)
        .then((res) => {
            dispatch({
                type: UNLIKE_POST,
                payload: res.data
            });
        })
        .catch((err) => {
            // TODO: Catch errors here
            console.log(err);
        });
};
