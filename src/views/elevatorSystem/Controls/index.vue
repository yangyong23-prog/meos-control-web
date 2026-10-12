<template>
    <div class="right-control-container" style="height: calc(100% - 122px)">
        <div class="tab-head">
            <div class="tab-box">
                <m-tabs v-model="curTab" :data="tabItems" size="large"> </m-tabs>
            </div>
        </div>
        <straightLadder
            v-if="curTab == '1'"
            @hover-equip="
                item => {
                    emits('hoverEquip', item);
                }
            "
            @unhover-equip="
                () => {
                    emits('unhoverEquip');
                }
            "
            @click-equip="
                item => {
                    emits('clickEquip', item);
                }
            "
        />
        <escalator
            v-if="curTab == '2'"
            @hover-equip="
                item => {
                    emits('hoverEquip', item);
                }
            "
            @unhover-equip="
                () => {
                    emits('unhoverEquip');
                }
            "
            @click-equip="
                item => {
                    emits('clickEquip', item);
                }
            "
        />
    </div>
</template>
<script setup>
import straightLadder from './straightLadder/index.vue';
import escalator from './escalator/index.vue';
import i18n from '@/localization';

const emits = defineEmits('unhoverEquip', 'hoverEquip', 'clickEquip');
const straightLadderList = inject('straightLadderList');
const escalatorsInTree = inject('escalatorsInTree');
const curTab = ref('1');
const tabItems = ref([
    {
        id: '1',
        name: i18n.global.t('meos_control_web.elevator')
    },
    {
        id: '2',
        name: i18n.global.t('meos_control_web.escalator')
    }
]);
</script>
<style lang="less" scoped>
.tab-head {
    height: 43px;
    width: calc(100% - 32px);
    margin: 0 auto;
    border-bottom: 1px solid #e8ecf0;
    padding: 0 16px;
    position: relative;

    .tab-box {
        width: 100%;
        position: absolute;
        top: 0;
        left: -12px;
    }
}
:deep(.m-tabs.m-tabs-line) {
    .m-tabs-name {
        line-height: 21px;
    }
}
</style>
