import { shellConfigQuery } from '@/apis/xshellConfiguration';
import { SUCCESSCODE } from '@/utils/globalVariables';
import { getItem } from '@/utils/storageUtils';
const QUERY_SCENE_NAME = 'graph';
const relationChartArrowGap = 'relationChartArrowGap';

const getValue = item => {
    const defaultVal = item.defaultValues;
    const val = item.shellConfigValue ?? item.value;
    return val === null || val === undefined || val === '' ? defaultVal : val;
};
export default () => {
    const openingThreshold = ref(30);
    const useFlowAnimation = ref(false);
    const flowShapeType = ref('DASH');
    const arrowGap = ref(75);

    const arrowGapStorageVal = getItem(relationChartArrowGap);
    arrowGap.value = arrowGapStorageVal || 75;

    let fetchAbortController = null;

    const queryShellConfig = async () => {
        fetchAbortController?.abort();
        fetchAbortController = new AbortController();
        const res = await shellConfigQuery({ scene: QUERY_SCENE_NAME }, fetchAbortController.signal).finally(() => {});

        if (res.code === SUCCESSCODE && Array.isArray(res.data)) {
            res.data?.forEach(dataItem => {
                dataItem.groups?.forEach(g => {
                    g.items?.forEach(item => {
                        if (item.code === 'graph_ele_open_threshold') {
                            openingThreshold.value = Number(getValue(item) ?? 0);
                        } else if (item.code === 'graph_eff_pipe_switch') {
                            useFlowAnimation.value = getValue(item) === 'show';
                        } else if (item.code === 'graph_eff_motion_type') {
                            flowShapeType.value = getValue(item) === 'antLine' ? 'DASH' : 'ARROW';
                        }
                    });
                });
            });
        }
    };

    return { openingThreshold, useFlowAnimation, flowShapeType, arrowGap, queryShellConfig };
};
