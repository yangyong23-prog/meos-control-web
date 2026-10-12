<template>
    <div class="operation-criterion-panel-seperatpor">
        <div class="operation-criterion-panel-seperatpor-line"></div>
        <div class="operation-criterion-panel-seperatpor-info">
            <i18n-slot html-tag="span" name-key="meos_control_web.below_num_obj_has" :plural="num">
                <template #num>
                    <span class="operation-criterion-panel-roooms-count">{{ num }}</span>
                </template>
                <template #info>
                    {{ info }}
                </template>
            </i18n-slot>
        </div>
        <div class="operation-criterion-panel-seperatpor-line"></div>
    </div>
</template>
<script setup>
import I18nSlot from '@/components/I18nSlot.vue';
import i18n from '@/localization';
defineProps({
    num: {
        type: String,
        default: ''
    },
    info: {
        type: String,
        default: ''
    }
});
</script>
<style lang="less" scoped>
.operation-criterion-panel-seperatpor {
    width: 100%;
    display: flex;
    flex-direction: row;
    margin: 12px 0;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    padding: 8px 0px;
    .operation-criterion-panel-seperatpor-line {
        display: flex;
        flex-grow: 1;
        flex-shrink: 1;
        height: 1px;
        background-color: var(--gray-300, #e1e5eb);
    }
    .operation-criterion-panel-seperatpor-info {
        display: inline-flex;
        flex-grow: 0;
        flex-shrink: 1;
        flex-direction: row;
        align-items: center;
        color: var(--gray-600, #626c78);
        font-size: 16px;
        font-style: normal;
        font-weight: var(--platform-font-weight);
        line-height: 22px; /* 137.5% */
        .operation-criterion-panel-roooms-count {
            color: var(--orange-700, #e68600);
            font-size: 16px;
            font-style: normal;
            font-weight: 700;
            line-height: 22px;
        }
    }
}
</style>
