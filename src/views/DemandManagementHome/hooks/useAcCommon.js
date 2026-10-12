// @ts-ignore
import i18n from '@/localization';
import useLoading from '@/hooks/useLoading';
import emitter from '@/utils/bus';
import { useRouter, useRoute } from 'vue-router';
import dayjs from 'dayjs';
import { templateTagInjectKey } from '../constant/injectKey';
import { isDisableRightHeaderBtnsKey } from './useGlobalData';
import { dayjsIsAfter } from '@/utils/dayjsTools';
import { getDayjsTz } from '@/utils/globalVariables';

export const isAcEditKey = Symbol('isAcEditKey'); // 右侧区域状态 true 编辑 false 预览
export const isAcAddKey = Symbol('isAcAddKey'); // 右侧区域状态 true 新增
export const currentConfigObjKey = Symbol('currentConfigObjKey'); // 当前配置分类对象
export const currentConfigItemKey = Symbol('currentConfigItemKey'); // 当前选中对象
export const currentPreviousObjKey = Symbol('currentPreviousObjKey');
export const leftTreeListKey = Symbol('leftTreeListKey'); // 左侧树形结构数据
export const leftTreeRemoveCurrentIdsKey = Symbol('leftTreeRemoveCurrentIdsKey'); // 左侧树形结构数据除去当前被选择对象id
export const treeLoadingKey = Symbol('treeLoadingKey');
export const hideRemoveButtonKey = Symbol('hideRemoveButtonKey');
export const isLoadingConfigInfoKey = Symbol('isLoadingConfigInfoKey');
export const scrollbarLeftRefKey = Symbol('scrollbarLeftRefKey'); // 左侧滚动条对象
export const isChangeConfigKey = Symbol('isChangeConfigKey'); // 配置是否修改过
export const formDirtyCheckKey = Symbol('formDirtyCheckKey'); // 表单是否修改过
export const confirmModalKey = Symbol('confirmModalKey'); // 二次弹框
export const isProjectShowRHKey = Symbol('isProjectShowRHKey'); // 项目是否启用湿度配置
export const isProjectShowPressureDiffKey = Symbol('isProjectShowPressureDiffKey'); // 项目是否启用压差配置

export default () => {
    // const { openLoading, closeLoading } = useLoading('ac-container-right-bottom', '#fff', 'ball');
    // openLoading();
    // setTimeout(() => {
    //     closeLoading();
    // }, 2000);
    const isDisableRightHeaderBtns = inject(isDisableRightHeaderBtnsKey);
    const isHideTemplateManage = ref(false);
    const route = useRoute();
    const templateTag = inject(templateTagInjectKey);
    const isAcEdit = ref(false);
    const isAcAdd = ref(false);
    const currentConfigObj = ref({});
    const currentConfigItem = ref({});
    const scrollbarLeftRef = ref();
    const leftRef = ref();
    // 左侧分组是否加载中
    const treeLoading = ref(true);
    // 右侧配置是否加载中
    const isLoadingConfigInfo = ref(false);
    const hideRemoveButton = ref(false);
    const listLoading = computed(() => {
        return treeLoading?.value || isLoadingConfigInfo?.value;
    });
    // 右侧表单是否修改过
    const formDirtyCheck = ref({
        check: async () => Promise.resolve(false),
        linkToGroupId: '',
        submit: () => {}
    });
    const confirmModal = ref(false);

    // 刷新左侧树接口
    const refreshLeftList = id => {
        leftRef?.value?.queryListConfigGroups(id);
    };
    // 编辑
    const changeStatus = () => {
        isAcEdit.value = true;
    };
    const addStatus = () => {
        isAcAdd.value = true;
        // showSelect.value = false;
        currentConfigObj.value = {
            objectType: 'special',
            objectName: i18n.global.t('meos_control_web.add_special_config')
        };
        nextTick(() => {
            scrollbarLeftRef.value?.setScrollTop('end');
        });
    };
    const onDefault = () => {
        emitter.emit('onRecoverDefault');
    };
    const onDel = () => {
        const delItem = currentConfigItem.value;
        emitter.emit('removeConfigConfirm', { delItem });
    };
    watch(
        () => templateTag.value,
        () => {
            isAcAdd.value = false;
            isAcEdit.value = false;
        },
        {
            immediate: true
        }
    );

    watch(
        [isAcAdd, isAcEdit],
        ([curAdd, curEdit]) => {
            isDisableRightHeaderBtns.value = curAdd || curEdit;
        },
        {
            immediate: true
        }
    );

    onMounted(() => {
        const hasDateString = route.query?.date;
        const isPastString = dayjsIsAfter(getDayjsTz(), dayjs(hasDateString), 'day');
        if (hasDateString && isPastString) {
            isHideTemplateManage.value = true;
        } else {
            isHideTemplateManage.value = false;
        }
    });
    provide(isAcEditKey, isAcEdit);
    provide(isAcAddKey, isAcAdd);
    provide(currentConfigItemKey, currentConfigItem);
    provide(currentConfigObjKey, currentConfigObj);
    provide(currentPreviousObjKey, ref({}));
    provide(leftTreeListKey, ref([]));
    provide(leftTreeRemoveCurrentIdsKey, ref([]));
    provide(treeLoadingKey, treeLoading);
    provide(hideRemoveButtonKey, hideRemoveButton);
    provide(isLoadingConfigInfoKey, isLoadingConfigInfo);
    provide(scrollbarLeftRefKey, scrollbarLeftRef);
    provide(isChangeConfigKey, ref(false));
    provide(formDirtyCheckKey, formDirtyCheck);
    provide(confirmModalKey, confirmModal);

    return {
        isAcEdit,
        isAcAdd,
        changeStatus,
        addStatus,
        onDefault,
        onDel,
        currentConfigItem,
        currentConfigObj,
        treeLoading,
        hideRemoveButton,
        listLoading,
        leftRef,
        refreshLeftList,
        isHideTemplateManage
    };
};
