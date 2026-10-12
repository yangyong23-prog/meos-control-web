<template>
    <div class="running-monitor-card-layout">
        <div class="running-monitor-card-header">
            <div class="running-monitor-card-title">
                <Title class="running-monitor-title" :path="jumpPath" :params="jumpParams">{{ item.name }}</Title>
                <Title class="running-monitor-title" :class="dayType">{{ item?.demandTemplate?.templateName }}</Title>
            </div>
            <div class="running-card-hidden fs14">
                <IntersectionObserverBox v-if="item.interveneTotal" style="color: var(--gray-600)">
                    {{ i18n.global.t('common.intervention') }}&nbsp;{{ item.interveneTotal }}
                </IntersectionObserverBox>
            </div>
        </div>
        <div class="running-monitor-card-content">
            <div class="running-monitor-card-content-data">
                <RunNumber
                    v-for="(child, index) in item.children"
                    :key="index"
                    :label="child.name || i18n.global.t('common.operation')"
                    :value="child.runningTotal"
                    :total="child.equipmentTotal"
                />
            </div>

            <div class="running-monitor-card-content-pie" style="height: 40px">
                <IntersectionObserverBox class="pie-inter">
                    <Pie
                        :data="{
                            value: item.runningTotal,
                            total: item.equipmentTotal
                        }"
                        :color="pieColor"
                    />
                </IntersectionObserverBox>
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
            .running-monitor-title {
                padding: 0;
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
        position: relative;
        overflow: hidden;
        flex-grow: 1;
        justify-content: space-between;
        align-items: center;
        .running-monitor-card-content-data {
            display: flex;
            flex-wrap: wrap;
            width: 90%;
            justify-content: flex-start;
            align-items: center;
            gap: 6px;
            div {
                flex: 1;
                justify-content: flex-start;
            }
            > div:first-of-type {
                margin-right: 10px;
            }
        }
        .running-monitor-card-content-pie {
            display: flex;
            flex-direction: column;
            width: 40px;
            flex-shrink: 0;
            .pie-inter {
                width: 100%;
                height: 100%;
            }
        }
    }
}
</style>
