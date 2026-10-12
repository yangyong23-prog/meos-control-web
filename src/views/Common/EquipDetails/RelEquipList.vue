<template>
    <div class="associated-device">
        <div v-for="(item, index) in data" :key="index" :class="['equip-item']">
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

            <independentSetting v-if="getSettings(item)" :list="getSettings(item)" :select-obj="item" v-bind="$attrs" />
        </div>
    </div>
</template>
<script setup>
import i18n from '@/localization';
import SvgIcon from '@/components/common/SvgIcon.vue';
import independentSetting from '@/components/independentSetting/index.vue';

import { openWebsite } from '@/utils/websiteNavigation';
import { getAuthParamsString } from '@/utils/envUtils';
import { MEOI_INSTANCE_DETAIL, CLOUD_ORIGIN } from '@/config';
import moreTemplateObjectTags from '@/views/Common/moreTemplateObjectTags/index.vue';
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
onMounted(() => {
    console.log(props.data, '2222222====');
});
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
</style>
