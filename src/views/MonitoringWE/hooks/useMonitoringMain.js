import i18n from '@/localization';
import { closeDetailDrawerInjectKey } from './useDrawerCommon';

export default treeGraph => {
    const closeDetailDrawerInject = inject(closeDetailDrawerInjectKey);
    // 1:1大小
    const toTransformToRealSize = () => {
        treeGraph.value.set1To1Size();
        closeDetailDrawerInject();
    };
    // 恢复默认
    const toRestoreDefault = () => {
        treeGraph.value.setDefault();
        closeDetailDrawerInject();
    };
    const handleKeyDown = event => {
        // 检测是否按下了 Alt+0
        if (event.altKey && event.keyCode === 48) {
            toTransformToRealSize();
        }
        // 检测是否按下了 Alt+R
        if (event.altKey && event.keyCode === 82) {
            toRestoreDefault();
        }
    };

    onMounted(() => {
        // 监听全局键盘事件
        window.addEventListener('keydown', handleKeyDown);
    });
    onBeforeUnmount(() => {
        // 移除事件监听，避免内存泄漏
        window.removeEventListener('keydown', handleKeyDown);
    });
    return { toTransformToRealSize, toRestoreDefault };
};
