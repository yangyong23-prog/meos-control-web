<template>
    <div>
        <div class="value-sel-item-container" :class="{ [infoView.typeCss]: true, selected: selected, edit: isEdit, detail: !isEdit }" @click="selItem">
            <div class="header">
                <div class="left">
                    <component :is="infoView.icon"></component>
                    <div v-ellipsis class="left-title" :style="{ color: infoView.titleColor }">{{ infoView.title }}</div>
                </div>
                <m-button v-show="code !== VALUE_SELECTION_CODE.QUALITY_FIRST" class="btn-config" type="link" @click="openConfigUse">{{
                    i18n.global.t('meos_control_web.configuration')
                }}</m-button>
            </div>
            <div class="desc" d>{{ infoView.desc }}</div>
            <svg class="sel-icon" width="27" height="19" viewBox="0 0 27 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g id="Frame 1937105698">
                    <path name="bg" d="M0 4C0 1.79086 1.79086 0 4 0H27V15C27 17.2091 25.2091 19 23 19H0V4Z" fill="#F29F00" />
                    <path id="Rectangle 26" d="M12.2236 10.9127L16.9744 6.1619L18.0351 7.22256L12.2236 13.034L9.00106 9.81144L10.0617 8.75078L12.2236 10.9127Z" fill="white" />
                </g>
            </svg>
        </div>
        <ConfigUse v-if="showConfigUse" :active-config="activeConfig" :template-type="templateType" :template-id="templateId" @close="configUseClose" />
    </div>
</template>

<script setup>
import i18n from '@/localization';
import LowCostIcon from '@/assets/svg/demand-management/ac/value_low_cost.svg';
import LowEnergyIcon from '@/assets/svg/demand-management/ac/value_low_energy.svg';
import LowCarbonIcon from '@/assets/svg/demand-management/ac/value_low_carbon.svg';
import BestQualityIcon from '@/assets/svg/demand-management/ac/value_best_quality.svg';
import { baseColors } from '@/constants/baseColors';
import ConfigUse from './Config/index.vue';
import { VALUE_SELECTION_CODE } from '@/views/DemandManagementHome/constant/ac';
import { templateIdInjectKey } from '@/views/DemandManagementHome/constant/injectKey';
const props = defineProps({
    isEdit: {
        type: Boolean,
        default: false
    },
    selected: {
        type: Boolean,
        default: false
    },
    code: {
        type: String,
        default: ''
    }
});
const emits = defineEmits(['selectItem']);

const templateType = inject('templateType');
const templateId = inject(templateIdInjectKey);

const showConfigUse = ref(false);
const activeConfig = ref();

const TYPE_VIEW_OBJS = {
    // eslint-disable-next-line camelcase
    value_select_lowest_cast: {
        icon: LowCostIcon,
        title: i18n.global.t('meos_control_web.lowest_cost'),
        titleColor: baseColors['$orange-700'],
        typeCss: 'cast',
        desc: i18n.global.t('meos_control_web.lower_temp_when_tariff_low_higher_when_high')
    },
    // eslint-disable-next-line camelcase
    value_select_Lowest_carbon_emissions: {
        icon: LowCarbonIcon,
        title: i18n.global.t('meos_control_web.lowest_carbon_emission'),
        titleColor: baseColors['$green-700'],
        typeCss: 'carbon',
        desc: i18n.global.t('meos_control_web.carbon_factor_temp_adjust')
    },
    // eslint-disable-next-line camelcase
    value_select_lowest_energy: {
        icon: LowEnergyIcon,
        title: i18n.global.t('meos_control_web.min_energy_consumption'),
        titleColor: baseColors['$blue-600'],
        typeCss: 'energy',
        desc: i18n.global.t('meos_control_web.value_select_lowest_energy_desc')
    },
    // eslint-disable-next-line camelcase
    value_select_quality_first: {
        icon: BestQualityIcon,
        title: i18n.global.t('meos_control_web.optimal_quality'),
        titleColor: baseColors['$turquoise-700'],
        typeCss: 'quality',
        desc: i18n.global.t('meos_control_web.value_select_quality_first_desc')
    }
};
const infoView = computed(() => {
    if (!props.code) {
        return {};
    }
    return TYPE_VIEW_OBJS[props.code];
});
const configUseClose = () => {
    showConfigUse.value = false;
    // currentApplyConfig()
};
const openConfigUse = () => {
    const obj = TYPE_VIEW_OBJS[props.code];
    activeConfig.value = { id: props.code, name: obj?.title };
    showConfigUse.value = true;
};
const selItem = () => {
    emits('selectItem', { code: props.code });
};
</script>

<style lang="less" scoped>
.value-sel-item-container {
    position: relative;
    display: flex;
    width: 262px;
    padding: 12px 20px;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;

    border-radius: 4px;
    background: var(--Gray-100, #f1f4f6);
    border: 1.5px solid #fff;

    .btn-config {
        display: none;
    }
    &.edit {
        cursor: pointer;
        &:hover {
            &:not(.quality) {
                .left-title {
                    display: -webkit-box;
                    -webkit-line-clamp: 1;
                    -webkit-box-orient: vertical;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    max-width: 102px;
                }
            }
            .btn-config {
                display: block;
            }
        }
    }

    .sel-icon {
        position: absolute;
        right: 0;
        bottom: 0;
        display: none;
    }

    &.cast {
        &.detail,
        &.edit:hover {
            background: #fff3e3;
        }
        &.selected {
            border: 1.5px solid var(--orange-600, #f29f00);
            background: #fff3e3;
            .sel-icon {
                display: block;
                *[name='bg'] {
                    fill: #f29f00;
                }
            }
        }
    }

    &.carbon {
        &.detail,
        &.edit:hover {
            background: #e0ffec;
        }
        &.selected {
            border: 1.5px solid #09b512;
            background: #e0ffec;
            .sel-icon {
                display: block;
                *[name='bg'] {
                    fill: #09b512;
                }
            }
        }
    }
    &.energy {
        &.detail,
        &.edit:hover {
            background: #e0edff;
        }
        &.selected {
            border: 1.5px solid #246fe5;
            background: #e0edff;
            .sel-icon {
                display: block;
                *[name='bg'] {
                    fill: #246fe5;
                }
            }
        }
    }
    &.quality {
        &.detail,
        &.edit:hover {
            background: #d0fdfd;
        }
        &.selected {
            border: 1.5px solid #09b3b5;
            background: #d0fdfd;
            .sel-icon {
                display: block;
                *[name='bg'] {
                    fill: #09b3b5;
                }
            }
        }
    }

    .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        align-self: stretch;
        height: 22px;
        .left {
            display: flex;
            align-items: center;
            gap: 6px;
            font-size: 14px;
            font-style: normal;
            font-weight: 700;
            line-height: 22px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            svg {
                min-width: 20px;
                min-height: auto;
            }
            .left-title {
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
        }
    }
    .desc {
        color: var(--Gray-500, #8b949e);
        font-size: 14px;
        font-style: normal;
        font-weight: var(--platform-font-weight);
        line-height: 18px;
    }
}
</style>
