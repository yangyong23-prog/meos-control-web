---
name: notification
description: "Meri UI notification 组件技能。适用于查阅 notification 组件的用途、API、示例、注意事项与常见坑。"
---

# meri-ui-notification

用途:
- 通知提示。

API 要点:
- 属性:
| 名称     | 类型    | 可选值                                   | 默认值  |  是否必填  |说明                                                       |
| :------- | :------ | :---------------------------------------| :------ | :------ |:--------------------------------------------------------- |
| title     | string  |      —            |  — | 是  |标题 |
| type     | string  |      success / info/ error / warning            |  — | 否  |通知类型 |
| content     | string/Vue.VNode  |      —            |  — | 是  |通知栏正文内容 |
| dangerouslyUseHTMLString     | boolean  |     true / false            |  false | 否  |是否将 content 属性作为 HTML 片段处理 |
| customClass     | string  |      —            |  — | 否  |自定义类名 |
| duration     | number  |      —            |   5000 | 否  |显示时间, 单位为毫秒。 值为 0 则不会自动关闭 |
| position     | number  |     topLeft / topRight / bottomLeft / bottomRight         |   topRight | 否  |自定义弹出位置 |
| zIndex     | number  |     —            |   — | 否  |层级 |
| showClose     | boolean  |     true / false            |  true | 否  |是否显示关闭按钮 |
| onClick     | function  |     —            |  — | 否  |点击 Notification 时的回调函数 |
| onClose     | function  |     —            |  — | 否  |关闭时的回调函数 |
| offset     | number  |     —            |   — | 否  |相对屏幕顶部的偏移量 偏移的距离，在同一时刻，所有的 Notification 实例应当具有一个相同的偏移量 |
| appendTo     | HTMLElement  |     —            |  document.body| 否  |设置通知栏在 DOM 中的父元素 |
| footer     | array[footerParams]  |     —            |  —| 否  |设置底部操作按钮 |

| 名称     | 类型    | 可选值                                   | 默认值  |  是否必填  |说明                                                       |
| :------- | :------ | :---------------------------------------| :------ | :------ |:--------------------------------------------------------- |
| text     | string  |      —            |  — | 是  |按钮文本 |
| size     | string  |      large / medium / small            |  medium | 否  |按钮大小 |
| type     | string  |      default / primary / error / link / text            |  link | 否  |按钮类型 |
| action     | function  |      —            |  — | 否  |按钮点击后的回调close()可以关闭当前按钮 |

- 事件:
| 方法名    | 参数       | 说明         |
| :------ | :--------- | :----------- |
| onClick | (Notification) | 关闭指定的 Notification |

示例用法:
```vue
<template>
    <m-button @click="info(v)" v-for="(v,index) in dataList" :key="index">{{ v.title }}</m-button>
    <m-button @click="destroyAll">Destroy All</m-button>
    <m-button @click="open">Open Notification</m-button>
    <m-button @click="closeDefault">Close Notification</m-button>
</template>

<script lang="ts">
import { AnyTypeAnnotation } from '@babel/types';
import { defineComponent, h, ref } from 'vue';
import MNotification from "../index";

export default defineComponent({
    setup() {
        const notification:any = ref();
        const dataList:object[] = [
            {
                title: "Default",
                content: "策略内容已成功刷新，请查收",
            },
            {
                title: "Duration 0",
                position: "topRight",
                content: "This is a message",
                duration: 0,
            },
            {
                title: "Hide close button",
                content: "This is a message without close button",
                showClose: false,
            },
        ]
        const info = (item: any) => {
            MNotification.info({
                ...item,
                onClose: (props:any) => {
                    console.log(props);
                },
                onClick: (props:any) => {
                    console.log(props);
                },
            });
        }
        const destroyAll = (item: any) => {
            MNotification.destroyAll();
        }
        //关闭指定的通知框
        const closeDefault = () => {
            if( notification.value ) {
                MNotification.close(notification.value)
                notification.value = ""
            }

        }
        const open = () => {
            notification.value = MNotification.info({
                title: 'close me',
                content: "Please click the close button",
            });
        }
        return {
            dataList,
            info,
            destroyAll,
            closeDefault,
            open
        }
    },
})
</script>
```

注意事项:
- 组件样式按需加载，确保引入 theme/index.css
- 服务型组件通常通过方法调用，不作为全局组件渲染

常见坑:
- 未引入主题样式导致样式缺失
- 按需注册忘记 app.use(...) 导致组件不渲染

使用者视角扩展:
- 适用场景: 典型业务场景与推荐组合
- 真实业务场景+推荐组合: 系统公告（Notification + Icon）
- 常用用法: 最常见的 1-2 种写法
- 高级用法: 与 Form/Modal/Table 等组合
- 主题与样式: 关键样式与主题变量
- 兼容性: Teleport/SSR/浏览器注意事项
- 性能建议: 大数据量/频繁更新优化
- 迁移提示: 与旧版本/其他库差异
- 故障排查: 最常见错误与定位路径

参考文件:
- 说明: 以下路径仅在源码仓库存在，构建产物中不包含
- packages/components/notification/index.ts
- packages/components/notification/index.md
- packages/components/notification/test/basic.vue
