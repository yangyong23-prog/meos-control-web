import i18n from '@/localization';
import { nextTick } from 'vue';
import { AppLoadingService } from '@/components/AppLoading/service';
import dayjs from 'dayjs';
import { realTimeValue, realTimeParamsInfoCodes, objectsExistRuleParams, infoCodeParams } from '../constants/config';
import { batchQueryInfoCodeConfig, queryObjectsExistRule, batchQueryPeriodData } from '@/apis/monitor';
import RES from '../operationMonitoringAside/MonitoringDashboard/HeatEcharts/index.json';
import RES1 from '../operationMonitoringAside/MonitoringDashboard/HeatEcharts/indexRule.json';
import { getDayjsTz } from '@/utils/globalVariables';
import { dayjsIsBefore } from '@/utils/dayjsTools';

export default props => {
    let loadingInstance = null;
    const openLoading = () => {
        const create = () => {
            loadingInstance = AppLoadingService.service({
                target: '.heat-content',
                background: 'rgba(235, 246, 255, 0.1)',
                icon: 'gif',
                showText: false,
                size: 100
            });
        };
        if (document.querySelector('.heat-content')) {
            create();
        } else {
            // 弹窗内容尚未渲染（m-modal 未挂载 .heat-content），等待渲染后再创建，避免挂到 body 被弹窗遮挡
            setTimeout(create, 100);
        }
    };
    const closeLoading = () => {
        loadingInstance?.destroy?.();
        loadingInstance = null;
    };
    const isShows = ref(true);
    const isShowBottom = ref(true);
    const systemId = inject('systemId', ref(''));
    const systemList = inject('systemList');
    const equipmentNodeVosList = inject('equipmentNodeVosList');
    const systemObj = ref({});
    const isEmpty = ref(false);
    const isLoading = ref(false);
    const heatSoureType = ref('');
    const batchInfoCodeData = ref([]); // 看板实时值
    const defaultParams = ref({ objectId: [], infoCodes: [] });
    const ahotstationBoardTop = ref([]);
    const equipmentNodeIds = ref([]);
    const queryObjectsExistRuleInfoCode = ref([]);
    const gasBoilerBoardTopData = ref([
        {
            id: 'hotWaterOutTemp',
            name: i18n.global.t('meos_control_web.outlet_water_temp_celsius'),
            isShow: false,
            isSetStateMode: true,
            data: [],
            classCode: 'ACCHGB'
        },
        {
            id: 'combustionState',
            name: i18n.global.t('meos_control_web.combustion_status'),
            isShow: false,
            data: [],
            classCode: 'ACCHGB'
        },
        {
            id: 'burnRate',
            name: i18n.global.t('meos_control_web.combustion_ratio_pct'),
            isShow: false,
            data: [],
            classCode: 'ACCHGB'
        }
    ]);
    const gasBoilerBoardCenterData = ref([]);
    const municipalhotTopData = ref([]);
    const municipalhotCenterData = ref([
        {
            data: [
                {
                    title: i18n.global.t('meos_control_web.plate_exch_secondary_side'),
                    id: 'lowDetaTemp',
                    aliseName: i18n.global.t('common.supply_return_temp_diff'),
                    name: i18n.global.t('meos_control_web.supply_return_temp_diff_celsius'),
                    classCode: 'ACGEHE',
                    data: [],
                    isShow: false
                },
                {
                    title: i18n.global.t('meos_control_web.plate_exch_secondary_side'),
                    id: 'lowOutTemp',
                    aliseName: i18n.global.t('common.outlet_water_temp'),
                    name: i18n.global.t('meos_control_web.outlet_water_temp_celsius'),
                    classCode: 'ACGEHE',
                    data: [],
                    isShow: false
                }
            ]
        },
        {
            data: [
                {
                    title: i18n.global.t('meos_control_web.plate_exch_primary_side'),
                    id: 'highDetaTemp',
                    name: i18n.global.t('meos_control_web.supply_return_temp_diff_celsius'),
                    aliseName: i18n.global.t('common.supply_return_temp_diff'),
                    classCode: 'ACGEHE',
                    data: [],
                    isShow: false
                },
                {
                    title: i18n.global.t('meos_control_web.plate_exch_primary_side'),
                    id: 'highOutTemp',
                    aliseName: i18n.global.t('common.outlet_water_temp'),
                    name: i18n.global.t('meos_control_web.outlet_water_temp_celsius'),
                    classCode: 'ACGEHE',
                    data: [],
                    isShow: false
                }
            ]
        }
    ]);

    if (systemList.value.length) {
        systemObj.value = systemList.value.find(item => item.systemId === systemId.value);
    }
    function cycleArrayElements(mainArray, cycleArray) {
        const result = mainArray.map((value, index) => {
            const colorIndex = index % cycleArray.length;
            return cycleArray[colorIndex];
        });
        return result;
    }

    // 示例使用
    const mainArray = Array.from({ length: 20 }, (_, index) => index + 1);
    const colorArray = [
        '#2481F2',
        '#33D4D2',
        '#FFD873',
        '#B286F5',
        '#7188A6',
        '#9FC9FB',
        '#E9A8E6',
        '#E6D1FF',
        '#D3B2FF',
        '#FCEF7E',
        '#FFB800',
        '#FA9B96',
        '#F8766F',
        '#E63C35',
        '#8EDBAB',
        '#3FBE72',
        '#CCE062',
        '#FBDF23',
        '#72E1DE',
        '#215DD9'
    ]; // 颜色数组

    const coloredArray = cycleArrayElements(mainArray, colorArray);

    // 更新 isShow 的辅助函数
    function updateIsShow(array, item, status) {
        array.forEach(el => {
            if (!status) {
                el.data.forEach(dataItem => {
                    if (item.classCode === dataItem.classCode && item.infoCode === dataItem.id) {
                        dataItem.isShow = true;
                    }
                });
            } else {
                if (item.classCode === el.classCode && item.infoCode === el.id) {
                    el.isShow = true;
                }
            }
        });
    }

    // 过滤 isShow 为 false 的元素
    function filterByIsShow(array) {
        return array.filter(el => el.isShow);
    }

    function generateArray() {
        // 设置起始时间和结束时间
        const startTime = dayjs('2023-11-20 00:00:00');
        const endTime = dayjs('2023-11-20 23:59:59');

        // 初始化结果数组
        const arrayObject = [];

        // 生成15分钟维度的时间数组
        let currentTime = startTime;
        while (dayjsIsBefore(currentTime, endTime)) {
            arrayObject.push(currentTime.format('HH:mm'));
            currentTime = currentTime.add(15, 'minute');
        }
        arrayObject.push('24:00');
        return arrayObject;
    }

    const formatterBatchQueryInfoCodeConfig = response => {
        batchInfoCodeData.value = [];
        const { result, data } = response;
        if (result !== 'success') return;
        batchInfoCodeData.value = realTimeValue[heatSoureType.value];
        if (data && data[systemId.value]?.length) {
            data[systemId.value].forEach(item => {
                batchInfoCodeData.value.forEach(ele => {
                    ele.data.forEach(eleItem => {
                        if (eleItem.infoCode === item.infoCode) {
                            eleItem.isShow = true;
                            eleItem.dataValue = item.dataValue;
                            eleItem.unit = item.unit;
                        }
                    });
                });
            });
        }
    };
    const formatterObjectsExistRule = async response => {
        const checkArray = infoCodeParams[heatSoureType.value];
        queryObjectsExistRuleInfoCode.value = [];
        defaultParams.value = {
            objectId: [],
            infoCodes: []
        };
        let topData = [],
            centerData = [];
        const { result, data } = response;
        if (result !== 'success') return;
        if (!data || data.length === 0) isShows.value = false;
        data &&
            data.forEach(item => {
                defaultParams.value.objectId.push(item.objectId);
                defaultParams.value.infoCodes.push(item.infoCode);
                if (heatSoureType.value === 'MunicipalhotstationBoard') {
                    if (item.classCode === 'ACGEHE') {
                        updateIsShow(municipalhotCenterData.value, item);
                    } else if (item.classCode === 'ACCH') {
                        // 底部参数
                        if (realTimeParamsInfoCodes[heatSoureType.value].includes(item.infoCode)) {
                            queryObjectsExistRuleInfoCode.value.push(item.infoCode);
                        }
                        if (checkArray.includes(item.infoCode)) {
                            if (['2heatWaterMainSupplyTemp', 'heatSecondarySideWaterMainSupplyTempSet'].includes(item.infoCode)) {
                                topData.push({
                                    title: i18n.global.t('meos_control_web.hot_water_supply_temp'),
                                    unit: '℃',
                                    classCode: 'ACCH',
                                    data: [
                                        { name: i18n.global.t('meos_control_web.supply_water_temp'), id: '2heatWaterMainSupplyTemp', data: [] },
                                        { name: i18n.global.t('meos_control_web.supply_water_temp_setpoint'), id: 'heatSecondarySideWaterMainSupplyTempSet', data: [] }
                                    ]
                                });
                            } else if (['heatSecondarySideWaterDetaTemp', 'heatSecondarySideWaterDetaTempSet'].includes(item.infoCode)) {
                                topData.push({
                                    title: i18n.global.t('meos_control_web.hot_water_supply_return_temp_diff'),
                                    classCode: 'ACCH',
                                    unit: '℃',
                                    data: [
                                        { name: i18n.global.t('common.supply_return_temp_diff'), id: 'heatSecondarySideWaterDetaTemp', data: [] },
                                        { name: i18n.global.t('meos_control_web.supply_return_temp_diff_setpoint'), id: 'heatSecondarySideWaterDetaTempSet', data: [] }
                                    ]
                                });
                            } else if (['heatSecondarySideWaterDetaPressure', 'heatSecondarySideWaterDetaPressureSet'].includes(item.infoCode)) {
                                topData.push({
                                    title: i18n.global.t('meos_control_web.hot_water_supply_return_press_diff'),
                                    classCode: 'ACCH',
                                    unit: 'kPa',
                                    data: [
                                        { name: i18n.global.t('meos_control_web.supply_return_press_diff'), id: 'heatSecondarySideWaterDetaPressure', data: [] },
                                        { name: i18n.global.t('meos_control_web.supply_return_press_diff_setpoint'), id: 'heatSecondarySideWaterDetaPressureSet', data: [] }
                                    ]
                                });
                            }
                        }
                    }
                } else {
                    if (item.classCode === 'ACCHGB') {
                        updateIsShow(gasBoilerBoardTopData.value, item, 1);
                    } else if (item.classCode === 'ACCH') {
                        // 底部参数
                        if (realTimeParamsInfoCodes[heatSoureType.value].includes(item.infoCode)) {
                            queryObjectsExistRuleInfoCode.value.push(item.infoCode);
                        }
                        if (checkArray.includes(item.infoCode)) {
                            if (['heatWaterMainSupplyTemp', 'heatWaterSupplyTempSet'].includes(item.infoCode)) {
                                centerData.push({
                                    title: i18n.global.t('meos_control_web.hot_water_supply_temp'),
                                    unit: '℃',
                                    classCode: 'ACCH',
                                    data: [
                                        { name: i18n.global.t('meos_control_web.supply_water_temp'), id: 'heatWaterMainSupplyTemp', data: [] },
                                        { name: i18n.global.t('meos_control_web.supply_water_temp_setpoint'), id: 'heatWaterSupplyTempSet', data: [] }
                                    ]
                                });
                            } else if (['waterDetaTemp', 'waterDetaTempSet'].includes(item.infoCode)) {
                                centerData.push({
                                    title: i18n.global.t('meos_control_web.hot_water_supply_return_temp_diff'),
                                    classCode: 'ACCH',
                                    unit: '℃',
                                    data: [
                                        { name: i18n.global.t('common.supply_return_temp_diff'), id: 'waterDetaTemp', data: [] },
                                        { name: i18n.global.t('meos_control_web.supply_return_temp_diff_setpoint'), id: 'waterDetaTempSet', data: [] }
                                    ]
                                });
                            } else if (['waterDetaPress', 'waterDetaPressSet'].includes(item.infoCode)) {
                                centerData.push({
                                    title: i18n.global.t('meos_control_web.hot_water_supply_return_press_diff'),
                                    classCode: 'ACCH',
                                    unit: 'kPa',
                                    data: [
                                        { name: i18n.global.t('meos_control_web.supply_return_press_diff'), id: 'waterDetaPress', data: [] },
                                        { name: i18n.global.t('meos_control_web.supply_return_press_diff_setpoint'), id: 'waterDetaPressSet', data: [] }
                                    ]
                                });
                            }
                        }
                    }
                }
            });
        // 过滤不需要显示的元素
        gasBoilerBoardTopData.value = filterByIsShow(gasBoilerBoardTopData.value);
        municipalhotCenterData.value = municipalhotCenterData.value.map(ite => {
            return ite.data.filter(show => show.isShow);
        });
        municipalhotTopData.value = topData
            .filter((item, index, self) => {
                return self.findIndex(t => t.title === item.title) === index;
            })
            .sort((a, b) => {
                return a.title < b.title ? 1 : -1;
            });
        gasBoilerBoardCenterData.value = centerData
            .filter((item, index, self) => {
                return self.findIndex(t => t.title === item.title) === index;
            })
            .sort((a, b) => {
                return a.title < b.title ? 1 : -1;
            });

        if (defaultParams?.value) {
            await queryBatchQueryPeriodData();
        }
    };
    const queryBatchQueryPeriodData = async () => {
        ahotstationBoardTop.value = [];
        const res = await batchQueryPeriodData({
            objectIds: Array.from(new Set(defaultParams.value.objectId)),
            infoCodes: Array.from(new Set(defaultParams.value.infoCodes)),
            enumTime: '15min',
            beginDate: getDayjsTz().startOf('day').format('YYYY-MM-DD HH:mm:ss'),
            endDate: getDayjsTz().endOf('day').format('YYYY-MM-DD HH:mm:ss')
        });
        // let res = RES;
        const { result, data } = res;
        if (result !== 'success') return;

        if (data?.length) {
            data.forEach(item => {
                if (item.objectId === systemId?.value) {
                    item.data?.forEach(child => {
                        gasBoilerBoardCenterData.value.forEach(muni => {
                            muni?.data.forEach(muniChild => {
                                if (child.infoCode === muniChild.id) {
                                    muniChild.data.push({
                                        data: child.data,
                                        objectId: item.objectId,
                                        objectName: item.objectName
                                    });
                                }
                            });
                        });
                        municipalhotTopData.value.forEach(muni => {
                            muni?.data.forEach(muniChild => {
                                if (child.infoCode === muniChild.id) {
                                    muniChild.data.push({
                                        data: child.data,
                                        objectId: item.objectId,
                                        objectName: item.objectName
                                    });
                                }
                            });
                        });
                    });
                } else {
                    item.data?.forEach(child => {
                        gasBoilerBoardTopData.value.forEach(gas => {
                            if (gas.id === 'hotWaterOutTemp') {
                                if (child.infoCode === 'hotWaterOutTemp' || child.infoCode === 'hotWaterOutTempSet') {
                                    gas.data.push({
                                        data: child.data,
                                        objectId: item.objectId,
                                        objectName: item.objectName,
                                        type: child.infoCode === 'hotWaterOutTempSet' ? 'set' : 'state'
                                    });
                                }
                            } else if (child.infoCode === gas.id) {
                                gas.data.push({
                                    data: child.data,
                                    objectId: item.objectId,
                                    objectName: item.objectName
                                });
                            }
                        });
                        municipalhotCenterData.value.forEach(muni => {
                            muni?.forEach(muniChild => {
                                if (child.infoCode === muniChild.id) {
                                    muniChild.data.push({
                                        data: child.data,
                                        objectId: item.objectId,
                                        objectName: item.objectName
                                    });
                                }
                            });
                        });
                    });
                }
                isShows.value = false;
            });
        } else {
            isShows.value = false;
        }
    };
    const init = async () => {
        try {
            openLoading();
            isLoading.value = true;
            const response = await queryObjectsExistRule({
                criteria: objectsExistRuleParams[heatSoureType.value],
                objIds: equipmentNodeIds.value.concat([systemId?.value])
            });
            await formatterObjectsExistRule(response);
        } catch (e) {
            closeLoading();
            isLoading.value = false;
            isShows.value = false;
        } finally {
            isLoading.value = false;
            // 图表组件挂载并显示自身 loading 后再关闭主 loading，无缝衔接
            nextTick(() => {
                closeLoading();
            });
        }
    };
    // 查询底部参数
    const queryBatchQueryInfoCodeConfig = async val => {
        const response = await batchQueryInfoCodeConfig({
            object: [
                {
                    objectId: systemId.value,
                    infoCodes: val
                }
            ]
        });
        formatterBatchQueryInfoCodeConfig(response);
    };
    watchEffect(() => {
        if (props?.funcCode) {
            heatSoureType.value = props?.funcCode;
            if (heatSoureType.value === 'MunicipalhotstationBoard') {
                equipmentNodeIds.value = equipmentNodeVosList?.value
                    .map(item => {
                        if (item?.dataObject?.classCode === 'ACCH' || item?.dataObject?.classCode === 'ACGEHE') {
                            return item.dataObjectId;
                        }
                        return null;
                    })
                    .filter(id => id !== null);
            } else {
                equipmentNodeIds.value = equipmentNodeVosList?.value
                    .map(item => {
                        if (item?.dataObject?.classCode === 'ACCHGB' || item?.dataObject?.classCode === 'ACCH') {
                            return item.dataObjectId;
                        }
                        return null;
                    })
                    .filter(id => id !== null);
            }
            if (equipmentNodeIds?.value.length) {
                init();
            }
        }
    });
    watch(
        () => queryObjectsExistRuleInfoCode?.value,
        val => {
            if (val?.length) {
                isShowBottom.value = true;
                queryBatchQueryInfoCodeConfig(val);
            } else {
                const newValue = realTimeValue[heatSoureType.value];
                batchInfoCodeData.value = newValue.map(ele => ({ ...ele, isShow: false }));
                isShowBottom.value = false;
            }
        }
    );

    return {
        isShows,
        isEmpty,
        isLoading,
        systemObj,
        isShowBottom,
        coloredArray,
        heatSoureType,
        batchInfoCodeData,
        gasBoilerBoardTopData,
        gasBoilerBoardCenterData,
        municipalhotTopData,
        municipalhotCenterData,
        generateArray
    };
};
