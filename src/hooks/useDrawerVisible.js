export const drawerVisibleStateKey = Symbol('drawerVisibleState');
export const isHideExpandKey = Symbol('isHideExpand');

export default () => {
    const drawerVisibleState = ref([]);
    const isHideExpand = computed(() => {
        const res = drawerVisibleState?.value?.some(item => item?.visible);
        return res;
    });

    provide(drawerVisibleStateKey, drawerVisibleState);
    provide(isHideExpandKey, isHideExpand);

    return { drawerVisibleState, isHideExpand };
};
