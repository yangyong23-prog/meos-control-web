<template>
    <div class="switch-control">
        <div class="switch-control-title fc">
            <slot name="name" :data="data">
                <div
                    class="switch-control-title-text"
                    :class="{ isACzone: data.classCode === 'ACZone' }"
                    :style="styleTitle || `max-width: calc(100% - ${hasIcon ? '198px' : '164px'})`"
                >
                    <div v-ellipsis="{ title: data.infoCodeName }" class="m-ellipsis">{{ data.infoCodeName }}</div>
                    <SpaceIcon v-if="data.classCode === 'ACZone'" :data="data" @open-space-list="emit('openSpaceList', data)" />
                </div>
            </slot>

            <template v-if="$slots.header">
                <slot name="header" :data="data" />
            </template>

            <template v-else>
                <div class="switch-control-times fc">
                    {{ getOpenAndCloseTime.openTime }}{{ i18n.global.t('common.status_open') }}
                    <div style="height: 12px; width: 1px; background-color: #d9d9d9; margin: 0 4px"></div>
                    {{ getOpenAndCloseTime.closeTime }}{{ i18n.global.t('common.status_close') }}
                    <m-popover @show="showPlanList">
                        <template #content>
                            <PlanList :data="data" :system-id="systemId" :console-types="consoleTypes" :system-type="systemType" />
                        </template>
                        <div class="fcc icon-info" style="margin-left: 5px">
                            <SvgIcon name="info" />
                        </div>
                    </m-popover>
                </div>
            </template>

            <slot name="icon"></slot>
        </div>
        <SetAndActual
            :active-set-form-data="activeSetFormData"
            :data="data"
            :disabled="disabled"
            :disabled-text="disabledText"
            :disabled-no-value="disabledNoValue"
            :lock-disabled="lockDisabled"
            :has-actual="hasActual"
            :set-value-always="setValueAlways"
            :manual-auto-set-data="manualAutoSetData"
            @open-set-form="openSetForm"
        />
    </div>
    <slot name="footer"></slot>
</template>

<script setup>
import i18n from '@/localization';
import SetAndActual from './SetAndActual.vue';
import SvgIcon from './SvgIcon.vue';
import PlanList from './PlanList.vue';
import dayjs from 'dayjs';
import SpaceIcon from './SpaceIcon.vue';
const props = defineProps({
    data: {
        type: Object,
        default: () => ({})
    },
    hasIcon: {
        type: Boolean,
        default: false
    },
    hasActual: {
        type: Boolean,
        default: false
    },
    disabled: {
        type: Boolean,
        default: false
    },
    disabledText: {
        type: String,
        default: ''
    },
    disabledNoValue: {
        type: Boolean,
        default: false
    },
    lockDisabled: {
        type: Boolean,
        default: false
    },
    setValueAlways: {
        type: Boolean,
        default: false
    },
    styleTitle: {
        type: String,
        default: ''
    },
    activeSetFormData: {
        type: Object,
        default: () => ({})
    },
    manualAutoSetData: {
        type: String,
        default: ''
    },
    systemId: {
        type: String,
        default: ''
    },
    consoleTypes: {
        type: String,
        default: ''
    },
    systemType: {
        type: String,
        default: ''
    }
});
const emit = defineEmits(['openSetForm', 'showPlanList', 'openSpaceList']);
const openSetForm = e => {
    emit('openSetForm', e);
};
const showPlanList = () => {
    emit('showPlanList');
};
console.log(dayjs().isBefore(dayjs('2011-01-01')));

// 获取开启时间和关闭时间
const getOpenAndCloseTime = computed(() => {
    const today = dayjs().format('YYYY-MM-DD'); // 当前日期
    const filteredData =
        props.data.switchSetRecordList?.filter(item => {
            item.operateTime = dayjs(item.operateTime).format('YYYY-MM-DD HH:mm:ss');
            return item.operateTime.startsWith(today);
        }) || [];

    // 获取开启时间(actualValue=1 的最早时间点)
    const openTime = filteredData
        .filter(item => item.actualValue === '1')
        .map(item => item.operateTime)
        .sort()[0];

    // 获取关闭时间（actualValue=0 的最晚时间点）
    const closeTime = filteredData
        .filter(item => item.actualValue === '0')
        .map(item => item.operateTime)
        .sort()
        .reverse()[0];

    // 判断关闭时间是否早于等于开启时间
    let finalCloseTime = '';
    if (!closeTime) {
        finalCloseTime = '--';
    } else if (dayjs(closeTime).isBefore(dayjs(openTime)) && openTime) {
        finalCloseTime = '--';
    } else {
        finalCloseTime = dayjs(closeTime).format('HH:mm');
    }

    return { openTime: openTime ? dayjs(openTime).format('HH:mm') : '--', closeTime: finalCloseTime };
});
</script>
<style lang="less" scoped>
.switch-control-title-text {
    position: relative;
    padding-right: 4px;
    &.isACzone {
        padding-right: 20px;
    }
}
.switch-control {
    &-title {
        height: 24px;
        line-height: 24px;
        position: relative;
        .icon-info {
            &:hover {
                background-color: var(--gray-300);
            }
        }
    }
    &-times {
        background-color: var(--gray-200);
        border-radius: 4px;
        padding: 2px 4px;
        color: var(--gray-600);
        margin-left: 4px;
    }
}
</style>
