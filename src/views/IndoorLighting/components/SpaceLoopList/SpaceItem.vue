<template>
    <div class="space-group">
        <div :class="space.id !== 'none' ? 'space' : 'no-hover'">
            <div v-ellipsis class="m-ellipsis">
                {{ space.localName }}
                <m-tag v-if="space.id !== 'none'" size="small" color="#1B4ACC" bg-color="#D9EBFF" style="font-weight: var(--platform-font-weight)">
                    {{ space.floorLocalName ?? '--' }}</m-tag
                >
            </div>
            <div v-if="space.id !== 'none'" @mouseenter="e => detailTooltip.show(e)" @mouseleave="e => detailTooltip.hide()">
                <div class="icon-link fcc bgc-hover" @click.stop="itemInfo(space)">
                    <SvgIcon name="detail" />
                </div>
            </div>
        </div>
        <LoopOrModuleItem
            v-for="obj in space?.children"
            :key="obj?.id"
            :tag-codes="tagCodes"
            :data="obj"
            :use-check="false"
            :hover-detail="true"
            :has-expand="false"
            :name-ellipsis="false"
        >
        </LoopOrModuleItem>
    </div>
</template>
<script setup>
import LoopOrModuleItem from '../LoopOrModuleItem.vue';
import SvgIcon from '@/components/common/SvgIcon.vue';
import { openWebsite } from '@/utils/websiteNavigation';
import { detailTooltipKey } from '@/views/IndoorLighting/hooks/useDetailTips';
import { getAuthParamsString } from '@/utils/envUtils';
import { CLOUD_ORIGIN, MEOI_INSTANCE_DETAIL } from '@/config';

defineProps({
    space: {
        type: Object,
        default: () => ({})
    }
});

const tagCodes = ['alarmstatusdetail', 'onlineStatus', 'faultStatus'];
const detailTooltip = inject(detailTooltipKey);

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
.no-hover,
.space {
    width: 100%;
    display: flex;
    padding: 4px 12px;
    justify-content: space-between;
    align-items: center;

    color: #000;
    text-align: center;
    font-size: 14px;
    font-weight: 400;
}
.space {
    cursor: pointer;

    &:hover {
        border-radius: 4px;
        background: var(--Grey-Alpha-30, rgba(196, 201, 207, 0.3));
        .bgc-hover {
            display: flex;
        }
    }
    .bgc-hover {
        border-radius: 4px;
        cursor: pointer;
        display: none;
        justify-content: center;
        align-items: center;
        width: 18px;
        height: 18px;
        &:hover {
            background: var(--Grey-Alpha-30, rgba(196, 201, 207, 0.3));
        }
    }
}
.space-group {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
}
</style>
