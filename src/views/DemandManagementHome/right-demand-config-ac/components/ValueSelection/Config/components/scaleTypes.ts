import { UseToNumberOptions } from '@vueuse/core';

export interface markNodes {
    id: string | number;
    value: string | number;
    left: string | number;
    isHover: boolean;
    isDown: boolean;
    disabled: boolean;
    tempFillRate: string | number | null;
    co2FillRate: string | number | null;
}
