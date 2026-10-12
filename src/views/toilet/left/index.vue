<template>
    <div class="wh100 container">
        <div class="toilet-left">
            <div v-show="!currentFloorObj.id" class="wh100">
                <div class="toilet-left-title fs20 fw700 mb16">{{ i18n.global.t('meos_control_web.smart_restroom') }}</div>
                <div class="toilet-left-dashboard">
                    <DashboardBox :loading="loading" />
                </div>
            </div>
            <FloorMap v-if="currentFloorObj.id" class="floor" />
        </div>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import { currentFloorObjKey } from '../hooks/useBaseDataHook';
import DashboardBox from './DashboardBox.vue';
import FloorMap from './FloorMap/index.vue';

const currentFloorObj = inject(currentFloorObjKey);

defineProps({
    loading: {
        type: Boolean,
        default: false
    }
});
</script>
<style lang="less" scoped>
.container {
    overflow: auto;
    position: relative;
    .toilet-left {
        padding: 16px;
        padding-right: 0;
        height: 100%;
        // &-charts {
        //     padding: 16px 0;
        //     min-height: 126px;
        //     display: grid;
        //     grid-template-columns: repeat(5, minmax(0, 1fr));
        //     gap: 12px;
        // }
        &-dashboard {
            height: calc(100% - 43px);
        }
    }
    .floor {
        left: 0;
        top: 0;
        position: absolute;
        width: 100%;
        height: 100%;
    }
}
</style>
