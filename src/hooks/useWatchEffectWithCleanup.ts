import { onBeforeUnmount, watch, watchEffect } from 'vue';
import type { WatchEffect, WatchOptionsBase, WatchStopHandle } from 'vue';

export default function useWatchEffectWithCleanup(effect: WatchEffect, options?: WatchOptionsBase): WatchStopHandle {
    const stop = watchEffect(effect, options);
    onBeforeUnmount(() => {
        stop();
    });
    return stop;
}

export const useWatchWithCleanup: typeof watch = ((...args: Parameters<typeof watch>) => {
    const stop = watch(...args);
    onBeforeUnmount(() => {
        stop();
    });
    return stop;
}) as typeof watch;
