import {
    SET_UI_ERRORS,
    CLEAR_UI_ERRORS,
    LOADING_UI,
    SET_AUTHENTICATED,
    SET_UNAUTHENTICATED,
    LOADING_USER, SET_USER_ERRORS
} from "../types";
import axios from "axios";

export const loginUser = (userData, history) => (dispatch) => {
    dispatch({type: LOADING_UI});
    axios.post(`http://localhost:5000/social-media-app-22252/us-central1/api/login`, userData)
        .then(res => {
            setAuthorizationHeader(res.data.token);
            dispatch(getUserData());
            dispatch({type : CLEAR_UI_ERRORS});
            history.push("/");
        })
        .catch(err => {
            if (err.response) {
                console.error(err.response.data);
                dispatch({
                    type : SET_UI_ERRORS,
                    payload: err.response.data
                });
            } else {
                console.error(err);
                dispatch({
                    type : SET_UI_ERRORS,
                    payload: {
                        "general" : "Cannot connect due to network issue."
                    }
                });
            }
        });
}

export const signupUser = (newUserData, history) => (dispatch) => {
    dispatch({type: LOADING_UI});
    axios.post(`http://localhost:5000/social-media-app-22252/us-central1/api/signup`, newUserData)
        .then(res => {
            setAuthorizationHeader(res.data.token);
            dispatch(getUserData());
            dispatch({type : CLEAR_UI_ERRORS});
            history.push("/");
        })
        .catch(err => {
            if (err.response) {
                console.error(err.response.data);
                dispatch({
                    type : SET_UI_ERRORS,
                    payload: err.response.data
                });
            } else {
                console.error(err);
                dispatch({
                    type : SET_UI_ERRORS,
                    payload: {
                        "general" : "Cannot connect due to network issue."
                    }
                });
            }
        });
}

export const logoutUser = () => (dispatch) => {
    removeAuthorizationHeader();
    dispatch({
        type: SET_UNAUTHENTICATED,
    });
}

export const getUserData = () => (dispatch) => {
    dispatch({type: LOADING_USER});
    console.log("HERE1");
    axios.get(`http://localhost:5000/social-media-app-22252/us-central1/api/user`)
        .then(res => {
            console.log("HERE2");
            dispatch({
               type: SET_AUTHENTICATED,
               payload: res.data
            });
        })
        .catch((err) => {
            console.log("HERE3: err is: ", err);
            if (err.response) {
                console.error(err.response.data);
                dispatch({
                    type : SET_USER_ERRORS,
                    payload: err.response.data
                });
            } else {
                dispatch({
                    type : SET_USER_ERRORS,
                    payload: {
                        "general" : "Cannot connect due to network issue."
                    }
                });
            }
        });
}

export const uploadImage = (formData) => (dispatch) => {
    dispatch({type: LOADING_USER});
    axios.post(`http://localhost:5000/social-media-app-22252/us-central1/api/user/image`, formData)
        .then(() => {
            dispatch(getUserData());
        })
        .catch((err) => {
            console.error(err);
        });
}

export const editUserData = (userData) => (dispatch) => {
    dispatch({type: LOADING_USER});
    axios.post(`http://localhost:5000/social-media-app-22252/us-central1/api/user/`, userData)
        .then(() => {
            dispatch(getUserData());
        })
        .catch((err) => {
            console.error(err);
        });
}

export const setAuthorizationHeader = (token) => {
    const fireBaseAuthToken =  `Bearer ${token}`;
    localStorage.setItem('FireBaseAuthToken', fireBaseAuthToken);
    axios.defaults.headers.common['Authorization'] = fireBaseAuthToken;
};


export const removeAuthorizationHeader = () => {
    localStorage.removeItem('FireBaseAuthToken');
    delete axios.defaults.headers.common['Authorization'];
};
