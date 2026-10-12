<template>
    <div v-for="(item, idx) in list.list" :key="idx" class="div-view">
        <div class="air-conditioning-zoning">
            <div class="air-conditioning-zoning-title fcb">
                <div class="f14" style="position: relative; padding-right: 20px; max-width: calc(100% - 65px)">
                    <div v-ellipsis class="m-ellipsis" style="height: 20px; line-height: 20px">{{ item.localName }}</div>
                    <SpaceIcon v-if="item.classCode === 'ACZone'" :data="item" :open-space-list="openAirConditionSpaceList" />
                </div>

                <div v-if="result(list.date)" class="ml8 button-display">
                    <SetButton type="icon" icon="IconMeriActionEditor" size="medium" :title="i18n.global.t('common.edit')" @click="editItem(item, list.date)" />
                    <SetButton type="icon" icon="IconMeriActionDelete" size="medium" :title="i18n.global.t('common.delete')" @click="deleteItem(item, list.date)" />
                </div>
            </div>
            <dataItemView :class-code="item?.classCode" :list="item?.executeDetail?.strategyPlans" :type="'AIR_TERMINAL_ZONE'" />
        </div>
    </div>
</template>
<script setup>
import dataItemView from './dataItemView.vue';
import { MMessageBox, $Message } from 'meri-plus';
import { removeStrategy } from '@/apis/timetable';
import { SUCCESSCODE } from '@/utils/globalVariables';

import { checkAllPastTime, systemTypeKey } from '../../../hooks/useTimetableHook';
import dayjs from 'dayjs';
import { getDayjsTz } from '@/utils/globalVariables';
import { dayjsIsAfter, dayjsIsSame } from '@/utils/dayjsTools';
import baseStore from '@/store/baseStore';
import i18n from '@/localization';
import SpaceIcon from '@/components/TimeTableEditorModal/SpaceIcon.vue';

import SetButton from '@/components/common/SetButton.vue';
import { openAirConditionSpaceListKey } from '../../../injectKeys';
const openAirConditionSpaceList = inject(openAirConditionSpaceListKey);

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
const systemType = inject(systemTypeKey);
const emit = defineEmits(['editBtn', 'delBtn']);
const init = inject('init');
const result = date => {
    const targetDate = getDayjsTz();
    const targetDayjs = dayjs(date);
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
            systemType: systemType?.value,
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
</style>
