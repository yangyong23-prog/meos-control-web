<template>
    <div v-for="(item, idx) in list.list" :key="idx" class="div-view">
        <!-- 空调分区 -->
        <template v-if="currentSystem.consoleTypes === CONSOLE_TYPES.AIR_TERMINAL_ZONE.id">
            <div v-if="item && item.consoleType === CONSOLE_TYPES.AIR_TERMINAL_ZONE.id" class="air-conditioning-zoning">
                <div class="air-conditioning-zoning-title fcb">
                    <div class="f14" style="position: relative; padding-right: 20px; max-width: calc(100% - 65px)">
                        <div v-ellipsis class="m-ellipsis" style="height: 20px; line-height: 20px">{{ item.localName }}</div>
                        <SpaceIcon v-if="item.classCode === 'ACZone'" :data="item" />
                    </div>

                    <div v-if="result(list.date)" class="ml8 button-display">
                        <SetButton :content="i18n.global.t('common.edit')" type="icon" icon="IconMeriActionEditor" size="medium" @click="editItem(item, list.date)" />
                        <SetButton :content="i18n.global.t('common.delete')" type="icon" icon="IconMeriActionDelete" size="medium" @click="deleteItem(item, list.date)" />
                    </div>
                </div>
                <dataItemView :class-code="item?.classCode" :list="item?.executeDetail?.strategyPlans" :type="CONSOLE_TYPES.AIR_TERMINAL_ZONE.id" />
            </div>
        </template>
        <!-- 供冷 蓄冷 -->
        <template v-else>
            <div v-if="item && item.consoleType === CONSOLE_TYPES.HEAT_SUPPLY.id" class="cooling">
                <div class="cooling-title fcb">
                    <span class="f14">{{ i18n.global.t('meos_control_web.heat_supply') }}</span>
                    <div v-if="result(list.date)" class="ml8 button-display">
                        <SetButton :content="i18n.global.t('common.edit')" type="icon" icon="IconMeriActionEditor" size="medium" @click="editItem(item, list.date)" />
                        <SetButton :content="i18n.global.t('common.delete')" type="icon" icon="IconMeriActionDelete" size="medium" @click="deleteItem(item, list.date)" />
                    </div>
                </div>
                <dataItemView :class-code="item?.classCode" :list="item?.executeDetail?.strategyPlans" />
            </div>
        </template>
    </div>
</template>
<script setup>
import dataItemView from './dataItemView.vue';
import { MMessageBox, $Message } from 'meri-plus';
import { removeStrategy } from '@/apis/ACAC';
import { SUCCESSCODE } from '@/utils/globalVariables';
import { SYSTEM_CLASS_CODE, CONSOLE_TYPES, PERMISSION } from '../../constant/variable';
import { checkAllPastTime } from '../../hooks/useTimetableHook';
import dayjs from 'dayjs';
import baseStore from '@/store/baseStore';
import i18n from '@/localization';
import SpaceIcon from '../../components/SpaceIcon.vue';
import { dayjsIsAfter, dayjsIsSame, dayTz } from '@/utils/dayjsTools';
import SetButton from '@/components/common/SetButton.vue';

const base = baseStore();
const props = defineProps({
    list: {
        type: Array,
        default: () => []
    },
    currentSystem: {
        type: Object,
        default: () => {}
    }
});
const emit = defineEmits(['editBtn', 'delBtn']);
const init = inject('init');
const result = date => {
    const targetDate = dayTz();
    const targetDayjs = dayjs(date);
    // return targetDayjs.isAfter(targetDate) || targetDayjs.isSame(targetDate, 'day');
    return dayjsIsAfter(targetDayjs, targetDate) || dayjsIsSame(targetDayjs, targetDate, 'day');
};
const editItem = (item, day) => {
    const obj = {
        ...item,
        currentDate: dayjs(day).format('YYYY-MM-DD'),
        consoleType: item.consoleType
    };
    emit('editBtn', obj);
};
const deleteItem = (item, day) => {
    if (checkAllPastTime(item, day)) {
        $Message.error({
            title: i18n.global.t('meos_control_web.strategy_time_past_cannot_delete')
        });
    } else {
        const params = {
            projectId: baseStore().projectId,
            systemType: SYSTEM_CLASS_CODE,
            objectId: item.objectId,
            systemId: props.currentSystem.systemId,
            consoleType: item.consoleType,
            beginDate: dayjs(day).format('YYYY-MM-DD'),
            endDate: dayjs(day).format('YYYY-MM-DD')
        };
        MMessageBox({
            type: 'danger',
            title: i18n.global.t('meos_control_web.acknowledge_delete'),
            customClass: 'customClass',
            confirmButtonText: i18n.global.t('common.delete'),
            message: `${i18n.global.t('meos_control_web.delete_strategy_stopped')}`,
            hasLoading: true,
            beforeClose: (action, data, done) => {
                if (action === 'confirm') {
                    removeStrategy(params)
                        .then(res => {
                            if (res.code === SUCCESSCODE) {
                                $Message.success(i18n.global.t('common.operation_success'));
                                init(true);
                                emit('delBtn');
                            }
                        })
                        .finally(() => {
                            done();
                        });
                    done();
                } else {
                    done();
                }
            }
        });
    }
};
</script>
<style scoped lang="less">
.button-display {
    min-width: 65px;
}
.div-view + .div-view {
    border-top: 1px solid #e1e5eb;
}
.div-view {
    .button-display {
        opacity: 0;
        transition: opacity 0.3s;
    }
}
.div-view:hover {
    background: var(--gray-50, #f7f9fa);
    .button-display {
        opacity: 1;
    }
}
*[class='div-view']:last-of-type {
    flex: 1;
}
.air-conditioning-zoning {
    padding: 8px;
    &-title {
        color: #1b2129;
        padding: 0px 4px;
        border-radius: 2px;
        flex: 1;
        background: linear-gradient(90deg, #f1f4f6 0%, rgba(241, 244, 246, 0) 100%);
        height: 32px;
        :deep(.guan-lian) {
            path {
                fill: var(--gray-600);
            }
        }
    }
}
.cooling {
    padding: 8px;

    &-title {
        color: #1b4acc;
        height: 22px;
        line-height: 14px;
        padding: 0px 4px;
        border-radius: 2px;
        flex: 1;
        background: linear-gradient(90deg, rgba(100, 166, 247, 0.12) 0%, rgba(100, 166, 247, 0) 100%);
        // height: 32px;
    }
}
.cold-storage {
    padding: 8px;
    &-title {
        color: #00a2a7;
        height: 22px;
        line-height: 14px;
        padding: 0px 4px;
        border-radius: 2px;
        flex: 1;
        background: linear-gradient(90deg, rgba(0, 162, 167, 0.12) 0%, rgba(0, 162, 167, 0) 100%);
        // height: 32px;
    }
}
</style>
