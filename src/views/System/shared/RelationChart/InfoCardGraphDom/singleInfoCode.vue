<template>
    <div class="single-info" :style="{ fontSize: `${data.fontSize || 24}px` }">
        <div v-if="data.showTitle" v-ellipsis class="single-info-name text-hide">{{ data.title }}</div>
        <span class="single-info-value fc">
            <template v-if="infoLinks?.length > 0">
                <template v-for="(linkItem, linkIdx) in infoLinks" :key="linkIdx">
                    <m-tips theme="darkTransparent" placement="top" trigger="hover" :enterable="false">
                        <template #content>
                            <span class="jum-tip" style="font-size: 12px; color: var(--gray-400)">*{{ i18n.global.t('meos_control_web.click_jump_data_analysis') }}</span>
                            <br />
                            <div>{{ linkItem.aliasName || linkItem.name }}:{{ getItemValText(data, linkItem) }}</div>
                        </template>
                        <div class="group-val-item" @click.stop="jumpToDataAnalysis(infoLinks, true)">{{ linkItem.name }}:{{ getItemValText(data, linkItem) }}</div>
                    </m-tips>
                    <div v-if="linkIdx < infoLinks.length - 1" class="group-val-line" :style="{ height: `${data.fontSize || 24}px` }"></div>
                </template>
            </template>
            <m-tips v-else theme="darkTransparent" placement="top" trigger="hover" :enterable="false">
                <template #content>
                    <span class="jum-tip" style="font-size: 12px; color: var(--gray-400)">*{{ i18n.global.t('meos_control_web.click_jump_data_analysis') }}</span>
                    <br />
                    <div>{{ data?.infoObject?.aliasName || data?.infoObject?.name }} :{{ getItemValText(data, data.infoObject) }}</div>
                </template>

                <div class="group-val-item" @click.stop="jumpToDataAnalysis(data.infoObject)">
                    {{ getItemValText(data, data.infoObject) }}
                </div>
            </m-tips>
        </span>
    </div>
</template>
<script setup>
import i18n from '@/localization';
import { jumpToAnalysis } from '@/utils/envUtils';
import _ from 'lodash';

const getItemValText = inject('getItemValText');
const props = defineProps({
    data: {
        type: Object,
        default: () => {}
    }
});

const jumpToDataAnalysis = (item, useParentCode = false) => {
    // console.log('=====jumpToDataAnalysis', item);
    const equipId = props.data.key,
        _infoCode = useParentCode ? props.data.infoObject?.infoCode : item.infoCode;

    // const { infoCode } = item;
    if (_.isArray(item) && equipId) {
        const jumpParams = item.map(child => {
            return {
                infoCode: child.infoCode,
                id: equipId
            };
        });
        jumpToAnalysis(jumpParams);
    } else if (equipId && _infoCode) {
        const jumpParams = {
            infoCode: _infoCode,
            id: equipId
        };
        jumpToAnalysis(jumpParams);
    }
};
const infoLinks = computed(() => {
    return props.data.infoObject?.linkCodes;
});
</script>
<style lang="less" scoped>
.single-info {
    text-align: center;
    &-name {
        color: var(--gray-500);
    }
    &-value {
        // display: inline-block;
        gap: 8px;
        height: 32px;
        line-height: 1.3333;
        padding: 0 2px;
        margin: 0 2px;
        border-radius: 2px;
        color: var(--gray-900);

        font-weight: 700;
    }
    .group-val-text {
    }
    .group-val-line {
        width: 1px;
        background: var(--gray-400, #c4c9cf);
    }
    .group-val-item {
        // background: var(--Grey-Alpha-30, rgba(196, 201, 207, 0.3));
        margin: auto;
        padding: 2px;
        border-radius: 2px;
        white-space: nowrap;
        background: rgb(255 255 255 / 80%);
    }
    .group-val-item:hover {
        // background: var(--Grey-Alpha-30, rgba(196, 201, 207, 0.3));
        background: rgb(255 255 255 / 80%);
        color: var(--blue-500);
        cursor: pointer;
    }
}
</style>
