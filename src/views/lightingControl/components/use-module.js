// @ts-ignore
import i18n from '@/localization';
import { MLoading } from 'meri-plus';
import { getControllerDetail, countSpaceRelatedEquipManualAutoStatus } from '@/apis/LightingDetail';
import { SUCCESSCODE } from '@/utils/globalVariables';
import { setEquipmentAndSpaceSSEClientOptionKey, equipmentAndSpaceSSEClientKey } from '../hooks/useEquipmentAndSpaceSSE';
import { IOT_DATA_CHANGE } from '@/utils/SSEEventTypes';

export const useModule = props => {
    const setEquipmentAndSpaceSSEClientOption = inject(setEquipmentAndSpaceSSEClientOptionKey);
    const equipmentAndSpaceSSEClient = inject(equipmentAndSpaceSSEClientKey);
    const configList = ref({});
    const dataStatus = ref({});
    const configListId = ref([]); // 空间内所有对象
    const show = ref(false);
    console.log(props, 'props');
    const initModule = async loading => {
        equipmentAndSpaceSSEClient?.destory();
        show.value = true;
        let Mloading = null;
        if (loading) {
            Mloading = MLoading.service({
                target: '.module-scrollbar',
                fullscreen: false,
                duration: 30000,
                lottieName: 'ball',
                loadIconStyle: {
                    width: '100px',
                    height: '100px'
                }
            });
        }
        const promises = [
            countSpaceRelatedEquipManualAutoStatus({
                instanceId: props.id,
                instanceType: 'EQUIPMENT',
                demandTemplateType: props.templateType
            }),
            getControllerDetail({
                controllerId: props.id,
                spaceId: props.spaceId,
                templateType: props.templateType
            })
        ];
        await Promise.all(promises)
            .then(result => {
                if (result[0].code === SUCCESSCODE) {
                    dataStatus.value = result[0].data;
                }
                if (result[1].code === SUCCESSCODE) {
                    result[1].data &&
                        result[1].data.relCircuits?.length &&
                        result[1].data.relCircuits.forEach(item => {
                            item.funcTypeOpen = false;
                            item.abnormalTypeOpen = false;
                        });
                    configList.value = result[1].data;
                    configListId.value = result[1].data?.relCircuits?.map(item => item.id); // 获取对象sse使用
                }
                console.log('res', configList.value, dataStatus.value);
                Mloading?.destroy();
            })
            .catch(error => {
                Mloading?.destroy();
            });
        const classCodeAndObjectIds = { [configList.value.classCode]: [configList.value.id] };
        configList.value?.relCircuits?.forEach(item => {
            if (classCodeAndObjectIds[item.classCode]) {
                classCodeAndObjectIds[item.classCode].push(item.id);
            } else {
                classCodeAndObjectIds[item.classCode] = [item.id];
            }
        });
        setEquipmentAndSpaceSSEClientOption(classCodeAndObjectIds);
        equipmentAndSpaceSSEClient?.addEventListener(IOT_DATA_CHANGE, dealEvent);
    };
    const dealEvent = res => {
        if (res.eventType === IOT_DATA_CHANGE) {
            if (configListId?.value.includes(res.data.objectId)) {
                configList.value?.relCircuits?.length &&
                    configList.value?.relCircuits.forEach(item => {
                        if (item.id === res.data.objectId && res.data.infoCode === 'manualAutoStatus') {
                            console.log('***************', res.data);
                            if (item.runningParameters?.length) {
                                item.runningParameters.forEach(code => {
                                    if (code.infoCode === 'manualAutoStatus') {
                                        code.infoCodeValue = res.data.dataValue;
                                    }
                                });
                            }
                        }
                    });
                console.log('推送数据后的对象：：：：：', configList.value?.relCircuits);
            }
        }
    };
    onMounted(() => {
        initModule(true);
    });
    onBeforeUnmount(() => {
        equipmentAndSpaceSSEClient?.addEventListener(IOT_DATA_CHANGE, dealEvent);
        equipmentAndSpaceSSEClient?.destory();
    });
    watch(
        () => props.id,
        () => {
            initModule(true);
        }
    );
    watchEffect(() => {
        // 手动数量
        const countValueEqualTo0 =
            configList.value?.relCircuits?.length &&
            configList.value?.relCircuits.reduce((count, obj) => {
                return count + obj?.runningParameters.filter(item => item.infoCode === 'manualAutoStatus' && item.infoCodeValue === '0').length;
            }, 0);

        // 自动数量
        const countValueEqualTo1 =
            configList.value?.relCircuits?.length &&
            configList.value?.relCircuits.reduce((count, obj) => {
                return count + obj?.runningParameters.filter(item => item.infoCode === 'manualAutoStatus' && item.infoCodeValue === '1').length;
            }, 0);

        // 总数赋值给手自动
        dataStatus.value = {
            autoStatusCount: countValueEqualTo1,
            manualStatusCount: countValueEqualTo0
        };
        console.log('手自动总数:::::', countValueEqualTo1, countValueEqualTo0);
    });
    provide('initModule', initModule);
    return {
        dataStatus,
        configList,
        show
    };
};
