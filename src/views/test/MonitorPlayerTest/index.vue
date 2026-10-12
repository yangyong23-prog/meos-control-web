<template>
    <div class="monitor-player-warp fc">
        <div class="left">
            <m-input v-model="baseUrl" :width="400">
                <template #prepend> http:// </template>
            </m-input>
            <m-input v-model="objectId" :width="400">
                <template #prepend> 设备ID </template>
            </m-input>
            <m-input v-model="groupCodeModel" :width="400">
                <template #prepend> groupCode </template>
            </m-input>
            <m-input v-model="projectIdModel" :width="400">
                <template #prepend> projectID </template>
            </m-input>
            <m-input v-model="videoProtocol" :width="400">
                <template #prepend> 监控协议类型 </template>
            </m-input>
            <m-input v-model="jsPluginPathModel" :width="400">
                <template #prepend> jsPluginPath </template>
            </m-input>
            <div>
                视频类型
                <m-radio-group v-model="videoTypeModel">
                    <div class="list">
                        <m-radio v-for="item in videoTypeList" :key="item.value" :label="item.value"> {{ item.label }} </m-radio>
                    </div>
                </m-radio-group>
            </div>
            <div v-show="videoTypeModel === VIDEO_TYPE.PLAY_BACK">
                <m-date-picker v-model="dateRangeVal" :width="360" type="datetimerange" @change="handleChange"></m-date-picker>
            </div>
            <div>token</div>
            <m-input v-model="tokenModel" :type="'textarea'" :autosize="{ minRows: 3 }" :width="400"> </m-input>
            <m-button type="primary" size="medium" @click="loadMonitor">加载视频</m-button>
            <m-button type="primary" size="medium" @click="initMR">初始化MR(HIK)</m-button>
            <m-button type="primary" size="medium" @click="initNJ">初始化NJJY(DHRTSP)</m-button>
            <m-button type="primary" size="medium" @click="initHikRtsp">初始化(HIKRTSP)</m-button>
        </div>
        <div class="mid">
            <div id="player" ref="playerContainer" class="player"></div>
        </div>
        <div class="right">
            <!-- <div>
                <div>防抖模式</div>
                <m-radio-group v-model="changeCmdExec">
                    <div class="list">
                        <m-radio :label="1"> 切换指令再次触发 </m-radio>
                        <m-radio :label="0"> 切换指令正常触发 </m-radio>
                    </div>
                </m-radio-group>
            </div> -->
            <div class="ops">
                <m-button type="primary" size="medium" @mousedown="doControl('UP', 0)" @mouseup="doControl('UP', 1)">上</m-button>
                <m-button type="primary" size="medium" @mousedown="doControl('DOWN', 0)" @mouseup="doControl('DOWN', 1)">下</m-button>
                <m-button type="primary" size="medium" @mousedown="doControl('LEFT', 0)" @mouseup="doControl('LEFT', 1)">左</m-button>
                <m-button type="primary" size="medium" @mousedown="doControl('RIGHT', 0)" @mouseup="doControl('RIGHT', 1)">右</m-button>
                <m-button type="primary" size="medium" @mousedown="doControl('LEFT_UP', 0)" @mouseup="doControl('LEFT_UP', 1)">左上</m-button>
                <m-button type="primary" size="medium" @mousedown="doControl('LEFT_DOWN', 0)" @mouseup="doControl('LEFT_DOWN', 1)">左下</m-button>
                <m-button type="primary" size="medium" @mousedown="doControl('RIGHT_UP', 0)" @mouseup="doControl('RIGHT_UP', 1)">右上</m-button>
                <m-button type="primary" size="medium" @mousedown="doControl('RIGHT_DOWN', 0)" @mouseup="doControl('RIGHT_DOWN', 1)">右下</m-button>
                <m-button type="primary" size="medium" @mousedown="doControl('ZOOM_IN', 0)" @mouseup="doControl('ZOOM_IN', 1)">拉近</m-button>
                <m-button type="primary" size="medium" @mousedown="doControl('ZOOM_OUT', 0)" @mouseup="doControl('ZOOM_OUT', 1)">拉远</m-button>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import { MonitorPlayer, VIDEO_PROTOCOL, VIDEO_TYPE } from 'yushu-component-web';
import useStore from '@/store';
import dayjs from 'dayjs';
// 监控视频控制防抖，等待时间间隔(单位：毫秒)
import { MEOS_MONITOR_CONTROL_DEBOUNCE_WAIT } from '@/config';
import * as _ from 'lodash';

import { urlContain } from '@/utils';

const packageName = urlContain('meos-autocontrol-web-edge') ? 'meos-autocontrol-web-edge' : 'meos-control-web';

const playerContainer = ref();
const baseUrl = ref();
const objectId = ref();
const groupCodeModel = ref();
const projectIdModel = ref();
const tokenModel = ref();
const jsPluginPathModel = ref('');
const dateRangeVal = ref('');
const videoTypeModel = ref(VIDEO_TYPE.REAL_TIME);
const videoProtocol = ref(VIDEO_PROTOCOL.HIK);
const changeCmdExec = ref(0);

const videoTypeList = [
    { label: '实时', value: VIDEO_TYPE.REAL_TIME },
    { label: '历史', value: VIDEO_TYPE.PLAY_BACK }
];

let player = null,
    lastMonitorVideo = null,
    _cmd = null,
    _action = null,
    hikSzBasePath = null;
// 摄像头控制防抖
const doControlDebounce = _.debounce(
    () => {
        player?.controlCamera({ command: _cmd, action: _action });
    },
    MEOS_MONITOR_CONTROL_DEBOUNCE_WAIT || 450,
    {
        leading: true,
        trailing: true
    }
);

const handleChange = () => {
    console.log('ppp=====', dateRangeVal.value);
};

const initMR = () => {
    baseUrl.value = 'https://mrfmiot-gmyq.mindray.com/iot-hub-server-edge';
    objectId.value = 'Eq44031100025b0a6184287842dfa230fa262c84ac8d';
    groupCodeModel.value = 'MRYL';

    videoProtocol.value = VIDEO_PROTOCOL.HIK;
    projectIdModel.value = 'Pj4403110002';
    jsPluginPathModel.value = '';
    hikSzBasePath = `/${packageName}/video-sdk`;
};
const initNJ = () => {
    baseUrl.value = 'https://xc-njjy.meosedge.com/iot-hub-server-edge';
    objectId.value = 'Eq74803828245263ecac1c51473c962f987a8973e5e0';
    groupCodeModel.value = 'XC';
    projectIdModel.value = 'Pj3201050003';

    videoProtocol.value = VIDEO_PROTOCOL.DHRTSP;
    jsPluginPathModel.value = `/${packageName}/dahua-rtsp-sdk/scripts/videoPlayer.js`;
};
const initHikRtsp = () => {
    // baseUrl.value = 'https://szwxtd-mixccloud.crland.com/iot-hub-server-edge';
    baseUrl.value = 'https://hr-szwx.meosedge.com/iot-hub-server-edge';
    objectId.value = 'Eq4403050002a9ada4ee25db40d6a090b02676808264';
    groupCodeModel.value = 'HR';
    projectIdModel.value = 'Pj4403050002';

    videoProtocol.value = VIDEO_PROTOCOL.HIKRTSP;
    jsPluginPathModel.value = '';
    hikSzBasePath = `/${packageName}/video-sdk`;
};

const loadMonitor = async () => {
    const { base } = useStore();
    const token = tokenModel.value || base.token || '';

    const opt = {
        token,
        groupCode: groupCodeModel.value,
        projectId: projectIdModel.value,
        objectId: objectId.value,
        //
        videoType: videoTypeModel.value,
        // 视频协议
        protocol: videoProtocol.value,

        // 需要挂载的video element 必填
        mountElement: 'player',
        //  (海康)组件内部加载worker地址前缀
        hikSzBasePath,
        // js插件地址,完整路径
        jsPluginPath: jsPluginPathModel.value || ''
    };
    if (videoTypeModel.value === VIDEO_TYPE.PLAY_BACK) {
        if (!dateRangeVal.value) {
            alert('播放历史请先选择时间区间');
            return;
        }

        const dArr = dateRangeVal.value.split('-');
        opt.beginTime = dayjs(dArr[0]).format('YYYY-MM-DD HH:mm:ss');
        // console.log('opt.beginTime: ', dayjs(opt.beginTime).format('YYYY-MM-DD HH:mm:ss'));
        opt.endTime = dayjs(dArr[1]).format('YYYY-MM-DD HH:mm:ss');
    }

    player.setOption(opt);
    console.log('player: ', player);
    player.setBaseUrl(baseUrl.value);
    await player.load();
    await player.play();
    console.log('lastMonitorVideo: ', lastMonitorVideo, player.monitorVideo, player.monitorVideo === lastMonitorVideo);
    lastMonitorVideo = player.monitorVideo;
};
// 摄像头控制
const doControl = (cmd, action) => {
    if (_cmd !== null && _cmd !== cmd) {
        // 若切换不同命令，取消之前的防抖调用
        doControlDebounce.cancel();
    }
    _action = action;
    _cmd = cmd;
    // 调用防抖
    doControlDebounce();
};
onMounted(() => {
    const { base } = useStore();
    const token = base.token || '';
    console.log('onMounted: ', window.location.host);
    const cfg = {
        baseUrl: `http://${window.location.host}`,
        groupCode: base.groupCode,
        projectId: base.projectId
    };
    player = new MonitorPlayer(cfg);
    const opt = {
        token,
        autoLoadPlugin: false,
        objectId: 'xxxxxx',
        //
        videoType: VIDEO_TYPE.REAL_TIME,
        // 视频协议
        protocol: VIDEO_PROTOCOL.HIK,

        // 需要挂载的video element 必填
        mountElement: playerContainer.value,
        //  (海康)组件内部加载worker地址前缀
        hikSzBasePath: `/${packageName}/video-sdk`
        // autoInit: false
        // js插件地址,完整路径
        // jsPluginPath: ''
    };
    player.setOption(opt);
    console.log('player: ', player);
    // player.load();
});
</script>
<style lang="scss" scoped>
.monitor-player-warp {
    width: 100%;
    height: 100%;
    .left {
        border-right: 1px solid #aaaaaa;
        width: 400px;
        height: 100%;
        padding-top: 10px;
        display: flex;
        flex-direction: column;
        gap: 8px;
        color: #666666;
        font-size: 14px;
    }
    .player {
        width: 600px;
        height: 500px;
        border: 1px solid red;
    }
    .right {
        padding: 20px 0;
        width: 100%;
        height: 100%;
        border-left: 1px solid #aaaaaa;
        display: flex;
        flex-direction: column;
        gap: 8px;
        .ops {
            display: flex;
            gap: 8px;
        }
    }
}
</style>
