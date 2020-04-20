import store from "./store/index";
import { toggleLoginModal, setAuth } from "./actions/index";

window.store = store;
window.toggleLoginModal = toggleLoginModal;
window.setAuth = setAuth;
