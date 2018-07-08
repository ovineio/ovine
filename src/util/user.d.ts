export interface UserInfo {
  avatar: string;
  name: string; // 登录账号
  menus: string[]; // 后端验证接口
  modules: string[]; // 前端所有权限数组
  nick_name: string; // 用户昵称
}

export function logout(): void;
