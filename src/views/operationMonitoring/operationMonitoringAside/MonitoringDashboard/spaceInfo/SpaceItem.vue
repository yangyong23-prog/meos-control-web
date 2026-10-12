<template>
    <div class="sapce-list-item">
        <div class="sapce-list-item-title fc">
            <div class="title-word h100 fc">{{ data.localName }}</div>
            <div class="title-floor h100 fc">{{ data.floorName }}</div>
            <m-tips :content="i18n.global.t('meos_control_web.open_new_tab_detail')" theme="darkTransparent" trigger="hover">
                <div class="title-icon fc" @click.stop="jumpTo(data.id)">
                    <EquipHoverIcon></EquipHoverIcon>
                </div>
            </m-tips>
        </div>
        <div v-if="!(code === 'noData' || code === 'isConfiguration')" class="sapce-list-item-infocodes">
            <DataValueName
                :color="DEMAND_TARGET_TYPE_OBJ[data.DEMAND_TARGET_TYPE.dataValue]?.color"
                :name="i18n.global.t('meos_control_web.schedule_status_colon')"
                :value="data.DEMAND_TARGET_TYPE.dataValueName"
            />
            <DataValueName :name="i18n.global.t('meos_control_web.temperature_control_target')" :value="data.tempTwinControlAim?.dataValue" unit="°C" />
            <DataValueName :name="i18n.global.t('meos_control_web.current_temp_colon')" :value="data.tdb?.dataValue" unit="°C" />
            <DataValueName
                :name="i18n.global.t('meos_control_web.comfort_range_colon')"
                :value="(data.DEMAND_CONFIG?.dataValue?.lowerComfortSeasonLimitValue || '--') + ' ~ ' + (data.DEMAND_CONFIG?.dataValue?.upperComfortSeasonLimitValue || '--')"
                unit="°C"
            />
        </div>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import EquipHoverIcon from '@/assets/svg/equipHoverIcon.svg';
import { getAuthParamsString } from '@/utils/envUtils';
import { openWebsite } from '@/utils/websiteNavigation';
import { MEOI_INSTANCE_DETAIL, CLOUD_ORIGIN } from '@/config';
import DataValueName from './DataValueName.vue';
const props = defineProps({
    data: {
        type: Object,
        default: () => ({})
    },
    code: {
        type: String,
        default: ''
    }
});

const DEMAND_TARGET_TYPE_OBJ = {
    COLD_STORAGE_VALUE: {
        color: '#01A9D7'
    },
    HEAT_STORAGE_VALUE: {
        color: '#E75300'
    },
    TARGET_VALUE: {
        color: ''
    },
    UPPER_LIMIT_VALUE: {
        color: '#E75300'
    },
    LOWER_LIMIT_VALUE: {
        color: '#01A9D7'
    }
};
const jumpTo = id => {
    openWebsite(MEOI_INSTANCE_DETAIL, {
        params: `objId=${id}&${getAuthParamsString()}&f=MEOI_CatalogList&type=all`,
        newPage: true,
        origin: CLOUD_ORIGIN || ''
    });
};
</script>
<style lang="less" scoped>
.sapce-list-item {
    padding: 16px 12px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    border-bottom: 1px solid var(--gray-200);
    border-top-right-radius: 4px;
    border-top-left-radius: 4px;
    &:last-child {
        border-bottom: none;
    }
    &:hover {
        border-bottom-left-radius: 4px;
        border-bottom-right-radius: 4px;
        border-bottom-color: var(--alpha-30);
        background-color: var(--alpha-30);
        .title-icon {
            display: flex;
        }
        .sapce-list-item-title {
            padding-right: 22px;
        }
    }
    &-title {
        gap: 4px;
        position: relative;
        height: 20px;
        .title-word {
            max-width: calc(100% - 22px);
            word-break: break-all;
        }
        .title-floor {
            background-color: var(--blue-100);
            color: var(--blue-700);
            padding: 0 4px;
            width: 22px;
            align-self: start;
            border-radius: 2px;
        }
        .title-icon {
            position: absolute;
            display: none;
            align-self: start;
            cursor: pointer;
            border-radius: 2px;
            right: 0;
            top: 1px;
            &:hover {
                background-color: var(--alpha-30);
            }
        }
    }
    &-infocodes {
        gap: 8px 10px;
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }
}
</style>
