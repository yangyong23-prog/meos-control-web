<template>
    <div class="frame">
        <IframeMenu v-if="showMenu" :menu-data="menus" :model-value="modelValue" @menus-change="menusChange" />
        <div v-if="showContent" class="frame-content">
            <div v-if="tabActiveId" class="frame-content-top fcb">
                <div class="frame-contnt-top-tabs">
                    <m-tabs v-if="!isAfterDate" v-model="tabActiveId" size="large" style="width: 100%" :data="templateTabs" @change="changeTab" />
                    <div v-else>{{ currItem[0]?.templateName }}</div>
                </div>
                <div class="frame-contnt-top-btn fcc">
                    <slot name="btn">
                        <m-button v-if="!islandPage" type="primary" size="medium" @click="openTemplateManage">{{ i18n.global.t('meos_control_web.template_management') }}</m-button>
                    </slot>
                </div>
            </div>
            <div v-if="showBottom && tabActiveId" class="frame-content-bottom">
                <slot></slot>
            </div>
            <div v-else class="frame-content-bottom fcc" style="flex-direction: column">
                <Empty :text="i18n.global.t('meos_control_web.no_content')">
                    <p style="color: var(--gray-500); margin-top: 8px">{{ i18n.global.t('meos_control_web.please_enable_demand_template_in_mgmt') }}</p>
                </Empty>
                <br />
                <slot name="empty">
                    <m-button size="medium" type="primary" @click="openTemplateManage">{{ i18n.global.t('meos_control_web.template_management') }}</m-button>
                </slot>
                <!-- <Empty :text="i18n.global.t('meos_control_web.no_content_please_enable_demand_template_in_template_management')" />
                <m-button
                    size="medium"
                    @click="openTemplateManage"
                >{{ i18n.global.t('meos_control_web.template_management') }}</m-button> -->
            </div>
        </div>
        <TemplateManage v-if="showTemplateManage" @close="templateManageClose" />
    </div>
</template>
<script lang="ts" setup>
// @ts-ignore
import i18n from '@/localization';
import { getQueryString } from '@/utils/tools';
import { MenuItem, TabList } from '@/types/common';
import { PropType } from 'vue';
import TemplateManage from './TemplateManage.vue';
import { SUCCESSCODE } from '@/utils/globalVariables';
import { getListDateSetting } from '@/apis/public';
import useStore from '@/store';
import Empty from '../common/Empty.vue';
import dayjs from 'dayjs';
import { getDayjsTz } from '@/utils/globalVariables';
import { dayjsIsAfter } from '@/utils/dayjsTools';
import IframeMenu from '../common/IframeMenu.vue';
const _this: any = getCurrentInstance()?.proxy;
const props = defineProps({
    showMenu: {
        type: Boolean,
        default: true
    },
    menus: {
        type: Array as PropType<MenuItem[]>,
        default: () => []
    },
    modelValue: {
        type: String,
        default: ''
    },
    activeId: {
        type: String,
        default: ''
    },
    islandPage: {
        type: Boolean,
        default: false
    },
    type: {
        type: String,
        default: ''
    }
});
const { base } = useStore();
const showContent = ref(true);
const showBottom = ref(true);
const isloadingFrame = ref(true);
const tabActiveId = computed({
    get() {
        return props.activeId;
    },
    set(val) {
        emit('update:activeId', val);
        return val;
    }
});
const isChange = ref(false);
const templateId = ref('');
const emit = defineEmits(['update:modelValue', 'update:activeId', 'updateConfig']);
const templateTabs = ref<TabList[]>([]);
const showTemplateManage = ref(false);
const isAfterDate = ref();
const currItem = ref([]);
const openTemplateManage = () => {
    showTemplateManage.value = true;
};
const menusChange = (item: MenuItem) => {
    emit('update:modelValue', item.id);
    listDateSetting(item.id);
    refreshFun();
    isChange.value = true;
};
const changeTab = val => {
    templateId.value = val.templateId;
    if (props.type === 'LIGHTING') {
        emit('queryListSceneConfig', val.templateId);
    }
    showBottom.value = false;
    nextTick(() => {
        showBottom.value = true;
    });
};
const refreshFun = () => {
    showContent.value = false;
    nextTick(() => {
        showContent.value = true;
    });
};
const templateManageClose = (type: any) => {
    if (type) {
        tabActiveId.value = '';
        listDateSetting();
        refreshFun();
    }
    showTemplateManage.value = false;
};
const listDateSetting = id => {
    templateTabs.value = [];
    getListDateSetting({
        templateType: id || props.modelValue,
        demandType: 'AIRCONDITIONING'
    }).then(res => {
        isloadingFrame.value = false;
        if (res.code === SUCCESSCODE) {
            //  仅显示启用模板
            const filterData = res.data?.filter((item: any) => item.isEnabled);
            templateTabs.value = filterData.map(item => ({
                id: item.templateTag,
                name: item.templateName,
                templateId: item.templateId
            }));
            base.setTemplateList(templateTabs.value);
            // 当前选中项
            let { query } = _this.$route;
            if (query.templateTag) {
                currItem.value = filterData.filter(item => item.templateTag === query.templateTag);
            }
            if (templateTabs.value.length && !tabActiveId.value) {
                if (getQueryString('templateTag') && templateTabs.value.some(item => item.id === getQueryString('templateTag'))) {
                    tabActiveId.value = getQueryString('templateTag')!;
                } else {
                    tabActiveId.value = templateTabs.value[0].id;
                    templateId.value = templateTabs.value[0].templateId;
                    base.templateId = templateTabs.value[0].templateId;
                }
            } else {
                if (!templateTabs.value.length) {
                    tabActiveId.value = '';
                    templateId.value = '';
                } else {
                    if (isChange.value) {
                        tabActiveId.value = templateTabs.value[0].id;
                        templateId.value = templateTabs.value[0].templateId;
                        base.templateId = templateTabs.value[0].templateId;
                    } else {
                        tabActiveId.value = query.templateTag;
                        templateId.value = query.templateId;
                        base.templateId = query.templateId;
                    }
                }
            }
            if (props.type === 'LIGHTING') {
                emit('queryListSceneConfig', templateId.value);
            }
        }
    });
};
onMounted(() => {
    //是否是历史时间
    let { query } = _this.$route;
    if (query.date) {
        let configDate = dayjs(query.date).format('YYYY-MM-DD');
        isAfterDate.value = dayjsIsAfter(getDayjsTz(), configDate, 'day');
    }
    listDateSetting();
});
watch(
    () => tabActiveId.value,
    () => {
        base.templateTag = tabActiveId.value;
        base.templateId = templateId.value;
        if (props.type === 'LIGHTING') {
            emit('queryListSceneConfig', templateId.value);
        }
    }
);
watch(
    () => props.modelValue,
    () => {
        // 注掉是因为测试会连续点击 页面会出现空状态
        // listDateSetting();
    }
);
defineExpose({
    openTemplateManage,
    listDateSetting
});
</script>
<style lang="less" scoped>
.frame {
    --frame-menu-padding: 8px 0;
    --frame-menu-width: 64px;
    --frame-menu-item-padding: 10px 0;
    --frame-menu-item-height: 64px;
}
.frame {
    display: flex;
    height: 100%;
    overflow: hidden;
    &-content {
        flex: 1;
        width: 100%;
        min-width: 1376px;
        height: 100%;
        &-top {
            min-height: 50px;
            width: 100%;
            border-bottom: 1px solid var(--gray-300);
            .frame-contnt-top-tabs {
                padding: 3px 12px 0px 4px;
                height: 100%;
                flex: 1;
                min-width: 0;
                width: 0;
                :deep(.m-tabs-line .m-tabs-list) {
                    padding-bottom: 8px;
                }
            }
            .frame-contnt-top-btn {
                height: 100%;
                margin-right: 12px;
                gap: 12px;
            }
        }
        &-bottom {
            height: calc(100% - 50px);
        }
    }
}
.frame-content-bottom {
    :deep(.empty) {
        p {
            color: var(--gray-600);
        }
    }
}
</style>
