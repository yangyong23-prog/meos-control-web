// @ts-ignore
import i18n from '@/localization';
import dayjs from 'dayjs';
import { globalTimeKey, handleModuleInfoChangeKey, fifteenMinuteTimesKey, oneHourTimesKey, analysisTypeKey, systemNameKey, systemIdKey, fiveMinuteTimesKey } from '../injectionKey';
import { getListAnalysisTypeAxios } from '@/apis/runAnalysis';
import { getDayjsTz, SUCCESSCODE } from '@/utils/globalVariables';
import { listInfoCodes, listObjectsByTackValueLogic } from '@/apis/common';
import { dayjsIsBefore } from '@/utils/dayjsTools';
export const infoCodeMapKey = Symbol('infoCodeMapKey');
export const systemKey = Symbol('systemKey');
export const systemListKey = Symbol('systemListKey');
export const useBaseData = () => {
    const showModuleInfo = ref(false);
    const globalTime = ref('');
    const oneHourTimes = ref([]);
    const fifteenMinuteTimes = ref([]);
    const fiveMinuteTimes = ref([]);
    const analysisType = ref();
    const analysisTypeList = ref([]);
    const systemList = ref([]);
    const systemId = ref('');
    const systemName = ref([]);
    const system = computed(() => systemList.value.find(item => item.id === systemId.value) || {});
    const getGlobalTime = () => {
        // 获取当前日期
        const currentDate = getDayjsTz();
        // 通过减去1天来获取昨天的日期
        const yesterday = currentDate.subtract(1, 'day');
        globalTime.value = yesterday.format('YYYY.MM.DD');
    };
    const handleModuleInfoChange = data => {
        showModuleInfo.value = !showModuleInfo.value;
        analysisType.value = data;
        systemName.value = systemList.value?.[0]?.localName ?? '--';
        systemId.value = systemList.value?.[0]?.id;
    };
    function generateArray(startTime, endTime, interval = 15, format = 'HH:mm') {
        // 初始化结果数组
        const arrayObject = [];
        // 生成5分钟维度的时间数组
        let currentTime = startTime;
        while (dayjsIsBefore(currentTime, endTime)) {
            arrayObject.push(currentTime.format(format));
            currentTime = currentTime.add(interval, 'minute');
        }
        return arrayObject;
    }
    const getTime = (value = 1, unit = 'day', interval = 15, format) => {
        const now = dayjs(globalTime.value);
        let currentHour = now.hour();
        const currentMinute = now.minute();
        if (currentMinute > 0) {
            currentHour += 1;
        }
        const endDay = `${getDayjsTz().format('YYYYMMDD')} ${currentHour}:00`;
        const startDay = dayjs(endDay).subtract(value, unit).format('YYYYMMDD HH:mm');
        return {
            startDay: dayjs(startDay).format('YYYYMMDDHHmm00'),
            endDay: dayjs(endDay).format('YYYYMMDDHHmm00'),
            times: generateArray(dayjs(startDay), dayjs(endDay), interval, format)
        };
    };
    const handleTimes = () => {
        fifteenMinuteTimes.value = getTime().times;
        oneHourTimes.value = getTime(1, 'day', 60, 'HH:mm').times;
        fiveMinuteTimes.value = getTime(1, 'day', 5, 'HH:mm').times;
    };
    const infoCodeMap = ref(new Map());
    const getInfoCodeData = async () => {
        // 添加 ACCCOF 信息点查询
        const queryClassCodes = ['ACAC', 'ACCC', 'ACCCCC', 'ACCCSC', 'ACCCCP', 'ACCCOP', 'ACCPC', 'ACOTU', 'ACATAH', 'ACATFC', 'ACATFU', 'ACCCOF'];
        const res = await listInfoCodes({
            classCodes: queryClassCodes
        });
        const { data, code } = res || {};
        if (code === SUCCESSCODE) {
            data.forEach(element => {
                infoCodeMap.value.set(element.code + element.classCode, element);
            });
            console.log('infoCodeMap:', infoCodeMap.value);
        }
    };
    getInfoCodeData();
    const getListAnalysisType = () => {
        // analysisTypeList.value = [];
        getListAnalysisTypeAxios(dayjs(globalTime.value).format('YYYY-MM-DD'))
            .then(res => {
                analysisTypeList.value = res.data || [];
                analysisTypeList.value.forEach(item => {
                    item.id = item.value;
                });
            })
            .catch(() => {
                analysisTypeList.value = [];
            });
    };
    const getListSystemByClassCode = () => {
        listObjectsByTackValueLogic({
            takeValueLogic: {
                queryParam: {
                    classCode: ['ACCC', 'ACAC'],
                    orderCustoms: [
                        {
                            column: 'isCoolStore',
                            asc: 'false'
                        }
                    ],
                    monitoringSurveillanceStatus: ['2', '3'],
                    withColumns: ['id', 'localName', 'classCode', 'monitoringSurveillanceStatus', 'isCoolStore']
                }
            }
        })
            .then(res => {
                if (res.code === SUCCESSCODE) {
                    systemList.value = res.data || [];
                    systemList.value.forEach(item => {
                        item.key = item.id;
                        item.label = item.localName ?? '--';
                        item.name = item.localName ?? '--';
                    });
                    systemName.value = systemList.value?.[0]?.localName ?? '--';
                    systemId.value = systemList.value?.[0]?.id;
                }
            })
            .catch(() => {
                systemList.value = [];
            });
    };
    getGlobalTime();
    handleTimes();
    onMounted(() => {
        getListAnalysisType();
        getListSystemByClassCode();
    });
    watch(
        () => globalTime.value,
        () => {
            getListAnalysisType();
            getListSystemByClassCode();
        }
    );
    provide(globalTimeKey, globalTime);
    provide(handleModuleInfoChangeKey, handleModuleInfoChange);
    provide(fifteenMinuteTimesKey, fifteenMinuteTimes);
    provide(fiveMinuteTimesKey, fiveMinuteTimes);
    provide(oneHourTimesKey, oneHourTimes);
    provide(analysisTypeKey, analysisType);
    provide(systemNameKey, systemName);
    provide(systemIdKey, systemId);
    provide(infoCodeMapKey, infoCodeMap);
    provide(systemKey, system);
    provide(systemListKey, systemList);
    return { oneHourTimes, fifteenMinuteTimes, globalTime, showModuleInfo, analysisType, analysisTypeList, systemList };
};
