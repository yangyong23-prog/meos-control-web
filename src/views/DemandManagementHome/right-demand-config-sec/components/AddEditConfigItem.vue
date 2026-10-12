<template>
    <div class="config-item-edit-container">
        <m-scrollbar box-class="edit-content">
            <TitlePrefix
                :font-size="14"
                :title="props?.configItem?.isGlobal ? i18n.global.t('meos_control_web.global_configuration') : i18n.global.t('meos_control_web.space_type_config')"
            >
            </TitlePrefix>
            <div class="tips">
                {{ i18n.global.t('meos_control_web.tip_colon') }}
                <div v-if="templateType === 'ARMING'">
                    {{ i18n.global.t('meos_control_web.unconfiged_time_is') }}<strong>「{{ i18n.global.t('meos_control_web.disarm_alt') }}」</strong
                    >{{ i18n.global.t('meos_control_web.time_period') }}
                </div>
                <div v-else-if="templateType === 'PASSING'">
                    {{ i18n.global.t('meos_control_web.unconfiged_time_demand_is') }}<strong>「{{ i18n.global.t('meos_control_web.access_by_permission') }}」</strong>
                </div>
            </div>
            <div v-if="selectModuleInfo.objType !== 'space' && !props?.configItem?.isGlobal" class="space-type-wrapper">
                <div class="space-type-title">
                    {{ i18n.global.t('meos_control_web.space_type_selection')
                    }}<span class="more-tips">{{ i18n.global.t('meos_control_web.selectable_space_types_under_current_object') }}</span>
                </div>
                <div class="space-tree-select">
                    <m-form-item
                        ref="formItem"
                        :item-model="selectedNodes"
                        :rules="{ type: 'array', required: true, message: i18n.global.t('meos_control_web.input_required_check_error_4'), trigger: ['blur', 'change'] }"
                        prop="selectedNodes"
                        :error-use-popover="false"
                        require-asterisk-position="right"
                    >
                        <m-select v-model="selectedNodes" multiple :options="spaceFuncTypesOption" last-stage searchable panel-searchable :menu-size="344"> </m-select>
                    </m-form-item>
                </div>
            </div>
            <div v-for="(item, index) in spaceConfigData" :key="item.title">
                <TimeRangeListSelect :ref="el => (editDataRefs[index] = el)" :range-title="item.title" :range-data="item.timeRangeArr" :range-type="item.rangeType" />
            </div>
        </m-scrollbar>
        <div class="footer-with-edit">
            <m-button type="primary" :loading="isSaving" @click="spaceTypeConfigSave">{{ i18n.global.t('common.save') }}</m-button>
            <m-button :disabled="isSaving" @click="spaceTypeConfigCancel">{{ i18n.global.t('common.cancel') }}</m-button>
        </div>
    </div>
</template>

<script setup>
import TitlePrefix from '@/components/title-prefix/index.vue';
import TimeRangeListSelect from './TimeRangeListSelect.vue';
import { selectModuleInfoInjectKey, configListDataInjectKey } from '../../constant/injectKey';
import { templateTypeToConfigLegendMap } from '../../constant/config';
import { $Message } from 'meri-plus';
import i18n from '@/localization';

const templateType = inject('templateType'); // 左侧模板类型
const selectModuleInfo = inject(selectModuleInfoInjectKey);
const configListData = inject(configListDataInjectKey);
const props = defineProps({
    configItem: {
        type: Object,
        default: () => {}
    },
    isEdit: {
        type: Boolean,
        default: false
    },
    isSaving: {
        type: Boolean,
        default: false
    }
});

const emits = defineEmits(['spaceTypeConfigCancel', 'spaceTypeConfigSave']);
const selectFuncTypesData = inject('selectFuncTypesData');

const editDataRefs = ref([]);

const selectedNodes = ref([]);
const formItem = ref(null);

const spaceConfigData = computed(() => {
    const arr = [];
    const curTemplate = templateType?.value;
    const legendItems = templateTypeToConfigLegendMap[curTemplate]?.filter(legendObj => !legendObj?.isDefault) || [];
    const tempData = props?.configItem?.itemData?.map((v, index) => {
        const startStr = v?.beginTime?.absoluteTime?.split(':')?.slice(0, 2)?.join(':');
        const endStr = v?.endTime?.absoluteTime?.split(':')?.slice(0, 2)?.join(':');
        const acrossDay = v?.acrossDay;
        return {
            ...v,
            key: new Date().toISOString() + index,
            start: { val: startStr, errMsg: '' },
            end: { val: endStr, date: acrossDay ? 'next' : 'current', errMsg: '' }
        };
    });

    legendItems?.forEach(item => {
        const itemType = item?.type;
        const temArr = tempData?.filter(v => v?.type === item?.type);
        arr.push({
            title: item.title,
            timeRangeArr: temArr,
            rangeType: itemType
        });
    });

    return arr;
});

const spaceTypeConfigSave = computed(() => async () => {
    const validateAndEmit = () => {
        let errorMsg = '',
            repeatMsg = '',
            totalRawData = [],
            checkRepeatFunc = null,
            checkAllRanges = null;
        const allFormData = editDataRefs.value.map(item => {
            const { errMsg, data, rawData } = item.validateForm();
            if (!checkRepeatFunc) {
                checkRepeatFunc = item?.checkTimeRepeat;
            }
            if (!checkAllRanges) {
                checkAllRanges = item?.checkAllRanges;
            }
            totalRawData.push(rawData);
            if (errMsg) {
                errorMsg = errMsg;
            }
            return data;
        });

        if (errorMsg) {
            $Message.error({ title: errorMsg });
            return;
        }
        const totalCheckRepeat = checkRepeatFunc?.(totalRawData?.flat());
        const totalCheckRanges = checkAllRanges?.(totalRawData?.flat());
        if (totalCheckRepeat || totalCheckRanges) {
            repeatMsg = totalCheckRepeat || totalCheckRanges;
        }
        if (repeatMsg) {
            $Message.error({ title: repeatMsg });
            return;
        }

        const allNodes = selectFuncTypesData?.value || [];
        const curSelectIds = selectedNodes.value;
        const selectedNodesData = allNodes?.filter(v => curSelectIds?.includes(v?.funcType)) || [];
        const editId = props?.configItem?.funcTypes?.map(v => v?.code)?.join('-');

        emits('spaceTypeConfigSave', allFormData, { editId, selectedNodes: selectedNodesData });
    };

    try {
        if (selectModuleInfo?.value.objType !== 'space' && !props?.configItem?.isGlobal) {
            await formItem?.value?.validate();
            validateAndEmit();
        } else {
            validateAndEmit();
        }
    } catch (err) {
        $Message.error({ title: i18n.global.t('meos_control_web.input_required_check_error_4') });
    }
});

const usedFuncTypeMap = computed(() => {
    const rec = {};
    configListData?.value?.forEach(item => {
        console.log('item: ', item);
        item.finalConfig?.spaceFuncTypeConfigs?.forEach(sobj => {
            sobj.funcTypes?.forEach(f => {
                rec[f.code] = true;
            });
        });
    });
    const curConfigItem = props?.configItem?.funcTypes?.map(v => v?.code);
    if (props?.isEdit && curConfigItem) {
        curConfigItem?.forEach(id => {
            rec[id] = false;
        });
    }
    return rec;
});
const spaceFuncTypesOption = computed(() => {
    return selectFuncTypesData?.value?.filter(fc => {
        return !usedFuncTypeMap.value[fc.id];
    });
});

const spaceTypeConfigCancel = () => {
    emits('spaceTypeConfigCancel');
};
watch(
    () => props.configItem,
    () => {
        if (props.configItem) {
            selectedNodes.value = props.configItem?.funcTypes?.map(f => f.code) || [];
            console.log('selectedNodes.value: ', selectedNodes.value);
        }
    },
    { immediate: true }
);
</script>

<style lang="less" scoped>
.config-item-edit-container {
    display: flex;
    flex-direction: column;
    height: calc(100% - 54px);
}

:deep(.m-scrollbar) {
    max-height: calc(100% - 66px);
}

:deep(.edit-content) {
    .m-scrollbar__content {
        padding: 16px;
        display: flex;
        flex-direction: column;
        row-gap: 12px;
    }

    .tips {
        display: flex;
        width: 100%;
        padding: 8px;
        border-radius: 4px;
        background: var(--orange-50, #fffbe6);
        color: var(--orange-700, #e68600);
        font-size: 14px;
        line-height: 18px;
    }
}

.space-type-wrapper {
    display: flex;
    padding: 16px 12px;
    flex-direction: column;
    row-gap: 8px;

    border-radius: 4px;
    background: var(--gray-50, #f7f9fa);

    .space-type-title {
        display: flex;
        align-items: center;
        color: #626c78;
        font-size: 14px;
        font-weight: 700;
        height: 22px;
        line-height: 22px;
    }
    .space-tree-select {
        :deep(.m-form-item) {
            margin-bottom: 0;
        }
    }

    .more-tips {
        color: #8b949e;
        font-size: 12px;
        margin-left: 15px;
        position: relative;
        &::before {
            position: absolute;
            top: -1px;
            left: -11px;
            content: '*';
            color: #f55047;
            font-size: 14px;
            height: 22px;
            width: 7px;
        }
    }

    :deep(.m-select-wrap) {
        width: 100%;

        .m-select {
            width: 100%;

            .m-select-inner {
                width: 100% !important;
            }
        }
    }
}

.footer-with-edit {
    position: relative;
    left: 0;
    bottom: 0;
    display: flex;
    height: 64px;
    padding: 16px;
    align-items: center;
    column-gap: 12px;
    border-top: 1px solid rgba(196, 201, 207, 0.3);
}
</style>
