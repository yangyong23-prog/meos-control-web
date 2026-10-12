<template>
    <m-scrollbar :height="'100%'" box-class="batch-control-scrollbar">
        <div class="batch-control">
            <div class="tips f14 ft">{{ i18n.global.t('meos_control_web.tip_loop_in_manual_state') }}</div>
            <div v-for="(item, index) in BatchControlList" :key="index" class="mt12 batch-control-item">
                <div class="fcb batch-control-item-top">
                    <div class="fc">
                        <div class="batch-control-item-img">
                            <img
                                v-if="item.funcType === lightingFuncType.generalLighting"
                                src="@/assets/imgs/demand/pt.png"
                                :alt="i18n.global.t('meos_control_web.general_lighting')"
                            />
                            <img
                                v-else-if="item.funcType === lightingFuncType.decorateLighting"
                                src="@/assets/imgs/demand/zs.png"
                                :alt="i18n.global.t('meos_control_web.decorative_lighting')"
                            />
                            <img
                                v-else-if="item.funcType === lightingFuncType.adLighting"
                                src="@/assets/imgs/demand/gg.png"
                                :alt="i18n.global.t('meos_control_web.advertising_lighting')"
                            />
                            <img
                                v-else-if="item.funcType === lightingFuncType.markLighting"
                                src="@/assets/imgs/demand/bs.png"
                                :alt="i18n.global.t('meos_control_web.signage_lighting')"
                            />
                            <img
                                v-else-if="item.funcType === lightingFuncType.permanentLighting"
                                src="@/assets/imgs/demand/cl.png"
                                :alt="i18n.global.t('meos_control_web.always_on_lighting')"
                            />
                            <img
                                v-else-if="item.funcType === lightingFuncType.backupLighting"
                                src="@/assets/imgs/demand/by.png"
                                :alt="i18n.global.t('meos_control_web.backup_lighting')"
                            />
                        </div>
                        <div class="ml4 f16">{{ item.funcTypeName }}</div>
                    </div>
                    <m-select v-model="item.selectedValues" class="custom-select" prefix="" noborder size="auto" :options="options" @change="selectChange"> </m-select>
                </div>
                <!-- 根据功能类型 -->
                <div v-show="item.selectedValues === '1'">
                    <div class="batch-control-item-middle">
                        <div class="fcb pd border-b">
                            <div class="fc f14">
                                <div class="mr12 title">{{ i18n.global.t('meos_control_web.auto_status') }}</div>
                                <div class="text-info">{{ item?.auto?.number || 0 }}</div>
                            </div>
                            <m-button
                                v-if="item?.auto?.number && item?.auto?.number > 0 && isEdge()"
                                type="link"
                                size="small"
                                :loading="item.manualOperationLoading"
                                @click="e => BatchManual('', e, item)"
                                >{{ i18n.global.t('meos_control_web.batch_manual') }}</m-button
                            >
                            <template v-else-if="!isEdge()">
                                <m-tips :content="i18n.global.t('meos_control_web.equipment_currently_uncontrollable')" theme="darkTransparent">
                                    <m-button disabled type="link" size="small">{{ i18n.global.t('meos_control_web.batch_manual') }}</m-button>
                                </m-tips>
                            </template>
                            <template v-else>
                                <m-tips :content="i18n.global.t('meos_control_web.no_auto_state_cannot_operate')" theme="darkTransparent">
                                    <m-button disabled type="link" size="small">{{ i18n.global.t('meos_control_web.batch_manual') }}</m-button>
                                </m-tips>
                            </template>
                        </div>
                    </div>
                    <div class="batch-control-item-middle">
                        <div class="fcb pd">
                            <div class="fc f14">
                                <div class="mr12 title">{{ i18n.global.t('meos_control_web.manual_status') }}</div>
                                <div class="text-info">{{ item?.manualOperation?.number || 0 }}</div>
                            </div>
                            <template v-if="item?.manualOperation?.number && item?.manualOperation?.number > 0 && isEdge()">
                                <m-popconfirm
                                    placement="bottom"
                                    width="300px"
                                    :content="i18n.global.t('meos_control_web.confirm_switch_to_auto_dup')"
                                    status="primary"
                                    @confirm="confirm"
                                >
                                    <m-button type="link" size="small" :loading="item.autoLoading" @click="clickBtn(item)">{{
                                        i18n.global.t('meos_control_web.batch_auto')
                                    }}</m-button>
                                </m-popconfirm>
                            </template>
                            <template v-else-if="!isEdge()">
                                <m-tips :content="i18n.global.t('meos_control_web.equipment_currently_uncontrollable')" theme="darkTransparent">
                                    <m-button disabled type="link" size="small">{{ i18n.global.t('meos_control_web.batch_auto') }}</m-button>
                                </m-tips>
                            </template>
                            <template v-else>
                                <m-tips :content="i18n.global.t('meos_control_web.no_manual_state_cannot_operate')" theme="darkTransparent">
                                    <m-button disabled type="link" size="small">{{ i18n.global.t('meos_control_web.batch_auto') }}</m-button>
                                </m-tips>
                            </template>
                        </div>
                    </div>
                    <div class="batch-control-item-middle">
                        <div class="fcb pd">
                            <div class="fc f14">
                                <div class="ft">{{ i18n.global.t('meos_control_web.switch_setpoint') }}</div>
                            </div>

                            <div v-if="item?.manualOperation?.number && item?.manualOperation?.number > 0 && isEdge()">
                                <m-popconfirm
                                    v-for="(iv, io) in listBtnArr"
                                    :key="io"
                                    placement="bottom"
                                    :content="i18n.global.t('meos_control_web.confirm_operate_loop', { name: iv.name })"
                                    :before-confirm="done => beforeConfirm(iv, index, '', io, done)"
                                    status="primary"
                                >
                                    <m-button :loading="loadingStates[index][io]" size="small" class="ml10 m-button-width" @click="clickBtn(item)">{{ iv.name }}</m-button>
                                </m-popconfirm>
                            </div>
                            <div v-else-if="!isEdge()">
                                <m-tips
                                    v-for="iv in listBtnArr"
                                    :key="iv.name"
                                    :content="i18n.global.t('meos_control_web.equipment_currently_uncontrollable')"
                                    theme="darkTransparent"
                                >
                                    <m-button size="small" disabled class="ml10 m-button-width">{{ iv.name }}</m-button>
                                </m-tips>
                            </div>
                            <div v-else>
                                <m-tips v-for="iv in listBtnArr" :key="iv.name" :content="i18n.global.t('meos_control_web.no_manual_state_cannot_operate')" theme="darkTransparent">
                                    <m-button size="small" disabled class="ml10 m-button-width">{{ iv.name }}</m-button>
                                </m-tips>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- 根据灯具类型 -->
                <div v-show="item.selectedValues === '2'">
                    <div v-for="(child, idx) in item.children" :key="idx">
                        <div class="batch-control-item-middle">
                            <div class="fcb pd">
                                <div class="fb7 f14">{{ child.lampFuncTypeName }}</div>
                            </div>
                        </div>
                        <div class="batch-control-item-middle">
                            <div class="fcb pd border-b">
                                <div class="fc f14">
                                    <div class="mr12 title">{{ i18n.global.t('meos_control_web.auto_status') }}</div>
                                    <div class="text-info">{{ child?.auto?.number || 0 }}</div>
                                </div>
                                <m-button
                                    v-if="child?.auto?.number && child?.auto?.number > 0 && isEdge()"
                                    type="link"
                                    size="small"
                                    :loading="child.manualOperationLoading"
                                    @click="e => BatchManual('', e, child)"
                                    >{{ i18n.global.t('meos_control_web.batch_manual') }}</m-button
                                >
                                <template v-else-if="!isEdge()">
                                    <m-tips :content="i18n.global.t('meos_control_web.equipment_currently_uncontrollable')" theme="darkTransparent">
                                        <m-button disabled type="link" size="small" @click="e => BatchManual('', e)">{{ i18n.global.t('meos_control_web.batch_manual') }}</m-button>
                                    </m-tips>
                                </template>
                                <template v-else>
                                    <m-tips :content="i18n.global.t('meos_control_web.no_auto_state_cannot_operate')" theme="darkTransparent">
                                        <m-button disabled type="link" size="small" @click="e => BatchManual('', e)">{{ i18n.global.t('meos_control_web.batch_manual') }}</m-button>
                                    </m-tips>
                                </template>
                            </div>
                        </div>
                        <div class="batch-control-item-middle">
                            <div class="fcb pd">
                                <div class="fc f14">
                                    <div class="mr12 title">{{ i18n.global.t('meos_control_web.manual_status') }}</div>
                                    <div class="text-info">{{ child?.manualOperation?.number || 0 }}</div>
                                </div>
                                <template v-if="child?.manualOperation?.number && child?.manualOperation?.number > 0 && isEdge()">
                                    <m-popconfirm
                                        placement="bottom"
                                        width="300px"
                                        :content="i18n.global.t('meos_control_web.confirm_switch_to_auto_dup')"
                                        status="primary"
                                        @confirm="confirm"
                                    >
                                        <m-button type="link" size="small" :loading="child.autoLoading" @click="clickBtn(child)">{{
                                            i18n.global.t('meos_control_web.batch_auto')
                                        }}</m-button>
                                    </m-popconfirm>
                                </template>
                                <template v-else-if="!isEdge()">
                                    <m-tips :content="i18n.global.t('meos_control_web.equipment_currently_uncontrollable')" theme="darkTransparent">
                                        <m-button disabled type="link" size="small">{{ i18n.global.t('meos_control_web.batch_auto') }}</m-button>
                                    </m-tips>
                                </template>
                                <template v-else>
                                    <m-tips :content="i18n.global.t('meos_control_web.no_manual_state_cannot_operate')" theme="darkTransparent">
                                        <m-button disabled type="link" size="small">{{ i18n.global.t('meos_control_web.batch_auto') }}</m-button>
                                    </m-tips>
                                </template>
                            </div>
                        </div>
                        <div class="batch-control-item-middle">
                            <div class="fcb pd">
                                <div class="fc f14">
                                    <div class="ft">{{ i18n.global.t('meos_control_web.switch_setpoint') }}</div>
                                </div>
                                <div v-if="child?.manualOperation?.number && child?.manualOperation?.number > 0 && isEdge()">
                                    <m-popconfirm
                                        v-for="(iv, io) in listBtnArr"
                                        :key="io"
                                        placement="bottom"
                                        :content="i18n.global.t('meos_control_web.confirm_operate_loop', { name: iv.name })"
                                        :before-confirm="done => beforeConfirm(iv, index, idx, io, done)"
                                        status="primary"
                                    >
                                        <m-button size="small" :loading="loadingChildrenStates[index][idx][io]" class="ml10 m-button-width" @click="clickBtn(child)">{{
                                            iv.name
                                        }}</m-button>
                                    </m-popconfirm>
                                </div>
                                <div v-else-if="!isEdge()">
                                    <m-tips
                                        v-for="iv in listBtnArr"
                                        :key="iv.name"
                                        :content="i18n.global.t('meos_control_web.equipment_currently_uncontrollable')"
                                        theme="darkTransparent"
                                    >
                                        <m-button size="small" disabled class="ml10 m-button-width">{{ iv.name }}</m-button>
                                    </m-tips>
                                </div>
                                <div v-else>
                                    <m-tips
                                        v-for="iv in listBtnArr"
                                        :key="iv.name"
                                        :content="i18n.global.t('meos_control_web.no_manual_state_cannot_operate')"
                                        theme="darkTransparent"
                                    >
                                        <m-button size="small" disabled class="ml10 m-button-width">{{ iv.name }}</m-button>
                                    </m-tips>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </m-scrollbar>

    <batchPopup ref="batchPopupRef" @submit-btn="submitBtn" />

    <!-- 失败设备列表弹框 -->
    <CommonMessageModal v-if="showMessageModal" v-model="showMessageModal" :data="errorMessageList" @close="showMessageModal = false" />
</template>
<script setup>
import batchPopup from '../../components/batchPopup.vue';
import useBatchControl from '../../hooks/useBatchControl';
import { useGeneralControl } from '@/hooks/useGeneralControl';
import { MLoading } from 'meri-plus';
import CommonMessageModal from '@/components/common/commonMessageModal/index.vue';
import useMessage from '@/components/hooks/useMessage';
import { isEdge } from '@/utils/envUtils';
import { lightingFuncType } from '@/constants/lighting';
import i18n from '@/localization';
import { OBJ_TYPE } from '@/utils/globalVariables';

const { useSuccessMessage, useErrorMessage, showMessageModal, errorMessageList } = useMessage();
const { controlFn } = useGeneralControl();
const { BatchControlList, isLoading, queryListLightLoopTotal } = useBatchControl();
const Mloading = ref(null);

const options = ref([
    { id: '1', name: i18n.global.t('meos_control_web.control_by_function_type') },
    { id: '2', name: i18n.global.t('meos_control_web.control_by_luminaire_type') }
]);
const batchPopupRef = ref();
const dataValue = ref({});
const indexLoading = ref(null);
const idxLoading = ref(null);
const ioLoading = ref(null);
const loadingStates = ref();
const loadingChildrenStates = ref();
const listBtnArr = ref([
    {
        name: i18n.global.t('meos_control_web.off'),
        code: '0'
    },
    {
        name: i18n.global.t('meos_control_web.on'),
        code: '1'
    }
]);
watch(
    () => isLoading.value,
    () => {
        if (isLoading.value) {
            console.log(isLoading.value, '1');
            Mloading.value = MLoading.service({
                target: '.batch-control',
                fullscreen: false,
                duration: 30000,
                lottieName: 'ball',
                loadIconStyle: {
                    width: '100px',
                    height: '100px'
                }
            });
        } else {
            console.log(isLoading.value, '2');
            Mloading.value.destroy();
        }
    },
    { immediate: true }
);
watch(
    () => BatchControlList.value,
    () => {
        loadingStates.value = BatchControlList?.value.map(() => [false, false]);
        loadingChildrenStates.value = BatchControlList.value.map(item => item.children.map(() => listBtnArr.value.map(() => false)));
    }
);

const BatchManual = (time, e, item) => {
    dataValue.value = item;

    batchPopupRef.value.showFun(time, e.target);
};
const clickBtn = item => {
    dataValue.value = item;
};
//批量手动确定后的回调
const submitBtn = item => {
    dataValue.value.manualOperationLoading = true;
    console.log(dataValue.value, item, 'dataValue.value');
    const obj = {
        objectIds: dataValue?.value?.auto?.instanceIds,
        infoValue: '0',
        infoCode: 'manualAutoSet',
        objectType: OBJ_TYPE.EQUIPMENT,
        content: item.reason,
        expireTime: item.expireTime.replaceAll('.', '').replaceAll(':', '').replaceAll(' ', '') + '00'
    };
    save(obj, 'manual').then();
};
//批量自动
const confirm = () => {
    dataValue.value.autoLoading = true;
    const obj = {
        objectIds: dataValue?.value?.manualOperation?.instanceIds,
        infoValue: '1',
        infoCode: 'manualAutoStatus'
    };
    save(obj, 'automatic').then();
};
const beforeConfirm = async (item, index, idx, io, done) => {
    await editSwitchValue(item, index, idx, io);
    done();
};
//开启关闭
const editSwitchValue = async (data, index, idx, io) => {
    indexLoading.value = index;
    idxLoading.value = idx;
    ioLoading.value = io;
    loadingStates.value[index][io] = true;
    if (idx !== '') {
        loadingChildrenStates.value[index][idx][io] = true;
    }
    const obj = {
        objectIds: dataValue?.value?.manualOperation?.instanceIds,
        circuitIds: dataValue?.value?.manualOperation?.instanceIds,
        infoValue: '0',
        infoCode: 'manualAutoSet',
        equipSwitchSet: data.code
    };
    await save(obj, data.code);
};
//控制提交接口
const save = async (obj, type) => {
    if (obj.circuitIds) {
        await controlFn({
            data: obj,
            callback: () => {}
        });
        await controlFn({
            data: {
                objectIds: obj.objectIds,
                infoCode: 'equipSwitchSet',
                infoValue: obj.equipSwitchSet
            },
            callback: res => {
                if (res.code === '00000') {
                    showMessageBox(res, type);
                }
                queryListLightLoopTotal();
                isLoading.value = false;
            }
        });
    } else {
        await controlFn({
            data: obj,
            callback: res => {
                if (res.code === '00000') {
                    showMessageBox(res, type);
                }
                queryListLightLoopTotal();
                isLoading.value = false;
            }
        });
    }
    dataValue.value.manualOperationLoading = false;
    dataValue.value.autoLoading = false;
    loadingStates.value[indexLoading.value][ioLoading.value] = false;
    if (loadingChildrenStates.value && loadingChildrenStates.value[indexLoading.value] && loadingChildrenStates.value[indexLoading.value][idxLoading.value]) {
        loadingChildrenStates.value[indexLoading.value][idxLoading.value][ioLoading.value] = false;
    }
};
const showMessageBox = (responseData, set) => {
    let message = '';
    if (set === '1') {
        message = i18n.global.t('common.status_open');
    } else if (set === '0') {
        message = i18n.global.t('common.status_close');
    } else if (set === 'manual') {
        message = i18n.global.t('meos_control_web.batch_manual');
    } else if (set === 'automatic') {
        message = i18n.global.t('meos_control_web.batch_auto');
    }
    if (responseData.data?.failureNum) {
        if (responseData.data?.successCount) {
            // 有成功
            useErrorMessage(
                i18n.global.t('meos_control_web.batch_control_message1', {
                    successCount: responseData.data?.successCount,
                    name: message,
                    failureNum: responseData.data?.failureNum
                }),
                5000,
                responseData.data?.errorCountObject
            );
        } else if (responseData.data?.noControlCount) {
            // 有不可控
            useErrorMessage(
                i18n.global.t('meos_control_web.batch_control_message2', {
                    successCount: responseData.data?.successCount,
                    name: message,
                    noControlCount: responseData.data?.noControlCount,
                    failureNum: responseData.data?.failureNum
                }),
                5000,
                responseData.data?.errorCountObject
            );
        } else {
            // 全部失败
            useErrorMessage(
                i18n.global.t('meos_control_web.batch_control_message3', {
                    name: message,
                    failureNum: responseData.data?.failureNum
                }),
                5000,
                responseData.data?.errorCountObject
            );
        }
    } else {
        if (responseData.data?.noControlCount) {
            // 有不可控
            useSuccessMessage(
                i18n.global.t('meos_control_web.batch_control_message4', {
                    successCount: responseData.data?.successCount,
                    name: message,
                    noControlCount: responseData.data?.noControlCount
                })
            );
        } else {
            // 全部成功
            useSuccessMessage(
                i18n.global.t('meos_control_web.batch_control_message5', {
                    successCount: responseData.data?.successCount,
                    name: message
                })
            );
        }
    }
};
const selectChange = val => {
    console.log(val);
};
</script>
<style lang="less" scoped>
.m-button-width {
    width: 54px;
}
.batch-control {
    padding-inline: 16px;
    padding-top: 20px;
    height: 100%;
    &-item {
        // border-radius: 4px;
        border-radius: 4px;
        overflow: hidden;
        &-top {
            background: var(--gray-50, #f7f9fa);
            padding: 8px 12px;
            // border-top-left-radius: 4px;
            // border-top-right-radius: 4px;
        }
        &-middle {
            padding: 0px 12px;
            background: var(--gray-100, #f1f4f6);
            height: 40px;
            .pd {
                height: 100%;
                width: 100%;
                padding-top: 8px;
                padding-bottom: 8px;
            }

            .text-info {
                color: #000;
                font-family: 'Persagy2.0';
                font-size: 14px;
                font-weight: 700;
            }
        }
        &-img {
            width: 32px;
            height: 32px;
            background-color: #ebf6ff;
            border-radius: 90px;
            display: flex;
            align-items: center;
            justify-content: center;
            img {
                width: 22px;
                height: 22px;
            }
        }
    }
    .tips {
        background: #d9ebff;
        padding: 8px;
    }
    .border-b {
        border-bottom: 1px dashed #e1e5eb;
    }
}
</style>
