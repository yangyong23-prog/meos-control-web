<template>
    <div class="efficiency-metrics-container">
        <div class="efficiency-title-container">
            <objectTemplate
                v-model="allModelData.metricsTabActive"
                :title="i18n.global.t('meos_control_web.central_hvac_cooling_full_system')"
                name="efficiency_metrics"
                :tab-data="allModelData.metricsTabList"
                :always-show="true"
                :show-new-empty="true"
                @second-tab-change="secondTabChange"
            >
                <div class="efficiency-form-container">
                    <xShellFormList
                        ref="metricsFormRef"
                        :label-width="'170px'"
                        :xshell-params="allModelData"
                        :data-list="allModelData.metricsTabActiveData"
                        @form-item-modify="checkFormItemModify"
                    />
                </div>
            </objectTemplate>
        </div>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import { $Message, MLoading } from 'meri-plus';
import { shellConfigQuery } from '@/apis/xshellConfiguration';
import { SUCCESSCODE } from '@/utils/globalVariables';
import emitter from '@/utils/bus';

import xShellFormList from './common/xshellFormList.vue';
import usePreSavedAndDefault from '../hooks/usePreSavedAndDefault';
import { formatterValue, updateshellConfigSave } from '../utils/tools';
import { checkGlobalModify, checkValidStatus } from '../utils/index';
import objectTemplate from './common/objectTemplate.vue';
import { fetchAbortControllerInjectKey, loadingInstanceInjectKey } from '../hooks/useGlobalData';
import { ACTIVE_MENUS_ID_ENUM } from '../constants/enums';

const emit = defineEmits(['defaultRestoreAll']);
const fetchAbortController = inject(fetchAbortControllerInjectKey);
const loadingInstance = inject(loadingInstanceInjectKey);

const QUERY_SCENE_NAME = 'eff';
const LEFT_ACTIVE_MENU_ID = ACTIVE_MENUS_ID_ENUM.EFFICIENCY_METRICS;

const allModelData = reactive({
    metricsTabActive: '',
    metricsTabList: [],
    metricsTabActiveData: [],
    metricsAllTabsData: [],
    metricsErrorData: [],

    allItems: [],
    defaultItem: []
});
const metricsFormRef = ref(null);

// 验证
const formValidate = data => {
    nextTick(() => {
        Promise.all([
            metricsFormRef.value.Mform.validate(valid => {
                // 记录当前tab的错误状态
                checkValidStatus(allModelData.metricsErrorData, valid, allModelData.metricsTabActive);
                return valid;
            })
        ]).then(function (results) {
            if (results.includes(undefined)) {
                // emitter.emit('confirmDisabled', { status: true, isSave: false });
                if (data === LEFT_ACTIVE_MENU_ID) {
                    $Message.error({ title: i18n.global.t('meos_control_web.error_items_exist_please_check') });
                    metricsFormRef.value?.scrollIntoField?.();
                }

                // metricsFormRef.value.Mform?.scrollToField?.();

                return;
            }
            if (data === LEFT_ACTIVE_MENU_ID) {
                const errList = checkAllTabsError();
                if (errList?.length) {
                    const firstErrTabId = errList[0]?.split('-')?.[0];
                    if (firstErrTabId) {
                        allModelData.metricsTabActive = firstErrTabId;
                        secondTabChange({ id: firstErrTabId }, 'efficiency_metrics');
                        $Message.error({ title: i18n.global.t('meos_control_web.error_items_exist_please_check') });
                        nextTick(() => {
                            metricsFormRef.value?.scrollIntoField?.();
                        });
                    }
                } else {
                    // 更新配置
                    updateshellConfig();
                }

                return;
            }
        });
    });
};

const { checkFormItemModify, allModifyItems } = usePreSavedAndDefault(emit, formValidate);

const checkAllItems = () => {
    const preSavedItems = allModelData.defaultItem?.flatMap(v => v?.items) || [];
    allModelData.allItems.forEach(group => {
        group.items.forEach(item => {
            // 初始化判断，是否展示批量恢复默认按钮，此时未编辑因此确认按钮应该是置灰的
            const leftModifyItem = checkGlobalModify(item.valueInputLeft, item, 'left', preSavedItems);
            checkFormItemModify(leftModifyItem);
            const rightModifyItem = checkGlobalModify(item.valueInputRight, item, 'right', preSavedItems);
            checkFormItemModify(rightModifyItem);
        });
    });
};

const checkRowValidError = (row, item) => {
    const leftCount = row.find(v => v?.key === item?.key - 1)?.count;
    const rightCount = row.find(v => v?.key === item?.key + 1)?.count;
    const isLeftError = leftCount?.toString() && item?.count?.toString() && parseFloat(`${leftCount}`) > parseFloat(`${item?.count}`);
    const isRightError = rightCount?.toString() && item?.count?.toString() && parseFloat(`${rightCount}`) < parseFloat(`${item?.count}`);
    const isLeftEqual = leftCount?.toString() && item?.count?.toString() && parseFloat(`${leftCount}`) === parseFloat(`${item?.count}`);
    const isRightEqual = rightCount?.toString() && item?.count?.toString() && parseFloat(`${rightCount}`) === parseFloat(`${item?.count}`);

    let errStr;
    if ((item?.count ?? '') === '') {
        errStr = i18n.global.t('meos_control_web.input_required_check_error_4');
    } else if (isRightError || isRightEqual) {
        errStr = i18n.global.t('meos_control_web.number_check_error_3') || i18n.global.t('meos_control_web.left_must_be_less_than_right');
    } else if (isLeftError || isLeftEqual) {
        errStr = i18n.global.t('meos_control_web.number_check_error_1') || i18n.global.t('meos_control_web.left_must_be_less_than_right');
    } else {
        errStr = '';
    }

    if (item?.disabledTips) {
        return '';
    }

    return errStr;
};

const checkAllTabsError = () => {
    const errorSet = new Set();
    allModelData.allItems.forEach(group => {
        if (group.group === 'group_control_air_cooling_eff') {
            group.items.forEach(item => {
                if (Array.isArray(item.valueInputLeft)) {
                    item.valueInputLeft.forEach(val => {
                        const errStr = checkRowValidError(item.valueInputLeft, val);
                        if (errStr) {
                            errorSet.add(`${item.objectId}-${item.code}-${errStr}`);
                        }
                    });
                }
            });
        }
    });
    return [...errorSet];
};

// 二级tab数据列表
const objectTabs = data => {
    const tabList = [];
    data.forEach(code => {
        if (code.tabObjectName) {
            const hasPreId = tabList?.some(v => v?.id === code.tabObjectName);
            if (!hasPreId) {
                tabList.push({
                    id: code.tabObjectName,
                    name: code.tabObjectName
                });
            }
        } else if (code.objectId) {
            const hasPreId = tabList?.some(v => v?.id === code.objectId);
            if (!hasPreId) {
                tabList.push({
                    id: code.objectId,
                    name: code.objectName
                });
            }
        }
    });
    const tabOn = tabList?.[0]?.id;

    const initTabData = formatterValue(data).filter(item => {
        if (item.tabObjectName) {
            return item.tabObjectName === tabOn;
        }
        return item.objectId === tabOn;
    });
    const groupByObjectId = Object.groupBy(initTabData, res => res?.objectId);
    const tabData = Object.values(groupByObjectId).flat();
    const errorData = tabList.map(item => {
        return {
            id: `${item.id}`,
            isValid: true
        };
    });

    return {
        tabList,
        tabOn,
        tabData,
        errorData
    };
};

const filterSecondTab = (allData, params) => {
    // 是否有五级分类
    const curTabList = allData?.filter(v => v?.tabObjectName === params?.id) || [];

    if (curTabList?.length) {
        const groupByObjectId = Object.groupBy(curTabList, res => res?.objectId);
        const final = Object.values(groupByObjectId).flat();
        return final;
    } else {
        const final = allData?.filter(item => item.objectId === params.id);
        return final;
    }
};

const secondTabChange = (data, name) => {
    switch (name) {
        case 'efficiency_metrics':
            allModelData.metricsTabActiveData = filterSecondTab(allModelData.metricsAllTabsData, data);
            // 每次切换tab，校验切换tab前的表单数据
            formValidate();
            // 触发disable，confirm 验证
            nextTick(() => {
                metricsFormRef.value.checkAllItemsModify?.();
            });
            break;
        default:
            break;
    }
};

const resetData = () => {
    allModelData.metricsTabActive = '';
    allModelData.metricsTabList = [];
    allModelData.metricsTabActiveData = [];
    allModelData.metricsAllTabsData = [];
    allModelData.metricsErrorData = [];

    allModelData.defaultItem = [];
    allModelData.allItems = [];
};

// 获取配置
const getShellConfigQuery = async () => {
    loadingInstance.value?.destroy?.();
    loadingInstance.value = MLoading.service({
        target: '.shell-config-right-box',
        fullscreen: false,
        duration: 30000,
        lottieName: 'ball',
        loadIconStyle: {
            width: '100px',
            height: '100px'
        }
    });
    try {
        resetData();
        fetchAbortController.value?.abort?.();
        fetchAbortController.value = new AbortController();
        const res = await shellConfigQuery({ scene: QUERY_SCENE_NAME }, fetchAbortController.value.signal).finally(() => {
            loadingInstance.value?.destroy?.();
        });
        if (res.code === SUCCESSCODE && Array.isArray(res.data)) {
            res?.data.forEach(group => {
                if (Array.isArray(group?.groups)) {
                    group.groups.forEach(item => {
                        allModelData.allItems.push(item);
                        switch (item.group) {
                            case 'group_control_air_cooling_eff':
                                allModelData.metricsAllTabsData = formatterValue(item.items);
                                allModelData.metricsTabList = objectTabs(item.items).tabList;
                                allModelData.metricsTabActive = objectTabs(item.items).tabOn;
                                allModelData.metricsTabActiveData = objectTabs(item.items).tabData;
                                allModelData.metricsErrorData = objectTabs(item.items).errorData;
                                break;
                            default:
                                break;
                        }
                    });
                }
            });
            allModelData.defaultItem = structuredClone(allModelData.allItems);
            checkAllItems();
        }
    } catch (error) {
        resetData();
    }
};

onMounted(() => {
    getShellConfigQuery();
});

// 更新配置
const updateshellConfig = () => {
    loadingInstance.value?.destroy?.();
    loadingInstance.value = MLoading.service({
        target: '.shell-config-right-box',
        fullscreen: false,
        duration: 30000,
        lottieName: 'ball',
        loadIconStyle: {
            width: '100px',
            height: '100px'
        }
    });
    updateshellConfigSave(QUERY_SCENE_NAME, allModelData.allItems)
        .then(res => {
            if (res.code === SUCCESSCODE) {
                $Message.success({ title: i18n.global.t('common.save_success') });

                nextTick(() => {
                    emitter.emit('confirmDisabled', { status: true, isSave: true });
                    allModifyItems.value = [];
                    getShellConfigQuery();
                });
            }
        })
        .finally(() => {
            loadingInstance.value?.destroy?.();
        });
};

emitter.off('InputEmitter');
emitter.on('InputEmitter', data => {
    const preSavedItems = allModelData.defaultItem?.flatMap(v => v?.items) || [];
    if (data.menu === LEFT_ACTIVE_MENU_ID) {
        if (data.type === 'confirm') {
            //  提交
            formValidate(LEFT_ACTIVE_MENU_ID);
        } else if (data.type === 'cancel') {
            // 取消
            allModelData.allItems.forEach(group => {
                group.items.forEach(item => {
                    const preSavedItem = preSavedItems?.find(v => v?.code === item?.code && (v?.objectId === item?.objectId || !v?.objectId));
                    item.valueInputLeft = structuredClone(preSavedItem.valueInputLeft);
                    item.valueInputRight = structuredClone(preSavedItem.valueInputRight);

                    // 取消后，需再次判断相对上次保存的值是否有变更，是否禁用确认按钮
                    const leftModifyItem = checkGlobalModify(item.valueInputLeft, item, 'left', preSavedItems);
                    checkFormItemModify(leftModifyItem);
                    const rightModifyItem = checkGlobalModify(item.valueInputRight, item, 'right', preSavedItems);
                    checkFormItemModify(rightModifyItem);
                });
            });
            // 校验当前tab数据
            formValidate();
            emitter.emit('confirmDisabled', { status: true, isSave: true });
        } else if (data.type === 'reset') {
            // 恢复默认
            allModelData.allItems.forEach(group => {
                group.items.forEach(item => {
                    item.valueInputLeft = structuredClone(item.defaultValueLeft);
                    item.valueInputRight = structuredClone(item.defaultValueRight);

                    // 批量恢复默认后，需再次判断相对上次保存的值是否有变更，是否禁用确认按钮
                    const leftModifyItem = checkGlobalModify(item.valueInputLeft, item, 'left', preSavedItems);
                    checkFormItemModify(leftModifyItem);
                    const rightModifyItem = checkGlobalModify(item.valueInputRight, item, 'right', preSavedItems);
                    checkFormItemModify(rightModifyItem);
                });
            });
            // 校验当前tab数据
            formValidate();
        }
    }
});

onBeforeUnmount(() => {
    emitter.off('InputEmitter');
});

watch(
    () => [allModelData.metricsErrorData],
    cur => {
        // 监听所有tab的错误数据，确认是否禁用confirm
        const allErr = cur?.flatMap(v => v?.map(obj => obj.isValid));
        const hasError = allErr.some(v => v === false);
        if (hasError) {
            // emitter.emit('confirmDisabled', { status: true, isSave: true });
            return;
        }
    },
    { deep: true }
);
</script>

<style lang="less" scoped>
.efficiency-metrics-container {
    min-width: calc(1280px - 296px);
    display: flex;
    flex-direction: column;
    padding-inline: 16px;
    padding-bottom: 14px;

    .efficiency-title-container {
        :deep(.m-tabs) {
            margin-top: 12px;
            margin-left: 0px;
            margin-bottom: 10px;
        }
    }

    .efficiency-form-container {
        margin-top: 12px;
        padding-right: 16px;
        :deep(.form-box) {
            margin-bottom: 0px;
        }
        :deep(.form-box-data) {
            margin-top: 0px;
        }
        :deep(.full-width.m-form-item) {
            margin-bottom: 10px;
        }
        :deep(.form-item-left) {
            margin-left: 0px;
        }
    }
}
</style>
