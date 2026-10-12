<template>
    <div class="container-box">
        <div class="animation-form-list">
            <xshellFormList
                ref="animationFormRef"
                :label-width="'345px'"
                :title="i18n.global.t('meos_control_web.graph_animation_effect_visibility_control')"
                :xshell-params="params"
                :data-list="params.animationData"
            >
            </xshellFormList>
        </div>
        <xshellFormList
            ref="waterValveFormRef"
            :label-width="'345px'"
            :title="i18n.global.t('meos_control_web.electric_control_valve_opening_configuration')"
            :xshell-params="params"
            :data-list="params.waterValveData"
        >
        </xshellFormList>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import { shellConfigQuery } from '@/apis/xshellConfiguration';
import { formatterValue, updateshellConfigSave, validate } from '../utils/tools';
import xshellFormList from './common/xshellFormList.vue';
import emitter from '@/utils/bus';
import { $Message } from 'meri-plus';
import { fetchAbortControllerInjectKey, useShellConfigLoading } from '../hooks/useGlobalData';
import { SUCCESSCODE } from '@/utils/globalVariables';
import { GRAPH_ANIMATION_VISIBLE, GRAPH_ANIMATION_EFFECT } from '../constants/constant';
import { ACTIVE_MENUS_ID_ENUM } from '../constants/enums';

const emit = defineEmits(['defaultRestoreAll']);
const { showLoading, hideLoading } = useShellConfigLoading();
const fetchAbortController = inject(fetchAbortControllerInjectKey);
const QUERY_SCENE_NAME = 'graph';
const LEFT_ACTIVE_MENU_ID = ACTIVE_MENUS_ID_ENUM.SYSTEM_GRAPH_SETTING;

const animationFormRef = ref(null);
const waterValveFormRef = ref(null);

const params = reactive({
    allItem: [], // 全部的item,不包含groups
    noDefaultData: [], // 需要恢复默认值的数组
    defaultItem: [], // 默认不变的item

    animationData: [],
    waterValveData: []
});

watchEffect(() => {
    const visibleItem = params.animationData.find(v => GRAPH_ANIMATION_VISIBLE.includes(v.code));
    const effectItem = params.animationData.find(v => GRAPH_ANIMATION_EFFECT.includes(v.code));
    if (visibleItem) {
        effectItem.editAuth = visibleItem.valueInputLeft === 'show';
    }
});

// 获取配置
const getShellConfigQuery = async () => {
    showLoading();

    params.allItem = [];
    params.defaultItem = [];
    params.animationData = [];
    params.waterValveData = [];

    fetchAbortController.value?.abort?.();
    fetchAbortController.value = new AbortController();

    const res = await shellConfigQuery({ scene: QUERY_SCENE_NAME }, fetchAbortController.value.signal).finally(() => {
        hideLoading();
    });
    if (res.code === SUCCESSCODE && Array.isArray(res.data)) {
        const tempArr = [];
        res.data.forEach(group => {
            if (Array.isArray(group?.groups)) {
                group.groups.forEach(item => {
                    tempArr.push(item);
                    if (item.group === 'group_graph_effect') {
                        params.animationData = formatterValue(item.items);
                    } else if (item.group === 'group_graph_electric') {
                        params.waterValveData = formatterValue(item.items);
                    }
                });
            }
        });
        params.allItem = tempArr;
        params.defaultItem = structuredClone(tempArr);
    }
};

// 更新配置
const updateshellConfig = () => {
    const submitData = [...params.allItem];
    updateshellConfigSave(QUERY_SCENE_NAME, submitData).then(res => {
        if (res.code === '00000') {
            $Message.success({ title: i18n.global.t('meos_control_web.configuration_success') });
            emitter.emit('confirmDisabled', { status: true, isSave: true });
            getShellConfigQuery();
        }
    });
};

emitter.off('InputEmitter');
emitter.on('InputEmitter', data => {
    if (data.menu === LEFT_ACTIVE_MENU_ID) {
        if (data.type === 'confirm') {
            formValidate(data.menu);
        } else if (data.type === 'cancel') {
            params.allItem.map(group => {
                group.items.map(item => {
                    item.valueInputLeft = item.valueLeft != null ? item.valueLeft : item.defaultValueLeft;
                    item.valueInputRight = item.valueRight != null ? item.valueRight : item.defaultValueRight;
                });
            });
            emitter.emit('confirmDisabled', { status: true, isSave: true });
        } else {
            params.allItem.map(group => {
                group.items.map(item => {
                    item.valueInputLeft = item.defaultValueLeft;
                    item.valueInputRight = item.defaultValueRight;
                });
            });
            formValidate();
        }
    }
});

// 验证
const formValidate = data => {
    nextTick(() => {
        Promise.all([validate(animationFormRef), validate(waterValveFormRef)]).then(function (results) {
            if (results.includes(undefined)) {
                if (data === LEFT_ACTIVE_MENU_ID) {
                    $Message.error({ title: i18n.global.t('meos_control_web.error_items_exist_please_check') });
                }

                return;
            }
            if (data === LEFT_ACTIVE_MENU_ID) {
                // 更新配置
                updateshellConfig();
            }
        });
    });
};

const isTreeChanged = ref(false);

watch(
    () => [params.allItem, params.defaultItem],
    () => {
        const curItems = params.allItem?.flatMap(cur => cur?.items?.map(v => ({ valueInputLeft: v?.valueInputLeft, shellConfigValue: v?.shellConfigValue })));
        const defaultItems = params.defaultItem?.flatMap(cur => cur?.items?.map(v => ({ valueInputLeft: v?.valueInputLeft, shellConfigValue: v?.shellConfigValue })));
        isTreeChanged.value = JSON.stringify(curItems) !== JSON.stringify(defaultItems);
        if (isTreeChanged.value) {
            formValidate();
            emitter.emit('confirmDisabled', { status: false, isSave: true });
        } else {
            formValidate();
            emitter.emit('confirmDisabled', { status: true, isSave: true });
        }
    },
    { deep: true }
);

// 监听所有的item，有不是默认值的单独放到一个数组里面
watch(
    () => params.allItem,
    newValue => {
        params.noDefaultData = [];
        newValue.map(group => {
            group.items.map(item => {
                if (item.valueInputLeft !== item.defaultValueLeft || item.valueInputRight !== item.defaultValueRight) {
                    params.noDefaultData.push(item);
                }
            });
        });
    },
    { deep: true }
);

// 监听需要恢复默认值的数组 为空时不展示批量恢复默认值按钮
watch(
    () => params.noDefaultData,
    newValue => {
        if (newValue.length) {
            newValue.map(item => {
                if (item.valueInputLeft !== item.defaultValueLeft || item.valueInputRight !== item.defaultValueRight) {
                    emit('defaultRestoreAll', true);
                }
            });
        } else {
            emit('defaultRestoreAll', false);
        }
    },
    { deep: true }
);

onMounted(() => {
    getShellConfigQuery();
});
</script>
<style scoped lang="less">
@import '../styles/xshellConfigRight.less';

.animation-form-list {
    :deep(.form-box) {
        padding-top: 12px;
        margin-bottom: 0px;
    }
    :deep(.form-box-data) {
        margin-top: 0px;
    }
}
</style>
