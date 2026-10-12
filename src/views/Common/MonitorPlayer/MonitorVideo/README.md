### How To Use
```javascript
import MonitorVideo, { VIDEO_PROTOCOL } from 'monitor-video';

// 具体参数参考下个模块
new MonitorVideo({
    xxx: xxx
});
```

### 参数
```markdown
// 需要挂载的video element
mountElement: Element | HTMLElement | string;
// 视频协议
protocol: VIDEO_PROTOCOL;
// 视频地址
url?: string;
// 是否自动初始化
autoInit?: boolean;
// 是否需要重连
reconnect?: boolean;
// 视频插件props
videoProps?: Object | null;
// 是否默认开启声音
autoOpenSound?: boolean;
// 是否默认播放
autoPlay?: boolean;
// 是否自动加载对应播放插件
autoLoadPlugin?: boolean;
// 组件内部加载worker地址前缀
szBasePath?: string;
// 是否实时播放
isRealTime?: boolean;
// 回放视频 开始时间
beginTime?: string;
// 回放视频 结束时间
endTime?: string;
```

### Event
- init 初始化
- destroy 销毁
- play 播放
- pause 暂停
- stop 停止
- playbackFast 快放
- playbackSlow 慢放
- closeSound 关闭声音
- openSound 开启声音
- seekTo(startTime) 回放定位至指定位置,startTime=开始时间
