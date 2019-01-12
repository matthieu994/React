import * as actions from "../constants/action-types";

export const toggleLoginModal = () => ({ type: actions.TOGGLE_LOGIN_MODAL });
export const displayLoginModal = () => ({ type: actions.DISPLAY_LOGIN_MODAL });
export const hideLoginModal = () => ({ type: actions.HIDE_LOGIN_MODAL });

export const setAuth = bool => ({ type: bool });
