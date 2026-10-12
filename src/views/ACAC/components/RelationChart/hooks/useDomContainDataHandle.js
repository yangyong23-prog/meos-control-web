// @ts-ignore
import i18n from '@/localization';
import { ref, watch } from 'vue';

export default domDataRef => {
    const renderDomList = ref([]);

    watch(domDataRef, () => {
        renderDomList.value = domDataRef.value.map(item => {
            return {
                ...item,
                renderData: {} // 渲染数据
            };
        });
    });

    const clearDomList = () => {
        renderDomList.value = [];
    };

    return {
        renderDomList,
        clearDomList
    };
};
