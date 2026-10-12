<script setup>
import { getTimeStamp, randomString, rangeIsIntersect } from '@/utils/tools';
import { $Message, MMessageBox } from 'meri-plus';
import globalPropertiesModal from '../../../lightingRequirements/components/globalPropertiesModal.vue';
import useStore from '@/store';
import GlobalConfigModal from '@/views/lightingRequirements/components/GlobalConfigModal.vue';
import { ref } from 'vue';
import { addIntervention, validIntervention } from '@/apis/lightingRequirements';
import { SUCCESSCODE } from '@/utils/globalVariables';
import { LightDemandTemplateType } from '@/views/lightingControl/controlAberrantCard/controls/constant';
import dayjs from 'dayjs';
import i18n from '@/localization';

const emits = defineEmits(['ok', 'close']);
const props = defineProps({
    // 编辑干预对象
    editData: {
        type: Object,
        default: null
    },
    // 公共、停车场等
    lightingType: {
        type: String,
        default: 'PUBLIC_AREA_LIGHTING'
    },
    obj: {
        // 建筑、楼层、空间对象，包含名称:localName,objType等
        type: Object,
        default: () => ({
            id: 'Pj9909990007',
            localName: i18n.global.t('meos_control_web.project'),
            objType: 'PROJECT'
        })
    }
});
const store = useStore();
const { base } = store;
const curFloorName = inject('curFloorName');
const spaceModuleInfo = inject('spaceModuleInfo');
const objName = ref('');
const GLOBAL_TYPE_KEY = 'global';
const SPACE_TYPE_KEY = 'spaceType';
const visible = ref(false);
const isSpace = computed(() => {
    const bool1 = props.obj?.objType === 'SPACE';
    const bool2 = [LightDemandTemplateType.BUILDING, LightDemandTemplateType.LANDSCAPE, LightDemandTemplateType.SIGN].includes(props.lightingType);
    return bool1 || bool2;
});
const isEdit = computed(() => props.editData?.id);
const title = computed(() =>
    props.editData?.id
        ? i18n.global.t('meos_control_web.edit_interrupt_name', { name: objName.value ? '-' + objName.value : '' })
        : i18n.global.t('meos_control_web.new_interrupt_name', { name: objName.value ? '-' + objName.value : '' })
);
const loadingConfirm = ref(false);
const timeRangeList = ref([]);
const reason = ref('');
const configList = ref([]);
const globalConfig = computed(() => configList.value?.find(it => it.type === GLOBAL_TYPE_KEY));
const spaceConfigList = computed(() => configList.value?.filter(it => it.type === SPACE_TYPE_KEY));
const allSpaceConfigs = computed(() => {
    let list = [];
    spaceConfigList.value.forEach(it => {
        list.push(...it.configData);
    });
    return {
        space: {
            settings: list
        }
    };
});
// 全局配置显示
const showGlobalCfgEditModal = ref(false);
// 空间配置显示
const shows = ref(false);

const curControlledObjId = ref([props.obj.id]);
const curControlledObjType = ref(props.obj.objType);
const demandTemplateType = ref(props.lightingType);
provide('curControlledObjId', curControlledObjId);
provide('curControlledObjType', curControlledObjType);
provide('demandTemplateType', demandTemplateType);

const editSpaceItem = ref(null);
const spaceItemKey = ref(''); // 用来标记是点击的哪条空间类型配置
//添加空间类型
const addSpaceDisposition = () => {
    editSpaceItem.value = null;
    spaceItemKey.value = '';
    shows.value = true;
};
const dispositionCallback = ({ saveData, showData }) => {
    let list = configList.value.filter(it => it.key !== spaceItemKey.value);
    const obj = toConfigObj(saveData, SPACE_TYPE_KEY, showData);
    list.push(obj);
    configList.value = list;
};
const handleGlobalConfig = () => {
    showGlobalCfgEditModal.value = true;
};
const handleGlobalConfigOk = ({ saveData, showData }) => {
    showGlobalCfgEditModal.value = false;
    const globalConfig = toConfigObj(saveData, GLOBAL_TYPE_KEY, showData);
    let list = configList.value.filter(it => it.type !== GLOBAL_TYPE_KEY);
    list.push(globalConfig);
    configList.value = list;
};
const toConfigObj = (arr, type, showData) => {
    let total = 0,
        openCount = 0;
    arr.forEach(it => {
        if (type === GLOBAL_TYPE_KEY) {
            total += it.circuitSettings?.length ?? 0;
            const openList = it.circuitSettings?.filter(cir => cir.settingMode === 'OPEN');
            openCount += openList?.length ?? 0;
        } else if (type === SPACE_TYPE_KEY) {
            it.funcTypeSettings?.forEach(set => {
                total += set.circuitSettings?.length ?? 0;
                const openList = set.circuitSettings?.filter(cir => cir.settingMode === 'OPEN');
                openCount += openList?.length ?? 0;
            });
        }
    });
    const summary = { total, openCount };
    const obj = {
        type: type,
        key: randomString(16), // key用于空间配置循环显示时的key
        configData: arr, // 保存给后端的数据，精简的
        showData: showData ?? arr, // 显示数据，包含了完整数据
        summary: summary,
        name: type === SPACE_TYPE_KEY ? arr[0]?.spaceFuncTypes?.map(it => it.value)?.join('、') : i18n.global.t('meos_control_web.global_configuration')
    };
    return obj;
};
const addTimeRange = () => {
    timeRangeList.value.push({
        key: randomString(16),
        value: ''
    });
};
const delTimeRange = item => {
    let list = timeRangeList.value.filter(it => it.key !== item.key);
    timeRangeList.value = list;
};
const handleClose = () => {
    visible.value = false;
    setTimeout(() => {
        emits('close');
    }, 300);
};
const delConfig = configItem => {
    let list = configList.value.filter(it => it.key !== configItem.key);
    configList.value = list;
};
const editConfig = (configItem, type) => {
    if (type === GLOBAL_TYPE_KEY) {
        showGlobalCfgEditModal.value = true;
    } else if (type === SPACE_TYPE_KEY) {
        editSpaceItem.value = configItem;
        spaceItemKey.value = configItem.key;
        shows.value = true;
    }
};
const handleConfirm = async () => {
    try {
        loadingConfirm.value = true;
        const pass = await validForm();
        console.log('校验结果', pass);
        if (!pass) {
            return;
        }
        // 保存
        const params = {
            id: props.editData?.id,
            runningMonitorSecondType: props.lightingType,
            instanceId: curControlledObjId.value[0],
            instanceType: curControlledObjType.value,
            reason: reason.value,
            timeSlot: timeRangeList.value?.map(time => {
                let arr = time.value.split('-');
                const obj = {
                    beginDateTime: arr[0].replaceAll('.', '-') + ':00',
                    endDateTime: arr[1].replaceAll('.', '-') + ':00'
                };
                return obj;
            }),
            interventionConfig: {
                globalSettings: globalConfig.value ? globalConfig.value.configData : [],
                spaceSettings: spaceConfigList.value.map(it => it.configData[0])
            }
        };
        const { result } = await addIntervention(params);
        if (result === 'success') {
            $Message.success({
                title: `${props.editData?.id ? i18n.global.t('meos_control_web.edit_intervene_success') : i18n.global.t('meos_control_web.add_intervention_success')}`
            });
        }
        emits('ok');
        handleClose();
    } catch (e) {
        console.error(e);
    } finally {
        loadingConfirm.value = false;
    }
};
const validForm = async () => {
    await nextTick(() => {
        timeRangeList.value?.forEach(it => {
            it.errMsg = '';
        });
    });
    let msg = '',
        pass = true;
    // 1.校验必填项
    timeRangeList.value?.forEach(it => {
        if (!it.value) {
            pass = false;
            msg = i18n.global.t('meos_control_web.input_required_check_error_4');
            it.errMsg = msg;
        }
    });
    if (!pass && msg) {
        $Message.error({ title: msg });
        return false;
    }
    // 时间校验
    const nowTime = new Date().getTime();
    timeRangeList.value?.forEach(it => {
        const arr = it.value.split('-');
        const time1After = getTimeStamp(arr[0]) < nowTime;
        const time2After = getTimeStamp(arr[1]) < nowTime;
        // 新增的时候才全部判断：时间不能早于当前时间
        const isAdd = !props.editData?.id;
        if (isAdd) {
            if (time1After || time2After) {
                pass = false;
                it.errMsg = i18n.global.t('meos_control_web.time_cannot_be_past');
            }
            // 编辑的时候不允许更改开始时间，判断结束时间：时间不能早于当前时间
        } else if (time2After) {
            pass = false;
            it.errMsg = i18n.global.t('meos_control_web.time_cannot_be_past');
        }
    });
    if (!pass) {
        return false;
    }
    // 时间段重复校验
    for (let i = 0; i < timeRangeList.value.length - 1; i++) {
        for (let j = i + 1; j < timeRangeList.value.length; j++) {
            const time1 = timeRangeList.value[i];
            const time2 = timeRangeList.value[j];
            // 判断两个时间段是否有交集
            const arr1 = time1.value.split('-');
            const arr2 = time2.value.split('-');
            let intersect = rangeIsIntersect([getTimeStamp(arr1[0]), getTimeStamp(arr1[1])], [getTimeStamp(arr2[0]), getTimeStamp(arr2[1])]);
            if (intersect) {
                pass = false;
                const msg = i18n.global.t('meos_control_web.time_no_overlap_allowed');
                timeRangeList.value[i].errMsg = msg;
                timeRangeList.value[j].errMsg = msg;
            }
        }
    }
    if (!pass) {
        return false;
    }
    // 要接口判断 当前对象已选干预时段与其他人工干预时段重合校验
    const params = {
        id: props.editData?.id,
        runningMonitorSecondType: props.lightingType,
        instanceId: curControlledObjId.value[0],
        instanceType: curControlledObjType.value,
        timeSlot: timeRangeList.value?.map(time => {
            let arr = time.value.split('-');
            const obj = {
                beginDateTime: arr[0].replaceAll('.', '-') + ':00',
                endDateTime: arr[1].replaceAll('.', '-') + ':00'
            };
            return obj;
        })
    };
    const res = await validIntervention(params);
    if (res && res.code === SUCCESSCODE) {
        const success = res.data;
        if (!success) {
            await MMessageBox({
                title: '',
                confirmButtonText: i18n.global.t('meos_control_web.got_it'),
                showCancelButton: false,
                message: i18n.global.t('meos_control_web.intervention_time_conflict_please_reselect')
            }).then(() => {});
            return false;
        }
    }
    // 配置校验
    if (!globalConfig.value && !spaceConfigList.value.length) {
        await MMessageBox({
            title: '',
            confirmButtonText: i18n.global.t('meos_control_web.got_it'),
            showCancelButton: false,
            message: i18n.global.t('meos_control_web.lighting_config_missing_submit_after_add')
        }).then(() => {});
        return false;
    }
    return true;
};

const init = async () => {
    // 如果是编辑，请求数据,或者传入数据？
    if (props.editData?.id) {
        const replaceTime = time => {
            return time?.replaceAll('-', '.').substring(0, time?.length - 3);
        };
        timeRangeList.value = [
            {
                key: props.editData?.id,
                value: `${replaceTime(props.editData.beginTime)}-${replaceTime(props.editData.endTime)}`
            }
        ];
        reason.value = props.editData?.reason ?? '';
        const configData = props.editData?.configData;
        let list = [];
        if (configData.global?.funcTypeSettings?.length) {
            list.push(toConfigObj(configData.global?.funcTypeSettings, GLOBAL_TYPE_KEY, configData.global?.funcTypeSettings));
        }
        // 空间配置,看结构是啥样后再处理
        if (configData.space?.settings?.length) {
            configData.space?.settings.forEach(item => {
                list.push(toConfigObj([item], 'spaceType', [item]));
            });
        }
        configList.value = list;
    }
};

// 将时间范围调整为5分钟整数倍边界
// const transformTimeToFiveMinutes = (range, format = 'YYYY.MM.DD HH:mm') => {
//     if (!Array.isArray(range) || range.length !== 2) {
//         throw new Error('Invalid range format. Expected array with [start, end]');
//     }

//     const [start, end] = range;
//     const startDate = new Date(start);
//     const endDate = new Date(end);

//     if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
//         throw new Error('Invalid date string in range');
//     }

//     const startMinutes = startDate.getMinutes();
//     const endMinutes = endDate.getMinutes();

//     const newStartMinutes = startMinutes % 5 === 0 ? startMinutes : Math.ceil(startMinutes / 5) * 5;
//     const newEndMinutes = endMinutes % 5 === 0 ? endMinutes : Math.floor(endMinutes / 5) * 5;

//     startDate.setMinutes(newStartMinutes);
//     endDate.setMinutes(newEndMinutes);

//     // Handle edge case where adjusted end < start
//     if (startDate > endDate) {
//         throw new Error('Adjusted time range results in end time earlier than start time');
//     }

//     const newStart = dayjs(startDate).format(format);
//     const newEnd = dayjs(endDate).format(format);
//     return [newStart, newEnd];
// };

const timeChange = range => {
    const [start, end] = range.value?.split('-') || [];
    if (props.editData?.id && range.key === props.editData?.id) {
        const { beginTime } = props.editData || {};
        if (!beginTime) {
            return;
        }

        try {
            const beginTimeStr = dayjs(beginTime).format('YYYY.MM.DD HH:mm');
            const startTimeStr = dayjs(start).format('YYYY.MM.DD HH:mm');
            const isActive = new Date(beginTime) <= new Date();
            const isModify = beginTimeStr !== startTimeStr;
            if (isActive && isModify) {
                MMessageBox({
                    title: i18n.global.t('meos_control_web.start_time_not_editable'),
                    confirmButtonText: i18n.global.t('meos_control_web.got_it'),
                    showCancelButton: false,
                    message: i18n.global.t('meos_control_web.intervention_active_cannot_edit_start')
                }).then(() => {
                    nextTick(() => {
                        timeRangeList.value.forEach(item => {
                            if (item.key === props.editData?.id) {
                                item.value = `${beginTimeStr}-${end}`;
                            }
                        });
                    });
                });
            }
        } catch (error) {
            console.log(error);
        }
    }
};

onMounted(async () => {
    if (props.obj.objType === 'PROJECT') {
        objName.value = base?.projectName;
    } else if (props.obj.objType === 'FLOOR') {
        objName.value = curFloorName.value;
    } else if (props.obj.objType === 'SPACE') {
        objName.value = (spaceModuleInfo?.localName || spaceModuleInfo?.value?.localName) ?? '--';
    }
    visible.value = true;
    console.log('props', props);
    await init();
    if (!timeRangeList.value?.length) {
        addTimeRange();
    }
});
</script>

<template>
    <m-modal :append-to="$modalAppendTo" :visible="visible" :title="title" width="420" type="default" @close="handleClose">
        <template #content>
            <div class="content-wrap">
                <div class="time-range-wrap">
                    <div class="time-range-title-wrap">
                        <div class="label">{{ i18n.global.t('meos_control_web.intervention_time_setting') }}<label class="required">*</label></div>
                        <m-tips
                            :disabled="!(timeRangeList.length >= 5 || isEdit)"
                            :content="isEdit ? i18n.global.t('meos_control_web.cannot_add_time_in_edit_mode') : i18n.global.t('meos_control_web.add_new_time_segment_max_5')"
                            theme="darkTransparent"
                            placement="top"
                            trigger="hover"
                        >
                            <m-button type="link" size="medium" :disabled="timeRangeList.length >= 5 || isEdit" @click="addTimeRange">{{
                                i18n.global.t('meos_control_web.add_time_segment')
                            }}</m-button>
                        </m-tips>
                    </div>
                    <div class="time-range-content-wrap">
                        <div v-for="range in timeRangeList" :key="range.key" class="time-range-item">
                            <m-date-picker
                                v-model="range.value"
                                :width="timeRangeList.length > 1 ? 346 : 372"
                                :time-picker="{
                                    format: 'hm',
                                    stepM: 5
                                }"
                                type="datetimerange"
                                :placeholder="i18n.global.t('meos_control_web.start_time_to_end_time')"
                                :error-info="range.errMsg"
                                :clearable="false"
                                :scope="`${new Date()} - ${new Date(new Date().setHours(0, 0, 0, 0) + 24 * 60 * 60 * 1000 * 2 - 1)}`"
                                @change="timeChange(range)"
                            ></m-date-picker>
                            <m-tips :content="i18n.global.t('common.delete')" theme="darkTransparent" placement="top" trigger="hover">
                                <span v-show="timeRangeList.length > 1" class="delete-icon" @click="delTimeRange(range)">
                                    <m-button type="icon" icon="IconMeriActionDelete" size="small"></m-button>
                                </span>
                            </m-tips>
                        </div>
                    </div>
                </div>
                <div class="reason-wrap">
                    <div class="label">{{ i18n.global.t('meos_control_web.reason') }}</div>
                    <div class="reason-content">
                        <m-input
                            v-model="reason"
                            :type="'textarea'"
                            :placeholder="i18n.global.t('meos_control_web.please_input_specific_reason')"
                            :maxlength="100"
                            :width="372"
                            :height="80"
                            show-word-limit
                        ></m-input>
                    </div>
                </div>
                <div class="intervene-config-wrap">
                    <div class="label">{{ i18n.global.t('meos_control_web.intervention_config') }}<label class="required">*</label></div>
                    <div class="intervene-config-content">
                        <div class="add-btn-wrap">
                            <m-button :disabled="globalConfig" @click.stop="handleGlobalConfig">{{ i18n.global.t('meos_control_web.global_configuration') }}</m-button>
                            <m-button v-if="!isSpace" @click="addSpaceDisposition">{{ i18n.global.t('meos_control_web.add_space_type_config') }}</m-button>
                        </div>
                        <div class="config-content-wrap">
                            <div v-if="globalConfig" class="config-wrap">
                                <div class="config-title">
                                    <div v-ellipsis class="m-ellipsis title-text">{{ i18n.global.t('meos_control_web.global_configuration') }}</div>
                                    <div class="statistic">
                                        <span>{{ i18n.global.t('meos_control_web.loop_on_colon') }}</span>
                                        <span>{{ globalConfig?.summary?.openCount ?? '--' }}/{{ globalConfig?.summary?.total ?? '--' }}</span>
                                    </div>
                                </div>
                                <div class="title-right">
                                    <m-popover :content="i18n.global.t('meos_control_web.clear_configuration')" :enterable="true" theme="dark">
                                        <m-button type="icon" icon="IconMeriActionDelete" size="medium" @click.stop="delConfig(globalConfig)">{{
                                            i18n.global.t('meos_control_web.icon_button')
                                        }}</m-button>
                                    </m-popover>
                                    <i></i>
                                    <m-popover :content="i18n.global.t('common.edit')" :enterable="true" theme="dark">
                                        <m-button type="icon" icon="IconMeriActionEditor" size="medium" @click.stop="editConfig(globalConfig, GLOBAL_TYPE_KEY)">{{
                                            i18n.global.t('meos_control_web.icon_button')
                                        }}</m-button>
                                    </m-popover>
                                </div>
                            </div>
                            <div v-if="spaceConfigList.length && globalConfig" class="line"></div>
                            <div v-for="config in spaceConfigList" :key="config.key" class="config-wrap">
                                <div class="config-title">
                                    <div v-ellipsis class="m-ellipsis title-text">{{ config.name }}</div>
                                    <div class="statistic">
                                        <span>{{ i18n.global.t('meos_control_web.loop_on_colon') }}</span>
                                        <span>{{ config?.summary?.openCount ?? '--' }}/{{ config?.summary?.total ?? '--' }}</span>
                                    </div>
                                </div>
                                <div class="title-right">
                                    <m-popover :content="i18n.global.t('meos_control_web.clear_configuration')" :enterable="true" theme="dark">
                                        <m-button type="icon" icon="IconMeriActionDelete" size="medium" @click.stop="delConfig(config)">{{
                                            i18n.global.t('meos_control_web.icon_button')
                                        }}</m-button>
                                    </m-popover>
                                    <i></i>
                                    <m-popover :content="i18n.global.t('common.edit')" :enterable="true" theme="dark">
                                        <m-button type="icon" icon="IconMeriActionEditor" size="medium" @click.stop="editConfig(config, SPACE_TYPE_KEY)">{{
                                            i18n.global.t('meos_control_web.icon_button')
                                        }}</m-button>
                                    </m-popover>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </template>

        <template #footer>
            <div class="note_modal_footer">
                <m-button @click="handleClose">{{ i18n.global.t('common.cancel') }}</m-button>
                <m-button type="primary" :loading="loadingConfirm" @click="handleConfirm">{{ i18n.global.t('common.confirm') }}</m-button>
            </div>
        </template>
    </m-modal>
    <globalPropertiesModal
        v-model="shows"
        :type-distinction="'illumination'"
        :default-data="allSpaceConfigs ?? {}"
        :init-spaces="editSpaceItem?.showData[0] ?? {}"
        :is-quote="false"
        @after-save="dispositionCallback"
    />
    <GlobalConfigModal v-model="showGlobalCfgEditModal" :init-setting="globalConfig?.showData ?? []" :is-intervene="true" :is-quote="false" @ok="handleGlobalConfigOk" />
</template>

<style scoped lang="less">
.required {
    color: var(--red-500);
}
.label {
    color: var(--gray-600);
    font-size: 14px;
    font-style: normal;
    font-weight: var(--platform-font-weight);
    line-height: 22px; /* 157.143% */
}
.line {
    width: 100%;
    border-bottom: 1px dashed var(--gray-400);
}
.content-wrap {
    display: flex;
    flex-direction: column;
    gap: 24px;
    .time-range-wrap {
        .time-range-title-wrap {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .time-range-content-wrap {
            margin-top: 3px;
            display: flex;
            flex-direction: column;
            gap: 16px;
            .time-range-item {
                width: 100%;
                display: flex;
                align-items: center;
                justify-content: space-between;
                .delete-icon {
                    display: inline-block;
                    margin-left: 8px;
                    .m-button {
                        width: 18px;
                        height: 18px;
                    }
                }
            }
        }
    }
    .reason-wrap {
        .reason-content {
            margin-top: 8px;
        }
    }
    .intervene-config-wrap {
        .intervene-config-content {
            margin-top: 8px;
            .add-btn-wrap {
                display: flex;
                gap: 8px;
            }
            .config-content-wrap {
                margin-top: 8px;
                display: flex;
                flex-direction: column;
                gap: 8px;
                .config-wrap {
                    display: flex;
                    padding: 6px 8px 6px 12px;
                    align-items: center;
                    justify-content: space-between;
                    gap: 12px;
                    border-radius: 4px;
                    background: var(--gray-100);
                    overflow: hidden;
                    .config-title {
                        //width: calc(100% - 136px);
                        display: flex;
                        align-items: center;
                        overflow: hidden;
                        .title-text {
                            color: var(--gray-900);
                            font-size: 14px;
                            font-style: normal;
                            font-weight: 700;
                            line-height: 22px; /* 157.143% */
                        }
                        .statistic {
                            flex-shrink: 0;
                            span:nth-of-type(1) {
                                display: inline-block;
                                color: var(--gray-600);
                                font-size: 12px;
                                font-style: normal;
                                font-weight: var(--platform-font-weight);
                                line-height: 20px; /* 166.667% */
                                margin-left: 8px;
                            }
                            span:nth-of-type(2) {
                                display: inline-block;
                                color: var(--gray-900);
                                font-size: 12px;
                                font-style: normal;
                                font-weight: var(--platform-font-weight);
                                line-height: 20px; /* 166.667% */
                            }
                        }
                    }
                    .title-right {
                        display: flex;
                        align-items: center;
                        i {
                            margin: 0 4px;
                            width: 1px !important;
                            height: 12px;
                            background: var(--gray-300);
                        }
                    }
                }
            }
        }
    }
}
</style>
