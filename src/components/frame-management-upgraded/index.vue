<template>
    <m-scrollbar style="width: 100%; height: 100%">
        <template v-if="isMenuLoading">
            <div class="menu-loading-container"></div>
        </template>
        <div v-else-if="!menusList.length" class="empty">
            <m-illustration :title="i18n.global.t('meos_control_web.no_content')" type="noContent"></m-illustration>
        </div>
        <div v-else class="frame">
            <Menu v-if="props.showMenu" v-model="curMenuId" :menu-data="menusList" @menus-change="onMenusChange" />
            <div class="frame-content">
                <template v-if="isTemplateLoading">
                    <div class="template-loading-container"></div>
                </template>
                <template v-else-if="isTemplateLoaded && templateTabs.length">
                    <div :class="['frame-content-top', 'fcb', props.isPreview ? 'hide' : '']">
                        <div class="frame-content-top-tabs">
                            <m-tabs v-model="curTemplateTag" size="large" style="width: 100%" :data="templateTabs" @change="onTabChange" />
                        </div>
                        <div v-if="!isHideTemplateManage" class="frame-content-top-btn fcc">
                            <slot name="pre-btns"> </slot>
                            <slot name="btn">
                                <m-button v-if="props.useAuth ? base.hasAuth('editingStandards') : true" size="medium" @click="openTemplateManage">{{
                                    i18n.global.t('meos_control_web.template_management')
                                }}</m-button>
                            </slot>
                        </div>
                    </div>
                    <div class="frame-content-bottom">
                        <slot></slot>
                    </div>
                    <div v-show="props.isPreview" class="frame-content-preview">
                        <slot name="preview"></slot>
                    </div>
                </template>
                <div v-else class="frame-content-bottom-empty">
                    <m-illustration
                        :title="i18n.global.t('meos_control_web.no_content')"
                        type="noContent"
                        :content="i18n.global.t('meos_control_web.please_enable_demand_template_in_mgmt')"
                    >
                        <template #footer>
                            <m-button size="medium" @click="openTemplateManage">{{ i18n.global.t('meos_control_web.template_management') }}</m-button>
                        </template>
                    </m-illustration>
                </div>
            </div>
            <TemplateManage v-if="showTemplateManage" :template-type="curMenuId" @close="closeTemplateManage" />
        </div>
    </m-scrollbar>
</template>
<script setup>
import i18n from '@/localization';
import Menu from './Menu.vue';
import TemplateManage from './TemplateManage.vue';
import useMenuManage from './useMenuManage';
import useTemplateManage from './useTemplateManage';
import baseStore from '@/store/baseStore';

const props = defineProps({
    showMenu: {
        type: Boolean,
        default: true
    },
    demandType: {
        type: String,
        default: ''
    },
    menuIconMap: {
        type: Object,
        default: () => ({})
    },
    // 处理菜单名称的函数
    handleMenuName: {
        type: Function,
        default: undefined
    },
    // 过滤模板列表数据的函数
    handleTemplateDataFilter: {
        type: Function,
        default: undefined
    },
    useAuth: {
        type: Boolean,
        default: false
    },
    isPreview: {
        type: Boolean,
        default: false
    },
    ignoreTemplateLoading: {
        type: Boolean,
        default: true
    }
});
const base = baseStore();

const menusList = defineModel('menusList', { type: Array, default: () => [] });
const curMenuId = defineModel('curMenuId', { type: String, default: '' });
const curTemplateTag = defineModel('curTemplateTag', { type: String, default: '' });
const curTemplateId = defineModel('curTemplateId', { type: String, default: '' });

const { isMenuLoading, startMenuLoading, endMenuLoading } = useMenuManage(props, menusList, curMenuId);
const {
    isTemplateLoading,
    isTemplateLoaded,
    startTemplateLoading,
    endTemplateLoading,
    templateTabs,
    onMenusChange,
    onTabChange,
    showTemplateManage,
    openTemplateManage,
    closeTemplateManage,
    isHideTemplateManage
} = useTemplateManage(props, curMenuId, curTemplateTag, curTemplateId);

watch(
    () => isMenuLoading.value,
    curLoading => {
        if (curLoading) {
            startMenuLoading?.({ className: '.menu-loading-container', setTimeoutOs: 200 });
        } else {
            endMenuLoading?.();
        }
    },
    {
        immediate: true
    }
);

watch(
    () => isTemplateLoading.value,
    curLoading => {
        if (props.ignoreTemplateLoading) {
            return;
        }
        if (curLoading) {
            startTemplateLoading?.({ className: '.template-loading-container' });
        } else {
            endTemplateLoading?.();
        }
    },
    {
        immediate: true
    }
);
</script>
<style lang="less" scoped>
:deep(.m-scrollbar__content) {
    height: 100%;
}
.frame {
    display: flex;
    height: 100%;
    width: 100%;
    min-width: 1280px;

    &-content {
        flex: 1;
        width: 100%;
        height: 100%;
        position: relative;

        &-top {
            height: 48px;
            width: 100%;
            border-bottom: 1px solid var(--gray-300);
            padding-right: 16px;
            background: rgba(255, 255, 255, 0.8);

            .frame-content-top-tabs {
                padding: 3px 12px 0px 4px;
                height: 100%;
                flex: 1;
                min-width: 0;
                width: 0;
                :deep(.m-tabs-line .m-tabs-list) {
                    padding-bottom: 4px;
                }
            }
            .frame-content-top-btn {
                height: 100%;
                column-gap: 8px;
            }
        }
        &-bottom {
            height: calc(100% - 48px);
            &-empty {
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
            }
        }
    }
}

.menu-loading-container {
    width: 100%;
    height: 100%;
    min-width: 1280px;
}
.template-loading-container {
    width: 100%;
    height: 100%;
}
.frame-content-preview {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 2;
    background-color: #fff;
}
.hide {
    visibility: hidden;
}
.empty {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
