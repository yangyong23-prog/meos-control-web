<template>
    <div v-for="(item, idx) in list.list" :key="idx" class="div-view">
        <div v-if="item && item.consoleType === 'WSDH_SYSTEM'" class="wsdh-system">
            <div class="wsdh-system-title fcb">
                <span class="f14">{{ i18n.global.t('meos_control_web.domestic_hot_water') }}</span>
                <div v-if="result(list.date)" class="ml8 button-display">
                    <SetButton type="icon" icon="IconMeriActionEditor" size="medium" @click="editItem(item, list.date)" />
                    <SetButton type="icon" icon="IconMeriActionDelete" size="medium" @click="deleteItem(item, list.date)" />
                </div>
            </div>
            <dataItemView :class-code="item?.classCode" :list="item?.executeDetail?.strategyPlans" :type="item.consoleType" />
        </div>
    </div>
</template>
<script setup>
import dataItemView from './dataItemView.vue';
import { MMessageBox, $Message } from 'meri-plus';
import { removeStrategy } from '@/apis/timetable';
import { SUCCESSCODE } from '@/utils/globalVariables';

import { checkAllPastTime, curConsoleTypeKey, systemTypeKey } from '../../../hooks/useTimetableHook';
import dayjs from 'dayjs';
import { getDayjsTz } from '@/utils/globalVariables';
import { dayjsIsAfter, dayjsIsSame } from '@/utils/dayjsTools';
import baseStore from '@/store/baseStore';
import i18n from '@/localization';

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
const curConsoleType = inject(curConsoleTypeKey);
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

.heat-supply {
    padding: 8px;
    &-title {
        color: var(--red-500, #f55047);
        height: 22px;
        line-height: 14px;
        padding: 0px 4px;
        border-radius: 2px;
        flex: 1;
        background: linear-gradient(90deg, rgba(245, 80, 71, 0.12) 0%, rgba(245, 80, 71, 0) 100%);
        // height: 32px;
    }
}

.wsdh-system {
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
</style>
