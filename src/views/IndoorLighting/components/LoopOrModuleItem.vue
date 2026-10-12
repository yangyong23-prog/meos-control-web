<template>
    <div class="fcol container w100" @mouseenter.stop="hoverItem()" @mouseleave.stop="unhoverItem()">
        <div class="main w100" :style="hasExpand ? 'cursor: pointer;' : ''" @click.stop="emits('openItem', data.id)">
            <div class="fcb left">
                <m-tips v-if="useCheck" :content="!enableInfo?.value ? enableInfo?.text || '' : ''" :disabled="enableInfo?.value" trigger="hover" theme="darkTransparent">
                    <m-checkbox class="checkbox" :disabled="!enableInfo?.value" :model-value="checked" @click="clickCheck"></m-checkbox>
                </m-tips>
                <div class="title-tags">
                    <div v-if="nameEllipsis" v-ellipsis class="m-ellipsis w100">
                        {{ data.localName ?? '--' }}
                    </div>
                    <div v-else class="w100">
                        {{ data.localName ?? '--' }}
                    </div>
                    <div v-if="curTagInfoList?.length > 0" class="tag-group">
                        <m-tag v-for="tag in curTagInfoList" :key="tag.name" class="info-tag" color="#FFFFFF" :bg-color="tag.color" size="small">{{ tag.name }} </m-tag>
                    </div>
                </div>
            </div>
            <div class="right">
                <div @mouseenter="e => detailTooltip.show(e)" @mouseleave="e => detailTooltip.hide()">
                    <div class="icon-link fcc bgc-hover" @click.stop="itemInfo(data)">
                        <SvgIcon name="detail" />
                    </div>
                </div>
                <div v-if="hasExpand" class="expand-icon" @click.stop="emits('openItem', data.id)">
                    <IconMeriComponentChevronDown v-if="isOpen" :size="16"></IconMeriComponentChevronDown>
                    <IconMeriComponentChevronUp v-else :size="16"></IconMeriComponentChevronUp>
                </div>
            </div>
        </div>
        <div v-if="isOpen" class="info-container">
            <div v-for="(obj, idx) in runningParameter" :key="idx" class="row">
                <div class="cell">
                    <div class="label">{{ obj.infoCodeName ?? '--' }}:</div>
                    <div class="val">{{ getIotShowValue(data?.id, obj.infoCode) }}</div>
                </div>
            </div>
            <div class="row">
                <div class="cell cell-first">
                    <div class="label">{{ i18n.global.t('meos_control_web.located_space') }}:</div>
                    <div v-ellipsis class="val m-ellipsis">
                        {{ data?.inSpaceName ?? '--' }}
                    </div>
                </div>
                <div class="cell cell-second">
                    <div class="label">{{ i18n.global.t('meos_control_web.related_control_module_colon') }}</div>
                    <div v-ellipsis class="val m-ellipsis">
                        {{ data?.relModuleName ?? '--' }}
                    </div>
                </div>
            </div>
            <div class="setting-row">
                <ControlSet
                    :info-codes="controlledParameterSet"
                    :object-id="data.id"
                    :set-conditions="controlledParameterSetCondition"
                    :custom-intervention-time="customInterventionTime"
                    show-data-source
                    show-reason
                    :show-info="false"
                    form-width="370px"
                ></ControlSet>
            </div>
        </div>
    </div>
</template>
<script setup>
import i18n from '@/localization';
import { IconMeriComponentChevronDown, IconMeriComponentChevronUp } from 'meri-icon';
import SvgIcon from '@/components/common/SvgIcon.vue';
import { openWebsite } from '@/utils/websiteNavigation';
import DockSingleton from '@/hooks/responsiveDock';
import { getAuthParamsString } from '@/utils/envUtils';
import { CLOUD_ORIGIN, MEOI_INSTANCE_DETAIL } from '@/config';
import useInfoTags from '@/hooks/useInfoTags';
import { getAbnormalIdsByModuleIdKey, loopIdMapInfoConfigsKey } from '../hooks/useBaseHook';
import { detailTooltipKey } from '../hooks/useDetailTips';
import useModuleTags from '../hooks/useModuleTags';
import { MODULE } from '../variables';
import ControlSet from '@/components/ObjectInfoComponents/ControlSet/index.vue';
import { INTERVENTION_TIME_V2 } from '@/components/ObjectInfoComponents/ControlForm/config';
import { getNextFiveMinutePoint } from '@/utils/tools';
import dayjs from 'dayjs';
import emitter from '@/utils/bus';

const { getIotShowValue } = DockSingleton.getInstance();
const props = defineProps({
    data: {
        type: Object,
        default: () => {}
    },
    enableInfo: {
        type: Object,
        default: () => {}
    },
    tagCodes: {
        type: Array,
        default: () => []
    },
    useCheck: {
        type: Boolean,
        default: true
    },
    // 是否开启回路hover联动
    useHoverLoopLinkage: {
        type: Boolean,
        default: false
    },
    checked: {
        type: String,
        default: 'uncheck'
    },
    hasExpand: {
        type: Boolean,
        default: true
    },
    hoverDetail: {
        type: Boolean,
        default: false
    },
    isOpen: {
        type: Boolean,
        default: false
    },
    nameEllipsis: {
        type: Boolean,
        default: true
    }
});
const loopIdMapInfoConfigs = inject(loopIdMapInfoConfigsKey);
const getAbnormalIdsByModuleId = inject(getAbnormalIdsByModuleIdKey);

const detailTooltip = inject(detailTooltipKey);
const { getModuleTagList } = useModuleTags(getAbnormalIdsByModuleId);
const curTagCodes = computed(() => {
    if (props.data && loopIdMapInfoConfigs?.value && loopIdMapInfoConfigs.value[props.data.id]) {
        const infoConfig = loopIdMapInfoConfigs.value[props.data.id];
        return infoConfig?.equipStatus?.map(obj => obj.infoCode);
    }
    return props.tagCodes || [];
});
const runningParameter = computed(() => {
    if (!props.hasExpand) return [];
    if (props.data && loopIdMapInfoConfigs?.value) {
        const infoConfig = loopIdMapInfoConfigs.value[props.data.id];
        return infoConfig?.runningParameter;
    }
    return [];
});
const controlledParameterSet = computed(() => {
    if (!props.hasExpand) return [];
    if (props.data && loopIdMapInfoConfigs?.value) {
        const infoConfig = loopIdMapInfoConfigs.value[props.data.id];
        return infoConfig?.controlledParameterSet;
    }
    return [];
});
const controlledParameterSetCondition = computed(() => {
    if (!props.hasExpand) return [];
    if (props.data && loopIdMapInfoConfigs?.value) {
        const infoConfig = loopIdMapInfoConfigs.value[props.data.id];
        return infoConfig?.controlledParameterSetCondition?.map(item => item.infoCode) || [];
    }
    return [];
});
const emits = defineEmits(['check', 'openItem']);
const { tagInfoList } = useInfoTags(props.data, curTagCodes);

const curTagInfoList = computed(() => {
    return props.data?.type === MODULE ? getModuleTagList(props.data?.id, curTagCodes.value) : tagInfoList?.value;
});
const customInterventionTime = formList => {
    if (formList) {
        const spoce = `${getNextFiveMinutePoint()}-${dayjs(getNextFiveMinutePoint()).add(1, 'year').format('YYYY.MM.DD HH:mm:00')}`;
        formList.push(
            INTERVENTION_TIME_V2(
                spoce,
                undefined,
                { scopeDisabledTipsText: i18n.global.t('meos_control_web.only_1_year_range_allowed') },
                {
                    useLongterm: false,
                    scopeDisabledTipsText: i18n.global.t('meos_control_web.only_1_year_range_allowed')
                }
            )
        );
    }
};
const clickCheck = (s, e) => {
    e.stopPropagation();
    e.preventDefault();
    emits('check', { id: props.data?.id, checked: props.checked });
};
const itemInfo = item => {
    if (!item?.id) return;
    openWebsite(MEOI_INSTANCE_DETAIL, {
        params: `objId=${item?.id}&${getAuthParamsString()}&f=MEOI_CatalogList&type=all`,
        newPage: true,
        origin: CLOUD_ORIGIN || ''
    });
};
const openDetail = () => {
    // console.log('props.hasExpand: ', props.hasExpand);
    if (props.hasExpand) {
        emits('openItem', props.data.id);
    }
};

const getLoopRelSpaceIds = () => {
    if (props.data?.type === MODULE) {
        return;
    }

    const spaceIds = Array.isArray(props.data?.relSpace) ? props.data?.relSpace?.map(item => item.id) : [];
    return spaceIds;
};
const hoverItem = () => {
    if (!props.useHoverLoopLinkage) return;
    const spaceIds = getLoopRelSpaceIds() || [];

    emitter.emit('relSpacesHover', spaceIds);
};
const unhoverItem = () => {
    if (!props.useHoverLoopLinkage) return;
    const spaceIds = getLoopRelSpaceIds() || [];
    emitter.emit('relSpacesUnHover', spaceIds);
};
onBeforeUnmount(() => {
    const spaceIds = getLoopRelSpaceIds() || [];
    if (props.useHoverLoopLinkage) {
        emitter.emit('relSpacesUnHover', spaceIds);
    }
});
</script>

<style lang="less" scoped>
.container {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    align-self: stretch;
    border-radius: 4px;
    border: 1px solid var(--gray-50, #f7f9fa);

    .main {
        display: flex;
        padding: 8px 12px;
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        border-radius: 4px;

        background: var(--gray-50, #f7f9fa);

        .tag-group {
            display: flex;
            align-items: flex-start;
            gap: 4px;
            .info-tag {
                font-weight: var(--platform-font-weight) !important;
                margin-left: 0px !important;
            }
        }

        .left {
            display: flex;
            overflow: hidden;
            // width: 274px;
            align-items: flex-start;
            // gap: 4px;
            .title-tags {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: flex-start;
                gap: 4px;
                overflow: hidden;
            }
            .checkbox {
                margin-top: 2px;
            }
        }
        .right {
            display: flex;

            justify-content: center;
            align-items: center;
            gap: 10px;
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
        .expand-icon {
            display: flex;
            width: 20px;
            height: 20px;
            justify-content: center;
            align-items: center;
            gap: 10px;
            cursor: pointer;
            &:hover {
                border-radius: 2px;
                background: var(--Grey-Alpha-30, rgba(196, 201, 207, 0.3));
            }
        }
    }

    &:hover {
        border: 1px solid var(--blue-500, #246fe5);
        background: var(--gray-50, #f7f9fa);
        .main {
            .bgc-hover {
                display: flex;
            }
        }
    }
    .info-container {
        width: 100%;
        display: flex;
        padding: 0px 12px;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        background: rgba(232, 236, 240, 0.7);

        .row,
        .setting-row {
            width: 100%;
            display: flex;
            justify-content: space-between;
            padding: 8px 0px 8px 24px;
        }
        .row {
            align-items: center;
            justify-content: flex-start;
            gap: 0px;
            border-bottom: 1px solid var(--gray-200, #e8ecf0);
        }
        .setting-row {
            padding: 0px 0px 0px 24px;
            flex-direction: column;
            align-items: flex-start;
            gap: 4px;
            :deep(.control-set) {
                width: 100%;
                flex-direction: column;
                align-items: flex-start;
                gap: 4px;
                .control-set-item {
                    padding: 8px 0;
                    border-bottom: 1px solid var(--gray-200, #e8ecf0);
                }
            }
        }
        .cell {
            display: flex;
            align-items: center;
            gap: 4px;
            overflow: hidden;
            font-size: 14px;
            font-style: normal;
            font-weight: 400;
            line-height: normal;
            .label {
                color: var(--gray-600, #626c78);
                white-space: nowrap;
            }
            .val {
                color: var(--gray-600, #1b2129);
            }
        }
        .cell-first {
            width: calc(50% - 18px);
        }
        .cell-second {
            flex: 1;
        }
        .op {
            display: flex;
            padding: 3px 4px;
            justify-content: center;
            align-items: center;
            color: var(--blue-600, #215dd9);
            text-align: center;
        }
    }
}
</style>
