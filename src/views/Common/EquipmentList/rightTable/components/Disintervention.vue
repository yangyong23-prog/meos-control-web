<template>
    <div class="dis-intervention-custom-wrap">
        <section class="header-wrap">
            <div class="left">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M0 12.0059C0 5.37773 5.37187 0.00585938 12 0.00585938C18.6281 0.00585938 24 5.37773 24 12.0059C24 18.634 18.6281 24.0059 12 24.0059C5.37187 24.0059 0 18.634 0 12.0059ZM10.9607 17.9849C12.3453 17.9849 13.1686 17.0736 13.977 15.8921C13.977 15.7512 14.0262 15.3795 13.9957 15.1687L12.9204 16.4288C12.6968 16.6664 12.4201 16.8331 12.2881 16.7881C12.1671 16.746 12.0952 16.6137 12.1197 16.4833L13.9139 10.7137C14.0627 9.98064 13.657 9.3147 12.8001 9.22951C11.8982 9.22951 10.5697 10.1618 9.76027 11.3433C9.76027 11.4852 9.73463 11.8359 9.7643 12.0467L10.8407 10.7856C11.0631 10.548 11.3212 10.3822 11.4521 10.4273C11.5841 10.4723 11.657 10.6227 11.6136 10.7636L9.83218 16.5053C9.62645 17.1762 10.0153 17.8354 10.9607 17.9849ZM13.2449 6.00586C13.038 6.01048 12.8357 6.06472 12.638 6.16858C12.4403 6.27245 12.284 6.42363 12.169 6.62214C12.0541 6.82064 11.9978 7.03183 12.0001 7.25572C12.0024 7.47962 12.0587 7.6885 12.169 7.88239C12.2794 8.07627 12.4299 8.22861 12.6207 8.3394C12.8115 8.45019 13.0196 8.50559 13.2449 8.50559C13.4655 8.5102 13.6736 8.45596 13.869 8.34286C14.0644 8.22976 14.2172 8.07627 14.3276 7.88239C14.4379 7.6885 14.4954 7.47846 14.5 7.25226C14.5 7.03068 14.4425 6.82064 14.3276 6.62214C14.2127 6.42363 14.054 6.2713 13.8517 6.16512C13.6494 6.05895 13.4472 6.00586 13.2449 6.00586Z"
                        fill="#246FE5"
                    />
                </svg>
            </div>
            <div class="right">{{ i18n.global.t('meos_control_web.confirm_release_intervention_dup') }}</div>
        </section>
        <section class="btn-wrap">
            <m-button type="default" size="small" style="margin-right: 12px" @click="closePop">{{ i18n.global.t('common.cancel') }}</m-button>
            <m-button type="primary" size="small" :loading="loading" @click="save">{{ i18n.global.t('common.confirm') }}</m-button>
        </section>
    </div>
</template>
<script setup>
import { $Message } from 'meri-plus';
import { NEW_CONTROL_SYSTEM } from '@/views/Common/EquipmentList/constants';
import { releaseIntervention } from '@/apis/ACOperationControl';
import { useGeneralControl } from '@/hooks/useGeneralControl';
import baseStore from '@/store/baseStore';
import i18n from '@/localization';

const emit = defineEmits(['cancel', 'save']);
const props = defineProps({
    // 对象ID集合
    objectIds: {
        type: Array,
        default: () => []
    },
    // 设定信息点编码
    infoCode: {
        type: String,
        default: ''
    }
});
const loading = ref(false);
const { releaseIntervention: newReleaseIntervention } = useGeneralControl();
const closePop = () => emit('cancel');
const runningMonitorType = inject('runningMonitorType');
const save = async () => {
    try {
        const base = baseStore();
        const obj = {
            objectIds: props.objectIds
        };
        if (props.infoCode) {
            obj.infoCode = props.infoCode;
        }
        loading.value = true;
        if (NEW_CONTROL_SYSTEM.includes(runningMonitorType)) {
            await newReleaseIntervention(
                {
                    projectId: base.projectId,
                    objectIds: props.objectIds,
                    infoCode: obj.infoCode,
                    content: ''
                },
                responseData => {
                    if (responseData.code === '00000') {
                        $Message.success({ title: `${i18n.global.t('common.operation_success')}` });
                        emit('save');
                    } else {
                        $Message.error({ title: i18n.global.t('meos_control_web.failed_please_retry') });
                    }
                }
            );
        } else {
            const responseData = await releaseIntervention(obj);
            if (responseData.code === '00000') {
                $Message.success({ title: `${i18n.global.t('common.operation_success')}` });
                emit('save');
            } else {
                $Message.error({ title: i18n.global.t('meos_control_web.failed_please_retry') });
            }
        }
    } catch (err) {
        $Message.error({ title: i18n.global.t('meos_control_web.failed_please_retry') });
    } finally {
        loading.value = false;
    }
};
</script>
<style lang="less" scoped>
.dis-intervention-custom-wrap {
    padding: 20px 20px 12px 20px;
    width: 316px;
    .btn-wrap {
        margin-top: 16px;
        display: flex;
        justify-content: flex-end;
        align-items: center;
    }
    .header-wrap {
        // height: 44px;
        display: flex;
        .left {
            width: 24px;
            height: 24px;
            margin-right: 12px;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .right {
            flex: 1;
            color: @grey-600;
            font-family: 'PingFang SC';
            font-size: 14px;
            font-style: normal;
            font-weight: var(--platform-font-weight);
            line-height: 22px; /* 157.143% */
            white-space: normal;
            text-wrap: wrap;
            min-width: 0;
        }
    }
}
</style>
