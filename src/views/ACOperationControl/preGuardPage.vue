<template>
    <div class="acterminal-operation-pregurd-page">
        <m-modal
            v-model:visible="showACModel"
            :append-to="$modalAppendTo"
            type="deafult"
            title=""
            :width="466"
            :escable="false"
            :closeable="false"
            :footer="false"
            content-class-name="acopertaion-performance-modal"
            :need-scrollbar="false"
        >
            <template #content>
                <div class="acoperation-performance-content">
                    <img class="perforamnce-img" src="@/assets/imgs/operationmodalimg.png" />
                    <i18n-slot html-tag="div" class="perforamnce-text" name-key="meos_control_web.please_add_config">
                        <template #place>
                            <span class="performance-text-strong">「{{ i18n.global.t('meos_control_web.quality_operation_standard_config') }}」</span>
                        </template>
                    </i18n-slot>
                    <div class="performance-checkbox">
                        <m-checkbox v-model="rememberLogin" @change="changeRemember">{{ i18n.global.t('meos_control_web.no_remind_this_login') }}</m-checkbox>
                    </div>
                </div>
                <div class="acoperation-performance-footers">
                    <m-button v-if="!isEdge()" type="link" size="medium" @click="redirectoTo">{{ i18n.global.t('meos_control_web.go_to_operation_standard_config') }}</m-button>
                    <m-button type="primary" size="medium" @click="closeAcModal">{{ i18n.global.t('meos_control_web.got_it_continue_loading') }}</m-button>
                </div>
            </template>
        </m-modal>
    </div>
</template>
<script setup>
import I18nSlot from '@/components/I18nSlot.vue';
import i18n from '@/localization';
import useStore from '@/store';
import { useRouter } from 'vue-router';
import { isEdge, demandManageAcHomeJumpFun } from '@/utils/envUtils';
import { AIR_TERMINAL, SUCCESSCODE } from '@/utils/globalVariables';
import { MLoading } from 'meri-plus';
import { getDialogContinueLoad } from '@/apis/ACOperationControl';
import { getItem, setItem } from '@/utils/storageUtils';
const rememeberAcLoginkey = 'rememeberAcLoginkey';
const acOPLastTokenKey = 'ac-op-last-tokenKey';
const rememberLoginVal = getItem(rememeberAcLoginkey);
const rememberLogin = ref(rememberLoginVal || 'checked');
const router = useRouter();
const { base } = useStore();
const showACModel = ref(false);
const closeAcModal = () => {
    showACModel.value = false;
    base.closeACBlockModal();
    router.push({ path: '/ac-operation-control', replace: true });
};
// 去运行标准配置
const redirectoTo = () => {
    demandManageAcHomeJumpFun();
};
const changeRemember = check => {
    setItem(rememeberAcLoginkey, check);
};
onMounted(() => {
    nextTick(() => {
        let Mloading = MLoading.service({
            target: '.acterminal-operation-pregurd-page',
            fullscreen: false,
            duration: 30000,
            lottieName: 'ball',
            loadIconStyle: {
                width: '100px',
                height: '100px'
            }
        });
        const token = base.token || '';
        const lastToken = getItem(acOPLastTokenKey);

        if (lastToken && token === lastToken && rememberLogin.value === 'checked') {
            try {
                showACModel.value = false;
                base.closeACBlockModal();
                // 等待页面完全加载后再跳转，避免因页面跳转过快产生的白页问题
                setTimeout(() => {
                    router.push({ path: '/ac-operation-control', replace: true }).then(() => {
                        Mloading?.destroy();
                    });
                }, 1000);
            } catch (err) {
                Mloading?.destroy();
                console.log('========末端错误error=========', err);
            }
        } else {
            getDialogContinueLoad({
                runningMonitorType: AIR_TERMINAL,
                instance: {
                    instanceType: 'PROJECT',
                    instanceId: base.projectId
                }
            })
                .then(res => {
                    try {
                        if (res.code === SUCCESSCODE) {
                            if (res.data) {
                                showACModel.value = true;
                                Mloading?.destroy();
                                base.openACBlockModal();
                            } else {
                                showACModel.value = false;
                                base.closeACBlockModal();
                                setTimeout(() => {
                                    router.push({ path: '/ac-operation-control', replace: true }).then(() => {
                                        Mloading?.destroy();
                                    });
                                }, 1000);
                            }
                        } else {
                            showACModel.value = false;
                            base.closeACBlockModal();
                            setTimeout(() => {
                                router.push({ path: '/ac-operation-control', replace: true }).then(() => {
                                    Mloading?.destroy();
                                });
                            }, 1000);
                        }
                    } catch (err) {
                        Mloading?.destroy();
                        console.log('========末端错误erro2=========', err);
                    }
                })
                .finally(() => {
                    setItem(acOPLastTokenKey, token);
                });
        }
    });
});
</script>

<style lang="less">
.acterminal-operation-pregurd-page {
    width: 100%;
    min-width: 1280px;
    overflow: hidden;
    height: 100%;
    background-color: #d6dde5;
    position: relative;
}
.acopertaion-performance-modal {
    .acoperation-performance-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        .performance-checkbox {
            display: flex;
            width: 100%;
            flex-direction: column;
            margin-top: 12px;
            align-items: flex-start;
        }
        .perforamnce-img {
            width: 272px;
        }
        .perforamnce-text {
            font-weight: var(--platform-font-weight);
            font-size: 14px;
            line-height: 22px;
            margin-top: 24px;
            color: var(--gray-600, #626c78);
            .performance-text-strong {
                color: var(--gray-800, #2e3742);
                font-weight: 700;
            }
        }
    }
    .acoperation-performance-footers {
        margin-top: 24px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-end;
        gap: 12px;
        .left-default-btn-goon {
            cursor: pointer;
            color: #246fe5;
        }
    }
}
</style>
