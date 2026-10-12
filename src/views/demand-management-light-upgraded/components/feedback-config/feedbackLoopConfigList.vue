<template>
    <div class="feedback-loop-config-list-container" :style="{ '--is-preview-gap': props.isPreview ? '0px' : '12px' }">
        <m-collapse v-model="spaceFuncTypeCollapsedIds[props.spaceId]" class="collapse-container" :hover-style="true" icon-position="left">
            <template v-for="(rowItem, index) in collapseDataList" :key="`${props.spaceId}-${rowItem.id}`">
                <m-collapse-item :id="`${props.spaceId}-${rowItem.id}`">
                    <template #title>
                        <div class="collapse-item-title-wrap">
                            <div class="collapse-item-row">
                                <div class="collapse-left">
                                    <span> {{ rowItem?.name }}</span>
                                    <StatisticsCount
                                        :with-gap="false"
                                        :with-feed-back="rowItem.id === GENERAL_LIGHTING_FUNC_TYPE"
                                        :with-hight-light="true"
                                        :feedback-count="rowItem.feedbackCount"
                                        :un-config-count="rowItem.unConfigCount"
                                        :total="rowItem.total"
                                        :open-count="rowItem.openCount"
                                    />
                                </div>
                                <div class="collapse-right">
                                    <template v-if="props.isPreview">
                                        <template v-if="rowItem.id !== GENERAL_LIGHTING_FUNC_TYPE">
                                            <m-tag v-if="rowItem.settingMode === SMD_ALL_OPEN" color="#E68600" bg-color="#FFF0CC">
                                                {{ i18n.global.t('meos_control_web.fully_on') }}
                                            </m-tag>
                                            <m-tag v-if="rowItem.settingMode === SMD_ALL_CLOSE" color="#626C78" bg-color="#E8ECF0">
                                                {{ i18n.global.t('meos_control_web.fully_off') }}
                                            </m-tag>
                                            <m-tag v-if="rowItem.settingMode === SMD_PARTIAL_OPEN" color="#D72824" bg-color="#FFE6E5">
                                                {{ i18n.global.t('meos_control_web.partial_on') }}
                                            </m-tag>
                                            <m-tag v-if="rowItem.settingMode === NOT_CONFIGURED || !rowItem.settingMode" color="#626C78" bg-color="#E8ECF0">
                                                {{ i18n.global.t('meos_control_web.unconfiged') }}
                                            </m-tag>
                                        </template>
                                    </template>
                                    <div v-else class="op-warp" @click.stop="evet => {}">
                                        <template v-if="rowItem.id !== GENERAL_LIGHTING_FUNC_TYPE">
                                            <div class="btn-item" :class="{ act: rowItem.settingMode === SMD_ALL_OPEN }" @click.stop="switchMode(rowItem, SMD_ALL_OPEN)">
                                                {{ i18n.global.t('meos_control_web.fully_on') }}
                                            </div>
                                            <div class="btn-item" :class="{ act: rowItem.settingMode === SMD_ALL_CLOSE }" @click.stop="switchMode(rowItem, SMD_ALL_CLOSE)">
                                                {{ i18n.global.t('meos_control_web.fully_off') }}
                                            </div>
                                            <div
                                                class="btn-item part-open"
                                                :class="{ act: rowItem.settingMode === SMD_PARTIAL_OPEN }"
                                                @click.stop="switchMode(rowItem, SMD_PARTIAL_OPEN)"
                                            >
                                                <span>{{ i18n.global.t('meos_control_web.partial_on') }}</span>
                                                <svg class="right-arrow" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                                                    <path
                                                        fill-rule="evenodd"
                                                        clip-rule="evenodd"
                                                        d="M6.16931 13.3083C5.9312 13.0654 5.94604 12.6858 6.20247 12.4603L10.1377 9L6.20247 5.53968C5.94604 5.3142 5.9312 4.93456 6.16931 4.69173C6.40742 4.44891 6.80832 4.43485 7.06475 4.66033L12 9L7.06475 13.3397C6.80832 13.5652 6.40742 13.5511 6.16931 13.3083Z"
                                                        fill="#246FE5"
                                                    />
                                                </svg>
                                            </div>
                                        </template>
                                    </div>
                                </div>
                            </div>
                            <div v-if="rowItem.id === GENERAL_LIGHTING_FUNC_TYPE && !props.isPreview" class="collapse-item-form" @click.stop="evet => {}">
                                <FeedbackRegulationForm
                                    :ref="ins => (allEditForms[index] = ins)"
                                    v-model="rowItem.form"
                                    v-model:space-feedback-adjust-type="rowItem.spaceFeedbackAdjustType"
                                    :form-id="`${props.spaceId}-${rowItem.id}`"
                                    :space-with-work-plane-lux="isSpaceWithWorkPlaneLuxRule(props.spaceId)"
                                    :project-with-outdoor-illuminance="isProjectWithOutdoorIlluminanceRule()"
                                />
                            </div>
                            <PreviewFeedbackForm
                                v-if="rowItem.id === GENERAL_LIGHTING_FUNC_TYPE && props.isPreview"
                                :params="rowItem.form"
                                :space-feedback-adjust-type="rowItem.spaceFeedbackAdjustType"
                                class="preview-feedback-form"
                            />
                        </div>
                    </template>
                    <div :id="`${props.spaceId}-${rowItem.id}-table`">
                        <CollapseTable
                            :key="rowItem.isAllFeedback"
                            v-model="rowItem.loopList"
                            :is-general-lighting="rowItem.id === GENERAL_LIGHTING_FUNC_TYPE"
                            :is-preview="props.isPreview"
                            :show-type="rowItem.tableShowType"
                            :data-source="
                                rowItem.id === GENERAL_LIGHTING_FUNC_TYPE || rowItem.tableShowType === 'loop'
                                    ? rowItem.loopList.slice(0, 10)
                                    : rowItem.groupList.filter(v => v?.settingMode && v?.settingMode !== NOT_CONFIGURED).slice(0, 10)
                            "
                            :cur-item="rowItem"
                            @view-more-modal="viewMoreModal"
                            @preview-group="previewGroup"
                            @change-feedback="handleRowFeedback"
                            @switch-mode="handleRowMode"
                        />
                    </div>
                </m-collapse-item>
            </template>
        </m-collapse>

        <LoopGroupWithConfigModal
            v-model:visible="showViewModal"
            v-model:group-list="currentViewItem.groupList"
            v-model:loop-list="currentViewItem.loopList"
            v-model:show-type="currentViewItem.showType"
            :is-preview="currentViewModeIsPreview"
            :is-space="true"
            @close="closeViewModal"
            @save="handleSave"
        />
        <NewGroupModal
            v-if="curPreviewGroupRow?.id"
            :template-type="templateType"
            :tag="curPreviewGroupRow.tag"
            :default-loop-ids="curPreviewGroupRow?.relObjects?.map(item => item.id) || []"
            :data="curPreviewGroupRow"
            disabled-modify
            :is-preview="!!curPreviewGroupRow?.id"
            @close="curPreviewGroupRow = null"
            @success="curPreviewGroupRow = null"
        />
    </div>
</template>
<script setup>
import i18n from '@/localization';
import CollapseTable from './CollapseTable.vue';
import FeedbackRegulationForm from './feedbackRegulationForm.vue';
import StatisticsCount from '../../widget/StatisticsCount.vue';
import LoopGroupWithConfigModal from '../loop-group-with-config-modal/index.vue';
import NewGroupModal from '../new-group-modal/index.vue';
import {
    SMD_ALL_OPEN,
    SMD_ALL_CLOSE,
    SMD_PARTIAL_OPEN,
    GENERAL_LIGHTING_FUNC_TYPE,
    FEEDBACK_ADJUSTMENT,
    JOIN_FEEDBACK,
    NO_JOIN_FEEDBACK,
    SMD_OPEN,
    NOT_CONFIGURED
} from '../../constant';
import { useConfigDynamicModal } from '../../hooks/useConfigDynamicModal';
import PreviewFeedbackForm from './previewFeedbackForm.vue';
import { isSpaceWithWorkPlaneLuxRuleKey, isProjectWithOutdoorIlluminanceRuleKey } from '../../hooks/useGlobalData';
import { inject } from 'vue';
import { spaceFuncTypeCollapsedIdsKey } from '../../hooks/useConfigCommonHook';

const isSpaceWithWorkPlaneLuxRule = inject(isSpaceWithWorkPlaneLuxRuleKey);
const isProjectWithOutdoorIlluminanceRule = inject(isProjectWithOutdoorIlluminanceRuleKey);

const props = defineProps({
    isPreview: {
        type: Boolean,
        default: false
    },
    spaceId: {
        type: String,
        default: ''
    }
});

const spaceFuncTypeCollapsedIds = inject(spaceFuncTypeCollapsedIdsKey, ref({}));
const collapseDataList = defineModel({ type: Array, default: [] });
const allEditForms = ref([]);

const { viewMoreModal, closeViewModal, previewGroup, handleSave, switchMode, templateType, currentViewItem, currentViewModeIsPreview, curPreviewGroupRow, showViewModal } =
    useConfigDynamicModal(collapseDataList);

onMounted(() => {
    const curIds = collapseDataList.value.map(v => `${props.spaceId}-${v.id}`);
    spaceFuncTypeCollapsedIds.value[props.spaceId] = curIds;
});

const validateForm = async () => {
    const allValidateArr = [];
    for (const key in allEditForms.value) {
        const curForm = allEditForms.value[key];
        if (curForm?.validateForm) {
            const res = await curForm.validateForm();
            const { isValid, errorTips, formId } = res || {};
            allValidateArr.push({ isValid, errorTips, formId });
        } else {
            break;
        }
    }
    return allValidateArr;
};

defineExpose({ validateForm });

const handleRowFeedback = ({ row, val }) => {
    collapseDataList.value = collapseDataList.value.map(r => {
        if (r?.id === row?.funcType) {
            const rowLoopList = (r.loopList || []).map(item => {
                if (item?.id === row?.id) {
                    let finalSettingMode = NOT_CONFIGURED;
                    if (val === JOIN_FEEDBACK) {
                        finalSettingMode = FEEDBACK_ADJUSTMENT;
                    } else if (val === NO_JOIN_FEEDBACK) {
                        finalSettingMode = item.settingMode === FEEDBACK_ADJUSTMENT ? NOT_CONFIGURED : item.settingMode || NOT_CONFIGURED;
                    }
                    return { ...item, ...row, settingMode: finalSettingMode };
                }
                return { ...item, settingMode: item?.settingMode };
            });
            const feedbackCount = rowLoopList.reduce((acc, cur) => acc + (cur?.settingMode === FEEDBACK_ADJUSTMENT ? 1 : 0), 0);
            const openCount = rowLoopList.reduce((acc, cur) => acc + (cur?.settingMode === SMD_OPEN ? 1 : 0), 0);
            const unConfigCount = rowLoopList.reduce((acc, cur) => acc + (cur?.settingMode === NOT_CONFIGURED ? 1 : 0), 0);
            return {
                ...r,
                loopList: rowLoopList,
                feedbackCount,
                openCount,
                unConfigCount
            };
        }
        return r;
    });
};

const handleRowMode = ({ row, toMode }) => {
    collapseDataList.value = collapseDataList.value.map(r => {
        if (r?.id === row?.funcType) {
            const rowLoopList = (r.loopList || []).map(item => {
                if (item?.id === row?.id) {
                    return { ...item, ...row, settingMode: toMode ?? NOT_CONFIGURED };
                }
                return { ...item };
            });
            const feedbackCount = rowLoopList.reduce((acc, cur) => acc + (cur?.settingMode === FEEDBACK_ADJUSTMENT ? 1 : 0), 0);
            const openCount = rowLoopList.reduce((acc, cur) => acc + (cur?.settingMode === SMD_OPEN ? 1 : 0), 0);
            const unConfigCount = rowLoopList.reduce((acc, cur) => acc + (cur?.settingMode === NOT_CONFIGURED ? 1 : 0), 0);
            return {
                ...r,
                loopList: rowLoopList,
                feedbackCount,
                openCount,
                unConfigCount
            };
        }
        return r;
    });
};
</script>
<style lang="less" scoped>
.feedback-loop-config-list-container {
    :deep(.m-collapse) {
        display: flex;
        flex-direction: column;
        row-gap: 12px;

        .m-collapse-item__header {
            width: 100%;
            padding: 12px 8px;
            align-items: flex-start;
        }

        .m-collapse-item__content {
            padding: 12px 8px;
            padding-top: 0px;
        }

        .collapse-item-title-wrap {
            display: flex;
            flex-direction: column;
            width: 100%;
        }

        .collapse-item-form {
            display: flex;
            flex-direction: row;
            align-items: center;
            flex-wrap: wrap;
            margin-top: 4px;
            padding-top: 8px;
            cursor: default;

            .collapse-item-form-item {
                display: flex;
                flex-direction: row;
                align-items: center;
                flex-wrap: nowrap;
            }

            .collapse-item-form-item-input {
                display: flex;
                flex-direction: row;
                align-items: center;
                flex-wrap: nowrap;
            }
        }

        .m-collapse-item {
            display: flex;
            padding: 0px;
            flex-direction: column;
            justify-content: center;
            align-items: flex-start;
            gap: var(--is-preview-gap);

            border-radius: 4px;
            background: var(--gray-50, #f7f9fa);

            .m-collapse-item__content {
                padding: 12px 8px;
                padding-top: 0px;
            }
        }

        .collapse-item-row {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .collapse-left {
            display: flex;
            align-items: center;
            gap: 14px;
            color: var(--gray-900, #1b2129);
            font-size: 14px;
            font-style: normal;
            font-weight: 400;
            line-height: 22px;
        }

        .collapse-right {
            display: flex;
            align-items: center;
        }
    }
}

.op-warp {
    display: flex;
    align-items: center;
    gap: 8px;

    .btn-item {
        display: flex;
        align-items: center;
        padding: 3px 4px;
        color: var(--blue-500);
        text-align: center;
        font-size: 14px;
        font-weight: var(--platform-font-weight);
        line-height: 22px;
        /* 157.143% */
        border-radius: 4px;
        cursor: pointer;

        .right-arrow {
            visibility: hidden;
        }

        &.act {
            background: var(--blue-100);

            .right-arrow {
                visibility: visible;
            }
        }

        &:hover {
            background: var(--alpha-30);

            .right-arrow {
                visibility: visible;
            }
        }
    }

    .part-open {
        width: 82px;
    }
}

.preview-feedback-form {
    transform: translateX(-28px);
    margin-top: 12px;
    width: calc(100% + 28px);
}
</style>
