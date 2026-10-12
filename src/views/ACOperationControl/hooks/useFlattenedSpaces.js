import { ref, provide, onUnmounted } from 'vue';

// 拍平空间簇：建筑-楼层-空间静态树拍平后的列表与 id->空间 映射。
export const flattenedSpacesInjectKey = Symbol('flattenedSpaces');
export const flattenedSpacesMapInjectKey = Symbol('flattenedSpacesMap');

// 拍平空间 store：持有静态空间树拍平后的列表与映射，供状态计算与网格过滤读取。
export const useFlattenedSpaces = () => {
    const flattenedSpaces = ref([]);
    const flattenedSpacesMap = ref(new Map());

    provide(flattenedSpacesInjectKey, flattenedSpaces);
    provide(flattenedSpacesMapInjectKey, flattenedSpacesMap);

    onUnmounted(() => {
        flattenedSpaces.value = [];
        flattenedSpacesMap.value = new Map();
    });

    return {
        flattenedSpaces,
        flattenedSpacesMap
    };
};
