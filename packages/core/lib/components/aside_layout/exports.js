import { message } from "../../constants";
import { store } from "../../utils/message";
export const toggleLayoutLoading = (toggle) => {
    store[message.layoutSpinner] = toggle;
};
const pace = window.Pace;
export const togglePageLoadingBar = (toggle) => {
    if (toggle) {
        pace.restart();
    }
    else {
        pace.stop();
    }
};
