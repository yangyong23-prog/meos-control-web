<template>
    <div class="setting-item">
        <div class="pd">
            <div class="fb">
                <div style="flex: 1">
                    <div v-if="item.relInfoCodeConfig" class="f14" style="display: flex; margin-right: 8px">
                        <div class="mr10 ft2 text-name" style="max-width: 60%">{{ item.relInfoCodeConfig.infoCodeName + ':' }}</div>
                        <div style="cursor: default; max-width: 40%" class="text-name-item" @mousemove="e => openTimeFun(e, item.relInfoCodeConfig)" @mouseleave="closeTimeFun">
                            {{ getValueStr(item.relInfoCodeConfig).text }}
                        </div>
                    </div>
                    <div v-else class="f14" style="display: flex; margin-right: 8px">
                        <div class="mr10 ft2 text-name" style="max-width: 60%">{{ item.infoCodeName + ':' }}</div>
                        <div style="cursor: default; max-width: 40%" class="text-name-item" @mousemove="e => openTimeFun(e, item)" @mouseleave="closeTimeFun">
                            {{ getValueStr(item).text }}
                        </div>
                    </div>
                    <div v-if="item.infoCode != 'manualAutoSet' && item.additionalMapValue?.recoveryDateTime && isEdge()" class="f12">
                        <span style="color: #246fe5" class="cp" @click="e => showTime(item, e, '1')">{{
                            dayjs(item.additionalMapValue?.recoveryDateTime).format('YYYY.MM.DD HH:mm')
                        }}</span>
                        <span class="ml5">{{ i18n.global.t('meos_control_web.as_of') }}</span>
                        <span class="flight cp ml8" @click="e => disintervention(item, e)">{{ i18n.global.t('meos_control_web.release_intervention') }}</span>
                    </div>
                </div>
                <div>
                    <!-- 自动 手动 -->
                    <div v-if="item.dataSource?.length && item.infoCode == 'manualAutoSet'" class="fc right-status">
                        <div v-for="ite in item.dataSource" :key="ite.code" class="radio-box-item ml16" @click="e => change(e, ite, item)">
                            <m-tips :content="getDisabledTips(item)" :disabled="!getDisabledTips(item)" theme="darkTransparent" placement="right-start" trigger="hover">
                                <m-radio :disabled="disableControls" :label="ite.code" :size="14" :model-value="ite.code === item.dataValue ? 'checked' : 'uncheck'">{{
                                    ite.name
                                }}</m-radio>
                            </m-tips>
                        </div>
                    </div>
                    <!-- 按钮 -->
                    <div v-if="item.dataSource?.length && item.infoCode !== 'manualAutoSet'" class="action-content f right-status">
                        <!-- :disabled="!base.hasAuth('xprunairterminaleqcontrol') || disableControls" -->
                        <m-tips
                            v-for="(io, iv) in item.dataSource"
                            :key="iv"
                            :content="getDisabledTips(item)"
                            :disabled="!getDisabledTips(item)"
                            theme="darkTransparent"
                            placement="right-start"
                            trigger="hover"
                        >
                            <m-button
                                :class="[item.dataSource?.length >= 4 ? 'mb4' : '', 'btn', 'ml4', 'cp', 'fc', 'f14']"
                                size="small"
                                class="add-btn"
                                :disabled="disableControls || isAutoDisabled"
                                @click="e => handle(item, io, e)"
                            >
                                {{ io.name }}
                            </m-button>
                        </m-tips>
                    </div>
                    <!-- 文字按钮 -->
                    <div v-if="!item.dataSource?.length" class="f right-status">
                        <m-tips :content="getDisabledTips(item)" :disabled="!getDisabledTips(item)" theme="darkTransparent" placement="right-start" trigger="hover">
                            <m-button :disabled="disableControls || isAutoDisabled" type="link" size="small" @click="e => openSettingPop(item, e)">{{
                                i18n.global.t('meos_control_web.setpoint')
                            }}</m-button>
                        </m-tips>
                    </div>
                </div>
            </div>
            <div v-if="item.additionalMapValue?.recoveryDateTime && item.infoCode == 'manualAutoSet' && isEdge()" class="mt4 f12">
                <span class="flight cp" @click="e => showTime(item, e, '2')">{{ dayjs(item.additionalMapValue?.recoveryDateTime).format('YYYY.MM.DD HH:mm') }}</span>
                <span class="ft1">&nbsp;&nbsp;{{ i18n.global.t('meos_control_web.restore_to_auto_mode') }}</span>
            </div>
        </div>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import { getValueStr } from '@/utils/viewUtils';
import dayjs from 'dayjs';
import {
    openTimeFunKey,
    closeTimeFunKey,
    showTimeKey,
    disinterventionKey,
    openSettingPopKey,
    handleKey,
    disableControlsKey,
    isAutoDisabledKey,
    getDisabledTipsKey
} from './constant/injectKey';

const openTimeFun = inject(openTimeFunKey);
const closeTimeFun = inject(closeTimeFunKey);
const showTime = inject(showTimeKey);
const disintervention = inject(disinterventionKey);
const openSettingPop = inject(openSettingPopKey);
const handle = inject(handleKey);
const disableControls = inject(disableControlsKey);
const isAutoDisabled = inject(isAutoDisabledKey);
const getDisabledTips = inject(getDisabledTipsKey);

const props = defineProps({
    item: {
        type: Object,
        default: () => {}
    }
});
</script>

<style lang="less" scoped>
.text-name {
    // overflow: hidden;
    display: inline-block;
    // text-overflow: ellipsis;
    white-space: wrap;
    // max-width: 100px;
}
.text-name-item {
    // overflow: hidden;
    display: inline-block;
    // text-overflow: ellipsis;
    white-space: wrap;
}
.pd {
    padding: 8px 12px;
}
.setting-item {
    background-color: var(--gray-100, #f1f4f6);
}
.setting-item:not(:last-child) {
    border-bottom: 1px solid var(--gray-200, #e8ecf0);
}
.min-w {
    width: 180px;
}
.btn {
    padding: 3px 8px;
    border-radius: 4px;
    border: 1px solid #e8ecf0;
    background: #fff;
    font-size: 14px;
    height: 25px;
}
.btn:hover {
    border-color: #246fe5;
    color: #246fe5;
}
.right-status {
    max-width: 200px;
    flex-wrap: wrap;
    justify-content: end;
}
.m-button + .m-button {
    margin-left: 12px;
}
.add-btn {
    margin-left: 4px !important;
}
</style>
