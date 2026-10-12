// @ts-ignore
import i18n from '@/localization';
import { MLoading } from 'meri-plus';
import { countSpaceRelatedEquipManualAutoStatus, getSpaceDetail } from '@/apis/LightingDetail';
import { SUCCESSCODE } from '@/utils/globalVariables';
import { setEquipmentAndSpaceSSEClientOptionKey, equipmentAndSpaceSSEClientKey } from '../hooks/useEquipmentAndSpaceSSE';
import { IOT_DATA_CHANGE } from '@/utils/SSEEventTypes';

export const useRight = props => {
    const setEquipmentAndSpaceSSEClientOption = inject(setEquipmentAndSpaceSSEClientOptionKey);
    const equipmentAndSpaceSSEClient = inject(equipmentAndSpaceSSEClientKey);
    const dataStatus = ref({});
    const spaceData = ref({});
    const spaceDataId = ref([]); // 空间内所有对象
    const show = ref(false);
    const initSpace = async loading => {
        show.value = true;
        let Mloading = null;
        if (loading) {
            Mloading = MLoading.service({
                target: '.space-scrollbar',
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
                instanceType: 'SPACE',
                demandTemplateType: props.templateType
            }),
            getSpaceDetail({
                spaceId: props.id,
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

                            _handleDisableControl(item);
                        });
                    result[1].data.relControllers?.length &&
                        result[1].data.relControllers.forEach(item => {
                            item.abnormalShow = true;
                        });
                    spaceData.value = result[1].data;
                    spaceDataId.value = result[1].data?.relCircuits?.map(item => item.id); // 获取对象sse使用
                }
                const classCodeAndObjectIds = { [spaceData.value.classCode]: [spaceData.value.id] };
                spaceData.value.relCircuits.forEach(item => {
                    if (classCodeAndObjectIds[item.classCode]) {
                        classCodeAndObjectIds[item.classCode].push(item.id);
                    } else {
                        classCodeAndObjectIds[item.classCode] = [item.id];
                    }
                });
                setEquipmentAndSpaceSSEClientOption(classCodeAndObjectIds);
                console.log(equipmentAndSpaceSSEClient);

                Mloading?.destroy();
            })
            .catch(error => {
                console.log(error, 'error');
                Mloading?.destroy();
            });

        // setTimeout(() => {
        //     dealEvent({
        //         projectId: 'Pj9522457558',
        //         eventType: 'IOT_DATA_CHANGE',
        //         data: {
        //             objectId: 'Eq7480382824e30274a482774519a180da1a42a1b8d3',
        //             infoCode: 'i',
        //             dataValue: '3',
        //             dataTime: '20250224170950',
        //             dataIndate: '5'
        //         }
        //     });
        // }, 2000);
    };
    const dealEvent = res => {
        console.log(res);

        if (res.eventType === IOT_DATA_CHANGE) {
            spaceData.value?.relCircuits?.length &&
                spaceData.value?.relCircuits.forEach(item => {
                    if (item.id === res.data.objectId) {
                        console.log('***************', res.data);
                        if (item.runningParameters?.length) {
                            item.runningParameters.forEach(code => {
                                if (code.infoCode === res.data.infoCode) {
                                    code.infoCodeValue = res.data.dataValue;
                                }
                            });
                        }
                    }

                    _handleDisableControl(item);
                });
        }
    };
    const _handleDisableControl = item => {
        if (item.settingParameters?.length && item.settingParameters.find(item => item.infoCode === 'manualAutoSet')) {
            const restrictInfos = item.restrictInfos || {};
            item.disableControl = !(
                (restrictInfos.localRemoteStatus === undefined && restrictInfos.onlineStatus === '1') ||
                (restrictInfos.localRemoteStatus === '1' && restrictInfos.onlineStatus === '1')
            );
        }
    };
    onMounted(() => {
        equipmentAndSpaceSSEClient?.addEventListener(IOT_DATA_CHANGE, dealEvent);
        initSpace(true);
    });
    onBeforeUnmount(() => {
        equipmentAndSpaceSSEClient?.removeEventListener(IOT_DATA_CHANGE, dealEvent);
        equipmentAndSpaceSSEClient?.destory();
    });
    watch(
        () => props.id,
        () => {
            initSpace(true);
        }
    );
    watchEffect(() => {
        // 手动数量
        const countValueEqualTo0 =
            spaceData.value?.relCircuits?.length &&
            spaceData.value?.relCircuits.reduce((count, obj) => {
                const num = obj?.runningParameters?.filter(item => item.infoCode === 'manualAutoStatus' && item.infoCodeValue === '0').length;
                return count + (num ?? 0);
            }, 0);

        // 自动数量
        const countValueEqualTo1 =
            spaceData.value?.relCircuits?.length &&
            spaceData.value?.relCircuits.reduce((count, obj) => {
                const num = obj?.runningParameters?.filter(item => item.infoCode === 'manualAutoStatus' && item.infoCodeValue === '1').length;
                return count + (num ?? 0);
            }, 0);

        // https://shimo.im/docs/Wr3DpYy68KI2D53J/ 《设备状态对设备控制操作的限制》，可复制链接后用石墨文档 App 打开
        // 有任意一个置灰，则批量操作按钮置灰
        const hasDisableControl = !!spaceData.value?.relCircuits?.find(c => c.disableControl);

        // 总数赋值给手自动
        dataStatus.value = {
            autoStatusCount: countValueEqualTo1,
            manualStatusCount: countValueEqualTo0,
            hasDisableControl
        };
        console.log('手自动总数:::::', countValueEqualTo1, countValueEqualTo0);
    });
    provide('initSpace', initSpace);
    return {
        dataStatus,
        show,
        spaceData
    };
};
