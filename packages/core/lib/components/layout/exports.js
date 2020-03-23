import { message } from "../../constants";
import { store } from "../../utils/message";
export var toggleLayoutLoading = function (toggle) {
    store[message.layoutSpinner] = toggle;
};
var pace = window.Pace;
export var togglePageLoadingBar = function (toggle) {
    if (toggle) {
        pace.restart();
    }
    else {
        pace.stop();
    }
};
