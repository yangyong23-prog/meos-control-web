/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_DEV_MODE: string;
    readonly VITE_DEV_USER: string;
    readonly VITE_DEV_GROUPCODE: string;
    readonly VITE_DEV_PROJECTID: string;
    readonly VITE_ENV_vueDevTools: string;
    readonly U3D_ENV: string;
    // 更多环境变量...
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
