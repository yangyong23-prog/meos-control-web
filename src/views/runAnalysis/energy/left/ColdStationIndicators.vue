<template>
    <div v-if="list?.length" class="energy-left-cold-station-indicators">
        <Title>{{ i18n.global.t('meos_control_web.efficiency_index') }}</Title>
        <div class="cold-station-indicators-content">
            <template v-for="item in list" :key="item.systemName">
                <div v-if="item.dataList?.length" class="cold-station-indicators-item bg-box">
                    <div class="cold-station-indicators-item-title fs16 fw700">{{ item.systemName }}</div>
                    <div class="cold-station-indicators-item-content">
                        <div v-for="val in item.dataList" :key="val.infoCode" class="item-content-item">
                            <NameValue :data="val.dataValue" :name="val.infoCodeName" :unit="val.unit" />
                        </div>
                    </div>
                </div>
            </template>
        </div>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import Title from '@/components/Title.vue';
import NameValue from '../../components/NameValue.vue';
const props = defineProps({
    systemEfficiencyList: {
        type: Array,
        default: () => []
    }
});
const list = computed(() => {
    const arr = [];
    props.systemEfficiencyList.forEach(item => {
        arr.push(...item.efficiencyDataList);
    });
    return arr;
});
</script>
<style lang="less" scoped>
.cold-station-indicators {
    &-content {
        margin-top: 12px;

        & + .cold-station-indicators-content {
            margin-top: 12px;
        }
    }
    &-item {
        padding: 8px 12px;
        &-title {
            margin-bottom: 12px;
        }
        &-content {
            display: grid;
            grid-template-columns: 50% 50%;
            gap: 16px 12px;
        }
    }
}
.cold-station-indicators-item + .cold-station-indicators-item {
    margin-top: 12px;
}
.item-content-item {
    padding-right: 12px;
}
</style>
