// @ts-ignore
import i18n from '@/localization';
import { getListDateSetting } from '@/apis/public';
import { useRouter, useRoute } from 'vue-router';
import dayjs from 'dayjs';
import { getDayjsTz } from '@/utils/globalVariables';
import { dayjsIsAfter } from '@/utils/dayjsTools';

export default (props, emit) => {
    const showTemplateManage = ref(false); // 模板组件
    const isloadingFrame = ref(true);
    const templateTabs = ref([]);
    const isHideTemplateManage = ref(false);

    const router = useRouter();
    const route = useRoute();

    const tabActiveId = computed({
        get() {
            return props.activeId;
        },
        set(val) {
            emit('update:activeId', val);
            return val;
        }
    });
    const menusChange = item => {
        emit('update:modelValue', item.id);
        router.push({
            query: {
                ...(router.currentRoute.value.query || {}),
                templateType: item.id
            }
        });
    };
    const changeTab = val => {
        tabActiveId.value = val.id;
        router.push({
            query: {
                ...(router.currentRoute.value.query || {}),
                templateTag: val.id
            }
        });
    };
    /**
     * 打开模板弹框
     */
    const openTemplateManage = () => {
        showTemplateManage.value = true;
    };
    /**
     * 关闭模板弹框
     */
    const templateManageClose = status => {
        if (status) {
            tabActiveId.value = '';
            queryListDateSetting();
        }
        showTemplateManage.value = false;
    };
    /**
     * 获取模板tab列表
     */
    const queryListDateSetting = async () => {
        try {
            isloadingFrame.value = true;
            const response = await getListDateSetting({ templateType: props?.modelValue }).finally(() => {
                isloadingFrame.value = false;
            });
            const { data, result } = response;
            if (result === 'success') {
                const filterData = data?.filter(item => item.isEnabled);
                templateTabs.value = filterData
                    .map(item => ({
                        id: item.templateTag,
                        name: item.templateName,
                        slotName: 'name',
                        templateId: item.templateId
                    }))
                    ?.filter(item => {
                        const hasDateString = route.query?.date || getDayjsTz().format('YYYY-MM-DD');
                        const isPastString = dayjsIsAfter(getDayjsTz(), dayjs(hasDateString), 'day');
                        const tagString = route.query?.templateTag;
                        // 空调、通风均支持历史日期查询，过去日期下隐藏模板管理入口，避免对历史配置对应的模板进行操作
                        const isSupportedType = ['AIRCONDITIONING', 'LOGISTICS_VENTILATION', 'PARKING_VENTILATION', 'TOILET_VENTILATION', 'DOME_VENTILATION'].includes(
                            props?.modelValue
                        );
                        if (isSupportedType && hasDateString && isPastString) {
                            isHideTemplateManage.value = true;
                        } else {
                            isHideTemplateManage.value = false;
                        }
                        // 历史日期配置传参设置，仅展示当前日期模板
                        if (isSupportedType && hasDateString && isPastString && tagString) {
                            return item?.id?.toString() === tagString;
                        }
                        return true;
                    });
                // 取路由query中模板tag，没有则默认选中模板列表第一个
                let tempActiveId = templateTabs.value[0]?.id;
                if (route.query?.templateTag && templateTabs.value.some(v => v?.id?.toString() === route.query?.templateTag)) {
                    tempActiveId = route.query?.templateTag;
                }
                tabActiveId.value = tempActiveId;
                nextTick(() => {
                    router.push({
                        query: {
                            ...(router.currentRoute.value.query || {}),
                            templateTag: tempActiveId
                        }
                    });
                });
            }
        } catch (error) {
            console.log(error);
        }
        isloadingFrame.value = false;
    };
    watchEffect(() => {
        if (props?.modelValue) {
            queryListDateSetting();
        } else {
            isloadingFrame.value = false;
        }
    });
    return {
        isloadingFrame,
        tabActiveId,
        templateTabs,
        showTemplateManage,
        changeTab,
        menusChange,
        openTemplateManage,
        templateManageClose,
        isHideTemplateManage
    };
};
