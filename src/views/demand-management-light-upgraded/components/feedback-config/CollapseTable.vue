<template>
    <m-table
        v-if="props.isGeneralLighting"
        :columns="finalColumns"
        :data-source="dynamicDataSource"
        :checkbox="false"
        :column-line="isPreview"
        :empty-text="'--'"
        :class="{
            'group-table': true,
            'is-edit-mode': !isPreview
        }"
    >
        <template #lampFuncTypeName="rowItem">
            <span v-if="!rowItem.lampFuncTypeName" class="no-modified"> -- </span>
            <span v-else>
                {{ rowItem.lampFuncTypeName }}
            </span>
        </template>
        <template #joinFeedBack="rowItem">
            <m-radio-group v-model="rowItem.joinFeedBack" @change="val => changeFeedBack(rowItem, val)">
                <div :class="{ 'radio-list-row': true, 'is-en': !isCurrentCn() }">
                    <m-radio v-for="item in options" :key="item.value" :label="item.value" :size="14">{{ item.label }} </m-radio>
                </div>
            </m-radio-group>
        </template>
        <template #demandForLoop="rowItem">
            <m-tag v-if="rowItem.settingMode === SMD_OPEN" color="#E68600" bg-color="#FFF0CC" size="small">{{ i18n.global.t('common.status_open') }}</m-tag>
            <m-tag v-if="rowItem.settingMode === SMD_CLOSE" color="#626C78" bg-color="#E8ECF0" size="small">{{ i18n.global.t('common.status_close') }}</m-tag>
            <m-tag v-if="rowItem.settingMode === FEEDBACK_ADJUSTMENT" color="#683BD6" bg-color="#F1E5FE" size="small">{{
                i18n.global.t('meos_control_web.feedback_adjustment')
            }}</m-tag>
            <m-tag v-if="!rowItem.settingMode || rowItem.settingMode === NOT_CONFIGURED" color="#626C78" bg-color="#E8ECF0" size="small">{{
                i18n.global.t('meos_control_web.unconfiged')
            }}</m-tag>
        </template>
        <template #operate="rowItem">
            <div class="fc op-warp">
                <m-tips
                    :content="i18n.global.t('meos_control_web.not_participate_feedback_setting')"
                    :disabled="rowItem.joinFeedBack !== JOIN_FEEDBACK"
                    trigger="hover"
                    theme="darkTransparent"
                >
                    <div
                        class="btn-item"
                        :class="{
                            act: rowItem.settingMode === SMD_OPEN,
                            disabled: rowItem.joinFeedBack === JOIN_FEEDBACK
                        }"
                        @click.stop="switchMode(rowItem, SMD_OPEN)"
                    >
                        {{ i18n.global.t('common.status_open') }}
                    </div>
                </m-tips>
                <m-tips
                    :content="i18n.global.t('meos_control_web.not_participate_feedback_setting')"
                    :disabled="rowItem.joinFeedBack !== JOIN_FEEDBACK"
                    trigger="hover"
                    theme="darkTransparent"
                >
                    <div
                        class="btn-item"
                        :class="{
                            act: rowItem.settingMode === SMD_CLOSE,
                            disabled: rowItem.joinFeedBack === JOIN_FEEDBACK
                        }"
                        @click.stop="switchMode(rowItem, SMD_CLOSE)"
                    >
                        {{ i18n.global.t('common.status_close') }}
                    </div>
                </m-tips>
            </div>
        </template>
        <template #auto_on_threshold="rowItem">
            <template v-if="props.isPreview">
                {{ formatFeedbackValue(rowItem, 'underOutdoorIlluminance') }}
            </template>
            <m-tips
                v-else
                :content="i18n.global.t('meos_control_web.participate_feedback_setting')"
                :disabled="rowItem.joinFeedBack === JOIN_FEEDBACK"
                trigger="hover"
                theme="darkTransparent"
            >
                <m-input-number
                    v-model="rowItem.editFields.underOutdoorIlluminance"
                    text-align="left"
                    :placeholder="i18n.global.t('common.placeholder_input')"
                    controls="rightButton"
                    :min="0"
                    :max="1000000"
                    :precision="0"
                    :disabled="rowItem.joinFeedBack !== JOIN_FEEDBACK"
                    :error-text="rowItem.errTextMap.underOutdoorIlluminance"
                    width="112px"
                    @change="val => handleEditFieldsChange(rowItem, 'underOutdoorIlluminance', val)"
                    @blur="handleEditFieldsBlur(rowItem, 'underOutdoorIlluminance')"
                >
                    <template #suffix>lx</template>
                </m-input-number>
            </m-tips>
        </template>
        <template #auto_on_duration="rowItem">
            <template v-if="props.isPreview">
                {{ formatFeedbackValue(rowItem, 'underDuration') }}
            </template>
            <m-tips
                v-else
                :content="i18n.global.t('meos_control_web.participate_feedback_setting')"
                :disabled="rowItem.joinFeedBack === JOIN_FEEDBACK"
                trigger="hover"
                theme="darkTransparent"
            >
                <m-input-number
                    v-model="rowItem.editFields.underDuration"
                    text-align="left"
                    :placeholder="i18n.global.t('common.placeholder_input')"
                    controls="rightButton"
                    :min="0"
                    :max="300"
                    :precision="0"
                    :disabled="rowItem.joinFeedBack !== JOIN_FEEDBACK"
                    :error-text="rowItem.errTextMap.underDuration"
                    width="112px"
                    @change="val => handleEditFieldsChange(rowItem, 'underDuration', val)"
                    @blur="handleEditFieldsBlur(rowItem, 'underDuration')"
                >
                    <template #suffix>min</template>
                </m-input-number>
            </m-tips>
        </template>
        <template #auto_off_threshold="rowItem">
            <template v-if="props.isPreview">
                {{ formatFeedbackValue(rowItem, 'overtopOutdoorIlluminance') }}
            </template>
            <m-tips
                v-else
                :content="i18n.global.t('meos_control_web.participate_feedback_setting')"
                :disabled="rowItem.joinFeedBack === JOIN_FEEDBACK"
                trigger="hover"
                theme="darkTransparent"
            >
                <m-input-number
                    v-model="rowItem.editFields.overtopOutdoorIlluminance"
                    text-align="left"
                    :placeholder="i18n.global.t('common.placeholder_input')"
                    controls="rightButton"
                    :min="0"
                    :max="1000000"
                    :precision="0"
                    :disabled="rowItem.joinFeedBack !== JOIN_FEEDBACK"
                    :error-text="rowItem.errTextMap.overtopOutdoorIlluminance"
                    width="112px"
                    @change="val => handleEditFieldsChange(rowItem, 'overtopOutdoorIlluminance', val)"
                    @blur="handleEditFieldsBlur(rowItem, 'overtopOutdoorIlluminance')"
                >
                    <template #suffix>lx</template>
                </m-input-number>
            </m-tips>
        </template>
        <template #auto_off_duration="rowItem">
            <template v-if="props.isPreview">
                {{ formatFeedbackValue(rowItem, 'overtopDuration') }}
            </template>
            <m-tips
                v-else
                :content="i18n.global.t('meos_control_web.participate_feedback_setting')"
                :disabled="rowItem.joinFeedBack === JOIN_FEEDBACK"
                trigger="hover"
                theme="darkTransparent"
            >
                <m-input-number
                    v-model="rowItem.editFields.overtopDuration"
                    text-align="left"
                    :placeholder="i18n.global.t('common.placeholder_input')"
                    controls="rightButton"
                    :min="0"
                    :max="300"
                    :precision="0"
                    :disabled="rowItem.joinFeedBack !== JOIN_FEEDBACK"
                    :error-text="rowItem.errTextMap.overtopDuration"
                    width="112px"
                    @change="val => handleEditFieldsChange(rowItem, 'overtopDuration', val)"
                    @blur="handleEditFieldsBlur(rowItem, 'overtopDuration')"
                >
                    <template #suffix>min</template>
                </m-input-number>
            </m-tips>
        </template>
    </m-table>
    <m-table
        v-else
        :columns="props.showType === 'loop' ? loopColumnList : groupColumnList"
        :data-source="dataSource"
        :checkbox="false"
        :column-line="true"
        :empty-text="'--'"
        class="group-table"
    >
        <template #name="row">
            <m-tips :content="i18n.global.t('meos_control_web.view_group_loop')" theme="darkTransparent" placement="right" trigger="hover">
                <div class="group-name multiple-line" @click.stop="previewGroup(row)">{{ row.name || '--' }}</div>
            </m-tips>
        </template>
        <template #purpose="{ purpose }">
            <span class="multiple-line">{{ purpose || '--' }}</span>
        </template>
        <template #count="{ relObjects }">
            <span class="multiple-line">{{ relObjects?.length ?? 0 }}</span>
        </template>
        <template #headerSlot="col">
            <div class="col-with-action">
                <span>{{ col.title }}</span>
                <m-tips theme="darkTransparent" :content="i18n.global.t('meos_control_web.popup_view')" placement="bottom">
                    <div class="action-entry" @click="viewMoreModal">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M3.19922 3.2002L5.86589 5.84006" stroke="#333333" stroke-width="1.06667" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M3.19922 12.7732L5.86589 10.1333" stroke="#333333" stroke-width="1.06667" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M12.8039 12.7732L10.1641 10.1333" stroke="#333333" stroke-width="1.06667" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M12.7727 3.2002L10.1328 5.84006" stroke="#333333" stroke-width="1.06667" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M10.3984 3.2002H12.7984V5.6002" stroke="#333333" stroke-width="1.06667" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M12.7984 10.3999V12.7999H10.3984" stroke="#333333" stroke-width="1.06667" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M5.59922 12.7999H3.19922V10.3999" stroke="#333333" stroke-width="1.06667" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M3.19922 5.6002V3.2002H5.59922" stroke="#333333" stroke-width="1.06667" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                    </div>
                </m-tips>
            </div>
        </template>
        <template #settingMode="item">
            <m-tag v-if="item.settingMode === SMD_OPEN" color="#E68600" bg-color="#FFF0CC" size="small">{{ i18n.global.t('common.status_open') }}</m-tag>
            <m-tag v-if="item.settingMode === SMD_CLOSE" color="#626C78" bg-color="#E8ECF0" size="small">{{ i18n.global.t('common.status_close') }}</m-tag>
            <m-tag v-if="item.settingMode === SMD_ALL_OPEN" color="#E68600" bg-color="#FFF0CC" size="small">{{ i18n.global.t('meos_control_web.fully_on') }}</m-tag>
            <m-tag v-if="item.settingMode === SMD_ALL_CLOSE" color="#626C78" bg-color="#E8ECF0" size="small">{{ i18n.global.t('meos_control_web.fully_off') }}</m-tag>
            <m-tag v-if="!item.settingMode || item.settingMode === NOT_CONFIGURED" color="#626C78" bg-color="#E8ECF0" size="small">{{
                i18n.global.t('meos_control_web.unconfiged')
            }}</m-tag>
        </template>
    </m-table>
</template>
<script setup>
import i18n, { isCurrentCn } from '@/localization';
import { useBreakpoints } from '@vueuse/core';
import { SMD_OPEN, SMD_CLOSE, JOIN_FEEDBACK, NO_JOIN_FEEDBACK, SMD_ALL_OPEN, SMD_ALL_CLOSE, FEEDBACK_ADJUSTMENT, NOT_CONFIGURED } from '../../constant';
import { checkLxRange, checkTimeRange, UNDER_FIELDS_PAIR, LX_FIELDS_PAIR } from '../../utils/validate';

const props = defineProps({
    dataSource: {
        type: Array,
        default: () => []
    },
    isGeneralLighting: {
        type: Boolean,
        default: false
    },
    showType: {
        type: String,
        default: 'loop' // 'group' | 'loop'
    },
    curItem: {
        type: Object,
        default: () => ({})
    },
    isPreview: {
        type: Boolean,
        default: false
    }
});

const dynamicDataSource = defineModel({ type: Array, default: [] });
const emits = defineEmits(['view-more-modal', 'preview-group', 'change-feedback', 'switch-mode', 'change-threshold-duration']);
const options = ref([
    {
        label: i18n.global.t('meos_control_web.participate'),
        value: JOIN_FEEDBACK
    },
    {
        label: i18n.global.t('meos_control_web.not_participate'),
        value: NO_JOIN_FEEDBACK
    }
]);
const changeFeedBack = (row, val) => {
    row.joinFeedBack = val;
    if (val !== JOIN_FEEDBACK) {
        row.settingMode = row?.settingMode || NOT_CONFIGURED;

        row.errTextMap = {
            underOutdoorIlluminance: '',
            underDuration: '',
            overtopOutdoorIlluminance: '',
            overtopDuration: ''
        };
    } else {
        row.settingMode = FEEDBACK_ADJUSTMENT;
    }

    emits('change-feedback', { row, val });
};
const switchMode = (row, toMode) => {
    if (row.joinFeedBack === JOIN_FEEDBACK) return;
    emits('switch-mode', { row, toMode });
};
const validateField = (row, key, val) => {
    const checkRow = val !== undefined ? { ...(row.editFields || {}), [key]: val, joinFeedBack: row.joinFeedBack } : { ...(row.editFields || {}), joinFeedBack: row.joinFeedBack };
    const curType = UNDER_FIELDS_PAIR.includes(key) ? 'under' : 'upper';

    if (LX_FIELDS_PAIR.includes(key)) {
        return checkLxRange(checkRow, curType);
    } else {
        return checkTimeRange(checkRow, curType);
    }
};

const handleEditFieldsChange = (row, key, val) => {
    row.errTextMap[key] = validateField(row, key, val);
};
const handleEditFieldsBlur = (row, key) => {
    row.errTextMap[key] = validateField(row, key);
};

const viewMoreModal = () => {
    emits('view-more-modal', props.curItem);
};
const previewGroup = row => {
    emits('preview-group', row);
};

const breakpoints = useBreakpoints({
    laptop: 0,
    desktop: 1440
});
const activeBreakpoint = breakpoints.active();
const isDesktop = computed(() => activeBreakpoint.value === 'desktop');

const formatFeedbackValue = (row, key) => {
    const curVal = row.feedbackAdjustSetting?.[key];
    const hasVal = curVal != null;
    const unit = LX_FIELDS_PAIR.includes(key) ? 'lx' : 'min';
    return hasVal ? `${curVal}${unit}` : '--';
};

const generalColumns = [
    {
        dataIndex: 'localName',
        title: i18n.global.t('meos_control_web.loop_name'),
        ellipsis: true,
        width: 110
    },
    {
        dataIndex: 'localId',
        title: i18n.global.t('meos_control_web.loop_code'),
        ellipsis: true,
        width: 110
    },
    {
        dataIndex: 'lampFuncTypeName',
        title: i18n.global.t('meos_control_web.luminaire_type'),
        ellipsis: true,
        width: 98
    },
    {
        dataIndex: 'joinFeedBack',
        title: `${i18n.global.t('meos_control_web.participate_feedback_control')}`,
        width: 158
    },
    {
        dataIndex: 'operate',
        title: `${i18n.global.t('meos_control_web.loop_switch_setting')}`,
        width: 110
    },
    {
        dataIndex: 'auto_open_condition',
        title: `${i18n.global.t('meos_control_web.auto_open_condition')}`,
        children: [
            {
                dataIndex: 'auto_on_threshold',
                title: `${i18n.global.t('meos_control_web.auto_on_threshold')}`,
                minWidth: 100
            },
            {
                dataIndex: 'auto_on_duration',
                title: `${i18n.global.t('meos_control_web.duration')}`
            }
        ]
    },
    {
        dataIndex: 'auto_close_condition',
        title: `${i18n.global.t('meos_control_web.auto_close_condition')}`,
        children: [
            {
                dataIndex: 'auto_off_threshold',
                title: `${i18n.global.t('meos_control_web.auto_off_threshold')}`,
                minWidth: 100
            },
            {
                dataIndex: 'auto_off_duration',
                title: `${i18n.global.t('meos_control_web.duration')}`
            }
        ]
    }
];

const previewColumns = [
    {
        dataIndex: 'localName',
        title: i18n.global.t('meos_control_web.loop_name'),
        ellipsis: true
    },
    {
        dataIndex: 'localId',
        title: i18n.global.t('meos_control_web.loop_code'),
        ellipsis: true,
        minWidth: 110,
        maxWidth: 200,
        width: 200
    },
    {
        dataIndex: 'lampFuncTypeName',
        title: i18n.global.t('meos_control_web.luminaire_type'),
        minWidth: 100,
        maxWidth: 130,
        width: 130
    },
    {
        dataIndex: 'demandForLoop',
        title: i18n.global.t('meos_control_web.switch_demand'),
        minWidth: 140,
        maxWidth: 180,
        width: 180
    },
    {
        dataIndex: 'auto_open_condition',
        title: `${i18n.global.t('meos_control_web.auto_open_condition')}`,
        children: [
            {
                dataIndex: 'auto_on_threshold',
                title: `${i18n.global.t('meos_control_web.auto_on_threshold')}`,
                minWidth: 110
            },
            {
                dataIndex: 'auto_on_duration',
                title: `${i18n.global.t('meos_control_web.duration')}`,
                minWidth: 110
            }
        ]
    },
    {
        dataIndex: 'auto_close_condition',
        title: `${i18n.global.t('meos_control_web.auto_close_condition')}`,
        children: [
            {
                dataIndex: 'auto_off_threshold',
                title: `${i18n.global.t('meos_control_web.auto_off_threshold')}`,
                minWidth: 110
            },
            {
                dataIndex: 'auto_off_duration',
                title: `${i18n.global.t('meos_control_web.duration')}`,
                minWidth: 110
            }
        ]
    }
];
const loopColumnList = [
    {
        dataIndex: 'localName',
        title: i18n.global.t('meos_control_web.lighting_circuit'),
        ellipsis: true
    },
    {
        dataIndex: 'localId',
        title: i18n.global.t('meos_control_web.loop_code'),
        ellipsis: true
    },
    {
        dataIndex: 'lampFuncTypeName',
        title: i18n.global.t('meos_control_web.luminaire_type'),
        width: 182
    },
    {
        dataIndex: 'settingMode',
        title: `${i18n.global.t('meos_control_web.switch_demand')}`,
        width: 158,
        headerSlot: 'headerSlot'
    }
];

const groupColumnList = [
    {
        dataIndex: 'name',
        title: i18n.global.t('meos_control_web.goupname')
    },
    {
        dataIndex: 'purpose',
        title: i18n.global.t('meos_control_web.group_purpose'),
        width: 715
    },
    {
        dataIndex: 'count',
        title: i18n.global.t('meos_control_web.loop_count'),
        width: 100
    },
    {
        dataIndex: 'settingMode',
        title: `${i18n.global.t('meos_control_web.switch_demand')}`,
        width: 158,
        headerSlot: 'headerSlot'
    }
];
const finalColumns = ref([]);

watch(
    [() => props.isGeneralLighting, () => props.isPreview, () => isDesktop.value],
    ([isGeneral]) => {
        if (isGeneral) {
            if (props.isPreview) {
                finalColumns.value = previewColumns.map(r => {
                    const hasMaxOrMin = r.maxWidth || r.minWidth;
                    if (!hasMaxOrMin) {
                        return r;
                    }
                    const { maxWidth, minWidth, ...rest } = r || {};
                    return { ...rest, width: isDesktop.value ? maxWidth : minWidth };
                });
            } else {
                const tempList = generalColumns; // 全部参与回路反馈
                finalColumns.value = tempList.map(r => {
                    const hasMaxOrMin = r.maxWidth || r.minWidth;
                    if (!hasMaxOrMin) {
                        return r;
                    }
                    const { maxWidth, minWidth, ...rest } = r || {};
                    return { ...rest, width: isDesktop.value ? maxWidth : minWidth };
                });
            }
        } else {
            finalColumns.value = props.showType === 'loop' ? loopColumnList : groupColumnList;
        }
    },
    {
        immediate: true
    }
);
</script>
<style lang="less" scoped>
.group-table {
    :deep(.meri-table-element-th) {
        &:last-child {
            padding-right: 0px;
        }
    }

    .no-modified {
        color: #c4c9cf;
    }

    :deep(.meri-table-body-nodata) {
        position: relative;
        margin-top: 14px;
        min-height: 120px;
    }
}

.is-edit-mode {
    :deep(.suffix-text) {
        width: fit-content;
    }

    :deep(.m-input-number-rightButton) {
        padding-inline: 8px;
    }

    :deep(.meri-table-element-tr .meri-table-element-th) {
        border-top: none;
    }

    :deep(.meri-table-element-tr .meri-table-element-td) {
        padding: 0 10px;
        height: 68px;
    }

    :deep(.m-input-number.error .m-input-tips) {
        bottom: -16px;
    }
}

.col-with-action {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .action-entry {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 36px;
        height: 40px;
        cursor: pointer;
        border-left: 1px solid var(--Grey-Grey-Dividers, #e1e5eb);
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
        min-width: fit-content;

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

        &.disabled {
            color: var(--grey-400, #c4c9cf);
            background-color: transparent;
            cursor: not-allowed;

            &:hover {
                background-color: transparent;
            }
        }
    }

    .part-open {
        width: 82px;
    }
}

.multiple-line {
    max-width: 100%;
    overflow-wrap: break-word;
    white-space: normal;
    padding-block: 12px;
}

:deep(.meri-table-element-tr:hover) {
    &:hover {
        .group-name {
            color: var(--blue-500, #246fe5);
            cursor: pointer;
        }
    }
}

.radio-list-row {
    display: flex;
    align-items: center;
    column-gap: 16px;
    row-gap: 4px;

    :deep(.m-radio) {
        margin: 0px;
    }
}
.is-en {
    flex-wrap: wrap;
}
</style>
