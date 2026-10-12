import i18n from '@/localization';
import { getCurrentInstance } from 'vue';
import { useRoute, useRouter } from 'vue-router';
// 访问vuex
export const useStore = () => {
    const vm = getCurrentInstance();
    if (!vm) throw new Error('must be called in setup');
    return vm.proxy.$store;
};

// 访问$set
export const useProxySet = () => {
    const vm = getCurrentInstance();
    if (!vm) throw new Error('must be called in setup');
    return vm.proxy.$set;
};

export const useContext = () => {
    const vm = getCurrentInstance();
    if (!vm) throw new Error('must be called in setup');
    return vm.proxy;
};

export { useRoute, useRouter };
