/* eslint-disable import/prefer-default-export */
// /userinfo/2144/id => ['/userinfo','/useinfo/2144,'/userindo/2144/id']
export const urlToList = (url: string) => {
  const urllist = url.split('/').filter(i => i);
  return urllist.map((...args: any[]) => {
    return `/${urllist.slice(0, args[1] + 1).join('/')}`;
  });
};
