<template>
    <div class="sensors-container">
        <div v-for="(item, index) in sensorArr" :key="index + 's'" class="sensors-item">
            <div class="eq-name">
                <m-popover :enterable="false" theme="darkTransparent" :show-arrow="false" :content="i18n.global.t('meos_control_web.open_new_page_detail')">
                    <span @click="itemInfo(item)">{{ item.localName ?? '--' }}</span>
                </m-popover>
                <m-tag class="eq-tag" color="#1B4ACC" bg-color="#D9EBFF" size="small"> {{ item.floorLocalName }} </m-tag>
            </div>
            <div class="space fc">
                {{ i18n.global.t('meos_control_web.located_space_colon') }}
                <div v-for="(it, io) in item.spaces" :key="io" class="fc space-name">
                    <m-popover :enterable="false" theme="darkTransparent" :show-arrow="false" :content="i18n.global.t('meos_control_web.open_new_page_detail')">
                        <span @click="itemInfo(it)">{{ `${it.localName ?? '--'}${io < item.spaces.length - 1 ? '、' : ''}` }}</span>
                    </m-popover>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import i18n from '@/localization';
import { MEOI_INSTANCE_DETAIL, CLOUD_ORIGIN } from '@/config';
import { getAuthParamsString } from '@/utils/envUtils';
import { openWebsite } from '@/utils/websiteNavigation';
defineProps({
    sensorArr: {
        type: Array,
        default: () => []
    }
});
const itemInfo = item => {
    openWebsite(MEOI_INSTANCE_DETAIL, {
        params: `objId=${item.id}&${getAuthParamsString()}&f=MEOI_CatalogList&type=all`,
        newPage: true,
        origin: CLOUD_ORIGIN || ''
    });
};
</script>
<style lang="less" scoped>
.sensors-item {
    margin-right: 10px;
    padding: 8px 12px;
    border-radius: 4px;
    background: var(--gray-50, #f7f9fa);
    margin-bottom: 12px;
    .eq-name {
        color: var(--gray-900, #1b2129);
        font-size: 14px;
        font-weight: var(--platform-font-weight);
        line-height: 22px;
        margin-bottom: 4px;
        .eq-tag {
            margin-left: 4px;
        }
    }
    .space {
        color: var(--gray-600, #626c78);
        font-size: 14px;
        font-weight: var(--platform-font-weight);
        line-height: 22px;
    }
    &:hover {
        background: var(--Grey-Alpha-30, rgba(196, 201, 207, 0.3));
    }
    .eq-name:hover {
        color: #246fe5;
        cursor: pointer;
    }
    .space-name:hover {
        color: #246fe5;
        cursor: pointer;
    }
}
</style>
