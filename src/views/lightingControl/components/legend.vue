<template>
    <div class="legend-wrap">
        <template v-if="publicControlVisible">
            <template v-if="currentTabs === 'openCloseStatus'">
                <span class="legend-category-name">{{ i18n.global.t('meos_control_web.lighting_switch_colon') }}</span>
                <div v-for="(item, index) in pubSwitchData" :key="index" class="switch legend-item">
                    <i class="mark" :style="{ background: item.color }"></i><span class="legend-name">{{ item.name }}</span>
                </div>
                <template v-if="curFloorId">
                    <div class="divide"></div>
                    <div v-for="(item, index) in publicControlData" :key="index" class="switch legend-item">
                        <span class="mark" :style="{ background: item.color }">N</span><span class="legend-name">{{ item.name }}</span>
                    </div>
                    <!-- <div v-if="showFeedbackAdjustment" class="legend-item">
                        <div class="legend-icon"><component :is="FeedbackAdjustmentIcon" /></div>
                        <span class="legend-name">{{ i18n.global.t('meos_control_web.feedback_adjustment') }}</span>
                    </div> -->
                </template>
            </template>
            <template v-else-if="currentTabs === 'abnormalStatus'">
                <span class="legend-category-name">{{ i18n.global.t('meos_control_web.space_status_colon') }}</span>
                <div v-for="(item, index) in pubAbnormalData" :key="index" class="switch legend-item">
                    <i class="mark" :style="{ background: item.color }"></i><span class="legend-name">{{ item.name }}</span>
                </div>
                <template v-if="curFloorId">
                    <div class="divide"></div>
                    <div v-for="(item, index) in publicControlData" :key="index" class="switch legend-item">
                        <span class="mark" :style="{ background: item.color }">N</span><span class="legend-name">{{ item.name }}</span>
                    </div>
                </template>
            </template>
            <template v-else>
                <span class="legend-category-name">{{ i18n.global.t('meos_control_web.intervened_space_colon') }}</span>
                <div v-for="(item, index) in pubIntervenedData" :key="index" class="switch legend-item">
                    <i class="mark" :style="{ background: item.color }"></i><span class="legend-name">{{ item.name }}</span>
                </div>
                <template v-if="curFloorId">
                    <div class="divide"></div>
                    <div v-for="(item, index) in publicControlData" :key="index" class="switch legend-item">
                        <span class="mark" :style="{ background: item.color }">N</span><span class="legend-name">{{ item.name }}</span>
                    </div>
                </template>
            </template>
        </template>
        <template v-else>
            <template v-if="currentTabs === 'openCloseStatus'">
                <div v-for="(item, index) in legendObjElse.switchData" :key="index" class="switch legend-item">
                    <i class="mark" :style="{ background: item.color }"></i><span class="legend-name">{{ item.name }}</span>
                </div></template
            >
            <template v-if="currentTabs === 'abnormalStatus'">
                <div v-for="(item, index) in legendObjElse.abnormalData" :key="index + 'e'" class="switch legend-item">
                    <i class="mark" :style="{ background: item.color }"></i><span class="legend-name">{{ item.name }}</span>
                </div></template
            >
            <template v-if="currentTabs === 'intervened'">
                <div v-for="(item, index) in legendObjElse.intervenedData" :key="index + 'o'" class="switch legend-item">
                    <i class="mark" :style="{ background: item.color }"></i><span class="legend-name">{{ item.name }}</span>
                </div></template
            >
        </template>
    </div>
</template>
<script setup>
import FeedbackAdjustmentIcon from '@/assets/svg/feedbackAdjustment.svg';
import i18n from '@/localization';

const curFloorId = inject('curFloorId');
const currentTabs = inject('currentTabs');
const publicControlVisible = inject('publicControlVisible');
const showSpaceInfo = inject('showSpaceInfo', ref(false));
const templateType = inject('templateType');

const showFeedbackAdjustment = computed(() => templateType?.value === 'PUBLIC_AREA_LIGHTING');

const pubSwitchData = [
    {
        name: i18n.global.t('meos_control_web.all_off'),
        color: '#BBC1C8'
    },
    {
        name: i18n.global.t('meos_control_web.all_on'),
        color: '#EDD4A1'
    },
    {
        name: i18n.global.t('meos_control_web.partial_on'),
        color: '#AC9777'
    }
];

const pubAbnormalData = computed(() => {
    if (showSpaceInfo.value) {
        return [
            {
                name: i18n.global.t('meos_control_web.abnormal'),
                color: '#F0ABA8'
            },
            {
                name: i18n.global.t('meos_control_web.normal'),
                color: '#B0D7C0'
            }
        ];
    } else {
        return [
            {
                name: i18n.global.t('meos_control_web.abnormal'),
                color: '#F0ABA8'
            }
        ];
    }
});

const pubIntervenedData = computed(() => {
    if (showSpaceInfo.value) {
        return [
            {
                name: i18n.global.t('meos_control_web.manual_intervention_demand'),
                color: '#B3AEDB'
            },
            {
                name: i18n.global.t('meos_control_web.spaces_linked_to_intervened_equipment'),
                color: '#EDD4A1'
            },
            {
                name: i18n.global.t('meos_control_web.no_intervention1'),
                color: '#BBC1C8'
            }
        ];
    } else {
        return [
            {
                name: i18n.global.t('meos_control_web.manual_intervention_demand'),
                color: '#B3AEDB'
            },
            {
                name: i18n.global.t('meos_control_web.spaces_linked_to_intervened_equipment'),
                color: '#EDD4A1'
            }
        ];
    }
});

const publicControlData = [
    {
        name: i18n.global.t('meos_control_web.control_module_count'),
        color: '#424C59'
    }
];

// 夜景照明用
const legendObjElse = {
    switchData: [
        {
            name: i18n.global.t('meos_control_web.on'),
            color: '#F2CB0C'
        },
        {
            name: i18n.global.t('meos_control_web.off'),
            color: '#727E99'
        }
    ],
    abnormalData: [
        {
            name: i18n.global.t('meos_control_web.abnormal'),
            color: '#F55047'
        },
        {
            name: i18n.global.t('meos_control_web.normal'),
            color: '#727E99'
        }
    ],
    intervenedData: [
        {
            name: i18n.global.t('meos_control_web.has_intervention'),
            color: '#9B6CED'
        },
        {
            name: i18n.global.t('meos_control_web.no_intervention1'),
            color: '#727E99'
        }
    ]
};
</script>
<style lang="less">
.legend-wrap {
    max-width: calc(100% - 85px);
    width: max-content;
    display: flex;
    align-items: center;
    padding: 11px 16px;
    background: linear-gradient(180deg, #e1e7ee 0%, #d6dde5 100%);
    border-radius: 4px 4px 0px 0px;
    flex-wrap: wrap;
    row-gap: 8px;
    font-size: 12px;
    white-space: nowrap;

    &.SYSTEM_GRAPH {
        background: @legend-system-bg;
    }

    &.WHOLO_BUILD_GRAPH,
    &.FLOOR_GRAPH {
        background: @legend-floor-bg;
    }

    &.SPACE_3D_GRAPH {
        background: @legend-space-3d-bg;

        .legend-category-name {
            color: @grey-100;
        }

        .legend-name {
            color: @grey-400;
        }
    }

    .legend-category-name {
        font-weight: 700;
    }

    .legend-item {
        display: flex;
        align-items: center;
        margin-right: 12px;

        &:last-child {
            margin-right: 0;
        }
    }

    .legend-name {
        color: @grey-600;
    }

    .divide {
        width: 1px;
        height: 14px;
        background: @grey-400;
        margin: 0 14px 0 2px;
    }

    .pipeline .mark {
        display: inline-block;
        width: 12px;
        height: 5px;
        margin-right: 4px;
        border-radius: 1px;
        border: 1px solid #fff;
    }

    .switch .mark {
        width: 14px;
        height: 14px;
        margin-right: 4px;
        border-radius: 2px;
        color: #ffffff;
        font-size: 10px;
        font-weight: 700;
        text-align: center;
        line-height: 14px;
    }
}

.legend-icon {
    display: flex;
    align-items: center;
    justify-content: center;

    width: 14px;
    height: 14px;
    margin-right: 4px;

    border-radius: 2px;
    color: #ffffff;
    font-size: 10px;
    font-weight: 700;
    text-align: center;
    line-height: 14px;
}
</style>
