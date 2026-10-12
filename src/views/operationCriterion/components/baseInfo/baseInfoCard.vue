<template>
    <div class="criterion-baseinfo-card">
        <div v-ellipsis class="criterion-baseinfo-card-title m-ellipsis">
            {{ item.localName || '--' }}
            <span class="ocg-space-card-title-building">{{ topBracketName }}</span>
        </div>

        <div v-if="item.num > 0" v-ellipsis class="criterion-baseinfo-card-info m-ellipsis" :style="{ whiteSpace: item.num > 0 ? 'nowrap' : 'normal' }">
            {{ i18n.global.t('meos_control_web.business_hours') }}：{{ formatHtml }}
        </div>
        <div v-else class="criterion-baseinfo-card-info">
            <div class="criterion-baseinfo-card-info-time">
                {{ i18n.global.t('meos_control_web.business_hours_colon') }}<span>{{ getTimeFormat(props.item.timeRange[0]) }}</span>
            </div>
            <div
                v-if="secondLine.length"
                v-ellipsis="{
                    title: formatHtml,
                    class: 'criterion-baseinfo-card-info-pop'
                }"
                class="criterion-baseinfo-card-info-time m-ellipsis"
            >
                <span v-for="(i, index) in secondLine" :key="i" :style="`margin-left: ${index === 0 ? 0 : 4}px`">{{ i }}</span>
            </div>
        </div>
        <div v-if="item.num > 0" class="criterion-baseinfo-card-btn">
            <dropdownBtn v-bind="$props" :space-title="i18n.global.t('meos_control_web.space_uses_this_business_hours')"></dropdownBtn>
        </div>
    </div>
</template>
<script setup>
import i18n from '@/localization';
import dropdownBtn from '../common/dropdownBtn.vue';
const props = defineProps({
    showExtra: {
        type: Boolean,
        default: false
    },
    item: {
        type: Object,
        default: () => {}
    },
    treeData: {
        type: Array,
        default: () => [
            {
                id: '12F',
                name: '12F',
                children: [
                    {
                        id: '制冷机房#_04',
                        name: '制冷机房#_04'
                    }
                ]
            },
            {
                id: '11F',
                name: '11F',
                children: [
                    {
                        id: '制冷机房#_01',
                        name: '制冷机房#_01'
                    }
                ]
            }
        ]
    }
});
const getTimeFormat = time => {
    return time === '00:00-23:59' ? i18n.global.t('meos_control_web.all_day') : time?.replace('23:59', '24:00') || i18n.global.t('meos_control_web.closed');
};
const formatHtml = computed(() => {
    if (props.item.num > 0) {
        if (props.item.timeRange.length > 1) {
            return props.item.timeRange.join(' ');
        } else {
            return props.item.timeRange.map(time => getTimeFormat(time)).join(' ');
        }
    } else {
        if (props.item.timeRange.length > 1) {
            return (
                i18n.global.t('meos_control_web.business_hours_colon') +
                props.item.timeRange
                    .map((i, index) => {
                        if (i) {
                            return `<span style="margin-left: ${index === 0 ? 0 : 4}px">${i}</span>`;
                        }
                        return '';
                    })
                    .join('')
            );
        } else if (props.item.timeRange) {
            return (
                i18n.global.t('meos_control_web.business_hours_colon') +
                props.item.timeRange
                    .map((i, index) => {
                        if (i) {
                            return `<span style="margin-left: ${index === 0 ? 0 : 4}px">${getTimeFormat(i)}</span>`;
                        }
                        return '';
                    })
                    .join('')
            );
        } else {
            return '';
        }
    }
});
const secondLine = computed(() => {
    if (props.item.timeRange && props.item.timeRange.length > 1) {
        return props.item.timeRange.slice(1);
    }
    return [];
});
const topBracketName = computed(() => {
    if (props.item.buildingLocalName && props.item.floorLocalName) {
        return `(${props.item.buildingLocalName}-${props.item.floorLocalName})`;
    }
    if (props.item.buildingLocalName) {
        return `(${props.item.buildingLocalName})`;
    }
    if (props.item.floorLocalName) {
        return `(${props.item.floorLocalName})`;
    }
    return '';
});
</script>
<style lang="less" scoped>
.criterion-baseinfo-card {
    display: flex;
    padding: 8px 16px;
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
    flex: 1 0 0;
    border-radius: 4px;
    background: rgba(196, 201, 207, 0.12);
    width: 251px;
    height: 100px;
    padding: 8px 16px;
    .criterion-baseinfo-card-title {
        color: var(--gray-800, #2e3742);
        font-size: 14px;
        font-style: normal;
        font-weight: 700;
        max-width: 100%;
        line-height: 22px;
        .ocg-space-card-title-building {
            color: var(--gray-900, #1b2129);
            font-size: 14px;
            font-style: normal;
            font-weight: var(--platform-font-weight);
            line-height: 22px; /* 157.143% */
        }
    }
    .criterion-baseinfo-card-info {
        color: var(--gray-500, #8b949e);
        font-size: 14px;
        display: block;
        font-style: normal;
        font-weight: var(--platform-font-weight);
        line-height: 22px;
        white-space: normal;
        word-wrap: break-word;

        span {
            display: inline-block;
            white-space: nowrap;
        }
    }
    .criterion-baseinfo-card-btn {
        border-radius: 4px;
        width: 100%;
    }
}
</style>
<style lang="less">
.criterion-baseinfo-card-info-pop {
}
</style>
