import { Request } from '@/utils/request'

// 重写 request 参数
type ReqOptions = { url: string; api?: string; actionAddr?: string }
export class AppRequest<T = {}, K = {}> extends Request<T & ReqOptions, K> {}
