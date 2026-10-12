import dataDockHandling from '@/hooks/dataDockHandling';
import { DETAIL, SUCCESSCODE } from '@/utils/globalVariables';
import { MLoading } from 'meri-plus';

import { commonDrawerRootContextKey } from '@/components/common/CommonDrawer/constant';
import { iterateObjct4InstanceInfo } from '@/utils';
import { listInfoCodeConfigsByObjectIdCommon } from '@/apis/public';
import xplantindoorenvStore from '@/store/xplantindoorenv';
import { additionalFloorInfo } from '@/apm-3d/utils/buildingTools';

export const curExpandObjIdKey = Symbol('curExpandObjIdKey');
export const idMapInfoCodesKey = Symbol('idMapInfoCodesKey');
export default (props, emits) => {
    const statusCodes = ['relEquipStatus', 'relSpaceStatus', 'spaceStatus', 'equipStatus'];
    // const emits = defineEmits(['loadedObjects']);
    const commonDrawerRoot = inject(commonDrawerRootContextKey);

    const { loadDynaDataWithIotHandling, writeDataToResponsiveDock } = dataDockHandling();

    const relConfigs = ref([]);
    const loading = ref(true);
    const idMapInfoCodes = ref({});

    let mloading = null,
        cancelChartLoad = new AbortController();

    // if (loading.value) {
    //     mloading = MLoading.service({
    //         target: '.content',
    //         fullscreen: false,
    //         duration: 30000,
    //         lottieName: 'ball',
    //         loadIconStyle: {
    //             width: '100px',
    //             height: '100px'
    //         }
    //     });
    // }
    const buildingList = computed(() => {
        return props.buildings || xplantindoorenvStore().buildingData;
    });
    const flatInfoCodes = relInfoCodeGroupConfigs => {
        const arr = [];
        if (!relInfoCodeGroupConfigs) {
            return arr;
        }
        const trvalCollect = groupArr => {
            groupArr.forEach(g => {
                if (!statusCodes.includes(g.groupCode)) {
                    if (g.groupChildren?.length > 0) {
                        trvalCollect(g.groupChildren);
                    }
                    g.relInfoCodeConfigs?.forEach(info => {
                        arr.push(info);
                    });
                }
            });
        };
        trvalCollect(relInfoCodeGroupConfigs);
        return arr.sort((a, b) => a.sequence - b.sequence);
    };
    const floorIdCache = {};
    const groupList = computed(() => {
        if (buildingList.value?.length > 1) {
            return relConfigs.value
                ?.map(group => {
                    const buildingIdMap = {};
                    const objList = group.relInfoCodeConfigs?.length > 0 ? group.relInfoCodeConfigs[0].dataValue || [] : [];
                    if (objList.length === 0) {
                        return false;
                    }
                    objList?.forEach(obj => {
                        obj.floorId = obj.floorId || obj.inFloor?.id;
                        additionalFloorInfo(obj, floorIdCache);
                        if (!buildingIdMap[obj.buildingId]) {
                            buildingIdMap[obj.buildingId] = {
                                id: obj.buildingId,
                                name: obj.buildingLocalName,
                                open: true,
                                children: []
                            };
                        }
                        // obj.infoCodes = flatInfoCodes(obj.relInfoCodeGroupConfigs);
                        idMapInfoCodes.value[obj.id] = flatInfoCodes(obj.relInfoCodeGroupConfigs);
                        buildingIdMap[obj.buildingId].children.push(obj);
                    });
                    const buildObjs = [];

                    buildingList.value?.forEach(building => {
                        const buildObj = buildingIdMap[building.id];
                        if (buildObj) {
                            buildObjs.push(buildObj);
                        }
                    });
                    buildObjs.forEach(obj => {
                        obj.children = obj.children.sort((a, b) => b.floorSequenceId - a.floorSequenceId);
                    });
                    group.children = buildObjs;
                    group.childType = 'building';
                    group.open = true;
                    return group;
                })
                .filter(Boolean);
        } else {
            return relConfigs.value
                ?.map(group => {
                    const objList = group.relInfoCodeConfigs?.length > 0 ? group.relInfoCodeConfigs[0].dataValue || [] : [];
                    if (objList.length === 0) {
                        return false;
                    }
                    objList?.forEach(obj => {
                        obj.floorId = obj.inFloor?.id;
                        additionalFloorInfo(obj, floorIdCache);
                        // obj.infoCodes = flatInfoCodes(obj.relInfoCodeGroupConfigs);
                        idMapInfoCodes.value[obj.id] = flatInfoCodes(obj.relInfoCodeGroupConfigs);
                        obj.name = obj.localName;
                    });
                    group.children = objList.sort((a, b) => b.floorSequenceId - a.floorSequenceId);
                    group.open = true;
                    return group;
                })
                .filter(Boolean);
        }
    });

    const loadData = () => {
        if (!props.selectObj?.id) {
            return;
        }
        loading.value = true;
        cancelChartLoad = new AbortController();
        loadDynaDataWithIotHandling(
            {
                runningMonitorType: props.runningMonitorType,
                objectIds: [props.selectObj?.id],
                templateType: DETAIL,
                filterGroups: [
                    {
                        groupCode: props.groupCode,
                        deepQuery: true
                    }
                ]
            },
            listInfoCodeConfigsByObjectIdCommon,
            cancelChartLoad.signal
        )
            .then(({ code, data }) => {
                if (code === SUCCESSCODE) {
                    const { classCodeIds } = iterateObjct4InstanceInfo(data);
                    commonDrawerRoot.setClass2Ids(props.selectObj?.id, classCodeIds);
                    writeDataToResponsiveDock(data);
                    if (props.handleData) {
                        relConfigs.value = props.handleData(data);
                    } else {
                        relConfigs.value = data?.length > 0 ? data[0]?.relInfoCodeGroupConfigs?.find(g => g.groupCode === props.groupCode)?.groupChildren || [] : [];
                    }
                    console.log(relConfigs.value);
                    let objects = [];
                    relConfigs.value?.forEach(g => {
                        const objList = g.relInfoCodeConfigs?.length > 0 ? g.relInfoCodeConfigs[0].dataValue || [] : [];
                        if (objList.length > 0) {
                            objects = objects.concat(objList);
                        }
                    });
                    emits('loadedObjects', objects);
                }
            })
            .finally(() => {
                loading.value = false;
                mloading?.destroy();
            });
    };
    if (props.useInternal) {
        watch(
            () => props.selectObj,
            () => {
                console.log('props.selectObj: ', props.selectObj);
                cancelChartLoad?.abort();
                if (props.selectObj?.id) {
                    loadData();
                }
            },
            { immediate: true }
        );

        provide(idMapInfoCodesKey, idMapInfoCodes);
    }
    return { groupList, loading };
};
