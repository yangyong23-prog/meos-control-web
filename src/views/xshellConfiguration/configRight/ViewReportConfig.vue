<template>
    <div class="config-container">
        <template v-if="reportBuildGroups.length">
            <title-type class="row" :title="i18n.global.t('meos_control_web.report_generate_config')" />
            <m-form ref="FormInstance" :model="reportBuildData" :label-position="'left'" scroll-to-error>
                <div class="card-container">
                    <m-form-item
                        :label="i18n.global.t('meos_control_web.daily_report_enabled')"
                        prop="isGenerate"
                        :rules="[{ required: true, message: i18n.global.t('meos_control_web.please_input_required') }]"
                    >
                        <m-radio-group v-model="reportBuildData.isGenerate">
                            <m-radio v-for="item in radios" :key="item.code" :label="item.code" :size="14" style="margin-right: 16px"> {{ item.name }}</m-radio>
                        </m-radio-group>
                    </m-form-item>
                    <m-form-item
                        v-show="showReport"
                        :label="i18n.global.t('meos_control_web.daily_report_time_range')"
                        prop="generateTimeRange"
                        :rules="[{ required: true, message: i18n.global.t('meos_control_web.please_input_required') }]"
                    >
                        <I18nSlot html-tag="div" name-key="meos_control_web.daily_report_time_range_slot" class="slot-container">
                            <template #range>
                                <m-date-picker
                                    v-model="reportBuildData.generateTimeRange"
                                    year-select-hide
                                    format="MM.DD"
                                    type="daterange"
                                    :placeholder="i18n.global.t('meos_control_web.start_year_date_to_end_year_date')"
                                    :width="240"
                                    class="picker"
                                ></m-date-picker>
                            </template>
                        </I18nSlot>
                    </m-form-item>
                    <m-form-item
                        v-show="showReport"
                        :label="i18n.global.t('meos_control_web.report_generate_time')"
                        prop="generateTime"
                        :rules="[
                            {
                                required: true,
                                message: i18n.global.t('meos_control_web.please_input_required')
                            }
                        ]"
                    >
                        <AcrossDayWithRange v-model="reportBuildData.generateTime" :options="daysSelectOptions" />
                    </m-form-item>
                </div>
            </m-form>
        </template>
        <template v-if="reportChapterGroups.length">
            <title-type class="row" :title="i18n.global.t('meos_control_web.report_pages_config')" />
            <div class="drag-card-container">
                <VueDraggable v-model="reportChapterData" animation="200" handle=".node-drag-icon" chosen-class="chosen" force-fallback fallback-on-body>
                    <TreeItem
                        v-for="item in reportChapterData"
                        :key="item.code"
                        v-model:node-data="item.data"
                        v-model:node-children="item.children"
                        :node="{
                            name: item.name,
                            code: item.code,
                            defaultName: item.defaultName
                        }"
                        :level="1"
                    >
                    </TreeItem>
                </VueDraggable>
            </div>
        </template>
        <div v-if="isAllEmpty" class="no-data-container">
            <Empty :text="i18n.global.t('meos_control_web.no_content')" />
        </div>
    </div>
</template>

<script setup>
import { VueDraggable } from 'vue-draggable-plus';
import { $Message } from 'meri-plus';
import emitter from '@/utils/bus';
import i18n from '@/localization';
import I18nSlot from '@/components/I18nSlot.vue';
import { GeneralZone, SUCCESSCODE } from '@/utils/globalVariables';
import { shellConfigQuery, getSpaceListObject, shellConfigSave } from '@/apis/xshellConfiguration';
import treeBuildFloorStore from '@/store/treeBuildFloor';

import TreeItem from './TreeItem.vue';
import titleType from './common/titleType.vue';
import AcrossDayWithRange from './common/AcrossDayWithRange.vue';
import { findNodesWithDataProperty, convertConfigDataToTree, updateConfigDataFromTree } from '../utils';
import { spaceListWithTdbInjectKey, getTdbSpacesLoadingInjectKey } from '../constants/injectKey';
import { fetchAbortControllerInjectKey, loadingInstanceInjectKey, useShellConfigLoading } from '../hooks/useGlobalData';
import Empty from '@/components/common/Empty.vue';
import { ACTIVE_MENUS_ID_ENUM } from '../constants/enums';

const radios = [
    { code: 'yes', name: i18n.global.t('common.yes') },
    { code: 'no', name: i18n.global.t('common.no') }
];
const daysSelectOptions = [
    {
        id: 'current',
        name: i18n.global.t('meos_control_web.today1')
    },
    {
        id: 'next',
        name: i18n.global.t('meos_control_web.next_day')
    }
];
const loadingInstance = inject(loadingInstanceInjectKey);
const fetchAbortController = inject(fetchAbortControllerInjectKey);
const { showLoading, hideLoading } = useShellConfigLoading();

const reportBuildGroups = ref([]);
const reportChapterGroups = ref([]);
const reportBuildData = ref({ isGenerate: 'yes', generateTimeRange: '', generateTime: { acrossDay: 'next', beginTime: '' } });
const reportChapterData = ref([]);
const initBuildData = ref({ isGenerate: 'yes', generateTimeRange: '', generateTime: { acrossDay: 'next', beginTime: '' } });
const initChapterData = ref([]);
// 查询回显完成前关闭脏判定，避免加载期误报 confirmDisabled
const isLoaded = ref(false);

const isAllEmpty = computed(() => {
    return !reportBuildGroups.value.length && !reportChapterGroups.value.length;
});

const showReport = computed(() => {
    return reportBuildData.value.isGenerate === 'yes';
});

const QUERY_SCENE_NAME = 'report';
const LEFT_ACTIVE_MENU_ID = ACTIVE_MENUS_ID_ENUM.VIEW_REPORT_CONFIG;

const FormInstance = ref(null);
const allTdbSpaces = ref([]);
// 获取配置
const getShellConfigQuery = async () => {
    showLoading();
    isLoaded.value = false;

    reportBuildGroups.value = [];
    reportChapterGroups.value = [];

    fetchAbortController.value?.abort?.();
    fetchAbortController.value = new AbortController();

    const res = await shellConfigQuery({ scene: QUERY_SCENE_NAME }, fetchAbortController.value.signal).finally(() => {
        hideLoading();
    });
    if (res.code === SUCCESSCODE && Array.isArray(res.data)) {
        const buildArr = [];
        const chapterArr = [];
        res.data.forEach(group => {
            if (Array.isArray(group?.groups)) {
                group.groups.forEach(obj => {
                    try {
                        // 报告生成配置
                        if (obj.group === 'group_report_build') {
                            buildArr.push(obj);
                            const { shellConfigValue: isGenerate } = (obj.items || []).find(item => item.code === 'report_build_switch') || {};
                            reportBuildData.value.isGenerate = isGenerate || 'yes';

                            const { shellConfigValue: generateTimeRange } = (obj.items || []).find(item => item.code === 'report_build_time_range') || {};
                            const { startTime, endTime } = JSON.parse(generateTimeRange || '{}');
                            if (startTime && endTime) {
                                const changeFormatTime = str => str.replaceAll('-', '.');
                                reportBuildData.value.generateTimeRange = `${changeFormatTime(startTime)}-${changeFormatTime(endTime)}`;
                            }

                            const { shellConfigValue: generateTime } = (obj.items || []).find(item => item.code === 'report_build_time') || {};
                            const { acrossDay, time } = JSON.parse(generateTime || '{}');
                            if (acrossDay?.toString()) {
                                // reportBuildData.value.generateTime.acrossDay = acrossDay !== 'false' ? 'next' : 'current';
                                // 回显默认次日
                                reportBuildData.value.generateTime.acrossDay = 'next';
                            }
                            if (time) {
                                reportBuildData.value.generateTime.beginTime = time;
                            }
                        } else if (obj.group === 'group_report_chapter') {
                            chapterArr.push(obj);
                            // 报告章节配置
                            const tree = convertConfigDataToTree(obj.items || []);
                            reportChapterData.value = tree;
                        }
                    } catch (error) {
                        console.log('json parse error', error);
                        return;
                    }
                });
            }
        });
        initBuildData.value = structuredClone(toRaw(reportBuildData.value));
        initChapterData.value = structuredClone(toRaw(reportChapterData.value));
        reportBuildGroups.value = buildArr;
        reportChapterGroups.value = chapterArr;
    }

    nextTick(() => {
        emitter.emit('confirmDisabled', { status: true, isSave: true });

        isLoaded.value = true;
    });

    return res;
};

// 更新配置
const updateshellConfig = () => {
    const treeDataFilter = reportChapterData.value?.filter(v => !!v);

    const [buildGroup] = structuredClone(toRaw(reportBuildGroups.value));
    const [chapterGroup] = structuredClone(toRaw(reportChapterGroups.value));
    const buildSubmitData = [];

    (buildGroup.items || []).forEach(item => {
        const cloneItem = { code: item.code, value: item.shellConfigValue };
        if (item.code === 'report_build_switch') {
            cloneItem.value = reportBuildData.value.isGenerate;
        } else if (item.code === 'report_build_time_range') {
            const [start, end] = reportBuildData.value.generateTimeRange?.split('-') || [];
            const changeFormatTime = str => str?.replaceAll('.', '-');
            cloneItem.value = JSON.stringify({
                startTime: changeFormatTime(start) || '',
                endTime: changeFormatTime(end) || ''
            });
        } else if (item.code === 'report_build_time') {
            cloneItem.value = JSON.stringify({
                acrossDay: reportBuildData.value.generateTime?.acrossDay === 'next' ? 'true' : 'false',
                time: reportBuildData.value.generateTime?.beginTime || '00:00'
            });
        }
        buildSubmitData.push(cloneItem);
    });
    buildGroup.items = buildSubmitData;

    const treeDataSubmit = updateConfigDataFromTree(chapterGroup?.items, treeDataFilter);
    const chapterSubmitData = treeDataSubmit.map(v => ({ code: v?.code, value: v?.shellConfigValue }));
    chapterGroup.items = chapterSubmitData;

    const groups = [buildGroup, chapterGroup];

    shellConfigSave({
        scene: QUERY_SCENE_NAME,
        groups
    }).then(res => {
        if (res.code === SUCCESSCODE) {
            $Message.success({ title: i18n.global.t('meos_control_web.configuration_success') });
            getShellConfigQuery();
        }
    });
};

emitter.off('InputEmitter');
emitter.on('InputEmitter', data => {
    if (data.menu === LEFT_ACTIVE_MENU_ID) {
        if (data.type === 'confirm') {
            formValidate(data.menu);
        } else if (data.type === 'cancel') {
            reportBuildData.value = structuredClone(toRaw(initBuildData.value));
            reportChapterData.value = structuredClone(toRaw(initChapterData.value));
            nextTick(() => {
                emitter.emit('confirmDisabled', { status: true, isSave: true });
            });
        } else {
            formValidate();
        }
    }
});

// 验证
const formValidate = data => {
    if (data !== LEFT_ACTIVE_MENU_ID) {
        return;
    }
    nextTick(() => {
        if (reportBuildData.value.isGenerate !== 'yes') {
            // 不生成日报时，跳过校验，直接更新配置
            updateshellConfig();
            return;
        }
        FormInstance.value?.validate(isValid => {
            if (!isValid) {
                $Message.error({ title: i18n.global.t('meos_control_web.error_items_exist_please_check') });
                return;
            } else {
                const treeData = reportChapterData.value;
                const treeWithLinkButtonNodes = findNodesWithDataProperty(treeData, 'linkButton');
                const treeWithCheckedNodes = findNodesWithDataProperty(treeData, 'checked', 'checked');
                let errorTips = '';
                for (const item of treeWithLinkButtonNodes) {
                    if (item.data.linkButton) {
                        let hasError = false;
                        const isUncheck = item?.data?.checked !== 'checked' && item?.data?.checked !== 'notNull';
                        // const isUncheck = item?.data?.checked === 'uncheck';
                        if (isUncheck) continue;
                        const { selectedModelId, selectedTreeIds, spaces, benchmark } = JSON.parse(item.data?.modalValue || '{}');
                        if (item?.code === 'report_chapter_energy_analysis') {
                            hasError = !selectedModelId || !selectedTreeIds?.length;
                        } else if (item?.code === 'report_chapter_energy_budget') {
                            hasError = !benchmark;
                        } else if (item?.code === 'report_chapter_env_quality') {
                            hasError = !spaces?.length;
                        }
                        if (hasError) {
                            errorTips = `${i18n.global.t('meos_control_web.please_config')}「${item.data.linkButton}」`;
                            break;
                        }
                    } else {
                        continue;
                    }
                }
                if (treeWithCheckedNodes?.length) {
                    if (
                        treeWithCheckedNodes.every(item => {
                            const isUncheck = item?.data?.checked !== 'checked' && item?.data?.checked !== 'notNull';
                            return isUncheck;
                        })
                    ) {
                        errorTips = i18n.global.t('meos_control_web.please_select_at_least_one_item');
                    }
                } else {
                    errorTips = i18n.global.t('meos_control_web.please_select_at_least_one_item');
                }
                if (errorTips) {
                    $Message.error({ title: errorTips });
                } else {
                    // 更新配置
                    updateshellConfig();
                }
            }
        });
    });
};

const getBuildingFloors = () => {
    return treeBuildFloorStore().handleTreeBuildingFloorData();
};

const tdbSpacesAbortController = ref();
const getTdbSpacesLoading = ref(false);

const getTdbSpaces = async () => {
    getTdbSpacesLoading.value = true;
    tdbSpacesAbortController.value?.abort?.();
    tdbSpacesAbortController.value = new AbortController();
    const res = await getSpaceListObject(
        { filterClassCodes: [GeneralZone], withColumns: ['id', 'localName', 'floorId'], filterInfoCodeRules: ['tdb'] },
        { signal: tdbSpacesAbortController.value.signal }
    ).finally(() => {
        getTdbSpacesLoading.value = false;
    });
    if (res?.code === SUCCESSCODE) {
        allTdbSpaces.value = res?.data || [];
    }
    return res;
};

provide(spaceListWithTdbInjectKey, allTdbSpaces);
provide(getTdbSpacesLoadingInjectKey, getTdbSpacesLoading);

onMounted(() => {
    Promise.allSettled([getShellConfigQuery(), getBuildingFloors(), getTdbSpaces()]);
});

watch(
    [() => reportBuildData.value, () => reportChapterData.value],
    () => {
        if (isLoaded.value) {
            emitter.emit('confirmDisabled', { status: false, isSave: true });
        }
    },
    {
        immediate: true,
        deep: true
    }
);

onUnmounted(() => {
    tdbSpacesAbortController.value?.abort?.();
    emitter.off('InputEmitter');
    loadingInstance.value?.destroy?.();
});
</script>

<style scoped lang="less">
.config-container {
    display: flex;
    flex-direction: column;
    padding-inline: 16px;
}
.row {
    margin-bottom: 10px;
}
.card-container {
    padding-left: 24px;

    .slot-container {
        display: flex;
        align-items: center;
    }
    :deep(.picker.m-date-picker) {
        margin-inline: 10px;
    }

    .with-date-picker {
        display: flex;
        align-items: center;
        gap: 10px;
    }

    :deep(.m-form-item__label) {
        min-width: 144px;
        color: #000;
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 22px;
    }
}
.drag-card-container {
    padding-left: 20px;
}
.chosen {
    opacity: 0.5;
}
.no-data-container {
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
}
</style>
