<template>
    <div>
        <div v-if="filteredInfoCodes.length" class="row-box-flex">
            <div v-for="(item, index) in filteredInfoCodes" :key="index" class="run-condition-list" :class="[item.linkCodes ? 'w100' : 'w50']">
                <div
                    v-if="item.linkCodes"
                    v-ellipsis
                    :class="[
                        item.parameterType == i18n.global.t('meos_control_web.operating_parameters') && hasDataValue(item.linkCodes) ? 'active' : '',
                        'link-codes',
                        'run-condition-list-value',
                        'm-ellipsis'
                    ]"
                    @click="emit('goInfo', item, passLinkCodes ? item.linkCodes : undefined)"
                >
                    <span
                        v-for="(obj, objIndex) in item.linkCodes"
                        :key="objIndex"
                        :style="{ marginLeft: objIndex === 0 ? '0' : '5px' }"
                        @mousemove="emit('openTime', $event, obj, item)"
                        @mouseleave="emit('closeTime')"
                    >
                        {{ fixName(obj.name) }}: {{ obj.dataValueName || '--' }} {{ obj.unit }}
                    </span>
                </div>
                <div
                    v-else
                    v-ellipsis
                    :class="[
                        item.parameterType == i18n.global.t('meos_control_web.operating_parameters') && item.dataValue ? 'active' : '',
                        'run-condition-list-value',
                        'm-ellipsis'
                    ]"
                    @mousemove="emit('openTime', $event, item)"
                    @mouseleave="emit('closeTime')"
                    @click="emit('goInfo', item)"
                >
                    {{ getInfoValueText(item) }}
                </div>
                <div v-ellipsis class="run-condition-list-name m-ellipsis">{{ item.name }}</div>
            </div>
        </div>
        <div v-else class="empty-wrap">
            <span>{{ i18n.global.t('meos_control_web.no_valid_data') }}</span>
        </div>
    </div>
</template>

<script lang="ts" setup>
// @ts-ignore
import i18n from '@/localization';
import { getValueStr } from '@/utils/viewUtils';
import { isEdge } from '@/utils/envUtils';

const props = defineProps({
    infoCodes: {
        type: Array as any,
        default: () => []
    },
    passLinkCodes: {
        type: Boolean,
        default: true
    }
});

const emit = defineEmits(['openTime', 'closeTime', 'goInfo']);

const getInfoValueText = (item: any) => {
    return (getValueStr(item) as any).text;
};
const hasDataValue = (linkCodes: any[]) => {
    return linkCodes.some((link: { dataValue: any }) => link.dataValue);
};
// 云端隐藏无有效值的信息点，边缘端保留全部信息点。
const checkShowFilter = (item: any) => {
    if (isEdge()) {
        return true;
    }
    if (item.linkCodes?.length) {
        return !item.linkCodes.every((obj: any) => (obj.dataValueName || '--') === '--');
    }
    const valueText = getInfoValueText(item);
    return !(typeof valueText === 'string' && valueText.startsWith('--'));
};

const filteredInfoCodes = computed(() => props.infoCodes.filter((item: any) => checkShowFilter(item)));

const fixName = (name?: string) => {
    if (!name) return '';
    if (name.endsWith(':') || name.endsWith('：')) {
        return name.slice(0, -1);
    }
    return name;
};
</script>

<style lang="less" scoped>
.row-box-flex {
    display: flex;
    justify-content: space-between;
    width: 100%;
    flex-wrap: wrap;
    gap: 12px 16px;
    padding-left: 12px;
}
.w100 {
    width: 100%;
    min-width: 100%;
}
.w50 {
    width: calc(50% - 12px);
    min-width: calc(50% - 12px);
}
.run-condition-list {
    &-name {
        word-wrap: break-word;
        word-break: normal;
        text-align: left;
        font-size: 14px;
        line-height: 22px;
        color: var(--gray-600, #626c78);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        word-break: break-all;
    }
    &-value {
        font-size: 14px;
        line-height: 22px;
    }
}
.active {
    color: var(--blue-500);
    cursor: pointer;
}
.active:hover {
    color: var(--blue-700);
}
.empty-wrap {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    gap: 10px;
    padding: 12px 20px;
    color: var(--gray-600, #626c78);
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 22px;
    background: var(--gray-50, #f7f9fa);
    border-radius: 4px;
}
</style>
