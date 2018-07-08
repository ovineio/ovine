import { getStore } from '../index';

export const logout = () => {
  const { dispatch } = getStore();
  dispatch({
    type: 'user/logout',
  });
};
