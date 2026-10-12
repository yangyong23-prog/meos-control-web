<template>
    <div class="manage-template-frame">
        <m-modal
            v-model:visible="showModel"
            :append-to="$modalAppendTo"
            type="default"
            :width="600"
            :title="i18n.global.t('meos_control_web.template_management')"
            content-class-name="TemplateManage"
            @close="close()"
        >
            <template #content>
                <div class="temp-tip">
                    <IconMeriComponentNotificationInfo class="icon" size="14" />
                    {{ i18n.global.t('meos_control_web.preset_template_auto_apply_custom_template_manual_select') }}
                    <span @click="goCalendar"
                        >{{ i18n.global.t('meos_control_web.view_demand_calendar') }}
                        <svg class="icon-d" aria-hidden="true">
                            <use xlink:href="#icon-details" />
                        </svg>
                    </span>
                </div>
                <div class="temp-list">
                    <div
                        v-for="(item, index) in list"
                        :key="item.templateId"
                        class="temp-box"
                        :class="{ 'edit-temp': !item.isInitialized, mar5: index === initializedList.length }"
                    >
                        <div v-if="item.isInitialized" class="temp-left">
                            {{ item.templateName
                            }}<m-tag v-if="item.isInitialized" color="#1B4ACC" bg-color="#D9EBFF" size="small">{{ i18n.global.t('meos_control_web.preset') }}</m-tag>
                        </div>
                        <div v-else class="temp-left">
                            <m-input
                                ref="tempNameInputText"
                                v-model="item.templateName"
                                :placeholder="i18n.global.t('meos_control_web.please_input_template_name')"
                                :autofocus="false"
                                :clearable="false"
                                width="204"
                                :error-text="item.errorText"
                                :maxlength="{ length: 50, errorText: i18n.global.t('meos_control_web.max_words', { maxWords: 50 }) }"
                                @input="tempInputChange(item)"
                            >
                            </m-input>
                        </div>
                        <div class="temp-right">
                            {{ item.isEnabled == 'checked' ? i18n.global.t('meos_control_web.enable') : i18n.global.t('meos_control_web.disable') }}&nbsp;<m-switch
                                v-model="item.isEnabled"
                                @change="switchChange(item)"
                            ></m-switch>
                            <em v-if="!item.isInitialized" class="line"></em>
                            <m-button v-if="!item.isInitialized" type="icon" icon="IconMeriActionDelete" @click="deleteTemp(item, index)" />
                        </div>
                        <div v-if="index === initializedList.length - 1" class="line-lang"></div>
                    </div>
                </div>
            </template>
            <template #footer>
                <m-button v-if="!butdisabled" type="link" size="medium" class="add-but" @click="addTemp">
                    <IconMeriComponentButtonAdd color="#1B4ACC" />{{ i18n.global.t('meos_control_web.create_new_custom_template') }}</m-button
                >
                <m-tips :content="i18n.global.t('meos_control_web.template_limit_reached')" theme="darkTransparent">
                    <m-button v-if="butdisabled" type="link" size="medium" class="add-but" :disabled="butdisabled" @click="addTemp">
                        <IconMeriComponentButtonAdd color="#1B4ACC" />{{ i18n.global.t('meos_control_web.create_new_custom_template') }}
                    </m-button>
                </m-tips>
                <m-button type="default" @click="modalclose()">{{ i18n.global.t('common.cancel') }}</m-button>
                <m-button type="primary" @click="modalsave()">{{ i18n.global.t('common.save') }}</m-button>
            </template>
        </m-modal>
        <!-- 二次弹窗 删除、禁用 -->
        <m-modal
            v-model:visible="secondaryMoalIsShow"
            :append-to="$modalAppendTo"
            type="info"
            :title="type == 'delete' ? i18n.global.t('meos_control_web.sure_to_del_model') : i18n.global.t('meos_control_web.sure_to_ban_model')"
            :content="type == 'delete' ? i18n.global.t('meos_control_web.sure_to_del_model_content') : i18n.global.t('meos_control_web.sure_to_ban_model_content')"
        >
            <template #footer>
                <m-button type="default" @click="secondaryMoalClose">{{ i18n.global.t('common.cancel') }}</m-button>
                <m-button type="primary" @click="secondaryMoalConfirm">{{ i18n.global.t('common.confirm') }}</m-button>
            </template>
        </m-modal>
        <!-- 二次弹窗 退出 -->
        <m-modal
            v-model:visible="quitSecondaryMoalIsShow"
            :append-to="$modalAppendTo"
            type="info"
            :title="i18n.global.t('meos_control_web.confirm_exit')"
            :content="i18n.global.t('meos_control_web.filled_content_not_recoverable')"
        >
            <template #footer>
                <m-button type="default" @click="quitSecondaryMoalIsShow = false">{{ i18n.global.t('common.cancel') }}</m-button>
                <m-button type="primary" @click="quitSecondaryClose">{{ i18n.global.t('common.confirm') }}</m-button>
            </template>
        </m-modal>
    </div>
</template>

<script lang="ts" setup>
/*eslint-disable eqeqeq */
import { nextTick, onMounted, ref } from 'vue';
import { IconMeriActionDelete, IconMeriComponentNotificationInfo, IconMeriComponentButtonAdd } from 'meri-icon';
import { $Message } from 'meri-plus';
import baseStore from '@/store/baseStore';
import { useRouter } from 'vue-router';
import { listTemplate, editTemplate, delTemplate, checkExistsDateSettingInFuture } from '@/apis/ventilationDemand';
import { EMPTYTEXT, SUCCESSCODE } from '@/utils/globalVariables';
import { useErrorMessage, useSuccessMessage } from '@/utils/tools';
import { uniqueId, isNil, cloneDeep, map, isEqual } from 'lodash';
import i18n from '@/localization';

const router = useRouter();
const _this: any = getCurrentInstance()?.proxy;
const emits = defineEmits(['close']);
const showModel = ref(false);
const secondaryMoalIsShow = ref(false);
const quitSecondaryMoalIsShow = ref(false);
const isEnabled = ref();
const type = ref();
const itemCurr: any = ref({
    isEnabled: 'checked'
});
const toBeDelTemplateIds: any = ref([]);
const deleteIndex = ref();
const list: any = ref([]);
const copyList: any = ref([]);
// 是否应用未来日期
const settingInFuture: any = ref();

const tempNameInputText = ref();

const initializedList = ref();
// 新增模版
const addTemp = () => {
    list.value.push({
        templateId: uniqueId('item'),
        templateName: '',
        isInitialized: false,
        isEnabled: 'checked'
    });
    // 添加模板时，最后一个input默认选中
    nextTick(() => {
        tempNameInputSelect();
    });
};
// 默认选中
const tempNameInputSelect = () => {
    let el = tempNameInputText?.value[tempNameInputText?.value?.length - 1]?.$el,
        input = el.getElementsByClassName('input')[0];
    input.focus();
};
const deleteTemp = async (item: any, index: number) => {
    if (item.templateId.indexOf('item') > -1) {
        return list.value.splice(index, 1);
    }
    itemCurr.value = item;
    deleteIndex.value = index;
    type.value = 'delete';
    // 是否在未来日期应用
    await dateSettingInFuture();
    if (settingInFuture.value) {
        secondaryMoalIsShow.value = true;
    } else {
        list.value.splice(index, 1);
        if (item.templateId.indexOf('item') < 0) {
            toBeDelTemplateIds.value.push(item.templateId);
        }
    }
};
// 禁用
const switchChange = async (item: any) => {
    if (item.templateId.indexOf('item') > -1) return;
    itemCurr.value = item;
    type.value = '';
    if (item.isEnabled == 'uncheck') {
        isEnabled.value = item.isEnabled;
        // 是否在未来日期应用
        await dateSettingInFuture();
        if (settingInFuture.value) {
            secondaryMoalIsShow.value = true;
        }
    }
};
// input事件
const tempInputChange = (item: any) => {
    item.errorText = '';
    let newList = list.value,
        nameList = map(
            newList.filter((item: any) => item.templateName?.length),
            'templateName'
        );

    for (let i = 0; i < newList.length; i++) {
        let item = newList[i],
            // 名称不可重复判断
            count = nameList.filter(it => it === item.templateName).length;
        if (count == 1) {
            item.errorText = '';
        }
    }
    // 最多允许输入50个字
    if (item.templateName?.length > 50) {
        // eslint-disable-next-line no-return-assign
        return (item.errorText = i18n.global.t('meos_control_web.max_words', { maxWords: 50 }));
    }
};
// 去需求日历
const goCalendar = () => {
    // _this.$router.push({
    //   path: '/demandCalendar',
    //   query: { templateType: baseStore().templateType ,      islandPage:true,}
    // })
    const to: any = router.resolve({
        name: 'demandCalendar',
        query: {
            templateType: baseStore().templateType,
            templateId: baseStore().templateId
        } as any
    });
    window.open(to.href, '_blank');
};
// 二次弹窗
// 取消
const secondaryMoalClose = () => {
    secondaryMoalIsShow.value = false;
    if (type.value !== 'delete') {
        // 禁用
        itemCurr.value.isEnabled = 'checked';
    }
};
//  确定
const secondaryMoalConfirm = () => {
    // 如果是删除
    if (type.value == 'delete') {
        if (itemCurr.value.templateId.indexOf('item') < 0) {
            toBeDelTemplateIds.value.push(itemCurr.value.templateId);
        }
        delTemplate({
            projectId: baseStore().projectId,
            templateType: baseStore().templateType,
            toBeDelTemplateIds: toBeDelTemplateIds.value
        })
            .then((res: any) => {
                console.log(res, '0000');
                if (res.code === SUCCESSCODE) {
                    list.value.splice(deleteIndex.value, 1);
                }
            })
            .finally(() => {});
    }

    secondaryMoalIsShow.value = false;
};
// 模板管理
const close = () => {
    showModel.value = false;
    nextTick(() => {
        emits('close', false);
    });
};
// 取消
const modalclose = () => {
    // 是否有编辑过
    if (isEqual(list.value, copyList.value)) {
        showModel.value = false;
        nextTick(() => {
            emits('close', false);
        });
    } else {
        quitSecondaryMoalIsShow.value = true;
    }
};
// 保存
const modalsave = () => {
    let isSave = false,
        newList = list.value,
        nameList = map(
            newList.filter((item: any) => item.templateName?.length),
            'templateName'
        );
    for (let i = 0; i < newList.length; i++) {
        let item = newList[i];
        // 判断不可为空
        if (item.templateName?.length == 0) {
            item.errorText = i18n.global.t('meos_control_web.template_name_required');
            isSave = true;
        }
        // 名称不可重复判断
        // eslint-disable-next-line one-var
        let count = nameList.filter(it => it === item.templateName).length;
        if (count > 1) {
            item.errorText = i18n.global.t('meos_control_web.name_already_used_please_change');
            isSave = true;
        } else {
            item.errorText = '';
            isSave = false;
        }

        if (item.errorText) isSave = true;
    }
    if (isSave) return useErrorMessage(i18n.global.t('meos_control_web.error_items_exist_please_check'));
    save();
};
// 退出二次弹窗
const quitSecondaryClose = () => {
    quitSecondaryMoalIsShow.value = false;
    showModel.value = false;
    nextTick(() => {
        emits('close', false);
    });
};

onMounted(() => {
    showModel.value = true;
    toBeDelTemplateIds.value = [];
    getList();
});

// 获取模板
const getList = () => {
    let par = {
        projectId: baseStore().projectId,
        templateType: baseStore().templateType
    };
    listTemplate(par).then((res: any) => {
        if (res.code === SUCCESSCODE) {
            let { data } = res;
            data.forEach((item: any) => {
                item.isEnabled = item.isEnabled ? 'checked' : 'uncheck';
            });
            initializedList.value = data.filter((item: any) => {
                return item.isInitialized;
            });
            list.value = res.data;
            copyList.value = cloneDeep(res.data);
        }
    });
};

// 保存模板
const save = () => {
    let newList = cloneDeep(list.value);
    newList.forEach((item: any) => {
        item.isEnabled = item.isEnabled == 'checked' ? true : false;
        if (item.templateId.indexOf('item') > -1) {
            item.templateId = null;
        }
    });
    // eslint-disable-next-line one-var
    let par = {
        projectId: baseStore().projectId,
        templateType: baseStore().templateType,
        templates: newList,
        toBeDelTemplateIds: toBeDelTemplateIds.value
    };
    editTemplate(par).then((res: any) => {
        if (res.code === SUCCESSCODE) {
            toBeDelTemplateIds.value = [];
            showModel.value = false;
            nextTick(() => {
                emits('close', true);
            });
            // useSuccessMessage("保存成功");
            $Message.success({
                title: i18n.global.t('common.save_success'),
                showClose: true,
                duration: 3000,
                className: 'message_custom',
                button: i18n.global.t('meos_control_web.select_apply_date'),
                buttonClick: () => {
                    _this.$router.push({
                        path: '/demandCalendar',
                        query: { templateType: baseStore().templateType }
                    });
                }
            });
        }
    });
};
// 日期配置
const dateSettingInFuture = async () => {
    settingInFuture.value = false;
    const par = {
        projectId: baseStore().projectId,
        templateId: itemCurr.value.templateId
    };
    const res: any = await checkExistsDateSettingInFuture(par);
    if (res.code === SUCCESSCODE) {
        settingInFuture.value = true;
    }
};

//
const butdisabled = computed(() => {
    let l = list.value.filter((item: any) => !item.isInitialized);

    return l.length > 9;
});
</script>
<style lang="less">
.TemplateManage {
    padding: 0 !important;
    overflow: hidden;
}
.temp-tip {
    background: #d9ebff;
    position: relative;
    padding: 10px 16px;
    padding-left: 35px;
    .icon {
        position: absolute;
        left: 15px;
        top: 14px;
    }
    .icon-d {
        width: 22px;
        height: 22px;
        vertical-align: middle;
        margin-left: -5px;
    }
    span {
        color: #246fe5;
        cursor: pointer;
    }
}
.temp-list {
    font-size: 14px;
    padding: 0 20px;
    height: calc(100vh - 370px);
    overflow: auto;
    padding-bottom: 20px;
    .line-lang {
        width: 100%;
        border-bottom: 1px solid #e8ecf0;
        margin-top: 2px;
        position: absolute;
        bottom: -8px;
        left: 0;
    }
    .temp-box {
        display: flex;
        height: 48px;
        line-height: 48px;
        justify-content: space-between;
        background: #f1f4f6;
        border-radius: 3px;
        margin-top: 8px;
        padding: 0 10px;
        position: relative;
        .temp-left {
            color: #1b2129;
            align-items: center;
            display: flex;
            & > * {
                margin-left: 4px;
            }
            span {
                line-height: 22px;
            }
        }
        .temp-right {
            color: #626c78;
            align-items: center;
            display: flex;
            padding-right: 6px;
            overflow: hidden;
            & > * {
            }

            .line {
                height: 8px;
                width: 1px;
                background: #c4c9cf;
                margin: 0 8px;
                margin-left: 12px;
            }
            .but {
                cursor: pointer;
            }
        }
    }
    .edit-temp {
        height: 64px;
    }
    .mar5 {
        margin-top: 16px;
    }
}
.add-but {
    float: left;
    svg {
        vertical-align: text-top;
        margin-right: 3px;
    }
}
.message_custom {
    width: 280px !important;
    line-height: 20px;
}
</style>
<style lang="less" scoped>
.m-button.medium.padding {
    padding: 0 8px;
}
</style>
