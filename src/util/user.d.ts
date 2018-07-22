export interface UserInfo {
  avatar: string;
  name: string; // 登录账号
  menus: string[]; // 后端验证接口
  modules: string[]; // 前端所有权限数组
  nick_name: string; // 管理员用户昵称
  real_name: string; // 管理员用户真实名字
}

export function logout(): void;
