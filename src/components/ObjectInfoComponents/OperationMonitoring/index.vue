<template>
    <div class="operation-monitoring-container wh100">
        <slot name="halfSectionView"></slot>
        <template v-if="hasData">
            <div v-for="(value, key) in groupData" :key="key" class="operation-monitoring-container-item" :class="key">
                <template v-if="$slots[key]">
                    <slot :id="key" :name="key" :value="value"></slot>
                </template>
                <template v-else-if="value.groupName">
                    <div class="group-name-detail-configuration">{{ value.groupName }}</div>
                    <component
                        :is="getComponentByGroupCode(key, props)"
                        :id="id"
                        :code="key"
                        :select-obj="selectObj?.id ? selectObj : { id: id }"
                        :stratification="stratification"
                        :data="value"
                        v-bind="{ ...componentAttrs, ...(value.customAttrs?.(value, key) || {}) }"
                    >
                    </component>
                </template>
            </div>
        </template>
        <template v-else>
            <div class="wh100 fcc">
                <m-illustration :title="i18n.global.t('common.no_data')" type="noContent"></m-illustration>
            </div>
        </template>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { getComponentByGroupCode } from './config';
import i18n from '@/localization';
import { GROUP_CODE_KEY_MAP } from '@/utils/globalVariables';

const props = defineProps({
    id: {
        type: String,
        default: ''
    },
    selectObj: {
        type: Object,
        default: () => ({})
    },
    runningMonitorType: {
        type: String,
        default: ''
    },
    res: {
        type: Object,
        default: () => ({}),
        required: true
    },
    // 是否分层展示
    stratification: {
        type: Boolean,
        default: true
    },
    groupCodes: {
        type: Array,
        default: () => [GROUP_CODE_KEY_MAP.equipParameterSet, GROUP_CODE_KEY_MAP.runningParameter]
    },
    componentAttrs: {
        type: Object,
        default: () => ({})
    },
    customControlComponent: Function,
    customAttrs: Function,
    dataValueFilter: {
        type: Array,
        default: () => []
    }
});
const groupData = computed(() => {
    // 获取指定的组数据
    if (!props.res?.relInfoCodeGroupConfigs || !Array.isArray(props.res.relInfoCodeGroupConfigs)) {
        return {};
    }
    // 过滤特殊的分组数据，dataValueFilter 用于指定需要过滤的 groupCode，如果 groupCode 在 dataValueFilter 中，则只保留其 dataValue 有值的分组
    const arr = props.res?.relInfoCodeGroupConfigs.filter(item => {
        if (props.dataValueFilter.includes(item.groupCode)) {
            return item?.relInfoCodeConfigs?.[0]?.dataValue?.length;
        }
        return true;
    });
    // 根据 groupCodes 过滤出需要的组数据
    let groups;
    if (props.groupCodes && props.groupCodes.length > 0) {
        groups = props.groupCodes.map(groupCode => arr.find(item => item.groupCode === groupCode)).filter(Boolean);
    } else {
        groups = arr.filter(group => group && group.groupCode);
    }

    // 按分组配置的 groupOrder 升序展示，未配置排序值的分组排在最后
    return groups
        .sort((a, b) => {
            const aHasOrder = a?.groupOrder !== undefined && a?.groupOrder !== null && a?.groupOrder !== '';
            const bHasOrder = b?.groupOrder !== undefined && b?.groupOrder !== null && b?.groupOrder !== '';
            if (aHasOrder !== bHasOrder) {
                return aHasOrder ? -1 : 1;
            }
            const aOrder = aHasOrder ? a.groupOrder : 0;
            const bOrder = bHasOrder ? b.groupOrder : 0;
            return aOrder - bOrder;
        })
        .reduce((acc, group) => {
            acc[group.groupCode] = group;
            return acc;
        }, {});
});

// 检查是否有有效的组数据和配置项
const hasData = computed(() => {
    const groups = Object.values(groupData.value);
    return groups.length > 0 && groups.some(item => item.groupCode);
});
</script>

<style lang="less" scoped>
.operation-monitoring-container {
    padding: 16px 24px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    &-item {
        display: none;
        &:has(div) {
            display: block;
        }
        &.fanAndWater {
            display: none;
        }
        &.fanAndWater:has(div) {
            display: block;
        }
        &.controlGroupOfTheSeriesConnectedChiller {
            display: none;
        }
        &.controlGroupOfTheSeriesConnectedChiller:has(.template-five-container) {
            display: block;
        }
    }
}
</style>
