<!-- eslint-disable vue/v-on-event-hyphenation -->
<template>
    <div style="height: 100%">
        <div v-if="show" class="demand-calendar">
            <DemandCalendarLeft ref="child" @demandList="infoFun" />
            <DemandCalendarRight />
        </div>
        <div v-else class="empty-item">
            <Empty :text="i18n.global.t('meos_control_web.no_content')"></Empty>
        </div>
    </div>
</template>

<script lang="ts" setup>
// @ts-ignore
import i18n from '@/localization';
import DemandCalendarLeft from './DemandCalendarLeft.vue';
import DemandCalendarRight from './DemandCalendarRight.vue';
import Empty from '../../components/common/Empty.vue';
const show = ref(true);
const infoFun = (data: any) => {
    show.value = data.length ? true : false;
};
</script>
<style lang="less" scoped>
.demand-calendar {
    height: 100%;
    display: grid;
    grid-template-columns: 288px 1fr;
    overflow-y: hidden;
}
.empty-item {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--gray-100);
    color: var(--describe-color);
}
</style>
