import {LIKE_POST, LOADING_USER, SET_AUTHENTICATED, SET_UNAUTHENTICATED, SET_USER_ERRORS, UNLIKE_POST} from "../types";

const initialState = {
    authenticated: false,
    loading: false,
    credentials: {},
    likes: [],
    notifications: [],
    errors: {}
};

export default function userReducer (state = initialState, action) {
    switch (action.type) {
        case SET_AUTHENTICATED:
            return {
                authenticated: true,
                loading: false,
                errors: {},
                ...action.payload
            }
        case SET_UNAUTHENTICATED:
            return initialState;
        case LOADING_USER:
            return {
                ...state,
                loading: true
            };
        case LIKE_POST:
            return {
                ...state,
                likes: [
                    ...state.likes,
                    {
                        userHandle: state.credentials.handle,
                        postId: action.payload.postId
                    }
                ]
            };
        case UNLIKE_POST:
            return {
                ...state,
                likes: state.likes.filter(
                    (like) => like.postId !== action.payload.postId
                )
            };
        case SET_USER_ERRORS:
            return {
                ...state,
                loading: false,
                errors: action.payload
            };
        default:
            return state;
    }
}
