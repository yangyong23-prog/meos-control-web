<template>
    <div class="batch-control">
        <div class="fcb lin-height">
            <div class="fc f14">
                <div class="mr12 title">{{ i18n.global.t('meos_control_web.auto_status') }}</div>
                <div class="text-info">{{ list.autoStatusCount || 0 }}</div>
            </div>
            <template v-if="list.hasDisableControl">
                <m-button disabled type="link" size="small" @click="e => BatchManual('', e)">{{ i18n.global.t('meos_control_web.batch_manual') }}</m-button>
            </template>
            <template v-else-if="list.autoStatusCount == 0">
                <m-tips :content="i18n.global.t('meos_control_web.no_auto_state_cannot_switch')" theme="darkTransparent">
                    <m-button disabled type="link" size="small" @click="e => BatchManual('', e)">{{ i18n.global.t('meos_control_web.batch_manual') }}</m-button>
                </m-tips>
            </template>
            <template v-else-if="isEdge()">
                <m-button type="link" size="small" @click="e => BatchManual('', e)">{{ i18n.global.t('meos_control_web.batch_manual') }}</m-button>
            </template>
            <template v-else>
                <m-tips :content="i18n.global.t('meos_control_web.equipment_currently_uncontrollable')" theme="darkTransparent">
                    <m-button disabled type="link" size="small" @click="e => BatchManual('', e)">{{ i18n.global.t('meos_control_web.batch_manual') }}</m-button>
                </m-tips>
            </template>
        </div>
    </div>
    <div class="batch-control">
        <div class="fcb lin-height">
            <div class="fc f14">
                <div class="mr12 title fc">
                    <div class="mr4">{{ i18n.global.t('meos_control_web.manual_status') }}</div>
                    <m-tips theme="darkTransparent" placement="right-start" trigger="hover">
                        <template #content>{{ i18n.global.t('meos_control_web.loop_manual_state_ignores_demand') }}</template>
                        <div class="fcc"><IconMeriActionTips style="cursor: pointer" /></div>
                    </m-tips>
                </div>
                <div class="text-info">{{ list.manualStatusCount || 0 }}</div>
            </div>
            <template v-if="list.hasDisableControl">
                <m-button disabled type="link" size="small">{{ i18n.global.t('meos_control_web.batch_auto') }}</m-button>
            </template>
            <template v-else-if="list.manualStatusCount == 0">
                <m-tips :content="i18n.global.t('meos_control_web.no_manual_state_cannot_switch')" theme="darkTransparent">
                    <m-button disabled type="link" size="small">{{ i18n.global.t('meos_control_web.batch_auto') }}</m-button>
                </m-tips>
            </template>
            <template v-else-if="isEdge()">
                <m-popconfirm placement="bottom" width="300px" :content="i18n.global.t('meos_control_web.confirm_switch_to_auto_dup')" status="primary" @confirm="confirm">
                    <m-button type="link" size="small" @click="clickBtn">{{ i18n.global.t('meos_control_web.batch_auto') }}</m-button>
                </m-popconfirm>
            </template>
            <template v-else>
                <m-tips :content="i18n.global.t('meos_control_web.equipment_currently_uncontrollable')" theme="darkTransparent">
                    <m-button disabled type="link" size="small">{{ i18n.global.t('meos_control_web.batch_auto') }}</m-button>
                </m-tips>
            </template>
        </div>
        <div class="line"></div>
        <div class="fcb">
            <div class="fc f14">
                <div class="mr12 title title-set">{{ i18n.global.t('meos_control_web.switch_setpoint') }}</div>
            </div>
            <div v-if="list.hasDisableControl">
                <m-button v-for="item in state.list" :key="item.name" size="small" disabled>{{ item.name }}</m-button>
            </div>
            <div v-else-if="list.manualStatusCount === 0">
                <!-- 手动为0不能操作 0802添加 -->
                <m-tips v-for="item in state.list" :key="item.name" :content="i18n.global.t('meos_control_web.no_lighting_loop_operable')" theme="darkTransparent">
                    <m-button size="small" disabled>{{ item.name }}</m-button>
                </m-tips>
            </div>
            <div v-else-if="isEdge()">
                <m-popconfirm
                    v-for="(item, index) in state.list"
                    :key="index"
                    placement="bottom"
                    :content="i18n.global.t('meos_control_web.confirm_operate_loop', { name: item.name })"
                    :before-confirm="done => beforeConfirm(item, item.code, done)"
                    status="primary"
                >
                    <m-button size="small" @click="clickBtn">{{ item.name }}</m-button>
                </m-popconfirm>
            </div>
            <div v-else>
                <template v-for="(item, idex) in state.list" :key="idex">
                    <m-tips :content="i18n.global.t('meos_control_web.equipment_currently_uncontrollable')" theme="darkTransparent">
                        <m-button size="small" disabled>{{ item.name }}</m-button>
                    </m-tips>
                </template>
            </div>
        </div>
    </div>

    <batchPopup ref="batchPopupRef" @submit-btn="submitBtn" />
    <!-- 失败设备列表弹框 -->
    <CommonMessageModal v-if="showMessageModal" v-model="showMessageModal" :data="errorMessageList" @close="showMessageModal = false" />
</template>
<script setup>
import { $Message } from 'meri-plus';
import { IconMeriActionTips } from 'meri-icon';
import batchPopup from './batchPopup.vue';
import CommonMessageModal from '@/components/common/commonMessageModal/index.vue';
import useMessage from '@/components/hooks/useMessage';
import { useGeneralControl } from '@/hooks/useGeneralControl';
import { SUCCESSCODE, OBJ_TYPE } from '@/utils/globalVariables';
import dayjs from 'dayjs';
import emitter from '@/utils/bus';
import { isEdge } from '@/utils/envUtils';
import i18n from '@/localization';

const { controlFn } = useGeneralControl();
const { useSuccessMessage, useErrorMessage, showMessageModal, errorMessageList } = useMessage();
defineProps({
    list: {
        type: Object,
        default: () => {}
    }
});
const state = reactive({
    list: [
        {
            name: i18n.global.t('meos_control_web.on'),
            code: '1'
        },
        {
            name: i18n.global.t('meos_control_web.off'),
            code: '0'
        }
    ],
    code: '',
    name: ''
});
const batchPopupRef = ref();
const initSpace = inject('initSpace');
const initModule = inject('initModule');
const spaceModuleInfo = inject('spaceModuleInfo');
console.log(spaceModuleInfo, 'spaceModuleInfo');
const model = ref();
const dataValue = ref({});
const beforeConfirm = async (data, value, done) => {
    await editSwitchValue(data, false, value);
    done();
};
const editSwitchValue = async (data, type = true, value) => {
    console.log(data, 'data');
    state.code = value;
    state.name = data.name;
    await setsetOperatingParameters();
};
const clickBtn = () => {
    // batchPopupRef.value.showFun();
    emitter.emit('hiddenBatchPopupBus');
    emitter.emit('showControlModelPopBus');
};
const setsetOperatingParameters = async () => {
    const obj = {
        objectIds: [spaceModuleInfo.value.id],
        infoValue: state.code,
        infoCode: 'equipSwitchSet'
    };
    await controlFn({
        data: obj,
        callback: res => {
            if (res.code === SUCCESSCODE) {
                if (res.data?.failureNum) {
                    if (res.data?.successCount) {
                        // 有成功
                        useErrorMessage(
                            i18n.global.t('meos_control_web.batch_control_message1', {
                                successCount: res.data?.successCount,
                                failureNum: res.data?.failureNum,
                                name: state.name
                            }),
                            5000,
                            res.data?.errorCountObject
                        );
                    } else if (res.data?.noControlCount) {
                        // 有不可控
                        useErrorMessage(
                            i18n.global.t('meos_control_web.batch_control_message2', {
                                successCount: res.data?.successCount,
                                failureNum: res.data?.failureNum,
                                name: state.name,
                                noControlCount: res.data?.noControlCount
                            }),
                            5000,
                            res.data?.errorCountObject
                        );
                    } else {
                        // 全部失败
                        useErrorMessage(
                            i18n.global.t('meos_control_web.batch_control_message3', {
                                failureNum: res.data?.failureNum,
                                name: state.name
                            }),
                            5000,
                            res.data?.errorCountObject
                        );
                    }
                } else {
                    if (res.data?.noControlCount) {
                        // 有不可控
                        useSuccessMessage(
                            i18n.global.t('meos_control_web.batch_control_message4', {
                                successCount: res.data?.successCount,
                                name: state.name,
                                noControlCount: res.data?.noControlCount
                            })
                        );
                    } else {
                        // 全部成功
                        useSuccessMessage(
                            i18n.global.t('meos_control_web.batch_control_message5', {
                                successCount: res.data?.successCount,
                                name: state.name
                            })
                        );
                    }
                }
                if (spaceModuleInfo.value.objType === OBJ_TYPE.SPACE) {
                    initSpace(false);
                } else {
                    initModule(false);
                }
            }
        }
    });
};
// const { isComponentVisible, closePopupShow } = showInfoStore();
const BatchManual = (item, e) => {
    if (!isEdge()) {
        return;
    }
    // closePopupShow();
    batchPopupRef.value.showFun(item, e.target);
};
const getChangeManualAutoStatusByObjectIds = () => {
    const obj = {
        objectIds: [spaceModuleInfo.value.id],
        infoCode: 'manualAutoSet',
        infoValue: model.value,
        content: dataValue.value.reason,
        expireTime: dataValue.value.expireTime ? dayjs(dataValue.value.expireTime).format('YYYYMMDDHHmmss') : ''
    };
    if (spaceModuleInfo.value.objType === OBJ_TYPE.EQUIPMENT) {
        obj.isController = true; // 0802新加，解决模块关联设备批量手自动没有控制回路
    }
    controlFn({
        data: obj,
        callback: res => {
            if (res.code === SUCCESSCODE) {
                dataValue.value = {};
                if (res.data?.failureNum) {
                    if (res.data?.successCount) {
                        // 有成功
                        useErrorMessage(
                            i18n.global.t('meos_control_web.batch_control_message1', {
                                successCount: res.data?.successCount,
                                name: i18n.global.t('meos_control_web.modify'),
                                failureNum: res.data?.failureNum
                            }),
                            5000,
                            res.data?.errorCountObject
                        );
                    } else if (res.data?.noControlCount) {
                        // 有不可控
                        useErrorMessage(
                            i18n.global.t('meos_control_web.batch_control_message1', {
                                successCount: res.data?.successCount,
                                failureNum: res.data?.failureNum,
                                name: i18n.global.t('meos_control_web.modify'),
                                noControlCount: res.data?.noControlCount
                            }),
                            5000,
                            res.data?.errorCountObject
                        );
                    } else {
                        // 全部失败
                        useErrorMessage(
                            i18n.global.t('meos_control_web.batch_control_message3', {
                                name: i18n.global.t('meos_control_web.modify'),
                                failureNum: res.data?.failureNum
                            }),
                            5000,
                            res.data?.errorCountObject
                        );
                    }
                } else {
                    if (res.data?.noControlCount) {
                        // 有不可控
                        useSuccessMessage(
                            i18n.global.t('meos_control_web.batch_control_message4', {
                                name: i18n.global.t('meos_control_web.modify'),
                                successCount: res.data?.successCount,
                                noControlCount: res.data?.noControlCount
                            })
                        );
                    } else {
                        // 全部成功
                        useSuccessMessage(
                            i18n.global.t('meos_control_web.batch_control_message5', {
                                name: i18n.global.t('meos_control_web.modify'),
                                successCount: res.data?.successCount
                            })
                        );
                    }
                }
                if (spaceModuleInfo.value.objType === OBJ_TYPE.SPACE) {
                    initSpace(false);
                } else {
                    initModule(false);
                }
            }
        }
    }).then();
};
const messageInfo = data => {
    $Message.success({
        title: i18n.global.t('meos_control_web.name_success', { name: data }),
        showClose: true,
        duration: 3000,
        className: 'message_custom',
        buttonClick: () => {
            console.log(1111);
        }
    });
};
const confirm = () => {
    model.value = 1;
    getChangeManualAutoStatusByObjectIds();
};
//开启关闭
const confirmBtn = data => {
    messageInfo(data);
    if (spaceModuleInfo.value.objType === OBJ_TYPE.SPACE) {
        initSpace(false);
    } else {
        initModule(false);
    }
};
//确定后的回调
const submitBtn = item => {
    model.value = 0;
    dataValue.value = item;
    getChangeManualAutoStatusByObjectIds();
};
</script>
<style lang="less" scoped>
.batch-control {
    width: 100%;
    padding: 4px 12px;
    border-radius: 4px;
    margin-bottom: 12px;
    background: #f7f9fa;
    .lin-height {
        height: 32px;
        .title {
            width: 76px;
            color: #000;
        }
        .text-info {
            color: #000;
            font-family: 'Persagy2.0';
            font-size: 14px;
            font-weight: 700;
        }
    }
    .title-set {
        color: #626c78;
    }
}
.line {
    height: 1px;
    margin: 4px 0 8px 0;
    background: linear-gradient(to left, transparent 0%, transparent 50%, #dfe3e9 50%, #dfe3e9 100%);
    background-size: 10px 1px;
    background-repeat: repeat-x;
}
.border-b {
    border-bottom: 1px solid #e8ecf0;
}
.m-button + .m-button {
    margin-left: 4px;
}
</style>
