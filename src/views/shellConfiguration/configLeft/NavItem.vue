<template>
    <m-modal
        v-model:visible="showModal"
        :append-to="$modalAppendTo"
        type="info"
        :z-index="Z_INDEX.modalConfirm"
        :title="i18n.global.t('meos_control_web.confirm_leave')"
        :content="i18n.global.t('meos_control_web.changes_not_saved_after_leave')"
        @close="showModal = false"
        @submit="submit"
    ></m-modal>
    <div class="nav-bar-content">
        <div class="header-wrap" @click="showWrap" @mouseenter="active = true" @mouseleave="active = false">
            <span class="icon flex-be-ce">
                <automation></automation>
            </span>
            <span class="text">{{ props.data.name }}</span>
            <m-tips trigger="click">
                <template #content>
                    <div class="tips-wrap">
                        <div class="title">
                            <span>{{ i18n.global.t('meos_control_web.auto_demand_calc_condition_config') }}</span
                            ><span>*</span>
                        </div>
                        <div class="bottom">
                            <div class="switch-container fc">
                                <set-ai-bg class="bg" />
                                <span class="text">{{ i18n.global.t('meos_control_web.ai_algorithm_settings') }}</span>
                                <m-tips :content="i18n.global.t('meos_control_web.ai_calc_results_enabled')" theme="darkTransparent">
                                    <IconMeriComponentDialogLinear size="16" color="#626C78" />
                                </m-tips>
                                <m-switch v-model="values" class="switch" @click="changeSwitch"></m-switch>
                            </div>
                            <m-button type="link" @click="startCalculation">{{ i18n.global.t('meos_control_web.start_algorithm_calc') }}</m-button>
                        </div>
                    </div>
                </template>
                <div class="setting flex-be-ce" @click="setChange">
                    <IconMeriActionSetting v-show="active && true" :size="12"></IconMeriActionSetting>
                </div>
            </m-tips>
            <span class="arrow flex-be-ce" :class="{ open: open }">
                <IconMeriComponentChevronRight></IconMeriComponentChevronRight>
            </span>
        </div>
        <div class="content-wrap" :style="{ height: open ? height : 0 }">
            <div ref="contentRef">
                <div v-for="item in props.data.children" :key="item.key" class="content">
                    <p :class="{ select: selectKey === item.key }" @click="tabChange(item)">{{ item.name }}</p>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import i18n from '@/localization';
import { Z_INDEX } from '@/constants/zIndex';
import { IconMeriActionSetting, IconMeriComponentChevronRight, IconMeriComponentDialogLinear } from 'meri-icon';
import automation from './icon/automation.svg';
import setAiBg from './icon/setAiBg.vue';
import { changeAlgorithmConfig, startAlgorithmCalculation } from '@/apis/xshellConfiguration';
import { $Message } from 'meri-plus';
import baseStore from '@/store/baseStore';

const props = defineProps({
    data: {
        type: Object,
        default: () => ({})
    },
    showSet: {
        type: Boolean,
        default: false
    }
    // selectKey: {
    //     type: String,
    //     default: ''
    // },
    // openKey: {
    //     type: String,
    //     default: ''
    // }
});
// const emit = defineEmits(['updateOpenKey', 'updateSelectKey']);
const selectKey = inject('selectKey');
const openKey = inject('openKey');
const isEdit = inject('isEdit');
const selectList = inject('selectList');

const open = ref(false);
const active = ref(false);
const values = ref('uncheck');
const showModal = ref(false);
const tempItem = ref({});
watch(
    openKey,
    v => {
        if (v === props.data.key) {
            open.value = true;
        } else {
            open.value = false;
        }
    },
    {
        immediate: true
    }
);
const showWrap = () => {
    if (openKey.value === props.data.key) {
        open.value = !open.value;
    } else {
        openKey.value = props.data.key;
    }
};
const tabChange = item => {
    if (isEdit.value) {
        tempItem.value = item;
        showModal.value = true;
    } else {
        selectKey.value = item.key;
        selectList.value = item.children || [];
    }
};
const submit = () => {
    isEdit.value = false;
    selectKey.value = tempItem.value.key;
    selectList.value = tempItem.value.children || [];
    tempItem.value = {};
    showModal.value = false;
};
const changeSwitch = () => {
    changeAlgorithmConfig({ status: values.value === 'checked', projectId: baseStore().projectId }).then(res => {
        const { data } = res;
        console.log('data: ', data);
        if (data) {
            $Message.success({
                title:
                    values.value === 'checked'
                        ? `${i18n.global.t('meos_control_web.ai_algorithm_enabled_success')}`
                        : `${i18n.global.t('meos_control_web.ai_algorithm_disabled_success')}`
            });
        } else {
            values.value = 'uncheck';
        }
    });
};

// 启动算法计算
const startCalculation = () => {
    startAlgorithmCalculation({}).then(res => {
        if (res.code === '00000') {
            $Message.success({ title: i18n.global.t('meos_control_web.startup_success') });
        } else {
            $Message.error({ title: i18n.global.t('meos_control_web.startup_fail') });
        }
    });
};

const contentRef = ref();
const height = ref(0);
const setChange = e => {
    e.stopPropagation();
    e.preventDefault();
};
onMounted(() => {
    height.value = contentRef.value.offsetHeight + 'px';
});
</script>
<style lang="less" scoped>
.nav-bar-content {
    user-select: none;
    margin-bottom: 10px;
    .header-wrap {
        padding: 8px 12px;
        height: 38px;
        line-height: 22px;
        display: flex;
        align-items: center;
        &:hover {
            border-radius: 4px;
            cursor: pointer;
            background: rgba(196, 201, 207, 0.3);
        }
        .icon {
            width: 18px;
            cursor: pointer;
            height: 18px;
            margin-right: 8px;
        }
        .text {
            width: 154px;
            height: 100%;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            color: @grey-900;
            font-size: 14px;
            font-weight: var(--platform-font-weight);
            line-height: 22px;
        }
        .setting {
            width: 16px;
            height: 16px;
            font-size: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            margin-left: 1px;
            &:hover {
                border-radius: 2px;
                background: rgba(196, 201, 207, 0.3);
            }
        }
        .arrow {
            width: 16px;
            height: 16px;
            cursor: pointer;
            margin-left: 1px;
            transition: transform 0.2s ease;
        }
        .open {
            transform: rotate(90deg);
            transition: transform 0.2s ease;
        }
    }
    .content-wrap {
        overflow: hidden;
        height: 0;
        transition: height 0.2s ease;
    }
    .content {
        cursor: pointer;
        p {
            padding: 8px 28px 8px 54px;
            margin-top: 4px;
            font-feature-settings: 'clig' off, 'liga' off;

            font-size: 14px;
            font-style: normal;
            line-height: 22px;
            &.select {
                border-radius: 4px;
                background: @blue-100;
                color: @blue-500;
                font-weight: 700;
            }
            &:hover {
                border-radius: 4px;
                background: rgba(196, 201, 207, 0.3);
            }
        }
    }
}
.tips-wrap {
    padding: 12px 6px 8px 6px;
    .title {
        margin-bottom: 16px;
        span {
            &:first-child {
                color: #646a73;
                font-feature-settings: 'clig' off, 'liga' off;
                font-family: 'Microsoft YaHei';
                font-size: 14px;
                font-style: normal;
                font-weight: var(--platform-font-weight);
                line-height: 22px; /* 157.143% */
            }
            &:last-child {
                color: @red-500;
                font-feature-settings: 'clig' off, 'liga' off;
                font-family: 'Microsoft YaHei';
                font-size: 14px;
                font-style: normal;
                font-weight: var(--platform-font-weight);
                line-height: 22px;
            }
        }
    }
    .bottom {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .switch-container {
        border-radius: 4px;
        background: rgba(19, 167, 242, 0.12);
        margin-right: 12px;
        padding: 2px 12px 2px 8px;
        height: 28px;

        .bg {
            width: 28px;
            height: 28px;
        }

        .text {
            font-family: Microsoft YaHei UI;
            font-size: 16px;
            font-weight: 700;
            background: linear-gradient(90deg, #246fe5 1.19%, #11abf3 77.48%, #00b7d0 101.98%);
            background-clip: text;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin: 0 4px 0 7px;
        }

        .switch {
            margin-left: 12px;
        }
    }
}
</style>
