import {
	DISPLAY_LOGIN_MODAL,
	TOGGLE_LOGIN_MODAL,
	HIDE_LOGIN_MODAL
} from "../constants/action-types";

export const toggleLoginModal = () => ({ type: TOGGLE_LOGIN_MODAL });
export const displayLoginModal = () => ({ type: DISPLAY_LOGIN_MODAL });
export const hideLoginModal = () => ({ type: HIDE_LOGIN_MODAL });
