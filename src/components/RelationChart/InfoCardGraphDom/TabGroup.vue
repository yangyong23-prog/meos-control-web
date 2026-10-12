<template>
    <div class="group-tab-wrap" :style="{ fontSize: `${data.fontSize || 24}px` }">
        <span v-for="item in iotList" :key="item.infoCode" class="group-tab-item" :style="getItmeStyle(item)">{{ getItemValText(data, item) }}</span>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import DockSingleton from '@/hooks/responsiveDock';

const { getIotData } = DockSingleton.getInstance();
const props = defineProps({
    data: {
        type: Object,
        default: () => ({})
    }
});
const getItemValText = inject('getItemValText');

const iotList = computed(() => {
    const d = props.data;
    const group = d?.groups ? [...d.groups] : [];
    const highLevAlarmIndex = group.findIndex(item => item.infoCode === 'highLevAlarm');
    const lowLevAlarmIndex = group.findIndex(item => item.infoCode === 'lowLevAlarm');
    const highLevAlarmValue = getIotData(d?.key, 'highLevAlarm');
    const lowLevAlarmValue = getIotData(d?.key, 'lowLevAlarm');
    if (highLevAlarmIndex > -1 && lowLevAlarmIndex > -1) {
        if (highLevAlarmValue?.dataValue !== '1') {
            group.splice(highLevAlarmIndex, 1);
        } else if (lowLevAlarmValue?.dataValue !== '1') {
            group.splice(lowLevAlarmIndex, 1);
        } else if (highLevAlarmValue?.dataValue === '1' && lowLevAlarmValue?.dataValue === '1') {
            group.splice(lowLevAlarmIndex, 1);
        }
    }

    return group?.filter(obj => {
        if (obj?.infoCode === 'localAndManualStatus') {
            const localRemoteStatusValObj = getIotData(d?.key, 'localRemoteStatus');
            const manualAutoStatusValObj = getIotData(d?.key, 'manualAutoStatus');
            // 本地或者手动的时候才显示
            return localRemoteStatusValObj?.dataValue === '0' || manualAutoStatusValObj?.dataValue === '0';
        } else if (obj?.infoCode === 'passByName') {
            return true;
        } else {
            const valObj = getIotData(d?.key, obj?.infoCode);
            return !!valObj?.dataValue;
        }
    });
});
const getItmeStyle = iot => {
    const d = props.data;

    if (iot.infoCode === 'localAndManualStatus') {
        const localRemoteStatusValObj = getIotData(d?.key, 'localRemoteStatus');
        const manualAutoStatusValObj = getIotData(d?.key, 'manualAutoStatus');
        if (localRemoteStatusValObj?.dataValue === '0')
            return {
                color: '#fff',
                background: '#246FE5'
            };
        if (manualAutoStatusValObj?.dataValue === '0')
            return {
                color: '#fff',
                background: '#ffb800'
            };

        return {};
    }

    const valObj = getIotData(d?.key, iot?.infoCode);
    // console.log('group======iot.infoCode: ', iot.infoCode, valObj);
    if (!valObj) {
        return;
    }
    if (iot.infoCode === 'localRemoteStatus') {
        if (valObj?.dataValue === '0') {
            return {
                color: '#fff',
                background: '#246FE5'
            };
        }
    }

    if (iot.infoCode === 'manualAutoStatus') {
        if (valObj?.dataValue === '0') {
            return {
                color: '#fff',
                background: '#ffb800'
            };
        }
    }

    // 小附件名称
    if (iot.infoCode === 'passByName') {
        return {
            color: '#1B2129',
            background: '#E8ECF0CC'
        };
    }

    if (iot.infoCode === 'runStatus') {
        return {
            color: '#FFF',
            background: valObj.dataValue === '1' ? '#09B3B5' : '#8B949E'
        };
    } else if (iot.infoCode === 'onlineStatus') {
        return {
            color: '#FFF',
            background: valObj.dataValue === '1' ? '#246FE5' : '#8B949E'
        };
        // highLevAlarm lowLevAlarm faultStatus
    } else if (iot.infoCode === 'highLevAlarm' || iot.infoCode === 'lowLevAlarm' || iot.infoCode === 'faultStatus') {
        return {
            color: '#FFF',
            background: valObj.dataValue === '1' ? '#F55047' : '#8B949E'
        };
    }
};
</script>

<style lang="scss" scoped>
.group-tab-wrap {
    display: inline-flex;
    align-items: flex-start;
    gap: 4px;
    .group-tab-item {
        display: inline-block;
        text-align: center;
        border-radius: 2px;
        color: #ffffff;
        line-height: 1.4;
        padding: 0 4px;
        margin: 0 2px;
        white-space: nowrap;
    }
}
</style>
