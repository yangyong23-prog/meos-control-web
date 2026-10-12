<template>
    <div
        class="space-passenger-flow-item-card"
        :class="{
            'space-item-card-success': !isAlarmstatus,
            'space-item-card-error': isAlarmstatus,
            'space-item-card-active': currentSpace?.id === passenger.id
        }"
        @click.stop="changePassengerFlow(passenger)"
    >
        <div v-ellipsis class="space-passenger-flow-item-card-name">{{ passenger.localName ?? '--' }}</div>
        <div class="space-passenger-flow-item-card-item">
            <div class="column-item">
                <div v-ellipsis class="keys">{{ accmInPeopleFlow }}</div>
                <div class="values">{{ i18n.global.t('meos_control_web.entry_count') }}</div>
            </div>
            <div class="column-item">
                <div v-ellipsis class="keys">{{ accmOutPeopleFlow }}</div>
                <div class="values">{{ i18n.global.t('meos_control_web.exit_people_count') }}</div>
            </div>
            <div class="column-item">
                <div v-ellipsis class="keys">{{ spExsitPeopleNum }}</div>
                <div v-ellipsis class="values">{{ i18n.global.t('meos_control_web.passenger_flow_count') }}</div>
            </div>
        </div>
    </div>
</template>
<script setup>
import i18n from '@/localization';
import useEquipInfoSSEHandle from '@/components/hooks/useEquipInfoSSEHandle';
import { GRID } from '@/utils/globalVariables';
const emits = defineEmits(['changePassengerFlow']);
const currentSpace = inject('currentSpace');
const props = defineProps({
    passenger: {
        type: Object,
        default: () => {}
    }
});

// eslint-disable-next-line vue/no-setup-props-destructure
const passenger = ref(props.passenger);
const spaceId = ref(passenger.value.id);
const relInfoCodeGroupConfigs = computed(() => {
    return props.passenger.relInfoCodeGroupConfigs;
});

function isNumeric(value) {
    return value !== null && value !== undefined && value !== '--' && value;
}

// 判断信息点
function getInfoDataValue(groupCode, infoCode) {
    const groupConfig = props.passenger.relInfoCodeGroupConfigs.find(it => it.groupCode === groupCode);
    if (!groupConfig) return undefined;

    const infoConfig = groupConfig.relInfoCodeConfigs.find(it => it.infoCode === infoCode);
    return infoConfig?.dataValue && infoCode !== 'alarmstatus' ? Math.round(infoConfig?.dataValue) : infoConfig?.dataValue;
}

// 数字格式化函数，添加千位分隔符
function formatNumberWithCommas(num) {
    return num?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') || '--';
}

// 是否异常
const isAlarmstatus = computed(() => {
    const alarmStatusValue = getInfoDataValue('spaceStatus', 'alarmstatus');
    return alarmStatusValue === 'alarmstatus';
});

// 客流人数
// const spExsitPeopleNum = computed(() => {
//     const peopleNum = getInfoDataValue('runningParameter', 'spExsitPeopleNum');
//     return formatNumberWithCommas(peopleNum);
// });

const spExsitPeopleNum = computed(() => {
    if (isNumeric(accmInPeopleFlow?.value) && isNumeric(accmOutPeopleFlow?.value)) {
        return formatNumberWithCommas(Number(accmInPeopleFlow?.value.replace(/,/g, '')) - Number(accmOutPeopleFlow?.value.replace(/,/g, '')));
    } else if (isNumeric(accmInPeopleFlow?.value)) {
        return formatNumberWithCommas(Number(accmInPeopleFlow?.value.replace(/,/g, '')));
    } else {
        return '--';
    }
});

// 入场人数
const accmInPeopleFlow = computed(() => {
    const inPeopleFlow = getInfoDataValue('runningParameter', 'accmInPeopleFlow');
    return formatNumberWithCommas(inPeopleFlow);
});

// 出场人数
const accmOutPeopleFlow = computed(() => {
    const outPeopleFlow = getInfoDataValue('runningParameter', 'accmOutPeopleFlow');
    return formatNumberWithCommas(outPeopleFlow);
});
useEquipInfoSSEHandle(spaceId, { relInfoCodeGroupConfigs: relInfoCodeGroupConfigs }, false, GRID);
const changePassengerFlow = passenger => {
    emits('changePassengerFlow', passenger);
};
</script>
<style lang="less" scoped>
.space-passenger-flow-item-card {
    cursor: pointer;
    padding: 12px;
    /* width: 252px;
    min-width: 252px;
    max-width: 252px; */
    height: 96px;
    border-radius: 4px;
    &-name {
        color: #626c78;
        font-size: 14px;
        height: 22px;
        line-height: 22px;
        margin-bottom: 4px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    &-item {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 12px;

        .keys {
            height: 24px;
            color: #2e3742;
            font-size: 16px;
            line-height: 24px;
            font-family: 'Persagy2.0';
            font-weight: 500;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        .values {
            color: #8b949e;
            height: 22px;
            font-size: 14px;
            line-height: 22px;

            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        .column-item {
            height: 46px;
            display: flex;
            flex-direction: column;
        }
    }
}
.space-item-card-success {
    background: white;
    border: 1px solid transparent;
    &:hover {
        border: 1px solid var(--blue-500, #246fe5);
    }
}
.space-item-card-error {
    background: rgba(245, 80, 71, 0.16);
    &:hover {
        background: rgba(245, 80, 71, 0.2);
    }
}
.space-item-card-active {
    background: #246fe5 !important;
    .space-passenger-flow-item-card-name {
        color: #fff;
    }
    .space-passenger-flow-item-card-item {
        .keys {
            color: #fff;
        }
        .values {
            color: #fff;
        }
    }
}
</style>
