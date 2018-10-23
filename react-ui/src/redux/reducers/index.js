import { TOGGLE_LOGIN_MODAL } from "../constants/action-types";
const initialState = {
	loginModal: false
};

const rootReducer = (state = initialState, action) => {
	switch (action.type) {
		case TOGGLE_LOGIN_MODAL:
			return Object.assign({}, state, { loginModal: !state.loginModal });
		default:
			return state;
	}
};
export default rootReducer;
