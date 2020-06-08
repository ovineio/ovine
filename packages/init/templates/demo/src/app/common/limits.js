/**
 * 定义自定义权限校验key
 */

export const limits = {
  global: {
    // 全局权限 是根据 app/routes/global 的 nodePath 与 limits 字段 key 拼接而成，其他的权限逻辑类似
    sysRoleIdPicker: '/_global/system/sysRoleIdPicker',
    sysUserInfoModal: '/_global/system/sysUserInfoModal',
  },
}
