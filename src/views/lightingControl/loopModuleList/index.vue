<template>
    <div class="loop-module-list">
        <div class="nav-bar">
            <m-button type="text" size="medium" icon="IconMeriComponentChevronLeft" @click="back">{{ i18n.global.t('meos_control_web.back') }}</m-button>
            <div class="spilt"></div>
            <div class="tab-wrap">
                <m-tabs v-model="loopListStore.type" :data="options" type="segment" size="small"></m-tabs>
            </div>
        </div>
        <LoopTable v-if="loopListStore.type === 'loop'" :key="loopListStore.listVisible"></LoopTable>
        <ControlTable v-if="loopListStore.type === 'control'" :key="loopListStore.listVisible"></ControlTable>
    </div>
</template>
<script setup>
import LoopTable from './LoopTable.vue';
import i18n from '@/localization';
import ControlTable from './ControlTable.vue';
import { loopControlList } from '@/store/loopControlList';
const loopListStore = loopControlList();
const back = () => {
    loopListStore.setVisible(false);
    // loopListStore.setCoToggleBtn(false);
    // loopListStore.setLoopToggleBtn(false);
};
const options = ref([
    { id: 'loop', name: i18n.global.t('meos_control_web.lighting_circuit') },
    { id: 'control', name: i18n.global.t('meos_control_web.lighting_control_module') }
]);
</script>
<style lang="less" scoped>
.loop-module-list {
    height: 100%;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    position: relative;
    flex-direction: column;
    padding: 0 24px;
    .nav-bar {
        width: 282px;
        height: 32px;
        position: absolute;
        display: flex;
        align-items: center;
        left: 24px;
        top: 12px;
        z-index: 3999;
        .m-button {
            // background: red;
            padding-left: 4px;
            padding-right: 8px;
        }
        .spilt {
            width: 1px;
            height: 20px;
            background: #c4c9cf;
            display: inline-block;
            margin: 0 8px;
        }
        .tab-wrap {
            flex: 1;
            overflow: hidden;
        }
    }
}
</style>
