<template>
    <div class="subItem-row">
        <div class="subItem-left">
            <span class="subItem-title">{{ item?.name || '--' }}</span>
            <m-tag v-if="item?.floor" class="ml4" color="#1B4ACC" bg-color="#D9EBFF" size="small">{{ item.floor }}</m-tag>
            <m-tag v-if="getObjectAbnormalStatus(item.id)" color="#fff" bg-color="#F55047" size="small">{{ i18n.global.t('meos_control_web.abnormal') }}</m-tag>
            <m-tag v-if="isAlarm(item)" color="#fff" bg-color="#FE8F3C" size="small">{{ i18n.global.t('meos_control_web.alarm_signal') }}</m-tag>
            <m-tag v-if="isFault(item)" color="#fff" bg-color="#EABF00" size="small">{{ i18n.global.t('meos_control_web.fault_signal') }}</m-tag>
        </div>
        <m-tips :content="i18n.global.t('meos_control_web.open_new_tab_detail')" theme="darkTransparent" trigger="hover">
            <div class="equipment-icon" @click.stop="jumpTo(item.id)">
                <EquipHoverIcon></EquipHoverIcon>
            </div>
        </m-tips>
    </div>
</template>
<script setup>
import i18n from '@/localization';
import { MEOI_INSTANCE_DETAIL, CLOUD_ORIGIN } from '@/config';
import { openWebsite } from '@/utils/websiteNavigation';
import DockSingleton from '@/hooks/responsiveDock';
import { isFaultFucKey, isAlarmFucKey } from '../hooks/useCommonConfig';
import EquipHoverIcon from '@/assets/svg/equipHoverIcon.svg';
import { getAuthParamsString } from '@/utils/envUtils';
const { getObjectAbnormalStatus } = DockSingleton.getInstance();
const props = defineProps({
    item: {
        type: Object,
        default: () => {}
    }
});
const isFault = inject(isFaultFucKey);
const isAlarm = inject(isAlarmFucKey);
const jumpTo = id => {
    openWebsite(MEOI_INSTANCE_DETAIL, {
        params: `objId=${id}&${getAuthParamsString()}&f=MEOI_CatalogList&type=all`,
        newPage: true,
        origin: CLOUD_ORIGIN || ''
    });
};
</script>
<style lang="less" scoped>
.subItem-row {
    padding: 12px 12px;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;

    .subItem-title {
        color: @grey-900;
        font-size: 14px;
        font-style: normal;
        font-weight: var(--platform-font-weight);
        line-height: 20px;
        margin-right: 4px;
    }

    .subItem-left {
        max-width: calc(100% - 20px);
        display: flex;
        align-items: flex-start;
    }

    .equipment-icon {
        width: 18px;
        height: 18px;
        margin-left: 8px;
        cursor: pointer;
        visibility: hidden;
    }
    &:hover {
        border-radius: 4px;
        background: var(--Grey-Alpha-30, rgba(196, 201, 207, 0.3));
        .equipment-icon {
            visibility: visible;
        }
    }
}
.subItem-row {
    border-bottom: 1px solid #e8ecf0;
    border-radius: 0;
}
</style>
