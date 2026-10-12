import { BaseObject } from '@/types/common';

export const useSpaceListHook = () => {
    const showSpaceList = ref(false);
    const spaceListData = ref<BaseObject>({ id: '', name: '' });
    const openSpaceList = (data: { airTerminalZoneId: string; airTerminalZoneName: string }) => {
        spaceListData.value = { id: data.airTerminalZoneId, name: data.airTerminalZoneName };
        showSpaceList.value = true;
    };
    const closeSpaceList = () => {
        showSpaceList.value = false;
    };
    return {
        showSpaceList,
        spaceListData,
        openSpaceList,
        closeSpaceList
    };
};
