<template>
    <div class="associated-device">
        <div v-for="(item, index) in props.data" :key="index" :class="['equip-item']">
            <div :class="['equip-title']" @click.stop="clickObj(item)" @mouseleave="unhoverObj(item)" @mouseenter="hoverObj(item)">
                <div class="fc" style="max-width: calc(100% - 26px)">
                    <span class="f16 mr4 equip-name">{{ item.localName ?? '--' }}</span>
                </div>
                <!-- 新开标签页跳转详情 -->
                <m-tips :content="`${i18n.global.t('meos_control_web.open_new_tab_jump_to_details_2')}`" theme="darkTransparent" placement="left">
                    <div class="icon-link fcc bgc-hover" @click.stop="jumpTo(item.id)">
                        <SvgIcon name="detail" />
                    </div>
                </m-tips>
            </div>
            <div class="single-row-tags">
                <m-tag color="#1B4ACC" bg-color="#D9EBFF" size="small"> {{ item.inFloor?.localName ?? '--' }} </m-tag>
                <moreTemplateObjectTags :status-data="item" />
            </div>
            <div class="single-row-control-set">
                <ControlSet
                    :info-codes="getSettings(item)?.relInfoCodeConfigs || []"
                    :custom-disabled-fun="customDisabledFun"
                    :object-id="item.id"
                    :set-conditions="['equipSwitchSet']"
                    :hide-intervention="true"
                ></ControlSet>
            </div>

            <!-- <independentSetting v-if="getSettings(item)" :list="getSettings(item)" :select-obj="item" v-bind="$attrs" /> -->
        </div>
    </div>
</template>
<script setup>
import i18n from '@/localization';
import SvgIcon from '@/components/common/SvgIcon.vue';
// import independentSetting from '@/components/independentSetting/index.vue';
import ControlSet from '@/components/ObjectInfoComponents/ControlSet/index.vue';

import { openWebsite } from '@/utils/websiteNavigation';
import { getAuthParamsString } from '@/utils/envUtils';
import { MEOI_INSTANCE_DETAIL, CLOUD_ORIGIN } from '@/config';
import moreTemplateObjectTags from '@/views/Common/moreTemplateObjectTags/index.vue';
import { isEdge } from '@/utils/envUtils';
import { isEmpty } from 'lodash';
import DockSingleton from '@/hooks/responsiveDock';

const { getIotData } = DockSingleton.getInstance();

const emits = defineEmits(['openMonitorPlayer', 'unhoverObj', 'hoverObj', 'clickObj']);
const props = defineProps({
    data: {
        type: Array,
        default: () => []
    },
    selectObj: {
        type: Object,
        default: () => {}
    }
});
const clickObj = item => {
    emits('clickObj', item);
};
const hoverObj = item => {
    item.isHover = true;
};
const unhoverObj = item => {
    item.isHover = false;
};
const getSettings = obj => {
    if (!obj?.relInfoCodeGroupConfigs?.length) {
        return;
    }
    return obj?.relInfoCodeGroupConfigs.find(item => item.groupCode === 'equipParameterSet' && item.relInfoCodeConfigs?.length > 0);
};
const jumpTo = id => {
    openWebsite(MEOI_INSTANCE_DETAIL, {
        params: `objId=${id}&${getAuthParamsString()}&f=MEOI_CatalogList&type=all`,
        newPage: true,
        origin: CLOUD_ORIGIN || ''
    });
};

const getInfoDataInDock = (curRowId, infoItem) => {
    if (!infoItem) {
        return;
    }
    const infoInDock = getIotData(curRowId, infoItem.infoCode) ?? null;

    const refInfo = isEmpty(infoInDock) ? infoItem : infoInDock;
    return refInfo;
};

const disableControls = curRowId => {
    if (isEdge()) {
        const curRow = props.data.find(v => v?.id === curRowId);
        const condition = getSettings(curRow).groupChildren.find(o => o.groupCode === 'equipParameterSetCondition')?.relInfoCodeConfigs;
        let localRemoteStatus = condition?.find(o => o.infoCode === 'localRemoteStatus'),
            onlineStatus = condition?.find(o => o.infoCode === 'onlineStatus');
        localRemoteStatus = getInfoDataInDock(curRowId, localRemoteStatus);
        onlineStatus = getInfoDataInDock(curRowId, onlineStatus);
        // https://shimo.im/docs/Wr3DpYy68KI2D53J/ 《设备状态对设备控制操作的限制》，可复制链接后用石墨文档 App 打开
        if ((localRemoteStatus?.existsIotRule === false && onlineStatus?.dataValue === '1') || (localRemoteStatus?.dataValue === '1' && onlineStatus?.dataValue === '1')) {
            return false;
        } else {
            return true;
        }
    }
    return true;
};
const getDisabledTips = curRowId => {
    const isCloud = !isEdge();
    let title = '';
    const isDisabledControl = disableControls(curRowId);
    if (isCloud) {
        title = i18n.global.t('meos_control_web.equipment_currently_uncontrollable');
    } else if (isDisabledControl) {
        title = i18n.global.t('meos_control_web.equipment_offline_local_no_control');
    }
    return title;
};
const customDisabledFun = (condition, infoItem, curRowId) => {
    const obj = { disabled: false, disabledText: '', setValueAlways: true };

    const disabledTips = getDisabledTips(curRowId);
    if (disabledTips) {
        obj.disabled = true;
        obj.disabledText = disabledTips;
    }

    return obj;
};
</script>
<style lang="less" scoped>
.associated-device {
    display: flex;
    flex-direction: column;
    gap: 12px;
    .equip-item {
        padding: 12px 0 4px 0;
        display: flex;
        flex-direction: column;
        gap: 4px;
        border-radius: 4px;
        background: #f7f9fa;
        .equip-title {
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            padding: 0 12px;
            .current-playing {
                display: inline-block;
                padding: 0 4px;
                border-radius: 2px;
                background-color: var(--blue-100);
                color: var(--blue-700);
                margin-left: 4px;
            }
            .equip-name {
                color: @grey-900;
                font-weight: 400;
            }
            .to-vedio-icon {
                padding: 2px;
            }
            .to-vedio-icon:hover {
                border-radius: 4px;
                background: var(--Grey-Alpha-30, rgba(196, 201, 207, 0.3));
                padding: 2px;
            }
        }
    }
    // .equip-item:not(:last-child) {
    //     border-bottom: 1px solid var(--gray-300, #e1e5eb);
    // }
    .equip-item-h {
        border-radius: 4px;
    }
    .equip-item-h:hover {
        background: var(--Grey-Alpha-30, rgba(196, 201, 207, 0.3));
    }

    .bgc-hover {
        border-radius: 4px;
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 26px;
        height: 26px;
        &:hover {
            background: var(--Grey-Alpha-30, rgba(196, 201, 207, 0.3));
        }
    }
}

.single-row-tags {
    display: flex;
    align-items: center;
    gap: 4px;
    padding-left: 12px;
    flex-wrap: wrap;
}
.single-row-control-set {
    padding-inline: 12px;
    margin-top: 8px;
}
</style>
