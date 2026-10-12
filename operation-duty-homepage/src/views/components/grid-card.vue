<template>
    <div class="running-monitor-card-layout">
        <div class="running-monitor-card-header">
            <div class="running-monitor-card-title">
                <Title v-ellipsis class="running-monitor-title" :path="jumpPath" :params="jumpParams">{{ item.name }}</Title>
                <Title v-ellipsis class="running-monitor-title" :class="dayType">{{ item?.demandTemplate?.templateName }}</Title>
            </div>
            <div class="running-card-hidden fs14">
                <IntersectionObserverBox v-if="item.interveneTotal" style="color: var(--gray-600)">
                    {{ i18n.global.t('common.intervention') }}&nbsp;{{ item.interveneTotal }}
                </IntersectionObserverBox>
            </div>
        </div>
        <div class="running-monitor-card-content">
            <RunNumber :value="item.runningTotal" :total="item.equipmentTotal" />
            <div style="width: 40px; height: 40px">
                <Pie
                    :data="{
                        value: item.runningTotal,
                        total: item.equipmentTotal
                    }"
                    :color="pieColor"
                />
            </div>
        </div>
    </div>
</template>
<script setup>
import i18n from '@/localization';
import Title from '@/components/Title.vue';
import RunNumber from '@/components/RunNumber.vue';
import Pie from '@/components/echarts/Pie.vue';
import { NameCodeToPath, NameCodeToParams } from '@/utils/globalVariables';
import IntersectionObserverBox from '@/components/IntersectionObserverBox.vue';
const showInter = ref(false);

const props = defineProps({
    title: {
        type: String,
        default: ''
    },
    dayName: {
        type: String,
        default: ''
    },
    item: {
        type: Object,
        default: () => ({})
    },
    pieColor: {
        type: String,
        default: '#14C4C4'
    }
});
const dayType = computed(() => {
    if (props.item && props.item.demandTemplate) {
        switch (props.item.demandTemplate.templateTag) {
            case 'WORKDAY':
                return 'title-bl';
            case 'DAYOFF':
                return 'title-og';
            case 'ANNIVERSARY':
                return 'title-red';
            default:
                return 'title-custom';
        }
    }
    return 'title-bl';
});
const jumpPath = computed(() => {
    if (props.item && props.item.nameCode && props.item.canJump) {
        return NameCodeToPath[props.item.nameCode] || '';
    }
    return '';
});
const jumpParams = computed(() => {
    if (props.item && props.item.nameCode) {
        return NameCodeToParams[props.item.nameCode] || {};
    }
    return {};
});
onMounted(() => {
    showInter.value = true;
});
</script>
<style lang="less" scoped>
.running-monitor-card-layout {
    display: flex;
    flex-direction: column;
    white-space: nowrap;
    flex-grow: 1;
    height: 100%;
    width: 100%;
    position: relative;
    .running-monitor-card-header {
        display: flex;
        flex-direction: row;
        align-items: center;
        width: 100%;
        justify-content: space-between;
        overflow: hidden;
        .running-monitor-card-title {
            display: flex;
            flex-direction: row;
            width: 100%;
            .running-monitor-title {
                padding: 0;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                display: inline-block;
            }
        }
        .running-card-hidden {
            color: var(--gray-600);
            span + span {
                margin-left: 4px;
            }
        }
    }
    .running-monitor-card-content {
        display: flex;
        flex-direction: row;
        width: 100%;
        flex-grow: 1;
        justify-content: space-between;
        align-items: center;
    }
}
</style>
