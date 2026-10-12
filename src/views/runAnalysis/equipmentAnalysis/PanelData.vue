<template>
    <div class="panel-data">
        <div class="panel-data-title fcb">
            <span>{{ curSelectedTime }}</span>
            <div class="panel-data-close" @click="emits('close')"><IconMeriActionClose :size="20" /></div>
        </div>
        <m-scrollbar :max-height="500">
            <div v-for="(value, key) in list" :key="key" class="panel-data-box">
                <div class="fw700" style="margin-bottom: 4px">{{ value[0].infoName }}</div>
                <div v-for="(item, i) in value" :key="item.objectName" class="object-item fc">
                    <div class="object-item-icon" :style="{ background: ECHART_COLORS[i] }"></div>
                    <div v-ellipsis class="object-item-name m-ellipsis">
                        {{ item.objectName }}
                    </div>
                    <div class="object-item-value ffCP">{{ item.value }}{{ item.unit }}</div>
                </div>
            </div>
        </m-scrollbar>
    </div>
</template>

<script setup>
import { ECHART_COLORS } from '@/utils/globalVariables';
import { curSelectedTimeKey } from '../injectionKey';
import { IconMeriActionClose } from 'meri-icon';
const emits = defineEmits(['close']);
const props = defineProps({
    data: {
        type: Array,
        default: () => []
    }
});
const curSelectedTime = inject(curSelectedTimeKey); // => src\views\runAnalysis\hooks\useEquipAnalysis.js
const list = computed(() => {
    const infoCodeObj = {};
    props.data.forEach(item => {
        item.children.forEach(child => {
            child.echartData.forEach(data => {
                const { infoCode, infoName } = data;
                let dataValue = data.data?.find(val => val.time === curSelectedTime.value) ?? {},
                    value = null;
                if (dataValue.dataSources?.length) {
                    value = dataValue?.dataSources?.find(val => +val.code === dataValue.value)?.name ?? '--';
                } else {
                    value = dataValue.value || '--';
                }
                const obj = { objectName: data.objectName, value, infoName, unit: child.unit };
                if (infoCodeObj[infoCode]) {
                    infoCodeObj[infoCode].push(obj);
                } else {
                    infoCodeObj[infoCode] = [obj];
                }
            });
        });
    });
    return infoCodeObj;
});
onMounted(() => {});
</script>
<style lang="less" scoped>
.panel-data {
    min-width: 200px;
    padding: 8px 12px;
    .panel-data-close {
        height: 24px;
        border-radius: 4px;
        padding: 2px;
        cursor: pointer;
        &:hover {
            background-color: var(--alpha-30);
        }
    }
    .panel-data-box {
        padding: 12px 0;
        + .panel-data-box {
            border-top: 1px solid var(--gray-200);
        }
    }
    .object-item {
        gap: 4px;
        cursor: default;
        + .object-item {
            margin-top: 6px;
        }
    }
    .object-item-name {
        width: 140px;
    }
    .object-item-icon {
        width: 12px;
        height: 4px;
    }
    .object-item-value {
        margin-left: 20px;
        white-space: nowrap;
    }
}
</style>
