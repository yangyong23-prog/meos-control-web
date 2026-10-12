import i18n from '@/localization';
import { useResizeObserver } from '@vueuse/core';
/**
 * 根据DOM元素宽度和配置选项动态调整网格布局列数
 * @param {Object} dom - Vue ref对象，指向需要监听尺寸变化的DOM元素
 * @param {Array} options - 响应式布局配置数组，包含maxWidth(最大宽度)和span(列数)等属性
 * @returns {Object} 返回包含响应式style对象的ref，用于绑定到组件样式
 */
export const useBreakpointAdaptation = (dom, getOptions) => {
    const style = ref({});

    /**
     * 根据当前DOM宽度计算并更新网格列数样式
     * 1. 获取匹配当前宽度的配置项（不超过maxWidth）
     * 2. 若无匹配则使用default标记的默认配置
     * 3. 生成grid-template-columns样式规则
     */
    const updateStyle = () => {
        const width = dom.value ? dom.value.offsetWidth : 0;
        const defaultOption = getOptions().find(option => option.default);
        const matchedOption = getOptions().find(option => option.maxWidth && width <= option.maxWidth) || defaultOption;
        style.value = {
            'grid-template-columns': `repeat(${matchedOption.span}, minmax(0, 1fr))`
        };
    };

    // 初始化DOM尺寸监听，并在组件卸载时停止监听
    let resizeObserver;
    onUnmounted(() => resizeObserver?.stop?.());
    onMounted(() => {
        resizeObserver = useResizeObserver(dom, updateStyle);
    });

    return { style };
};
