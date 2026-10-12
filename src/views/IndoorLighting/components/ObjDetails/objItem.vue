<template>
    <div class="item" @click.stop="emits('clickObj', data)" @mouseenter.stop="emits('hoverObj', data)" @mouseleave.stop="emits('unhoverObj')">
        <div class="fcb">
            <div class="name-left">
                <span class="equip-name">{{ data.localName ?? '--' }}</span>
            </div>

            <m-tips :content="`${i18n.global.t('meos_control_web.open_new_tab_jump_to_details_2')}`" theme="darkTransparent" placement="left">
                <div class="icon-link fcc bgc-hover" @click.stop="itemInfo(data)">
                    <SvgIcon name="detail" />
                </div>
            </m-tips>
        </div>
        <div class="mr16 mb4 title-tag">
            <SpaceTags :space-id="data?.id" />
        </div>

        <div v-if="infoCodes?.length > 0" class="info-content">
            <div v-for="info in infoCodes" :key="info.infoCode" class="info">
                <span class="font">{{ info.infoCodeName ?? '--' }}：</span>
                <m-popover v-if="!isEmptyNoReturn(info.dataValue)" :enterable="false" theme="darkTransparent" :show-arrow="false">
                    <template #content>
                        <p>{{ i18n.global.t('meos_control_web.data_update_time_colon') }}{{ dayjs(info.dataTime ?? '').format('YYYY.MM.DD HH:mm:ss') }}</p>
                        <p style="color: #c4c9cf; font-size: 12px">{{ i18n.global.t('meos_control_web.click_analysis_jump') }}</p>
                    </template>
                    <span v-ellipsis :class="[info.dataValue ? 'iot-info' : '', 'time', 'm-ellipsis']" @click.stop="detailsIot(data.id, info)">{{
                        getIotShowValue(data?.id, info.infoCode)
                    }}</span>
                </m-popover>
                <span v-else>--</span>
            </div>
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
import { isEmptyNoReturn } from '@/utils/tools';

import SpaceTags from '../SpaceTags.vue';

const props = defineProps({
    data: {
        type: Object,
        default: () => {}
    }
});
const { getIotShowValue, getIotData } = DockSingleton.getInstance();
const emits = defineEmits(['clickObj', 'hoverObj', 'unhoverObj']);

const infoCodes = computed(() => {
    const info = getIotData(props.data?.id, 'workPlaneLux');

    return info?.infoCode ? [info] : [];
});

//ios详情
const detailsIot = (id, item) => {
    console.log('item :>> ', item);
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
        display: none;
        justify-content: center;
        align-items: center;
        width: 20px;
        height: 20px;
        &:hover {
            background: var(--Grey-Alpha-30, rgba(196, 201, 207, 0.3));
        }
    }
    &:hover {
        .bgc-hover {
            display: flex;
        }
    }
    .name-left {
        display: flex;
        align-items: center;
        gap: 4px;
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
}
.no-data {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
