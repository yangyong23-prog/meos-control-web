// src/utils/vueInstance.js
let globalVueInstance = null;

export const setGlobalVueInstance = instance => {
    globalVueInstance = instance;
};

export const getGlobalVueInstance = () => {
    return globalVueInstance;
};
