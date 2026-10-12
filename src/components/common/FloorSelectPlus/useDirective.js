// @ts-ignore
import i18n from '@/localization';
const addOrRemoveEllipsis = el => {
    const isContentOverflow = el.scrollHeight > el.clientHeight;
    if (isContentOverflow) {
        if (!el.classList.contains('diy-ellipsis')) {
            el.parentElement.classList.add('diy-ellipsis');
        }
    } else {
        // 移除el的类
        el.parentElement.classList.remove('diy-ellipsis');
    }
};

export default () => {
    const vDiyEllipsis = {
        mounted: el => {
            addOrRemoveEllipsis(el);
            // 监听el宽度变化
            const resizeObserver = new ResizeObserver(entries => {
                if (entries.find(en => en.target === el)) addOrRemoveEllipsis(el);
            });
            resizeObserver.observe(el);
            el.__resizeObserver = resizeObserver;
        },
        updated: addOrRemoveEllipsis,
        unmounted: el => {
            el.__resizeObserver.unobserve(el);
        }
    };
    return {
        vDiyEllipsis
    };
};
