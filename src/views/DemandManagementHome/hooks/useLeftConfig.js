import i18n from '@/localization';
import { listConfigGroups } from '@/apis/DemandManagementHomeNew';
import {
    isAcAddKey,
    isAcEditKey,
    treeLoadingKey,
    leftTreeListKey,
    isChangeConfigKey,
    currentConfigObjKey,
    currentConfigItemKey,
    currentPreviousObjKey,
    leftTreeRemoveCurrentIdsKey,
    formDirtyCheckKey,
    confirmModalKey,
    scrollbarLeftRefKey
} from './useAcCommon';
import { templateTagInjectKey } from '../constant/injectKey';
import useStore from '@/store';
export const objectTypeObjKey = Symbol('objectTypeObjKey'); // 当前类型的tag属性
export default () => {
    const { base } = useStore();
    const templateType = inject('templateType');
    const scrollbarLeftRef = inject(scrollbarLeftRefKey);
    const currentConfigObj = inject(currentConfigObjKey);
    const currentConfigItem = inject(currentConfigItemKey);
    const currentPreviousObj = inject(currentPreviousObjKey);
    const leftTreeList = inject(leftTreeListKey);
    const templateTag = inject(templateTagInjectKey);
    const treeLoading = inject(treeLoadingKey);
    const leftTreeRemoveCurrentIds = inject(leftTreeRemoveCurrentIdsKey);
    const isAcEdit = inject(isAcEditKey);
    const isAcAdd = inject(isAcAddKey);
    const isChangeConfig = inject(isChangeConfigKey);
    const currentParent = ref({});
    const currentItem = ref({});
    const confirmModal = inject(confirmModalKey);
    const objectTypeObj = {
        PROJECT: [i18n.global.t('meos_control_web.global'), '#D72824', '#FFE6E5'],
        BUILDING: [i18n.global.t('meos_control_web.building'), '#E68600', '#FFF0CC'],
        FLOOR: [i18n.global.t('meos_control_web.floor'), '#1B4ACC', '#D9EBFF'],
        ROOM_FUNC_TYPE: [i18n.global.t('meos_control_web.space_type'), '#683BD6', '#F1E5FE'],
        SPACE: [i18n.global.t('meos_control_web.space_object'), '#1B2129', '#E8ECF0']
    };
    // 定义排序顺序
    const sortOrder = ['PROJECT', 'BUILDING', 'FLOOR', 'ROOM_FUNC_TYPE', 'SPACE'];

    const fetchAbortController = ref();
    const formatterTree = data => {
        const treeMap = {}; // 用于存储树节点

        // 遍历数据，按 objectType 分组
        data.forEach(item => {
            if (!treeMap[item.objectType]) {
                // 如果该 objectType 的节点不存在，则创建
                treeMap[item.objectType] = {
                    open: true,
                    objectType: item.objectType,
                    relInstanceIds: [],
                    children: []
                };
            }
            const instanceIds = item.relInstances.map(e => e.instanceId);
            treeMap[item.objectType].relInstanceIds.push(...instanceIds);
            const relInstances = item.relInstances || [];
            const relInstanceIds = relInstances.length > 0 ? relInstances.map(e => e.instanceId) : [];
            let instanceNames = '';
            if (relInstances.length > 0) {
                const result = Object.groupBy(relInstances, ({ buildingName }) => buildingName);
                const arr = Object.entries(result)?.map(([key, v]) => {
                    if (key === 'undefined') {
                        return `${v.map(obj => obj.instanceName).join('、')}`;
                    } else {
                        return `${v.map(obj => obj.instanceName).join('/')}(${key})`;
                    }
                });
                instanceNames = arr.join('、');
            } else {
                instanceNames = '';
            }
            // console.log(a,result, 'placeholder')
            // 将当前 item 添加到对应 objectType 的 children 中
            if (item.groupName) {
                treeMap[item.objectType].children.push({
                    ...item,
                    relInstances,
                    relInstanceIds,
                    instanceNames,
                    objectType: item.objectType,
                    groupId: item.groupId,
                    groupName: item.objectType === 'PROJECT' ? i18n.global.t('meos_control_web.global_configuration') : item.groupName
                });
                // 按 createTime 倒序排序 children 数组
                treeMap[item.objectType].children.sort((a, b) => {
                    const timeA = a.createTime ? new Date(a.createTime) : new Date(0);
                    const timeB = b.createTime ? new Date(b.createTime) : new Date(0);
                    return timeB - timeA; // 倒序排序
                });
            }
        });
        // 将 treeMap 转换为数组形式并排序
        return Object.values(treeMap).sort((a, b) => {
            return sortOrder.indexOf(a.objectType) - sortOrder.indexOf(b.objectType);
        });
    };
    const findParentByInstanceId = (list, id) => {
        for (const item of list) {
            if (item.children.some(child => child.groupId === id)) {
                return item;
            }
        }
        return null;
    };
    const queryListConfigGroups = id => {
        treeLoading.value = true;
        leftTreeList.value = [
            {
                groupName: i18n.global.t('meos_control_web.global_configuration'),
                objectType: 'PROJECT',
                relInstances: [
                    {
                        instanceType: 'PROJECT',
                        instanceId: base.projectId,
                        instanceName: base.projectName
                    }
                ]
            }
        ];
        fetchAbortController.value?.abort();
        fetchAbortController.value = new AbortController();

        const params = {
            templateType: templateType?.value,
            templateTag: templateTag?.value
        };

        listConfigGroups(params, fetchAbortController.value.signal).then(res => {
            try {
                const { result, data } = res;
                if (result !== 'success') return;
                if (Array.isArray(data)) {
                    const defaultGlobalData = [
                        {
                            groupName: i18n.global.t('meos_control_web.global_configuration'),
                            objectType: 'PROJECT',
                            relInstances: [
                                {
                                    instanceType: 'PROJECT',
                                    instanceId: base.projectId,
                                    instanceName: base.projectName
                                }
                            ]
                        }
                    ];
                    const finalData = data?.length ? (data?.some(v => v?.objectType === 'PROJECT') ? data : [...defaultGlobalData, ...data]) : defaultGlobalData;
                    leftTreeList.value = formatterTree(finalData);
                    if (!id) {
                        const filteredItems = leftTreeList.value?.filter(item => item.objectType === sortOrder[0])?.length
                            ? leftTreeList.value?.filter(item => item.objectType === sortOrder[0])
                            : leftTreeList.value;
                        currentPreviousObj.value = filteredItems?.[0] || {};
                        currentConfigObj.value = filteredItems?.[0] || {};
                        currentConfigItem.value = filteredItems?.[0]?.children?.[0] || {};
                    } else {
                        const parentItem = findParentByInstanceId(leftTreeList.value, id);
                        if (parentItem) {
                            currentPreviousObj.value = parentItem;
                            currentConfigObj.value = parentItem;
                            currentConfigItem.value = parentItem.children.find(child => child.groupId === id) || {};
                        } else {
                            // 黑名单过滤了空间，若分组id找不到，则默认选中第一个
                            const filteredItems = leftTreeList.value?.filter(item => item.objectType === sortOrder[0])?.length
                                ? leftTreeList.value?.filter(item => item.objectType === sortOrder[0])
                                : leftTreeList.value;
                            currentPreviousObj.value = filteredItems?.[0] || {};
                            currentConfigObj.value = filteredItems?.[0] || {};
                            currentConfigItem.value = filteredItems?.[0]?.children?.[0] || {};
                        }
                    }
                    const configChildren = currentConfigObj.value.children;
                    const { value: configItemValue } = currentConfigItem;
                    if (!configItemValue) return;
                    const filteredInstanceIds = configChildren
                        .filter(y => y.objectType === configItemValue.objectType && y.groupName !== configItemValue.groupName)
                        .flatMap(y => (Array.isArray(y.relInstances) ? y.relInstances.map(w => w.instanceId) : []));

                    leftTreeRemoveCurrentIds.value.push(...filteredInstanceIds);
                } else {
                    leftTreeList.value = [];
                    currentPreviousObj.value = {};
                    currentConfigObj.value = {};
                    currentConfigItem.value = {};
                }
                treeLoading.value = false;
            } catch (error) {
                treeLoading.value = false;
            }
            nextTick(() => {
                const activeItems = document.querySelectorAll('.activeItem');
                const isActiveItems = document.querySelectorAll('.isActive');
                const rectChild = activeItems[0].getBoundingClientRect();
                const offsetTopChild = rectChild.top + window.scrollY;
                const rectParent = isActiveItems[0].getBoundingClientRect();
                const offsetHeightParent = isActiveItems[0].offsetHeight;
                const offsetTopParent = rectParent.top + window.scrollY;
                let viewportHeight = window.innerHeight,
                    height = 0;

                if (viewportHeight - 100 > offsetTopChild) {
                    height = 0;
                } else {
                    if (offsetHeightParent > viewportHeight) {
                        height = offsetTopChild - (offsetHeightParent - viewportHeight);
                    } else {
                        height = offsetTopParent - 40;
                    }
                }
                scrollbarLeftRef.value.setScrollTop(height);
            });
        });
    };

    const formatterChange = (item, child) => {
        leftTreeRemoveCurrentIds.value = [];
        currentConfigObj.value = item;
        currentPreviousObj.value = item;
        currentConfigItem.value = child;
        isAcEdit.value = false;
        isAcAdd.value = false;
        const configChildren = currentConfigObj.value.children;
        const { value: configItemValue } = currentConfigItem;
        if (!configItemValue) return;
        const filteredInstanceIds = configChildren
            .filter(y => y.objectType === configItemValue?.objectType && y.groupName !== configItemValue.groupName)
            .flatMap(y => (Array.isArray(y.relInstances) ? y.relInstances.map(w => w.instanceId) : []));

        leftTreeRemoveCurrentIds.value.push(...filteredInstanceIds);
    };

    const formDirtyCheck = inject(formDirtyCheckKey);

    const leaveDirectly = () => {
        formatterChange(currentParent.value, currentItem.value);
        confirmModal.value = false;
        isChangeConfig.value = false;
    };
    const changeList = async (item, child) => {
        const isAddOrEdit = isAcEdit.value || isAcAdd.value;
        if (isAddOrEdit) {
            const isDirty = await formDirtyCheck.value?.check?.();
            isChangeConfig.value = isDirty;
            if (isDirty) {
                formDirtyCheck.value.linkToGroupId = child?.groupId || '';
            }
        }
        if (isChangeConfig?.value) {
            currentParent.value = item;
            currentItem.value = child;
            confirmModal.value = true;
        } else {
            formatterChange(item, child);
        }
    };

    const resetModalState = () => {
        confirmModal.value = false;
        isChangeConfig.value = false;
        formDirtyCheck.value = {
            check: async () => Promise.resolve(false)
        };
    };

    watch(
        () => templateTag.value,
        () => {
            resetModalState();
            queryListConfigGroups();
        },
        {
            immediate: true
        }
    );

    provide(objectTypeObjKey, objectTypeObj);
    return { leftTreeList, queryListConfigGroups, leaveDirectly, changeList };
};
