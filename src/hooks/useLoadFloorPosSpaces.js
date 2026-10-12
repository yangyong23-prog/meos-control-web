import { listInfoCodeConfigsByObjectIdCommon, listObjectsByTackValueLogic } from '@/apis/public';
import useStore from '@/store';
import UseCancelTokenHooks from '@/hooks/UseCancelTokenHooks';
import { GeneralZone, OBJ_TYPE } from '@/utils/globalVariables';

const POSITION_CONFIG_KEY = 'defaultLocationIdentifier';
/**
 * 加载楼层图定位对象
 */
export default () => {
    const { base } = useStore();
    const { cancelToken: cancelStaticInfoToken, cancelQuest: cancelStaticInfoQuest } = UseCancelTokenHooks();
    const _configData = {};
    let _cfgLoadPromise = null,
        _floorCache = {},
        _positionConfigMap = null;

    const loadConfig = async () =>
        await listInfoCodeConfigsByObjectIdCommon({
            runningMonitorType: 'COMMON',
            templateType: 'WEB_CONFIG',
            objectIds: [base.projectId],
            filterGroups: [
                {
                    groupCode: 'default',
                    infoCodes: [POSITION_CONFIG_KEY]
                }
            ]
        }).then(res => {
            // console.log('res: ', res);
            if (res.data?.length > 0) {
                res.data[0].relInfoCodeGroupConfigs?.forEach(group => {
                    group.relInfoCodeConfigs?.forEach(info => {
                        if (info.showStyle) {
                            const configArr = JSON.parse(info.showStyle);
                            _configData[info.infoCode] = configArr;
                            console.log('configArr: ', configArr);
                        }
                    });
                });
                // console.log('sssssss=====', this._globalConfig);
            }
        });

    const getFloorPositionObjs = async (floorId, needEq = true) => {
        if (!_cfgLoadPromise) {
            _cfgLoadPromise = loadConfig();
        }
        if (_floorCache[floorId]) {
            return _floorCache[floorId];
        }
        cancelStaticInfoQuest();
        await _cfgLoadPromise;
        const roomFuncTypeArr = [];
        const classCodeArr = [];

        const posConfs = _configData[POSITION_CONFIG_KEY];
        posConfs?.forEach(({ roomFuncType, objType }) => {
            if (objType === OBJ_TYPE.SPACE) {
                roomFuncTypeArr.push(roomFuncType);
            } else if (objType === OBJ_TYPE.EQUIPMENT && needEq) {
                classCodeArr.push(roomFuncType);
            }
        });
        const spaceParams = {
            takeValueLogic: {
                queryParam: {
                    floorId,
                    classCode: [GeneralZone],
                    roomFuncType: roomFuncTypeArr,
                    withColumns: ['id', 'localName', 'roomFuncType', 'floorId', 'bimLocation']
                }
            }
        };

        const requestArr = [];
        if (roomFuncTypeArr?.length > 0) {
            requestArr.push(listObjectsByTackValueLogic(spaceParams, { cancelToken: cancelStaticInfoToken() }));
        }
        if (classCodeArr?.length > 0) {
            const equipParams = {
                takeValueLogic: {
                    queryParam: {
                        floorId,
                        classCode: classCodeArr,
                        withColumns: ['id', 'localName', 'classCode', 'floorId', 'bimLocation']
                    }
                }
            };
            requestArr.push(listObjectsByTackValueLogic(equipParams, { cancelToken: cancelStaticInfoToken() }));
        }
        if (requestArr.length > 0) {
            const results = await Promise.allSettled(requestArr);
            const spaces = results[0]?.value?.data ?? [];
            const equips = results[1]?.value?.data ?? [];
            _floorCache[floorId] = { spaces, equips };
            return _floorCache[floorId];
        }

        return null;
    };

    /**
     * 获取定位对象配置
     * @param {*} roomFuncType 空间功能类型
     * @returns
     */
    const getPositionConfig = roomFuncType => {
        if (!_positionConfigMap && _configData[POSITION_CONFIG_KEY]) {
            _positionConfigMap = {};
            _configData[POSITION_CONFIG_KEY]?.forEach(obj => {
                try {
                    obj.weight = parseFloat(obj.weight ?? '0');
                } catch (e) {
                    console.log('e: ', e);
                }
                _positionConfigMap[obj.roomFuncType] = obj;
            });
        }
        if (_positionConfigMap) {
            return _positionConfigMap[roomFuncType];
        }

        return null;
    };

    onBeforeUnmount(() => {
        _floorCache = {};
    });

    return {
        getFloorPositionObjs,
        getPositionConfig
    };
};
