import store from "./store/index";
import { toggleLoginModal } from "./actions/index";

window.store = store;
window.toggleLoginModal = toggleLoginModal;
