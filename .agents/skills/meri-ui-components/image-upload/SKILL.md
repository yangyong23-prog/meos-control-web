---
name: image-upload
description: "Meri UI imageUpload 组件技能。适用于查阅 imageUpload 组件的用途、API、示例、注意事项与常见坑。"
---

# meri-ui-imageUpload

用途:
- 图片上传。

API 要点:
- 属性:
| 名称      | 类型                       | 可选值     | 默认值                  | 说明                                                      |
| :-------- | :------------------------- | :--------- | :---------------------- | :-------------------------------------------------------- |
| host      | String                     | 无         | 无                      | 文件请求服务根地址 需要满足 host+FileType 能访问到        |
| action    | String                     | 无         | 无                      | 文件上传请求的接口                                        |
| fileSize  | Number                     | Number     | Number.MAX_SAFE_INTEGER | 文件最大上传的字节数                                      |
| multiple  | Boolean                    | true/false | false                   | 上传是否可以选择多个                                      |
| accepts   | String                     | 无         | 全类型                  | 自定义文件类型                                            |
| limit     | Number                     | 无         | 9                       | 可上传文数                                                |
| disabled  | Boolean                    | true/false | false                   | 是否禁用上传文件                                          |
| dropTitle | String                     | 无         | 上传文件                | 上传文件的文字                                            |
| files     | FileType[]                 | 无         | []                      | 已经上传的文件集合                                        |
| upload    | (item: FileType) => void   | 无         | 无                      | 自定义上传的方法度                                        |
| valite    | (item: FileType) => string | void       | 无                      | 自定义校验方法，校验完成后可以将错误提示信息返回          |
| preview   | boolean                    | true/false | false                   | 只进行预览不进行操作                                      |
| overcount | (message:str)=>void        | 无         | 无                      | 选择了 n 个文件,但是剩余可选择文件数量小于 n 时触发的回调 |

| 名称         | 类型       | 说明                     |
| :----------- | :--------- | :----------------------- |
|              |
| files        | FileType[] | 当前组件中的的所有文件   |
| input        | input:file | 组件中的 input:file 对象 |
| previewImage | input:file | 手动调用组件相关的预览   |

- 事件:
| 名称    | 参数                                 | 说明                                                            |
| :------ | :----------------------------------- | :-------------------------------------------------------------- |
|         |
| delete  | (files:FileType[], item:FileType)    | 删除后的回调，files 删除后剩余文件，item:被删除的文件           |
| upload  | (files:FileType[], items:FileType[]) | 上传后的回调，files 上传后所有文件，item:被上传的文件           |
| preview | (item?:FileType)                     | 触发预览之前的回调,展示前返回当前文件对象，关闭时不返回任何参数 |

示例用法:
```vue
<template>
  <div class="file">
    <div class="upload-style">
      <m-image-upload :limit="3" :multiple='true' action='https://dev.yushu.cloud/mid-frame-server/upload/fms'></m-image-upload>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  setup() {

    return {}
  }
})
</script>
```

注意事项:
- 组件样式按需加载，确保引入 theme/index.css

常见坑:
- 未引入主题样式导致样式缺失
- 按需注册忘记 app.use(...) 导致组件不渲染

使用者视角扩展:
- 适用场景: 图片选择/上传/预览
- 真实业务场景+推荐组合: 头像上传（ImageUpload + Avatar + FormItem）
- 常用用法: `limit` + 预览/删除
- 高级用法: 裁剪/多图/错误回退图
- 主题与样式: 缩略图与预览样式
- 兼容性: 需处理跨域与鉴权
- 性能建议: 大图建议压缩或限制数量
- 迁移提示: 与 fileUpload 的配置项不同
- 故障排查: 预览失败多为 URL 无效

参考文件:
- 说明: 以下路径仅在源码仓库存在，构建产物中不包含
- packages/components/imageUpload/index.ts
- packages/components/imageUpload/index.md
- packages/components/imageUpload/test/limit.vue
