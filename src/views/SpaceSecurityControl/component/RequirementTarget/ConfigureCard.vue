<template>
    <div v-for="item in arrList" :key="item" class="configure-card" :style="{ 'border-color': item.color }">
        <div class="name">{{ item.title }}</div>
        <div v-for="(child, childIndex) in item.values" :key="child" class="stage-list">
            <span class="keys"
                >{{ i18n.global.t('meos_control_web.time_period') }}<span v-if="item.values.length > 1">{{ childIndex + 1 }}</span
                >：</span
            >
            <span v-if="child.acrossDay" class="values"
                >{{ i18n.global.t('common.everyday') }} {{ child?.beginTime?.absoluteTime.split(':')?.slice(0, 2)?.join(':') }}-{{ i18n.global.t('meos_control_web.next_day')
                }}{{ child?.endTime.absoluteTime.split(':')?.slice(0, 2)?.join(':') }}</span
            >
            <span v-else class="values"
                >{{ i18n.global.t('common.everyday') }} {{ child?.beginTime?.absoluteTime.split(':')?.slice(0, 2)?.join(':') }}-{{
                    child?.endTime.absoluteTime.split(':')?.slice(0, 2)?.join(':')
                }}</span
            >
        </div>
    </div>
</template>
<script setup>
import i18n from '@/localization';
import { templateTypeToConfigLegendMap } from '../../constants/index';
const templateType = inject('templateType');
const props = defineProps({
    itemData: {
        type: Array,
        default: () => []
    }
});
const arrList = ref([]);
const groupArr = ref([]);
const reduceData = arr => {
    if (arr?.length === 0) return;
    const groupedRes = arr.reduce((acc, cur) => {
        // 查找是否存在相同类型的组
        const existingGroup = acc.find(group => group.type === cur.type);

        if (existingGroup) {
            // 如果存在，则添加到现有组中
            existingGroup.values.push(cur);
        } else {
            // 否则创建新组
            acc.push({ type: cur?.type, borderColor: cur?.borderColor, color: cur?.color, title: cur?.title, values: [cur] });
        }
        return acc;
    }, []);
    return groupedRes;
};
watch(
    () => props.itemData,
    () => {
        let temArr = [];
        if (props?.itemData) {
            const tempArr = [];
            Object.entries(props.itemData || {}).forEach(([key, val]) => {
                if (Array.isArray(val)) {
                    val.forEach(v => {
                        tempArr.push({ type: key, isGlobal: true, configId: 'global', ...v });
                    });
                }
            });
            temArr.push({
                isGlobal: true,
                itemData: tempArr,
                isEmpty: false,
                configId: 'global'
            });
            groupArr.value = temArr
                .map(item => {
                    return item?.itemData;
                })
                .flat();
            const res = groupArr.value?.map(v => {
                if (!v.acrossDay && v?.endTime.absoluteTime === '00:00:00') {
                    v.endTime.absoluteTime = '24:00:00';
                }
                const legendItem = templateTypeToConfigLegendMap[templateType.value]?.find(legendObj => legendObj?.type === v?.type) || {};
                return { ...v, ...legendItem };
            });
            arrList.value = reduceData(res);
        }
    },
    { immediate: true }
);
</script>

<style lang="less" scoped>
.configure-card {
    margin-top: 12px;
    margin-bottom: 16px;
    padding: 8px 12px;
    border-left-width: 3px;
    border-style: solid;
    background: #f7f9fa;
    .name {
        color: #626c78;
        font-size: 14px;
        font-weight: 700;
        margin-bottom: 12px;
    }
    .stage-list {
        font-size: 14px;
        margin-bottom: 8px;
        .keys {
            color: #626c78;
        }
        .values {
            color: #1b2129;
        }
        &:last-child {
            margin-bottom: 0;
        }
    }
}
</style>
