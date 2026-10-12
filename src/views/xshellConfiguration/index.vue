<template>
    <div class="shell-config">
        <div class="shell-config-left">
            <ul class="shell-config-left-ul">
                <li
                    v-for="(item, index) in menuList"
                    :key="index"
                    class="shell-config-left-ul-li fc"
                    :class="{ 'is-active': activeMenu == index }"
                    @click="changeMenu(item, index)"
                >
                    <svg class="icon" aria-hidden="true" style="height: 18px; width: 18px">
                        <use :xlink:href="`#icon-${activeMenu == index ? item.activeIcon : item.defaultIcon}`" />
                    </svg>
                    <span v-ellipsis class="shell-config-left-ul-li-text">{{ item.name }}</span>
                </li>
            </ul>
        </div>
        <div class="shell-config-right">
            <header class="fcb">
                <div class="fc">
                    <template v-if="goBack?.subTitle">
                        <m-button type="text" icon="IconMeriComponentChevronLeft" @click="goBack?.callback?.()">{{ i18n.global.t('meos_control_web.back') }}</m-button>
                        <div class="header-divider"></div>
                        <span class="sub-title fc">{{ goBack.subTitle }} </span>
                    </template>

                    <m-tips v-else :content="titleTips" :disabled="!titleTips" theme="darkTransparent" width="420px" placement="bottom">
                        <span class="title fc"
                            >{{ title }}
                            <template v-if="titleTips">
                                <IconMeriComponentDialogLinear size="16" color="#626C78" />
                            </template>
                        </span>
                    </m-tips>
                </div>
                <div class="fc">
                    <m-tips v-if="isRestoreAll" :content="i18n.global.t('meos_control_web.restore_adjusted_params_to_default')" theme="darkTransparent">
                        <m-button type="link" @click="restoreAllDefault">{{ i18n.global.t('meos_control_web.batch_restore_default') }}</m-button></m-tips
                    >
                </div>
            </header>
            <div class="shell-config-right-box">
                <div class="shell-config-right-content">
                    <div style="height: 100%; overflow: auto">
                        <m-scrollbar>
                            <component :is="currentComponent" v-model="isStartCalculation" @default-restore-all="defaultRestoreAll"></component>
                        </m-scrollbar>
                    </div>
                </div>
                <footer>
                    <m-button type="primary" :disabled="isDisabled" @click="confirm">{{ i18n.global.t('common.confirm') }}</m-button>
                    <m-button type="default" :disabled="isDisabled" @click="cancel">{{ i18n.global.t('common.cancel') }}</m-button>
                </footer>
            </div>
            <m-modal
                v-model:visible="showleave"
                :append-to="$modalAppendTo"
                type="info"
                :title="i18n.global.t('meos_control_web.confirm_leave')"
                :content="i18n.global.t('meos_control_web.changes_not_saved_after_leave')"
                @close="closeShowleave"
                @submit="submitShowleave"
            />
        </div>
    </div>
    <startCalculationModal v-if="showStartCalculationModal" @close="closeStartCalculationModal" @after-submit="afterStartCalculationSubmit" />
    <startMPCModal v-if="showStartMPCModal" @close="closeStartMPCModal" @after-submit="afterStartMPCSubmit" />
</template>

<script setup>
import { IconMeriComponentDialogLinear } from 'meri-icon';
import UseGlobalData from './hooks/useGlobalData';
import SwitchHeader from './header/SwitchHeader.vue';
import i18n from '@/localization';
import startCalculationModal from './configRight/common/startCalculationModal.vue';
import startMPCModal from './configRight/common/startMPCModal.vue';

const {
    menuList,
    title,
    activeMenu,
    titleTips,
    isRestoreAll,
    isStartCalculation,
    isDisabled,
    showleave,
    currentComponent,
    confirm,
    cancel,
    changeMenu,
    defaultRestoreAll,
    closeShowleave,
    submitShowleave,
    restoreAllDefault,
    goBack
} = UseGlobalData();

const showStartCalculationModal = ref(false);
const showStartMPCModal = ref(false);

// 开启启用算法弹窗
const openStartCalculationModal = () => {
    showStartCalculationModal.value = true;
};

// 关闭启用算法弹窗
const closeStartCalculationModal = () => {
    showStartCalculationModal.value = false;
};

// 启用算法开启成功
const afterStartCalculationSubmit = () => {
    showStartCalculationModal.value = false;
};

// 开启MPC弹窗
const openStartMPCModal = () => {
    showStartMPCModal.value = true;
};

// 关闭启用算法弹窗
const closeStartMPCModal = () => {
    showStartMPCModal.value = false;
};

// 启用算法开启成功
const afterStartMPCSubmit = () => {
    showStartMPCModal.value = false;
};
</script>

<style lang="less" scoped>
.shell-config {
    height: 100%;
    display: flex;
    justify-content: space-between;
    overflow: hidden;
    &-left {
        padding: 12px 16px;
        width: 296px;
        min-width: 296px;
        max-width: 296px;
        border-right: 1px solid var(--gray-grey-300, #e1e5eb);
        background: #f7f9fa;
        &-ul {
            &-li {
                color: #1b2129;
                font-family: Micro soft YaHei UI;
                font-size: 14px;
                font-style: normal;
                font-weight: var(--platform-font-weight);
                height: 40px;
                line-height: 40px;
                padding: 0 14px;
                cursor: pointer;
                border-radius: 4px;
                user-select: none;

                &:hover {
                    background: #e8ecf0;
                }
                svg {
                    margin-right: 4px;
                }
                &-text {
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: inline-block;
                }
            }
            .is-active {
                background: #d9ebff;
                font-weight: 700;
                color: #246fe5;
            }
        }
    }
    &-right {
        flex: 1;
        background: #fff;
        header {
            border-bottom: 1px solid var(--gray-grey-300, #e1e5eb);
            background: var(--gray-grey-0, #fff);
            color: var(--gray-grey-800, #2e3742);
            font-family: Microsoft YaHei UI;
            font-size: 16px;
            font-weight: 700;
            height: 52px;
            line-height: 52px;
            padding: 0 40px 0 16px;
            .title {
                display: flex;
                flex-shrink: 0;
                white-space: nowrap;
                svg:first-child {
                    cursor: pointer;
                    margin-left: 12px;
                }
            }
            .line-link {
                display: inline-block;
                width: 1px;
                height: 14px;
                background: #c4c9cf;
                margin: 0 6px;
            }
        }
        .shell-config-right-box {
            position: relative;
            height: calc(100% - 53px);
            width: calc(100vw - 296px);
        }
        &-content {
            height: calc(100% - 64px);
            padding-top: 16px;
            overflow: hidden;
            width: calc(100vw - 296px);
        }
        footer {
            box-sizing: border-box;
            height: 64px;
            line-height: 64px;
            padding-left: 30px;
            border-top: 1px solid var(--gray-grey-300, #e1e5eb);
            position: fixed;
            bottom: 0;
            right: 0;
            width: calc(100% - 296px);
            .m-button {
                margin-right: 12px;
            }
        }
    }
}
.header-divider {
    width: 1px;
    height: 16px;
    background: #e1e5eb;
    margin: 0 8px;
}
.sub-title {
    color: @grey-800;
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
}
</style>
