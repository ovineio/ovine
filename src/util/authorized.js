import RenderAuthorized from '../component/authorized';
import { getAuthority } from './storage';

let Authorized = RenderAuthorized(getAuthority()); // eslint-disable-line

// Reload the rights component
export const reloadAuthorized = () => {
  Authorized = RenderAuthorized(getAuthority());
};

export default Authorized;
