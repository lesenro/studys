import dynamic from 'dva/dynamic';

// wrapper of dynamic
const dynamicWrapper = (app, models, component) => dynamic({
  app,
  models: () => models.map(m => import(`../models/${m}.js`)),
  component: () => component,
});

// nav data
export const getNavData = app => [
  {
    component: dynamicWrapper(app, ['users','login'], import('../layouts/BasicLayout')),
    layout: 'BasicLayout',
    name: '首页', // for breadcrumb
    path: '/',
    children: [
      {
        name: '管理首页',
        icon: 'home',
        path: 'home',
        code: "home",
        component: dynamicWrapper(app, [], import('../routes/Home')),
      },
      {
        name: '学习路径',
        icon: 'setting',
        path: 'examples',
        code: "examples",
        children: [
          {
            name: '一个黑方块',
            path: 'square',
            code:"admin:role",
            component: dynamicWrapper(app, ['roles'], import('../routes/examples/example_01/example_01')),
          },
        ],
      },
      {
        name: '异常',
        path: 'exception',
        hidden:true,
        icon: 'warning',
        children: [
          {
            name: '403',
            path: '403',
            component: dynamicWrapper(app, [], import('../routes/Exception/403')),
          },
          {
            name: '404',
            path: '404',
            component: dynamicWrapper(app, [], import('../routes/Exception/404')),
          },
          {
            name: '500',
            path: '500',
            component: dynamicWrapper(app, [], import('../routes/Exception/500')),
          },
        ],
      },   

    ],
  },
  {
    component: dynamicWrapper(app, [], import('../layouts/UserLayout')),
    path: '/user',
    hidden:true,
    layout: 'UserLayout',
    children: [
      {
        name: '帐户',
        icon: 'user',
        hidden:true,
        path: 'user',
        children: [
          {
            name: '登录',
            path: 'login',
            component: dynamicWrapper(app, ['login'], import('../routes/User/Login')),
          },
        ],
      },
    ],
  },
];
