<template>
    <div v-if="!dataValueList.length" class="fcc h100">
        <m-illustration :title="i18n.global.t('common.no_data')" type="noContent"></m-illustration>
    </div>
    <m-scrollbar v-else :key="equipmentInfo?.id" class="operation-monitoring wh100">
        <div v-for="item in dataValueList" :key="item.id" class="group-wrap">
            <TitlePrefix class="title-wrap" :font-size="16" :line-height="24" :title="item.groupName"> </TitlePrefix>
            <RunningParams :data="item" :select-obj="selectObj" />
        </div>
    </m-scrollbar>
</template>

<script setup>
import { useEquipmentInfoHook } from '../../hooks/useEquipmentInfoHook';
import TitlePrefix from '@/components/title-prefix/index.vue';
import RunningParams from '../../widget/running-params/index.vue';
import i18n from '@/localization';

const props = defineProps({
    selectObj: {
        type: Object,
        default: () => {
            return {};
        }
    },
    runningMonitorType: {
        type: String,
        default: ''
    }
});
const emits = defineEmits(['setRelEquipmentIds']);

const { equipmentInfo } = useEquipmentInfoHook(props, emits);
const dataValueList = computed(() => {
    const arr = [];
    if (equipmentInfo.value.runningParameter) {
        arr.push(equipmentInfo.value.runningParameter);
    }
    if (equipmentInfo?.value?.techniqueParameter) {
        arr.push(equipmentInfo.value.techniqueParameter);
    }

    return arr;
});
</script>
<style lang="less" scoped>
.operation-monitoring {
    padding: 16px 24px;
}
.title-wrap {
    margin-bottom: 12px;
}
.group-wrap {
    & + .group-wrap {
        margin-top: 12px;
    }
}
</style>
