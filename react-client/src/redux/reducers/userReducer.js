import {SET_AUTHENTICATED, SET_UNAUTHENTICATED} from "../types";

const initialState = {
    authenticated: false,
    credentials: {},
    likes: [],
    notifications: []
};

export default function userReducer (state = initialState, action) {
    switch (action.type) {
        case SET_AUTHENTICATED:
            return {
                authenticated: true,
                ...action.payload
            }
        case SET_UNAUTHENTICATED:
            return initialState;
        default:
            return state;
    }
}
