<template>
    <div class="list-container">
        <div v-for="(controller, idx) in list" :key="idx" class="controller-group">
            <div :class="controller.id !== 'none' ? 'controller' : 'no-hover'">
                <div v-ellipsis class="m-ellipsis">
                    {{
                        controller.id !== 'none'
                            ? `${i18n.global.t('meos_control_web.loop_related_module_colon')}${controller.localName}`
                            : i18n.global.t('meos_control_web.unlinked_lighting_controller')
                    }}
                </div>
                <m-tips v-if="controller.id !== 'none'" :content="`${i18n.global.t('meos_control_web.open_new_tab_jump_to_details_2')}`" theme="darkTransparent" placement="left">
                    <div class="icon-link fcc bgc-hover" @click.stop="itemInfo(controller)">
                        <SvgIcon name="detail" />
                    </div>
                </m-tips>
            </div>
            <LoopOrModuleItem
                v-for="(obj, index) in controller?.children"
                :key="index"
                :tag-codes="tagCodes"
                :data="obj"
                :use-check="false"
                :hover-detail="true"
                :has-expand="false"
                :name-ellipsis="false"
            >
            </LoopOrModuleItem>
        </div>
    </div>
</template>
<script setup>
import i18n from '@/localization';
import LoopOrModuleItem from '../LoopOrModuleItem.vue';
import SvgIcon from '@/components/common/SvgIcon.vue';
import { openWebsite } from '@/utils/websiteNavigation';

import { getAuthParamsString } from '@/utils/envUtils';
import { CLOUD_ORIGIN, MEOI_INSTANCE_DETAIL } from '@/config';

defineProps({
    list: {
        type: Array,
        default: () => []
    }
});

const tagCodes = ['alarmstatusdetail', 'onlineStatus', 'faultStatus'];

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
.list-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
    align-self: stretch;

    .no-hover,
    .controller {
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
    .controller {
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
    .controller-group {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
    }
}
</style>
