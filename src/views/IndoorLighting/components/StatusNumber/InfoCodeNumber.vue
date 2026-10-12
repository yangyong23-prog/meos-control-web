<template>
    <span class="info-code-number" :style="{ '--color': color }">{{ equipments.length }}</span>
</template>

<script setup>
import DockSingleton from '@/hooks/responsiveDock';

const props = defineProps({
    objects: {
        type: Array,
        default: () => []
    },
    infoCode: {
        type: String,
        default: ''
    },
    dataValue: {
        type: [Number, String],
        default: ''
    },
    checkDataValue: {
        type: Function,
        default: undefined
    },
    color: {
        type: String,
        default: ''
    }
});
const { getIotData } = DockSingleton.getInstance();
const model = defineModel({ type: Array, default: [] });
const rule = defineModel('rule', { type: Boolean, default: false });

const equipments = computed(() => {
    const arr = [];
    props.objects.forEach(item => {
        const data = getIotData(item.id, props.infoCode);
        if (props.checkDataValue ? props.checkDataValue(data.dataValue) : props.dataValue === data.dataValue) {
            arr.push(data);
        }
    });
    return arr;
});

// AI 建议优化
const statusInfo = computed(() => {
    const list = [];
    let hasRule = false;

    props.objects.forEach(item => {
        const data = getIotData(item.id, props.infoCode);
        const matched = props.checkDataValue ? props.checkDataValue(data.dataValue) : props.dataValue === data.dataValue;
        if (matched) list.push(data);
        if (data.existsIotRule || data.infoCode) hasRule = true;
    });

    return { list, hasRule };
});

watch(
    statusInfo,
    newVal => {
        model.value = [...newVal.list];
        rule.value = newVal.hasRule;
    },
    { immediate: true }
);
</script>
<style lang="less" scoped>
.info-code-number {
    color: var(--color);
}
</style>
