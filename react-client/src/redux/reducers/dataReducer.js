import {LIKE_POST, LOADING_DATA, SET_DATA_ERRORS, SET_POSTS, UNLIKE_POST} from "../types";

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
        case LIKE_POST:
        case UNLIKE_POST:
            let index = state.posts.findIndex(
                (post) => post.postId === action.payload.postId
            );
            state.posts[index] = action.payload;
            // if (state.post.postId === action.payload.postId) {
            //     state.post = action.payload;
            // }
            return {
                ...state
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
