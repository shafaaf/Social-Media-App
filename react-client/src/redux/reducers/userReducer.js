import {LOADING_USER, SET_AUTHENTICATED, SET_UNAUTHENTICATED} from "../types";

const initialState = {
    authenticated: false,
    loading: false,
    credentials: {},
    likes: [],
    notifications: []
};

export default function userReducer (state = initialState, action) {
    switch (action.type) {
        case SET_AUTHENTICATED:
            return {
                authenticated: true,
                loading: false,
                ...action.payload
            }
        case SET_UNAUTHENTICATED:
            return initialState;
        case LOADING_USER:
            return {
                ...initialState,
                loading: true
            };
        default:
            return state;
    }
}
