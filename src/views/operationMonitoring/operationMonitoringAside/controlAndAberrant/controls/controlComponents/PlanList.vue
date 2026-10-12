<template>
    <div class="control-plan">
        <div class="control-plan-title fcb">
            <span v-ellipsis class="title">{{ controlItem.name }}</span>
            <m-button style="flex-shrink: 0" type="link" size="small" @click="changeAuto(controlItem)">{{
                controlItem.isAi ? i18n.global.t('meos_control_web.switch_to_manual_mode_dup') : i18n.global.t('meos_control_web.switch_to_auto_mode')
            }}</m-button>
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
                            <m-tag v-if="item.runType === 2" size="small" color="#E68600" bg-color="#FFF0CC">{{ i18n.global.t('meos_control_web.manual1') }}</m-tag>
                            <m-tag v-if="item.runType === 1" size="small" color="#A928B7" bg-color="#F7E3F5">{{ i18n.global.t('meos_control_web.auto') }}</m-tag>
                            &nbsp;{{ item.value }} &nbsp;{{ item.runStatus === 'OPEN' ? i18n.global.t('common.status_open') : i18n.global.t('common.status_close') }}
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
import { setManualAutoMatic } from '@/apis/systemDiagram';
import { getDayjsTz, SUCCESSCODE } from '@/utils/globalVariables';
import { useSuccessMessage } from '@/utils/tools';
// import { IOTObject } from '@/views/systemDiagram/types';
import dayjs from 'dayjs';
import { uniqueId } from 'lodash';
import { MMessageBox } from 'meri-plus';
// import { PropType } from 'vue';
import Empty from '@/components/common/Empty.vue';
import SvgIcon from './SvgIcon.vue';
import emitter from '@/utils/bus';
import i18n from '@/localization';
import { dayjsIsAfter, dayjsIsBefore, dayjsIsSame } from '@/utils/dayjsTools';

const props = defineProps({
    openCloseTimes: {
        type: Array,
        default: () => []
    },
    controlItem: {
        type: Object,
        default: () => ({})
    }
});
const list = computed({
    get() {
        let days = [];
        const arr = props.openCloseTimes.map(item => {
            const day = dayjs(item.dateTime).format('YYYY.MM.DD 00:00:00');
            days.push(day);
            return {
                day,
                value: dayjs(item.dateTime).format('HH:mm'),
                executed: dayjsIsBefore(dayjs(item.dateTime), getDayjsTz()),
                runType: item.runType,
                runStatus: item.runStatus
            };
        });
        days = Array.from(new Set(days));
        const daysObj = {};
        days.forEach(item => {
            if (dayjsIsSame(dayjs(item), getDayjsTz(), 'day')) {
                daysObj[item] = arr.filter(i => i.day === item);
            }
            if (dayjsIsBefore(dayjs(item), getDayjsTz(), 'day')) {
                daysObj[item] = [arr.filter(i => i.day === item)?.pop()];
            }
            if (dayjsIsAfter(dayjs(item), getDayjsTz(), 'day')) {
                daysObj[item] = [arr.filter(i => i.day === item)?.[0]];
            }
        });
        const listArr = [];
        days.forEach(item => {
            listArr.push({
                id: uniqueId('sysSwitchSet-'),
                value: dayjs(item).format('MM.DD'),
                zIndex: 1,
                executed: dayjsIsBefore(dayjs(item), getDayjsTz(), 'minute')
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
const getListCoolStrategy = inject('getListCoolStrategy');
const getListFixedTimeStrategy = inject('getListFixedTimeStrategy');
const systemId = inject('systemId', ref(''));
const changeAuto = item => {
    MMessageBox({
        title: i18n.global.t('meos_control_web.acknowledge_switch_to', {
            name: props.controlItem.messageBoxTitle || '',
            stage: item.isAi ? i18n.global.t('meos_control_web.manual') : i18n.global.t('meos_control_web.auto')
        }),
        customClass: 'customClass',
        hasLoading: true,
        message: `${item.isAi ? i18n.global.t('meos_control_web.switch_to_full_manual') : i18n.global.t('meos_control_web.switch_to_auto_control')}`,
        beforeClose: (action, data, done) => {
            if (action === 'confirm') {
                setManualAutoMatic({
                    systemId: systemId.value,
                    objectId: props.controlItem.objectId,
                    pattern: item.isAi ? false : true,
                    infoCode: props.controlItem.infoCode
                }).then(res => {
                    if (res.code === SUCCESSCODE) {
                        emitter.emit('refreshNotify', 'query');
                        useSuccessMessage();
                        getListCoolStrategy();
                        getListFixedTimeStrategy();
                    }
                });
                done();
            } else {
                done();
            }
        }
    });
};
</script>
<style lang="less" scoped>
.control-plan {
    &-title {
        margin-bottom: 8px;
        .title {
            font-weight: 700;
            flex: 1;
            min-width: 0;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            display: inline-block;
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
