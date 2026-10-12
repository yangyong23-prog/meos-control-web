<template>
    <div class="basic-info">
        <div class="box-item-title">{{ i18n.global.t('meos_control_web.basic_info') }}</div>
        <div class="basic-info-main">
            <div class="basic-info-item">
                <div class="item-name fc">{{ i18n.global.t('meos_control_web.business_hours') }}</div>
                <div class="item-value fc">
                    <template v-if="handUseData(objectSetting, objectParentSetting, 'businessTimeRangeList', []).length">
                        <div v-for="item in handUseData(objectSetting, objectParentSetting, 'businessTimeRangeList', [])" :key="item">
                            {{ handleTime(item) }}
                        </div>
                    </template>
                    <template v-else>{{ i18n.global.t('meos_control_web.closed') }}</template>
                </div>
            </div>
            <div class="basic-info-item">
                <div class="item-name fc">{{ i18n.global.t('meos_control_web.hvac_demand_time') }}</div>
                <div class="item-value fc">
                    <template v-if="handUseData(objectSetting, objectParentSetting, 'airConditioningDemandTimeRangeList', []).length">
                        <div v-for="item in handUseData(objectSetting, objectParentSetting, 'airConditioningDemandTimeRangeList', [])" :key="item">
                            {{ handleTime(item) }}
                        </div>
                    </template>
                    <template v-else>{{ i18n.global.t('meos_control_web.not_set') }}</template>
                </div>
            </div>
            <div class="basic-info-item">
                <div class="item-name fc">
                    {{ i18n.global.t('meos_control_web.participate_in_dispatch') }}&nbsp;
                    <m-tips :content="i18n.global.t('meos_control_web.space_quality_allow_sacrifice_when_price_or_carbon_high')" theme="darkTransparent">
                        <svg class="icon" aria-hidden="true" style="min-height: 14px; min-width: 14px">
                            <use xlink:href="#icon-info" />
                        </svg>
                    </m-tips>
                </div>
                <div class="item-value fc">
                    {{ handUseData(objectSetting, objectParentSetting, 'isParticipateInScheduling', false) ? i18n.global.t('meos_control_web.yes') : i18n.global.t('common.no') }}
                </div>
            </div>
            <div v-if="!currentFloorObj?.id" class="basic-info-item">
                <div class="item-name fc">
                    {{ i18n.global.t('meos_control_web.allow_early_shutdown') }}
                    &nbsp;
                    <m-tips :content="i18n.global.t('meos_control_web.allow_early_equipment_shutdown_before_business_end_algorithm_decides')" theme="darkTransparent" width="400px">
                        <svg class="icon" aria-hidden="true" style="min-height: 14px; min-width: 14px">
                            <use xlink:href="#icon-info" />
                        </svg>
                    </m-tips>
                </div>
                <div class="item-value fc">
                    {{ handUseData(objectSetting, objectParentSetting, 'isAllowEarlyShutdown', false) ? i18n.global.t('meos_control_web.yes') : i18n.global.t('common.no') }}
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import { handleTime, handUseData } from '../utils';
import { currentFloorObjKey } from '../../../injectKeys';
const currentFloorObj = inject(currentFloorObjKey);
defineProps({
    objectSetting: {
        type: Object,
        default: () => ({})
    },
    objectParentSetting: {
        type: Object,
        default: () => ({})
    }
});
</script>
<style lang="less" scoped>
.basic-info {
    &-main {
        margin-left: 12px;
    }
    .basic-info-item {
        display: flex;
        margin-top: 16px;
    }
    .item-name {
        height: 24px;
        width: 103px;
        margin-right: 12px;
        color: var(--gray-600);
        :deep(.m-popper-trigger) {
            height: 14px;
        }
    }
    .item-value {
        width: calc(100% - 132px);
        display: flex;
        grid-gap: 8px;
        flex-wrap: wrap;
        &.week {
            display: flex;
            & > div {
                background: none;
                height: 30px;
                width: 30px;
                line-height: 30px;
            }
            .is-active {
                background-color: var(--blue-100);
                color: var(--blue-500);
            }
        }
        & > div {
            text-align: center;
            border-radius: 4px;
            padding: 0 4px;
            background: var(--gray-200);
            height: 24px;
            line-height: 24px;
        }
    }
}
</style>
