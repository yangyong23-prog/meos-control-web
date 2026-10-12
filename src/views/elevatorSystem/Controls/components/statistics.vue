<template>
    <div class="statistics fcb">
        <div
            v-for="(item, index) in arr"
            :key="index"
            :style="{
                width: getWidth(index)
            }"
        >
            <div v-if="item.total > 0">
                <div class="ft f14 name-show">{{ item.name }}</div>
                <div class="mt4">
                    <span class="f18 fb7 amount-show" :style="'font-family: CustomMedium2'">{{ item.num }}</span>
                    <span class="f18 fb7 amount-show">/</span>
                    <span class="f18 ft amount-show" :style="'font-family: CustomRegular2'">{{ item.total }}</span>
                </div>
                <div class="legend-bar mt4">
                    <div
                        class="bar-item"
                        :style="{
                            backgroundColor: getBackgroundColor(index),
                            width: item.num !== 0 ? ((item.num / item.total) * 100).toFixed(1) + '%' : 0 + '%'
                        }"
                    ></div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import i18n from '@/localization';
import { ELEVATOR_STATUS_NAME } from '@/views/elevatorSystem/constants/index';
const props = defineProps({
    statisticsObj: {
        type: Object,
        default: () => {}
    }
});
const arr = ref([]);
const color = ref(['#2481F2', '#33D4D2', '#B286F5']);
const getName = (key, obj) => {
    let prefix = '';
    if (obj.infoCode) {
        prefix = ELEVATOR_STATUS_NAME[obj.infoCode];
    }
    if (key === 'summary') {
        return i18n.global.t('meos_control_web.total_name', { name: prefix });
    } else if (key === 'visitor') {
        return i18n.global.t('meos_control_web.passenger_elevator_prefix_total', { prefix: prefix });
    } else {
        return i18n.global.t('meos_control_web.cargo_elevator_prefix_total', { prefix: prefix });
    }
};
watch(
    () => props.statisticsObj,
    () => {
        arr.value = [];
        for (let key in props.statisticsObj) {
            if (props.statisticsObj[key].total && props.statisticsObj[key].total > 0) {
                arr.value.push({
                    name: getName(key, props.statisticsObj[key]),
                    num: props.statisticsObj[key].running,
                    total: props.statisticsObj[key].total
                });
            }
        }
    },
    {
        immediate: true
    }
);

const getBackgroundColor = index => {
    return color.value[index];
};
const getWidth = () => {
    return arr.value.length === 3 ? '30%' : arr.value.length === 2 ? '48%' : '100%';
};
</script>
<style lang="less" scoped>
.statistics {
    width: 100%;
    padding: 12px;
    background: #f6faff;
    border-radius: 4px;
    .legend-bar {
        height: 5px;
        background: #e8ecf0;
        .bar-item {
            height: 100%;
            // border-radius: 2px;
        }
    }
}
.amount-show {
    font-family: 'Persagy2.0';
}
.name-show {
    line-height: 18px;
}
</style>
