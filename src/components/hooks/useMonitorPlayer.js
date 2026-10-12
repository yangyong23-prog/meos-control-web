// @ts-ignore
import i18n from '@/localization';
import { getPlayerEnv } from '@/views/Common/MonitorPlayer/loadPlayerEnv';
import { ref } from 'vue';
import { fetchCameraRealtimeEnable } from 'yushu-component-web';
import useStore from '@/store';
import { $Message } from 'meri-plus';
import { instanceObjectQuery, listObjectsByTackValueLogic } from '@/apis/common';
import UseCancelTokenHooks from '@/hooks/UseCancelTokenHooks';

export default (selectModuleInfo, showModuleInfo) => {
    const showPlayer = ref(false);
    const currentPlayingObj = ref(null);

    // let watchHandler = null;

    const { cancelQuest, cancelToken } = UseCancelTokenHooks();

    // 因为历史原因，传入的是对象，但是内部只使用id，使用方只要保证有id即可
    const openMonitorPlayer = async ({ id }) => {
        let playerObj = { id };
        cancelQuest();
        try {
            const { code, data } = await listObjectsByTackValueLogic(
                {
                    takeValueLogic: {
                        queryParam: {
                            id: playerObj.id,
                            withColumns: ['manufacturer', 'realTimeStreamProtocol', 'localName', 'isLiveRecord', 'isControl', 'isZoomable'],
                            valid: 1
                        }
                    }
                },
                { cancelToken: cancelToken() }
            );

            if (code === '00000' && data && data.length > 0) {
                playerObj = { ...playerObj, ...data[0] };
            } else {
                throw new Error(i18n.global.t('meos_control_web.failed_to_get_camera_info'));
            }
        } catch (error) {
            console.error('Error fetching camera info:', error);
        }

        if (!playerObj.realTimeStreamProtocol) {
            console.error('id的realTimeStreamProtocol为空');
        }

        const params = {
            protocol: playerObj.realTimeStreamProtocol,
            objectId: playerObj.id
        };

        const { baseUrl, groupCode, projectId, objectId } = getPlayerEnv();

        if (objectId) {
            params.objectId = objectId;
        }

        const { base } = useStore();
        const token = base.token || '';

        fetchCameraRealtimeEnable(params, baseUrl, groupCode, projectId, token).then(({ exist, message }) => {
            console.log('exist, message  :>> ', exist, message);
            if (exist) {
                showPlayer.value = true;
                currentPlayingObj.value = playerObj;
            } else {
                closeMonitorPlayer();
                $Message.Default({ title: message || i18n.global.t('meos_control_web.camera_cannot_stream_video') });
            }
        });
    };

    const closeMonitorPlayer = () => {
        showPlayer.value = false;
        currentPlayingObj.value = null;
        // if (typeof watchHandler === 'function') {
        //     watchHandler();
        // }
    };

    // 切换 或者关闭 选中信息 则 关闭视频监控
    watch(showModuleInfo, () => {
        if (!showModuleInfo.value) {
            showPlayer.value = false;
            currentPlayingObj.value = null;
        }
    });

    watch(selectModuleInfo, () => {
        showPlayer.value = false;
    });

    return { currentPlayingObj, showPlayer, openMonitorPlayer, closeMonitorPlayer };
};
