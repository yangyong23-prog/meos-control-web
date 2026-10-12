<template>
    <m-modal
        v-model:visible="specialCalendarShow"
        :append-to="$modalAppendTo"
        :need-scrollbar="false"
        :width="840"
        :height="536"
        type="default"
        :title="i18n.global.t('meos_control_web.special_object_config')"
        modal-class-name="special-calendar"
        :footer="true"
        :auto-close="false"
        @close="handleModalClose"
    >
        <template #content>
            <div class="f box-item">
                <div :key="props.type" class="special-left">
                    <m-tree ref="tree" :key="onlyLookSelected" v-model="currentModel" :data="finalRenderTree" virtual :before-click="handleTreeBeforeClick" @change="clickItemTree">
                        <template #nodePrefix="node">
                            <div class="fc">
                                <span v-if="configuredArr.includes(node.id)" class="dot"></span>
                                <!-- <div v-ellipsis class="m-ellipsis">{{ node?.name || '' }}</div> -->
                            </div>
                        </template>
                    </m-tree>
                </div>
                <div v-if="!finalRenderTree?.[0]?.id" class="empty-right">
                    <Empty :text="i18n.global.t('meos_control_web.no_content')"></Empty>
                </div>
                <div v-else class="special-right">
                    <LeaveNotSaveModal
                        v-show="props.type === 'add'"
                        v-model="leaveConfirmShow"
                        v-model:save-loading="leaveSaveLoading"
                        @leave="handleLeave"
                        @save-leave="handleSaveLeave"
                    />
                    <m-form
                        ref="SpecialForm"
                        label-width="108px"
                        :model="modelParams"
                        :scroll-to-error="true"
                        label-position="top"
                        require-asterisk-position="right"
                        class="config-edit-box"
                    >
                        <m-scrollbar class="right-scrollbar">
                            <template v-if="type === 'add'">
                                <TitlePrefix class="config-content-container" :title="i18n.global.t('meos_control_web.configuration_content')" :font-size="14" :line-height="22" />
                                <BusinessHours
                                    v-model:radio="modelParams.radioValue"
                                    v-model:all="modelParams.businessTimeRangeList"
                                    v-model:all-switch="businessTimeRangeSwitch"
                                    v-model:work-day="modelParams.workdayBusinessTimeRangeList"
                                    v-model:work-day-switch="workDayBusinessTimeRangeSwitch"
                                    v-model:day-off="modelParams.dayOffBusinessTimeRangeList"
                                    v-model:day-off-switch="dayOffBusinessTimeRangeSwitch"
                                    v-model:week-number-groups-list="modelParams.weekNumberParamList"
                                    :title="i18n.global.t('meos_control_web.business_mode')"
                                    :single-width="167"
                                    :week-number-single-width="156"
                                    :icon-size="'24px'"
                                    @change="handleBusinessHoursChange"
                                />
                                <TitlePrefix
                                    class="special-content-container"
                                    :title="i18n.global.t('meos_control_web.special_config_content')"
                                    :font-size="14"
                                    :line-height="22"
                                />
                                <SpecialConfigContent v-model="modelParams.specialConfigurationContentParamList" @change="handleSpecialChange" />
                            </template>
                            <template v-else>
                                <SpecialConfigurationInfo :model-params="modelParams" />
                            </template>
                        </m-scrollbar>
                    </m-form>
                    <div v-if="type === 'add'" class="bottom-actions">
                        <m-tips
                            :disabled="props?.configuredArr?.includes(currentNodeId)"
                            placement="top"
                            :content="i18n.global.t('meos_control_web.current_object_no_special_config_content')"
                            theme="darkTransparent"
                        >
                            <m-button type="link" size="small" :disabled="!props?.configuredArr?.includes(currentNodeId)" @click="clearConfiguration">{{
                                i18n.global.t('meos_control_web.empty_configuration')
                            }}</m-button>
                        </m-tips>
                        <m-tips :disabled="configIsChanged" placement="top" :content="i18n.global.t('meos_control_web.data_not_modified_yet')" theme="darkTransparent">
                            <m-button type="default" :disabled="!configIsChanged" @click.stop="cancelSave">{{ i18n.global.t('common.cancel') }}</m-button>
                        </m-tips>
                        <m-tips :disabled="configIsChanged" placement="top" :content="i18n.global.t('meos_control_web.data_not_modified_yet')" theme="darkTransparent">
                            <m-button type="primary" :disabled="!configIsChanged" :loading="loadingBtn" @click.stop="sureSpecialCalendarBtn('sure')">{{
                                i18n.global.t('common.confirm')
                            }}</m-button>
                        </m-tips>
                    </div>
                </div>
            </div>
        </template>
        <template #footer>
            <div class="footer-wrap-container">
                <div v-if="type === 'add'" class="left-actions">
                    <m-checkbox v-model="onlyLookSelected" :size="14">{{
                        i18n.global.t('meos_control_web.only_view_configed', {
                            name: props?.configuredArr?.length ? '(' + props?.configuredArr?.length + ')' : ''
                        })
                    }}</m-checkbox>
                    <div class="divider"></div>
                    <m-tips
                        :disabled="props?.configuredArr?.length"
                        placement="top"
                        :content="i18n.global.t('meos_control_web.no_special_object_config_available')"
                        theme="darkTransparent"
                    >
                        <m-button class="clear-btn" :disabled="!props?.configuredArr?.length" type="link" size="small" @click="clearAllConfig">{{
                            i18n.global.t('meos_control_web.clear_all_special_configurations')
                        }}</m-button>
                    </m-tips>
                </div>
                <div v-if="type !== 'add'" class="right-actions">
                    <m-button type="primary" @click.stop="close">{{ i18n.global.t('common.confirm') }}</m-button>
                </div>
            </div>
        </template>
    </m-modal>
</template>
<script lang="ts" setup>
import { getGlobalRule } from '@/apis/calendar';
import { SUCCESSCODE } from '@/utils/globalVariables';
import { MLoading, MMessageBox } from 'meri-plus';
import i18n from '@/localization';
import { nanoid } from 'nanoid';
import BusinessHours from './BusinessHours.vue';
import TitlePrefix from '@/components/title-prefix/index.vue';
import SpecialConfigContent from './SpecialConfigContent.vue';
import LeaveNotSaveModal from '@/components/leave-not-save-modal/index.vue';
import { useSpecialConfigAction } from '../hooks/useSpecialConfigAction';
import SpecialConfigurationInfo from './SpecialConfigurationInfo.vue';
import { getAfterTodayRangeSingle, initWeekNumberRange } from '../utils';
import baseStore from '@/store/baseStore';
import Empty from '@/components/common/Empty.vue';
import { BUSINESS_CONFIG_TYPE } from '../constants';

const props = defineProps({
    data: {
        type: Array,
        default: () => []
    },
    configuredArr: {
        type: Array,
        default: () => []
    },

    type: {
        type: String,
        default: ''
    }
});
const emits = defineEmits(['close', 'customFuc']);
const base = baseStore();

const specialCalendarShow = defineModel('show', { type: Boolean, default: false });

const treeRenderData = ref<any[]>([]);
const clonePropsData = ref<any[]>([]);
const onlyLookSelected = ref('uncheck');
const finalRenderTree = computed(() => {
    return onlyLookSelected.value === 'uncheck' ? clonePropsData.value : treeRenderData.value;
});
const currentModel = defineModel({ type: Array, default: () => [] });
const currentNodeId = computed(() => currentModel.value[0]);

const flattenTree = (root: any) => {
    if (!root) return [];
    const flattened = [];
    const stack = [root];
    while (stack.length > 0) {
        const node = stack.pop();
        flattened.push(node);
        if (node?.children?.length) {
            for (let i = node.children.length - 1; i >= 0; i--) {
                const newNode = node.children[i] || {};
                stack.push({ ...newNode, parentId: node.id });
            }
        }
    }
    return flattened;
};

const flattenTreeData = computed(() => flattenTree({ id: 'root', children: clonePropsData.value }));

watch(
    () => props.data,
    () => {
        if (props.data?.length) {
            treeRenderData.value = structuredClone(props.data);
            clonePropsData.value = structuredClone(props.data);
        }
    },
    {
        immediate: true
    }
);

const SpecialForm: any = ref('SpecialForm');
const modelParams = ref<any>({
    radioValue: 'Default',
    businessTimeRangeList: [{ rowTimeRange: { startTime: '', endTime: '' }, key: `full-year-${nanoid()}` }],
    workdayBusinessTimeRangeList: [{ rowTimeRange: { startTime: '', endTime: '' }, key: `work-day-${nanoid()}` }],
    dayOffBusinessTimeRangeList: [{ rowTimeRange: { startTime: '', endTime: '' }, key: `day-off-${nanoid()}` }],
    weekNumberParamList: [
        { groupId: `group-${nanoid()}`, weekNumbers: [], rangeSwitch: 'checked', rangeList: [{ rowTimeRange: { startTime: '', endTime: '' }, key: `week-number-${nanoid()}` }] }
    ],
    specialConfigurationContentParamList: [
        {
            groupId: `group-${nanoid()}`,
            dateRange: '',
            rangeSwitch: 'uncheck',
            rangeList: [{ rowTimeRange: { startTime: '', endTime: '' }, key: `week-number-${nanoid()}` }]
        }
    ]
});
const businessTimeRangeSwitch = ref('checked');
const workDayBusinessTimeRangeSwitch = ref('checked');
const dayOffBusinessTimeRangeSwitch = ref('checked');

const configIsChanged = ref(false);

const handleTimeRange = (arr: any) => {
    if (Array.isArray(arr)) {
        const list = arr.map((item: string) => {
            const startTime = item.split(',')[0].slice(0, -3);
            const endTime = item.split(',')[1].slice(0, -3);
            const finalEndTime = endTime === '23:59' ? '24:00' : endTime;
            const uniqueKey = nanoid();
            return {
                rowTimeRange: { startTime: startTime || '', endTime: finalEndTime || '' },
                key: uniqueKey
            };
        });
        if (list.length === 0) {
            return [{ rowTimeRange: { startTime: '', endTime: '' }, key: nanoid() }];
        }
        return list;
    } else {
        return [{ rowTimeRange: { startTime: '', endTime: '' }, key: nanoid() }];
    }
};

const handleSpecialRange = (arr: any) => {
    const originData = arr ?? [];
    if (originData.length === 0) {
        return [
            {
                groupId: `group-${nanoid()}`,
                dateRange: '',
                rangeSwitch: 'uncheck',
                rangeList: [{ rowTimeRange: { startTime: '', endTime: '' }, key: `week-number-${nanoid()}` }]
            }
        ];
    } else {
        const list = originData
            .map((item: any) => {
                const { timePeriod = '', specialConfigurationContentBusinessTimeRangeList = [] } = item || {};
                const hasArr = (specialConfigurationContentBusinessTimeRangeList || [])?.length;
                const rangeList = (specialConfigurationContentBusinessTimeRangeList || [])?.map((v: any) => {
                    const startTime = v.split(',')[0].slice(0, -3);
                    const endTime = v.split(',')[1].slice(0, -3);
                    const finalEndTime = endTime === '23:59' ? '24:00' : endTime;
                    return {
                        rowTimeRange: { startTime: startTime || '', endTime: finalEndTime || '' },
                        key: `week-number-${nanoid()}`
                    };
                });
                const filterPastVal = getAfterTodayRangeSingle(timePeriod);
                const start = filterPastVal?.split(',')?.[0]?.replace(/-/g, '.');
                const end = filterPastVal?.split(',')?.[1]?.replace(/-/g, '.');
                return {
                    groupId: `group-${nanoid()}`,
                    dateRange: start && end ? `${start}-${end}` : '',
                    rangeSwitch: hasArr ? 'checked' : 'uncheck',
                    rangeList: rangeList?.length
                        ? rangeList
                        : [
                              {
                                  rowTimeRange: { startTime: '', endTime: '' },
                                  key: `week-number-${nanoid()}`
                              }
                          ]
                };
            })
            .filter((v: any) => !!v?.dateRange);
        if (list.length === 0) {
            return [
                {
                    groupId: `group-${nanoid()}`,
                    dateRange: '',
                    rangeSwitch: 'uncheck',
                    rangeList: [{ rowTimeRange: { startTime: '', endTime: '' }, key: `week-number-${nanoid()}` }]
                }
            ];
        }
        return list;
    }
};

const getInitData = (resData: any) => {
    const { businessTimeRangeList, workdayBusinessTimeRangeList, dayOffBusinessTimeRangeList, weekNumberParamList, specialConfigurationContentParamList, dateTagType } =
        resData?.businessTimeRange || {};
    const businessRadio = dateTagType || BUSINESS_CONFIG_TYPE.Default;
    if (businessRadio === BUSINESS_CONFIG_TYPE.Default) {
        modelParams.value.businessTimeRangeList = handleTimeRange(businessTimeRangeList);
        if (!businessTimeRangeList?.length) {
            businessTimeRangeSwitch.value = 'uncheck';
        } else {
            businessTimeRangeSwitch.value = 'checked';
        }
    } else if (businessRadio === BUSINESS_CONFIG_TYPE.Workday) {
        if (!workdayBusinessTimeRangeList?.length) {
            workDayBusinessTimeRangeSwitch.value = 'uncheck';
        } else {
            workDayBusinessTimeRangeSwitch.value = 'checked';
        }
        if (!dayOffBusinessTimeRangeList?.length) {
            dayOffBusinessTimeRangeSwitch.value = 'uncheck';
        } else {
            dayOffBusinessTimeRangeSwitch.value = 'checked';
        }
        modelParams.value.workdayBusinessTimeRangeList = handleTimeRange(workdayBusinessTimeRangeList);
        modelParams.value.dayOffBusinessTimeRangeList = handleTimeRange(dayOffBusinessTimeRangeList);
    } else if (businessRadio === BUSINESS_CONFIG_TYPE.Week) {
        modelParams.value.weekNumberParamList = initWeekNumberRange(weekNumberParamList, true);
    }

    modelParams.value.specialConfigurationContentParamList = handleSpecialRange(specialConfigurationContentParamList);
    modelParams.value.radioValue = dateTagType;

    configIsChanged.value = false;
};

//特殊日历配置查询
const getSpecialObjectFun = (onSuccess?: any) => {
    const curNodeId = currentModel.value[0];
    if (!curNodeId) {
        return;
    }
    isLoading.value = true;

    getGlobalRule({ instanceId: curNodeId })
        .then((res: any) => {
            if (res.code === SUCCESSCODE) {
                const resData = res?.data || {};
                specialConfigMap.value?.set(curNodeId, resData);
                getInitData(resData);
                if (onSuccess) {
                    onSuccess(resData);
                }
            }
        })
        .finally(() => {
            isLoading.value = false;
        });
};

const { getValidFormData, invokeSubmit, isClearing, isSelectedClearConfig, isClearingAll, loadingBtn } = useSpecialConfigAction({
    formInstance: SpecialForm,
    modelParams,
    currentModel,
    businessTimeRangeSwitch,
    workDayBusinessTimeRangeSwitch,
    dayOffBusinessTimeRangeSwitch,
    updateCallback: () => {
        getSpecialObjectFun();
        emits('customFuc');
    }
});

const close = () => {
    leaveTempData.value = {};
    emits('close');
    nextTick(() => {
        specialCalendarShow.value = false;
    });
};
const handleModalClose = () => {
    if (configIsChanged.value && props.type === 'add') {
        leaveConfirmShow.value = true;
        leaveTempData.value = {
            done: () => {
                close();
            }
        };
    } else {
        close();
    }
};

//清空配置
const clearConfiguration = () => {
    MMessageBox({
        type: 'danger',
        title: i18n.global.t('meos_control_web.empty_configuration'),
        customClass: 'customClass',
        confirmButtonText: i18n.global.t('meos_control_web.empty_all'),
        message: `${i18n.global.t('meos_control_web.clear_all_special_configurations_confirm_tips')}`,
        hasLoading: true,
        beforeClose: async (action: any, data: any, done: any) => {
            if (action === 'confirm') {
                if (!isClearing.value) {
                    isSelectedClearConfig.value = true;
                    await sureSpecialCalendarBtn('clear');
                }

                done();
            } else {
                done();
            }
        }
    });
};

// 清除全部配置
const clearAllConfig = () => {
    if (!props?.configuredArr?.length) {
        return;
    }

    MMessageBox({
        type: 'danger',
        title: i18n.global.t('meos_control_web.clear_all_special_configurations'),
        customClass: 'customClass',
        confirmButtonText: i18n.global.t('meos_control_web.empty_all'),
        message: `${i18n.global.t('meos_control_web.clear_all_special_configurations_confirm_tips')}`,
        hasLoading: true,
        beforeClose: async (action: any, data: any, done: any) => {
            if (action === 'confirm') {
                if (!isClearingAll.value) {
                    const clearAllParams = { instanceIds: props?.configuredArr, projectId: base.projectId };
                    invokeSubmit(clearAllParams, 'clearAll', {
                        successCallback: () => {
                            getSpecialObjectFun();
                            emits('customFuc');
                            nextTick(() => {
                                const isPreChecked = onlyLookSelected.value === 'checked';
                                if (isPreChecked) {
                                    onlyLookSelected.value = 'uncheck';
                                }
                            });
                        }
                    });
                }
                done();
            } else {
                done();
            }
        }
    });
};

watch(
    () => props.type,
    curMode => {
        if (curMode === 'add') {
            onlyLookSelected.value = 'uncheck';
        } else {
            onlyLookSelected.value = 'checked';
        }
    },
    {
        immediate: true
    }
);

// 只展示部分树节点，包括非叶子节点和叶子节点，若过滤ids中有某个节点，则展示该节点直到根节点
const filterTreeByNodeIds = (treeData: any[], ids: any[]) => {
    const requiredIds = new Set();
    ids.forEach(id => {
        let currentId = id;
        while (currentId) {
            requiredIds.add(currentId);
            currentId = flattenTreeData.value.find(v => v?.id === currentId)?.parentId; // Add parent ID tracking in your node data
        }
    });

    const filterNodes = (nodes: any[]): any[] => {
        return nodes
            .filter(node => requiredIds.has(node.id))
            .map(node => ({
                ...node,
                open: props?.type === 'add' ? true : false,
                children: node.children ? filterNodes(node.children) : []
            }));
    };

    return filterNodes(treeData);
};
watch(
    [() => onlyLookSelected.value, () => clonePropsData.value, () => props.configuredArr],
    () => {
        if (onlyLookSelected.value !== 'uncheck' && clonePropsData.value?.length) {
            const newTree = filterTreeByNodeIds(clonePropsData.value, props.configuredArr);
            treeRenderData.value = newTree;
        }
    },
    {
        immediate: true
    }
);

watch(
    () => onlyLookSelected.value,
    () => {
        const finalTree = onlyLookSelected.value === 'uncheck' ? clonePropsData.value : treeRenderData.value;
        // 切换仅看已选，选中树节点第一个节点
        if (finalTree?.[0]?.id) {
            currentModel.value = [finalTree?.[0]?.id];
        }
    }
);

const isLoading = ref(false);
const loadingInstance = ref<any>();
const specialConfigMap = ref<any>(new Map());

const leaveConfirmShow = ref(false);
const leaveTempData = ref<any>(null);
const leaveSaveLoading = ref(false);

//建筑tree点击事件
const clickItemTree = (ids: any, selectNode: any, currentNode: any) => {
    if (currentNode) {
        currentModel.value = ids;
    }
};
const handleTreeBeforeClick = (curNode: any, preNode: any, done: any, type: any) => {
    // 如果编辑了内容，此时点击左侧树结构切换会出现二次弹窗提醒
    if (configIsChanged.value && props.type === 'add' && type === 'content') {
        leaveTempData.value = { nextNode: curNode, done };
        nextTick(() => {
            leaveConfirmShow.value = true;
        });
    } else {
        done();
    }
};

const handleLeave = () => {
    if (leaveTempData.value?.done) {
        SpecialForm?.value?.clearValidate?.();
        leaveConfirmShow.value = false;
        leaveTempData.value?.done?.();
        leaveTempData.value = {};
    }
};
const handleSaveLeave = async () => {
    if (leaveTempData.value?.done) {
        const validData = await getValidFormData('sure');
        // 校验失败
        if (validData === undefined || validData === null) {
            leaveConfirmShow.value = false;
            return;
        }
        leaveSaveLoading.value = true;
        try {
            const successCallback = () => {
                leaveConfirmShow.value = false;
                // 查询小黄点
                emits('customFuc');
                getSpecialObjectFun(() => {
                    nextTick(() => {
                        leaveTempData.value?.done?.();
                        leaveTempData.value = {};
                    });
                });
            };
            const failCallback = () => {
                leaveConfirmShow.value = false;
            };
            const finallyCallback = () => {
                leaveSaveLoading.value = false;
            };
            invokeSubmit(validData, 'sure', { successCallback, failCallback, finallyCallback });
        } catch (error) {
            leaveSaveLoading.value = false;
            leaveConfirmShow.value = false;
        }
    }
};

const handleBusinessHoursChange = () => {
    configIsChanged.value = true;
};

const handleSpecialChange = () => {
    configIsChanged.value = true;
};

const cancelSave = () => {
    if (currentNodeId.value) {
        const curConfig = specialConfigMap.value?.get(currentNodeId.value);
        SpecialForm?.value?.clearValidate?.();
        getInitData(curConfig || {});
    }
};

//特殊日历配置提交
const sureSpecialCalendarBtn = async (type: 'clear' | 'sure') => {
    const validData = await getValidFormData(type);
    invokeSubmit(validData, type);
};

watch([() => currentNodeId.value, () => specialCalendarShow.value], () => {
    if (currentNodeId.value && specialCalendarShow.value) {
        getSpecialObjectFun();
    }
});

watch([() => isLoading.value, () => specialCalendarShow.value], () => {
    if (isLoading.value && specialCalendarShow.value) {
        loadingInstance.value = MLoading.service({
            target: '.special-right',
            fullscreen: false,
            duration: 30000,
            lottieName: 'ball',
            loadIconStyle: {
                width: '100px',
                height: '100px'
            }
        });
    } else {
        loadingInstance.value?.destroy();
    }
});

onUnmounted(() => {
    loadingInstance.value = null;
    specialConfigMap.value.clear?.();
    specialConfigMap.value = null;
});
</script>
<style lang="less">
.special-calendar {
    .m-modal-main-content {
        padding: 0px 0px 0px 0px !important;

        .special-left {
            padding: 12px 16px 12px 24px !important;
            overflow: hidden;
        }

        .special-right {
            padding: 12px 0 56px 24px !important;
            position: relative;
        }
    }
}
</style>
<style lang="less" scoped>
.right-scrollbar {
    :deep(.m-scrollbar__content) {
        // height: 100%;
        padding-right: 24px;
        padding-bottom: 12px;
    }

    :deep(.m-radio) {
        margin-bottom: 4px;
    }
}

.box-item {
    height: 100%;

    .special-left,
    .special-right {
        height: 100%;
        // max-height: 100%;
    }

    .special-left {
        border-right: 1px solid var(--gray-300, #e1e5eb);
        // padding-right: 16px;
        // width: 46%;
        width: 400px;
    }

    .special-right {
        width: 440px;

        .config-edit-box {
            height: 100%;
        }
    }
}

.dot {
    display: inline-block;
    height: 6px;
    width: 6px;
    border-radius: 3px;
    margin-right: 8px;
    background-color: rgb(255, 184, 0);
    vertical-align: middle;
}

.footer-wrap-container {
    display: flex;
    width: 100%;
    height: 32px;
    justify-content: space-between;
}

.divider {
    width: 1px;
    height: 14px;
    background: #d9d9d9;
    margin-left: 8px;
    margin-right: 4px;
}

.left-actions {
    display: flex;
    align-items: center;

    .clear-btn {
        margin-left: 0px !important;
    }
}

.bottom-actions {
    display: flex;
    align-items: center;
    padding-top: 12px;
    padding-bottom: 12px;
    padding-right: 24px;
    justify-content: flex-end;
    gap: 12px;
}

.right-actions {
    margin-left: auto;
}

.radios-container {
    margin-bottom: 8px;
    margin-top: 16px;
}

.config-content-container {
    margin-bottom: 12px;
}

.special-content-container {
    margin-top: 12px;
    margin-bottom: 12px;
}

.empty-right {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
