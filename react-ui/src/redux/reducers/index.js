import { combineReducers } from "redux";
import {
	TOGGLE_LOGIN_MODAL,
	DISPLAY_LOGIN_MODAL,
	HIDE_LOGIN_MODAL
} from "../constants/action-types";

const loginModalState = {
	loginModal: false
};
const toggleLoginModal = (state = loginModalState, action) => {
	switch (action.type) {
		case TOGGLE_LOGIN_MODAL:
			return Object.assign({}, state, { loginModal: !state.loginModal });
		case DISPLAY_LOGIN_MODAL:
			return Object.assign({}, state, { loginModal: true });
		case HIDE_LOGIN_MODAL:
			return Object.assign({}, state, { loginModal: false });
		default:
			return state;
	}
};

export default combineReducers({
	toggleLoginModal
	// test
});
