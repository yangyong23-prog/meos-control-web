<template>
    <div>有效时长 test</div>
</template>
<script setup lang="ts">
import iotExpireManager from '../../../utils/iotExpireManager';
import type { IotRecord } from '../../../utils/iotExpireManager';
import { onUnmounted } from 'vue';
import dayjs from 'dayjs';

const date = dayjs('20240722214958');
console.log('date>>>', date, date.valueOf());

const handleExpireData = (data: IotRecord) => console.log('expire 过期数据', data);

// 监听数据过期  TODO 处理过期数据
iotExpireManager.addEventListener('expire', handleExpireData);

// 添加一条数据
iotExpireManager.addIot(
    {
        classCode: 'ACOTU', // 设备类编码
        dataIndate: 1, // 时间常量，小于等于0代表永久有效
        dataStatus: 1, // 孪生值状态位：1-正常，非 1 异常；控制值状态位：0:开始执行，1:执行中，2完成，3:保护期
        dataTime: '20240722214958', // IOT数据上报的时间
        dataValue: '0', // IOT数据上报的值
        dataValueName: '手动', // 值如果是枚举类型，代表枚举的描述信息
        dateTimeFromDate: '1721656198000', // 暂时无效字段，IOT上报，我们不会使用
        forced: 0, // 控制点强制状态0-正常 1-强制
        groupCode: 'TYXN', // 集团编码
        infoCode: 'manualAutoSet', // 信息点编码
        invalid: 0, // 暂时无效字段，IOT上报，我们不会使用
        objectId: 'Eg990999000777fb59c2e98f4d3c94a4085b1a67983c', // 对象ID
        originalInfoCode: 'manualAutoSet', // 暂时无效字段，IOT上报，我们不会使用
        projectId: 'Pj9909990007', // 项目ID
        timeRange: 'true', // 消息标识位，true-正常，false-异常
        type: 0, // 消息类型，0-孪生消息，1-控制消息
        webType: 'PARAM_SET' // 消息的推送类型，暂时保留，前端依旧可以正常使用
    },
    'WS'
);

onUnmounted(() => {
    iotExpireManager.removeEventListener('expire', handleExpireData);
});
</script>
