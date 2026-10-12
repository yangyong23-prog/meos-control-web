<template>
    <div class="criterion-dropdown-btn">
        <m-popover
            v-if="showSpaceDetal"
            ref="popoverRef"
            :is-open="isOpen"
            :show-arrow="false"
            trigger="click"
            placement="bottom-start"
            class="criterion-dropdown-btn-wrap"
            width="280px"
            @show="fetchSpaceTree"
        >
            <div class="criterion-dropdown-btn-l">
                <span class="criterion-dropdown-btn-box">
                    <span class="criterion-dropdown-btn-num">{{ i18n.global.t('meos_control_web.certain_number', { count: item.num || item?.referenceSpace?.spaceTotal }) }} </span
                    ><span v-ellipsis class="criterion-dropdown-btn-title">{{ spaceTitle }}</span>
                </span>
                <IconMeriComponentChevronDown style="rotate: 270deg" />
            </div>
            <template #content>
                <div id="tree-loading" :style="{ minHeight: '100px' }">
                    <m-scrollbar ref="content" max-height="300px">
                        <m-tree v-if="spaceTreeData?.length" ref="tree" :virtual="true" :data="spaceTreeData" readonly :default-expand-all="true" last-stage> </m-tree>
                    </m-scrollbar>
                </div>
            </template>
        </m-popover>
        <div v-if="infocode" class="criterion-dropdown-btn-info">
            <div v-if="showSpaceDetal" class="divider" />
            <div class="criterion-dropdown-btn-text">
                <m-popover placement="top-start" :show-arrow="false" theme="darkTransparent">
                    <template #content>
                        <div class="criterion-dropdown-btn-info-popover-container">
                            <div class="weight white">{{ i18n.global.t('meos_control_web.temperature_scheduling') }}</div>
                            <div>
                                <span class="key">{{ i18n.global.t('meos_control_web.daily_scheduling_duration_colon') }}</span>
                                <span class="white">{{ item?.tdbQuality?.temperatureScheduledHourInDay || '--' }}{{ i18n.global.t('meos_control_web.hour') }}</span>
                            </div>
                            <div>
                                <span class="key">{{ i18n.global.t('meos_control_web.continuous_schedulable_duration_colon') }}</span>
                                <span class="white">{{ item?.tdbQuality?.temperatureContinuousScheduledHour || '--' }}{{ i18n.global.t('meos_control_web.hour') }}</span>
                            </div>
                            <div class="row">
                                <span class="key">{{ i18n.global.t('meos_control_web.non_dispatchable_period_colon') }}</span>
                                <div v-ellipsis :style="'color: #fff; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;'">
                                    {{ temperatureUnscheduledTimeRange }}
                                </div>
                            </div>
                            <div class="weight white">{{ i18n.global.t('meos_control_web.co2_dispatch') }}</div>
                            <div>
                                <span class="key">{{ i18n.global.t('meos_control_web.daily_scheduling_duration_colon') }}</span>
                                <span class="white">{{ item?.co2Quality?.carbonDioxideScheduledHourInDay || '--' }}{{ i18n.global.t('meos_control_web.hour') }}</span>
                            </div>
                            <div>
                                <span class="key">{{ i18n.global.t('meos_control_web.continuous_schedulable_duration_colon') }}</span>
                                <span class="white">{{ item?.co2Quality?.carbonDioxideContinuousScheduledHour || '--' }}{{ i18n.global.t('meos_control_web.hour') }}</span>
                            </div>
                            <div class="row">
                                <span class="key">{{ i18n.global.t('meos_control_web.non_dispatchable_period_colon') }}</span>
                                <div style="display: flex; flex-direction: row; flex-wrap: wrap; color: #ffffff" v-html="carbonDioxideUnscheduledTimeRange"></div>
                            </div>
                        </div>
                    </template>
                    <div class="fcc ocg-dropwown-btn-info">
                        {{ i18n.global.t('meos_control_web.view_dispatch') }}
                        <SvgIcon name="info-blue500" />
                    </div>
                </m-popover>
            </div>
        </div>
    </div>
</template>
<script setup>
import i18n from '@/localization';
import { IconMeriComponentChevronDown } from 'meri-icon';
import SvgIcon from '@/components/common/SvgIcon.vue';
import { transformTimesToView } from '@/views/operationCriterion/utils';
import { previewReferenceSpaceDetail } from '@/apis/operationCriterion';
import { MLoading } from 'meri-plus';
import { globalConfigKey } from '@/views/operationCriterion/constant';
const globalConfig = inject(globalConfigKey);
const props = defineProps({
    item: {
        type: Object,
        default: () => {}
    },
    spaceTitle: {
        type: String,
        default: ''
    }
});
const showSpaceDetal = computed(() => props.item.instanceType !== 'SPACE' && (props.item.num || props.item?.referenceSpace?.spaceTotal) > 0);
const temperatureUnscheduledTimeRange = computed(() => {
    if (props?.item && props?.item?.tdbQuality && props?.item?.tdbQuality?.temperatureUnscheduledTimeRange && props?.item?.tdbQuality?.temperatureUnscheduledTimeRange.length) {
        return transformTimesToView(props?.item?.tdbQuality?.temperatureUnscheduledTimeRange).join('  ');
    }
    return globalConfig.value.participateInScheduling !== 'NON_SCHEDULE' ? i18n.global.t('meos_control_web.all_day_schedulable') : '--';
});

const infocode = computed(() => {
    if (
        props.item &&
        (props.item?.tdbQuality?.temperatureScheduledHourInDay ||
            props.item?.tdbQuality?.temperatureContinuousScheduledHour ||
            props.item?.co2Quality?.carbonDioxideScheduledHourInDay ||
            props.item?.co2Quality?.carbonDioxideContinuousScheduledHour)
    ) {
        return true;
    }
    return false;
});

const carbonDioxideUnscheduledTimeRange = computed(() => {
    if (props?.item && props?.item?.co2Quality && props?.item?.co2Quality?.carbonDioxideUnscheduledTimeRange && props?.item?.co2Quality?.carbonDioxideUnscheduledTimeRange.length) {
        return transformTimesToView(props?.item?.co2Quality?.carbonDioxideUnscheduledTimeRange).join('&nbsp;&nbsp;');
    }
    return globalConfig.value.participateInScheduling !== 'NON_SCHEDULE' ? i18n.global.t('meos_control_web.all_day_schedulable') : '--';
});

const isOpen = ref(false);
const popoverRef = ref();
const content = ref();

const convertToTree = data => {
    const tree = {};
    data.forEach(item => {
        const { buildingId } = item;
        const { floorId } = item;
        const { spaceId } = item;

        if (!tree[buildingId]) {
            tree[buildingId] = {
                id: buildingId,
                name: item.buildingLocalName,
                children: []
            };
        }
        let buildingNode = tree[buildingId],
            floorFound = false;
        buildingNode.children.forEach(floor => {
            if (floor.id === floorId) {
                floorFound = true;
                if (!floor.children) {
                    floor.children = [];
                }
                floor.children.push({
                    id: spaceId,
                    name: item.spaceLocalName
                });
            }
        });
        if (!floorFound) {
            buildingNode.children.push({
                id: floorId,
                name: item.floorLocalName,
                children: [
                    {
                        id: spaceId,
                        name: item.spaceLocalName
                    }
                ]
            });
        }
    });

    return Object.values(tree);
};

const spaceTreeData = ref([]);

const fetchSpaceTree = () => {
    if (spaceTreeData.value.length > 0) return;
    const objIds = props.item?.referenceSpace?.objIds || props.item?.objects;
    //空间特殊营业时间
    const loadingInstance = MLoading.service({
        target: '#tree-loading',
        fullscreen: false,
        duration: 30000,
        lottieName: 'circle',
        background: 'transparent'
    });
    previewReferenceSpaceDetail({ objIds })
        .then(({ data }) => {
            loadingInstance?.destroy();
            spaceTreeData.value = convertToTree(data);
        })
        .catch(() => {
            loadingInstance?.destroy();
        });
};
onMounted(() => {
    window.addEventListener(
        'scroll',
        e => {
            if (popoverRef.value && e.target !== content?.value?.boxRef) {
                popoverRef.value.manuallyHide();
            }
        },
        true
    );
});
</script>
<style lang="less">
.criterion-dropdown-btn-wrap.m-popover.m-flexible-overlay {
    padding: 0;
    padding-top: 8px;
    .m-tree-node.is-notlast > .m-tree-node__content {
        color: var(--gray-900, #1b2129);
    }
}
.criterion-dropdown-btn {
    border-radius: 4px;
    cursor: pointer;
    width: 100%;
    display: flex;
    padding: 5px 8px;
    align-items: center;
    gap: 4px;
    align-self: stretch;
    background: linear-gradient(90deg, rgba(196, 201, 207, 0.3) 0%, rgba(196, 201, 207, 0) 100%);
    &:hover {
        border-radius: 4px;
        background: rgba(196, 201, 207, 0.6);
    }
    #tree-loading {
        min-height: 100px;
    }
    .criterion-dropdown-btn-l {
        display: flex;
        flex-direction: row;
        align-items: center;
        flex: 1;
        min-width: 0;
        .criterion-dropdown-btn-box {
            display: flex;
            align-items: center;
            overflow: hidden;
        }
    }
    .criterion-dropdown-btn-info {
        display: flex;
        flex-direction: row;
        align-items: center;
        .criterion-dropdown-btn-text {
            cursor: default;
        }
        .divider {
            width: 1px;
            height: 14px;
            border: 1px solid #c4c9cf;
            margin: 0 16px;
        }
        .ocg-dropwown-btn-info {
            color: @blue-500;
            font-size: 14px;
            font-style: normal;
            font-weight: var(--platform-font-weight);
            line-height: 18px; /* 128.571% */
            gap: 4px;
        }
    }
    span {
        color: var(--gray-800, #2e3742);
        font-size: 14px;
        font-style: normal;
        font-weight: var(--platform-font-weight);
        line-height: 22px;
        &.criterion-dropdown-btn-num {
            color: var(--blue-500, #246fe5);
            font-weight: 700;
            line-height: 22px;
        }
        &.criterion-dropdown-btn-title {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
    }
}
</style>
<style lang="less">
.criterion-dropdown-btn-info-popover-container {
    display: flex;
    flex-direction: column;
    gap: 4px;
    .key {
        color: #c4c9cf;
        white-space: nowrap;
    }
    .weight {
        font-weight: 700;
    }
    .white {
        color: #fff;
    }
    .row {
        display: flex;
        flex-direction: row;
    }
}
</style>
