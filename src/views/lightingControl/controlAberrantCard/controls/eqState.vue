<!--
 * @Author: guoxiaohuan
 * @Date: 2024-04-26 18:26:43
 * @LastEditors: guoxiaohuan
 * @LastEditTime: 2024-05-16 17:56:23
 * @Description:
-->
<template>
    <div class="eq-container">
        <div class="eq-container-box eq-container-left" @mouseenter="mouseenterEq('.eq-container-left .value')" @mouseleave="mouseleaveEq('.eq-container-left .value')">
            <div class="title">{{ i18n.global.t('meos_control_web.lighting_circuit') }}</div>
            <div class="eq-container-box-gap">
                <div v-for="(item, index) in eqList.lightingSidebarCircuitVo" :key="index + 'c'" class="eq-container-box-item">
                    <div class="value" @click="toTableSelect(item, { type: 'loop' })">{{ item.num }}</div>
                    <div class="key">{{ item.name }}</div>
                </div>
            </div>
        </div>
        <div class="eq-container-box eq-container-right" @mouseenter="mouseenterEq('.eq-container-right .value')" @mouseleave="mouseleaveEq('.eq-container-right .value')">
            <div class="title">{{ i18n.global.t('meos_control_web.control_module') }}</div>
            <div v-for="(item, index) in eqList.control" :key="index + 'm'" class="eq-container-box-item">
                <div class="value" @click="toTableSelect(item, { type: 'control' })">{{ item.num }}</div>
                <div class="key">{{ item.name }}</div>
            </div>
        </div>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import { loopControlList } from '@/store/loopControlList';
import { isEdge } from '@/utils/envUtils';
import baseStore from '@/store/baseStore';

const curFloorId = inject('curFloorId');
const templateType = inject('templateType');
const loopListStore = loopControlList();
const eqList = inject('eqList');

const mouseenterEq = name => {
    // 云端不可跳转设备列表
    if (!isEdge()) {
        return;
    }
    let elements = document.querySelectorAll(`${name}`);
    for (let i = 0; i < elements.length; i++) {
        if (elements[i].innerText > 0) {
            elements[i].style.color = '#246fe5';
            elements[i].style.cursor = 'pointer';
        }
    }
};

const mouseleaveEq = name => {
    let elements = document.querySelectorAll(`${name}`);
    for (let i = 0; i < elements.length; i++) {
        elements[i].style.color = '#2E3742';
        elements[i].style.cursor = 'default';
    }
};

const toTableSelect = (item, metaList) => {
    // 云端不可跳转设备列表
    if (!isEdge()) {
        return;
    }
    let params = {},
        hlInfo = {};
    if (item.num === 0) return;

    if (metaList.type === 'control') {
        if (curFloorId?.value) {
            params = Object.assign(metaList, { coInfo: { onlineStatus: 'OFFLINE', instanceType: 'FLOOR', instanceId: curFloorId.value, templateType: templateType?.value } });
        } else {
            params = Object.assign(metaList, {
                coInfo: { onlineStatus: 'OFFLINE', instanceType: 'PROJECT', instanceId: baseStore().projectId, templateType: templateType?.value }
            });
        }
    } else {
        if (curFloorId?.value) {
            hlInfo = { instanceType: 'FLOOR', instanceId: curFloorId.value, templateType: templateType?.value };
        } else {
            hlInfo = {
                instanceType: 'PROJECT',
                instanceId: baseStore().projectId,
                templateType: templateType?.value
            };
        }
        if (item.name === i18n.global.t('meos_control_web.manual')) {
            hlInfo = Object.assign(hlInfo, { handAutomatism: 'MANUAL', templateType: templateType?.value });
        } else if (item.name === i18n.global.t('meos_control_web.auto')) {
            hlInfo = Object.assign(hlInfo, { handAutomatism: 'AUTO', templateType: templateType?.value });
        } else if (item.name === i18n.global.t('meos_control_web.offline')) {
            hlInfo = Object.assign(hlInfo, { onlineStatus: 'OFFLINE', templateType: templateType?.value });
        } else {
            hlInfo = Object.assign(hlInfo, { controlIsInconsistent: '1', templateType: templateType?.value });
        }
        params = Object.assign(metaList, { hlInfo: hlInfo });
    }
    console.log(params, '=========');
    loopListStore.setList(params);
    loopListStore.setVisible(true);
};
watch(
    () => eqList?.value,
    val => {
        // console.log('val: ', val);
        eqList.value = val;
    },
    {
        deep: true
    }
);
</script>

<style lang="less" scoped>
.eq-container {
    height: 96px;
    width: 100%;
    margin-bottom: 24px;
    display: flex;
    justify-content: space-between;
    &-box {
        padding: 12px;
        border-radius: 4px;
        border: 1px solid transparent;
        .title {
            color: @grey-900;
            font-size: 14px;
            font-weight: 700;
            margin-bottom: 10px;
        }
        &-item {
            font-size: 14px;
            .value {
                color: @grey-800;
                font-family: Persagy2;
                font-weight: 700;
                height: 17px;
            }
            .key {
                color: @grey-600;

                font-weight: var(--platform-font-weight);
                white-space: nowrap;
                height: 18px;
            }
        }
    }
    &-left {
        flex: 1;
        margin-right: 12px;
        background: #f6fcff;
        .eq-container-box-gap {
            display: grid;
            // gap: 6px;
            grid-template-columns: repeat(4, 1fr);
            .value {
                margin-bottom: 6px;
            }
        }
    }
    &-right {
        width: 112px;
        min-width: 112px;
        max-width: 112px;
        background: linear-gradient(0deg, #f5f8ff 0%, #f5f8ff 100%), #f6fcff;
        .eq-container-box-item {
            display: grid;
            gap: 6px;
            grid-template-columns: repeat(1, 1fr);
        }
    }
}
</style>
