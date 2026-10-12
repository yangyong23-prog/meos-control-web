<template>
    <div class="space-card" :class="{ 'is-active': currentSelectObj.id === data.id }" @click="currentSelectObj = data">
        <div class="space-card__name mb12 fc">
            <div v-ellipsis class="space-card__name__text m-ellipsis">{{ data.name }}</div>
            <div v-if="abnormalList?.length > 0" class="abnormal-number fs14 fw500 fc">
                {{ i18n.global.t('meos_control_web.abnormal_event_colon')
                }}<span class="fw700">{{ i18n.global.t('meos_control_web.certain_number', { count: abnormalList?.length }) }}</span>
            </div>
        </div>
        <div class="space-card__values">
            <ValueName v-for="item in infoCodes" :id="data.id" :key="item.infoCode" :name-style="{ color: 'var(--gray-500)' }" v-bind="item">
                <template #value-suffix>
                    <span v-if="item.suffix" class="value-suffix ffCP">{{ item.suffix }}</span>
                </template>
            </ValueName>
        </div>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import ValueName from '@/components/common/ValueName.vue';
import DockSingleton from '@/hooks/responsiveDock';
import { AIR_EXHAUST, AIR_SUPPLY, IF_OCCUPIED, RUN_STATUS, VENTILATION_FAN } from '../variables';
import { orderBy } from 'lodash';
import { spaceMapKey, currentSelectObjKey } from '../hooks/useBaseDataHook';
const { getIotData, getAbnormalEventsList } = DockSingleton.getInstance();
const spaceMap = inject(spaceMapKey);
const currentSelectObj = inject(currentSelectObjKey);
const props = defineProps({
    data: {
        type: Object,
        default: () => ({})
    },
    activeId: {
        type: String,
        default: ''
    }
});
const { open, close, noData, infoCode: runStatusInfoCode } = RUN_STATUS;

const valueStyle = {
    fontSize: '16px',
    fontWeight: '600'
};
const abnormalList = computed(() => getAbnormalEventsList([props.data.id]));
const getArr = () => {
    return props.data.equipments || [];
};
// 卫生间隔间CFIDBP
const equipmentsByCFIDBP = computed(() => {
    return getArr().filter(equipment => equipment.classCode === 'CFIDBP');
});
// 空闲卫生间隔间数 卫生间隔间的信息点【厕位占用状态】ifOccupied=0“无人”的数量
const freeCount = computed(() => {
    return equipmentsByCFIDBP.value.filter(equipment => IF_OCCUPIED.unoccupied.values.includes(getIotData(equipment.id, 'ifOccupied')?.dataValue)).length;
});
// 服务空间的末端机组总数（空调机组ACATAH+风机盘管ACATFC）
const serviceSeEquipment = computed(() => {
    return getArr().filter(equipment => ['ACATAH', 'ACATFC'].includes(equipment.classCode));
});
// 服务当前空间的空调机组ACATAH和风机盘管ACATFC中运行状态runStatus=1“运行”的数量
const seOpenNum = computed(() => {
    return serviceSeEquipment.value.filter(equipment => open.values.includes(getIotData(equipment.id, runStatusInfoCode)?.dataValue)).length;
});
// 服务空间的照明回路总数LTLTCC
const serviceLightingLoop = computed(() => {
    return getArr().filter(equipment => equipment.classCode === 'LTLTCC');
});
// 服务当前空间的照明回路LTLTCC中运行状态runStatus=1“运行”的照明回路数
const loopOpenNum = computed(() => {
    return serviceLightingLoop.value.filter(equipment => open.values.includes(getIotData(equipment.id, runStatusInfoCode)?.dataValue)).length;
});
// 送风机
const airSupplyFans = computed(() => {
    // 通风风机（ACVTSF）功能类型（funcType）取值为1“送风机”、送风兼消防补风机 FFSCMF
    return getArr().filter(equipment => {
        return (equipment.funcType === '1' && equipment.classCode === VENTILATION_FAN) || equipment.classCode === AIR_SUPPLY;
    });
});
// 送排风机
const airExhaustFans = computed(() => {
    // 通风风机（ACVTSF）功能类型（funcType）取值为2“排风机”、排风兼机械排烟风机FFSCAF
    return getArr().filter(equipment => {
        return (equipment.funcType === '2' && equipment.classCode === VENTILATION_FAN) || equipment.classCode === AIR_EXHAUST;
    });
});
// 提取公共函数，避免重复逻辑
const getFansWithRunStatus = fans => {
    return fans.map(item => ({
        ...item,
        runStatus: getIotData(item.id, runStatusInfoCode)
    }));
};

// 通用状态判断函数
const getFanStatus = targetFans => {
    if (!targetFans || targetFans.length === 0) return '';
    const targetFansWithStatus = getFansWithRunStatus(targetFans);
    // 状态=开启：目标设备至少一台运行
    const hasRunning = targetFansWithStatus.some(item => open.values.includes(item.runStatus?.dataValue));
    if (hasRunning) {
        return open.name;
    }
    // 状态=关闭：所有目标设备都停止
    const allStopped = targetFansWithStatus.every(item => close.values.includes(item.runStatus?.dataValue));
    if (allStopped) {
        return close.name;
    }
    // 状态=无数据：没有运行的 && 有无数据的
    return '';
};

const airSupplyStatus = computed(() => {
    return getFanStatus(airSupplyFans.value);
});

const airExhaustStatus = computed(() => {
    return getFanStatus(airExhaustFans.value);
});

// 空闲/总坑位 >温度 >NH3 >H2S >送风状态 >排风状态>末端开启/总数 >照明开启/总数 >湿度 >PM2.5
const infoCodes = computed(() => {
    const arr = [];
    if (equipmentsByCFIDBP.value.length) {
        arr.push({
            name: i18n.global.t('meos_control_web.idle_total_parking_spaces'),
            value: freeCount.value,
            infoCode: 'freeCount',
            sequence: 1,
            suffix: `/${equipmentsByCFIDBP.value.length}`,
            unit: '',
            valueStyle
        });
    }
    if (serviceSeEquipment.value.length) {
        arr.push({
            name: i18n.global.t('meos_control_web.terminal_on_total'),
            value: seOpenNum.value,
            infoCode: 'seOpenNum',
            sequence: 7,
            suffix: `/${serviceSeEquipment.value.length}`,
            unit: '',
            valueStyle
        });
    }
    if (serviceLightingLoop.value.length) {
        arr.push({
            name: i18n.global.t('meos_control_web.lighting_on_total'),
            value: loopOpenNum.value,
            infoCode: 'loopOpenNum',
            sequence: 8,
            suffix: `/${serviceLightingLoop.value.length}`,
            unit: '',
            valueStyle
        });
    }
    if (props.data.infoCodeConfigs?.length) {
        arr.push(
            ...props.data.infoCodeConfigs.map(item => {
                return {
                    ...item,
                    name: item.aliasName || item.infoCodeName,
                    valueStyle
                };
            })
        );
    }

    airSupplyStatus.value &&
        arr.push({
            name: i18n.global.t('meos_control_web.supply_air_status'),
            infoCode: 'airSupplyStatus',
            value: airSupplyStatus.value,
            sequence: 5,
            unit: '',
            valueStyle: {}
        });
    airExhaustStatus.value &&
        arr.push({
            name: i18n.global.t('meos_control_web.exhaust_status'),
            infoCode: 'airExhaustStatus',
            value: airExhaustStatus.value,
            sequence: 6,
            unit: '',
            valueStyle: {}
        });
    return orderBy(arr, 'sequence').slice(0, 4);
});
</script>
<style lang="less" scoped>
.space-card {
    border-radius: 8px;
    padding: 12px;
    background-color: var(--gray-0);
    border: 1px solid var(--gray-0);
    cursor: pointer;
    --ft-color: var(--gray-900);
    &:hover {
        border: 1px solid var(--blue-500);
    }
    &.is-active {
        border: 1px solid var(--blue-500);
        background-color: var(--blue-500);
        color: var(--gray-0);
        .value-suffix {
            color: var(--gray-0);
        }
        :deep(.value-name-title) {
            color: var(--gray-0) !important;
        }
        .abnormal-number {
            color: var(--gray-0);
            background: linear-gradient(270deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.2) 100%);
        }
    }
    .value-suffix {
        font-size: 16px;
        font-weight: 600;
        color: var(--gray-500);
    }
    .abnormal-number {
        height: 26px;
        margin-left: 8px;
        padding: 3px 8px;
        background: linear-gradient(270deg, rgba(245, 80, 71, 0.05) 0%, rgba(245, 80, 71, 0.2) 100%);
        color: var(--red-500);
        border-radius: 2px;
        width: 110px;
    }
    .space-card__name__text {
        height: 26px;
        line-height: 26px;
        max-width: calc(100% - 120px);
    }
    .space-card__values {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 8px;
    }
}
</style>
