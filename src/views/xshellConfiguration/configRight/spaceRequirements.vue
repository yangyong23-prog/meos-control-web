<template>
    <div class="container-box">
        <xshellFormList
            ref="space_quality"
            :row="2"
            :width="120"
            :label-width="'140px'"
            :title="i18n.global.t('meos_control_web.space_quality_demand_input_condition')"
            :xshell-params="params"
            :data-list="params.spaceQualityData"
        >
        </xshellFormList>
    </div>
</template>

<script setup lang="ts">
// @ts-ignore
import i18n from '@/localization';
import { shellConfigQuery } from '@/apis/xshellConfiguration';
import { formatterValue, updateshellConfigSave, validate } from '../utils/tools';
import xshellFormList from './common/xshellFormList.vue';
import emitter from '@/utils/bus';
import { $Message } from 'meri-plus';
import { fetchAbortControllerInjectKey, useShellConfigLoading } from '../hooks/useGlobalData';
import { ACTIVE_MENUS_ID_ENUM } from '../constants/enums';

const emit = defineEmits(['defaultRestoreAll']);
const { showLoading, hideLoading } = useShellConfigLoading();

// 空间品质需求输入
// eslint-disable-next-line camelcase
const space_quality = ref<any>(null);
const fetchAbortController = inject(fetchAbortControllerInjectKey);

// 空间需求
const params = reactive({
    allItem: [] as any, // 全部的item,不包含groups
    noDefaultData: [] as any, // 需要恢复默认值的数组
    defaultItem: [] as any, // 默认不变的item
    spaceQualityData: [], // 空间品质需求输入条件列表
    dataList1: [] // 需求逻辑条件输入列表
});

const getShellConfigQuery = (name: string) => {
    showLoading();

    params.allItem = [];
    params.spaceQualityData = [];
    fetchAbortController.value?.abort?.();
    fetchAbortController.value = new AbortController();
    shellConfigQuery({ scene: name }, fetchAbortController.value.signal)
        .then((res: any) => {
            if (res.code === '00000') {
                res.data.length &&
                    res.data.forEach((group: any) => {
                        group.groups.length &&
                            group.groups.forEach((item: any) => {
                                params.allItem.push(item);
                                // eslint-disable-next-line eqeqeq
                                if (item.group == 'group_space_quality') {
                                    params.spaceQualityData = formatterValue(item.items);
                                }
                            });
                    });
                params.defaultItem = JSON.parse(JSON.stringify(params.allItem));
            }
        })
        .finally(() => {
            hideLoading();
        });
};

// 更新配置
const updateshellConfig = () => {
    updateshellConfigSave('space', params.allItem).then((res: any) => {
        // eslint-disable-next-line eqeqeq
        if (res.code == '00000') {
            $Message.success({ title: i18n.global.t('meos_control_web.configuration_success') });
            emitter.emit('confirmDisabled', { status: true, isSave: true });
            getShellConfigQuery('space');
        }
    });
};

emitter.off('InputEmitter');
emitter.on('InputEmitter', (data: any) => {
    // eslint-disable-next-line eqeqeq
    if (data.menu === ACTIVE_MENUS_ID_ENUM.SPACE_REQUIREMENTS) {
        // eslint-disable-next-line eqeqeq
        if (data.type == 'confirm') {
            formValidate(data.menu);
            // eslint-disable-next-line eqeqeq
        } else if (data.type == 'cancel') {
            params.allItem.map((group: any) => {
                group.items.map((item: any) => {
                    item.valueInputLeft = item.valueLeft != null ? item.valueLeft : item.defaultValueLeft;
                    item.valueInputRight = item.valueRight != null ? item.valueRight : item.defaultValueRight;
                });
            });
            emitter.emit('confirmDisabled', { status: true, isSave: true });
        } else {
            params.allItem.map((group: any) => {
                group.items.map((item: any) => {
                    item.valueInputLeft = item.defaultValueLeft;
                    item.valueInputRight = item.defaultValueRight;
                });
            });
            formValidate();
        }
    }
});

// 验证
const formValidate = (data?: any) => {
    nextTick(() => {
        Promise.all([validate(space_quality)]).then(function (results) {
            // eslint-disable-next-line eqeqeq
            if (data === ACTIVE_MENUS_ID_ENUM.SPACE_REQUIREMENTS) {
                // 更新配置
                updateshellConfig();
            } else {
                if (results.includes(undefined)) {
                    emitter.emit('confirmDisabled', { status: true, isSave: false });
                }
            }
        });
    });
};

let isTreeChanged = ref(false);

watch(
    () => [params.allItem, params.defaultItem],
    () => {
        isTreeChanged.value = JSON.stringify(params.allItem) !== JSON.stringify(params.defaultItem);
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
        newValue.map((group: any) => {
            group.items.map((item: any) => {
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
            newValue.map((item: any) => {
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
    getShellConfigQuery('space');
});
</script>
<style scoped lang="less">
@import '../styles/xshellConfigRight.less';
</style>
