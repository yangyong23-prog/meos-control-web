<template>
    <div class="left-container" :style="{ height: base.hasAuth('editingStandards') && !treeLoading && !isHideTemplateManage ? 'calc(100% - 60px)' : '100%' }">
        <div v-if="treeLoading" class="no-data">
            <m-list-skeleton />
        </div>
        <m-scrollbar v-else ref="scrollbarLeftRef" :height="'100%'">
            <div style="height: 20px"></div>
            <card-item v-for="item in leftTreeList" :key="item.objectType" :data="item" @change-list="changeList" />
            <div v-if="isAcAdd" class="card-config" :class="{ isActive: currentConfigObj?.objectType === 'special' }">
                <m-tag class="card-tag" size="small" color="#A928B7" bg-color="#F7E3F5"> {{ currentConfigObj?.objectName }}</m-tag>
            </div>
            <div v-if="isAcAdd" style="height: 12px"></div>
        </m-scrollbar>

        <m-modal
            v-model:visible="confirmModal"
            :append-to="$modalAppendTo"
            :closeable="false"
            type="default"
            :align-center="false"
            :width="420"
            :height="154"
            :footer="false"
            :modal-class-name="'left-container-modal'"
        >
            <template #content>
                <div class="modal-content">
                    <div class="modal-content-top"><IconMeriComponentDialogWarning size="24" />{{ i18n.global.t('meos_control_web.confirm_leave_dup') }}</div>
                    <div class="modal-content-bottom">{{ i18n.global.t('meos_control_web.current_content_not_saved_after_leave') }}</div>
                    <div class="modal-content-footer">
                        <m-button type="text" style="width: 44px; margin-right: 12px" @click="confirmModal = false">{{ i18n.global.t('common.cancel') }}</m-button>
                        <m-button type="default" style="width: 90px; margin-right: 12px" @click="leaveDirectly">{{ i18n.global.t('meos_control_web.leave_directly') }}</m-button>
                        <m-button type="primary" style="width: 102px" @click="saveAndLeft">{{ i18n.global.t('meos_control_web.save_and_leave') }}</m-button>
                    </div>
                </div>
            </template>
        </m-modal>
    </div>
</template>

<script setup>
import CardItem from './cardItem.vue';
import useLeftConfig from '../../hooks/useLeftConfig';
import { IconMeriComponentDialogWarning } from 'meri-icon';
import { isAcAddKey, currentConfigObjKey, treeLoadingKey, scrollbarLeftRefKey, formDirtyCheckKey, confirmModalKey } from '../../hooks/useAcCommon';
import baseStore from '@/store/baseStore';
import i18n from '@/localization';

const base = baseStore();
const isAcAdd = inject(isAcAddKey);
const currentConfigObj = inject(currentConfigObjKey);
const treeLoading = inject(treeLoadingKey);
const scrollbarLeftRef = inject(scrollbarLeftRefKey);
const confirmModal = inject(confirmModalKey);
const formDirtyCheck = inject(formDirtyCheckKey);

const { leftTreeList, queryListConfigGroups, leaveDirectly, changeList } = useLeftConfig();
defineProps({
    isHideTemplateManage: {
        type: Boolean,
        default: false
    }
});
const saveAndLeft = async () => {
    confirmModal.value = false;
    await formDirtyCheck?.value?.submit?.();
};
defineExpose({
    queryListConfigGroups
});
</script>

<style lang="less" scoped>
.left-container {
    overflow: auto;
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    padding-left: 16px;
    .no-data {
        padding-top: 20px;
        padding-right: 16px;
    }
    .card-config {
        padding: 12px;
        margin-right: 16px;
        border-radius: 8px;
        border: 1px solid var(--Grey-Grey-Dividers, #e1e5eb);
        background: var(--Grey-Grey-0, #fff);
        user-select: none;
    }
    .isActive {
        padding: 11px;
        border: 2px solid var(--blue-500, #246fe5);
        background: var(--Grey-Grey-0, #fff);
        box-shadow: 0px 6px 2px 0px rgba(78, 138, 232, 0.04);
    }
}
</style>
<style lang="less">
.left-container-modal {
    .m-modal-main {
        border-radius: 0;
        border-radius: 4px !important;
    }
    .m-modal-main-content {
        width: 420px;
        height: 154px !important;
    }
    .modal-content {
        padding: 0 8px;
        &-top {
            display: flex;
            align-items: center;
            color: var(--gray-800, #2e3742);
            font-size: 16px;
            font-weight: 700;
            line-height: 24px;
            svg {
                margin-right: 12px;
            }
        }
        &-bottom {
            padding-left: 36px;
            color: var(--gray-600, #626c78);
            font-size: 14px;
            line-height: 22px;
            margin: 8px 0 24px 0;
        }
        &-footer {
            display: flex;
            justify-content: flex-end;
        }
    }
}
</style>
