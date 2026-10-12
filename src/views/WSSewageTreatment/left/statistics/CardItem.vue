<template>
    <slot></slot>
    <div class="card-content">
        <template v-if="loading">
            <m-list-skeleton :item-num="4" />
        </template>
        <template v-else-if="empty"></template>
        <template v-else>
            <div v-if="superHighCount || highCount" class="abnormal-container" @mouseenter="handleMouse(true)" @mouseleave="handleMouse(false)" @click="viewDetail">
                <m-button v-show="isHover && (superHighCount || highCount)" type="link" size="small" class="detail-btn" @click="viewDetail">{{
                    i18n.global.t('meos_control_web.details')
                }}</m-button>
                <template v-if="showHighLevel && superHighCount">
                    <AbnormalStatisticsItem icon-type="super-high" :count="superHighCount" />
                </template>
                <template v-if="highCount">
                    <AbnormalStatisticsItem icon-type="high" :count="highCount" />
                </template>
            </div>
            <div v-else class="normal-container" @click="viewDetail">
                <m-button v-show="isHover && (superHighCount || highCount)" type="link" size="small" class="detail-btn" @click="viewDetail">{{
                    i18n.global.t('meos_control_web.details')
                }}</m-button>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M17.25 9C17.25 13.5563 13.5563 17.25 9 17.25C4.44365 17.25 0.75 13.5563 0.75 9C0.75 4.44365 4.44365 0.75 9 0.75C13.5563 0.75 17.25 4.44365 17.25 9ZM7.21497 11.3034L8.27563 12.3641L13.5789 7.06075L12.5183 6.00009L8.27567 10.2427L6.06072 8.02775L5.00006 9.08841L7.21501 11.3034L7.21497 11.3034Z"
                        fill="#15AE55"
                    />
                </svg>
                <span>{{ i18n.global.t('meos_control_web.level_status_normal') }}</span>
            </div>

            <div class="f14 fw700 mb16 mt16 equip-total-count">{{ i18n.global.t('meos_control_web.device_statistics') }}</div>
            <div class="equips-statistics">
                <div class="left-container">
                    <div v-ellipsis class="count-num ffCustom-M">{{ totalCount ?? 0 }}</div>
                    <div v-ellipsis class="equip-name m-ellipsis">{{ title || '--' }}</div>
                </div>
                <div class="divider"></div>
                <div class="related-equips">
                    <div v-ellipsis class="count-num ffCustom-M m-ellipsis">{{ relatedCount ?? 0 }}</div>
                    <div v-ellipsis class="equip-name m-ellipsis">{{ i18n.global.t('common.submersible_sewage_pump') }}</div>
                </div>
                <div class="dynamic-data">
                    <div v-if="faultCount" class="ffCustom-M">
                        <m-tag color="#fff" bg-color="#FB9F1E" size="small" class="faults-tags" :has-prefix="true" @click="clickTagDetail" @click-prefix="clickTagDetail">
                            <div class="faults-tags-content">
                                <span>{{ i18n.global.t('meos_control_web.fault') }}</span>
                                <span class="faults-tags-content-num">{{ faultCount }}</span>
                                <span>{{ i18n.global.t('common.unit') }}</span>
                            </div>
                            <template #prefix>
                                <Right />
                            </template>
                        </m-tag>
                    </div>
                    <div v-ellipsis class="status-name m-ellipsis">
                        {{ i18n.global.t('common.status_open') }}:<span class="status-value">{{ statusData[0] }}</span> {{ i18n.global.t('meos_control_web.close_colon')
                        }}<span class="status-value">{{ statusData[1] }}</span> {{ i18n.global.t('meos_control_web.no_data1') }}:<span class="status-value">{{
                            statusData[2]
                        }}</span>
                    </div>
                </div>
            </div>
        </template>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import AbnormalStatisticsItem from './AbnormalStatisticsItem.vue';
import { EQUIP_CLASS_CODE_ENUM } from '../../variables';
import Right from '@/assets/svg/down.svg';

const props = defineProps({
    title: {
        type: String,
        default: ''
    },
    loading: {
        type: Boolean,
        default: false
    },
    empty: {
        type: Boolean,
        default: false
    },
    type: {
        type: String,
        default: ''
    },
    hideEquipIcon: {
        type: Boolean,
        default: false
    },
    abnormalCount: {
        type: Number,
        default: 0
    },
    superHighCount: {
        type: Number,
        default: 0
    },
    highCount: {
        type: Number,
        default: 0
    },
    faultCount: {
        type: Number,
        default: 0
    },
    totalCount: {
        type: Number,
        default: 0
    },
    relatedCount: {
        type: Number,
        default: 0
    },
    statusData: {
        type: Array,
        default: () => [0, 0, 0]
    }
});

// const showHighLevel = computed(() => props?.type === EQUIP_CLASS_CODE_ENUM.COLLECTING_SUMP);
const showHighLevel = computed(() => [EQUIP_CLASS_CODE_ENUM.COLLECTING_SUMP, EQUIP_CLASS_CODE_ENUM.OIL_WATER_LIFT_UNIT].includes(props.type));

const isHover = ref(false);
const emits = defineEmits(['view-liquid-level', 'view-fault-list']);

const handleMouse = flag => {
    isHover.value = flag;
};

const viewDetail = () => {
    emits('view-liquid-level', props);
};
const clickTagDetail = () => {
    emits('view-fault-list', props);
};
</script>

<style lang="less" scoped>
.card-content {
    width: 100%;

    .abnormal-container {
        display: flex;
        align-items: center;
        column-gap: 32px;
        height: 90px;
        padding: 20px;
        border-radius: 4px;
        background: linear-gradient(90deg, rgba(255, 166, 63, 0.16) 0%, rgba(255, 166, 63, 0.04) 100%);
        cursor: pointer;
        position: relative;

        &:hover {
            background: linear-gradient(90deg, rgba(255, 166, 63, 0.24) 0%, rgba(255, 166, 63, 0.12) 100%);
        }
    }

    .normal-container {
        display: flex;
        justify-content: center;
        align-items: center;
        column-gap: 4px;
        height: 90px;
        padding: 16px 24px;
        border-radius: 4px;
        background: linear-gradient(90deg, rgba(60, 199, 120, 0.08) 0%, rgba(60, 199, 120, 0.02) 100%);
        cursor: default;
        position: relative;

        color: @green-800;
        font-size: 14px;
        font-style: normal;
        font-weight: 700;
        line-height: 22px;

        // &:hover {
        //     background: linear-gradient(90deg, rgba(60, 199, 120, 0.24) 0%, rgba(60, 199, 120, 0.12) 100%);
        // }
    }

    .detail-btn {
        position: absolute;
        right: 4px;
        top: 4px;
    }
}
.equip-total-count {
    line-height: 22px;
}
.equips-statistics {
    display: flex;
    align-items: flex-end;
    gap: 12px;
    width: 100%;
    .left-container {
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        min-width: 48px;
    }

    .divider {
        width: 1px;
        align-self: stretch;
        flex-shrink: 0;
        display: flex;
        background-color: var(--gray-300);
    }

    .related-equips {
        min-width: 48px;
        flex-grow: 1;
        display: flex;
        flex-direction: column;
    }

    .dynamic-data {
        display: flex;
        flex-direction: column;
        height: 100%;
        gap: 10px;
        flex-basis: auto;
        flex-grow: 1;
        flex-shrink: 1;
        max-width: calc(100% - 133px);
    }

    .equip-icon {
        display: flex;
        width: 32px;
        height: 32px;
        padding: 4px;
        justify-content: center;
        align-items: center;
        border-radius: 5.333px;
        background: @grey-300;
        margin-bottom: 16px;
    }

    .count-num {
        color: @grey-800;
        font-size: 18px;
        font-style: normal;
        font-weight: 600;
        margin-bottom: 8px;
    }

    .equip-name {
        max-width: 70px;
    }
    .faults-tags.m-tag {
        cursor: pointer;
        .faults-tags-content {
            gap: 2px;
            display: flex;
            align-items: center;
            flex-direction: row;
        }
        :deep .m-tag__prefix {
            margin-left: 2px;
        }
        &:hover {
            background-color: #ec8a00;
        }
    }

    .equip-name,
    .status-name {
        color: @grey-600;
        font-size: 14px;
        display: block;
        width: 100%;
        max-width: 100%;
        user-select: none;
        flex-direction: row;
        align-items: center;
        font-style: normal;
        font-weight: var(--platform-font-weight);
        white-space: nowrap;
        .status-value {
            font-weight: 600;
            color: @grey-800;
            font-family: 'PersagyMedium';
            margin-right: 4px;
        }
    }
}
</style>
