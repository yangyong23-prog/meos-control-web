<template>
    <div ref="LogItemRef" class="log-item" @mouseenter="mouseenter(data)" @mouseleave="mouseleave(data)">
        <div class="log-item-left">
            <div class="line"></div>
        </div>
        <div class="log-item-right">
            <template v-if="system.classCode === 'ACAC'">
                <div class="title">
                    <span class="title-time">{{ dayjs(data.createTime).format('HH:mm:ss') }}</span>
                    <m-tag :color="colorDict[data.type]['color']" :bg-color="colorDict[data.type]['bgColor']" size="medium"> {{ colorDict[data.type]['name'] }} </m-tag>
                </div>
                <div class="description">
                    {{ data.createUser }}{{ data.contentDesc }}
                    <div class="icon-box fc" :style="{ color: LogState[data.state]?.color }">
                        &nbsp;
                        <img :src="LogState[data.state]?.icon" alt="" style="height: 16px; width: 16px" />
                        &nbsp;{{ LogState[data.state]?.name }}
                    </div>
                </div>
            </template>
            <template v-else>
                <div class="title">
                    <span class="title-time">{{ dayjs(data.createTime).format('HH:mm:ss') }}</span>
                    <m-tag :color="colorDict[data.type]['color']" :bg-color="colorDict[data.type]['bgColor']" size="medium"> {{ colorDict[data.type]['name'] }} </m-tag>
                    <m-tag v-if="data.secondLevelCategoryName" color="#1B4ACC" bg-color="#D9EBFF" size="medium"> {{ data.secondLevelCategoryName }} </m-tag>
                </div>
                <div class="description">{{ data.createUser }}{{ data.content?.contentDesc }}</div>
            </template>
        </div>
    </div>
</template>
<script setup>
import i18n from '@/localization';
import dayjs from 'dayjs';
import { systemKey } from '../../hooks/useBaseData';
import success from '@/assets/images/log/success.png';
import failed from '@/assets/images/log/failed.png';
import overtime from '@/assets/images/log/overtime.png';
import stop from '@/assets/images/log/stop.png';
import error from '@/assets/images/log/error.png';
import unkonw from '@/assets/images/log/unknow.png';
defineProps({
    colorDict: {
        type: Object,
        default: () => {}
    },
    data: {
        type: Object,
        default: () => {}
    }
});
const LogState = {
    '-1': {
        name: i18n.global.t('meos_control_web.status_undetected'),
        color: '#8B949E',
        icon: unkonw
    },
    0: {
        name: i18n.global.t('meos_control_web.status_undetected'),
        color: '#8B949E',
        icon: unkonw
    },
    1: {
        name: i18n.global.t('meos_control_web.execution_success'),
        color: '#3FBE72',
        icon: success
    },
    2: {
        name: i18n.global.t('meos_control_web.execution_failed'),
        color: '#F55047',
        icon: failed
    },
    3: {
        name: i18n.global.t('meos_control_web.execution_timeout'),
        color: '#F29F00',
        icon: overtime
    },
    4: {
        name: i18n.global.t('meos_control_web.execution_terminated'),
        color: '#F29F00',
        icon: stop
    },
    5: {
        name: i18n.global.t('meos_control_web.execution_exception'),
        color: '#F55047',
        icon: error
    }
};
const system = inject(systemKey);
const LogItemRef = ref();
const emits = defineEmits(['hover', 'unhover']);
const mouseenter = data => {
    emits('hover', data);
};
const mouseleave = data => {
    emits('unhover', data);
};
</script>

<style lang="less" scoped>
.log-item {
    width: 100%;
    height: 100%;
    display: flex;
    &:nth-of-type(1) {
        .log-item-left {
            margin-top: 17px;
        }
    }
    &:nth-last-of-type(1) {
        .log-item-left {
            height: 17px;
        }
    }
    &:only-child {
        .log-item-left {
            z-index: -1;
        }
    }
    &-left {
        width: 8px;
        height: auto;
        .line {
            width: 1px;
            margin-left: 4px;
            height: 100%;
            background: linear-gradient(to bottom, transparent 0%, transparent 50%, #c4c9cf 50%, #c4c9cf 100%);
            background-size: 1px 6px;
            background-repeat: repeat-y;
        }
    }
    &-right {
        width: 322px;
        margin-left: 3px;
        padding: 8px;
        margin-right: 16px;
        margin-bottom: 8px;
        border: 1px solid transparent;
        &:hover {
            border-radius: 4px;
            border: 1px solid var(--blue-500, #246fe5);
            background: #fff;
        }
        .title {
            margin-bottom: 4px;
            position: relative;
            &-time {
                color: #2e3742;
                font-size: 14px;
                font-weight: 700;
                margin-right: 8px;
            }
            &::before {
                position: absolute;
                content: '';
                width: 8px;
                height: 8px;
                background: #c4c9cf;
                border-radius: 50%;
                left: -19px;
                top: 8px;
            }
        }
        .description {
            color: #2e3742;
            font-size: 14px;
            line-height: 22px;
            .icon-box {
                display: inline-flex;
            }
        }
    }
}
</style>
