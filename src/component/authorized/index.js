import Authorized from './authorized';
import AuthorizedRoute from './authorizedRoute';
import Secured from './secured';
import check from './checkPermissions.js';

/* eslint-disable import/no-mutable-exports */
let CURRENT = 'NULL';

Authorized.Secured = Secured;
Authorized.AuthorizedRoute = AuthorizedRoute;
Authorized.check = check;

/**
 * use  authority or getAuthority
 * @param {string|()=>String} currentAuthority
 */
const renderAuthorize = (currentAuthority) => {
  CURRENT = currentAuthority;
  return Authorized;
};

export { CURRENT };
export default renderAuthorize;
