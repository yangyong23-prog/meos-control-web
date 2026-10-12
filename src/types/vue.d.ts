import '@vue/runtime-core';

declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
        $drawerAppendTo: string | HTMLElement;
        $modalAppendTo: string;
    }
}

export {};
