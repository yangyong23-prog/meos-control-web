<template>
    <div ref="cardRef" class="run-home wh100 asgssadf">
        <component :is="component[code]" v-bind="$attrs" :size="size" :title="title"></component>
    </div>
</template>

<script setup>
import i18n, { getLocaleLang, DEFAULT_LANG } from '@/localization';
/* eslint-disable camelcase  */
import AC from '@/views/AC/index.vue';
import ACAC from '@/views/ACAC/index.vue';
import ACAH from '@/views/ACAH/index.vue';
import ACAI from '@/views/ACAI/index.vue';
import ventilate from '@/views/ventilate/index.vue';
import ACCH from '@/views/ACCH/index.vue';
import acoperationcontrol from '@/views/ac-operation-control/index.vue';
import parkingLot from '@/views/parking-lot/index.vue';
import lightsystem from '@/views/light-system/index.vue';
import runbroadcast from '@/views/run-broadcast/index.vue';
import kitchenfumes from '@/views/kitchen-fumes/index.vue';
import env_quality from '@/views/env_quality/index.vue';
import passengerFlow from '@/views/passenger-flow/index.vue';
import WS from '@/views/WS/index.vue';
import SE from '@/views/SE/index.vue';
import elevatorsystem from '@/views/elevator-system/index.vue';
import spaceSecurityControl from '@/views/space-security-control/index.vue';
import { setLangguage } from 'meri-plus';
import { defineProps, defineEmits, defineExpose, ref, provide, onBeforeMount } from 'vue';
import { updateTimeZone } from '@/utils/timezone';

const cardRef = ref();
provide('cardRef', cardRef);
const component = {
    // eslint-disable-next-line camelcase
    electricity_system: SE, // 变配电
    // eslint-disable-next-line camelcase
    cold_station: AC, // 冷源
    airConditioningHeatAndColdSource: ACAI, //空调冷热源
    // eslint-disable-next-line camelcase
    airConditioningColdSource: ACAC,
    // eslint-disable-next-line camelcase
    park_lot: parkingLot, // 停车场
    // eslint-disable-next-line camelcase
    elevator: elevatorsystem, // 电梯
    // eslint-disable-next-line camelcase
    space_security: spaceSecurityControl, // 空间安防
    // eslint-disable-next-line camelcase
    water_drainage: WS, // 给排水
    // eslint-disable-next-line camelcase
    ventilation_system: ventilate, // 通风
    ACCH, // 冷热源
    airConditioningHeatSource: ACAH, // 空调热源
    // eslint-disable-next-line camelcase
    air_conditioning_terminal: acoperationcontrol, // 末端设备
    lighting: lightsystem, // 照明
    // eslint-disable-next-line camelcase
    run_broadcast: runbroadcast, // 运行播报
    // eslint-disable-next-line camelcase
    exhaust_system: kitchenfumes, // 排油烟
    env_quality, // 环境品质
    passenger_flow: passengerFlow // 客流
};
const props = defineProps({
    code: {
        type: String,
        default: '' // 每个组件对应得code 编码，需要根据code渲染对应得组件
    },
    title: {
        type: String,
        default: undefined // 每个组件对应得code 编码，需要根据code渲染对应得组件
    },
    groupCode: {
        type: String,
        default: ''
    },
    projectId: {
        type: String,
        default: ''
    },
    token: {
        type: String,
        default: ''
    },
    size: {
        type: String,
        default: '1*2'
    },
    total: {
        type: Function, // (payload: { code: string, total: number }) => void
        default: () => {} // 框架需要统计各个模块的异常事件（业务属性），如需统计可以调用该方法更新对象的异常事件数量
    },
    webEnv: {
        type: Object,
        default: () => ({}) // 包含网关地址，是否是边缘端等信息
    },
    timeZone: {
        type: String,
        default: ''
    }
});

onBeforeMount(() => {
    setLangguage(getLocaleLang(DEFAULT_LANG));
    updateTimeZone(props);
});

window.WebStore = props;
</script>
<style lang="less">
@font-face {
    font-family: 'PersagyRegular';
    src: url('@/assets/font/Persagy2.0-Regular.ttf');
}

@font-face {
    font-family: 'PersagyMedium';
    src: url('@/assets/font/Persagy2.0-Medium.ttf');
}

@font-face {
    font-family: 'PersagyBold';
    src: url('@/assets/font/Persagy2.0-Bold.ttf');
}
.ffb {
    font-family: 'PersagyBold', 'Persagy-Bold', 'PersagyRegular', 'PersagyMedium', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', 'PingFang SC',
        'Noto Sans', 'Noto Sans CJK SC', 'Microsoft YaHei', '微软雅黑', sans-serif;
}
.ffm {
    font-family: 'PersagyMedium', 'PersagyRegular', 'PersagyBold', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', 'PingFang SC', 'Noto Sans',
        'Noto Sans CJK SC', 'Microsoft YaHei', '微软雅黑', sans-serif;
}
.ff {
    font-family: 'PersagyRegular', 'Microsoft YaHei', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', 'PingFang SC', 'Noto Sans', 'Noto Sans CJK SC',
        '微软雅黑', sans-serif;
}

.run-home.asgssadf {
    .run-number-value,
    .run-total-box-num,
    .item-data-value {
        .ffb;
    }
    .run-number-total {
        .ff;
    }
}
</style>
