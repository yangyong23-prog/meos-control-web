/**
 * opt W2：页面里读取当前项目的运行标准模式（B1），带缓存，见 src/apis/standards.js loadStandardsMode。
 */
import { computed, watch } from 'vue';
import baseStore from '@/store/baseStore';
import { loadStandardsMode } from '@/apis/standards';
import { isStandardsReadonly, isStandardsMode, READONLY_MESSAGE } from '@/utils/opt/standardsModeState';

export default function useStandardsMode() {
    const store = baseStore();
    const projectId = computed(() => store.projectId);
    watch(projectId, id => loadStandardsMode(id), { immediate: true });
    const readOnly = computed(() => isStandardsReadonly(projectId.value));
    const standardMode = computed(() => isStandardsMode(projectId.value));
    return { readOnly, standardMode, readonlyMessage: READONLY_MESSAGE };
}
