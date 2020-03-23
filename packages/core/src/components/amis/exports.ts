// 请求返回值 格式转化
export const amisResAdapter = (res: any) => {
  console.log('==', res)
  const { code = 0, data: resData, msg, message, ...rest } = res
  const response = {
    status: code,
    msg: msg || message || '',
    data: resData || rest,
  }

  return {
    data: response,
  }
}
