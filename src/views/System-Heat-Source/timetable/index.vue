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
                    :show-search="false"
                    :month-data="month"
                    @change-params="changeParams"
                    @change-weeks-params="changeWeeksParams"
                    @go-back="goBack"
                >
                    <template #append>
                        <div class="fc" style="gap: 8px">
                            <SetButton v-if="getButtonType === CONSOLE_TYPES.HEAT_SUPPLY.id" type="primary" @click="addFixedTimeStrategy(CONSOLE_TYPES.HEAT_SUPPLY.id)">{{
                                i18n.global.t('meos_control_web.create_new_schedule')
                            }}</SetButton>

                            <SetButton
                                v-else-if="getButtonType === CONSOLE_TYPES.AIR_TERMINAL_ZONE.id"
                                type="primary"
                                @click="addFixedTimeStrategy(CONSOLE_TYPES.AIR_TERMINAL_ZONE.id)"
                                >{{ i18n.global.t('meos_control_web.create_new_schedule') }}</SetButton
                            >

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
                                    <div style="width: 280px">
                                        <delFormItem :current-system="currentSystem" @show-popover-fuc="showPopoverFuc" @sumbit-popover-fuc="sumbitPopoverFuc" />
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
                            <monthlyCalendar ref="strategyMain" :current-system="currentSystem" />
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
            :system-type="SYSTEM_CLASS_CODE"
            :object-id="currentSystem.consoleTypes !== 'AIR_TERMINAL_ZONE' ? currentSystem.systemId : modalParams.objectId"
            :current-date="modalParams.currentDate"
            @after-saved="afterSaved"
        ></EditorModal>
    </div>
</template>
<script setup>
import i18n from '@/localization';
import HeaderFilter from './components/HeaderFilter.vue';
import monthlyCalendar from './components/monthlyCalendar.vue';
import weeklyCalendar from './components/weeklyCalendar.vue';
import EditorModal from './components/EditorModal/index.vue';
import dayItem from './components/dayItem.vue';
import delFormItem from './components/delFormItem.vue';
import useTimetableHook from '../hooks/useTimetableHook';
import { currentSystemKey } from '../hooks/useBaseHook';
import { SYSTEM_CLASS_CODE, CONSOLE_TYPES } from '../constant/variable';
import SetButton from '@/components/common/SetButton.vue';
const currentSystem = inject(currentSystemKey);
const { tabsType, init, isLoading } = useTimetableHook(currentSystem);
const emit = defineEmits(['goBack']);
const strategyMain = ref();
const showEditor = ref(false);
const Btn = ref();
const isOpen = ref(false);
const modalParams = ref({});

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
const getButtonType = computed(() => {
    console.log(currentSystem.value, 'currentSystem.value');
    // if (currentSystem.value.consoleTypes === CONSOLE_TYPES.HEAT_SUPPLY.id) {
    //     return 'coolInput';
    // } else if (currentSystem.value.consoleTypes === 'AIR_TERMINAL_ZONE') {
    //     return 'airTerminalZone';
    // }
    return currentSystem.value.consoleTypes;
});

const optionClick = value => {
    const obj = {
        consoleType: value
    };
    modalParams.value = obj;
    showEditor.value = true;
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
