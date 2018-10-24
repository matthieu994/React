import { TOGGLE_LOGIN_MODAL } from "../constants/action-types";
import { combineReducers } from "redux";

const initialState = {
	loginModal: false
};

const toggleLoginModal = (state = initialState, action) => {
	switch (action.type) {
		case TOGGLE_LOGIN_MODAL:
			return Object.assign({}, state, { loginModal: !state.loginModal });
		default:
			return state;
	}
};

export default combineReducers({
	toggleLoginModal
	// test
});
