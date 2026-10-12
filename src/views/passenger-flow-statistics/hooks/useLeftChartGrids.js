import { showModuleInfoInjectKey } from '../constant/injectKey';
import i18n from '@/localization';
export default () => {
    const showModuleInfo = inject(showModuleInfoInjectKey);
    const currentSpace = ref(null);
    // 空间客流图例
    const legendData = ref([
        {
            status: '1',
            name: i18n.global.t('meos_control_web.normal'),
            color: '#15AE55'
        },
        {
            status: '2',
            name: i18n.global.t('meos_control_web.abnormal'),
            color: '#F55047'
        }
    ]);

    // 点击当前空间
    const changePassengerFlow = item => {
        currentSpace.value = item;
    };
    watchEffect(() => {
        // 关闭弹框取消空间选中
        if (!showModuleInfo?.value) {
            currentSpace.value = null;
        }
    });
    provide('currentSpace', currentSpace);
    provide('legendData', legendData);
    return {
        changePassengerFlow
    };
};
