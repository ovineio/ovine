import { Request } from '@/utils/request'

type ReqOptions = { url: string; api?: string }
export class AppRequest<T = {}, K = {}> extends Request<T & ReqOptions, K> {}
