<template>
    <Panel
        :label="i18n.global.t('meos_control_web.basic_info')"
        target=".operation-criterion-panel"
        :loading="current === 1 && pageLoading"
        :class="{ 'operation-criterion-panel': true, 'no-expand': !showExpand }"
    >
        <div class="operation-criterion-panel-header">
            <div class="operation-panel-header-data">
                <span class="operation-panel-header-data-label">{{ i18n.global.t('meos_control_web.date_type_colon') }}</span>
                <span class="operation-panel-header-data-value"> {{ calendarTagsRef }} </span>
            </div>
            <div class="operation-panel-header-divider"></div>
            <div
                class="operation-panel-header-data"
                :style="'overflow: hidden'"
            >
                <span class="operation-panel-header-data-label">{{ i18n.global.t('meos_control_web.project_business_hours') }}</span>
                <div
                    v-ellipsis
                    class="operation-panel-header-data-value m-ellipsis"
                    v-html="operatingTimeRef"
                ></div>
            </div>
        </div>
        <HorizontalBar
            v-if="customConfigCountRef"
            :num="`${customConfigCountRef}`"
            :info="i18n.global.t('meos_control_web.business_hours')"
        />
        <ExpandablePanel
            v-if="customConfigCountRef"
            class="operation-baseinfo-expandable"
            :default-height="132"
            :max-height="700"
            :show-expand="showExpand"
            @expand="
                v => {
                    expandRef = v;
                }
            "
        >
            <div>
                <div class="baseinfo-card-container">
                    <baseInfoCard
                        v-for="(item, index) in data"
                        :key="index"
                        :item="item"
                        :show-extra="true"
                    ></baseInfoCard>
                </div>
                <div
                    v-if="!noMoreData && expandRef"
                    class="loadmore"
                >
                    <m-button
                        id="operation-criterion-load-more-btn"
                        type="link"
                        size="medium"
                        :loading="pageLoading"
                        @click="fetchData"
                        >{{ i18n.global.t('meos_control_web.click_load_more') }}</m-button
                    >
                </div>
            </div>
        </ExpandablePanel>
    </Panel>
</template>
<script setup>
import i18n from '@/localization';
import Panel from '../common/panel.vue';
import HorizontalBar from '../common/horizontalBar.vue';
import ExpandablePanel from '../common/ExpandablePanel.vue';
import baseInfoCard from './baseInfoCard.vue';
import { currentDateKey, CalendarTagsBaseMap } from '@/views/operationCriterion/constant';
import { compact } from 'lodash';
import { previewProjectBusinessTime, specialBusinessTimeQuoteCount } from '@/apis/operationCriterion';
import usePage from '@/hooks/usePage';

const currentDate = inject(currentDateKey);
const customConfigCountRef = ref(0);
const expandRef = ref(false);
const calendarTagsRef = ref('--');
const operatingTimeRef = ref('--');

onMounted(() => {
    fetchData({ fresh: true });
});

watch(
    () => currentDate.value,
    () => {
        fetchData({ fresh: true });
    }
);

const screenWidth = ref(window.innerWidth);
const showExpand = computed(() => {
    if (screenWidth.value) {
        if (data.value.length >= (screenWidth.value - 6 - 48 - 56 - 8 * (data.value.length - 1)) / 251) {
            return true && screenWidth.value;
        }
    }
    return false && screenWidth.value;
});
const resizeWindow = () => {
    screenWidth.value = document.documentElement.clientWidth;
};
onMounted(() => {
    window.addEventListener('resize', resizeWindow);
});

onBeforeUnmount(() => {
    window.removeEventListener('resize', resizeWindow);
});

const request = async param => {
    const {
        data: { customConfig, customConfigCount, calendarTags, businessTimeRange }
    } = await previewProjectBusinessTime({ workDate: currentDate.value, ...param });
    customConfigCountRef.value = customConfigCount;
    if (calendarTags && calendarTags.length) {
        calendarTagsRef.value = compact(calendarTags.map(tag => CalendarTagsBaseMap[tag])).join('、');
    } else {
        calendarTagsRef.value = '--';
    }
    if (businessTimeRange && businessTimeRange.length) {
        const replaceString = typeof businessTimeRange[0] === 'string' ? businessTimeRange[0].replace('23:59', '24:00') : '';
        operatingTimeRef.value =
            businessTimeRange.length === 1 && businessTimeRange[0] === '00:00-23:59' ? i18n.global.t('meos_control_web.all_day') : replaceString + '&nbsp; &nbsp;';
    } else {
        operatingTimeRef.value = i18n.global.t('meos_control_web.closed');
    }
    const objects = [];

    customConfig.map(({ id, objectType }) => {
        if (objectType !== 'space') {
            objects.push({ objectType, objectId: id });
        }
    });
    const { data, total } = await specialBusinessTimeQuoteCount({ workDate: currentDate.value, objects });
    const idInfo = {};
    customConfig.forEach(d => {
        d.timeRange = d.businessTimeRange;
        idInfo[d.id] = d;
    });
    data.forEach(d => {
        idInfo[d.objectId] = { ...idInfo[d.objectId], ...d };
    });

    return { records: Object.values(idInfo), total: customConfigCount, current: param.page };
};

const { fetchData, data, loading: pageLoading, noData, current, noMoreData } = usePage({ request, pageSize: 20 });
</script>
<style lang="less">
#operation-criterion-load-more-btn {
    svg {
        path {
            fill: #626c78;
        }
    }
    .m-button-span-text {
        color: @grey-900;
        font-size: 14px;
        font-style: normal;
        font-weight: var(--platform-font-weight);
    }
}
</style>
<style lang="less">
#operation-criterion-load-more-btn {
    svg {
        path {
            fill: #626c78;
        }
    }
    .m-button-span-text {
        color: @grey-900;
        font-size: 14px;
        font-style: normal;
        font-weight: var(--platform-font-weight);
    }
}
</style>
<style lang="less" scoped>
.operation-criterion-panel {
    --panel-padding-horizonal: 28px;
    padding-top: 32px;
    flex-direction: column;
    justify-content: flex-start;
    gap: 20px;
    min-height: 88px;
    &.no-expand {
        padding-bottom: 0px;
    }
    .operation-criterion-panel-header {
        display: flex;
        flex-direction: row;
        width: 100%;
        gap: 24px;
        align-items: center;
        .operation-panel-header-data {
            display: flex;
            flex-direction: row;
            align-items: center;
            position: relative;
            gap: 8px;
            flex-grow: 0;
            .operation-panel-header-data-label {
                color: var(--gray-600, #626c78);
                font-size: 16px;
                font-style: normal;
                font-weight: var(--platform-font-weight);
                line-height: 22px; /* 137.5% */
            }
            .operation-panel-header-data-value {
                color: var(--gray-700, #424c59);
                font-size: 18px;
                font-style: normal;
                display: inline-block;
                font-weight: 700;
                line-height: 22px; /* 122.222% */
            }
        }
        .operation-panel-header-divider {
            width: 1px;
            height: 14px;
            background: var(--gray-400, #c4c9cf);
            display: flex;
        }
    }
}
.operation-baseinfo-expandable {
    width: 100%;
    .baseinfo-card-container {
        display: grid;
        width: 100%;
        gap: 8px;
        padding-bottom: 24px;
        grid-template-columns: repeat(auto-fill, 251px);
    }
    .loadmore {
        width: 100%;
        height: 60px;
        display: flex;
        flex-direction: row;
        justify-content: center;
    }
    .loadmore {
        width: 100%;
        height: 60px;
        display: flex;
        flex-direction: row;
        justify-content: center;
    }
}
</style>
