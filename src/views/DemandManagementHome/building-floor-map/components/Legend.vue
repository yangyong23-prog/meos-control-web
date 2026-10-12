<template>
    <div class="legend-container">
        <div class="col-item">
            <span class="legend-category-name">{{ i18n.global.t('meos_control_web.configuration_status_colon') }}</span>
            <div v-for="(item, index) in renderList" :key="index" class="legend-item">
                <i class="mark" :style="{ background: item.color }"></i>
                <span class="legend-name">{{ item.name }}</span>
            </div>
        </div>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import { demandTypeToLegendMap } from '../../constant/config';

const props = defineProps({
    templateDemandType: {
        type: String,
        default: ''
    },
    floorView: {
        type: Boolean,
        default: false
    }
});

const renderList = ref([]);

watchEffect(() => {
    if (props?.templateDemandType) {
        const { legendItems } = demandTypeToLegendMap(props?.templateDemandType);
        const mode = props?.floorView ? 'floorMode' : 'buildingMode';
        renderList.value = (legendItems?.[mode] || [])?.filter(v => !v?.hide);
    }
});
</script>

<style lang="less" scoped>
.legend-container {
    display: flex;
    align-items: center;
    padding: 11px 16px;
    border-radius: 4px 4px 0px 0px;
    background: linear-gradient(180deg, #e1e7ee 0%, #d6dde5 100%);

    width: max-content;
    flex-wrap: wrap;
    gap: 12px;

    .col-item {
        display: flex;
        align-items: center;
    }

    .legend-category-name {
        color: @grey-800;
        font-size: 14px;
        font-style: normal;
        font-weight: 700;
        height: 18px;
        line-height: 18px;
    }

    .legend-item {
        display: flex;
        align-items: center;
        column-gap: 4px;
        margin-right: 12px;

        &:last-child {
            margin-right: 0;
        }
    }

    .mark {
        display: inline-flex;
        width: 14px;
        height: 14px;
        border-radius: 2px;
    }

    .legend-name {
        color: @grey-600;
        font-size: 14px;
        font-style: normal;
        font-weight: var(--platform-font-weight);
        line-height: 18px;
    }
}
</style>
