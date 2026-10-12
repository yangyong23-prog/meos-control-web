<template>
    <div :class="['risk-content', 'mt6']">
        <div v-if="riskObj.length === 0" class="no-data"><SuccessCircle class="no-data-icon" />{{ i18n.global.t('meos_control_web.no_risk') }}</div>
        <div v-for="risk in riskObj" v-else :key="risk.title" class="risk-item" :style="{ background: risk.bg }">
            <span>{{ risk.title }}</span>
            <span class="val">{{ risk.value }}</span>
        </div>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import SuccessCircle from '@/assets/images/common/success_circle.svg';
import DockSingleton from '@/hooks/responsiveDock';
import { SPACE_STATUS } from '.././variable';
import { OBJ_TYPE } from '@/utils/globalVariables';

const props = defineProps({
    detailObj: {
        type: Object,
        default: () => ({})
    }
});

const { getObjectDanegerEventsList, getRelatedObjects, getObjectDanegerStatus } = DockSingleton.getInstance();

const filterShowList = obj => {
    return (
        [
            {
                title: i18n.global.t('meos_control_web.risk_occurred_presumed_occurrence'),
                value: obj?.exception || 0,
                color: '#F55047',
                bg: 'linear-gradient(90deg, #FFF2F1 -0.43%, rgba(255, 230, 229, 0.15) 99.57%)'
            },
            {
                title: i18n.global.t('meos_control_web.potential_risk'),
                value: obj?.potential || 0,
                color: '#E68600',
                bg: 'linear-gradient(90deg, #FFF3E0 -0.43%, rgba(255, 243, 224, 0.15) 99.57%)'
            },
            {
                title: i18n.global.t('meos_control_web.status_unknown'),
                value: obj?.unknown || 0,
                color: '#8252E3',
                bg: 'linear-gradient(90deg, #F3EDFF -0.43%, rgba(243, 237, 255, 0.15) 99.57%)'
            },
            {
                title: i18n.global.t('meos_control_web.normal_generally_normal'),
                value: obj?.isNormal || 0,
                color: '#2E3742',
                bg: 'linear-gradient(90deg, #D6F6E3 -0.43%, rgba(214, 246, 227, 0.15) 99.57%)'
            }
        ].filter(item => item.value) || []
    );
};

const riskObj = ref([]);

onMounted(() => {
    // 取detail对象id，因为不会因为unhover消失
    const curId = props?.detailObj?.id;
    if (curId) {
        const isSpace = typeof curId === 'string' && props?.detailObj?.objType === OBJ_TYPE.SPACE;

        if (!isSpace) {
            const equipRiskList = getObjectDanegerEventsList(curId);
            if (Array.isArray(equipRiskList)) {
                const equipObj = equipRiskList.reduce((acc, cur) => {
                    const { status } = cur || {};
                    let converStatu = '';
                    if (status === 'CONJECTURE_EXCEPTION') {
                        converStatu = 'EXCEPTION';
                    } else if (status === 'GENERAL_NORMAL') {
                        converStatu = 'NORMAL';
                    } else {
                        converStatu = status;
                    }
                    const mapStatus = SPACE_STATUS[converStatu]?.mapStatus;
                    if (mapStatus) {
                        acc[mapStatus] = acc[mapStatus] || 0;
                        acc[mapStatus] += 1;
                    }
                    return acc;
                }, {});
                const renderList = filterShowList(equipObj);
                riskObj.value = renderList;

                return;
            }
        } else {
            const spaceDangerEventsList = getObjectDanegerEventsList(curId) || [];
            const equipIds = getRelatedObjects(curId) || [];
            const equipDangerEventsList =
                equipIds
                    ?.map(item => {
                        const list = getObjectDanegerEventsList(item) || [];
                        return list;
                    })
                    ?.filter(v => !!v?.length)
                    ?.flat?.() || [];

            const allStatus = [...spaceDangerEventsList, ...equipDangerEventsList];
            const finalState = allStatus.reduce((acc, cur) => {
                const { status } = cur || {};
                let converStatu = '';
                if (status === 'CONJECTURE_EXCEPTION') {
                    converStatu = 'EXCEPTION';
                } else if (status === 'GENERAL_NORMAL') {
                    converStatu = 'NORMAL';
                } else {
                    converStatu = status;
                }
                const mapStatus = SPACE_STATUS[converStatu]?.mapStatus;
                if (mapStatus) {
                    acc[mapStatus] = acc[mapStatus] || 0;
                    acc[mapStatus] += 1;
                }
                return acc;
            }, {});

            const renderList = filterShowList(finalState);
            riskObj.value = renderList;
        }
    }
});
</script>
<style lang="less" scoped>
.risk-content {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
    .risk-item {
        display: flex;
        align-items: center;
        gap: 4px;
        padding: 4px 8px;
        width: 100%;
        height: 30px;
        border-radius: 2px;
        span {
            // display: block;
            &:nth-of-type(1) {
                color: var(--gray-600, #626c78);
                font-size: 12px;
                font-weight: var(--platform-font-weight);
                line-height: 20px;
            }
            &:nth-of-type(2) {
                font-family: Persagy2.0;
                font-size: 14px;
                font-weight: 600;
                line-height: 22px;
            }
        }
    }
    .no-data {
        display: flex;
        height: 50px;
        padding: 4px 8px;
        justify-content: center;
        align-items: center;
        gap: 4px;
        flex: 1 0 0;
        color: var(--green-700, #0c9b4a);
        font-size: 12px;
        border-radius: 2px;
        background: linear-gradient(90deg, #f1fff7 -0.43%, rgba(241, 255, 247, 0.15) 99.57%);
        &-icon {
            width: 14px;
        }
    }
}
</style>
