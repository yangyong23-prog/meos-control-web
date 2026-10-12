<template>
    <div v-if="data.showTitle" v-ellipsis class="group-info-name text-hide">{{ data.title }}</div>

    <div v-for="(item, index) in data?.groups" :key="index" class="group-info-item fb" :class="[item.linkCodes?.length > 0 ? 'newline' : 'fb inline']">
        <div v-ellipsis class="group-info-item-key text-hide" :style="{ maxWidth: isIot ? '240px' : '120px' }">
            {{ item.aliasName || item.name }}
        </div>
        <div v-if="data.linkCodes?.length > 0 || item.linkCodes?.length > 0" class="item-val-newline fc">
            <template v-for="(linkItem, linkIdx) in data.linkCodes || item.linkCodes" :key="`linkCode_${item.key}_${linkIdx}`">
                <m-tips theme="darkTransparent" placement="top" trigger="hover" :enterable="false">
                    <template #content>
                        <span class="jum-tip" style="font-size: 12px; color: var(--gray-400)">*{{ i18n.global.t('meos_control_web.click_jump_data_analysis') }}</span>
                        <br />
                        <div>{{ linkItem.aliasName || linkItem.name }}:{{ getItemValText(data, linkItem) }}</div>
                    </template>

                    <div class="info-item" @click.stop="jumpToDataAnalysis(linkItem, true, item, data.linkCodes || item.linkCodes)">
                        {{ linkItem.aliasName || linkItem.name }}:{{ getItemValText(data, linkItem) }}
                    </div>
                </m-tips>
                <div v-if="linkIdx < (data.linkCodes || item.linkCodes).length - 1" class="group-val-line"></div>
            </template>
        </div>
        <m-tips v-else theme="darkTransparent" placement="top" trigger="hover" :enterable="false">
            <template #content>
                <span class="jum-tip" style="font-size: 12px; color: var(--gray-400)">*{{ i18n.global.t('meos_control_web.click_jump_data_analysis') }}</span>
                <br />
                <div>{{ infoName(item) }}:{{ getItemValText(data, item) }}</div>
            </template>

            <div class="item-val-inline text-hide" :style="{ maxWidth: isIot ? '120px' : '70px' }" @click.stop="jumpToDataAnalysis(item)">
                {{ getItemValText(data, item) }}
            </div>
        </m-tips>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import { InfoPointDataType } from './constant';
import { jumpToAnalysis } from '@/utils/envUtils';
import _ from 'lodash';

const getItemValText = inject('getItemValText');
const props = defineProps({
    isIot: {
        type: Boolean,
        default: true
    },

    data: {
        type: Object,
        default: () => {}
    }
});
const infoName = item => {
    const curType = props.data?.type;
    let n = '';
    if (curType === InfoPointDataType.EQUIP_TO_INFO_CODES) {
        n = item.aliasName || item.name;
    } else if (curType === InfoPointDataType.INFO_CODE_TO_EQUIPS) {
        n = props.data.title;
    }
    return n;
};
const jumpToDataAnalysis = (item, useParentCode = false, pInfo, infocodes) => {
    // console.log('jumpToDataAnalysis', item);
    const curType = props.data?.type;
    let equipId = null,
        _infoCode = null;
    if (curType === InfoPointDataType.EQUIP_TO_INFO_CODES) {
        equipId = props.data.key;
        _infoCode = useParentCode && pInfo?.infoCode ? pInfo.infoCode : item.infoCode;
    } else if (curType === InfoPointDataType.INFO_CODE_TO_EQUIPS) {
        equipId = item.id;
        _infoCode = props.data.key;
    }
    // const { infoCode } = item;
    console.log(infocodes);
    if (_.isArray(infocodes) && equipId) {
        const jumpParams = infocodes.map(child => {
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
</script>
<style lang="less" scoped>
.group-info-name {
    width: 100%;
    line-height: 1.3333;
    color: #424c59;
    cursor: pointer;
    font-weight: 700;
}
.group-info-item {
    line-height: 1.66666;
    padding-bottom: 4px;
    align-items: center;
    gap: 8px;
    .item-val-newline {
        gap: 8px;
        .group-info-item-key {
            width: 100%;
        }
        .group-val-line {
            width: 1px;
            height: 24px;
            background: var(--gray-400, #c4c9cf);
        }
    }
    .item-val-newline {
        .group-info-item-key {
            max-width: 240px;
        }
    }
    .info-item:hover,
    .item-val-inline:hover {
        background: var(--Grey-Alpha-30, rgba(196, 201, 207, 0.3));
        color: var(--blue-500);
    }

    cursor: pointer;
    border-bottom: 1px solid #e1e5eb;
    .group-info-item-key {
        @include text-ellipsis;

        color: #626c78;
    }
    .group-info-item-value {
        @include text-ellipsis;
    }
    .group-info-item-val-inline {
    }
}
</style>
