import {LOADING_DATA, SET_DATA_ERRORS, SET_POSTS} from "../types";

const initialState = {
    posts: [],
    post: {},
    loading: false,
    errors: {}
};

export default function dataReducer (state = initialState, action) {
    switch (action.type) {
        case LOADING_DATA:
            return {
                ...state,
                loading: true
            };
        case SET_POSTS:
            return {
                ...state,
                posts: action.payload,
                loading: false,
                errors: {}
            };
        case SET_DATA_ERRORS:
            return {
                ...state,
                loading: false,
                errors: action.payload
            };
        default:
            return state;
    }
}
