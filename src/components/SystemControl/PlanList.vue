<template>
    <div class="control-plan">
        <div class="control-plan-title fcb">
            <span v-ellipsis class="title">{{ data.infoCodeName }}</span>
            <SetButton type="link" style="flex-shrink: 0" size="small" @click="changeAuto(data)">{{
                manualAutoSetData === IS_AUTO ? i18n.global.t('meos_control_web.switch_to_manual_mode_dup') : i18n.global.t('meos_control_web.switch_to_auto_mode')
            }}</SetButton>
        </div>
        <m-scrollbar :max-height="320" class="control-plan-steps">
            <template v-if="list.length">
                <div v-for="item in list" :key="item.id" class="step-item fc" :class="{ executed: item.executed }">
                    <div class="step-item-icon fcc">
                        <SvgIcon v-if="item.zIndex === 1" :name="item.executed ? 'rili-blue' : 'rili-gray'" width="18px" height="18px" />
                        <SvgIcon v-else :name="item.executed ? 'dian-blue' : 'dian-gray'" width="8px" height="8px" />
                    </div>
                    <div class="step-item-value fc">
                        <template v-if="item.zIndex === 1">
                            <span style="font-weight: 700">{{ item.value }}</span>
                        </template>
                        <template v-else>
                            <ArtificialOrAuto :is-auto="item.manualAutoSet === IS_AUTO" />
                            &nbsp;{{ item.value }} &nbsp;{{ RUN_STATUS[item.actualValue]?.name }}
                        </template>
                    </div>
                </div>
            </template>
            <template v-else>
                <Empty :text="i18n.global.t('common.no_data')" width="90px" height="76px" />
            </template>
        </m-scrollbar>
    </div>
</template>

<script setup>
import dayjs from 'dayjs';
import { isNil, toString, uniqueId } from 'lodash';
import { MMessageBox } from 'meri-plus';
import Empty from '@/components/common/Empty.vue';
import SvgIcon from './SvgIcon.vue';
import { RUN_STATUS } from './config';
import ArtificialOrAuto from './ArtificialOrAuto.vue';
import { changeManualAutoStatus } from '@/apis/ACAC';
import { useSuccessMessage } from '@/utils/tools';
import { SUCCESSCODE, IS_AUTO, IS_MANUAL } from '@/utils/globalVariables';
import DockSingleton from '@/hooks/responsiveDock';
import SetButton from '@/components/common/SetButton.vue';
import i18n from '@/localization';
import { INFO_EXTEND } from '@/utils/SSEEventTypes';

const props = defineProps({
    data: {
        type: Object,
        default: () => ({})
    },
    systemId: {
        type: String,
        default: ''
    },
    consoleTypes: {
        type: String,
        default: ''
    },
    systemType: {
        type: String,
        default: ''
    }
});
const { getInfoExtend } = DockSingleton.getInstance();
const list = computed({
    get() {
        let days = [];
        const arr =
            props.data.switchSetRecordList?.map(item => {
                const day = dayjs(item.operateTime).format('YYYY.MM.DD 00:00:00');
                days.push(day);
                return {
                    day,
                    value: dayjs(item.operateTime).format('HH:mm'),
                    executed: dayjs(item.operateTime).isBefore(dayjs()),
                    actualValue: item.actualValue,
                    manualAutoSet: item.manualAutoSet
                };
            }) || [];
        days = Array.from(new Set(days));
        const daysObj = {};
        days.forEach(item => {
            if (dayjs(item).isSame(dayjs(), 'day')) {
                daysObj[item] = arr.filter(i => i.day === item);
            }
            if (dayjs(item).isBefore(dayjs(), 'day')) {
                daysObj[item] = [arr.filter(i => i.day === item)?.pop()];
            }
            if (dayjs(item).isAfter(dayjs(), 'day')) {
                daysObj[item] = [arr.filter(i => i.day === item)?.[0]];
            }
        });
        const listArr = [];
        days.forEach(item => {
            listArr.push({
                id: uniqueId('sysSwitchSet-'),
                value: dayjs(item).format('MM.DD'),
                zIndex: 1,
                executed: dayjs(item).isBefore(dayjs(), 'minute')
            });
            daysObj[item].forEach(val => {
                listArr.push({
                    id: uniqueId('sysSwitchSet-'),
                    zIndex: 2,
                    ...val
                });
            });
        });
        return listArr;
    },
    set(data) {
        return data;
    }
});
const changeAuto = () => {
    const isAuto = manualAutoSetData.value === IS_AUTO;
    const infoCodeValue = manualAutoSetData.value === IS_AUTO ? IS_MANUAL : IS_AUTO;
    MMessageBox({
        title: isAuto ? i18n.global.t('meos_control_web.acknowledge_switch_to_manual') : i18n.global.t('meos_control_web.acknowledge_switch_to_auto'),
        customClass: 'customClass',
        hasLoading: true,
        message: `${
            isAuto
                ? i18n.global.t('meos_control_web.switch_to_manual_control', { infoCodeName: props.data.infoCodeName })
                : i18n.global.t('meos_control_web.switch_to_auto_contl', { infoCodeName: props.data.infoCodeName })
        }`,
        beforeClose: async (action, data, done) => {
            if (action === 'confirm') {
                try {
                    const res = await changeManualAutoStatus({
                        objectId: props.data.id ?? props.systemId,
                        infoCode: props.data.infoCode,
                        infoCodeValue,
                        consoleTypes: props.consoleTypes,
                        systemType: props.systemType,
                        systemId: props.systemId
                    });
                    if (res.code === SUCCESSCODE) {
                        useSuccessMessage();
                    }
                } finally {
                    done();
                }
            } else {
                done();
            }
        }
    });
};

const manualAutoSetData = computed(() => {
    const obj = getInfoExtend(props.data.id, props.data.infoCode, INFO_EXTEND);
    let manual = obj.manualAutoSet;
    if (props.data.consoleType) {
        manual = obj[props.data.consoleType].manualAutoSet;
    }
    if (!isNil(manual)) {
        return toString(manual);
    }

    return manual;
});
</script>
<style lang="less" scoped>
.control-plan {
    width: 240px;
    &-title {
        margin-bottom: 8px;
        .title {
            font-weight: 700;
            flex: 1;
            min-width: 0;
            display: inline-block;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            overflow-wrap: break-word;
        }
    }
    &-day {
        font-weight: 700;
    }
    &-hour {
        color: var(--gray-600);
    }
    &-steps {
        .step-item {
            height: 22px;
            position: relative;
            &::after {
                content: '';
                display: block;
                height: calc(100%);
                position: absolute;
                top: 0;
                left: 9px;
                transform: translateX(-50%);
                width: 1px;
                background-color: var(--gray-300);
                z-index: -1;
            }
            & + .step-item {
                padding-top: 8px;
                height: 30px;
            }
            &.executed {
                &::after {
                    background-color: #e0edfd;
                }
            }
            &:first-child {
                &::after {
                    height: 50%;
                    top: 50%;
                }
            }
            &:last-child {
                &::after {
                    height: 50%;
                }
            }
            &-icon {
                width: 18px;
                height: 18px;
                margin-right: 8px;
            }
        }
    }
}
</style>
