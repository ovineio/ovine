export type EnvType = 'local' | 'develop' | 'staging' | 'grey' | 'production';

export interface CommonConfig {
  env: EnvType;
  isMock: boolean;
  appTitle: string;
  description: string;
}

export interface EnvConfig {
  demoain: {
    api: string; // api 接口
  };
}

export interface Config extends CommonConfig, EnvConfig {

}
