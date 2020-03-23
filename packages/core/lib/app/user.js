var AppUser = /** @class */ (function () {
    function AppUser() {
    }
    AppUser.prototype.isLogin = function () {
        return true;
    };
    AppUser.prototype.init = function () { };
    AppUser.prototype.logout = function () { };
    AppUser.prototype.login = function () { };
    AppUser.prototype.getToken = function () { };
    AppUser.prototype.getUserInfo = function () { };
    AppUser.prototype.onUserTokenError = function () { };
    return AppUser;
}());
export { AppUser };
