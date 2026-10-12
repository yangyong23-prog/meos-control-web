<template>
    <m-tips
        v-for="dangerItem in renderedCards || []"
        :key="dangerItem.dangerEventId"
        :content="i18n.global.t('meos_control_web.open_new_tab_risk_hazard_tree')"
        theme="darkTransparent"
    >
        <div class="risk-card" @click="riskInfo(dangerItem, dangerItem)">
            <template v-if="props.riskCardShowType === 'unknown'">
                <TemplateUnknown :danger-item="dangerItem" />
            </template>
            <template v-else-if="props.riskCardShowType === 'riskManagement'">
                <TemplateRiskManagement :danger-item="dangerItem" />
            </template>
            <template v-else>
                <slot name="riskCard" :danger-item="dangerItem"></slot>
            </template>
        </div>
    </m-tips>
</template>

<script setup>
import i18n from '@/localization';
import { riskJumpFun } from '@/utils/envUtils';
import TemplateRiskManagement from './TemplateRiskManagement.vue';
import TemplateUnknown from './TemplateUnknown.vue';
import { useIdleRenderCards } from '@/hooks/useIdleRenderCards';

const props = defineProps({
    isActive: {
        type: Boolean,
        default: false
    },
    data: {
        type: Array,
        default: () => []
    },
    riskCardShowType: {
        type: String,
        // unknown、riskManagement(状态不明、风险管控)
        default: 'unknown'
    }
});

const { renderedCards, timeSlicing } = useIdleRenderCards(props);

watch([() => props.data, () => props.isActive], () => {
    if (props.isActive) {
        timeSlicing();
    }
});

const riskInfo = (value, item) => {
    riskJumpFun(Object.assign(value, { localName: item.localName || item.name }));
};
</script>

<style lang="less" scoped>
.risk-card {
    display: flex;
    padding: 12px;
    flex-direction: column;
    row-gap: 4px;
    justify-content: center;
    align-items: flex-start;
    gap: 4px;
    position: relative;
    cursor: pointer;

    &::after {
        position: absolute;
        content: '';
        top: 0;
        left: 12px;
        right: 12px;
        border-top: 1px dashed #dacdcd;
    }

    &:hover {
        background: rgba(196, 201, 207, 0.3);
        border-radius: 4px;
    }
}
</style>
