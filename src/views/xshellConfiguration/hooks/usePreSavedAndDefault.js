// @ts-ignore
import i18n from '@/localization';
import { isEqual } from 'lodash';
import emitter from '@/utils/bus';

export default (emit, formValidate) => {
    // onChange、onClear 所有变动的字段项
    const allModifyItems = ref([]);

    const checkFormItemModify = modifyItem => {
        const { id } = modifyItem || {};
        const cloneItem = structuredClone(modifyItem);
        const hasCache = allModifyItems.value.some(item => item?.id === id);
        if (hasCache) {
            const { curValue: preValue } = allModifyItems.value.find(item => item?.id === id) || {};
            if (preValue !== cloneItem?.curValue) {
                allModifyItems.value = allModifyItems.value.map(item => {
                    if (item?.id !== id) {
                        return item;
                    }
                    return cloneItem;
                });
            }
        } else {
            allModifyItems.value.push(cloneItem);
        }
    };

    const allNotDefaultItemIds = computed(() => {
        return allModifyItems.value.map(v => ({ id: v?.id, isNotDefault: v?.isNotDefault, curValue: v?.curValue, defaultValue: v?.defaultValue }));
    });

    watch(
        () => allNotDefaultItemIds.value,
        (curItem, preItem) => {
            if (isEqual(curItem, preItem)) {
                return;
            } else {
                const allItems = allModifyItems.value.filter(v => v?.isNotDefault);
                // 校验
                formValidate?.();
                if (allItems?.length) {
                    emit('defaultRestoreAll', true);
                } else {
                    emit('defaultRestoreAll', false);
                }
            }
        }
    );

    const allNotPreSavedItemIds = computed(() => {
        return allModifyItems.value.map(v => ({ id: v?.id, isNotPreSaved: v?.isNotPreSaved, curValue: v?.curValue, preSavedValue: v?.preSavedValue }));
    });

    watch(
        () => allNotPreSavedItemIds.value,
        (curItem, preItem) => {
            if (isEqual(curItem, preItem)) {
                return;
            } else {
                const allItems = allModifyItems.value.filter(v => v?.isNotPreSaved);
                // 校验
                formValidate?.();
                if (allItems?.length) {
                    emitter.emit('confirmDisabled', { status: false, isSave: true });
                } else {
                    emitter.emit('confirmDisabled', { status: true, isSave: true });
                }
            }
        }
    );

    return {
        checkFormItemModify,
        allModifyItems
    };
};
