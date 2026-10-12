<template>
    <div class="timetable" :class="customClass" :style="{ zIndex: zIndex }">
        <m-scrollbar box-class="timetable-scrollbar">
            <div class="timetable-content">
                <!-- 头部筛选区域 -->
                <TimetableHeader
                    :style="headerStyle"
                    :system-info="systemInfo"
                    :show-back-button="showBackButton"
                    :show-search="false"
                    @go-back="handleGoBack"
                    @change-params="handleParamsChange"
                    @change-weeks-params="handleWeeksParamsChange"
                >
                    <template #append>
                        <slot name="headerExtra" :system-info="systemInfo">
                            <div class="header-actions fc" style="gap: 8px">
                                <!-- 新建按钮区域 -->
                                <template v-if="showCreateButton">
                                    <template v-if="buttonType === 'dropdown'">
                                        <m-dropdown
                                            v-if="!disabled"
                                            type="button"
                                            :options="dropdownOptions"
                                            :text="t('meos_control_web.create_new_schedule')"
                                            @option-click="handleCreateClick"
                                        />
                                        <SetButton v-else type="primary">{{ t('meos_control_web.create_new_schedule') }}</SetButton>
                                    </template>
                                    <SetButton v-else-if="buttonType === 'coolSupply'" type="primary" @click="handleCreateClick('COOL_SUPPLY')">
                                        {{ t('meos_control_web.create_new_cooling_schedule') }}
                                    </SetButton>
                                    <SetButton v-else-if="buttonType === 'coolInput'" type="primary" @click="handleCreateClick('COOL_INPUT')">
                                        {{ t('meos_control_web.create_new_thermal_storage_schedule') }}
                                    </SetButton>
                                    <SetButton v-else-if="buttonType === 'airTerminalZone'" type="primary" @click="handleCreateClick('AIR_TERMINAL_ZONE')">
                                        {{ t('meos_control_web.create_new_schedule') }}
                                    </SetButton>
                                </template>

                                <!-- 批量删除按钮 -->
                                <SetButton v-if="showBatchDelete" id="del-btn" type="default" @click="handleBatchDelete">
                                    {{ t('meos_control_web.batch_delete') }}
                                </SetButton>

                                <!-- 批量删除弹窗 -->
                                <m-popover
                                    popover-class="del-popover"
                                    virtual-triggering
                                    :content="t('meos_control_web.i_am_hint_text')"
                                    :virtual-ref="deleteBtnRef"
                                    trigger="manually"
                                    :is-open="isDeletePopoverOpen"
                                >
                                    <template #content>
                                        <div style="min-width: 280px">
                                            <slot name="deleteForm" :on-cancel="closeDeletePopover" :on-submit="submitDeletePopover">
                                                <div>删除表单内容</div>
                                            </slot>
                                        </div>
                                    </template>
                                </m-popover>
                            </div>
                        </slot>
                    </template>
                </TimetableHeader>

                <!-- 周视图 -->
                <template v-if="viewType === 'weeks'">
                    <div class="calendar-weeks" :style="{ height: 'calc(100% - 45px)' }">
                        <WeeklyCalendar :system-info="systemInfo" @edit="handleEdit" />
                    </div>
                </template>

                <!-- 月视图 -->
                <template v-else>
                    <div class="f" :style="{ height: 'calc(100% - 40px)' }">
                        <div class="calendar-month">
                            <MonthlyCalendar ref="calendarRef" :system-info="systemInfo" />
                        </div>
                        <div class="to-day-item">
                            <div v-if="isLoading" style="padding: 8px">
                                <slot name="loading">
                                    <m-list-skeleton />
                                </slot>
                            </div>
                            <DayItem v-else type="month" :system-info="systemInfo" @edit="handleEdit" />
                        </div>
                    </div>
                    <div class="to-day-item">
                        <div v-if="isLoading" style="padding: 8px">
                            <slot name="loading">
                                <m-list-skeleton />
                            </slot>
                        </div>
                        <DayItem v-else type="month" :system-info="systemInfo" @edit="handleEdit" />
                    </div>
                </template>
            </div>
        </m-scrollbar>

        <!-- 编辑弹窗 -->
        <slot name="editor" :visible="showEditor" :params="editorParams" :on-close="closeEditor" :on-saved="handleSaved">
            <EditorModal
                v-if="showEditor"
                v-model="showEditor"
                :console-type="editorParams.consoleType"
                :system-type="systemType"
                :object-id="editorObjectId"
                :current-date="editorParams.currentDate"
                @after-saved="handleSaved"
            />
        </slot>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, provide, nextTick, type PropType } from 'vue';
import { useI18n } from 'vue-i18n';
import { Z_INDEX } from '@/constants/zIndex';
import SetButton from '@/components/common/SetButton.vue';
import TimetableHeader from './components/TimetableHeader.vue';
import MonthlyCalendar from './components/MonthlyCalendar.vue';
import WeeklyCalendar from './components/WeeklyCalendar.vue';
import DayItem from './components/DayItem.vue';
import EditorModal from './components/EditorModal/index.vue';
import { useTimetableState } from './hooks/useTimetableState';
import { type SystemInfo, type SystemType, type CalendarViewType, type EditorModalParams, type TimetableDataLoader } from './types';

// Props 定义
const props = defineProps({
    /** 系统信息 */
    systemInfo: {
        type: Object as PropType<SystemInfo>,
        required: true
    },
    /** 初始视图类型 */
    defaultViewType: {
        type: String as PropType<CalendarViewType>,
        default: 'weeks'
    },
    /** 是否显示返回按钮 */
    showBackButton: {
        type: Boolean,
        default: true
    },
    /** 是否显示新建按钮 */
    showCreateButton: {
        type: Boolean,
        default: true
    },
    /** 是否显示批量删除按钮 */
    showBatchDelete: {
        type: Boolean,
        default: true
    },
    /** 是否禁用操作 */
    disabled: {
        type: Boolean,
        default: false
    },
    /** 按钮类型 */
    buttonType: {
        type: String as PropType<'dropdown' | 'coolSupply' | 'coolInput' | 'airTerminalZone' | null>,
        default: null
    },
    /** 下拉选项 */
    dropdownOptions: {
        type: Array as PropType<Array<{ label: string; key: string }>>,
        default: () => []
    },
    /** 自定义类名 */
    customClass: {
        type: String,
        default: ''
    },
    /** 数据加载函数 */
    dataLoader: {
        type: Function as PropType<TimetableDataLoader>,
        default: undefined
    },
    /** 系统类型 */
    systemType: {
        type: String,
        default: 'ACAC'
    },
    /** 项目 ID */
    projectId: {
        type: String,
        default: ''
    },
    zIndex: {
        type: Number,
        default: Z_INDEX.timetable
    }
});

// Emits 定义
const emit = defineEmits<{
    (e: 'goBack'): void;
    (e: 'create', type: SystemType): void;
    (e: 'edit', params: EditorModalParams): void;
    (e: 'delete', ids: string[]): void;
    (e: 'viewTypeChange', type: CalendarViewType): void;
    (e: 'dateChange', date: { start: string; end: string }): void;
    (e: 'dataLoaded', data: any[]): void;
}>();

// 暴露方法
defineExpose({
    refresh: () => loadData(true),
    getViewType: () => viewType.value,
    getDateRange: () => ({ start: getBeginDate(), end: getEndDate() }),
    getSelectedDate: () => rightToDay.value
});

const { t } = useI18n();

// 状态管理
const systemInfoRef = computed(() => props.systemInfo);
const {
    toDay,
    monthDate,
    weeksDate,
    tabsType: viewType,
    dataItem,
    isLoading,
    rightToDay,
    loadData,
    setProjectId,
    setViewType,
    setMonthDate,
    setWeeksDate,
    setSelectedDate,
    getBeginDate,
    getEndDate
} = useTimetableState(systemInfoRef, props.dataLoader);

// 组件引用
const calendarRef = ref();
const deleteBtnRef = ref();
const isDeletePopoverOpen = ref(false);
const showEditor = ref(false);
const editorParams = ref<EditorModalParams>({
    consoleType: 'COOL_SUPPLY'
});

// 计算属性
const headerStyle = computed(() => ({
    padding: screenWidth.value >= 1920 ? '0px 0px 14px' : '0px 0px 5px'
}));

const screenWidth = ref(document.documentElement.clientWidth);

const editorObjectId = computed(() => {
    if (props.systemInfo.consoleTypes !== 'AIR_TERMINAL_ZONE') {
        return props.systemInfo.systemId;
    }
    return editorParams.value.objectId || '';
});

// 初始化
if (props.projectId) {
    setProjectId(props.projectId);
}
if (props.defaultViewType) {
    setViewType(props.defaultViewType);
}

// 事件处理
const handleGoBack = () => {
    emit('goBack');
};

const handleParamsChange = () => {
    nextTick(() => {
        loadData(true);
    });
};

const handleWeeksParamsChange = () => {
    nextTick(() => {
        loadData(true);
    });
};

const handleCreateClick = (type: SystemType | string) => {
    const obj: EditorModalParams = {
        consoleType: type as SystemType
    };
    editorParams.value = obj;
    showEditor.value = true;
    emit('create', type as SystemType);
};

const handleBatchDelete = () => {
    deleteBtnRef.value = document.querySelector('#del-btn');
    isDeletePopoverOpen.value = !isDeletePopoverOpen.value;
};

const closeDeletePopover = () => {
    isDeletePopoverOpen.value = false;
};

const submitDeletePopover = () => {
    isDeletePopoverOpen.value = false;
};

const handleEdit = (params: EditorModalParams) => {
    editorParams.value = params;
    showEditor.value = true;
    emit('edit', params);
};

const closeEditor = () => {
    showEditor.value = false;
};

const handleSaved = () => {
    loadData(true);
};
</script>

<style lang="less">
.del-popover {
    padding: 16px !important;
}
</style>

<style lang="less" scoped>
:deep(.m-dropdown-button) {
    height: 32px !important;
    background-color: #246fe5 !important;
    color: #fff !important;
    svg path {
        fill: #fff !important;
    }
    svg:hover {
        path {
            fill: #fff !important;
        }
    }
}

@media screen and (min-width: 1600px) {
    .to-day-item {
        width: 480px;
    }
}

@media screen and (max-width: 1600px) {
    .to-day-item {
        width: 400px;
    }
}

.timetable {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    padding: 12px 0px 12px 12px;
    background-color: #f1f4f6;
    overflow: hidden;

    .timetable-scrollbar {
        padding-right: 12px;
    }

    .timetable-content {
        min-width: 1280px;
        min-height: calc(680px - 24px - 48px);
        height: calc(100vh - 24px - 48px);
        overflow-y: hidden;
        padding-right: 12px;
    }

    .calendar-weeks {
        position: relative;
        margin: 5px 0px 0 0;
        border-radius: 8px;
        border: 1px solid #e1e5eb;
        border-right: 0;
        background: #fff;
        overflow: hidden;
        flex: 1;

        &-scroll {
            :deep(.m-scrollbar__content) {
                height: 100%;
            }
        }
    }

    .calendar-month {
        position: relative;
        margin: 5px 8px 0 0;
        border-radius: 8px;
        border: 1px solid #e1e5eb;
        border-right: 0;
        background: #fff;
        overflow: hidden;
        flex: 1;

        &-scroll {
            :deep(.m-scrollbar__content) {
                height: 100%;
            }
        }
    }

    .to-day-item {
        margin: 5px 0 0 0;
        border: 1px solid #e1e5eb;
        border-radius: 8px;
        overflow: hidden;
        background-color: #fff;
    }

    .header-actions {
        display: flex;
        align-items: center;
    }
}
</style>
