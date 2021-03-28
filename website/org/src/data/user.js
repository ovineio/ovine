const users = [
  {
    title: 'OvineDemo',
    description: 'Ovine演示项目，用于展示ovine的一些基础使用方法。(可注册账号)',
    preview: require('./images/ovinedemo.png'),
    website: 'http://ovine.igroupes.com/demo/login',
    source: 'https://github.com/CareyToboo/ovine/website/example',
    tags: ['ovine'],
  },
  {
    title: 'OvineHerd',
    description:
      '一个完整的可在线建站平台项目，基于 qiankun 微服务架构。(体验账号: demo110/demo110)',
    preview: require('./images/ovineherd.png'),
    website: 'http://ovine.igroupes.com/platform/center/org/127350080645627904/login',
    source: 'https://github.com/CareyToboo/ovineherd',
    tags: ['ovine'],
  },
  {
    title: 'OvineData',
    description: '可在线管理各种基础数据的小工具，简单实用。(可注册账号)',
    preview: require('./images/ovinedata.png'),
    website: 'http://ovine.igroupes.com/demo/prd/login',
    source: 'https://github.com/CareyToboo/ovine/website/example',
    tags: ['ovine'],
  },
]

users.forEach((user) => {
  if (
    !user.preview ||
    (user.preview instanceof String &&
      (user.preview.startsWith('http') || user.preview.startsWith('//')))
  ) {
    throw new Error(
      `Bad user site image preview = ${user.preview}. The image should be hosted on Ovine site, and not use remote HTTP or HTTPS URLs`
    )
  }
})

export default users
