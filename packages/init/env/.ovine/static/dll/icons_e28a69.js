"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
/**
 * @file Icon
 * @description
 * @author fex
 */
var react_1 = tslib_1.__importDefault(require("react"));
// @ts-ignore
var close_svg_1 = tslib_1.__importDefault(require("../icons/close.js"));
exports.CloseIcon = close_svg_1.default;
// @ts-ignore
var undo_svg_1 = tslib_1.__importDefault(require("../icons/undo.js"));
exports.UnDoIcon = undo_svg_1.default;
// @ts-ignore
var redo_svg_1 = tslib_1.__importDefault(require("../icons/redo.js"));
exports.ReDoIcon = redo_svg_1.default;
// @ts-ignore
var enter_svg_1 = tslib_1.__importDefault(require("../icons/enter.js"));
exports.EnterIcon = enter_svg_1.default;
// @ts-ignore
var volume_svg_1 = tslib_1.__importDefault(require("../icons/volume.js"));
exports.VolumeIcon = volume_svg_1.default;
// @ts-ignore
var mute_svg_1 = tslib_1.__importDefault(require("../icons/mute.js"));
exports.MuteIcon = mute_svg_1.default;
// @ts-ignore
var play_svg_1 = tslib_1.__importDefault(require("../icons/play.js"));
exports.PlayIcon = play_svg_1.default;
// @ts-ignore
var pause_svg_1 = tslib_1.__importDefault(require("../icons/pause.js"));
exports.PauseIcon = pause_svg_1.default;
// @ts-ignore
var left_arrow_svg_1 = tslib_1.__importDefault(require("../icons/left-arrow.js"));
exports.LeftArrowIcon = left_arrow_svg_1.default;
// @ts-ignore
var right_arrow_svg_1 = tslib_1.__importDefault(require("../icons/right-arrow.js"));
exports.RightArrowIcon = right_arrow_svg_1.default;
// @ts-ignore
var check_svg_1 = tslib_1.__importDefault(require("../icons/check.js"));
exports.CheckIcon = check_svg_1.default;
// @ts-ignore
var plus_svg_1 = tslib_1.__importDefault(require("../icons/plus.js"));
exports.PlusIcon = plus_svg_1.default;
// @ts-ignore
var minus_svg_1 = tslib_1.__importDefault(require("../icons/minus.js"));
exports.MinusIcon = minus_svg_1.default;
// @ts-ignore
var pencil_svg_1 = tslib_1.__importDefault(require("../icons/pencil.js"));
exports.PencilIcon = pencil_svg_1.default;
// @ts-ignore
var view_svg_1 = tslib_1.__importDefault(require("../icons/view.js"));
// @ts-ignore
var remove_svg_1 = tslib_1.__importDefault(require("../icons/remove.js"));
// @ts-ignore
var retry_svg_1 = tslib_1.__importDefault(require("../icons/retry.js"));
// @ts-ignore
var upload_svg_1 = tslib_1.__importDefault(require("../icons/upload.js"));
// @ts-ignore
var file_svg_1 = tslib_1.__importDefault(require("../icons/file.js"));
// @ts-ignore
var success_svg_1 = tslib_1.__importDefault(require("../icons/success.js"));
// @ts-ignore
var fail_svg_1 = tslib_1.__importDefault(require("../icons/fail.js"));
// @ts-ignore
var search_svg_1 = tslib_1.__importDefault(require("../icons/search.js"));
// @ts-ignore
var back_svg_1 = tslib_1.__importDefault(require("../icons/back.js"));
// @ts-ignore
var move_svg_1 = tslib_1.__importDefault(require("../icons/move.js"));
// @ts-ignore
var info_svg_1 = tslib_1.__importDefault(require("../icons/info.js"));
// 兼容原来的用法，后续不直接试用。
// @ts-ignore
exports.closeIcon = react_1.default.createElement(close_svg_1.default, null);
// @ts-ignore
exports.unDoIcon = react_1.default.createElement(undo_svg_1.default, null);
// @ts-ignore
exports.reDoIcon = react_1.default.createElement(redo_svg_1.default, null);
// @ts-ignore
exports.enterIcon = react_1.default.createElement(enter_svg_1.default, null);
// @ts-ignore
exports.volumeIcon = react_1.default.createElement(volume_svg_1.default, null);
// @ts-ignore
exports.muteIcon = react_1.default.createElement(mute_svg_1.default, null);
// @ts-ignore
exports.playIcon = react_1.default.createElement(play_svg_1.default, null);
// @ts-ignore
exports.pauseIcon = react_1.default.createElement(pause_svg_1.default, null);
// @ts-ignore
exports.leftArrowIcon = react_1.default.createElement(left_arrow_svg_1.default, null);
// @ts-ignore
exports.rightArrowIcon = react_1.default.createElement(right_arrow_svg_1.default, null);
var iconFactory = {};
function getIcon(key) {
    return iconFactory[key];
}
exports.getIcon = getIcon;
function registerIcon(key, component) {
    iconFactory[key] = component;
}
exports.registerIcon = registerIcon;
registerIcon('close', close_svg_1.default);
registerIcon('undo', undo_svg_1.default);
registerIcon('redo', redo_svg_1.default);
registerIcon('enter', enter_svg_1.default);
registerIcon('volume', volume_svg_1.default);
registerIcon('mute', mute_svg_1.default);
registerIcon('play', play_svg_1.default);
registerIcon('pause', pause_svg_1.default);
registerIcon('left-arrow', left_arrow_svg_1.default);
registerIcon('right-arrow', right_arrow_svg_1.default);
registerIcon('prev', left_arrow_svg_1.default);
registerIcon('next', right_arrow_svg_1.default);
registerIcon('check', check_svg_1.default);
registerIcon('plus', plus_svg_1.default);
registerIcon('minus', minus_svg_1.default);
registerIcon('pencil', pencil_svg_1.default);
registerIcon('view', view_svg_1.default);
registerIcon('remove', remove_svg_1.default);
registerIcon('retry', retry_svg_1.default);
registerIcon('upload', upload_svg_1.default);
registerIcon('file', file_svg_1.default);
registerIcon('success', success_svg_1.default);
registerIcon('fail', fail_svg_1.default);
registerIcon('search', search_svg_1.default);
registerIcon('back', back_svg_1.default);
registerIcon('move', move_svg_1.default);
registerIcon('info', info_svg_1.default);
function Icon(_a) {
    var icon = _a.icon, rest = tslib_1.__rest(_a, ["icon"]);
    var Component = getIcon(icon);
    return Component ? (react_1.default.createElement(Component, tslib_1.__assign({}, rest))) : (react_1.default.createElement("span", { className: "text-danger" },
        "\u6CA1\u6709 icon ",
        icon));
}
exports.Icon = Icon;
//# sourceMappingURL=./components/icons.js.map
