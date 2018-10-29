import request, { RequestOptions } from './request';

export interface UploadOptions extends RequestOptions {
  body: FormData;
}

export const upload = async function(options: UploadOptions) {
  const source = await request(Object.assign({}, options, {
    method: 'POST',
  }));

  return source;
};
