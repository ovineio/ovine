import { MockSource } from '~/core/request'
import { getStore } from '~/utils/store'

// const store: any = {}

// 开发时使用的全部权限
const fakeLimit =
  '/dashboard,/hot_config,/hot_config/$page,/hot_config/viewItem,/hot_config/addItem,/hot_config/editItem,/hot_config/editConfig,/hot_config/delItem,/blog,/blog/article,/blog/comment,/system,/system/user_list,/system/user_limit,/system/user_log,/system/user_limit/$page,/system/user_limit/viewItem,/system/user_limit/addItem,/system/user_limit/editConfig,/system/user_limit/editItem,/system/user_limit/delItem,/start_demo,/start_demo/$page,/start_demo/viewItem,/start_demo/viewToken,/start_demo/editItem,/start_demo/addItem,/start_demo/delItem,/pages,/pages/simple,/pages/error,/pages/form,/form,/form/mode,/form/full,/form/static,/form/hint,/form/fieldset,/form/tabs,/form/fields-tabs,/form/remote,/form/reaction,/form/validation,/form/combo,/form/picker,/form/sub-form,/form/json-schema,/form/rich-text,/form/ide,/form/custom,/form/table,/form/formula,/form/definitions,/crud,/crud/table,/crud/grid,/crud/list,/crud/load-more,/crud/item-actions,/crud/columns,/crud/footable,/crud/nested,/crud/merge-cell,/crud/header-group,/crud/aside,/crud/fixed,/crud/keyboards,/crud/jump-next,/crud/load-once,/dialog,/dialog/simple,/dialog/drawer,/tabs,/tabs/normal,/tabs/form,/tabs/tab1,/tabs/tab2,/tabs/tab3,/linkpage,/linkpage/page,/linkpage/options-local,/linkpage/options,/linkpage/form,/linkpage/form2,/linkpage/crud,/services,/services/data,/services/schema,/services/form,/wizard,/horizontal,/chart,/carousel,/audio,/video,/task,/iframe,/sdk,/test'

const fakeUserData = {
  access_token: 'mock_token_123123',
  avatar: 'https://www.biaobaiju.com/uploads/20180225/23/1519573791-gcmpiQFtAk.jpg',
  nickname: '梦醒十分2',
  signature: '就知道睡觉～就知道睡觉～就知道睡觉～就知道睡觉～就知道睡觉～就知道睡觉～就知道睡觉～',
  limit: getStore('test_limit') || fakeLimit,
}

export const mockSource: MockSource<any, any> = {
  'POST api/v1/login': () => {
    return {
      code: 0,
      data: fakeUserData,
    }
  },
  'GET api/v1/user_info': () => {
    return {
      code: 0,
      data: fakeUserData,
    }
  },
}
