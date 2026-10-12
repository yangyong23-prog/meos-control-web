---
name: file-upload
description: "Meri UI fileUpload 组件技能。适用于查阅 fileUpload 组件的用途、API、示例、注意事项与常见坑。"
---

# meri-ui-fileUpload

用途:
- 文件上传。

API 要点:
- 属性:
| 名称          | 类型                       | 可选值             | 默认值           | 说明                                                                     |
| :------------ | :------------------------- | :----------------- | :--------------- | :----------------------------------------------------------------------- |
| host          | String                     | 无                 | 无               | 文件请求服务根地址 需要满足 host+FileType 能访问到                       |
| action        | String                     | 无                 | 无               | 文件上传请求的接口                                                       |
| fileSize      | Number                     | Number             | 5242880          | 文件最大上传的字节数                                                     |
| multiple      | Boolean                    | true/false         | false            | 上传是否可以选择多个                                                     |
| accepts       | String                     | 无                 | 全类型           | 自定义文件类型                                                           |
| limit         | Number                     | 无                 | 9                | 可上传文数                                                               |
| size          | Size                       | large/medium/small | medium           | 文件上传按钮的大小                                                       |
| type          | String                     | "drop"/"button"    | button           | 上传的展示形式，是拖拽上传，还是按钮上传（只是外观不同，本身都支持拖拽） |
| disabled      | Boolean                    | true/false         | false            | 是否禁用上传文件                                                         |
| uplaodStlye   | Object                     | 无                 | 上传按钮的样式   | 上传按钮的样式                                                           |
| fileListStyle | Object                     | 无                 | 已上传列表的样式 | 已上传列表的样式                                                         |
| errorText     | String                     | 无                 | 文件体积过大     | 报错文案                                                                 |
| valite        | (item: FileType) => string | void               | 无               | 自定义校验方法，校验完成后可以将错误提示信息返回                         |
| dropTitle     | String                     | 无                 | 无               | 拖拽区域文字                                                             |
| dropContent   | String                     | 无                 | 无               | 拖拽区域内容文字                                                         |
| files         | FileType[]                 | 无                 | []               | 已经上传的文件集合                                                       |
| upload        | (item: FileType) => void   | 无                 | 无               | 自定义上传的方法度                                                       |
| valite        | (item: FileType) => string | void               | 无               | 自定义校验方法，校验完成后可以将错误提示信息返回                         |
| preview       | boolean                    | true/false         | false            | 只进行预览不进行操作                                                     |

| 名称  | 类型       | 说明                     |
| :---- | :--------- | :----------------------- |
|       |
| files | FileType[] | 当前组件中的的所有文件   |
| input | input:file | 组件中的 input:file 对象 |

- 事件:
| 名称   | 参数                                 | 说明                                                  |
| :----- | :----------------------------------- | :---------------------------------------------------- |
|        |
| delete | (files:FileType[], item:FileType)    | 删除后的回调，files 删除后剩余文件，item:被删除的文件 |
| upload | (files:FileType[], items:FileType[]) | 上传后的回调，files 上传后所有文件，item:被上传的文件 |

示例用法:
```vue
<template>
  <div class="file">
    第一个只支持图片，第二个支持图片和PDF，第三个只支持.xls,.xlsx。
    <div class="upload-style">
      <m-fileUpload accepts="image/*" :multiple='true' action='https://dev.yushu.cloud/mid-frame-server/upload/fms'></m-fileUpload>
      <m-fileUpload accepts="image/*,.pdf" :multiple='true' action='https://dev.yushu.cloud/mid-frame-server/upload/fms'></m-fileUpload>
      <m-fileUpload accepts=".xls,.xlsx" :multiple='true' action='https://dev.yushu.cloud/mid-frame-server/upload/fms'></m-fileUpload>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue'

export default defineComponent({
  setup() {
    const change = (file: any) => {
      console.log(file, 'file')
    }
    const changList = (arrs: Array<string>) => {
      console.log(arrs, 'urllist')
    }
    return { changList, change }
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
- 适用场景: 文件选择/上传
- 真实业务场景+推荐组合: 附件上传（FileUpload + FormItem + Button）
- 常用用法: `action`/`headers`/`accept`
- 高级用法: 拖拽上传、进度展示、校验大小
- 主题与样式: 列表样式与按钮状态
- 兼容性: 需处理跨域与鉴权
- 性能建议: 大文件分片/并发控制
- 迁移提示: 与旧组件的回调参数不同
- 故障排查: 无法上传多为 action/headers 配置错误

参考文件:
- 说明: 以下路径仅在源码仓库存在，构建产物中不包含
- packages/components/fileUpload/index.ts
- packages/components/fileUpload/index.md
- packages/components/fileUpload/test/accepts.vue
