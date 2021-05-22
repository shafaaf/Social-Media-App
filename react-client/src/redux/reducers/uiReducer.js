import {SET_UI_ERRORS, CLEAR_UI_ERRORS, LOADING_UI} from "../types";

const initialState = {
    loading: false,
    errors: {}
};

export default function uiReducer (state = initialState, action) {
    switch (action.type) {
        case SET_UI_ERRORS:
            return {
                loading: false,
                errors: action.payload
            }
        case CLEAR_UI_ERRORS:
            return initialState;
        case LOADING_UI:
            return {
                ...state,
                loading: true
            };
        default:
            return state;
    }
}
