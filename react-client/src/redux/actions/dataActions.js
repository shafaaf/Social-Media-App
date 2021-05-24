import axios from "axios";
import {LOADING_DATA, SET_DATA_ERRORS, SET_POSTS} from "../types";

export const getAllPosts = () => (dispatch) => {
    dispatch({type: LOADING_DATA});
    axios.get(`http://localhost:5000/social-media-app-22252/us-central1/api/posts`)
        .then(res => {
            console.log("HERE: res is: ", res);
            dispatch({
                type: SET_POSTS,
                payload: res.data
            });
        })
        .catch((err) => {
            console.log("HERE: err is: ", err);
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
