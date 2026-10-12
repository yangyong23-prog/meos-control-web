<template>
    <div v-for="(item, index) in equipmentStatusStatisticsList" :key="index + 'e'" class="eq-container">
        <div v-if="equipmentStatusStatisticsList.length > 1" class="build-name">{{ item.localName ?? '--' }}</div>
        <div v-for="(child, i) in item.relFloors" :key="i + 'c'" :class="{ 'build-content-floor': currentFloorObj?.id, 'build-content': !currentFloorObj?.id }">
            <div v-if="!currentFloorObj?.id" class="left">{{ child.localId }}</div>
            <div v-if="!currentFloorObj?.id" class="right">
                <p class="right-top">{{ i18n.global.t('common.end_equipment') }}: {{ child.equipmentStatistics?.totalCount || '--' }}</p>
                <p class="right-bottom">
                    {{ i18n.global.t('meos_control_web.enable_device') }}:{{ child.equipmentStatistics?.totalOpenCount || '--' }} <span class="line"></span>
                    {{ i18n.global.t('meos_control_web.turn_off_equipment') }}{{ child.equipmentStatistics?.totalCloseCount || '--' }}<span class="line"></span
                    >{{ i18n.global.t('meos_control_web.unknown_device_colon') }}{{ child.equipmentStatistics?.totalUnknownCount || '--' }}
                </p>
            </div>
            <template v-else>
                <div v-for="(eq, eqIndex) in child.equipmentGroupStatistics" :key="eqIndex + 'e'" class="right">
                    <p class="right-top">{{ eq.classCodeName }}: {{ eq.totalCount || '--' }}</p>
                    <p class="right-bottom">
                        {{ i18n.global.t('meos_control_web.enable_device') }}:{{ eq.totalOpenCount || '--' }} <span class="line"></span>
                        {{ i18n.global.t('meos_control_web.turn_off_equipment') }}{{ eq.totalCloseCount || '--' }}<span class="line"></span
                        >{{ i18n.global.t('meos_control_web.unknown_device_colon') }}{{ eq.totalUnknownCount || '--' }}
                    </p>
                </div>
            </template>
        </div>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import { currentFloorObjKey } from '../../injectKeys';
import { equipmentStatusStatisticsListKey } from '../../hooks/useACGlobalData';
const currentFloorObj = inject(currentFloorObjKey);
const equipmentStatusStatisticsList = inject(equipmentStatusStatisticsListKey);
</script>
<style lang="less" scoped>
.eq-container {
    font-size: 14px;
    font-weight: var(--platform-font-weight);
    .build-name {
        color: var(--gray-600, #626c78);
        line-height: 24px;
        margin-bottom: 4px;
        margin-top: 12px;
    }
    .build-content {
        padding: 12px;
        display: flex;
        align-items: center;
        border-bottom: 1px solid var(--gray-100, #f1f4f6);
        margin-right: 16px;
        .left {
            margin-right: 12px;
            width: 36px;
            min-width: 36px;
            max-width: 36px;
            height: 36px;
            border-radius: 90px;
            line-height: 36px;
            text-align: center;
            background: var(--gray-100, #f1f4f6);
        }
        .right {
            color: var(--gray-600, #626c78);
            &-top {
                color: #1b2129;
                line-height: 22px;
                margin-bottom: 4px;
            }
            &-bottom {
                line-height: 24px;
                .line {
                    display: inline-block;
                    width: 1px;
                    height: 12px;
                    background: #d9d9d9;
                    margin: 0 8px;
                }
            }
        }
    }
    .build-content-floor {
        .right {
            padding: 12px;
            border-bottom: 1px solid var(--gray-100, #f1f4f6);
            margin-right: 16px;
            color: var(--gray-600, #626c78);
            &-top {
                color: #1b2129;
                line-height: 22px;
                margin-bottom: 4px;
            }
            &-bottom {
                line-height: 24px;
                .line {
                    display: inline-block;
                    width: 1px;
                    height: 12px;
                    background: #d9d9d9;
                    margin: 0 8px;
                }
            }
        }
    }
}
</style>
