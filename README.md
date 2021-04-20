文件结构

koa

环境区分

开发代码监听nodemon（supervisor较老），线上使用pm2

路由@koa/router

- 初始化
- api
- 渲染页面，koa-swig+co

静态资源：koa-static

真假路由：koa2-connect-history-api-fallback

容错处理

区分不支持es6的浏览器，用babel编译systmejs加载

> 模版冲突：swig配置项varControls: ['[[', ']]']
>
> npm i @babel/plugin-transform-modules-systemjs @babel/cli @babel/core -D

