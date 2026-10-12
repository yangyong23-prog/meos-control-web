// @ts-ignore
import i18n from '@/localization';
import { getListTemplateTypes } from '@/apis/machineRoomSpaceMap';
import {
    curSpace3DViewDataInjectKey,
    runningMonitorTypeInjectKey,
    spaceShowModuleInfoInjectKey,
    spaceSelectModuleInfoInjectKey,
    goToSpace3DViewInjectKey,
    backFromSpace3DViewInjectKey,
    showSpace3DViewInjectKey
} from '../constant/injectKey';

import { useRouter, useRoute } from 'vue-router';
import { TABLE_LIST } from '@/utils/globalVariables';

export default (hasMounted = false) => {
    const router = useRouter();
    const showPipes = ref(false); // 显示管道
    const showSpace3DView = ref(false);
    const curSpace3DViewData = ref({});

    const spaceShowModuleInfo = ref(false);
    const spaceSelectModuleInfo = ref({});
    const listTemplateTypes = ref(new Map());
    const runningMonitorType = 'COMPUTER_ROOM_SECURITY';
    const { query } = useRoute();
    const goToSpace3DView = (item, from) => {
        if (!item?.id) {
            return;
        }

        showSpace3DView.value = true;
        curSpace3DViewData.value = item;
        // spaceSelectModuleInfo.value = { ...item, floorLocalName: item?.floorName };
        // spaceShowModuleInfo.value = true;

        router.push({
            name: 'machine-room-safety-space',
            path: '/machine-room-safety/space',
            query: {
                curSpaceId: item?.id,
                curFloorId: item?.floorId,
                from
            }
        });
    };

    const backFromSpace3DView = () => {
        showSpace3DView.value = false;
        curSpace3DViewData.value = {};

        const { from, curFloorId } = query || {};
        if (from === 'floorMap') {
            router.push({
                name: 'machine-room-safety',
                path: '/machine-room-safety',
                query: {
                    curFloorId: curFloorId
                }
            });
        } else if (from === 'homeCard') {
            router.push({
                name: 'machine-room-safety',
                path: '/machine-room-safety'
            });
        }
    };
    onMounted(() => {
        hasMounted &&
            getListTemplateTypes({ templateCode: TABLE_LIST, runningMonitorType: 'COMPUTER_ROOM_SECURITY' }).then(res => {
                res.data?.forEach(element => {
                    listTemplateTypes.value.set(element.templateTypeId, element);
                });
            });
    });
    provide(spaceShowModuleInfoInjectKey, spaceShowModuleInfo);
    provide(spaceSelectModuleInfoInjectKey, spaceSelectModuleInfo);
    provide(runningMonitorTypeInjectKey, runningMonitorType);
    provide(goToSpace3DViewInjectKey, goToSpace3DView);
    provide(backFromSpace3DViewInjectKey, backFromSpace3DView);
    provide(showSpace3DViewInjectKey, showSpace3DView);
    provide(curSpace3DViewDataInjectKey, curSpace3DViewData);

    return {
        showSpace3DView,
        backFromSpace3DView,
        spaceShowModuleInfo,
        spaceSelectModuleInfo,
        listTemplateTypes
    };
};
