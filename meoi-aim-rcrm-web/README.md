# vue3 web 项目打包模板

> 使用 webpack5 构建的 vue3 项目，支持 js，ts，jsx，tsx 混编

目录结构

```
├── config  // 打包配置
├── public  // 静态资源文件
│   └── env
└── src
    ├── api // 接口
    ├── assets // 资源文件
    │   └── images
    ├── components // 公共组件
    ├── constants // 常量
    ├── hooks // 公共hooks
    ├── layout // 布局
    ├── lib // 三方包
    ├── router // 路由
    │   ├── guard // 路由钩子
    │   └── routes // 路由配置
    │       └── modules // 路由模块
    ├── store // 数据存储
    │   └── modules // 数据存储模块
    │       └── user
    ├── styles // 样式
    │   ├── base // 基础样式
    │   └── mixin // 混入样式
    ├── types // ts 类型
    ├── utils // 工具
    └── views // 视图
```

### 提示

1. 单独监听路由会浪费渲染性能。使用发布订阅模式去进行分发管理。
   utils/route-listener.ts 中导出了 listenerRouteChange，和 removeRouteListener 方法 来监听路由 和 移除路由监听

2. 项目中没有使用 vue-svg-loader，也不建议使用 vue-svg-loader，因为这个插件会将 svg 文件直接打包到代码中，增加代码的体积，直接使用 img 标签即可渲染 svg，也可以使用下面的方法

    components 中有一个 VueSvg 组件，它通过 fetch 来加载 svg 文件，可以将 svg 作为静态资源，而不是直接打包在代码中

```javascript
<template>
    <div>
        <vueSvg :path="require('./assets/vue.svg')" :width="100" :height="100"></vueSvg>
    </div>
</template>
<script setup>
    import vueSvg from './components/vueSvg.vue';
</script>
```
