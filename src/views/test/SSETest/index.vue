<template>
    <div class="sse-test-warp">
        <h1 style="text-align: center">测试sse</h1>
        <m-input v-model="inputValue" :type="'textarea'" placeholder="请输入" :height="200"> </m-input>
        <div style="margin-top: 20px; display: flex; justify-content: center">
            <m-button type="primary" size="medium" @click="sendSSE">发送</m-button>
        </div>
    </div>
</template>
<script setup>
import { AIR_TERMINAL } from '@/utils/globalVariables';
import SSEClient from '@/utils/SSEClient';
import { INTERFACE_PREFIX_MEOS, INTERFACE_PREFIX_MEOS_COMPUTE } from '@/config';
import { sendSSEData } from './sseTestApi';
import useStore from '@/store';

const store = useStore();
const { groupCode, projectId } = store.base;

const sseClient = new SSEClient({
    url: `${INTERFACE_PREFIX_MEOS_COMPUTE}/server-event/sse/subscribe`,
    method: 'get', // 请求方式
    params: {
        subscribeType: AIR_TERMINAL,
        projectId: 'Pj9909990007',
        instanceId: 'Pj9909990007',
        instanceType: 'PROJECT'
    }
    // body体数据

    // url参数
    // params: {
    //     subscribeType: 'LIGHT_MONITORING',
    //     projectId,
    //     instanceId: projectId,
    //     demandTemplateType: 'PUBLIC_AREA_LIGHTING',
    //     instanceType: 'PROJECT'
    // }
});

// const sseClient2 = new SSEClient({
//     url: `${INTERFACE_PREFIX_MEOS_COMPUTE}/server-event/sse/subscribe`,
//     method: 'post', // 请求方式
//     data: [
//         {
//             subscribeType: 'AIR_TERMINAL',
//             projectId: 'Pj9909990007',
//             instanceId: 'Pj9909990007',
//             instanceType: 'PROJECT'
//         }
//     ]
// });

// sseClient2.addEventListener('IOT_DATA_CHANGE', e => {
//     console.log('IOT_DATA_CHANGE', e);
// });
// sseClient2.addEventListener('RELEASE_INTERVENTION', e => {
//     console.log('RELEASE_INTERVENTION', e);
// });

// const sseClient3 = new SSEClient({
//     url: `${INTERFACE_PREFIX_MEOS_COMPUTE}/server-event/sse/subscribe`,
//     method: 'post', // 请求方式
//     data: [
//         {
//             subscribeType: 'AIR_TERMINAL',
//             projectId: 'Pj9909990007',
//             instanceId: 'Pj9909990007',
//             instanceType: 'PROJECT'
//         }
//     ]
// });
// sseClient3.addEventListener('IOT_DATA_CHANGE', e => {
//     console.log('IOT_DATA_CHANGE', e);
// });
// sseClient3.addEventListener('RELEASE_INTERVENTION', e => {
//     console.log('RELEASE_INTERVENTION', e);
// });

// const sseClient4 = new SSEClient({
//     url: `${INTERFACE_PREFIX_MEOS_COMPUTE}/server-event/sse/subscribe`,
//     method: 'post', // 请求方式
//     data: [
//         {
//             subscribeType: 'AIR_TERMINAL',
//             projectId: 'Pj9909990007',
//             instanceId: 'Pj9909990007',
//             instanceType: 'PROJECT'
//         }
//     ]
// });
// sseClient4.addEventListener('IOT_DATA_CHANGE', e => {
//     console.log('IOT_DATA_CHANGE', e);
// });
// sseClient4.addEventListener('RELEASE_INTERVENTION', e => {
//     console.log('RELEASE_INTERVENTION', e);
// });

const inputValue = ref('');

// LIGHT_DEMAND_CHANGE 照明需求变化
// LIGHT_LOOP 当前需求满足情况
// LIGHT_EQUIPMENT_STATUS 当前设备状态
// ILLUM_INFO 照度监测
// LIGHT_SPACE_STATUS 空间状态

const sendSSE = () => {
    sendSSEData({
        projectId,
        groupCode,
        eventType: 'LIGHT_DEMAND_CHANGE',
        eventName: '照明需求变化',
        comment: '',
        eventId: '-657461931',
        data: { a: '1' }
    }).then(res => {
        console.log('sendSSEData', res);
    });
};
</script>
<style scoped lang="less">
.sse-test-warp {
    padding: 20px;
}
</style>
