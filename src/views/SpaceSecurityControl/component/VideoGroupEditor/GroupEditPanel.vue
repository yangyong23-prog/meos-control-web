<template>
    <div ref="groupEditPanel" class="group-edit-panel-wrap">
        <div class="group-edit-panel-header">
            <div class="group-edit-panel-title">{{ params.id ? i18n.global.t('meos_control_web.edit_group') : i18n.global.t('meos_control_web.create_group') }}</div>
            <div class="to-control-btns">
                <m-button v-if="params.objects.length && !previewMultiPlayer" class="to-control-btn" type="link" size="small" @click.stop="previewVideo">{{
                    i18n.global.t('meos_control_web.preview_monitoring')
                }}</m-button>
                <m-button v-if="params.id" class="to-control-btn" type="link" size="small" @click.stop="delMonitorGroup(params)">{{ i18n.global.t('common.delete') }}</m-button>
            </div>
        </div>
        <div class="group-edit-panel-content">
            <div class="group-edit-panel-form">
                <m-scrollbar :max-height="height - 106" content-class="group-edit-panel-form-scroller">
                    <m-form ref="monitorForm" label-width="80px" label-position="left" :model="params" scroll-to-error>
                        <m-form-item
                            :label="i18n.global.t('meos_control_web.goupname')"
                            prop="groupName"
                            :rules="{
                                required: true,
                                message: i18n.global.t('meos_control_web.input_required_check_error_4'),
                                trigger: ['change', 'blur'],
                                transform: function (value) {
                                    return value.trim();
                                }
                            }"
                        >
                            <m-input
                                v-model="params.groupName"
                                :maxlength="30"
                                width="100%"
                                :placeholder="i18n.global.t('meos_control_web.please_input_group_name')"
                                :error-text="nameErrorText"
                                @input="onKeyPress"
                                @clear="onKeyPress"
                            >
                            </m-input>
                        </m-form-item>
                        <m-form-item :label="i18n.global.t('meos_control_web.default_layout')" prop="layout">
                            <m-radio-group v-model="params.layout" @change="changeCurrentSplit">
                                <m-radio label="2">2X2</m-radio>
                                <m-radio label="3">3X3</m-radio>
                                <m-radio label="4">4X4</m-radio>
                            </m-radio-group>
                        </m-form-item>
                        <div class="add-monitor-tips">
                            <div class="add-monitor-tips-title">
                                {{ i18n.global.t('meos_control_web.add_camera') }}
                                <span class="required">*</span>
                            </div>
                            <div class="add-monirot-tips-content">{{ i18n.global.t('meos_control_web.add_camera_via_map') }}</div>
                        </div>
                        <div class="add-monitor-items" :class="{ dragging: isDragging }">
                            <VueDraggable v-model="params.objects" :disabled="isDraggingDisabled" ghost-class="sortable-ghost" :animation="1" @start="onDragStart" @end="onDragEnd">
                                <div
                                    v-for="item in params.objects"
                                    :key="item.id"
                                    class="add-monitor-item"
                                    :class="{ dragging: item.isDragging, hovering: item.id === currentHover }"
                                    @mouseover="hoverMonitorVideo(item)"
                                    @mouseleave="unhoverMonitorVideo()"
                                >
                                    <div class="add-monitor-item-content">
                                        <group-icon class="scene-icon" />
                                        <div v-ellipsis class="add-monitor-item-title m-ellipsis">
                                            {{ item.localName }}
                                        </div>
                                        <div>
                                            <m-tag size="small" color="#1B4ACC" bg-color="#D9EBFF">
                                                {{ item.floor }}
                                            </m-tag>
                                            <m-tag size="small" color="#1B4ACC" bg-color="#D9EBFF">
                                                {{ item.templateTypeName }}
                                            </m-tag>
                                        </div>
                                    </div>
                                    <div class="add-monitor-item-action">
                                        <m-tips :content="i18n.global.t('common.delete')" theme="darkTransparent" placement="top-end">
                                            <div class="monitor-icon" @click="delVideo(item.id)">
                                                <IconMeriActionDelete />
                                            </div>
                                        </m-tips>
                                    </div>
                                </div>
                            </VueDraggable>
                        </div>
                    </m-form>
                </m-scrollbar>
            </div>
        </div>
        <div class="group-edit-panel-footer">
            <m-button type="primary" size="medium" @click="handleConfirm">{{ i18n.global.t('common.confirm') }}</m-button>
            <m-button type="default" size="medium" @click="handleCancel">{{ i18n.global.t('common.cancel') }}</m-button>
        </div>
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
                        <m-button type="default" style="width: 90px; margin-right: 12px" @click="handleCancel">{{ i18n.global.t('meos_control_web.leave_directly') }}</m-button>
                        <m-button type="primary" style="width: 102px" @click="handleConfirm">{{ i18n.global.t('meos_control_web.save_and_leave') }}</m-button>
                    </div>
                </div>
            </template>
        </m-modal>
    </div>
</template>
<script setup>
import GroupIcon from '@/assets/svg/group.svg';
import { MMessageBox, $Message } from 'meri-plus';
import { VueDraggable } from 'vue-draggable-plus';
import MointorPlainIcon from '@/assets/svg/monitor-plain-icon.svg';
import { IconMeriActionDelete, IconMeriComponentDialogWarning } from 'meri-icon';
import { exitVideoGroupKey } from '../../hooks/useVideoGroup';
import { SUCCESSCODE } from '@/utils/globalVariables';
import {
    confirmModalInjectKey,
    monitorGroupParamsInjectKey,
    saveMonitorGroupInjectKey,
    checkMonitorGroupNameInjectKey,
    delMonirotGroupInjectKey,
    removeObjByIdInjectKey
} from '../../hooks/useMonitorEditHook';
import { useElementSize } from '@vueuse/core';
import { closeEditMonitorGroupDrawerInjectKey } from '../../hooks/useDrawer';
import { trim } from 'lodash';
import i18n from '@/localization';

const saveObjectGroup = inject(saveMonitorGroupInjectKey);
const checkNameExists = inject(checkMonitorGroupNameInjectKey);
const delObjectGroup = inject(delMonirotGroupInjectKey);
const params = inject(monitorGroupParamsInjectKey);
const previewMultiPlayer = inject('previewMultiPlayerKey');
const monitorForm = ref();
const isDraggingDisabled = ref(false);
const nameErrorText = ref('');
const groupEditPanel = ref();
const { height } = useElementSize(groupEditPanel);
const isDragging = ref(false);
const emit = defineEmits(['previewVideoGroup', 'changeCurrentSplit', 'editVideoGroup', 'hoverMonitorVideo', 'unhoverMonitorVideo', 'closePlayer']);
const onDragStart = event => {
    isDragging.value = true;
    const draggedIndex = event.oldIndex;
    params.objects[draggedIndex].isDragging = true;
};
const currentHover = ref('');
const hoverMonitorVideo = video => {
    if (isDragging.value) {
        return;
    }
    currentHover.value = video.id;
    emit('hoverMonitorVideo', video);
};
const unhoverMonitorVideo = () => {
    if (isDragging.value) {
        return;
    }
    currentHover.value = '';
    emit('unhoverMonitorVideo');
};
const changeCurrentSplit = selected => {
    emit('changeCurrentSplit', parseInt(selected));
};
const previewVideo = item => {
    emit('previewVideoGroup', params.objects?.map(obj => obj.id) || []);
    previewMultiPlayer.value = true;
    changeCurrentSplit(params.layout);
};
const onKeyPress = val => {
    nameErrorText.value = '';
    nextTick(() => {
        params.groupName = trim(val);
    });
};
const onDragEnd = () => {
    isDragging.value = false;
    params.objects.forEach((item, index) => {
        item.isDragging = false;
        item.sequence = index;
    });

    if (previewMultiPlayer.value) {
        emit('previewVideoGroup', params.objects?.map(obj => obj.id) || []);
    }
    emit('editVideoGroup', params.objects?.map(obj => obj.id) || []);
};
const exitVideoGroup = inject(exitVideoGroupKey);
const confirmModal = inject(confirmModalInjectKey);
const delMonitorItem = inject(removeObjByIdInjectKey);
const closeEditMonitorGroupDrawer = inject(closeEditMonitorGroupDrawerInjectKey);
const handleConfirm = () => {
    // TODO 提交数据
    saveForm();
};

const delVideo = id => {
    delMonitorItem(id);
    emit('unhoverMonitorVideo');
    if (previewMultiPlayer.value) {
        emit('previewVideoGroup', params.objects?.map(obj => obj.id) || []);
    }
    emit('editVideoGroup', params.objects?.map(obj => obj.id) || []);
    if (params.objects.length === 0) {
        emit('closePlayer');
    }
};
const handleCancel = () => {
    emit('closePlayer');
    exitVideoGroup?.();
    closeEditMonitorGroupDrawer();
};
const loading = ref(false);
const delMonitorGroup = params => {
    MMessageBox({
        type: 'danger',
        title: `${i18n.global.t('common.delete')}「${params.groupName}」`,
        customClass: 'customClass',
        hasLoading: true,
        message: `${i18n.global.t('meos_control_web.delete_irreversible')}`,
        confirmButtonText: i18n.global.t('common.delete'),
        cancelButtonText: i18n.global.t('common.cancel'),
        beforeClose: async (action, data, done) => {
            if (action === 'confirm') {
                try {
                    if (loading.value) return;
                    loading.value = true;
                    delObjectGroup(params)
                        .then(res => {
                            if (res.code === SUCCESSCODE) {
                                setTimeout(() => {
                                    $Message.success(i18n.global.t('meos_control_web.delete_success'));
                                    emit('closePlayer');
                                    closeEditMonitorGroupDrawer();
                                    exitVideoGroup?.();
                                }, 600);
                            }
                        })
                        .finally(() => {
                            done();
                            loading.value = false;
                        });
                } finally {
                    loading.value = false;
                    done();
                }
            } else {
                done();
            }
        }
    });
};

const saveForm = () => {
    monitorForm.value.validate((valid, error) => {
        if (valid) {
            if (loading.value) return;
            if (params.objects.length <= 0) {
                $Message.error(`${i18n.global.t('meos_control_web.no_camera_added')}`);
                return;
            }
            loading.value = true;
            checkNameExists({
                id: params.id,
                groupName: params.groupName,
                groupType: params.groupType
            }).then(res => {
                if (res.code === SUCCESSCODE) {
                    if (res.data) {
                        nameErrorText.value = i18n.global.t('meos_control_web.goupname_repeat_tip');
                        $Message.error(`${i18n.global.t('meos_control_web.goupname_repeat_tip')}`);
                        loading.value = false;
                    } else {
                        saveObjectGroup({
                            id: params.id,
                            groupName: trim(params.groupName),
                            groupType: params.groupType,
                            layout: params.layout,
                            objects: params.objects.map(object => {
                                return {
                                    id: object.id,
                                    sequence: object.sequence
                                };
                            })
                        })
                            .then(res => {
                                if (res.code === SUCCESSCODE) {
                                    setTimeout(() => {
                                        $Message.success(`${i18n.global.t('common.operation_success')}`);
                                        emit('closePlayer');
                                        closeEditMonitorGroupDrawer();
                                        exitVideoGroup?.();
                                    }, 600);
                                }
                            })
                            .finally(() => {
                                loading.value = false;
                            });
                    }
                }
            });
        } else {
            loading.value = false;
            $Message.error(`${i18n.global.t('meos_control_web.input_required_check_error_4')}`);
        }
    });
};
</script>
<style lang="less" scoped>
.group-edit-panel-wrap {
    width: 100%;
    height: 100%;
    border-radius: 8px;
    background: #fff;
    box-shadow: 0 8px 10px 0 rgba(27, 33, 41, 0.03);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    .group-edit-panel-header {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        padding: 16px 16px 0 16px;
        .group-edit-panel-title {
            color: var(--gray-800, #2e3742);
            font-size: 16px;
            font-style: normal;
            font-weight: 700;
            line-height: 22px; /* 137.5% */
        }
        .to-control-btns {
            display: flex;
            flex-direction: row;
            gap: 12px;
            height: 28px;
        }
    }
    .group-edit-panel-content {
        height: calc(100% - 100px);
        position: relative;
    }
    .group-edit-panel-form {
        height: 100%;
        :deep .group-edit-panel-form-scroller {
            padding: 16px 16px 0 16px;
            .m-form-item__label {
                word-break: keep-all;
                word-wrap: break-word;
            }
        }

        .add-monitor-tips {
            padding: 8px 16px;
            flex-direction: column;
            align-items: flex-start;
            gap: 4px;
            border-radius: 4px;
            margin-bottom: 16px;
            background: var(--blue-50, #ebf6ff);
            .add-monitor-tips-title {
                color: var(--gray-900, #1b2129);
                font-size: 14px;
                font-style: normal;
                font-weight: 700;
                line-height: 22px; /* 157.143% */
                .required {
                    color: var(--red-500, #f55047);
                }
            }
            .add-monirot-tips-content {
                color: var(--gray-900, #1b2129);
                font-size: 14px;
                font-style: normal;
                font-weight: 400;
                line-height: 22px; /* 157.143% */
            }
        }
    }
    .add-monitor-items {
        > div {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }
        .add-monitor-item {
            display: flex;
            flex-direction: row;
            align-items: center;
            padding: 9px 12px 9px 4px;
            align-items: center;
            gap: 4px;
            flex-shrink: 0;
            justify-content: space-between;
            max-width: 100%;
            box-sizing: content-box;
            position: relative;
            border-radius: 4px;
            background: var(--gray-100, #f1f4f6);
            border: 1px solid var(--gray-100, #f1f4f6);
            .scene-icon {
                flex-shrink: 0;
                cursor: move;
                width: 8px;
            }
            .add-monitor-item-content {
                display: flex;
                flex-direction: row;
                align-items: center;
                position: relative;
                max-width: 100%;
                gap: 4px;
                .add-monitor-item-title {
                    position: relative;
                    max-width: 100%;
                    color: var(--gray-900, #1b2129);
                    font-size: 14px;
                    font-style: normal;
                    font-weight: 400;
                    line-height: 24px; /* 157.143% */
                }
            }
            &.hovering {
                border: 1px solid var(--blue-500, #246fe5);
                .add-monitor-item-content {
                    max-width: calc(100% - 56px);
                }
                .add-monitor-item-action {
                    display: flex;
                }
                &.dragging {
                    opacity: 0.4;
                }
            }

            .add-monitor-item-action {
                flex-direction: row;
                align-items: center;
                display: none;
                gap: 4px;
                .monitor-icon {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 24px;
                    height: 24px;
                    border-radius: 4px;
                    &:hover {
                        background: var(--Grey-Alpha-30, rgba(196, 201, 207, 0.3));
                    }
                }
            }
        }
        &.dragging {
            .add-monitor-item {
                &:hover {
                    border: 1px solid transparent;
                    .add-monitor-item-content {
                        max-width: calc(100% - 56px);
                    }
                    .add-monitor-item-action {
                        display: flex;
                    }
                }
            }
            .add-monitor-item.dragging {
                border: 1px solid var(--blue-500, #246fe5);
                .add-monitor-item-content {
                    max-width: calc(100% - 56px);
                }
                .add-monitor-item-action {
                    display: flex;
                }
            }
        }
    }

    .group-edit-panel-footer {
        padding: 12px 16px;
        display: flex;
        background-color: #fff;
        flex-direction: row;
        z-index: 1;
        box-sizing: border-box;
        gap: 12px;
        align-items: center;
        border-top: 1px solid var(--Grey-Alpha-30, rgba(196, 201, 207, 0.3));
    }
}
</style>
