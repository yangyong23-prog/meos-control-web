// @ts-ignore
import i18n from '@/localization';
import { useRoute } from 'vue-router';

export default () => {
    const route = useRoute();
    const isIndoorOutdoor = ref(true); //区分室内室外
    const headerModelView = ref('list'); //头部切换按钮显示
    watchEffect(() => {
        if (route.name === 'lightxplantrunmonitor') {
            isIndoorOutdoor.value = true;
            headerModelView.value = 'list';
        } else {
            isIndoorOutdoor.value = false;
            headerModelView.value = 'model';
        }
    });

    provide('isIndoorOutdoor', isIndoorOutdoor);
    provide('headerModelView', headerModelView);
    return {
        isIndoorOutdoor,
        headerModelView
    };
};
