// @ts-ignore
import i18n from '@/localization';
import { listInfoCodeConfigsByObject } from '@/apis/machineRoomSafety';
import { listInfoCodeConfigsByObjectIdCommon } from '@/apis/public';
import useLoading from '@/hooks/useLoading';
import { abnormalJumpFun } from '@/utils/envUtils';
import { iterateObjct4InstanceInfo } from '@/utils/index';
import DockSingleton from '@/hooks/responsiveDock';
import { traverseObjectItems, isIotInfoType } from '@/utils/infoTemplate';
import useSinglePOSTSSEClient from '@/components/hooks/useSinglePOSTSSEClient';
import { TABLE_LIST } from '@/utils/globalVariables';
import { ABNORMAL_EVENT, IOT_DATA_CHANGE } from '@/utils/SSEEventTypes';
const { setIotData, getIotData } = DockSingleton.getInstance();

export default (props, emits) => {
    const { openLoading, closeLoading } = useLoading('table-content', 'rgba(255, 0, 0, 0)', 'ball');
    const { setSSEClientOption } = useSinglePOSTSSEClient('COMPUTER_ROOM_SECURITY');
    const isEmpty = ref(false);
    const screenWidth = ref(document.documentElement.clientWidth);
    const eqListRef = ref();
    const configsByObjectTableList = ref([]);
    const isMore = ref(true);
    const templateTypeId = ref('');
    const isActive = ref(false);
    const eqListDefault = ref([]);
    const eqList = ref([]);
    const eqListPopover = ref([]);
    const itemWidths = ref([]);
    const containerRef = ref(null);
    const claasCodeTables = ref({});
    const eventType = [IOT_DATA_CHANGE, ABNORMAL_EVENT];
    const filter = ref(['iot']);
    const scrollTo = anchor => {
        const targetElement = document.querySelector(anchor);
        templateTypeId.value = anchor.replace(/#/, '');
        if (targetElement) {
            nextTick(() => {
                targetElement?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                    inline: 'nearest'
                });
                isActive.value = true;
            });
            setTimeout(() => {
                isActive.value = false;
            }, 2000);
        }
    };
    const changeTableView = () => {
        emits('changeTableView');
    };
    const init = () => {
        itemWidths.value = [];
        if (eqListRef?.value) {
            const itemWidth = eqListRef?.value.querySelectorAll('.eq-list-item');
            itemWidth.forEach(item => {
                itemWidths.value.push(item.offsetWidth + 12);
            });
            console.log('itemWidths: ', itemWidths.value);
            if (containerRef?.value && eqListRef?.value.offsetWidth) {
                if (itemWidths.value.length > 0 && eqListRef?.value?.offsetWidth) {
                    let totalWidth = 0,
                        index = -1;
                    for (let i = 0; i < itemWidths.value.length; i++) {
                        if (totalWidth + itemWidths.value[i] <= eqListRef?.value.offsetWidth) {
                            totalWidth += itemWidths.value[i];
                            index = i;
                        } else {
                            break;
                        }
                    }
                    eqListPopover.value = eqListDefault.value.slice(index + 1);
                }
            }
        }
        console.log(eqListPopover.value);
    };
    const changeMore = () => {
        isMore.value = false;
    };
    const handleClickOutside = event => {
        if (!event.target.classList.contains('more')) {
            isMore.value = true;
        }
    };
    const queryListInfoCodeConfigsByObject = async () => {
        if (!props?.allEquips?.length) {
            isEmpty.value = true;
            configsByObjectTableList.value = [];
            eqListDefault.value = [];
            eqList.value = [];
            return;
        }
        configsByObjectTableList.value = [];
        openLoading();
        const params = {
            templateCode: TABLE_LIST,
            runningMonitorType: 'COMPUTER_ROOM_SECURITY',
            objectIds:
                props?.allEquips?.map(item => {
                    return item.id;
                }) || []
        };
        try {
            const res = await listInfoCodeConfigsByObjectIdCommon(params);
            const { result, data } = res;
            if (result === 'success') {
                if (data.length === 0) {
                    isEmpty.value = true;
                }
                const { classCodeIds } = iterateObjct4InstanceInfo(data);
                claasCodeTables.value = classCodeIds;
                console.log('classCodeIds: ', classCodeIds);
                traverseObjectItems(data, (ownObj, info) => {
                    if (ownObj?.id && info?.infoCode && isIotInfoType(info?.infoCodeType)) {
                        setIotData(ownObj?.id, info?.infoCode, info);
                    }
                });
                const groupedData = data.reduce((acc, item) => {
                    const { localName: objectName, templateTypeId, templateTypeName, relInfoCodeGroupConfigs } = item;
                    const configs = relInfoCodeGroupConfigs?.filter(config => config.groupCode === 'equipStatus')[0]?.relInfoCodeConfigs;
                    const columnsList = [
                        {
                            dataIndex: 'objectName',
                            title: i18n.global.t('meos_control_web.equipment_name'),
                            width: 182,
                            resizable: true,
                            fixed: 'left'
                        }
                    ].concat(
                        configs?.map(columns => {
                            return {
                                align: 'left',
                                dataIndex: columns.infoCode,
                                title: columns.infoCode === 'alarmeventdetail' ? i18n.global.t('meos_control_web.abnormal_event') : columns.infoCodeName,
                                width: columns.infoCode === 'alarmeventdetail' && 80,
                                minWidth: columns.infoCode !== 'alarmeventdetail' && 90,
                                resizable: true
                            };
                        }) || []
                    );
                    if (!acc[item.templateTypeId]) {
                        acc[templateTypeId] = {
                            templateTypeId,
                            templateTypeName,
                            objectName,
                            columnsList,
                            dataList: []
                        };
                    }
                    let obj = { objectName: objectName, iots: configs.filter(v => v.infoCode !== 'alarmeventdetail') };
                    configs.forEach(config => {
                        if (isIotInfoType(config?.infoCodeType)) {
                            obj[config.infoCode] = computed(() => {
                                const infoData = getIotData(item.id, config.infoCode);
                                let dataName = '';
                                if (infoData.dataSource?.length) {
                                    dataName = config.dataSource.filter(b => b.code === infoData?.dataValue)[0]?.name || '';
                                } else {
                                    dataName = infoData.dataValue ? infoData.dataValue + (infoData.unit || '') : '--' + (infoData.unit || '');
                                }
                                return dataName;
                            });
                        } else if (config.infoCode === 'alarmeventdetail') {
                            obj.alarmeventdetail = computed(() => {
                                return config.dataValue || 0;
                            });
                        }
                    });
                    acc[templateTypeId].dataList.push(obj);
                    return acc;
                }, {});
                configsByObjectTableList.value = Object.values(groupedData);
                eqListDefault.value = configsByObjectTableList.value.map(eq => {
                    return {
                        templateTypeId: eq.templateTypeId,
                        templateTypeName: eq.templateTypeName,
                        count: eq.dataList.length
                    };
                });
                eqList.value = eqListDefault.value;
                nextTick(() => {
                    init();
                });
                closeLoading();
            }
        } catch (e) {
            closeLoading();
        }
    };
    const abnormalJump = item => {
        abnormalJumpFun(item);
    };

    onMounted(() => {
        queryListInfoCodeConfigsByObject();
        document.addEventListener('click', handleClickOutside);
        window.addEventListener('resize', () => {
            screenWidth.value = document.documentElement.clientWidth;
        });
    });

    onBeforeUnmount(() => {
        document.addEventListener('click', handleClickOutside);
        window.removeEventListener('resize', () => {
            screenWidth.value = document.documentElement.clientWidth;
        });
    });

    watch(
        () => screenWidth.value,
        val => {
            screenWidth.value = val;
            init();
        },
        {
            deep: true
        }
    );
    watch(
        () => props.allEquips,
        () => {
            queryListInfoCodeConfigsByObject();
        }
    );

    watch(claasCodeTables, () => {
        if (claasCodeTables.value) {
            setSSEClientOption({
                claasCode2objectIds: claasCodeTables.value,
                eventParamMap: { INFO_CODE_CONFIG_EVENT: { templateType: TABLE_LIST } },
                eventType
            });
        }
    });

    return {
        eqList,
        filter,
        isMore,
        isEmpty,
        isActive,
        eqListRef,
        screenWidth,
        containerRef,
        eqListPopover,
        templateTypeId,
        configsByObjectTableList,
        init,
        scrollTo,
        changeMore,
        abnormalJump,
        changeTableView
    };
};
