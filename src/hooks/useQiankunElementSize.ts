import { ref, watch, onMounted, onUnmounted, unref, type MaybeRef } from 'vue';

type MaybeElement = MaybeRef<HTMLElement | null | undefined>;

export function useQiankunElementSize(target: MaybeElement) {
    const width = ref(0);
    const height = ref(0);

    let observer: ResizeObserver | null = null,
        // 🔥 只加了这一行：防止循环报错
        ticking = false;

    function observe(el: HTMLElement | null | undefined) {
        cleanup();
        if (!el) return;

        try {
            const root = el.getRootNode() as Document | ShadowRoot;
            const RO = (root as any).ResizeObserver ?? window.ResizeObserver;

            observer = new RO((entries: ResizeObserverEntry[]) => {
                // 🔥 核心：防止 ResizeObserver 循环报错
                if (ticking) return;
                ticking = true;

                requestAnimationFrame(() => {
                    const rect = entries[0].contentRect;
                    width.value = rect.width;
                    height.value = rect.height;
                    ticking = false;
                });
            });

            if (observer) {
                observer.observe(el, {
                    box: 'content-box'
                });
            }
        } catch (err) {
            console.warn('useQiankunElementSize 监听失败', err);
        }
    }

    function cleanup() {
        if (observer) {
            observer.disconnect();
            observer = null;
        }
    }

    onMounted(() => {
        const el = unref(target);
        observe(el);
    });

    watch(
        () => unref(target),
        el => observe(el),
        { flush: 'post' }
    );

    onUnmounted(cleanup);

    return { width, height };
}
