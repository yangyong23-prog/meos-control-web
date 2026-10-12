import UseCancelTokenHooks from '@/hooks/UseCancelTokenHooks';
import { Templates } from '@/components/HalfSectionView/constants/index';
import dataDockHandling from '@/hooks/dataDockHandling';
import { listInfoCodeConfigsByObjectIdCommon, listObjectsByTackValueLogic } from '@/apis/public';
import { judgePartVisible, flatGroupConfigItem, transformPartsInfos, getJSONObj } from '@/components/HalfSectionView/utils/index';
import UseHalfSectionConfigHooks from '@/hooks/UseHalfSectionConfigHooks';

import { HALF_VIEW_CLASSCODES, INFO_CODES_FOR_TEMPLATE, ACAHG, ACATAH, ACATFU } from '@/components/HalfSectionView/constants/config';
import useLoading from '@/hooks/useLoading';

export default (targetData, runningMonitorType, ACATAHHasACAHG, options = {}) => {
    const { force = false } = options;
    const { loadDynaDataWithIotHandling } = dataDockHandling();
    const { cancelToken: cancelStaticInfoToken, cancelQuest: cancelStaticInfoQuest } = UseCancelTokenHooks();
    const { cancelToken: cancelDynicInfoToken, cancelQuest: cancelDynicInfoQuest } = UseCancelTokenHooks();
    // 壳配置信息
    const { getHalfSectionConfig, isFromInstanceDetail, isFromDevice, ACAHGShow, ACATAHShow, ACATFUShow, ACAHGList, ACATAHList, ACATFUList } = UseHalfSectionConfigHooks();

    const { openLoading, closeLoading } = useLoading(
        'half-section-view-content',
        'transparent',
        'ball',
        {
            width: '100px',
            height: '100px'
        },
        0,
        {
            zIndex: 100
        }
    );
    const hasHalfSectionView = ref(false);
    const showHalfView = ref(false);

    const curStaticInfo = ref(null);
    const infoGroups = ref(null);
    const curTemplate = ref(null);

    const loadingStatic = ref(false);
    const loadingDync = ref(false);

    // 获取壳配置
    getHalfSectionConfig().then(() => {});

    // 获取部件信息点配置
    const partConfigInfos = computed(() => {
        const groups = unref(toRaw(infoGroups.value))?.find(group => group.groupCode === 'customComponents')?.groupChildren;
        groups?.forEach(item => {
            const arr = flatGroupConfigItem(item);
            item.flatConfigs = arr;
        });
        return groups;
    });

    //
    const relEquipsPartConfigInfos = computed(() => {
        const arr = [];
        const relInfoCodeConfigs = unref(toRaw(infoGroups.value))?.find(group => group.groupCode === 'relation')?.relInfoCodeConfigs;
        relInfoCodeConfigs?.forEach(item => {
            item?.dataValue?.forEach(obj => {
                const parts = obj.relInfoCodeGroupConfigs?.find(g => g.groupCode === 'customComponents')?.groupChildren;
                parts?.forEach(group => {
                    const _arr = flatGroupConfigItem(group);
                    group.flatConfigs = _arr;
                });
                obj.partInfos = parts ?? [];
                arr.push(obj);
            });
        });

        return arr;
    });

    /**
     * 判断是否在壳配置范围内
     * @param {*} equipData
     * @returns
     */
    const inHalfViewClassCodes = equipData => {
        return HALF_VIEW_CLASSCODES.includes(equipData?.classCode);
    };
    const findTemplate = info => {
        if (!info) {
            return null;
        }
        return Templates.find(template => Object.keys(template.rule).every(key => info[key] === template.rule[key]));
    };

    // 获取设备静态信息
    const getEquipStaticInfo = async () => {
        const params = {
            runningMonitorType: runningMonitorType,
            takeValueLogic: {
                queryParam: {
                    id: [targetData.value?.id],
                    classCode: [targetData.value.classCode],
                    withColumns: ['id', 'localName', 'classCode', ...INFO_CODES_FOR_TEMPLATE]
                }
            }
        };
        return listObjectsByTackValueLogic(params, { cancelToken: cancelStaticInfoToken() })
            .then(res => {
                // console.log('res:curStaticInfo ', res, curStaticInfo.value);
                curStaticInfo.value = res?.data?.find(item => {
                    return item.id === targetData.value?.id;
                });
            })
            .catch(error => {
                curStaticInfo.value = null;
            });
    };
    // 获取信息点模版配置数据
    const getTemplateInfoCodes = async id => {
        cancelDynicInfoQuest();
        loadingDync.value = false;
        // 获取模板信息编码
        const params = {
            templateCode: 'HALF_VIEW',
            objectIds: [id],
            runningMonitorType: runningMonitorType
        };
        try {
            loadingDync.value = true;
            const res = await loadDynaDataWithIotHandling(params, listInfoCodeConfigsByObjectIdCommon, undefined, { cancelToken: cancelDynicInfoToken() });
            const data = res?.data?.[0] || {};
            infoGroups.value = data.id === targetData.value?.id ? data.relInfoCodeGroupConfigs : null;
        } finally {
            // emits('loadFinally');
            loadingDync.value = false;
        }
    };

    // 准备模版数据
    const prepareTempalte = (originTemplate, partInfos, relEquipsParts) => {
        if (!originTemplate || !partInfos) return null;
        const _templateData = structuredClone(originTemplate);

        const basePartsDefine = [],
            relEquipPartsDefine = [];
        _templateData?.parts?.forEach(part => {
            if (part.isRelEquipment) {
                relEquipPartsDefine.push(part);
            } else {
                basePartsDefine.push(part);
            }
        });

        const partCodeMapInfos = partInfos.reduce((acc, item) => {
            acc[item.groupCode] = item;
            return acc;
        }, {});

        const baseParts = transformPartsInfos(basePartsDefine, partInfos, _templateData);

        const equipParts = relEquipsParts?.map(obj => {
            return {
                ...obj,
                parts: transformPartsInfos(relEquipPartsDefine, obj.partInfos, _templateData)
            };
        });

        _templateData.baseParts = baseParts;
        // console.log('equipParts: ', equipParts);
        _templateData.equipParts = equipParts;

        // 风口数据
        const _airOutletCards = [];
        _templateData?.airOutletCards?.forEach(item => {
            const infoList = [];
            const infos = partCodeMapInfos[item.code]?.flatConfigs;
            infos?.forEach(info => {
                if (info.infoCodeType === 'RWD_OBJECT_DETAIL') {
                    if (Array.isArray(info.dataValue)) {
                        info.dataValue?.forEach(obj => {
                            // 取第一个
                            const objInfoItem = obj.relInfoCodeGroupConfigs
                                ?.find(() => true)
                                ?.groupChildren?.find(() => true)
                                ?.relInfoCodeConfigs?.find(() => true);

                            const isShow = getJSONObj(objInfoItem?.showStyle)?.show;
                            if (isShow) {
                                infoList.push({ ...objInfoItem, name: `${obj.localName ?? '--'}${objInfoItem.infoCodeName}`, objectId: obj.id });
                            }
                        });
                    }
                } else {
                    if (info.showStyle?.show) {
                        infoList.push({ ...info, name: info.infoCodeName, objectId: targetData.value?.id });
                    }
                }
            });
            if (infoList.length > 0) {
                _airOutletCards.push({ ...item, infoList });
            }
        });

        _templateData.airOutletCards = _airOutletCards;

        return _templateData;
    };

    const getShellConfigConfigShowVal = classCode => {
        return classCode === ACATAH ? ACATAHShow.value : classCode === ACATFU ? ACATFUShow.value : classCode === ACAHG ? ACAHGShow.value : false;
    };
    const getShellConfigConfigIdList = classCode => {
        return classCode === ACATAH ? ACATAHList.value : classCode === ACATFU ? ACATFUList.value : classCode === ACAHG ? ACAHGList.value : [];
    };

    const shouldShowView = computed(() => {
        if (!inHalfViewClassCodes(targetData.value)) return false;
        // force：跳过壳配置开关、隐藏名单、控制组判断，仅保留 classCode 校验
        if (force) return true;
        const targetClassCode = targetData.value.classCode;
        const viewShow = getShellConfigConfigShowVal(targetClassCode);
        // console.trace('ACATAHShow.value: ', ACATAHShow.value);
        const hideIdList = getShellConfigConfigIdList(targetClassCode);

        if (!viewShow || hideIdList?.some(obj => obj?.id === targetData.value?.id) || ACATAHHasACAHG?.value) {
            return false;
        }
        return true;
    });

    // 监听目标数据变化、
    watch(
        [() => targetData?.value, () => shouldShowView.value],
        async () => {
            cancelStaticInfoQuest();
            showHalfView.value = false;

            if (!shouldShowView.value) return;
            if (targetData?.value?.id) {
                try {
                    loadingStatic.value = true;
                    curStaticInfo.value = null;
                    await getEquipStaticInfo();
                    await nextTick();
                    if (hasHalfSectionView.value && (force || isFromDevice.value)) {
                        // force：专用页面直接显示；否则如果壳配置：是从设备页面进入的，则直接显示
                        showHalfView.value = true;
                    }
                    // 查询配置的信息点
                    // test
                } catch (error) {
                    console.log(error);
                } finally {
                    loadingStatic.value = false;
                }
            }
        },
        { immediate: true }
    );

    const isLoading = computed(() => loadingStatic.value || loadingDync.value);
    // 监听加载状态
    watch(isLoading, async () => {
        if (isLoading.value) {
            openLoading();
        } else {
            closeLoading();
        }
    });

    watch(
        [() => targetData?.value?.id, () => shouldShowView.value, () => curStaticInfo.value],
        ([id, newShouldShowView, newCurStaticInfo], [oldId, oldShouldShowView, oldCurStaticInfo]) => {
            // const isIdChange = id !== oldId;
            // const isShouldShowViewChange = newShouldShowView !== oldShouldShowView;
            // const isCurStaticInfoChange = newCurStaticInfo?.id !== oldCurStaticInfo?.id;

            if (id && newShouldShowView && newCurStaticInfo) {
                infoGroups.value = null;

                // console.trace('shouldShowView.value: ', shouldShowView.value);
                // 监听静态信息加载完成
                if (targetData?.value?.id && shouldShowView.value && curStaticInfo.value) {
                    // TODO 判断壳配置
                    //
                    const templateData = findTemplate(curStaticInfo.value);
                    // console.log('templateData: ', templateData);
                    if (templateData) {
                        getTemplateInfoCodes(targetData.value.id);
                        hasHalfSectionView.value = true;
                    }

                    return;
                }
            }
            curTemplate.value = null;
            hasHalfSectionView.value = false;
        },
        { immediate: true }
    );

    // 监听，计算当前模版数据
    watchEffect(() => {
        const templateData = findTemplate(curStaticInfo.value);
        // console.log('curStaticInfo.value: ', curStaticInfo.value, templateData, partConfigInfos.value);
        if (!templateData || !partConfigInfos.value) {
            curTemplate.value = null;
            return;
        }
        curTemplate.value = hasHalfSectionView.value ? prepareTempalte(templateData, partConfigInfos.value, relEquipsPartConfigInfos.value) : null;
    });

    return { showHalfView, hasHalfSectionView, infoGroups, curTemplate, isLoading, inHalfViewClassCodes, curStaticInfo };
};
