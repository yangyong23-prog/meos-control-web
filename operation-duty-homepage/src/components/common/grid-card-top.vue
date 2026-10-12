<template>
    <div class="acac-grid-card-top">
        <div v-if="hasOperatingMode" class="card-top-left" :style="`max-width: calc(100% - ${currentSwitchSet.length ? 36 : 0}px);`">
            <div class="card-current-mode">{{ i18n.global.t('operation_duty_homepage.meos_home_current_operating_conditions') }}</div>
            <div v-ellipsis class="card-current-mode-name m-ellipsis">{{ currentOperatingModeName }}</div>
        </div>
        <div v-else-if="currentSwitchSet.length" class="card-top-left" :style="`max-width: calc(100% - ${currentSwitchSet.length ? 36 : 0}px);`">
            <div class="card-top-list-wr fcs">
                <div v-for="(item, index) in currentSwitchSet.slice(0, 1)" :key="index" class="card-top-item">
                    <div class="card-top-item-label">{{ item?.infoCodeName }}{{ i18n.global.t('operation_duty_homepage.meos_home_dot') }}</div>
                    <div class="card-top-item-content">
                        <m-tag v-if="item.setValue === '1'" color="#FFF" bg-color="#14C4C4" size="small">{{ i18n.global.t('common.status_open') }}</m-tag>
                        <m-tag v-else-if="item.setValue === '0'" color="#FFF" bg-color="#8B949E" size="small">{{ i18n.global.t('common.status_close') }}</m-tag>
                        <m-tag v-else color="#FFF" bg-color="#8B949E" size="small">--</m-tag>
                        <span> {{ item.time.openTime }} {{ i18n.global.t('common.status_open') }} </span>
                        <span> {{ item.time.closeTime }} {{ i18n.global.t('common.status_close') }} </span>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="(hasOperatingMode && currentSwitchSet.length) || (!hasOperatingMode && currentSwitchSet.length > 1)" ref="cardTopRight" class="card-top-right">
            <m-popover placement="bottom-end" trigger="hover">
                <template #content>
                    <div class="acac-card-popover" style="">
                        <div v-if="hasOperatingMode" class="card-top-header">
                            <div class="card-top-label">{{ i18n.global.t('operation_duty_homepage.meos_home_current_operating_conditions') }}</div>
                            <div class="card-top-mode">{{ currentOperatingModeName }}</div>
                        </div>
                        <div class="card-top-list fcs">
                            <div v-for="(item, index) in currentSwitchSet" :key="index" class="card-top-item">
                                <div class="card-top-item-label">{{ item?.infoCodeName }}{{ i18n.global.t('operation_duty_homepage.meos_home_dot') }}</div>
                                <div class="card-top-item-content">
                                    <m-tag v-if="item.setValue === '1'" color="#FFF" bg-color="#14C4C4" size="small">{{ i18n.global.t('common.status_open') }}</m-tag>
                                    <m-tag v-else-if="item.setValue === '0'" color="#FFF" bg-color="#8B949E" size="small">{{ i18n.global.t('common.status_close') }}</m-tag>
                                    <m-tag v-else color="#FFF" bg-color="#8B949E" size="small">--</m-tag>
                                    <span> {{ item.time.openTime }} {{ i18n.global.t('common.status_open') }} </span>
                                    <span> {{ item.time.closeTime }} {{ i18n.global.t('common.status_close') }} </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>
                <div class="card-top-more">{{ i18n.global.t('common.more') }}</div>
            </m-popover>
        </div>
    </div>
</template>
<script setup>
import i18n from '@/localization';
import { useElementSize } from '@vueuse/core';
import dayjs from 'dayjs';
const cardTopRight = ref();
const { width } = useElementSize(cardTopRight);
const props = defineProps({
    data: {
        type: Object,
        default: () => {}
    },
    currentSwitchSet: {
        type: Array,
        default: () => []
    }
});
// 是否有运行工况
const hasOperatingMode = computed(() => {
    return !!props.data?.infoCodeAndValue?.currentOperatingMode;
});
const currentOperatingModeName = computed(() => {
    if (props.data?.infoCodeAndValue?.currentOperatingMode) {
        const gk = props.data?.infoCodeAndValue?.currentOperatingMode?.dataSources?.find(
            status =>
                status.code === props.data?.infoCodeAndValue?.currentOperatingMode?.dataValue || status.code === props.data?.infoCodeAndValue?.currentOperatingMode?.infoCodeValue
        );
        if (gk) {
            return gk.name;
        }
        return '--';
    }
    return '--';
});
</script>
<style lang="less" scoped>
.acac-grid-card-top {
    width: 100%;
    display: flex;
    flex-grow: 0;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    .card-top-left {
        display: flex;
        flex-direction: row;
        align-items: center;
        .card-current-mode {
            color: var(--gray-600, #626c78);
            font-size: 14px;
            font-style: normal;
            font-weight: 400;
            line-height: 22px; /* 157.143% */
        }
        .card-current-mode-name {
            color: var(--gray-900, #1b2129);
            font-size: 14px;
            font-style: normal;
            font-weight: 400;
            line-height: 22px; /* 157.143% */
        }
    }

    .card-top-right {
        .card-top-more {
            cursor: default;
            color: var(--blue-500, #246fe5);
            text-align: center;
            font-size: 14px;
            font-style: normal;
            font-weight: 400;
            line-height: 22px; /* 157.143% */
            padding: 3px 4px;
            &:hover {
                border-radius: 4px;
                background: var(--Grey-Alpha-30, rgba(196, 201, 207, 0.3));
            }
        }
    }
}
.acac-card-popover {
    max-height: 300px;
    box-sizing: border-box;
    padding: 12px 8px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    .card-top-header {
        display: flex;
        flex-direction: row;
        align-items: center;
        .card-top-label {
            color: var(--gray-600, #626c78);
            font-size: 14px;
            font-style: normal;
            white-space: nowrap;
            font-weight: 400;
            line-height: 22px; /* 157.143% */
        }
        .card-top-mode {
            color: var(--gray-900, #1b2129);
            font-size: 14px;
            font-style: normal;
            font-weight: 400;
            line-height: 22px; /* 157.143% */
        }
    }
}
.card-top-list-wr {
    display: flex;
    flex-direction: column;
    gap: 12px;
    .card-top-item {
        display: flex;
        flex-direction: row;
        .card-top-item-label {
            color: var(--gray-600, #626c78);
            font-size: 14px;
            font-style: normal;
            font-weight: 400;
            line-height: 22px; /* 157.143% */
        }
        .card-top-item-content {
            display: flex;
            flex-direction: row;
            align-items: center;
            gap: 4px;
        }
    }
}
.card-top-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-top: 12px;
    .card-top-item {
        display: flex;
        flex-direction: row;
        .card-top-item-label {
            color: var(--gray-600, #626c78);
            font-size: 14px;
            font-style: normal;
            font-weight: 400;
            line-height: 22px; /* 157.143% */
        }
        .card-top-item-content {
            display: flex;
            flex-direction: row;
            align-items: center;
            gap: 4px;
        }
    }
}
</style>
