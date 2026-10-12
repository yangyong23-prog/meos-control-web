<template>
    <div class="container">
        <div class="fcc" style="width: 100%; gap: 10px">
            <m-tips v-for="item in dataSource" :key="item.code" theme="darkTransparent" :content="permissionTip()" placement="top" :disabled="hasPermission()">
                <button class="control-btn" :class="stateStyle(item).classes" :disabled="!hasPermission()" @click="() => switchMode(item)">
                    <div class="control-content">
                        <component :is="stateStyle(item).icon" class="control-icon" />
                        <span v-ellipsis="{ title: item.name }" class="control-label">{{ item.name }}</span>
                        <component :is="stateStyle(item).selTag" class="tag" />
                    </div>
                </button>
            </m-tips>
        </div>
        <!-- 自动模式预选中 -->
        <div v-if="curPreSelectedMode === 'auto'" class="action-panel" style="margin-bottom: 10px; margin-top: 10px">
            <span class="title">{{ i18n.global.t('meos_control_web.switch_auto_mode_device_auto') }}</span>
        </div>
        <!-- 人工模式预选中 -->
        <div v-else-if="showForm" class="action-panel form-modify">
            <m-form ref="Mform" label-position="top" :model="params" require-asterisk-position="right" scroll-to-error>
                <component :is="item.component" v-for="item in formList" :key="item.name" :data="item" :params="params"></component>
            </m-form>
        </div>
        <!-- 自动模式已选中 -->
        <!-- <div v-else-if="curSelectedMode === 'auto'" class="action-panel"> -->
        <!-- <span class="title">切换自动模式后，设备将由系统自动控制</span> -->
        <!-- </div> -->
        <!-- 人工模式已选中 -->
        <div v-else-if="curSelectedMode === 'manual'" class="action-panel" style="margin-top: 10px">
            <span style="color: var(--gray-600); margin-right: 8px">{{ i18n.global.t('meos_control_web.estimated_deadline') }}</span>
            <span v-if="recoveryDateTime" style="color: var(--gray-800)">{{ dayjs(recoveryDateTime).format('YYYY.MM.DD HH:mm') }}</span>
            <span v-else style="color: var(--gray-800)">{{ i18n.global.t('meos_control_web.longterm_until_manually_cancelled') }}</span>
            <m-tips theme="darkTransparent" :content="permissionTip()" placement="top" :disabled="hasPermission()">
                <span class="modify" :class="{ disabled: !hasPermission() }" :style="{ height: '17px' }" @click="modifyManual">{{ i18n.global.t('meos_control_web.modify') }}</span>
            </m-tips>
        </div>
        <!-- 下发按钮 -->
        <div v-if="curPreSelectedMode || (curSelectedMode === 'manual' && modifyManualMode)" style="text-align: left; width: 100%">
            <m-tips :content="i18n.global.t('meos_control_web.operate_interrupt_in_saveing')" :disabled="!btnLoading" theme="darkTransparent">
                <m-button size="small" :disabled="btnLoading" @click="cancel">{{ i18n.global.t('common.cancel') }}</m-button>
            </m-tips>
            <m-button type="primary" size="small" :loading="btnLoading" @click="sendConfirm">{{ i18n.global.t('meos_control_web.send_0') }}</m-button>
        </div>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import { getNextFiveMinutePoint } from '@/utils/tools';
import dayjs from 'dayjs';
import { useGeneralControl } from '@/hooks/useGeneralControl';

import AutoIconUnsel from '@/assets/svg/component/auto_icon_unsel.svg';
import AutoIconPreSel from '@/assets/svg/component/auto_icon_pre_sel.svg';
import AutoIconSel from '@/assets/svg/component/auto_icon_sel.svg';
import AutoIconTag from '@/assets/svg/component/auto_icon_tag.svg';

import ManualIconUnsel from '@/assets/svg/component/manual_icon_unsel.svg';
import ManualIconPreSel from '@/assets/svg/component/manual_icon_pre_sel.svg';
import ManualIconSel from '@/assets/svg/component/manual_icon_sel.svg';
import ManualIconTag from '@/assets/svg/component/manual_icon_tag.svg';
import { INTERVENTION_TIME_V2, REASON_SELECT } from '../ControlForm/config';
import { GET_MENU_CONFIG, IS_AUTO, IS_MANUAL, SUCCESSCODE } from '@/utils/globalVariables';
import DockSingleton from '@/hooks/responsiveDock';
import baseStore from '@/store/baseStore';
import { useSuccessMessage } from '@/utils/tools';
import { isEdge } from '@/utils/envUtils';
import useWatchEffectWithCleanup, { useWatchWithCleanup } from '@/hooks/useWatchEffectWithCleanup';
import { MANUAL_AUTO_SET } from './config';

const props = defineProps({
    id: {
        type: String,
        default: ''
    },
    data: {
        type: Object,
        default: () => ({})
    },
    reasonOptions: {
        type: Array,
        default: () => []
    },
    systemId: {
        type: String,
        default: ''
    },
    permission: {
        type: String,
        default: () => window[GET_MENU_CONFIG]().PERMISSION || ''
    },
    selectObj: {
        type: Object,
        default: () => ({})
    }
});

const dataSource = ref([
    {
        name: i18n.global.t('meos_control_web.system_auto_control'),
        code: 'auto',
        preselIcon: AutoIconPreSel,
        unselIcon: AutoIconUnsel,
        selIcon: AutoIconSel,
        selTag: AutoIconTag,
        dataValue: IS_AUTO
    },
    {
        name: i18n.global.t('meos_control_web.manual1_control'),
        code: 'manual',
        preselIcon: ManualIconPreSel,
        unselIcon: ManualIconUnsel,
        selIcon: ManualIconSel,
        selTag: ManualIconTag,
        dataValue: IS_MANUAL
    }
]);

const curSelectedMode = ref('');
const curPreSelectedMode = ref('');

const cancel = () => {
    if (curSelectedMode.value === 'manual' && modifyManualMode.value) {
        modifyManualMode.value = false;
    }
    if (curPreSelectedMode.value) {
        curPreSelectedMode.value = '';
    }
};

const base = baseStore();

const hasPermission = () => {
    if (!isEdge()) {
        return false;
    }
    // 如果没有传入权限，则默认返回true
    if (!props.permission) {
        return true;
    }
    // 如果传入了权限，则检查是否有权限
    if (base.hasAuth(props.permission)) {
        return true;
    }
    return false;
};

const permissionTip = () => {
    if (!base.hasAuth(props.permission)) {
        return i18n.global.t('meos_control_web.no_operation_permission_contact_admin_for_adding');
    }
    if (!isEdge()) {
        return i18n.global.t('meos_control_web.cloud_not_operate');
    }
    // 如果没有传入权限，则默认返回true
    if (!props.permission) {
        return '';
    }
    // 如果传入了权限，则检查是否有权限
    if (base.hasAuth(props.permission)) {
        return '';
    }
    return i18n.global.t('meos_control_web.no_operation_permission_contact_admin_for_adding');
};

const switchMode = item => {
    if (curSelectedMode.value === item.code) {
        curPreSelectedMode.value = '';
        return;
    }
    if (item.code === curPreSelectedMode.value) {
        return;
    }
    curPreSelectedMode.value = item.code;
    params.value = { operateType: '', operateReason: '' };
};

const stateStyle = item => {
    const classes = [];
    let icon = null,
        selTag = null;

    classes.push(item.code);

    if (item.code === curSelectedMode.value) {
        classes.push(item.code);
        icon = item.selIcon;
        // eslint-disable-next-line prefer-destructuring
        selTag = item.selTag;
    } else if (!hasPermission()) {
        classes.push('no-auth');
        icon = item.preselIcon;
    } else if (item.code === curPreSelectedMode.value) {
        classes.push('pre-sel');
        icon = item.preselIcon;
    } else {
        classes.push('unsel');
        icon = item.unselIcon;
    }

    return { classes, icon, selTag };
};

const btnLoading = ref(false);

const params = ref({
    operateType: '',
    operateReason: ''
});
const formList = computed(() => {
    const scopeDisabledTipsText = i18n.global.t('meos_control_web.only_1_year_range_allowed');
    return [
        INTERVENTION_TIME_V2(`${getNextFiveMinutePoint()}-${dayjs(getNextFiveMinutePoint()).add(1, 'year').format('YYYY.MM.DD HH:mm:00')}`, undefined, undefined, {
            name: '',
            scopeDisabledTipsText
        }),
        REASON_SELECT(undefined, { options: props.reasonOptions })
    ];
});

const { getIotData } = DockSingleton.getInstance();

useWatchEffectWithCleanup(() => {
    const temp = getIotData(props.id, MANUAL_AUTO_SET)?.dataValue;
    console.log('收到手自动推送数据 :>> ', getIotData(props.id, MANUAL_AUTO_SET));
    if (temp) {
        curSelectedMode.value = dataSource.value.find(d => d.dataValue === temp).code;
    }
});

/*
objectIds: [],
        systemId?: '',
        expireTime: ',
        infoValue: '',
        content?: '',
        infoCode: '',
        oneClick?: false
*/
// const hasManual = computed(() => {
//     return getIotData(props.id, MANUAL_AUTO_SET)?.dataValue;
// });
const { controlFn } = useGeneralControl();
const Mform = ref();

const sendConfirm = () => {
    console.log('params :>> ', params.value);

    if (Mform.value) {
        Mform.value?.validate(valid => {
            if (valid) {
                send();
            }
        });
    } else {
        send();
    }
};

const send = () => {
    let infoValue = null;
    if (modifyManualMode.value) {
        const code = curPreSelectedMode.value || curSelectedMode.value;
        infoValue = code === 'manual' ? IS_MANUAL : IS_AUTO;
    } else {
        infoValue = curPreSelectedMode.value === 'manual' ? IS_MANUAL : IS_AUTO;
    }

    const data = {
        objectIds: [props.id],
        infoCode: MANUAL_AUTO_SET,
        expireTime: params.value.expireTime ?? '',
        content: (params.value.operateReason || params.value.operateType) ?? '',
        infoValue,
        systemId: props.systemId
    };
    btnLoading.value = true;
    controlFn({
        data,
        callback: res => {
            if (res?.code === SUCCESSCODE) {
                useSuccessMessage();
                btnLoading.value = false;
                if (curPreSelectedMode.value) {
                    curPreSelectedMode.value = '';
                }
                if (modifyManualMode.value) {
                    modifyManualMode.value = false;
                }
                params.value = {
                    operateType: '',
                    operateReason: ''
                };
            } else {
                // 失败？
                btnLoading.value = false;
            }
        }
    });
};

// 人工控制下的编辑模式
const modifyManualMode = ref(false);
const modifyManual = () => {
    if (!hasPermission()) {
        return;
    }
    modifyManualMode.value = true;
};

// 人工控制下的恢复时间
const recoveryDateTime = computed(() => {
    const data = getIotData(props.data.objectId, MANUAL_AUTO_SET);
    if (data) {
        return data.additionalMapValue?.recoveryDateTime ?? '';
    }
    return '';
});

const showForm = computed(() => {
    return curPreSelectedMode.value === 'manual' || (curSelectedMode.value === 'manual' && modifyManualMode.value);
});

useWatchWithCleanup(showForm, (n, o) => {
    if (n && n !== o) {
        params.value.expireTime = recoveryDateTime.value || '';
    }
});
useWatchWithCleanup(
    () => props.id,
    () => {
        curPreSelectedMode.value = '';
        modifyManualMode.value = false;
        params.value = {
            operateType: '',
            operateReason: ''
        };
    },
    { immediate: true }
);
onMounted(() => {
    console.log('props.data :>> ', props.data);
});
</script>

<style lang="less" scoped>
.manual {
    --set-color: #e68600;
    --set-boder-color: #e68600;
    --set-bg-color: #fffbe6;
    --set-weight: 700;
}
.auto {
    --set-color: #246fe5;
    --set-boder-color: #246fe5;
    --set-bg-color: #ebf6ff;
    --set-weight: 700;
}
.no-auth {
    --set-bg-color: #e8ecf0;
    --set-weight: 400;
    --set-color: #c4c9cf;
    --set-boder-color: #c4c9cf;

    :deep(svg) {
        path {
            stroke: #c4c9cf;
        }
    }
}
.pre-sel {
    --set-bg-color: #fff;
    --set-weight: 700;
}
.unsel {
    --set-color: #2e3742;
    --set-bg-color: #fff;
    --set-boder-color: #c4c9cf;
    --set-weight: 400;
}

.container {
    display: flex;
    align-items: center;
    background-color: var(--gray-50);
    width: 100%;

    border-radius: 8px;
    padding: 8px;

    flex-direction: column;
    align-items: flex-start;

    .control-btn {
        position: relative;
        display: flex;
        flex: 1;
        width: 100%;
        padding: 8px 16px;
        justify-content: center;
        align-items: center;
        gap: 4px;
        border-radius: 4px;
        border: 1px solid var(--set-boder-color);
        background: var(--set-bg-color);

        color: var(--set-color);
        font-size: 14px;
        font-style: normal;
        font-weight: var(--set-weight);
        line-height: 22px; /* 157.143% */
        overflow: hidden;

        .control-content {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 4px;
            width: 100%;
            min-width: 0;
            text-align: center;
        }

        .control-icon {
            flex-shrink: 0;
        }

        .control-label {
            min-width: 0;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        .tag {
            position: absolute;
            right: -1px;
            bottom: -1px;
        }
    }

    .action-panel {
        flex: 1;
        width: 100%;

        .title {
            color: var(--Grey-Grey-600, #626c78);
            font-size: 14px;
            font-style: normal;
            font-weight: 400;
            line-height: normal;
        }

        .modify {
            color: var(--blue-500);
            margin-left: 8px;

            &:hover {
                cursor: pointer;
                color: var(--blue-700);
            }

            &.disabled {
                cursor: not-allowed;
                color: #c4c9cf;
            }
        }
    }
    .form-modify {
        margin-top: 10px;
        :deep(.m-form-item:first-child) {
            .m-form-item__label {
                display: none;
            }
            .intervention-time-form {
                background-color: initial;
                padding: 0px;
            }
        }

        :deep(.reason) {
            // margin-bottom: 0px;
            position: relative;
            &::after {
                content: '';
                display: block;
                position: absolute;
                width: 100%;
                height: 1px;
                top: -9px;
                left: 0;
                background-image: linear-gradient(to right, #c4c9cf 0%, #c4c9cf 50%, transparent 50%);
                background-size: 8px 1px; /* 4px虚线 + 4px间隔 */
            }
        }
        :deep(.form-intervention-time .m-form-item__error) {
            top: 90%;
        }
    }
}
</style>
