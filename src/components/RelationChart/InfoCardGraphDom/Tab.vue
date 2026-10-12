<template>
    <div v-if="hasDataValue" class="tab-item" :style="{ ...getItmeStyle(data.infoObject), fontSize: `${data.fontSize || 24}px` }">
        {{ getItemValText(data, data.infoObject) }}
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

const hasDataValue = computed(() => {
    const d = props.data;
    // console.log('d: ', d);
    const code = d?.infoObject?.infoCode;
    if (code === 'passByName') {
        return true;
    }
    if (code === 'localAndManualStatus') {
        const localRemoteStatusValObj = getIotData(d?.key, 'localRemoteStatus');
        const manualAutoStatusValObj = getIotData(d?.key, 'manualAutoStatus');

        // 本地或者手动的时候才显示
        return localRemoteStatusValObj?.dataValue === '0' || manualAutoStatusValObj?.dataValue === '0';
    }
    const valObj = getIotData(d?.key, code);
    if (!valObj) {
        return;
    }

    if (code === 'highLevAlarm' || code === 'lowLevAlarm' || code === 'faultStatus') {
        if (valObj?.dataValue !== '1') {
            return false;
        }
    }
    return !!valObj?.dataValue;
});
const getItmeStyle = iot => {
    const d = props.data;

    // 本地手动
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

    // 本地远程
    if (iot.infoCode === 'localRemoteStatus') {
        const localRemoteStatusValObj = getIotData(d?.key, 'localRemoteStatus');
        if (localRemoteStatusValObj?.dataValue === '0') {
            return {
                color: '#fff',
                background: '#246FE5'
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

    // 手动自动
    if (iot.infoCode === 'manualAutoStatus') {
        const manualAutoStatusValObj = getIotData(d?.key, 'manualAutoStatus');
        if (manualAutoStatusValObj?.dataValue === '0') {
            return {
                color: '#fff',
                background: '#ffb800'
            };
        }
    }

    const valObj = getIotData(d?.key, iot.infoCode);
    if (!valObj) {
        return {};
    }

    // 开启关闭
    if (iot.infoCode === 'runStatus') {
        return {
            color: '#FFF',
            background: valObj.dataValue === '1' ? '#09B3B5' : '#8B949E'
        };

        // 在线离线
    } else if (iot.infoCode === 'onlineStatus') {
        return {
            color: '#FFF',
            background: valObj.dataValue === '1' ? '#246FE5' : '#8B949E'
        };

        // highLevAlarm lowLevAlarm faultStatus
    } else if (iot.infoCode === 'highLevAlarm' || iot.infoCode === 'lowLevAlarm' || iot.infoCode === 'faultStatus') {
        return {
            color: '#FFF',
            background: valObj.dataValue === '1' ? '#F55047' : 'transparent'
        };
    }
    return {};
};
</script>

<style lang="scss" scoped>
.tab-item {
    text-align: center;
    height: 28px;
    border-radius: 2px;
    color: #ffffff;
    font-size: 20px;
    line-height: 28px;
    padding: 0 4px;
    white-space: nowrap;
}
</style>
