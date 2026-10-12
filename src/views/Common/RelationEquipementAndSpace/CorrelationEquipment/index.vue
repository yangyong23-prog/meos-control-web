<template>
    <div class="correlation-equipment">
        <m-popover
            v-for="(item, index) in associatedEquipment?.dataValue"
            :key="index"
            :disabled="floorId == item.inFloor?.id"
            :content="i18n.global.t('meos_control_web.device_not_on_floor_click_jump')"
            theme="darkTransparent"
            :show-arrow="false"
        >
            <div class="correlation-equipment-item fc cp" @mouseenter="emits('hoverObj', item)" @mouseleave="emits('unhoverObj')" @click="clickEquipFun(item)">
                <div class="fc">
                    <div v-ellipsis class="mr4 m-ellipsis">{{ item.localName ?? '--' }}</div>
                    <m-tag size="small" color="#1B4ACC" bg-color="#D9EBFF" class="floor-name-tag nr4"> {{ item.inFloor?.localName ?? '--' }} </m-tag>
                    <templateObjectTags :status-data="item.relInfoCodeGroupConfigs?.[0]" :select-obj="selectObj" :template-type="DETAIL" />
                </div>
            </div>
        </m-popover>
    </div>
</template>
<script setup>
import templateObjectTags from '@/components/templateObjectTags/index.vue';
import { DETAIL } from '@/utils/globalVariables';
const emits = defineEmits('unhoverObj', 'hoverObj', 'clickObj');
defineProps({
    associatedEquipment: {
        type: Object,
        default: () => {}
    },
    selectObj: {
        type: Object,
        default: () => {}
    }
});
const floorLocalName = inject('floorLocalName');
const floorId = inject('floorId');
const clickEquipFun = item => {
    emits('clickObj', item);
};
</script>
<style lang="less" scoped>
.correlation-equipment {
    &-item {
        padding: 16px 12px;
    }
    &-item:hover {
        background-color: rgba(196, 201, 207, 0.3);
        border-radius: 4px;
    }
}
@media screen and (min-width: 1600px) {
    .get-line {
        margin-left: 16px;
        margin-right: 16px;
    }
    .title-item {
        width: 60px;
    }
    .run-condition-list {
        width: 141px;
    }
}
@media screen and (max-width: 1600px) {
    .get-line {
        margin-left: 8px;
        margin-right: 8px;
    }
    .title-item {
        width: 40px;
    }
    .run-condition-list {
        width: 113px;
    }
}
</style>
