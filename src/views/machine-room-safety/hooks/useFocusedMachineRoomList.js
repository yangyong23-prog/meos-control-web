import { queryInstanceWhiteList, saveInstanceWhiteList, queryTreeBuildingFloorDashboardSpaces } from '@/apis/public';
import { RUNNING_MONITOR_TYPE } from '../variable';
import { useFetchAbortController } from '@/hooks/useFetchAbortController';

export const focusedTreeKey = Symbol('focusedTreeKey');
export const focusedListKey = Symbol('focusedListKey');

export const useQueryFocusedData = config => {
    const {
        startRequest: queryFocusedTree,
        isLoading: queryFocusedTreeLoading,
        loadedData: focusedTree
    } = useFetchAbortController({
        request: queryTreeBuildingFloorDashboardSpaces,
        params: { runningMonitorType: RUNNING_MONITOR_TYPE, runningMonitorSecondType: RUNNING_MONITOR_TYPE },
        initData: []
    });
    const {
        startRequest: getFocusedList,
        isLoading: getFocusedListLoading,
        loadedData: focusedList
    } = useFetchAbortController({
        request: queryInstanceWhiteList,
        params: { runningMonitorType: RUNNING_MONITOR_TYPE, runningMonitorSecondType: RUNNING_MONITOR_TYPE, configType: 'WHITE_LIST', objectType: 'space' },
        initData: []
    });

    const { needProvide = true } = config || {};

    if (needProvide) {
        provide(focusedTreeKey, focusedTree);
        provide(focusedTreeKey, focusedList);
    }

    return { queryFocusedTree, queryFocusedTreeLoading, focusedTree, getFocusedList, getFocusedListLoading, focusedList };
};

export const useSubmitFocusedList = () => {
    const {
        startRequest: saveFocusedList,
        isLoading: submitLoading,
        loadedData: submitResponse,
        errorString
    } = useFetchAbortController({
        request: saveInstanceWhiteList,
        params: { runningMonitorType: RUNNING_MONITOR_TYPE, runningMonitorSecondType: RUNNING_MONITOR_TYPE, objectType: 'space', configType: 'WHITE_LIST' },
        initData: false
    });

    const submitFocusedList = instanceIds => saveFocusedList({ configData: instanceIds });
    return { submitLoading, submitFocusedList, submitResponse, errorString };
};
