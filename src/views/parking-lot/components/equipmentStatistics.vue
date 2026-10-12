<template>
    <div class="equipment-statistics">
        <div v-for="(item, index) in equipmentStatisticsArr" :key="index" class="equipment-statistics-item mb12">
            <div class="f16">{{ item.objectName }}</div>
            <div class="fc mt10">
                <div class="fc mg-class">
                    <!-- <div v-if="iv == 1 || iv == 2" class="get-line ml12 mr12"></div> -->
                    <div class="fc wd1">
                        <div class="f14 ft">{{ i18n.global.t('meos_control_web.total_device_count') }}</div>
                        <div v-ellipsis class="f16 fb6 ml4 fmp m-ellipsis">{{ displayValue(item.count) }}</div>
                    </div>
                </div>
                <div v-for="(io, iv) in item.statusList" :key="iv" class="fc mg-class">
                    <!-- <div v-if="iv == 1 || iv == 2" class="get-line ml12 mr12"></div> -->
                    <div :class="['fc', iv == 0 || iv == 1 ? 'wd' : 'wd1']">
                        <div class="f14 ft">{{ io.objectName }}</div>
                        <div v-ellipsis class="f16 fb6 ml4 fmp m-ellipsis">{{ displayValue(io.count) }}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import i18n from '@/localization';
import { displayValue } from '@/utils/viewUtils';
defineProps({
    equipmentStatisticsArr: {
        type: Array,
        default: () => []
    }
});
</script>
<style lang="less" scoped>
.equipment-statistics {
    &-item {
        border-radius: 4px;
        background: #f4f8ff;
        padding: 16px;
        .mark-icon {
            width: 44px;
            height: 44px;
        }
    }
}
.get-line {
    width: 1px;
    height: 20px;
    background: #e1e5eb;
}

@media (max-width: 1600px) {
    .wd {
        width: 84px;
    }
    .wd1 {
        width: 120px;
    }

    .mg-class {
        margin-right: 16px;
    }
}
@media (min-width: 1600px) {
    .wd {
        width: 100px;
    }
    .wd1 {
        width: 140px;
    }
    .mg-class {
        margin-right: 24px;
    }
}
</style>
