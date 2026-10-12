<template>
    <div class="space-equipments-list-wrap">
        <m-scrollbar v-if="data.length">
            <div class="space-equipments-drawer-content">
                <template v-for="item in data" :key="item.classCode">
                    <Title class="parent-row">
                        <span :class="['parent-title']">{{ item?.classCodeName || '--' }}</span>
                    </Title>
                    <EquipmentItem v-for="(subItem, index) in item.equips" :key="index" :item="subItem" />
                </template>
            </div>
        </m-scrollbar>
        <div v-else class="pos-center">
            <m-illustration v-if="empty" :title="i18n.global.t('meos_control_web.no_content')" type="noContent"></m-illustration>
        </div>
    </div>
</template>
<script setup>
import i18n from '@/localization';
import Title from '@/components/Title.vue';
import EquipmentItem from './EquipmentItem.vue';
const props = defineProps({
    data: {
        type: Array,
        default: () => []
    }
});
</script>
<style lang="less" scoped>
.parent-row {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-top: 12px;
    margin-bottom: 4px;
    .parent-title {
        font-weight: 700;
        font-size: 16px;
        line-height: 24px;
        letter-spacing: 0px;
        color: #2e3742;
    }
}
.space-equipments-list-wrap {
    padding: 4px 0 0 24px;
    max-height: 100%;
    height: 100%;
    position: relative;
    .space-equipments-drawer-content {
        margin-right: 24px;
    }
    &.list-wrap {
        .subItem-row {
            padding-left: 20px;
            padding-right: 20px;
            border-bottom: 1px solid #e8ecf0;
            border-radius: 0;
            &:hover {
                border-radius: 4px;
                background: var(--Grey-Alpha-30, rgba(196, 201, 207, 0.3));
            }
        }
    }
}
.faultslist-drawer-content {
    padding-left: 24px;
    padding-right: 24px;
}
.pos-center {
    display: flex;
    align-items: center;
    flex: 1;
    flex-direction: column;
    justify-content: center;
}
</style>
