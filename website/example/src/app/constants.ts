/**
 * 应用内常量模块
 */

export const prdPathPrefix = '/prd'

export const isPrdApp = window.location.pathname.indexOf(prdPathPrefix) > -1

// 用于存储的key
export const storeKeys = {
  auth: 'auth',
  rememberLogin: 'rememberLogin',
  schemaEditor: 'schemaEditor',
  testEditorSchema: 'testEditorSchema',
  debugProps: 'debugProps',
}

// 用于消息通知的 key
export const msgKeys = {
  updateAuthLoginCode: 'updateAuthLoginCode',
}

// 权限校验key
export const limitKeys = {
  global: {
    // 全局权限 是根据 app/routes/global 的 nodePath 与 limits 字段 key 拼接而成，其他的权限逻辑类似
    sysRoleIdPicker: '/_global/system/sysRoleIdPicker',
    sysUserInfoModal: '/_global/system/sysUserInfoModal',
  },
}

// 覆盖ovine内部的常量
export const appConstants = {
  routePrefix: '/demo/',
  loginRoute: '/login',
  enableBackTop: true,
  // toastDuration: 10000000,
}

export const amisConstants = {
  TEST: 100,
}

export const emptyListHolder = '暂无数据'
export const emptyListHolder1 = `
  <div class="text-center padder-v-lg" >
  <p class="m-b-none">
    <?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
    <svg style="width:80px;height:80px;" t="1605449509772" class="icon" viewBox="0 0 1167 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="14746" xmlns:xlink="http://www.w3.org/1999/xlink" width="227.9296875" height="200"><defs><style type="text/css"></style></defs><path d="M0 933.084112a583.775701 90.915888 0 1 0 1167.551402 0 583.775701 90.915888 0 1 0-1167.551402 0Z" fill="#F7F7F8" p-id="14747"></path><path d="M115.798131 602.915888l155.035514-195.229907V765.607477L115.798131 901.502804V602.915888zM1050.796262 593.345794l-172.261683-210.542056v417.256075l172.261683 101.442991V593.345794z" fill="#AEB8C2" p-id="14748"></path><path d="M258.392523 0m38.280374 0l583.775701 0q38.280374 0 38.280374 38.280374l0 736.897196q0 38.280374-38.280374 38.280374l-583.775701 0q-38.280374 0-38.280374-38.280374l0-736.897196q0-38.280374 38.280374-38.280374Z" fill="#F5F5F7" p-id="14749"></path><path d="M344.523364 86.130841m9.570094 0l459.364486 0q9.570093 0 9.570093 9.570094l0 220.112149q0 9.570093-9.570093 9.570094l-459.364486 0q-9.570093 0-9.570094-9.570094l0-220.112149q0-9.570093 9.570094-9.570094Z" fill="#DCE0E6" p-id="14750"></path><path d="M373.233645 430.654206h430.654205a19.140187 19.140187 0 0 1 19.140187 19.140187 19.140187 19.140187 0 0 1-19.140187 19.140186H373.233645a19.140187 19.140187 0 0 1-19.140187-19.140186 19.140187 19.140187 0 0 1 19.140187-19.140187zM373.233645 535.925234h430.654205a19.140187 19.140187 0 0 1 19.140187 19.140187 19.140187 19.140187 0 0 1-19.140187 19.140186H373.233645a19.140187 19.140187 0 0 1-19.140187-19.140186 19.140187 19.140187 0 0 1 19.140187-19.140187zM114.841121 602.915888h236.381309c43.065421 0 38.280374 80.388785 62.205607 86.130841s229.682243 5.742056 365.57757 0c18.183178-13.398131 8.613084-86.130841 45.936449-86.130841H1052.71028v296.672897a57.420561 57.420561 0 0 1-57.42056 57.420561H172.261682a57.420561 57.420561 0 0 1-57.420561-57.420561z" fill="#DCE0E6" p-id="14751"></path></svg>
  </p>
  <span class="text-muted">暂无数据</span>
  </div>
`
