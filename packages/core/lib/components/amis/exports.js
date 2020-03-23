var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
// 请求返回值 格式转化
export const amisResAdapter = (res) => {
    console.log('==', res);
    const { code = 0, data: resData, msg, message } = res, rest = __rest(res, ["code", "data", "msg", "message"]);
    const response = {
        status: code,
        msg: msg || message || '',
        data: resData || rest,
    };
    return {
        data: response,
    };
};
