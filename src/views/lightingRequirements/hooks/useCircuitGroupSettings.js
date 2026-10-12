// @ts-ignore
import i18n from '@/localization';
import { $Message } from 'meri-plus';
import { SMD_ALL_OPEN, SMD_ALL_CLOSE, SMD_PARTIAL_OPEN, NOT_CONFIGURED } from '../constants';
import { allStatisticsInjectKey, hasGroupSettingsChangeInjectKey } from './useFunctypeConfigEdit';

export const useCircuitGroupSettings = (curFuncTypeObj, curControlledObjType, showCircuitModal, unionSetting, showCloseCircuitConfirm) => {
    const configRadioOptions = ref([
        {
            label: i18n.global.t('meos_control_web.group_config'),
            value: 'group'
        },
        {
            label: i18n.global.t('meos_control_web.loop_configuration'),
            value: 'loop'
        }
    ]);
    const curConfigRadio = ref('group');
    const curGroupList = ref([]);
    const hasGroupSettingsChange = inject(hasGroupSettingsChangeInjectKey);
    const allStatistics = inject(allStatisticsInjectKey);
    const templateType = inject('templateType');

    watch(
        () => curFuncTypeObj?.value,
        (curObj, preObj) => {
            if (preObj?.funcType && curObj?.funcType !== preObj?.funcType) {
                curGroupList.value = [];
            }
            // 如果是空间或非公区/停车场，则无编组配置
            const isPublicOrPartLot = ['PUBLIC_AREA_LIGHTING', 'PARKING_LOT_LIGHTING'].includes(templateType?.value);
            if (curControlledObjType.value === 'SPACE' || !isPublicOrPartLot) {
                curConfigRadio.value = 'loop';
                configRadioOptions.value = configRadioOptions.value.map(s => ({ ...s, disabled: s.value === 'group' }));
                return;
            }
            // 缓存的上次单选配置
            if (curObj?.radioConfig) {
                curConfigRadio.value = curObj.radioConfig;
                return;
            }
            // 点击部分开启后，如果未进行配置，默认选中「编组」，如果已经进行了配置，以配置回显为准
            if (curObj?.settingMode === NOT_CONFIGURED) {
                curConfigRadio.value = 'group';
            } else if (curObj?.circuitGroupSettings?.length) {
                // 二次弹窗确认后，打开部分开启弹窗，确认默认选中项
                if (configRadioOptions.value?.find(s => s?.defaultSelected)) {
                    const defaultSelected = configRadioOptions.value?.find(s => s?.defaultSelected)?.value;
                    curFuncTypeObj.value.radioConfig = defaultSelected;
                    curConfigRadio.value = defaultSelected;
                    configRadioOptions.value = configRadioOptions.value.map(s => ({ ...s, defaultSelected: undefined }));
                } else {
                    curConfigRadio.value = 'group';
                }
            } else if (curObj?.circuitSettings?.length) {
                curConfigRadio.value = 'loop';
            } else {
                curConfigRadio.value = 'group';
            }
        },
        {
            immediate: true
        }
    );

    const resetLastSavedGroup = () => {
        curGroupList.value.forEach(obj => {
            obj.settingMode = obj.lastSavedMode;
        });
    };

    const closeGroupModal = () => {
        const newGroup = curGroupList.value.map(v => ({ groupId: v?.id, settingMode: v?.settingMode ?? NOT_CONFIGURED }))?.filter(s => s.settingMode !== NOT_CONFIGURED);
        const lastGroup = curFuncTypeObj.value?.circuitGroupSettings || [];

        const hasLoopConfig = curFuncTypeObj.value?.circuitSettings?.some(s => (s?.lastSavedMode ?? NOT_CONFIGURED) !== NOT_CONFIGURED);
        // 之前未配置组，则弹窗确认，转为回路配置
        if (!newGroup.length && hasLoopConfig) {
            showCloseCircuitConfirm.value = true;
            return;
        }

        if (hasGroupSettingsChange(newGroup, lastGroup)) {
            showCloseCircuitConfirm.value = true;
        } else {
            const preRadio = curFuncTypeObj.value?.radioConfig;
            if (preRadio === 'loop') {
                curConfigRadio.value = 'loop';
                curFuncTypeObj.value.radioConfig = 'loop';
            }
            showCircuitModal.value = false;
        }
    };

    const saveGroupSetting = () => {
        const currentGroups = curGroupList.value || [];
        const currentFuncType = curFuncTypeObj.value;

        const configuredGroups = currentGroups.filter(item => item.settingMode && item.settingMode !== NOT_CONFIGURED);

        if (configuredGroups.length === 0) {
            const errorMsg = currentGroups.length === 0 ? i18n.global.t('meos_control_web.no_available_group') : i18n.global.t('meos_control_web.no_group_configured');
            $Message.error({ title: errorMsg, duration: 1500 });
            return;
        }

        const circuitMap = new Map();
        let hasDuplicates = false,
            openCount = 0,
            noCount = 0;
        for (const group of configuredGroups) {
            for (const circuit of group.relObjects || []) {
                const circuitId = circuit.id;
                if (circuitMap.has(circuitId)) {
                    hasDuplicates = true;
                    break;
                }
                circuitMap.set(circuitId, {
                    ...circuit,
                    settingMode: group.settingMode
                });
            }
            if (hasDuplicates) break;
        }

        // 点击保存时，如果编组内有相同的回路已操作(全开或者全关都可以），则点击保存进行报错提示：
        if (hasDuplicates) {
            $Message.error({ title: i18n.global.t('meos_control_web.duplicate_loop_in_group_check'), duration: 1500 });
            return;
        }

        // 更新当前配置对象的回路数据
        const circuitSettings = currentFuncType?.circuitSettings || [];
        for (const circuit of circuitSettings) {
            const circuitInfo = circuitMap.get(circuit.circuitId);
            // 当前编组未找到对应的回路，则该回路置为未配置
            if (!circuitInfo) {
                noCount++;
                continue;
            }

            if (circuitInfo.settingMode === SMD_ALL_OPEN) {
                openCount++;
            } else if (circuitInfo.settingMode !== SMD_ALL_CLOSE) {
                noCount++;
            }
        }

        currentFuncType.radioConfig = 'group';
        currentFuncType.circuitGroupSettings = configuredGroups.map(item => ({
            groupId: item.id,
            settingMode: item.settingMode
        }));
        currentGroups.forEach(obj => {
            obj.lastSavedMode = obj?.settingMode ?? NOT_CONFIGURED;
            // 记录编组匹配的回路ids
            const relIds = obj?.relObjects?.map(s => s.id) || [];
            const matchRelIds = circuitSettings.filter(s => relIds.includes(s.circuitId)).map(s => s.circuitId);
            obj.matchRelIds = matchRelIds;
        });
        currentFuncType.savedGroupSettings = currentGroups;

        currentFuncType.openCount = openCount;
        currentFuncType.noCount = noCount;
        currentFuncType.settingMode = SMD_PARTIAL_OPEN;

        showCircuitModal.value = false;

        // 更新全局配置下的所有配置对象的回路数据
        if (allStatistics.value) {
            const { total, openCount: currentOpen, noCount: currentNo } = currentFuncType;
            const otherStats = unionSetting.value
                .filter(ft => ft.id !== currentFuncType.id)
                .reduce(
                    (acc, ft) => {
                        acc.total += ft.total;
                        acc.openCount += ft.openCount;
                        acc.noCount += ft.noCount;
                        return acc;
                    },
                    { total: 0, openCount: 0, noCount: 0 }
                );

            allStatistics.value.total = otherStats.total + total;
            allStatistics.value.openCount = otherStats.openCount + currentOpen;
            allStatistics.value.noCount = otherStats.noCount + currentNo;
        }
    };

    return {
        configRadioOptions,
        curConfigRadio,
        curGroupList,
        resetLastSavedGroup,
        saveGroupSetting,
        closeGroupModal
    };
};
