<template>
    <m-modal
        v-model:visible="show"
        :append-to="$modalAppendTo"
        type="default"
        :title="
            !props.type
                ? i18n.global.t('meos_control_web.switch_to_manual_mode_dup')
                : `${i18n.global.t('meos_control_web.manual_auto_control')}（${
                      curModel === '0' ? i18n.global.t('meos_control_web.one_click_manual') : i18n.global.t('meos_control_web.one_click_auto')
                  }）`
        "
        :width="420"
        @close="close"
    >
        <template #content>
            <m-form ref="Mform" :label-width="!props.type ? '286px' : '86px'" :model="params" require-asterisk-position="right" :label-position="!props.type ? 'top' : 'left'">
                <m-form-item
                    v-if="props.type"
                    :label="i18n.global.t('meos_control_web.equipment_scope')"
                    prop="objectIds"
                    :rules="[{ type: 'array', required: true, message: EMPTYTEXT, trigger: 'change' }]"
                >
                    <m-tree-select v-model="params.objectIds" :data="equitManual" :mode="tags" :not-null="false" multiple searchable panel-searchable @change="changeTree">
                    </m-tree-select>
                </m-form-item>
                <template v-if="props.type">
                    <m-form-item
                        v-if="curModel === '0'"
                        :label="i18n.global.t('meos_control_web.end_time')"
                        prop="expireTime"
                        :rules="[
            { required: true, message: EMPTYTEXT, trigger: 'change' },
            {
              validator: (_value: any, _rule: any, callback: any) => validateLessNow(params.expireTime, callback),
              trigger: 'change'
            }]"
                    >
                        <m-date-picker
                            v-model="params.expireTime"
                            type="datetime"
                            placement="bottomRight"
                            :placeholder="i18n.global.t('meos_control_web.please_select')"
                            :popover-attrs="{
                                arrowOverflow: false
                            }"
                            :scope="SCOPE()"
                            :time-picker="{
                                stepM: 1,
                                format: 'hm'
                            }"
                        /> </m-form-item
                ></template>
                <template v-else>
                    <m-form-item
                        :label="i18n.global.t('meos_control_web.end_time')"
                        prop="expireTime"
                        require-asterisk-position="null"
                        :rules="[
            { required: true, message: EMPTYTEXT, trigger: 'change' },
            {
              validator: (_value: any, _rule: any, callback: any) => validateLessNow(params.expireTime, callback),
              trigger: 'change'
            }]"
                    >
                        <template #label>
                            {{ i18n.global.t('meos_control_web.end_time') }}
                            <span style="color: var(--red-500)">&nbsp;*&nbsp;</span>
                            <span class="fs12" style="color: var(--gray-500)">{{ i18n.global.t('meos_control_web.device_returns_auto_after_end_time') }}</span>
                        </template>
                        <m-date-picker
                            v-model="params.expireTime"
                            type="datetime"
                            placement="bottomRight"
                            :placeholder="i18n.global.t('meos_control_web.please_select')"
                            :popover-attrs="{
                                arrowOverflow: false
                            }"
                            :scope="SCOPE()"
                            :time-picker="{
                                stepM: 1,
                                format: 'hm'
                            }"
                        />
                    </m-form-item>
                </template>
                <template v-if="props.type">
                    <m-form-item
                        v-if="curModel === '0'"
                        :label="i18n.global.t('meos_control_web.reason')"
                        prop="operateType"
                        :rules="[{ required: true, message: EMPTYTEXT, trigger: 'change' }]"
                    >
                        <m-select
                            v-model="params.operateType"
                            :placeholder="i18n.global.t('meos_control_web.please_select')"
                            controls="operatorIcon"
                            :size="240"
                            :options="operateTypeList"
                        /> </m-form-item
                ></template>
                <template v-else>
                    <m-form-item :label="i18n.global.t('meos_control_web.reason')" prop="operateType" :rules="[{ required: true, message: EMPTYTEXT, trigger: 'change' }]">
                        <m-select
                            v-model="params.operateType"
                            :placeholder="i18n.global.t('meos_control_web.please_select')"
                            controls="operatorIcon"
                            :size="240"
                            :options="operateTypeList"
                        />
                    </m-form-item>
                </template>
                <template v-if="props.type">
                    <m-form-item
                        v-if="params.operateType === '50' && curModel === '0'"
                        label=" "
                        prop="operateReason"
                        require-asterisk-position="null"
                        :rules="[
                            { required: true, message: EMPTYTEXT, trigger: 'blur' },
                            { max: 20, message: i18n.global.t('meos_control_web.max_20_chars'), trigger: ['blur', 'change'] }
                        ]"
                    >
                        <m-input v-model="params.operateReason" width="100%" :placeholder="i18n.global.t('meos_control_web.please_input_specific_reason')" /> </m-form-item
                ></template>
                <template v-else>
                    <m-form-item
                        v-if="params.operateType === '50'"
                        label=" "
                        prop="operateReason"
                        require-asterisk-position="null"
                        :rules="[
                            { required: true, message: EMPTYTEXT, trigger: 'blur' },
                            { max: 20, message: i18n.global.t('meos_control_web.max_20_chars'), trigger: ['blur', 'change'] }
                        ]"
                    >
                        <m-input v-model="params.operateReason" width="100%" :placeholder="i18n.global.t('meos_control_web.please_input_specific_reason')" />
                    </m-form-item>
                </template>
                <template v-if="props.type">
                    <m-form-item
                        v-if="curModel === '0'"
                        :label="i18n.global.t('common.remarks')"
                        prop="contentInfo"
                        class="flex-start"
                        :rules="[{ max: 50, message: i18n.global.t('meos_control_web.max_50_chars'), trigger: ['blur', 'change'] }]"
                    >
                        <m-input v-model="params.contentInfo" type="textarea" :placeholder="i18n.global.t('common.placeholder_input')" :width="240" :height="70" /> </m-form-item
                ></template>
                <template v-else>
                    <m-form-item
                        :label="i18n.global.t('common.remarks')"
                        prop="contentInfo"
                        class="flex-start"
                        :rules="[{ max: 50, message: i18n.global.t('meos_control_web.max_50_chars'), trigger: ['blur', 'change'] }]"
                    >
                        <m-input v-model="params.contentInfo" type="textarea" :placeholder="i18n.global.t('common.placeholder_input')" :width="220" :height="70" />
                    </m-form-item>
                </template>
            </m-form>
        </template>
        <template #footer>
            <m-button type="default" @click.stop="close">{{ i18n.global.t('common.cancel') }}</m-button>
            <m-button type="primary" @click.stop="submit">{{ i18n.global.t('common.confirm') }}</m-button>
        </template>
    </m-modal>
</template>

<script lang="ts" setup>
import { changeManualAutoStatusByObjectId, getManualAutoChangeReason, queryManualAutoClassList } from '@/apis/systemDiagram';
import { EMPTYTEXT, SCOPE, SUCCESSCODE } from '@/utils/globalVariables';
import { useErrorMessage, useSuccessMessage, validateLessNow } from '@/utils/tools';
import dayjs from 'dayjs';
import { Ref } from 'vue';
import { EquipmentNodes } from '../../types';
import { isEdge } from '@/utils/envUtils';
import baseStore from '@/store/baseStore';
import emitter from '@/utils/bus';
import { MMessageBox } from 'meri-plus';
// @ts-ignore
import i18n from '@/localization';

const emits = defineEmits(['close']);
const props = defineProps({
    type: {
        type: String,
        default: ''
    },
    model: {
        type: String,
        default: ''
    },
    typeStatus: {
        type: String,
        default: ''
    }
});
const curModel: Ref<string> = inject('curModel', ref('')); // 当前选择的手自动类型
const systemId: Ref<string> = inject('systemId', ref(''));
const expireTime: Ref<string> = inject('expireTime', ref(''));
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const getRunMode: any = inject('getRunMode')!;
const relationChartComponent: any = inject('relationChartComponent');

const show = ref(false);
const Mform = ref<any>(null);
// 0手动，1自动
const equipmentNode: Ref<EquipmentNodes> = inject('equipmentNode', ref<any>({}));
const params = ref<{
    model: '0' | '1';
    objectIds: Array<string>;
    operateType: string;
    expireTime: string;
    operateReason: string;
    contentInfo: string;
}>({
    model: props.type ? curModel.value : props.model,
    objectIds: [],
    expireTime: '',
    operateType: '',
    operateReason: '',
    contentInfo: ''
});
// 一键手自动控制：
// 点击“控制台”出此中心弹窗，可设置手自动设置
// 当选择“一键自动”时，原位出现二次确认提示，如右图
// 当选择“一键手动”时，显示更多信息“结束时间、原因、备注”
// 结束时间：必填，选择到分钟的维度，仅可选择未来时间
// 原因：必填，下拉单选，可选择“运行异常手动紧急操作、设备维保或设备调试、设备故障隔离、供冷需求变化，调整设备参数、其他”
// 当切换原因选择“其他”时，显示“原因批注”字段；必填，最多可输入20字，当输入超过20字时，输入框显示“最多可支持20个字符”
// 备注：为非必填字段，备注最多可输入50字，超过50字时输入框即时标红报错提示“最多可支持50个字符”
// 点击保存成功后，页面顶部massage提示“操作成功”
// 若是一键手动保存成功后，所有设备名称前均带上「手动」标签显示
const operateTypeList = ref<{ id: string; name: any }[]>([]);
const manualAutoChangeReason = () => {
    operateTypeList.value = [];
    getManualAutoChangeReason({ systemId: systemId.value }).then((res: any) => {
        if (res.code === SUCCESSCODE) {
            console.log(res);
            for (const key in res.data) {
                if (Object.prototype.hasOwnProperty.call(res.data, key)) {
                    operateTypeList.value.push({ id: key, name: res.data[key] });
                }
            }
            operateTypeList?.value.sort((a, b) => a.id - b.id);
        }
    });
};
const equitManual = ref<{ id: string; name: any }[]>([]);

const ManualAutoClassList = () => {
    equitManual.value = [];
    console.log(relationChartComponent.value);

    queryManualAutoClassList({ projectId: baseStore().projectId, systemId: systemId.value, systemGraphId: relationChartComponent.value.systemGraphDuplicateId }).then(res => {
        const { result, data } = res;
        if (result === 'success') {
            if (data && data.length) {
                equitManual.value = [
                    {
                        id: '0',
                        name: i18n.global.t('common.all'),
                        open: true,
                        children: data.map(i => {
                            i.name = i.className;
                            i.id = i.classCode;
                            i.disabled = props.typeStatus === 'HeatSource' ? i?.children.every((item: any) => item.enable === false) : false;
                            console.log(i);
                            i.children &&
                                i.children.forEach(k => {
                                    k.name = k.localName ?? '--';
                                    k.disabled = props.typeStatus === 'HeatSource' ? !k.enable : false;
                                });
                            return i;
                        })
                    }
                ];
            }
        }
    });
};
const changeTree = (ids, selectNode) => {
    console.log(ids, selectNode);
};
onMounted(() => {
    show.value = true;
    manualAutoChangeReason();
    if (props.type) {
        ManualAutoClassList();
    }
});
const close = (type?: boolean) => {
    show.value = false;
    nextTick(() => {
        emits('close', type === true);
    });
};

const submit = () => {
    Mform.value.validate((valid: boolean) => {
        if (valid) {
            if (props.typeStatus === 'HeatSource' && props.model === '1') {
                MMessageBox({
                    title: i18n.global.t('meos_control_web.acknowledge_release_manual_control'),
                    customClass: 'customClass',
                    hasLoading: true,
                    message: i18n.global.t('meos_control_web.confirm_release_manual_to_auto'),
                    beforeClose: (action: any, data: any, done: () => void) => {
                        if (action === 'confirm') {
                            const obj = structuredClone(params.value);
                            obj.expireTime = obj.expireTime ? dayjs(obj.expireTime).format('YYYYMMDDHHmm59') : '';
                            changeManualAutoStatusByObjectId({
                                objectId: equipmentNode.value?.id || systemId.value,
                                systemId: systemId.value,
                                ...obj
                            }).then(res => {
                                if (res.code === SUCCESSCODE) {
                                    emitter.emit('refreshNotify', 'query');
                                    close(true);
                                    if (equipmentNode.value.id) {
                                        if (isEdge()) {
                                            setTimeout(() => {
                                                getRunMode(equipmentNode.value.id, systemId.value, (_type: any, time: string) => {
                                                    expireTime.value = '';
                                                    expireTime.value = time;
                                                });
                                            }, 200);
                                        }
                                    }
                                    useSuccessMessage();
                                }
                            });
                            done();
                        } else {
                            done();
                        }
                    }
                });
            } else {
                const obj = structuredClone(params.value);
                obj.expireTime = obj.expireTime ? dayjs(obj.expireTime).format('YYYYMMDDHHmm59') : '';
                changeManualAutoStatusByObjectId({
                    objectId: equipmentNode.value?.id || systemId.value,
                    systemId: systemId.value,
                    ...obj
                }).then(res => {
                    if (res.code === SUCCESSCODE) {
                        emitter.emit('refreshNotify', 'query');
                        close(true);
                        if (equipmentNode.value.id) {
                            if (isEdge()) {
                                setTimeout(() => {
                                    getRunMode(equipmentNode.value.id, systemId.value, (_type: any, time: string) => {
                                        expireTime.value = '';
                                        expireTime.value = time;
                                    });
                                }, 200);
                            }
                        }
                        useSuccessMessage();
                    }
                });
            }
        } else {
            useErrorMessage();
        }
    });
};
</script>
<style lang="less" scoped>
.fs12 {
    font-size: 12px;
}
.radio-box {
    width: 100%;
    &-item {
        padding: 16px 20px;
        width: 100%;
        border-radius: 4px;
        border: 1px solid var(--gray-400);
        background: var(--gray-0);
        &.is-active {
            border: 1px solid var(--blue-500);
            background-color: var(--blue-50);
        }
        .m-radio {
            width: 100%;
        }
        p {
            padding-left: 24px;
            margin-top: 8px;
            font-size: 12px;
            color: var(--gray-500);
        }
        & + .radio-box-item {
            margin-top: 16px;
        }
    }
}
</style>
