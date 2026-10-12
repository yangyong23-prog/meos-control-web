<template>
    <div class="card-wrapper" @click="jumpTo">
        <div class="card-header">
            <div v-ellipsis class="card-title m-ellipsis">{{ props.cardData?.name }}</div>
            <div v-show="!!(props.cardData?.abnormalCount ?? 0)" class="card-header-right">
                <div class="abnormal-label">{{ i18n.global.t('meos_control_web.abnormal_event_colon') }}</div>
                <div class="abnormal-count">{{ i18n.global.t('meos_control_web.certain_number', { count: props.cardData?.abnormalCount ?? 0 }) }}</div>
            </div>
        </div>
        <div class="card-info-codes">
            <template v-if="isLoadedInfoCodes && !props.cardData?.infoCodes?.length"
                ><span class="no-data-wrap">{{ i18n.global.t('common.no_data') }}</span></template
            >
            <div v-for="(item, index) in props.cardData?.infoCodes" v-else :key="index" class="card-info-code-item">
                <div class="card-info-code-item-title">{{ `${item?.name || '--'}(${item.unit || ''})` }}</div>
                <div v-ellipsis class="card-info-code-item-value ffCustom-M m-ellipsis">
                    <getAllIotValueStr v-bind="item"></getAllIotValueStr>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="jsx">
import { useRouter } from 'vue-router';
import DockSingleton from '@/hooks/responsiveDock';
import { isLoadedInfoCodesKey } from '../../hooks/useGlobalData';
import i18n from '@/localization';

const props = defineProps({
    cardData: {
        type: Object,
        default: () => ({})
    }
});

const router = useRouter();
const { getIotData } = DockSingleton.getInstance();
const isLoadedInfoCodes = inject(isLoadedInfoCodesKey);

const getAllIotValueStr = dataObj => {
    const { codes, relId, instanceId } = dataObj || {};
    const id = props.cardData?.id ?? instanceId;
    const showStrArr = [];
    if (Array.isArray(codes)) {
        codes.forEach(code => {
            let relValObj;
            const valObj = getIotData(id, code);
            if (relId) {
                relValObj = getIotData(relId, code);
            }

            const dataValue = valObj?.dataValue ?? relValObj?.dataValue;
            const aliasName = valObj?.aliasName ?? relValObj?.aliasName;
            const label = aliasName?.replace('：', ':');
            if (dataValue?.toString()) {
                const showStr = `${label || ''}${dataValue || ''}`;
                showStrArr.push(showStr);
            } else {
                const showStr = `${label || ''}--`;
                showStrArr.push(showStr);
            }
        });
    }
    if (showStrArr.length && showStrArr.every(s => s.includes('--'))) {
        return '--';
    }
    return showStrArr.join('  ');
};

const jumpTo = () => {
    router.push({
        path: '/SE',
        query: {
            redirect: 'SE',
            fromDashboard: 'true',
            sysName: encodeURIComponent(props.cardData.localName),
            classCode: encodeURIComponent(props.cardData.classCode),
            graphTypeCode: encodeURIComponent(props.cardData.graphTypeCode),
            sourceClassCode: encodeURIComponent(props.cardData.classCode),
            systemObjectId: encodeURIComponent(props.cardData.id)
        }
    });
};
</script>

<style lang="less" scoped>
.card-wrapper {
    display: flex;
    height: 126px;
    padding: 12px 16px 16px 16px;
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;

    border-radius: 8px;
    background: #f9fcff;
    cursor: pointer;

    &:hover {
        box-shadow: inset 0 0 0 1px #246fe5;
    }
}

.card-header {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 8px;

    .card-header-right {
        min-width: fit-content;
        display: flex;
        padding: 3px 8px;
        align-items: center;
        border-radius: 2px;
        background: linear-gradient(270deg, rgba(245, 80, 71, 0.05) 0%, rgba(245, 80, 71, 0.2) 100%);
    }

    .abnormal-label {
        color: var(--red-500, #f55047);
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 20px;
    }

    .abnormal-count {
        color: var(--red-500, #f55047);
        font-size: 14px;
        font-style: normal;
        font-weight: 700;
        line-height: 20px;
    }
}

.card-title {
    color: var(--gray-800, #2e3742);
    font-size: 16px;
    font-style: normal;
    font-weight: 700;
    line-height: 26px;
}

.card-info-codes {
    width: 100%;
    display: flex;
    flex-direction: column;
}

.card-info-code-item {
    height: 30px;
    display: flex;
    align-items: center;
    gap: 8px;

    .card-info-code-item-title {
        color: var(--gray-600, #626c78);
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 100%;
        min-width: fit-content;
    }

    .card-info-code-item-value {
        color: var(--gray-800, #2e3742);
        font-size: 16px;
        font-style: normal;
        font-weight: 600;
        line-height: 22px;
    }
}

.no-data-wrap {
    color: var(--gray-600, #626c78);
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
}
</style>
