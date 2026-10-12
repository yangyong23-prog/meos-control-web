<template>
    <div class="item item-box" @click.stop="nameCanSelect && emits('clickObj', data)" @mouseenter.stop="emits('hoverObj', data)" @mouseleave.stop="emits('unhoverObj')">
        <div class="fb">
            <div class="name-left">
                <span class="equip-name" :class="{ 'can-act-name': nameCanSelect }">{{ data.localName ?? '--' }}</span>
                <m-tag v-if="data?.floorLocalName || data.inFloor?.localName" size="small" color="#1B4ACC" bg-color="#D9EBFF" style="font-weight: var(--platform-font-weight)">
                    {{ data?.floorLocalName || data.inFloor?.localName }}</m-tag
                >
            </div>

            <div class="display-n">
                <m-tips v-if="!statusTags" :content="`${i18n.global.t('meos_control_web.open_new_tab_jump_to_details_2')}`" theme="darkTransparent" placement="left">
                    <div class="icon-link fcc bgc-hover" @click.stop="itemInfo(data)">
                        <SvgIcon name="detail" />
                    </div>
                </m-tips>
            </div>
        </div>
        <div v-if="statusTags" class="mr16 mb4 title-tag">
            <m-tag v-if="item.inFloor?.localName" size="small" color="#1B4ACC" bg-color="#D9EBFF" style="font-weight: var(--platform-font-weight)">
                {{ item.inFloor?.localName }}</m-tag
            >
            <TemplateObjectTags v-if="statusTags" :status-data="statusTags" :select-obj="item" :template-type="DETAIL" />
        </div>

        <div v-if="infoCodes?.length > 0" class="info-content">
            <div v-for="info in infoCodesShow" :key="info.infoCode" class="info">
                <span class="font">{{ info.infoCodeName + '：' }}</span>
                <m-popover v-if="textUpdateTime(info)" :enterable="false" theme="darkTransparent" :show-arrow="false">
                    <template #content>
                        <p>{{ i18n.global.t('meos_control_web.data_update_time_colon') }}{{ textUpdateTime(info) ?? '--' }}</p>
                        <p style="color: #c4c9cf; font-size: 12px">{{ i18n.global.t('meos_control_web.click_analysis_jump') }}</p>
                    </template>
                    <span v-ellipsis :class="[info.dataValue ? 'iot-info' : '', 'time', 'm-ellipsis']" @click.stop="detailsIot(data.id, info)">{{
                        getIotShowValue(data.id, info.infoCode)
                    }}</span>
                </m-popover>
                <span v-else v-ellipsis :class="[info.dataValue ? 'iot-info' : '', 'time', 'm-ellipsis']" @click.stop="detailsIot(data.id, info)">{{
                    getIotShowValue(data.id, info.infoCode)
                }}</span>
            </div>
        </div>

        <div v-if="needMore">
            <m-button v-if="curExpanded" type="link" size="medium" icon="IconMeriComponentChevronUp" icon-position="right" @click.stop="collapse">{{
                i18n.global.t('meos_control_web.collapse')
            }}</m-button>
            <m-button v-else type="link" size="medium" icon="IconMeriComponentChevronDown" icon-position="right" @click.stop="showAll">{{
                i18n.global.t('meos_control_web.view_more')
            }}</m-button>
        </div>
    </div>
</template>
<script setup>
import i18n from '@/localization';
import SvgIcon from '@/components/common/SvgIcon.vue';
import { openWebsite } from '@/utils/websiteNavigation';
import DockSingleton from '@/hooks/responsiveDock';
import { getAuthParamsString, jumpToAnalysis } from '@/utils/envUtils';
import { CLOUD_ORIGIN, MEOI_INSTANCE_DETAIL } from '@/config';
import dayjs from 'dayjs';
import TemplateObjectTags from '@/components/templateObjectTags/index.vue';
import { curExpandObjIdKey, idMapInfoCodesKey } from './useRelationships';
import { DETAIL } from '@/utils/globalVariables';

const props = defineProps({
    selectObj: {
        type: Object,
        default: () => {}
    },
    data: {
        type: Object,
        default: () => {}
    },
    nameCanSelect: {
        type: Boolean,
        default: true
    }
});
const emits = defineEmits(['clickObj', 'hoverObj', 'unhoverObj']);
const statusCodes = ['relEquipStatus', 'relSpaceStatus', 'spaceStatus', 'equipStatus'];
const curExpandObjId = inject(curExpandObjIdKey);
const idMapInfoCodes = inject(idMapInfoCodesKey);

const statusTags = computed(() => {
    return props.data?.relInfoCodeGroupConfigs?.find(item => statusCodes.includes(item.groupCode));
});
const infoCodes = computed(() => {
    return idMapInfoCodes?.value ? idMapInfoCodes.value[props.data?.id] || [] : [];
});
const needMore = computed(() => {
    return infoCodes.value?.length > 6;
});
const curExpanded = computed(() => {
    return curExpandObjId?.value === props.data?.id;
});
const infoCodesShow = computed(() => {
    return needMore.value && !curExpanded.value ? infoCodes.value?.slice(0, 6) : infoCodes.value;
});
const textUpdateTime = info => {
    const t = getIotData(props.data.id, info.infoCode)?.dataTime;
    if (t) {
        return dayjs(t).format('YYYY.MM.DD HH:mm:ss');
    }
    return null;
};

const showAll = () => {
    if (curExpandObjId) {
        curExpandObjId.value = props.data?.id;
    }
};
const collapse = () => {
    if (curExpandObjId) {
        curExpandObjId.value = '';
    }
};
const { getIotShowValue, getIotData } = DockSingleton.getInstance();
//ios详情
const detailsIot = (id, item) => {
    if (item.dataValue) {
        const jumpParams = {
            infoCode: item.infoCode,
            id
        };
        jumpToAnalysis(jumpParams);
    }
};

const itemInfo = item => {
    if (!item?.id) return;
    openWebsite(MEOI_INSTANCE_DETAIL, {
        params: `objId=${item?.id}&${getAuthParamsString()}&f=MEOI_CatalogList&type=all`,
        newPage: true,
        origin: CLOUD_ORIGIN || ''
    });
};
</script>

<style lang="less" scoped>
.item {
    display: flex;
    padding: 12px 12px;
    flex-direction: column;
    border-bottom: 1px solid var(--gray-200, #e8ecf0);
    .equip-name {
        color: var(--Grey-900);
        font-size: 14px;
        font-weight: var(--platform-font-weight);
    }
    .bgc-hover {
        border-radius: 4px;
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 20px;
        height: 20px;
        &:hover {
            background: var(--Grey-Alpha-30, rgba(196, 201, 207, 0.3));
        }
    }
    .display-n {
        display: none;
    }
    &:hover {
        .display-n {
            display: flex;
        }
    }
    .name-left {
        display: flex;
        align-items: start;
        gap: 4px;
        align-self: stretch;
    }
    .title-tag {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        height: 20px;
        gap: 4px;
        margin-top: 4px;
    }
    .info-content {
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        .info {
            min-width: calc(50% - 8px);
            margin-top: 8px;
            .font {
                color: #626c78;
            }
            .iot-info {
                color: #246fe5;
            }

            .iot-info:hover {
                color: #1b4acc;
                cursor: pointer;
            }
        }
    }

    &:hover {
        background-color: var(--Grey-Alpha-30, rgba(196, 201, 207, 0.3));
        cursor: pointer;
        .can-act-name {
            color: var(--blue-500, #246fe5);
        }
    }
}
.item-box:last-child {
    border-bottom: none;
}
.no-data {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
