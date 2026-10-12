import i18n from '@/localization';
/**
 * useEffectWarp
 * 副作用容器
 * 可动态批量创建 副作用
 */

import { effectScope } from 'vue';

export default () => {
    let scope = null;

    const destoryEffect = () => {
        scope?.stop();
        scope = null;
    };

    const createEffect = effectFun => {
        destoryEffect();
        scope = effectScope();
        scope.run(() => {
            effectFun();
        });
    };

    return {
        createEffect,
        destoryEffect
    };
};
