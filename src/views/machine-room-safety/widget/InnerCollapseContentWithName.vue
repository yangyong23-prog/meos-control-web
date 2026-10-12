<template>
    <m-collapse v-model="subCollapseIds" class="second-collapse-container">
        <m-collapse-item v-for="subItem in props.data" :id="subItem.key" :key="subItem.key">
            <template #title="{ isActive }">
                <div class="risk-list-name-wrap">
                    <div v-ellipsis class="risk-list-name m-ellipsis">{{ subItem.localName || '' }}</div>
                    <div class="extend">
                        <Interest v-if="subItem?.dangerItem?.followMark" class="interest" />
                        <m-tag v-if="subItem?.dangerItem?.status === RISK_EVENT_STATUS_MAP.EXCEPTION" color="#fff" bg-color="#F55047" size="small">
                            {{ i18n.global.t('meos_control_web.risk_occurred') }}
                        </m-tag>
                        <m-tag v-if="subItem?.dangerItem?.status === RISK_EVENT_STATUS_MAP.CONJECTURE_EXCEPTION" color="#fff" bg-color="#F55047" size="small">
                            {{ i18n.global.t('meos_control_web.presumed_occurrence') }}
                        </m-tag>
                        <m-tag v-if="subItem?.dangerItem?.status === RISK_EVENT_STATUS_MAP.POTENTIAL" color="#fff" bg-color="#FF9D2D" size="small">
                            {{ i18n.global.t('meos_control_web.potential_risk') }}
                        </m-tag>
                        <m-tag v-if="subItem?.dangerItem?.status === RISK_EVENT_STATUS_MAP.UNKNOWN" color="#fff" bg-color="#8252E3" size="small">
                            {{ i18n.global.t('meos_control_web.status_unknown') }}
                        </m-tag>
                        <m-tag v-if="subItem?.dangerItem?.status === RISK_EVENT_STATUS_MAP.GENERAL_NORMAL" color="#fff" bg-color="#15AE55" size="small">
                            {{ i18n.global.t('meos_control_web.generally_normal') }}
                        </m-tag>
                        <m-tag v-if="subItem?.dangerItem?.status === RISK_EVENT_STATUS_MAP.NORMAL" color="#fff" bg-color="#15AE55" size="small">
                            {{ i18n.global.t('meos_control_web.normal') }}
                        </m-tag>
                    </div>
                </div>

                <IconMeriComponentChevronDown :color="'#8B949E'" :class="{ 'collapse-custom-icon': true, 'is-active': isActive }" />
            </template>
            <template #icon>
                <span></span>
            </template>
            <m-tips :content="i18n.global.t('meos_control_web.open_new_tab_risk_hazard_tree')" theme="darkTransparent">
                <div class="risk-card" @click="riskInfo(subItem.dangerItem, subItem)">
                    <div class="risk-row risk-management">
                        <div class="risk-row-label">{{ i18n.global.t('meos_control_web.update_time_colon') }}</div>
                        <div>{{ subItem.dangerItem?.updateTime || '--' }}</div>
                    </div>
                </div>
            </m-tips>
        </m-collapse-item>
    </m-collapse>
</template>

<script setup>
import i18n from '@/localization';
import { IconMeriComponentChevronDown } from 'meri-icon';
import Interest from '@/assets/svg/interest.svg';
import { RISK_EVENT_STATUS_MAP } from '../variable';
import { riskJumpFun } from '@/utils/envUtils';

const props = defineProps({
    active: {
        type: Boolean,
        default: false
    },
    data: {
        type: Array,
        default: () => []
    }
});
const subCollapseIds = defineModel({ type: Array, default: () => [] });

const riskInfo = (value, item) => {
    riskJumpFun(Object.assign(value, { localName: item.localName || item.name }));
};
</script>

<style lang="less" scoped>
.second-collapse-container {
    display: flex;
    flex-direction: column;
    row-gap: 8px;
    :deep(.m-collapse-item) {
        border-radius: 8px;
        background: var(--Grey-Grey-50, #f7f9fa);
        border: 1px solid transparent;
        &:hover {
            border-color: #246fe5;

            & > .m-collapse-item__header {
                position: relative;
                background-color: transparent;
            }
        }
    }
    :deep(.m-collapse-item__header-icon) {
        margin: 0px;
        margin-left: auto;
    }
}
.risk-list-name-wrap {
    margin-right: auto;
    display: flex;
    align-items: center;
    min-width: 0;
}
.risk-list-name {
    color: var(--Grey-Grey-800, #2e3742);
    font-size: 16px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
}

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
.risk-row {
    display: flex;
    color: var(--Grey-Grey-900, #1b2129);
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 22px;

    .risk-row-label {
        width: 84px;
        flex-shrink: 0;
        color: var(--Grey-Grey-600, #626c78);
    }

    .risk-detail-name {
        margin-right: 4px;
    }
}

.risk-management {
    .risk-row-label {
        width: 70px;
        flex-shrink: 0;
        color: var(--Grey-Grey-600, #626c78);
    }
}
.extend {
    display: flex;
    align-items: center;
    margin-left: 4px;
}
.interest {
    margin-right: 8px;
}
.collapse-custom-icon {
    min-width: 16px;
    &:hover {
        background-color: rgba(196, 201, 207, 0.3);
    }
    &.is-active {
        transform: rotate(180deg);
    }
}
</style>
