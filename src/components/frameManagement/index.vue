<template>
    <div class="frame">
        <Menu v-if="showMenu" :menu-data="menus" :model-value="modelValue" @menus-change="menusChange" />
        <!-- v-loading="isloadingFrame" element-loading-lottiename="circle" -->
        <div class="frame-content">
            <div v-if="tabActiveId" class="frame-content-top fcb">
                <div class="frame-contnt-top-tabs">
                    <m-tabs v-model="tabActiveId" size="large" style="width: 100%" :data="templateTabs" @change="changeTab">
                        <template #name="{ item }">
                            <div v-ellipsis class="tabs-slot">{{ item.name }}</div>
                        </template>
                    </m-tabs>
                </div>
                <div v-if="!isHideTemplateManage" class="frame-contnt-top-btn fcc">
                    <slot name="pre-btns"> </slot>
                    <slot name="btn">
                        <m-button v-if="base.hasAuth('editingStandards')" size="medium" @click="openTemplateManage">
                            {{ i18n.global.t('meos_control_web.template_management') }}
                        </m-button>
                    </slot>
                </div>
            </div>
            <div class="frame-content-bottom">
                <template v-if="tabActiveId">
                    <slot></slot>
                </template>
                <div v-else class="frame-content-bottom-empty">
                    <m-illustration
                        v-if="!isloadingFrame"
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
        </div>
        <!-- 模板弹框 -->
        <TemplateManage v-if="showTemplateManage" :template-type="modelValue" @close="templateManageClose" />
    </div>
</template>
<script setup>
import i18n from '@/localization';
import Menu from './Menu.vue';
import Empty from '../common/Empty.vue';
import TemplateManage from './TemplateManage.vue';
import useFrameManagement from '../hooks/useFrameManagement';
import baseStore from '@/store/baseStore';
const base = baseStore();
const props = defineProps({
    showMenu: {
        type: Boolean,
        default: true
    },
    menus: {
        type: Array,
        default: () => []
    },
    modelValue: {
        type: String,
        default: ''
    },
    activeId: {
        type: String,
        default: ''
    },
    templateDemandType: {
        type: String,
        default: ''
    }
});
const emit = defineEmits(['update:modelValue', 'update:activeId']);
const { isloadingFrame, templateTabs, tabActiveId, menusChange, changeTab, showTemplateManage, openTemplateManage, templateManageClose, isHideTemplateManage } = useFrameManagement(
    props,
    emit
);
defineExpose({
    templateTabs
});
</script>
<style lang="less" scoped>
.frame {
    display: flex;
    height: 100%;
    width: 100%;
    min-width: 1280px;

    &-content {
        flex: 1;
        width: 100%;
        height: 100%;
        &-top {
            height: 48px;
            width: 100%;
            border-bottom: 1px solid var(--gray-300);
            padding-right: 16px;
            background: rgba(255, 255, 255, 0.8);
            .frame-contnt-top-tabs {
                padding: 3px 12px 0px 4px;
                height: 100%;
                flex: 1;
                min-width: 0;
                width: 0;
                :deep(.m-tabs-line .m-tabs-list) {
                    padding-bottom: 4px;
                }
                .tabs-slot {
                    max-width: 220px;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: inline-block;
                }
            }
            .frame-contnt-top-btn {
                height: 100%;
                column-gap: 8px;
            }
        }
        &-bottom {
            height: calc(100% - 50px);
            &-empty {
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
            }
        }
    }
}
</style>
