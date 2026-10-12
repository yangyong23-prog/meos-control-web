import { IOTObject } from '@/views/operationMonitoring/types';
import { ref } from 'vue';
import i18n from '@/localization';

export const btnText = (item: IOTObject) => {
    if (item.dataSource) {
        if (item.dataValue) {
            return item.dataValue === '1' ? i18n.global.t('common.status_close') : i18n.global.t('common.status_open');
        }
        if (item.canOpen) {
            return i18n.global.t('common.status_open');
        }
        return '';
    }
    return i18n.global.t('meos_control_web.modify');
};
export const useControl = (emits?: any) => {
    const currentInfoCodeObject = ref<IOTObject | null>();
    const controlPopRef = ref<HTMLElement | null>(null);
    const showControlPop = ref(false);
    const controlTimePopRef = ref<HTMLElement | null>(null);
    const showControlTimePop = ref(false);
    const dataType: any = ref('');
    const hasPop = ref(false);
    const openControlPop = (e: { target: any }, item: IOTObject, type: any) => {
        // if (hasPop.value) {
        //     return;
        // }

        hasPop.value = true;
        controlPopRef.value = e.target;
        showControlPop.value = !showControlPop.value;
        currentInfoCodeObject.value = item;
        dataType.value = type;
        console.log(showControlPop.value);
    };
    const closeControlPop = (type: boolean) => {
        controlPopRef.value = null;
        showControlPop.value = false;
        currentInfoCodeObject.value = null;
        hasPop.value = false;
        emits('cancel', type);
    };
    const openControlTimePop = (e: { target: any }, item: IOTObject) => {
        if (hasPop.value) {
            return;
        }
        hasPop.value = true;
        controlTimePopRef.value = e.target;
        currentInfoCodeObject.value = item;
        showControlTimePop.value = true;
    };
    const closeControlTimePop = (type: boolean) => {
        controlTimePopRef.value = null;
        showControlTimePop.value = false;
        currentInfoCodeObject.value = null;
        hasPop.value = false;
        emits('cancel', type);
    };
    const clickEvent = (e: any, type: any) => {
        const dom = document.querySelector('.m-popover.m-popover-light');
        const isContains = dom?.contains(e.target);
        if (!type && !isContains) {
            showControlPop.value = false;
        }
    };
    return {
        currentInfoCodeObject,
        controlPopRef,
        showControlPop,
        controlTimePopRef,
        showControlTimePop,
        hasPop,
        openControlPop,
        closeControlPop,
        openControlTimePop,
        closeControlTimePop,
        dataType,
        clickEvent
    };
};
