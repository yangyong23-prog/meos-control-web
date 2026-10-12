import { Directive, DirectiveBinding } from 'vue';

interface ElementWithResizeObserver extends HTMLElement {
    __resizeObserver?: ResizeObserver;
}

const hideOnSmallWidth: Directive = {
    mounted(el: ElementWithResizeObserver, binding: DirectiveBinding) {
        let threshold = 30;
        // 获取绑定的值作为宽度阈值，如果没有传入则默认为30px
        if (binding.value && typeof binding.value === 'object') {
            threshold = binding.value.threshold || 30;
        }

        const updateVisibility = () => {
            const width = el.offsetWidth;
            if (width < threshold) {
                el.style.opacity = '0';
            } else {
                el.style.opacity = '1';
            }
        };

        updateVisibility();

        const resizeObserver = new ResizeObserver(() => {
            updateVisibility();
        });
        resizeObserver.observe(el);

        el.__resizeObserver = resizeObserver; // 将ResizeObserver实例存储在元素上，方便后续移除
    },
    unmounted(el: ElementWithResizeObserver) {
        const resizeObserver = el.__resizeObserver;
        if (resizeObserver) {
            resizeObserver.unobserve(el);
            resizeObserver.disconnect();
        }
    }
};

export default hideOnSmallWidth;
