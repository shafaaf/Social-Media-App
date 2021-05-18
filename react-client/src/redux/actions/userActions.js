import {SET_ERRORS, CLEAR_ERRORS, LOADING_UI, SET_AUTHENTICATED} from "../types";
import axios from "axios";

export const loginUser = (userData, history, changeAuthStatus) => (dispatch) => {
    dispatch({type: LOADING_UI});
    axios.post(`http://localhost:5000/social-media-app-22252/us-central1/api/login`, userData)
        .then(res => {
            setAuthorizationHeader(res.data.token);
            dispatch(getUserData());
            dispatch({type : CLEAR_ERRORS});
            changeAuthStatus(true);
            history.push("/");
        })
        .catch(err => {
            if (err.response) {
                console.error(err.response.data);
                dispatch({
                    type : SET_ERRORS,
                    payload: err.response.data
                });
            } else {
                console.error(err);
                dispatch({
                    type : SET_ERRORS,
                    payload: {
                        "general" : "Cannot connect due to network issue."
                    }
                });
            }
        });
}

export const signupUser = (newUserData, history, changeAuthStatus) => (dispatch) => {
    dispatch({type: LOADING_UI});
    axios.post(`http://localhost:5000/social-media-app-22252/us-central1/api/signup`, newUserData)
        .then(res => {
            setAuthorizationHeader(res.data.token);
            dispatch(getUserData());
            dispatch({type : CLEAR_ERRORS});
            changeAuthStatus(true);
            history.push("/");
        })
        .catch(err => {
            if (err.response) {
                console.error(err.response.data);
                dispatch({
                    type : SET_ERRORS,
                    payload: err.response.data
                });
            } else {
                console.error(err);
                dispatch({
                    type : SET_ERRORS,
                    payload: {
                        "general" : "Cannot connect due to network issue."
                    }
                });
            }
        });
}

export const getUserData = () => (dispatch) => {
    axios.get(`http://localhost:5000/social-media-app-22252/us-central1/api/user`)
        .then(res => {
            dispatch({
               type: SET_AUTHENTICATED,
               payload: res.data
            });
        })
        .catch((err) => {
            console.error(err);
            // TODO: Handle error here by dispatching something
        });
}

const setAuthorizationHeader = (token) => {
    const fireBaseAuthToken =  `Bearer ${token}`;
    localStorage.setItem('FireBaseAuthToken', fireBaseAuthToken);
    axios.defaults.headers.common['Authorization'] = fireBaseAuthToken;
};
