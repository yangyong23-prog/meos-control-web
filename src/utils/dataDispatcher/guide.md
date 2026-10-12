# 作用
封装http和websoket，返回相同结构的数据
# 快速使用
## 核心代码
**边缘端走websoket，云端走http轮询的调用方法**
```typescript

// 引入这个插件
import dataDispatcher from '@/utils/dataDispatcher';
import http from './utils/http';

// 获取数据派发器
const dispatcher = dataDispatcher();

// request请求数据 -> (request第一个参数是ws链接，第二个参数是http回调函数）
// response监听响应的数据 -> 内部会做边缘端或云端判断,云端走http轮询（每30s）,边缘端走websocket
// websocket自动发送心跳数据、支持断网自动重连;request第三个参数是http的轮询时间,默认 30 * 1000 ms,传0只请求一次,不轮询
dispatcher
    .request('ws://localhost:3200', () => http.post('/api/test1'))
    .response(res => {
        console.log('res: ', res);
    });



// [可选]---------------创建第二个数据监听回调(设置云端http请求轮询时间为10s)
const observe = dispatcher.request('ws://localhost:3200', () => http.post('/api/test2'), 10 * 1000);

// 监听数据响应
observe.response(data => {
  // 返回的数据
  console.log('data: ', data);
  // 边缘端数据处理
  if(dispatcher.isEdge){

    // 云端数据处理
  }esle{
    
  }
});

onBeforeUnmount(() => {
    // [可选]注销数据监听器(边缘端关闭ws链接,云端关闭http轮询)
    observe.dispose();
});
```
**只走http轮询的用法**
```typescript
// 引入这个插件
import dataDispatcher from '@/utils/dataDispatcher';
import http from './utils/http';

// 获取数据派发器
const dispatcher = dataDispatcher();

// pollingHttp启用轮询 -> (第一个参数是http函数，第二个参数是轮询时间）
// response监听响应的数据  
dispatcher
    .pollingHttp('() => http.post('/api/test1'),15*1000*60)
    .response(res => {
        console.log('res: ', res);
    });



// [可选]---------------注销轮询
const observe = dispatcher.pollingHttp(() => http.post('/api/test2'), 10 * 1000);

// 监听数据响应
observe.response(data => {
    // 返回的数据
    console.log('data: ', data);
});

onBeforeUnmount(() => {
    // [可选]注销轮询及数据监听器
    observe.dispose();
});
```
**只需要使用websokect**
```typescript
import WebSocketClient from "@/utils/dataDispatcher/WebSocketClient"

const ws = new WebSocketClient('ws://localhost:3200');

// 连接
ws.connect()
// 同原生方法
ws.onclose(()=>{})
// 同原生方法
ws.onerror(()=>{})
// 同原生方法
ws.onmessage(()=>{
  // 同原生方法
  ws.send("自定义发送的数据")
})
// 同原生方法
ws.onopen(()=>{})

// 关闭连接
ws.close()

```
## 其他用法
以下示例基于边缘端走websoket，云端走http的情况
### 边远端如何先请求http，在走websokec
```typescript

//边远端如何先请求http,在进行ws长连接

// 先模拟当前环境为边缘端[注意:不要改变isEdge的值,会影响所有的dispatcher实例.本代码仅测试用]
dispatcher.isEdge = true;

const app = dispatcher.request('ws://localhost:3200', () => http.post('/api/test2'));
// originHttp是 () => http.post('/api/test2') 的浅copy对象
app.originHttp().then(res => {
    if (res) {
        app.response(data => {
            console.log('data: ', data);
        });
    }
});
```
### http轮询的更多控制
```typescript
// http轮询的更多控制
const httpApp = dispatcher.request('ws://localhost:3200', () => http.post('/api/test2'));

httpApp.response(res => {
    console.log('res: ', res);
});

// 手动触发一次接口 -> 会终止云端的默认轮询行为(边缘端也会触发此接口!)
//(response方法会监听到响应值,因此不要在response内调用此方法!避免循环回调)
// [注]边缘端不会触发rePlayHttp
httpApp.rePlayHttp();

// 以3000ms的间隔开始轮询次此接口
httpApp.rePlayHttp(3000);

//更改此接口的入参(不会终止轮询)
httpApp.rePlayHttp(() => http.post('/api/test1', { a: '1' }));

//更改监听的接口,并重设轮询时间
httpApp.rePlayHttp(() => http.post('/api/test2', { name: '1' }), 20 * 1000);
```

### 更底层的websokect控制
```typescript
const observe = dispatcher.request('ws://localhost:3200', () => http.post('http://xxxx'));
// [可选]-------------更底层的websokect控制

// 连接
observe.ws.connect()
// 同原生方法
observe.ws.onclose(()=>{})
// 同原生方法
observe.ws.onerror(()=>{})
// 同原生方法
observe.ws.onmessage(()=>{
  // 同原生方法
  observe.ws.send("自定义发送的数据")
})
// 同原生方法
observe.ws.onopen(()=>{})
// 关闭连接
observe.ws.close()
```

### 非边缘端如何进行websocket测试？
```typescript
// 引入这个插件
import dataDispatcher from '@/utils/dataDispatcher';

// 创建数据派发器
const dispatcher = dataDispatcher();

//设置为边缘端环境（启用websoket）
dispatcher.isEdge = true
```
控制台会有提示
![](https://cdn.nlark.com/yuque/0/2024/png/21865277/1712817274235-113930d7-f4e5-48ab-a00b-6b3713ea5d12.png#averageHue=%23432f28&clientId=u33642cc7-8d2c-4&from=paste&height=108&id=u4fc71464&originHeight=108&originWidth=493&originalType=binary&ratio=1&rotation=0&showTitle=false&size=19373&status=done&style=none&taskId=ubeff0ddb-a96f-443f-af07-ea00224c9ac&title=&width=493#averageHue=%23432f28&id=AFPMu&originHeight=108&originWidth=493&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=#averageHue=%23432f28&id=OGwbN&originHeight=108&originWidth=493&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)
### 如何关闭websoket提示？
控制台的提示只会在开发环境出现，开发环境禁用，给dataDispatcher传true即可
```typescript
// 引入这个插件
import dataDispatcher from '@/utils/dataDispatcher';

// 创建数据派发器
const dispatcher = dataDispatcher(true);

//设置为边缘端环境（启用websoket）
dispatcher.isEdge = true
```

### sendData
sendData是与request相似的一个方法，其内部不会做websoket和http合并处理，你传什么值，返回什么值
```typescript
const observe = dispatcher.sendData("11111111");

observe.response(res => {
    console.log('res---: ', res); // 11111111
});
```
sendData也可以是一个用于return 的异步函数
```typescript
const observe = dispatcher.sendData(() => {
    return new Promise((resolve, reject) => {
        // 模拟异步请求延迟
        setTimeout(() => {
            resolve({ data: 'Response data' });
        }, 1000); // 模拟延迟 1 秒
    });
});

observe.response(res => {
    console.log('res---: ', res); // Response data
});
```

## 
