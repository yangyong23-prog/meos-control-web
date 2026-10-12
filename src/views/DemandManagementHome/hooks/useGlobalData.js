// @ts-ignore
import i18n from '@/localization';
// 全局数据hook
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import {
    templateDemandTypeInjectKey,
    showModuleInfoInjectKey,
    runningMonitorTypeInjectKey,
    rightConfigExpandDisabledTxtInjectKey,
    rightConfigExpandInjectKey
} from '../constant/injectKey';
import {
    routeParamsTypeToDemandTypeMap,
    isHideLeftFooter,
    isHideLeftMenus,
    isHideLeftBlackList,
    isHideLeftShieldList,
    isRightConfigExpandEnable,
    isLeftTreeDragEnable
} from '../constant/config';

/* 模板管理-右侧按钮 */

// 是否展示屏蔽空间弹窗
export const shieldListDataKey = Symbol('shieldListDataKey');
export const showShieldListModalKey = Symbol('showShieldListModalKey');
// 是否展示黑名单弹窗
export const blackListDataKey = Symbol('blackListDataKey');
export const showBlackListModalKey = Symbol('showBlackListModalKey');
// 是否禁用右侧header按钮
export const isDisableRightHeaderBtnsKey = Symbol('isDisableRightHeaderBtnsKey');

export default () => {
    const route = useRoute();

    const routeParamsType = computed(() => {
        return route.params.type;
    });

    const templateDemandType = ref();
    const runningMonitorType = ref('');
    const hideLeftFooter = ref(false);
    const hideLeftMenus = ref(false);
    const hideLeftBlackList = ref(false);
    const hideLeftShieldList = ref(false);
    const leftTreeDragEnable = ref(false);
    const rightConfigExpandEnable = ref(false);

    const showModuleInfo = ref(false);

    const rightConfigExpand = ref(true);
    const rightConfigExpandDisabledTxt = ref('');

    watchEffect(() => {
        const res = routeParamsTypeToDemandTypeMap[routeParamsType.value];
        if (res) {
            templateDemandType.value = res;
            runningMonitorType.value = res;
            hideLeftFooter.value = isHideLeftFooter(res);
            hideLeftMenus.value = isHideLeftMenus(res);
            hideLeftBlackList.value = isHideLeftBlackList(res);
            hideLeftShieldList.value = isHideLeftShieldList(res);
            leftTreeDragEnable.value = isLeftTreeDragEnable(res);
            rightConfigExpandEnable.value = isRightConfigExpandEnable(res);
        }
    });

    const shieldListData = ref([]);
    const showShieldListModal = ref(false);

    const blackListData = ref([]);
    const showBlackListModal = ref(false);

    const isDisableRightHeaderBtns = ref(false);

    // 复制模板弹窗
    const showCopyModal = ref(false);

    provide(shieldListDataKey, shieldListData);
    provide(showShieldListModalKey, showShieldListModal);
    provide(blackListDataKey, blackListData);
    provide(showBlackListModalKey, showBlackListModal);
    provide(isDisableRightHeaderBtnsKey, isDisableRightHeaderBtns);

    provide(templateDemandTypeInjectKey, templateDemandType);
    provide(runningMonitorTypeInjectKey, runningMonitorType);
    provide(showModuleInfoInjectKey, showModuleInfo);
    provide(rightConfigExpandDisabledTxtInjectKey, rightConfigExpandDisabledTxt);
    provide(rightConfigExpandInjectKey, rightConfigExpand);

    return {
        templateDemandType,
        hideLeftFooter,
        hideLeftMenus,
        hideLeftBlackList,
        hideLeftShieldList,
        leftTreeDragEnable,
        rightConfigExpandEnable,
        rightConfigExpandDisabledTxt,
        rightConfigExpand,
        showShieldListModal,
        showBlackListModal,
        showCopyModal,
        isDisableRightHeaderBtns
    };
};
