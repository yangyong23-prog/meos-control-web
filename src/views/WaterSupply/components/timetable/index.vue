<template>
    <div class="timetable">
        <m-scrollbar box-class="timetable-scrollbar">
            <div
                :style="{
                    minWidth: '1280px',
                    minHeight: 'calc(680px - 24px - 48px)',
                    height: 'calc(100vh - 24px - 48px)',
                    overflowY: 'hidden',
                    paddingRight: '12px'
                }"
            >
                <HeaderFilter
                    :style="{
                        padding: screenWidth >= 1920 ? '0px 0px 14px' : '0px 0px 5px'
                    }"
                    :list="headerOptions"
                    :current-system="currentSystem"
                    :cur-console-type="curConsoleType"
                    :show-search="false"
                    :month-data="month"
                    @change-params="changeParams"
                    @change-weeks-params="changeWeeksParams"
                    @go-back="goBack"
                >
                    <template #append>
                        <div class="fc" style="gap: 8px">
                            <SetButton type="primary" @click="addFixedTimeStrategy(curConsoleType)">{{ i18n.global.t('meos_control_web.create_new_schedule') }}</SetButton>

                            <SetButton id="del-btn" type="default" @click="delFixedTimeStrategy">{{ i18n.global.t('meos_control_web.batch_delete') }}</SetButton>
                            <m-popover
                                popover-class="del-popover"
                                virtual-triggering
                                :content="i18n.global.t('meos_control_web.i_am_hint_text')"
                                :virtual-ref="Btn"
                                trigger="manually"
                                :is-open="isOpen"
                            >
                                <template #content>
                                    <div style="min-width: 280px">
                                        <delFormItem
                                            :current-system="currentSystem"
                                            :cur-console-type="curConsoleType"
                                            :system-type="systemType"
                                            @show-popover-fuc="showPopoverFuc"
                                            @sumbit-popover-fuc="sumbitPopoverFuc"
                                        />
                                    </div>
                                </template>
                            </m-popover>
                        </div>
                    </template>
                </HeaderFilter>
                <template v-if="tabsType === 'weeks'">
                    <div
                        class="calendar-weeks"
                        :style="{
                            height: 'calc(100% - 45px)'
                        }"
                    >
                        <weeklyCalendar :current-system="currentSystem" @edit-btn="editBtn" />
                    </div>
                </template>
                <template v-else>
                    <div
                        class="f"
                        :style="{
                            height: 'calc(100% - 40px)'
                        }"
                    >
                        <div class="calendar-month">
                            <monthlyCalendar ref="strategyMain" :current-system="currentSystem" :cur-console-type="curConsoleType" />
                        </div>
                        <div class="to-day-item">
                            <div v-if="isLoading" style="padding: 8px">
                                <m-list-skeleton />
                            </div>
                            <dayItem v-else :type="'month'" :current-system="currentSystem" @edit-btn="editBtn" />
                        </div>
                    </div>
                    <div class="to-day-item">
                        <div v-if="isLoading" style="padding: 8px">
                            <m-list-skeleton />
                        </div>
                        <dayItem v-else :type="'month'" :current-system="currentSystem" @edit-btn="editBtn" />
                    </div>
                </template>
            </div>
        </m-scrollbar>

        <EditorModal
            v-model="showEditor"
            :console-type="modalParams.consoleType"
            :enable-console-types="enableConsoleTypesInit"
            :system-type="systemType"
            :object-id="currentSystem.systemId"
            :current-date="modalParams.currentDate"
            :console-types="CONSOLE_TYPE_MAP"
            :current-system="currentSystem"
            :code-define="codeDefine"
            :chiller-data="chillerData"
            :use-right="false"
            @after-saved="afterSaved"
        >
            <template #time-area-content="timeTableItemData">
                <TimeTableEditItem
                    :console-type="modalParams.consoleType"
                    :current-system="currentSystem"
                    :slot-params="timeTableItemData"
                    :code-define="codeDefine"
                    :chiller-data="chillerData"
                />
            </template>
        </EditorModal>
    </div>
</template>
<script setup>
import i18n from '@/localization';
import HeaderFilter from './components/HeaderFilter.vue';
import monthlyCalendar from './components/monthlyCalendar.vue';
import weeklyCalendar from './components/weeklyCalendar.vue';
import EditorModal from '@/components/TimeTableEditorModal/index.vue';
import dayItem from './components/dayItem.vue';
import delFormItem from './components/delFormItem.vue';
import useTimetableHook from '../../hooks/useTimetableHook';

import baseStore from '@/store/baseStore';
import SetButton from '@/components/common/SetButton.vue';
import { isEdge } from '@/utils/envUtils';
import { CONSOLE_TYPE_MAP, PERMISSION } from '../../constant/index';
import { codeDefineKey } from '@/views/WaterSupply/injectKeys';

import TimeTableEditItem from '../TimeTableEditItem.vue';

const props = defineProps({
    systemType: {
        type: String,
        default: ''
    },
    // 当前控制台类型
    curConsoleType: {
        type: String,
        default: ''
    },
    // 当前系统支持的控制台类型
    enableConsoleTypes: {
        type: Array,
        default: () => []
    },
    currentSystem: {
        type: Object,
        default: () => ({})
    },
    systemInstance: {
        type: Object,
        default: () => ({})
    }
});

const base = baseStore();
const { tabsType, init, isLoading, enableConsoleTypesInit } = useTimetableHook(props);
const emit = defineEmits(['goBack']);

const showEditor = ref(false);
const Btn = ref();
const isOpen = ref(false);
const modalParams = ref({});
// const chillerData = inject(chillerDataKey);
const codeDefine = inject(codeDefineKey);

const afterSaved = () => {
    init(true);
};
//切换月
const changeParams = () => {
    nextTick(() => {
        init(true);
    });
};
//切换周
const changeWeeksParams = () => {
    nextTick(() => {
        init(true);
    });
};
//新建时间表
const addFixedTimeStrategy = type => {
    const obj = {
        consoleType: type
    };
    modalParams.value = obj;
    showEditor.value = true;
};
//批量删除
const delFixedTimeStrategy = () => {
    Btn.value = document.querySelector('#del-btn');
    isOpen.value = !isOpen.value;
};
const showPopoverFuc = () => {
    isOpen.value = false;
};
const sumbitPopoverFuc = () => {
    isOpen.value = false;
};

//返回
const goBack = () => {
    emit('goBack');
};
//编辑的回调
const editBtn = obj => {
    modalParams.value = obj;
    showEditor.value = true;
};
const hasPermission = computed(() => {
    return base.hasAuth(PERMISSION);
});

const disabled = computed(() => {
    return !isEdge() || !hasPermission.value;
});
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
    z-index: var(--z-index-timetable);
    overflow: hidden;
    .timetable-scrollbar {
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
            /deep/ .m-scrollbar__content {
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
            /deep/ .m-scrollbar__content {
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
    .header-filter {
        height: 40px;
        .line {
            width: 1px;
            height: 20px;
            background: #c4c9cf;
        }
    }
    .left-goBack {
        padding: 8px 8px 8px 4px;
        border-radius: 4px;
        background: transparent;
    }
    .left-goBack:hover {
        padding: 8px 8px 8px 4px;
        border-radius: 4px;
        background: var(--Grey-Alpha-30, rgba(196, 201, 207, 0.3));
    }
    .back {
        width: 20px;
        height: 20px;
    }
}
</style>
