<template>
    <div :class="{ header: true, 'is-tab-show': props.isTabShow }">
        <div class="header-left">
            <TitlePrefix v-if="props.isTabShow" :title="i18n.global.t('meos_control_web.abnormal_event_list')" :font-size="16" :line-height="22" />
            <span v-else v-ellipsis class="header-title">
                <span>{{ i18n.global.t('meos_control_web.abnormal_event_list') }}</span>
                <span v-if="props.showTotal">{{ `(${props.totalAmount})` }}</span>
            </span>
            <m-tips
                :content="`${i18n.global.t('meos_control_web.update_time_colon')} ${isEmpty(props.abnormalEventListUpdateTime)}`"
                theme="darkTransparent"
                placement="right-start"
                trigger="hover"
            >
                <div class="header-tips">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path
                            d="M6.4431 4.32357C6.4431 4.0014 6.70427 3.74023 7.02643 3.74023C7.3486 3.74023 7.60977 4.0014 7.60977 4.32357V7.75065C7.60977 8.07282 7.3486 8.33398 7.02643 8.33398C6.70427 8.33398 6.4431 8.07282 6.4431 7.75065V4.32357Z"
                            fill="#8B949E"
                        />
                        <path
                            d="M7.72982 9.53097C7.72982 9.93368 7.40336 10.2601 7.00065 10.2601C6.59794 10.2601 6.27148 9.93368 6.27148 9.53097C6.27148 9.12826 6.59794 8.8018 7.00065 8.8018C7.40336 8.8018 7.72982 9.12826 7.72982 9.53097Z"
                            fill="#8B949E"
                        />
                        <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M13.2206 6.57156C13.5384 6.51844 13.7529 6.21779 13.6998 5.90003C13.1618 2.68155 10.333 0.291748 6.99775 0.291748C3.67079 0.291748 0.846794 2.66988 0.299419 5.87808C0.245235 6.19566 0.458757 6.49703 0.776333 6.55121C1.09391 6.6054 1.39528 6.39187 1.44947 6.0743C1.90112 3.42711 4.23891 1.45841 6.99775 1.45841C9.76346 1.45841 12.1052 3.43674 12.5491 6.09238C12.6022 6.41014 12.9029 6.62467 13.2206 6.57156ZM0.778885 7.48276C0.461616 7.53872 0.249784 7.84128 0.305745 8.15855C0.868597 11.3496 3.68457 13.7084 6.99775 13.7084C10.3043 13.7084 13.1164 11.3589 13.6866 8.17616C13.7434 7.85904 13.5324 7.55591 13.2153 7.49909C12.8982 7.44227 12.5951 7.65328 12.5383 7.9704C12.0677 10.5967 9.73968 12.5417 6.99775 12.5417C4.25032 12.5417 1.91912 10.589 1.45468 7.9559C1.39872 7.63863 1.09615 7.4268 0.778885 7.48276Z"
                            fill="#1B2129"
                        />
                    </svg>
                </div>
            </m-tips>
        </div>
        <div v-if="!props?.hideFilter" class="header-right" :style="{ paddingRight: `${props.paddingRight}px` }">
            <m-select v-model="selectValue" class="select-ellipsis" :size="'auto'" :options="props.selectList" level="Right" :noborder="true"> </m-select>
        </div>
    </div>
</template>

<script setup>
import { isEmpty } from '@/utils/tools';
import { SORT_OPTIONS, SORT_OPTION_ENUM } from './config';
import TitlePrefix from '@/components/title-prefix/index.vue';
import i18n from '@/localization';

const props = defineProps({
    abnormalEventListUpdateTime: {
        type: String,
        default: null
    },
    showTotal: {
        type: Boolean,
        default: true
    },
    totalAmount: {
        type: Number,
        default: 0
    },
    selectList: {
        type: Array,
        default: () => SORT_OPTIONS
    },
    paddingRight: {
        type: Number,
        default: 16
    },
    hideFilter: {
        type: Boolean,
        default: false
    },
    isTabShow: {
        type: Boolean,
        default: false
    }
});

const selectValue = defineModel({ type: String, default: SORT_OPTION_ENUM.BY_LEVEL });
</script>

<style lang="less" scoped>
.header {
    width: 100%;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.is-tab-show {
    height: 28px;
}
.header-left {
    display: flex;
    align-items: center;
    column-gap: 4px;
    height: 22px;
    min-width: 0;
    flex-shrink: 0;
}
.header-title {
    display: inline-block;
    color: var(--gray-800, #2e3742);
    text-align: center;
    font-size: 16px;
    font-style: normal;
    font-weight: 700;
    line-height: 22px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
}
.header-tips {
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 100%;
    flex-shrink: 0;
}
.header-right {
    // position: relative;
    // height: 28px;
    flex: 1;
    min-width: 0;
    display: flex;
    justify-content: flex-end;
    :deep(.m-select),
    :deep(.m-select-wrap) {
        max-width: 100%;
    }
    .select-ellipsis {
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        :deep(.m-select-inner) {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
    }
}
</style>
