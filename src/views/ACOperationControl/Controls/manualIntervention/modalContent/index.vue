<template>
    <m-modal
        v-model:visible="showModal"
        :append-to="$modalAppendTo"
        type="default"
        :title="i18n.global.t('meos_control_web.new_yushu_building')"
        align-center
        :width="420"
        :need-scrollbar="false"
        content-class-name="modal-content-wrap-custom"
        @close="closeModal"
    >
        <template #content>
            <div :key="pickerList.length" class="modal-content-wrap">
                <div class="content-wrap">
                    <div class="title-wrap">
                        <span>{{ i18n.global.t('meos_control_web.intervention_type') }}</span
                        ><span>*</span>
                    </div>
                    <div class="intervention-type">
                        <m-radio-group v-model="interventionType.value">
                            <m-radio v-for="item in interventionType.option" :key="item.value" :label="item.value" :size="14"> {{ item.label }}</m-radio>
                        </m-radio-group>
                    </div>
                </div>
                <!-- 干预时间段设置 -->
                <div class="content-wrap">
                    <div class="header-wrap big">
                        <div class="title-wrap">
                            <span>{{ i18n.global.t('meos_control_web.intervention_time_setting') }}</span
                            ><span>*</span>
                        </div>
                        <m-tips
                            :content="i18n.global.t('meos_control_web.add_time_segment_max_5')"
                            theme="darkTransparent"
                            placement="top"
                            trigger="hover"
                            :disabled="!disabledAddTime"
                        >
                            <m-button type="link" size="medium" :disabled="disabledAddTime" @click="addTimeRange">{{
                                i18n.global.t('meos_control_web.add_time_segment')
                            }}</m-button>
                        </m-tips>
                    </div>
                    <div class="time-wrap">
                        <div v-for="item in pickerList" :key="item.id" class="picker-wrap">
                            <m-date-picker
                                v-model="item.value"
                                :time-picker="{ format: 'hm' }"
                                type="datetimerange"
                                :width="pickerList.length > 1 ? 346 : 372"
                                :error-info="item.errorInfo"
                                @change="e => timeChange(e, item.id)"
                                @blur="item.errorInfo = item.value ? '' : i18n.global.t('meos_control_web.input_required_check_error_4')"
                            ></m-date-picker>
                            <m-tips :content="i18n.global.t('common.delete')" theme="darkTransparent" placement="top" trigger="hover">
                                <span v-show="pickerList.length > 1" class="delete-icon" @click="deleteTime(item.id)">
                                    <m-button type="icon" icon="IconMeriActionDelete" size="small"></m-button>
                                </span>
                            </m-tips>
                        </div>
                    </div>
                </div>
                <!-- 是否覆盖下级 -->
                <div v-show="interventionType.value === 1" class="content-wrap">
                    <div class="header-wrap big">
                        <div class="title-wrap">
                            <span>{{ i18n.global.t('meos_control_web.override_lower_levels') }}</span
                            ><span>*</span>
                        </div>
                        <ChildInfo></ChildInfo>
                    </div>
                    <div style="margin-top: 8px">
                        <m-radio-group v-model="childInfo.radioValue">
                            <m-radio v-for="item in childInfo.radioOption" :key="item.value" :label="item.value" :size="14"> {{ item.label }}</m-radio>
                        </m-radio-group>
                    </div>
                </div>
                <!-- 选择空间 -->
                <div v-show="interventionType.value === 2" class="content-wrap">
                    <div class="title-wrap">
                        <span>{{ i18n.global.t('meos_control_web.select_space') }}</span
                        ><span>*</span>
                    </div>
                    <div style="margin-top: 8px" :class="{ 'tree-error': selectSpace.errorInfo }">
                        <m-tree-select
                            v-model="selectSpace.selected"
                            :data="selectSpace.option"
                            panel-searchable
                            multiple
                            :width="372"
                            :menu-size="372"
                            :clearable="true"
                            @change="treeChange"
                            @blur="selectSpace.errorInfo = selectSpace.selected?.length > 0 ? '' : i18n.global.t('meos_control_web.input_required_check_error_4')"
                        >
                        </m-tree-select>
                        <span v-show="selectSpace.errorInfo" class="select-error-text">{{ selectSpace.errorInfo }}</span>
                    </div>
                </div>
                <div class="content-wrap">
                    <div class="title-wrap">
                        <span>{{ i18n.global.t('meos_control_web.turn_on_ac_or_not') }}</span
                        ><span>*</span>
                    </div>
                    <div style="margin-top: 8px">
                        <m-radio-group v-model="airCondition.value">
                            <m-radio v-for="item in airCondition.option" :key="item.value" :label="item.value" :size="14"> {{ item.label }}</m-radio>
                        </m-radio-group>
                    </div>
                </div>
                <div class="content-wrap">
                    <div class="title-wrap">
                        <span>{{ i18n.global.t('meos_control_web.env_temp_setpoint') }}</span
                        ><span>*</span>
                    </div>
                    <div class="input-wrap">
                        <m-input-number
                            v-model="tempMeta.value"
                            :error-text="tempMeta.errorText"
                            :width="168 + 76"
                            text-align="left"
                            controls="rightButton"
                            @input="tempMeta.errorText = ''"
                            @blur="blur('tempMeta')"
                        >
                            <template #suffix> <div class="input-unit">℃</div></template>
                        </m-input-number>
                        <div class="input-text">{{ tempMeta.errorText ? '' : i18n.global.t('meos_control_web.range_minus_99_9_to_99_9_alt') }}</div>
                    </div>
                </div>
                <div class="content-wrap">
                    <div class="title-wrap">
                        <span>{{ i18n.global.t('meos_control_web.co2_concentration_setpoint') }}</span>
                    </div>
                    <div class="input-wrap">
                        <m-input-number
                            v-model="carbonMeta.value"
                            :error-text="carbonMeta.errorText"
                            :width="168 + 76"
                            controls="rightButton"
                            text-align="left"
                            @input="carbonMeta.errorText = ''"
                            @blur="blur('carbonMeta')"
                        >
                            <template #suffix> <div class="input-unit">ppm</div></template>
                        </m-input-number>
                        <div class="input-text">{{ carbonMeta.errorText ? '' : i18n.global.t('meos_control_web.range_minus_99_9_to_99_9_alt') }}</div>
                    </div>
                </div>
                <div class="content-wrap">
                    <div class="title-wrap">
                        <span>{{ i18n.global.t('meos_control_web.reason') }}</span
                        ><span>*</span>
                    </div>
                    <div class="input-wrap">
                        <m-input
                            v-model="reasonMeta.value"
                            :clearable="true"
                            :maxlength="100"
                            show-word-limit
                            type="textarea"
                            :height="80"
                            :placeholder="i18n.global.t('meos_control_web.please_input_specific_reason')"
                            :error-text="reasonMeta.errorText"
                            @input="reasonMeta.errorText = ''"
                            @blur="reasonMeta.errorText = reasonMeta.value ? '' : i18n.global.t('meos_control_web.input_required_check_error_4')"
                        >
                        </m-input>
                        <span v-show="reasonMeta.errorText" class="select-error-text">{{ reasonMeta.errorText }}</span>
                    </div>
                </div>
            </div>
        </template>
        <template #footer>
            <m-button type="default" @click.stop="closeModal">{{ i18n.global.t('common.cancel') }}</m-button>
            <m-button type="primary" @click.stop="save">{{ i18n.global.t('common.confirm') }}</m-button>
        </template>
    </m-modal>
</template>
<script setup>
import ChildInfo from './ChildInfo.vue';
import { $Message } from 'meri-plus';
import dayjs from 'dayjs';
import i18n from '@/localization';
import { dayjsIsBefore, dayjsIsSameOrAfter, dayjsIsSameOrBefore } from '@/utils/dayjsTools';

const props = defineProps({
    // 是否展示弹窗
    modelValue: {
        type: Boolean,
        default: false
    },
    // 是否单空间
    isSingleSpace: {
        type: Boolean,
        default: false
    },
    // 弹框模式 新增 'add' | 'edit'
    type: {
        type: String,
        default: 'add'
    }
});

const showModal = ref(props.modelValue);

const emit = defineEmits(['update:modelValue']);

const closeModal = () => {
    emit('update:modelValue', false);
};
// const modalVisible = ref(true);

const interventionType = ref({
    value: 1,
    option: [
        { label: i18n.global.t('meos_control_web.batch_intervention'), value: 1 },
        { label: i18n.global.t('meos_control_web.specified_space_intervention'), value: 2 }
    ]
});

// !------------------------------------------------------------------------------------干预时间段设置
const pickerList = ref([{ id: 1, value: '', errorInfo: '' }]);

// &禁用新增
const disabledAddTime = computed(() => {
    return pickerList.value.length >= 5;
});

// >新增时间段
const addTimeRange = () => {
    if (disabledAddTime.value) return;
    let newId;
    if (pickerList.value.length === 0) {
        newId = 1;
    }
    newId = Math.max(...pickerList.value.map(item => item.id)) + 1;
    const newItem = {
        id: newId,
        value: '',
        errorInfo: ''
    };
    pickerList.value.push(newItem);
};
// 判断时间是否重叠
const isOverlap = (range1, range2) => {
    const range1List = range1.split('-');
    const range2List = range2.split('-');

    const range1Start = range1List[0];
    const range1End = range1List[1];
    const range2Start = range2List[0];
    const range2End = range2List[1];

    const start1 = dayjs(range1Start);
    const end1 = dayjs(range1End);
    const start2 = dayjs(range2Start);
    const end2 = dayjs(range2End);
    return dayjsIsSameOrBefore(start1, end2) && dayjsIsSameOrAfter(end1, start2);
};

//监听时间是否重复
const verifyTime = () => {
    const timeList = pickerList.value.filter(res => res.value);
    if (timeList.length === 1) {
        timeList[0].errorInfo = '';
    }
    //时间列表大于2才进行校验
    if (timeList.length > 1) {
        timeList[0].errorInfo = '';
        for (let i = 1; i < timeList.length; i++) {
            const targetItem = timeList[i];
            const compareList = timeList.slice(0, i);
            const isOverlapTime = compareList.some(res => isOverlap(targetItem.value, res.value));
            targetItem.errorInfo = isOverlapTime ? i18n.global.t('meos_control_web.time_no_overlap_allowed') : '';
        }
    }
};
// >时间变化
const timeChange = (v, id) => {
    let findItem = pickerList.value.find(res => res.id === id);
    findItem.errorInfo = '';
    if (!v) {
        findItem.errorInfo = i18n.global.t('meos_control_web.input_required_check_error_4');
    }
    // 判断时间是否重叠
    verifyTime();
};

// >删除时间
const deleteTime = id => {
    const index = pickerList.value.findIndex(item => item.id === id);
    if (index !== -1) {
        pickerList.value.splice(index, 1);
    }
    verifyTime();
};
// 下级对象
const childInfo = ref({
    tips: '',
    radioValue: 1,
    radioOption: [
        { label: i18n.global.t('meos_control_web.do_not_override'), value: 1 },
        { label: i18n.global.t('meos_control_web.overwrite'), value: 2 }
    ]
});

// 选择空间
const selectSpace = ref({
    selected: [],
    errorInfo: '',
    option: [
        {
            id: 'SE',
            name: i18n.global.t('meos_control_web.hv_specialty'),
            children: [
                {
                    id: 'SESD',
                    name: i18n.global.t('meos_control_web.hv_civil_defense_system'),
                    children: [
                        {
                            id: 'SDCU',
                            objCode: 'SDCU',
                            name: ''
                        }
                    ]
                },
                {
                    id: 'SESD',
                    name: i18n.global.t('meos_control_web.hv_civil_defense_system'),
                    children: [
                        {
                            id: 'SDCU',
                            objCode: 'SDCU',
                            name: ''
                        }
                    ]
                }
            ]
        },
        {
            id: 'SE',
            name: i18n.global.t('meos_control_web.hv_specialty'),
            children: [
                {
                    id: 'SESD',
                    name: i18n.global.t('meos_control_web.hv_civil_defense_system'),
                    children: [
                        {
                            id: 'SDCU',
                            objCode: 'SDCU',
                            name: ''
                        }
                    ]
                },
                {
                    id: 'SESD',
                    name: i18n.global.t('meos_control_web.hv_civil_defense_system'),
                    children: [
                        {
                            id: 'SDCU',
                            objCode: 'SDCU',
                            name: ''
                        }
                    ]
                }
            ]
        },
        {
            id: 'SE',
            name: i18n.global.t('meos_control_web.hv_specialty'),
            children: [
                {
                    id: 'SESD',
                    name: i18n.global.t('meos_control_web.hv_civil_defense_system'),
                    children: [
                        {
                            id: 'SDCU',
                            objCode: 'SDCU',
                            name: ''
                        }
                    ]
                },
                {
                    id: 'SESD',
                    name: i18n.global.t('meos_control_web.hv_civil_defense_system'),
                    children: [
                        {
                            id: 'SDCU',
                            objCode: 'SDCU',
                            name: ''
                        }
                    ]
                }
            ]
        }
    ]
});
const treeChange = v => {
    if (!v || v.length === 0) {
        selectSpace.value.errorInfo = i18n.global.t('meos_control_web.input_required_check_error_4');
    } else {
        selectSpace.value.errorInfo = '';
    }
};
// 空调
const airCondition = ref({
    value: 1,
    option: [
        { label: i18n.global.t('meos_control_web.yes'), value: 1 },
        { label: i18n.global.t('common.no'), value: 2 }
    ]
});

// 温度
const tempMeta = ref({
    value: '',
    errorText: ''
});

//二氧化碳
const carbonMeta = ref({
    value: '',
    errorText: ''
});

const blur = type => {
    if (type === 'tempMeta') {
        if (tempMeta.value.value === '' || tempMeta.value.value == null || tempMeta.value.value === undefined) {
            tempMeta.value.errorText = i18n.global.t('meos_control_web.input_required_check_error_4');
        } else {
            if (Number(tempMeta.value.value) > 99.99 || Number(tempMeta.value.value) < -99.99) {
                tempMeta.value.errorText = i18n.global.t('meos_control_web.range_minus_99_9_to_99_9_alt');
            }
        }
    } else {
        if (carbonMeta.value.value === '' || carbonMeta.value.value == null || carbonMeta.value.value === undefined) {
            carbonMeta.value.errorText = i18n.global.t('meos_control_web.input_required_check_error_4');
        } else {
            if (Number(carbonMeta.value.value) > 99.99 || Number(carbonMeta.value.value) < -99.99) {
                carbonMeta.value.errorText = i18n.global.t('meos_control_web.range_minus_99_9_to_99_9_alt');
            }
        }
    }
};

const reasonMeta = ref({
    value: '',
    errorText: ''
});

const verify = () => {
    const errorTask = [];
    //干预时段校验
    pickerList.value.forEach(res => {
        if (!res.value) {
            res.errorInfo = i18n.global.t('meos_control_web.input_required_check_error_4');
            errorTask.push(res.errorInfo);
        } else {
            if (res.errorInfo === i18n.global.t('meos_control_web.time_no_overlap_allowed')) errorTask.push(res.errorInfo);
        }
    });
    // 选择空间校验
    if (interventionType.value.value === 2 && (!selectSpace.value.selected || selectSpace.value.selected.length === 0)) {
        selectSpace.value.errorInfo = i18n.global.t('meos_control_web.input_required_check_error_4');
        errorTask.push(selectSpace.value.errorInfo);
    }
    // 环境温度校验
    if (tempMeta.value.value === '' || tempMeta.value.value == null || tempMeta.value.value === undefined) {
        tempMeta.value.errorText = i18n.global.t('meos_control_web.input_required_check_error_4');
    } else {
        if (Number(tempMeta.value.value) > 99.99 || Number(tempMeta.value.value) < -99.99) {
            tempMeta.value.errorText = i18n.global.t('meos_control_web.range_minus_99_9_to_99_9_alt');
        }
    }
    errorTask.push(tempMeta.value.errorText);
    // 二氧化碳
    if (carbonMeta.value.value === '' || carbonMeta.value.value == null || carbonMeta.value.value === undefined) {
        carbonMeta.value.errorText = i18n.global.t('meos_control_web.input_required_check_error_4');
    } else {
        if (Number(carbonMeta.value.value) > 99.99 || Number(carbonMeta.value.value) < -99.99) {
            carbonMeta.value.errorText = i18n.global.t('meos_control_web.range_minus_99_9_to_99_9_alt');
        }
    }
    errorTask.push(carbonMeta.value.errorText);
    // 原因校验
    if (reasonMeta.value.value === '' || reasonMeta.value.value == null || reasonMeta.value.value === undefined) {
        reasonMeta.value.errorText = i18n.global.t('meos_control_web.input_required_check_error_4');
        errorTask.push(reasonMeta.value.errorText);
    }

    return errorTask.filter(res => res);
};
// !确定
const save = () => {
    // 校验
    const errorTask = verify();
    if (errorTask.length > 0) {
        if (errorTask.includes(i18n.global.t('meos_control_web.input_required_check_error_4'))) {
            $Message.error({ title: i18n.global.t('meos_control_web.input_required_check_error_4'), className: 'error-message' });
        }
        let noErrorTask = errorTask.filter(title => title !== i18n.global.t('meos_control_web.input_required_check_error_4'));
        console.log('noErrorTask: ', noErrorTask);
        if (noErrorTask && noErrorTask.length > 0) {
            setTimeout(() => {
                $Message.error({ title: i18n.global.t('meos_control_web.input_range_error') });
            }, 100);
        }
        return;
    }
    // !保存或者编辑逻辑
};
</script>
<style lang="less" scoped>
/* 滚动条整体部分 */
::-webkit-scrollbar {
    width: 12px; /* 垂直滚动条宽度 */
    height: 12px; /* 水平滚动条高度 */
}

/* 滚动条轨道 */
::-webkit-scrollbar-track {
    opacity: 0;
    border-radius: 10px; /* 轨道圆角 */
}

/* 滚动条滑块 */
::-webkit-scrollbar-thumb {
    background: rgba(196, 201, 207, 0.8); /* 滑块颜色 */
    border-radius: 10px; /* 滑块圆角 */
}

/* 滑块悬停状态 */
::-webkit-scrollbar-thumb:hover {
    background: rgba(196, 201, 207, 1);
}

.m-tree-select {
    :deep(.m-select-inner) {
        width: 372px !important;
    }
}

.child-info-popover-wrap {
    background: red;
    padding: 16px;
    min-height: 182px;
    width: 300px;
    border-radius: 8px;
}
.modal-content-wrap {
    max-height: calc(100vh - 310px);
    overflow: auto;
    padding: 12px 24px;
    margin-right: 2px;
    .content-wrap {
        margin-bottom: 20px;
        &:last-child {
            margin-bottom: 0;
        }
        .title-wrap {
            line-height: 22px;
            span {
                color: @grey-600;
                font-size: 14px;

                font-weight: var(--platform-font-weight);
                &:nth-child(2) {
                    color: @red-500;
                    margin-left: 4px;
                }
            }
        }
        .header-wrap {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .child-info {
            flex: 1;
            display: flex;
            align-items: center;
            // background: red;
            margin-left: 4px;
            span {
                display: inline-block;
            }
            .tip-icon {
                cursor: pointer;
                width: 14px;
                height: 14px;
            }
            .split {
                width: 1px;
                height: 14px;
                background: #d9d9d9;
                margin: 0 6px 0 10px;
            }
        }
        .intervention-type {
            margin-top: 8px;
        }
        .time-wrap {
            margin-top: 12px;

            .picker-wrap {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 16px;
                &:last-child {
                    margin-bottom: 0px;
                }
            }
            .delete-icon {
                display: inline-block;
                margin-left: 8px;
                .m-button {
                    width: 18px;
                    height: 18px;
                }
            }
        }
        .input-wrap {
            margin-top: 8px;
            .select-error-text {
                color: @red-500;
                font-size: 12px;
                line-height: 15px;
                margin-top: 4px;
            }
            .m-input-textarea {
                :deep(textarea) {
                    resize: none;
                }
            }
            .m-input-number {
                :deep(.suffix-text) {
                    width: 76px;
                }
            }
            .input-unit {
                width: 76px;
                text-align: center;
            }
            .input-text {
                color: @grey-600;
                font-size: 12px;
                margin-top: 4px;
                line-height: 15px;
                height: 15px;
            }
        }
        .big {
            height: 32px;
        }
        .tree-error {
            position: relative;
            .select-error-text {
                position: absolute;
                color: @red-500;
                font-size: 12px;
                line-height: 15px;
                margin-top: 4px;
            }
            .m-tree-select {
                // background: red;
                :deep(.m-select-inner) {
                    border: 1px solid @red-500 !important;
                }
            }
            // background: red;
            // border: 1px solid red;
            // overflow: hidden;
        }
    }
}
</style>
