<template>
    <m-modal
        v-model:visible="templateParams.sceneTimeShow"
        :append-to="$modalAppendTo"
        :escable="false"
        width="840"
        type="default"
        :title="i18n.global.t('meos_control_web.scene_period_config')"
        :auto-close="false"
        @close="closeModal"
    >
        <template #content>
            <div class="scene-template-container">
                <div class="title"><IconMeriComponentDialogWarning size="16" />{{ i18n.global.t('meos_control_web.scene_period_cover_24h') }}</div>
                <m-form ref="Mform" class="scene-form" label-width="100px" :model="templateParams" require-asterisk-position="right">
                    <m-scrollbar>
                        <VueDraggable v-model="templateParams.templateList" :disabled="isDraggingDisabled" @start="onDragStart" @end="onDragEnd">
                            <div
                                v-for="(item, index) in templateParams.templateList"
                                :key="item.sceneId"
                                class="scene-template-container-list"
                                :class="{ dragging: item.isDragging }"
                            >
                                <group-icon class="scene-icon" />
                                <div class="scene-template-container-list-left">
                                    <m-form-item
                                        :prop="`item.${index}.sceneName`"
                                        :item-model="item.sceneName"
                                        :rules="[
                                            { required: true, message: i18n.global.t('meos_control_web.input_required_check_error_2'), trigger: ['blur', 'change'] },
                                            { validator: (value, rule, callback) => validateTemplate(item, callback), trigger: ['blur', 'change'] }
                                        ]"
                                    >
                                        <m-input
                                            v-model="item.sceneName"
                                            :width="'100%'"
                                            :maxlength="20"
                                            :error-text="item.errorText"
                                            :placeholder="i18n.global.t('meos_control_web.please_input_scene_name_max20')"
                                            @blur="sceneNameBlur"
                                            @focus="isDraggingDisabled = true"
                                        >
                                        </m-input>
                                    </m-form-item>
                                    <div class="cascader-box">
                                        <m-form-item
                                            :ref="el => (formItemGroups['beginTime' + index] = el)"
                                            :prop="`item.${index}.beginTime`"
                                            :item-model="item.beginTime"
                                            :rules="[
                                                { required: true, message: i18n.global.t('meos_control_web.input_required_check_error_2'), trigger: ['blur'] },
                                                { validator: (value, rule, callback) => validateTime(item, callback), trigger: ['blur', 'change'] }
                                            ]"
                                        >
                                            <m-cascader
                                                v-model="item.beginTime"
                                                style="margin-right: 8px"
                                                trigger="hover"
                                                :width="310"
                                                :options="templateParams.beginTimeList"
                                                :caption="i18n.global.t('meos_control_web.start_time')"
                                                clearable
                                                show-message="true"
                                                @change="() => cascadValidateTime('endTime' + index, item)"
                                            >
                                            </m-cascader>
                                        </m-form-item>
                                        <m-form-item
                                            :ref="el => (formItemGroups['endTime' + index] = el)"
                                            :prop="`item.${index}.endTime`"
                                            :item-model="item.endTime"
                                            :rules="[
                                                { required: true, message: i18n.global.t('meos_control_web.input_required_check_error_2'), trigger: ['blur'] },
                                                { validator: (value, rule, callback) => validateTime(item, callback), trigger: ['blur', 'change'] }
                                            ]"
                                        >
                                            <m-cascader
                                                v-model="item.endTime"
                                                trigger="hover"
                                                :width="310"
                                                :options="templateParams.endTimeList"
                                                :caption="i18n.global.t('meos_control_web.end_time')"
                                                clearable
                                                show-message="true"
                                                @change="() => cascadValidateTime('beginTime' + index, item)"
                                            >
                                            </m-cascader>
                                        </m-form-item>
                                    </div>
                                </div>
                                <div class="scene-template-container-list-right">
                                    <m-button type="link" :disabled="templateParams.templateList.length === 1" @click="updateList(index, 'del')">{{
                                        i18n.global.t('common.delete')
                                    }}</m-button>
                                    <span class="scene-template-container-list-right-line"></span>
                                    <m-button type="link" @click="updateList(index, 'add')">{{ i18n.global.t('meos_control_web.add') }}</m-button>
                                </div>
                            </div>
                        </VueDraggable>
                    </m-scrollbar>
                </m-form>
            </div>
            <m-modal
                v-model:visible="templateParams.secondModalShow"
                :append-to="$modalAppendTo"
                :escable="false"
                type="info"
                :title="i18n.global.t('meos_control_web.confirm_exit')"
                :content="i18n.global.t('meos_control_web.filled_content_not_recoverable')"
                @close="cancel"
            >
                <template #footer>
                    <m-button type="default" @click.stop="cancel">{{ i18n.global.t('common.cancel') }}</m-button>
                    <m-button type="primary" @click.stop="close">{{ i18n.global.t('common.confirm') }}</m-button>
                </template>
            </m-modal>
        </template>
        <template #footer>
            <m-button type="default" @click.stop="closeModal">{{ i18n.global.t('common.cancel') }}</m-button>
            <m-button
                type="primary"
                :disabled="
                    templateParams.templateList.length === 1 &&
                    !templateParams.templateList[0].sceneName &&
                    !templateParams.templateList[0].beginTime &&
                    !templateParams.templateList[0].endTime
                "
                :loading="isLoading"
                @click.stop="save"
                >{{ i18n.global.t('common.confirm') }}</m-button
            >
        </template>
    </m-modal>
</template>
<script setup>
import { VueDraggable } from 'vue-draggable-plus';
import { curMenuIdKey } from '@/views/demand-management-light-upgraded/hooks/useGlobalData';
import { IconMeriComponentDialogWarning } from 'meri-icon';
import { getSceneTimeConfig } from '../../utils/getSceneTimeConfig';
import { editSceneConfigs } from '@/apis/lightingRequirements';
import GroupIcon from '@/assets/svg/group.svg';
import { $Message } from 'meri-plus';
import baseStore from '@/store/baseStore';
import i18n from '@/localization';

const props = defineProps({
    data: {
        type: Array,
        default: () => []
    },
    refresh: {
        type: Function,
        default: undefined
    },
    templateId: {
        type: String,
        default: ''
    }
});
const Mform = ref(); // 表单
const formItemGroups = ref({});
const curMenuId = inject(curMenuIdKey);
const { listsStart, listsEnd } = getSceneTimeConfig();
const emits = defineEmits(['close', 'updatePublicArea']);
const propData = computed(() => {
    return props.data;
});
const isDraggingDisabled = ref(false);
const templateParams = reactive({
    sceneTimeShow: false, //模板弹框
    secondModalShow: false, //二次弹框
    editItem: [], // 传入的需编辑的参数
    beginTimeList: [],
    endTimeList: [],
    sceneNameList: [],
    templateList: propData.value && propData.value.length ? [] : [{ sceneName: '', beginTime: '', endTime: '', isDragging: false }]
});
const isLoading = ref(false);
const isChanged = ref(false);
templateParams.beginTimeList = JSON.parse(JSON.stringify(listsStart));
templateParams.endTimeList = JSON.parse(JSON.stringify(listsEnd));
templateParams.endTimeList[0].children[0].children.shift();

const sceneNameBlur = () => {
    isDraggingDisabled.value = false;
    templateParams.sceneNameList = updateName(templateParams.templateList);
};

/**
 * 级联时间校验
 * @param cascadFormKey 校验的 cascader 表单的 key
 * @param item
 */
const cascadValidateTime = (cascadFormKey, item) => {
    if (item.beginTime && item.endTime) {
        formItemGroups.value[`${cascadFormKey}`]?.validate();
    }
};

const validateTemplate = (item, callback) => {
    if (checkStringTwice(templateParams.sceneNameList, item.sceneName)) {
        callback(new Error(''));
        templateParams.templateList.map(t => {
            if (checkStringTwice(templateParams.sceneNameList, t.sceneName)) {
                t.errorText = i18n.global.t('meos_control_web.scene_name_duplicate_in_template');
            } else {
                t.errorText = '';
            }
        });
    } else {
        templateParams.templateList.map(t => {
            if (checkStringTwice(templateParams.sceneNameList, t.sceneName)) {
                t.errorText = i18n.global.t('meos_control_web.scene_name_duplicate_in_template');
            } else {
                t.errorText = '';
            }
        });
        callback();
    }
};

// 新增时间校验函数
const validateTime = (item, callback) => {
    // 检查是否都是绝对时间
    if (item.beginTime && item.endTime && item.beginTime.startsWith('ABSOLUTE') && item.endTime.startsWith('ABSOLUTE')) {
        // 解析开始时间
        const beginParts = item.beginTime.split('/');
        const beginHour = parseInt(beginParts[1]);
        const beginMinute = parseInt(beginParts[2]);

        // 解析结束时间
        // 当选择的是 “当天结束”时，结束时间为 ABSOLUTE/00/00，为了通过校验 调整为 23:59进行校验
        const endParts = item.endTime.split('/');
        let endHour = parseInt(endParts[1]),
            endMinute = parseInt(endParts[2]);
        if (endHour === 0 && endMinute === 0) {
            endHour = 23;
            endMinute = 59;
        }

        // 转换为分钟数进行比较
        const beginTotalMinutes = beginHour * 60 + beginMinute;
        const endTotalMinutes = endHour * 60 + endMinute;

        // 如果结束时间早于或等于开始时间，则校验失败
        if (endTotalMinutes <= beginTotalMinutes) {
            callback(new Error(i18n.global.t('meos_control_web.start_time_cannot_gte_end_time')));
            return;
        }
    }

    callback();
};

const onDragStart = event => {
    const draggedIndex = event.oldIndex;
    templateParams.templateList[draggedIndex].isDragging = true;
};

const onDragEnd = () => {
    templateParams.templateList.forEach(item => {
        item.isDragging = false;
    });
};

// 验证场景名称是否重复两次
const checkStringTwice = (arr, str) => {
    const filteredArray = arr.filter(item => item === str);
    if (filteredArray.length >= 2) {
        return true;
    } else {
        return false;
    }
};

// 名称数组
const updateName = arr => {
    return arr
        .map(name => {
            return name.sceneName.trim();
        })
        .filter(item => item);
};

// 添加删除
const updateList = (index, status) => {
    if (status === 'add') {
        if (templateParams.templateList.length === 30) {
            $Message.Default({
                title: i18n.global.t('meos_control_web.reached_max_30_scenes'),
                showClose: true,
                duration: 3000,
                className: 'message_custom'
            });
            return;
        } else {
            templateParams.templateList.splice(index + 1, 0, { sceneName: '', beginTime: '', endTime: '', sceneId: null });
            templateParams.sceneNameList = updateName(templateParams.templateList);
        }
    } else {
        templateParams.templateList.splice(index, 1);
        templateParams.sceneNameList = updateName(templateParams.templateList);
    }
};

const save = () => {
    isLoading.value = true;
    if (!isChanged.value) {
        close();
        return;
    }
    Mform.value.validate(valid => {
        if (valid) {
            let configParams = [];
            configParams = templateParams.templateList.map(item => {
                let beginTime = item.beginTime.split('/'),
                    endTime = item.endTime.split('/'),
                    begin = {
                        timeType: beginTime[0]
                    },
                    end = {
                        timeType: endTime[0]
                    };
                if (beginTime[0] === 'ABSOLUTE') {
                    begin.absoluteTime = `${beginTime[1]}:${beginTime[2]}:00`;
                } else {
                    begin.timeDeviation = {
                        offset: beginTime[2],
                        timeType: 'MINUTE'
                    };
                }
                if (endTime[0] === 'ABSOLUTE') {
                    end.absoluteTime = `${endTime[1]}:${endTime[2]}:00`;
                } else {
                    end.timeDeviation = {
                        offset: endTime[2],
                        timeType: 'MINUTE'
                    };
                }
                return {
                    sceneId: item.sceneId,
                    sceneName: item.sceneName,
                    beginTime: begin,
                    endTime: end
                };
            });
            editSceneConfigs({
                projectId: baseStore().projectId,
                templateId: props.templateId,
                demandTemplateType: curMenuId.value,
                configParams: configParams
            }).then(res => {
                isLoading.value = false;
                if (res.result === 'success') {
                    $Message.success({ title: `${i18n.global.t('common.save_success')}` });
                    templateParams.sceneTimeShow = false;
                    if (props.refresh && isChanged.value) {
                        props.refresh();
                    } else {
                        emits('updatePublicArea');
                    }
                    emits('close');
                }
            });
        } else {
            isLoading.value = false;
            $Message.error({ title: `${i18n.global.t('meos_control_web.error_items_exist_please_check')}` });
        }
    });
};

const closeModal = () => {
    if (isChanged.value) {
        templateParams.secondModalShow = true;
    } else {
        close();
    }
};

const close = () => {
    templateParams.sceneTimeShow = false;
    nextTick(() => {
        emits('close');
    });
};

const cancel = () => {
    templateParams.secondModalShow = false;
};

const init = () => {
    if (props.data && props.data.length) {
        templateParams.templateList = props.data.map(item => {
            if (item.beginTime.timeType === 'ABSOLUTE') {
                item.start = `${item.beginTime.timeType}/${item.beginTime.absoluteTime.replace(/:/g, '').substring(0, 2)}/${item.beginTime.absoluteTime
                    .replace(/:/g, '')
                    .substring(2, 4)}`;
            } else {
                if (item.beginTime.timeDeviation.offset > 0) {
                    item.start = `${item.beginTime.timeType}/2/${item.beginTime.timeDeviation.offset}`;
                } else if (item.beginTime.timeDeviation?.offset < 0) {
                    item.start = `${item.beginTime.timeType}/1/${item.beginTime.timeDeviation.offset}`;
                } else {
                    item.start = `${item.beginTime.timeType}/0/0`;
                }
            }
            if (item.endTime.timeType === 'ABSOLUTE') {
                item.end = `${item.endTime.timeType}/${item.endTime.absoluteTime.replace(/:/g, '').substring(0, 2)}/${item.endTime.absoluteTime.replace(/:/g, '').substring(2, 4)}`;
            } else {
                if (item.endTime.timeDeviation.offset > 0) {
                    item.end = `${item.endTime.timeType}/2/${item.endTime.timeDeviation.offset}`;
                } else if (item.endTime.timeDeviation.offset < 0) {
                    item.end = `${item.endTime.timeType}/1/${item.endTime.timeDeviation.offset}`;
                } else {
                    item.end = `${item.endTime.timeType}/0/0`;
                }
            }
            return {
                sceneId: item.id,
                sceneName: item.sceneName,
                beginTime: item.start,
                endTime: item.end
            };
        });
        templateParams.editItem = JSON.parse(JSON.stringify(templateParams.templateList));
    }
};

// 监听所有的item，有不是默认值的单独放到一个数组里面
watch(
    () => [templateParams.editItem, templateParams.templateList],
    () => {
        isChanged.value = JSON.stringify(templateParams.editItem) !== JSON.stringify(templateParams.templateList);
    },
    { deep: true }
);

onMounted(() => {
    templateParams.sceneTimeShow = true;
    init();
});
</script>
<style lang="less" scoped>
.scene-template-container {
    position: relative;
    height: 530px;
    padding-top: 20px;

    .title {
        width: calc(100% + 48px);
        position: absolute;
        top: -20px;
        left: -24px;
        padding: 9px 12px 9px 16px;
        background: var(--blue-100, #d9ebff);
        color: var(--gray-900, #1b2129);

        font-size: 14px;
        font-style: normal;
        font-weight: var(--platform-font-weight);
        line-height: 22px;
        display: flex;
        align-items: center;

        svg {
            margin-right: 8px;
        }
    }

    &-list {
        padding: 16px 12px;
        margin-top: 16px;
        margin-bottom: 16px;
        border-radius: 4px;
        background: var(--gray-100, #f1f4f6);
        display: flex;
        justify-content: space-between;
        gap: 8px;
        .scene-icon {
            padding: 2.5px 4px;
            margin-top: 5px;
            box-sizing: content-box;
        }

        &-left {
            width: 100%;
            .cascader-box {
                display: flex;
                height: 32px;
                margin-top: 16px;
            }

            /deep/.m-cascader__result {
                background: #fff;
            }
        }

        &-right {
            display: flex;
            align-items: center;

            &-line {
                display: inline-block;
                margin: 0 8px;
                width: 1px;
                height: 14px;
                background: var(--gray-400, #c4c9cf);
            }
        }
    }
}
.dragging {
    cursor: move;
}
</style>
<style lang="less">
.scene-form {
    .m-form-item__content {
        margin-left: 0 !important;
    }
}
</style>
