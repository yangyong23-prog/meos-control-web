<template>
    <div class="notify">
        <m-popover v-if="notifyList?.length" popover-class="notify-list-popover">
            <template #content>
                <div class="scroll-popover">
                    <div v-for="item in poverNotifyList" :key="item.id" class="popover-box fc">
                        <m-tag :color="tagStyle[item.operateType]?.color" :bg-color="tagStyle[item.operateType]?.bgColor" size="small">{{ item.label }}</m-tag>
                        <span>{{ item.dataTime }}&nbsp;{{ item.createUser }}{{ item.content }}</span>
                        <div class="icon-box fc" :style="{ color: LogState[item.state]?.color }">
                            &nbsp;
                            <img :src="LogState[item.state]?.icon" alt="" style="height: 16px; width: 16px" />
                            &nbsp;{{ LogState[item.state]?.name }}
                        </div>
                    </div>
                </div>
            </template>
            <div class="notify-wrap">
                <NotifytList v-if="Refresh" :data="notifyList" />
            </div>
        </m-popover>
    </div>
</template>
<script setup>
import i18n from '@/localization';
import success from '@/assets/images/log/success.png';
import failed from '@/assets/images/log/failed.png';
import overtime from '@/assets/images/log/overtime.png';
import stop from '@/assets/images/log/stop.png';
import error from '@/assets/images/log/error.png';
import unkonw from '@/assets/images/log/unknow.png';
import NotifytList from './NotifytList.vue';
import { tagStyle } from '@/constants/broadCast';

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
const props = defineProps({
    notifyList: {
        type: Array,
        default: () => []
    }
});
const poverNotifyList = ref([]);
const Refresh = ref(true);

watch(
    () => props.notifyList,
    val => {
        poverNotifyList.value = structuredClone(val);
        Refresh.value = false;
        nextTick(() => {
            Refresh.value = true;
        });
    },
    { immediate: true, deep: true }
);
</script>
<style lang="less" scoped>
.notify {
    .notify-wrap {
        width: 100%;
        height: 54px;
        overflow: hidden;
    }
}

.scroll-popover {
    .popover-box {
        font-family: Microsoft YaHei UI;
        margin-bottom: 16px;
        display: flex;
        align-items: start;
        span {
            display: inline-block;
            margin-left: 8px;
            width: calc(100% - 40px);
            word-wrap: break-word;
            word-break: break-all;
        }
        .icon-box {
            width: 108px;
        }
        &:last-child {
            margin-bottom: 0;
        }
    }
}
</style>
<style lang="less">
.notify-list-popover {
    --aside-padding: 16px;
    padding: 20px 20px 16px 20px !important;
    border-radius: 8px !important;
    border: 1px solid #e1e5eb;
    width: calc(370px + var(--aside-padding));
    max-width: calc(370px + var(--aside-padding));
}

@media only screen and (min-width: 1600px) {
    .notify-list-popover {
        --aside-padding: 16px;
        width: calc(450px + var(--aside-padding)) !important;
        max-width: calc(450px + var(--aside-padding)) !important;
    }
}
</style>
