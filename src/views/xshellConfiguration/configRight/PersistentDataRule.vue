<template>
    <div class="persistent-data-rule-container">
        <titleType :title="i18n.global.t('meos_control_web.persistent_data_query_logic_switch')" />
        <m-form ref="formRef" :model="formData" :label-position="'left'">
            <div class="form-box">
                <!-- 持久化数据查询逻辑 -->
                <div class="form-box-data">
                    <m-form-item prop="queryLogic" :item-model="formData.queryLogic" class="form-item-left" :rules="queryLogicRules">
                        <template #label>
                            <div class="label-position" :style="{ width: '345px' }">
                                <div class="label-top">
                                    <div class="fc">
                                        <span class="item-name">{{ logicConf.name }}</span>
                                        <span class="label-icon">*</span>
                                        <m-tips v-if="logicConf.descLines.length" theme="darkTransparent" width="420px">
                                            <template #content>
                                                <div class="tips-content">
                                                    <p v-for="(line, index) in logicConf.descLines" :key="index">{{ line }}</p>
                                                </div>
                                            </template>
                                            <IconMeriComponentDialogLinear class="label-icon-linear" size="16" color="#626C78" />
                                        </m-tips>
                                    </div>
                                </div>
                            </div>
                        </template>
                        <div class="control-line">
                            <m-radio-group v-model="formData.queryLogic" @change="onQueryLogicChange">
                                <div class="radio-list">
                                    <m-radio v-for="radio in logicConf.options" :key="radio.value" :disabled="!logicConf.editAuth" :label="radio.value">{{ radio.label }}</m-radio>
                                </div>
                            </m-radio-group>
                            <m-tips :content="queryLogicDefaultTips" theme="darkTransparent">
                                <m-button v-if="isLoaded && showLogicRestore" class="default-text" type="link" @click="restoreLogicDefault">{{
                                    i18n.global.t('meos_control_web.restore_default_value')
                                }}</m-button>
                            </m-tips>
                        </div>
                    </m-form-item>
                </div>
                <!-- 请设置距离当前的时间间隔：仅当查询逻辑=查询距离当前最新的数据时展示 -->
                <div v-if="isLatestLogic" class="form-box-data">
                    <m-form-item prop="queryInterval" :item-model="formData.queryInterval" class="form-item-left" :rules="queryIntervalRules">
                        <template #label>
                            <div class="label-position" :style="{ width: '345px' }">
                                <div class="label-top">
                                    <div class="fc">
                                        <span class="item-name">{{ intervalConf.name }}</span>
                                        <span class="label-icon">*</span>
                                        <m-tips v-if="intervalConf.desc" :content="intervalConf.desc" theme="darkTransparent" width="420px">
                                            <IconMeriComponentDialogLinear class="label-icon-linear" size="16" color="#626C78" />
                                        </m-tips>
                                    </div>
                                </div>
                            </div>
                        </template>
                        <div class="control-line">
                            <m-input-number
                                v-model="formData.queryInterval"
                                class="number-default"
                                :width="'150px'"
                                controls="rightButton"
                                text-align="left"
                                :placeholder="i18n.global.t('common.placeholder_input')"
                                :min="intervalConf.min"
                                :max="intervalConf.max"
                                :precision="0"
                                :disabled="!intervalConf.editAuth"
                                @change="onControlChange"
                            >
                                <template #suffix>{{ intervalConf.unit }}</template>
                            </m-input-number>
                            <m-tips :content="queryIntervalDefaultTips" theme="darkTransparent">
                                <m-button v-if="isLoaded && showIntervalRestore" class="default-text" type="link" @click="restoreIntervalDefault">{{
                                    i18n.global.t('meos_control_web.restore_default_value')
                                }}</m-button>
                            </m-tips>
                        </div>
                    </m-form-item>
                </div>
            </div>
        </m-form>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import { $Message } from 'meri-plus';
import { IconMeriComponentDialogLinear } from 'meri-icon';
import emitter from '@/utils/bus';
import { shellConfigQuery, shellConfigSave } from '@/apis/xshellConfiguration';
import { SUCCESSCODE } from '@/utils/globalVariables';
import titleType from './common/titleType.vue';
import { fetchAbortControllerInjectKey, useShellConfigLoading } from '../hooks/useGlobalData';
import { ACTIVE_MENUS_ID_ENUM } from '../constants/enums';
// 后端契约：壳配置 scene / group / 参数编码（唯一来源：useShellPrecisionConfig.ts，配置页与消费端共用）
import { QUERY_SCENE_NAME, GROUP_NAME, QUERY_LOGIC_CODE, QUERY_INTERVAL_CODE, LATEST_LOGIC_VALUE } from '@/hooks/useShellPrecisionConfig';

const emit = defineEmits(['defaultRestoreAll']);
const { showLoading, hideLoading } = useShellConfigLoading();
const fetchAbortController = inject(fetchAbortControllerInjectKey);

// 兜底约定值（后端未返回时使用），正常以后端 valSource/min/max/unit 为准
const FALLBACK_LOGIC_VALUE = 'same_time';
const FALLBACK_INTERVAL_UNIT = 'h';
const FALLBACK_INTERVAL_MIN = 1;
const FALLBACK_INTERVAL_MAX = 168;
const FALLBACK_INTERVAL_DEFAULT = 1;

const formRef = ref(null);

// 后端下发的展示配置（名称、提示、选项、约束）
const logicConf = reactive({
    name: '',
    descLines: [],
    options: [],
    editAuth: true
});
const intervalConf = reactive({
    name: '',
    desc: '',
    unit: FALLBACK_INTERVAL_UNIT,
    min: FALLBACK_INTERVAL_MIN,
    max: FALLBACK_INTERVAL_MAX,
    hint: '',
    editAuth: true
});

const formData = reactive({
    queryLogic: FALLBACK_LOGIC_VALUE,
    queryInterval: FALLBACK_INTERVAL_DEFAULT
});
// 上次保存的值（取消时回退）、默认值（恢复默认时回退）
let savedData = { queryLogic: FALLBACK_LOGIC_VALUE, queryInterval: FALLBACK_INTERVAL_DEFAULT },
    defaultData = { queryLogic: FALLBACK_LOGIC_VALUE, queryInterval: FALLBACK_INTERVAL_DEFAULT };
// 查询回显完成前关闭脏判定，避免加载期误报 confirmDisabled 与恢复默认值按钮
const isLoaded = ref(false);

const isLatestLogic = computed(() => formData.queryLogic === LATEST_LOGIC_VALUE);
const showLogicRestore = computed(() => formData.queryLogic !== defaultData.queryLogic);
const showIntervalRestore = computed(() => Number(formData.queryInterval) !== Number(defaultData.queryInterval));
const queryLogicDefaultTips = computed(() =>
    i18n.global.t('meos_control_web.default_value_is', { val: logicConf.options.find(v => v.value === defaultData.queryLogic)?.label ?? '' })
);
const queryIntervalDefaultTips = computed(() => i18n.global.t('meos_control_web.default_value_is', { val: `${defaultData.queryInterval}${intervalConf.unit}` }));

const queryLogicRules = computed(() => [
    {
        required: true,
        message: i18n.global.t('meos_control_web.content_required'),
        trigger: ['blur', 'change']
    }
]);

const validateInterval = (rule, value, callback) => {
    if (value === null || value === undefined || value === '') {
        callback(new Error(i18n.global.t('meos_control_web.content_required')));
        return;
    }
    const num = Number(value);
    if (!Number.isInteger(num) || num < intervalConf.min || num > intervalConf.max) {
        callback(new Error(intervalConf.hint || i18n.global.t('meos_control_web.persistent_data_interval_range_tip')));
        return;
    }
    callback();
};
const queryIntervalRules = computed(() => [
    {
        required: true,
        validator: validateInterval,
        trigger: ['blur', 'change']
    }
]);

const clampInterval = val => Math.min(intervalConf.max, Math.max(intervalConf.min, Math.round(Number(val))));

const parseNumberValue = raw => {
    if (raw === '' || raw === null || raw === undefined) {
        return null;
    }
    const num = Number(raw);
    return Number.isNaN(num) ? null : num;
};

// 解析 valSource 形如 [{"name":"xx","value":"yy"}]
const parseValSourceOptions = raw => {
    let arr = [];
    try {
        arr = JSON.parse(raw);
    } catch {
        arr = [];
    }
    return Array.isArray(arr)
        ? arr.filter(option => option?.value !== undefined && option?.value !== null).map(option => ({ label: option?.name ?? option?.value, value: option?.value }))
        : [];
};

// desc 按 \n 拆分为多行展示
const splitDescLines = desc => (typeof desc === 'string' && desc ? desc.split('\n').filter(line => line.trim()) : []);

// 将后端返回的 items 映射为表单数据与展示配置
const applyItems = items => {
    const logicItem = items.find(v => v?.code === QUERY_LOGIC_CODE) || {};
    const intervalItem = items.find(v => v?.code === QUERY_INTERVAL_CODE) || {};

    logicConf.name = logicItem.name || '';
    logicConf.descLines = splitDescLines(logicItem.desc);
    logicConf.options = parseValSourceOptions(logicItem.valSource);
    logicConf.editAuth = logicItem.editAuth !== false;

    const minNum = parseNumberValue(intervalItem.min);
    const maxNum = parseNumberValue(intervalItem.max);
    intervalConf.name = intervalItem.name || '';
    intervalConf.desc = typeof intervalItem.desc === 'string' ? intervalItem.desc : '';
    intervalConf.unit = intervalItem.unit || FALLBACK_INTERVAL_UNIT;
    intervalConf.min = minNum !== null ? minNum : FALLBACK_INTERVAL_MIN;
    intervalConf.max = maxNum !== null ? maxNum : FALLBACK_INTERVAL_MAX;
    intervalConf.hint = intervalItem.hint || '';
    intervalConf.editAuth = intervalItem.editAuth !== false;

    const validLogicValues = logicConf.options.map(option => option.value);
    const fallbackLogic = validLogicValues.includes(FALLBACK_LOGIC_VALUE) ? FALLBACK_LOGIC_VALUE : validLogicValues[0] ?? FALLBACK_LOGIC_VALUE;

    const savedLogicRaw = logicItem.shellConfigValue ?? logicItem.value;
    const defaultLogicRaw = logicItem.defaultValues;
    const savedIntervalNum = parseNumberValue(intervalItem.shellConfigValue ?? intervalItem.value);
    const defaultIntervalNum = parseNumberValue(intervalItem.defaultValues);

    savedData = {
        queryLogic: validLogicValues.includes(savedLogicRaw) ? savedLogicRaw : fallbackLogic,
        queryInterval: savedIntervalNum !== null ? clampInterval(savedIntervalNum) : FALLBACK_INTERVAL_DEFAULT
    };
    defaultData = {
        queryLogic: validLogicValues.includes(defaultLogicRaw) ? defaultLogicRaw : fallbackLogic,
        queryInterval: defaultIntervalNum !== null ? clampInterval(defaultIntervalNum) : FALLBACK_INTERVAL_DEFAULT
    };
    formData.queryLogic = savedData.queryLogic;
    formData.queryInterval = savedData.queryInterval;
};

// 获取配置
const getShellConfigQuery = async isUpdate => {
    showLoading();
    if (!isUpdate) {
        isLoaded.value = false;
    }

    fetchAbortController.value?.abort?.();
    fetchAbortController.value = new AbortController();

    const res = await shellConfigQuery({ scene: QUERY_SCENE_NAME }, fetchAbortController.value.signal).finally(() => {
        hideLoading();
    });
    if (res.code === SUCCESSCODE && Array.isArray(res.data)) {
        let items = [];
        res.data.forEach(sceneData => {
            Array.isArray(sceneData?.groups) &&
                sceneData.groups.forEach(group => {
                    if (group?.group === GROUP_NAME && Array.isArray(group?.items)) {
                        items = [...group.items];
                    }
                });
        });
        applyItems(items);
    }

    nextTick(() => {
        emitter.emit('confirmDisabled', { status: true, isSave: true });
        isLoaded.value = true;
    });

    return res;
};

// 更新配置
const updateShellConfig = () => {
    shellConfigSave({
        scene: QUERY_SCENE_NAME,
        groups: [
            {
                group: GROUP_NAME,
                items: [
                    { code: QUERY_LOGIC_CODE, value: formData.queryLogic },
                    {
                        code: QUERY_INTERVAL_CODE,
                        // 查询逻辑=查询同一个时刻点的数据时，时间间隔不参与业务，固定提交默认值(1h)
                        value: isLatestLogic.value ? formData.queryInterval : defaultData.queryInterval
                    }
                ]
            }
        ]
    }).then(res => {
        if (res.code === SUCCESSCODE) {
            $Message.success({ title: i18n.global.t('meos_control_web.configuration_success') });
            getShellConfigQuery(true);
        }
    });
};

// 验证，needSave 为 true 时验证通过后直接保存
const formValidate = (needSave = false) => {
    nextTick(() => {
        const result = formRef.value?.validate?.(valid => {
            if (!valid) {
                if (needSave) {
                    $Message.error({ title: i18n.global.t('meos_control_web.error_items_exist_please_check') });
                }
                return;
            }
            if (needSave) {
                updateShellConfig();
            }
        });
        // 部分表单库 validate 同时返回 promise，失败时需要兜底 catch
        result?.catch?.(() => {});
    });
};

const onControlChange = () => {
    formValidate();
};

// 切换查询逻辑时，时间间隔固定重置为默认值(1h)：
// 切回「查询距离当前最新的数据」避免回显未保存输入；切走时保证隐藏字段不会把非默认值提交出去
const onQueryLogicChange = () => {
    if (Number(formData.queryInterval) !== Number(defaultData.queryInterval)) {
        formData.queryInterval = defaultData.queryInterval;
    }
    onControlChange();
};

const restoreLogicDefault = () => {
    formData.queryLogic = defaultData.queryLogic;
};

const restoreIntervalDefault = () => {
    formData.queryInterval = defaultData.queryInterval;
};

const onInputEmitter = data => {
    if (data.menu !== ACTIVE_MENUS_ID_ENUM.PERSISTENT_DATA_RULE) {
        return;
    }
    if (data.type === 'confirm') {
        formValidate(true);
    } else if (data.type === 'cancel') {
        const restored = structuredClone(toRaw(savedData));
        formData.queryLogic = restored.queryLogic;
        formData.queryInterval = restored.queryInterval;
        formValidate();
        emitter.emit('confirmDisabled', { status: true, isSave: true });
    } else if (data.type === 'reset') {
        const restored = structuredClone(toRaw(defaultData));
        formData.queryLogic = restored.queryLogic;
        formData.queryInterval = restored.queryInterval;
        formValidate();
    }
};

// 监听表单变化：回显完成后按脏检查结果同步确认按钮置灰与批量恢复默认值按钮展示
watch(
    () => [formData.queryLogic, formData.queryInterval],
    () => {
        if (!isLoaded.value) {
            return;
        }
        const changedVsSaved = formData.queryLogic !== savedData.queryLogic || Number(formData.queryInterval) !== Number(savedData.queryInterval);
        const changedVsDefault = formData.queryLogic !== defaultData.queryLogic || Number(formData.queryInterval) !== Number(defaultData.queryInterval);
        emitter.emit('confirmDisabled', { status: !changedVsSaved, isSave: true });
        emit('defaultRestoreAll', changedVsDefault);
    }
);

onMounted(() => {
    emitter.on('InputEmitter', onInputEmitter);
    Promise.allSettled([getShellConfigQuery()]);
});
onBeforeUnmount(() => {
    emitter.off('InputEmitter', onInputEmitter);
});
</script>

<style scoped lang="less">
@import '../styles/xshellConfigRight.less';

.persistent-data-rule-container {
    min-width: 952px;
    padding-left: 30px;
    padding-right: 18px;
    padding-bottom: 14px;
}
// 标题与首个表单项、两个表单项之间上下间距均为16px
.form-box {
    padding-top: 16px;

    :deep(.m-form-item) {
        margin-bottom: 0;
    }
}
.form-box-data {
    margin-top: 0;

    & + .form-box-data {
        margin-top: 16px;
    }
}
.control-line {
    display: flex;
    align-items: center;
}
.radio-list {
    display: flex;
    align-items: center;
    line-height: 14px;
}
.tips-content {
    p {
        margin: 0;
        line-height: 20px;
    }
    p + p {
        margin-top: 6px;
    }
}
</style>
