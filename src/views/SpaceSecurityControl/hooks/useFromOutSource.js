import { useRoute } from 'vue-router';

export const isFromOutSourceKey = Symbol('isFromOutSourceKey');
export const outSourceBuildingIdKey = Symbol('outSourceBuildingIdKey');
export const outSourceFloorIdKey = Symbol('outSourceFloorIdKey');
export const useFromOutSource = () => {
    const route = useRoute();

    const isFromOutSource = route.query?.from === 'outsource';
    const outSourceBuildingId = route.query?.buildingId;
    const outSourceFloorId = route.query?.floorId;

    provide(outSourceBuildingIdKey, outSourceBuildingId);
    provide(outSourceFloorIdKey, outSourceFloorId);
    provide(isFromOutSourceKey, isFromOutSource);

    return {
        isFromOutSource,
        outSourceBuildingId,
        outSourceFloorId
    };
};
