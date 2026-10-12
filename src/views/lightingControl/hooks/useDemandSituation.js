// @ts-ignore
import i18n from '@/localization';
import { storeToRefs } from 'pinia';
import { listLightLoopTotal } from '@/apis/lightingControl';
import baseStore from '@/store/baseStore';
import { useControls } from '@/store/demandSituationControls';
import { publicAreaDemandSituationKey, parkingLotDemandSituationKey, isPublicAreaLoadingKey, isParkingLotLoadingKey } from '../constants/injectKey';

const LIGHTING_TYPES = {
    PUBLIC: 'PUBLIC_AREA_LIGHTING',
    PARKING: 'PARKING_LOT_LIGHTING'
};

const controlsStore = useControls();
let { publicArea, parkingLot } = storeToRefs(controlsStore);

export default function (config) {
    const eventObj = inject('eventObj', config?.eventObj ?? {});
    const isPublicAreaLoading = ref(false);
    const isParkingLotLoading = ref(false);
    const { projectId } = baseStore();

    const queryListLightLoopTotal = type => {
        const params = {
            projectId: projectId,
            demandTemplateType: type,
            instanceType: 'PROJECT',
            instanceId: projectId
        };
        if (type === 'PUBLIC_AREA_LIGHTING') {
            isPublicAreaLoading.value = true;
        } else {
            isParkingLotLoading.value = true;
        }
        listLightLoopTotal(params)
            .then(res => {
                const { result, data } = res;
                if (result !== 'success') return;
                if (type === 'PUBLIC_AREA_LIGHTING') {
                    publicArea.value = Array.isArray(data) ? [...data] : [];
                }
                if (type === 'PARKING_LOT_LIGHTING') {
                    parkingLot.value = Array.isArray(data) ? [...data] : [];
                }
            })
            .finally(() => {
                if (type === 'PUBLIC_AREA_LIGHTING') {
                    isPublicAreaLoading.value = false;
                } else {
                    isParkingLotLoading.value = false;
                }
            });
    };

    const getListLightLoopTotal = data => {
        if (!Array.isArray(data) || !data?.length) return;
        // TODO 待验证SSE推送
        const listType = data?.[0]?.demandTemplateType;
        console.log('sse-listData', data);

        if (listType === 'PARKING_LOT_LIGHTING') {
            parkingLot.value = data;
        } else {
            // PUBLIC_AREA_LIGHTING 公共照明
            publicArea.value = data;
        }
    };

    // Initialize data and SSE
    [LIGHTING_TYPES.PUBLIC, LIGHTING_TYPES.PARKING].forEach(type => {
        queryListLightLoopTotal(type);
        // config?.setSSEClientOption?.(projectId, 'PROJECT', type);
    });

    const stopWatchEventObj = watch(
        () => eventObj?.value,
        val => {
            // LIGHT_LOOP 当前需求满足情况
            if (val.eventType === 'LIGHT_LOOP') {
                getListLightLoopTotal(val.data);
            }
        }
    );

    provide(publicAreaDemandSituationKey, publicArea);
    provide(parkingLotDemandSituationKey, parkingLot);
    provide(isPublicAreaLoadingKey, isPublicAreaLoading);
    provide(isParkingLotLoadingKey, isParkingLotLoading);
    onUnmounted(() => {
        stopWatchEventObj();
    });
    return {};
}
