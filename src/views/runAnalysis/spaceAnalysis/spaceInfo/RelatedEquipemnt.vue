<template>
    <div class="h100 rel-equip-wrap">
        <template v-if="!loading">
            <m-scrollbar v-if="dataList?.length > 0" style="padding: 0 16px">
                <div v-for="(g, index) in dataList" :key="index" class="group">
                    <TitlePrefix :font-size="16" :line-height="24">
                        <template #title>
                            <div class="class-title">
                                <div class="main-title">{{ g.aliasName }}</div>
                                <div class="cur-time-text">
                                    （{{
                                        i18n.global.t('meos_control_web.data_of_name', {
                                            name: curSelectedTime
                                        })
                                    }}）
                                </div>
                            </div>
                        </template>
                    </TitlePrefix>
                    <div v-for="(eq, idx) in g.dataValue" :key="idx" class="card-wrap">
                        <div class="card-header">
                            <div class="left">
                                <div class="title">
                                    {{ eq.localName ?? '--' }}
                                </div>
                                <div class="floor-tag">{{ eq.inFloor?.localName ?? '--' }}</div>
                            </div>
                            <m-button type="link" size="medium" class="add-but" @click="goEquipAnalysis(g, eq)">{{
                                i18n.global.t('meos_control_web.device_operation_analysis')
                            }}</m-button>
                        </div>
                        <div class="info-list">
                            <div v-for="(info, num) in infoCodes(eq.relInfoCodeGroupConfigs)" :key="num" class="info-list-item">
                                <div class="val">{{ getValueStr(info).text }}</div>
                                <div v-ellipsis class="title m-ellipsis">{{ info.infoCodeName }}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </m-scrollbar>
            <div v-else class="fcc" style="height: 100%">
                <m-illustration :title="i18n.global.t('meos_control_web.no_content')" type="noContent" content=""></m-illustration>
            </div>
        </template>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import TitlePrefix from '@/components/title-prefix/index.vue';
import { useRouter } from 'vue-router';
import { EQUIPMENT_ANALYSIS, AC_EQUIPMENT_ANALYSIS, SAPCETYPE } from '../../variable';
import { listInfoCodeConfigsByObject } from '@/apis/runAnalysis';
import { curSelectedSpaceKey, globalTimeKey, curSelectedTimeKey, spaceTypeKey } from '../../injectionKey';
import UseCancelTokenHooks from '@/hooks/UseCancelTokenHooks';
import baseStore from '@/store/baseStore';
import dayjs from 'dayjs';
import { toNumber } from 'lodash';
import useLoading from '@/hooks/useLoading';
import { openWebsite } from '@/utils/websiteNavigation';
import { MEOS_RUN_ANALYSIS } from '@/config';
import { DETAIL } from '@/utils/globalVariables';

const curSelectedSpace = inject(curSelectedSpaceKey); // ==> src\views\runAnalysis\hooks\useSpaceAnalysis.js
const globalTime = inject(globalTimeKey);
const curSelectedTime = inject(curSelectedTimeKey);
const spaceType = inject(spaceTypeKey);

const router = useRouter();
const dataList = ref([]);

const queryToken = UseCancelTokenHooks();

const { openLoading, closeLoading, loading } = useLoading(
    'rel-equip-wrap',
    '#ffffff00',
    'ball',
    {
        width: '100px',
        height: '100px'
    },
    0
);
const infoCodes = relInfoCodeGroupConfigs => {
    const arr = [];
    relInfoCodeGroupConfigs.forEach(item => {
        arr.push(...item.relInfoCodeConfigs);
    });
    return arr;
};
const makeListData = apiData => {
    const spaceObj = apiData?.length > 0 ? apiData[0] : null;
    if (spaceObj?.relInfoCodeGroupConfigs?.length > 0) {
        const relObj = spaceObj.relInfoCodeGroupConfigs[0];
        const arr = relObj?.relInfoCodeConfigs?.filter(classObj => {
            if (classObj.dataValue?.length > 0) {
                // classObj.dataValue.
                return true;
            }
            return false;
        });
        dataList.value = arr;
    }
};

const getValueStr = data => {
    if (data?.dataSource?.length) {
        let str = '';
        data.dataSource.forEach(item => {
            if (data.dataValue) {
                // eslint-disable-next-line no-restricted-syntax
                if (toNumber(item.code) === toNumber(data.dataValue)) {
                    str = item.name;
                }
            }
        });
        return { text: str || '--' };
    }
    const value = data.dataValue ? data.dataValue : '--';
    return {
        text: `${value} ${data.unit || ''}`
    };
};

const queryRelEquipData = async () => {
    if (!curSelectedSpace.value?.id) {
        return;
    }
    openLoading();
    try {
        queryToken.cancelQuest();
        const curTime = `${globalTime.value} ${curSelectedTime.value}`;
        // 计算结束日期，加一天以确保包含所有需要的数据
        const endDate = dayjs(curTime).add(5, 'minute').format('YYYY-MM-DD HH:mm:00');
        const params = {
            projectId: baseStore().projectId,
            runningMonitorSecondType: SAPCETYPE[spaceType.value]?.code,
            runningMonitorType: 'RUN_ANALYSIS',
            objectIds: [curSelectedSpace.value?.id],
            templateCode: DETAIL,
            startTime: dayjs(curTime).format('YYYY-MM-DD HH:mm:00'),
            endTime: endDate
        };
        const { code, data } = await listInfoCodeConfigsByObject(params, { cancelToken: queryToken.cancelToken() });
        console.log(' code, data: ', code, data);
        makeListData(data);
    } catch (e) {
        console.log('e: ', e);
        closeLoading();
    } finally {
        closeLoading();
    }
};

watch(
    [curSelectedSpace, globalTime, curSelectedTime],
    () => {
        console.log('curSelectedSpace: ', curSelectedSpace.value);
        if (curSelectedSpace.value?.id) {
            queryRelEquipData();
        }
    },
    {
        immediate: true
    }
);
const goEquipAnalysis = (group, equip) => {
    const classCode = group?.infoCode;
    const equipIds = [equip?.id];
    const curSelectedDate = globalTime.value || '';

    const infoCodes = [];
    let i = 0;
    while (i < equip.relInfoCodeGroupConfigs?.length && infoCodes.length < 11) {
        equip.relInfoCodeGroupConfigs[i].relInfoCodeConfigs?.forEach(obj => {
            if (infoCodes.length < 11) {
                infoCodes.push(obj.infoCode);
            }
        });
        i += 1;
    }
    const { href } = router.resolve({
        name: 'runAnalysis',
        query: {
            showModuleInfo: true,
            analysisType: EQUIPMENT_ANALYSIS.id,
            equipType: AC_EQUIPMENT_ANALYSIS,
            classCode,
            equipIds: equipIds.join(','),
            infoCodes: infoCodes.join(','),
            curSelectedDate
        }
    });
    const params = href.split('?')[1];
    // window.open(location.origin + href, '_blank');
    openWebsite(MEOS_RUN_ANALYSIS, {
        params,
        newPage: true
    });
};
</script>
<style lang="less" scoped>
.rel-equip-wrap {
    .group {
        width: 100%;
        display: flex;
        padding: 12px 0;
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
        .class-title {
            display: flex;
            align-items: center;
            gap: 9px;
        }
        .main-title {
            color: var(--gray-800, #2e3742);
            font-size: 16px;
            font-style: normal;
            font-weight: 700;
            line-height: 22px;
        }
        .cur-time-text {
            color: var(--gray-600, #626c78);
            font-size: 14px;
            font-style: normal;
            font-weight: var(--platform-font-weight);
            line-height: 22px; /* 157.143% */
        }
    }
}
.card-wrap {
    width: 100%;
    display: flex;
    padding: 12px;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    border-radius: 8px;
    background: var(--Grey-Grey-0, #fff);

    .card-header {
        display: flex;
        align-items: center;
        gap: 4px;
        width: 100%;
        justify-content: space-between;
        .left {
            display: flex;
            align-items: center;
            gap: 4px;
            .title {
                color: var(--gray-800, #2e3742);
                font-size: 16px;
                font-weight: 700;
                line-height: 22px; /* 137.5% */
            }
            .floor-tag {
                display: flex;
                padding: 0px 4px;
                justify-content: center;
                align-items: center;
                border-radius: 2px;
                background: var(--blue-100, #d9ebff);
                color: var(--blue-700, #1b4acc);
                font-size: 12px;
                font-weight: var(--platform-font-weight);
                line-height: 20px;
            }
        }
    }

    .info-list {
        width: 100%;
        display: grid;
        grid-template-columns: repeat(5, minmax(0, 1fr));
        gap: 16px 0;
        .title {
            width: 100%;
            color: var(--gray-600);
        }
    }
}
</style>
