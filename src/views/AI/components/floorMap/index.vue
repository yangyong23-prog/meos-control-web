<template>
    <div :class="{ 'map-scene': true }">
        <span class="time">{{ time }}</span>
        <div id="webgl-loading" class="webgl-wrap">
            <Floor
                ref="buildFloorMapRef"
                v-model:loading="mapLoading"
                :is-predict="props.isPredict"
                :current-floor-id="currentFloorId"
                :type="type"
                :spaces="spaces"
                :equips="equips"
            ></Floor>
        </div>
        <div v-show="mapLoading" v-loading="mapLoading" element-loading-lottiename="circle" class="loading-mask"></div>
        <!-- <div v-show="mapLoading" class="loading-msg">数据加载中，请稍后...</div> -->
        <!-- 楼层切换器 -->
        <FloorSelect
            v-show="buildFloorFilterTree?.length && !mapLoading"
            v-model:floor-id="currentFloorId"
            :building-floors="buildFloorFilterTree"
            :building-select-text="i18n.global.t('meos_control_web.all_building')"
            :show-project-btn="false"
            @change="choseFloor"
        />
        <!-- 图例 -->
        <div class="bottom-wrap">
            <EquipStrategy v-if="airCrewIds.includes(type)"></EquipStrategy>
            <SpaceStrategyDemand v-if="type === 'SpaceStrategyDemand'"></SpaceStrategyDemand>

            <SapcetypeTemperature v-if="type === 'SapcetypeTemperature'"></SapcetypeTemperature>
            <SapcetypeCO2 v-if="type === 'SapcetypeCO2'"></SapcetypeCO2>
            <SpaceTypeHumidity v-if="type === 'SpaceTypeHumidity'"></SpaceTypeHumidity>
        </div>
        <DiagramControls :style="{ marginRight: '16px' }" :actual-size="false" @reset-view="goDefault" />
    </div>
</template>
<script setup>
import i18n from '@/localization';
import DiagramControls from '@/components/common/DiagramControls.vue';
// import Legend from './Legend.vue';
import Floor from './Floor.vue';
import SapcetypeTemperature from './Legend/SapcetypeTemperature.vue';
import EquipStrategy from './Legend/EquipStrategy.vue';
import SpaceStrategyDemand from './Legend/SpaceStrategyDemand.vue';
import SapcetypeCO2 from './Legend/SapcetypeCO2.vue';
import SpaceTypeHumidity from './Legend/SpaceTypeHumidity.vue';
// import FloorSelectPlus from '@/components/common/FloorSelectPlus/index.vue';
import { FloorSelect } from 'yushu-component-web';
import { debounce, isEmpty } from 'lodash';
import { filterBuildFloors } from '../../utils';
import { templateConfigsKey } from '../../hooks/useTemplateConfig';
// import { MLoading } from 'meri-plus';

// const loadingInstance = ref(null);

const defaultLoading = ref(true);
const buildFloorMapRef = ref();
const buildFloorFilterTree = ref([]);
const mapLoading = defineModel('mapLoading', { type: Boolean, default: true });

/*
    SpaceStrategyDemand 空间需求策略
    SpaceStrategyDispatch 空间调度策略
    SpaceStrategyHumidity 空间湿度调节策略

    SapcetypeTemperature 温度预测
    SapcetypeCO2 CO2浓度预测
    SpaceTypeHumidity 湿度预测
*/
const props = defineProps({
    type: {
        type: String,
        default: ''
    },
    spaces: {
        type: Array,
        default: null
    },
    equips: {
        type: Array,
        default: null
    },
    time: {
        type: String,
        default: '11:00'
    },
    isPredict: {
        type: Boolean,
        default: false
    }
});

const currentFloorId = defineModel({ type: String, default: '' });
const templateConfigs = inject(templateConfigsKey, ref({}));
const airCrewIds = computed(() => {
    const templateCode = props.isPredict ? 'mpcCrewOperationPrediction' : 'mpcCrewStrategyDetails';
    const res = templateConfigs.value[templateCode] || [];
    return res.map(v => v?.id);
});

watch([buildFloorFilterTree, currentFloorId], () => {
    if (isEmpty(currentFloorId.value)) {
        currentFloorId.value = buildFloorFilterTree.value[0]?.floorList?.[0]?.id;
    } else if (currentFloorId.value && buildFloorFilterTree.value.flatMap(o => o.floorList).findIndex(o => currentFloorId.value === o.id) === -1) {
        currentFloorId.value = buildFloorFilterTree.value[0]?.floorList?.[0]?.id;
    }
});

watchEffect(() => {
    const floorIds = [...(props.spaces ?? []), ...(props.equips ?? [])].map(s => s.floorId);
    if (floorIds?.length) {
        const _building = filterBuildFloors(floorIds);

        buildFloorFilterTree.value = _building;
    } else {
        buildFloorFilterTree.value = [];
    }
});

// let timer = null;

// watch([currentFloorId, buildFloorMapRef, () => props.type], async () => {
//     if (props.type === 'stgyACATFU' || props.type === 'stgyACATAH') {
//         await nextTick();
//         const eqs = props.equips?.filter(e => e.floorId === currentFloorId.value);
//         if (eqs?.length > 0 && buildFloorMapRef.value) {
//             if (timer) clearTimeout(timer);
//             timer = setTimeout(() => {
//                 const data = eqs[0];
//                 buildFloorMapRef.value.click(data);
//                 timer = null;
//             }, 1000);
//         }
//     }
// });

// watch(
//     () => mapLoading.value,
//     cur => {
//         if (cur) {
//             loadingInstance.value = MLoading.service({
//                 target: '.loading-mask',
//                 fullscreen: false,
//                 duration: 30000,
//                 lottieName: 'circle',
//                 loadIconStyle: {
//                     width: '100px',
//                     height: '100px'
//                 }
//             });
//         } else {
//             nextTick(() => {
//                 loadingInstance.value?.destroy?.();
//             });
//         }
//     },
//     {
//         immediate: true
//     }
// );

const choseFloor = (id, floor, building) => {
    if (id === currentFloorId.value) return;
    if (currentFloorId.value) {
        currentFloorId.value = floor ? floor.id : '';
    }
};

const goDefault = () => {
    buildFloorMapRef.value.goDefault();
};

const chooseObj = obj => {
    unhoverObj();
    buildFloorMapRef.value.click(obj);
};

const hoverObjDebounce = debounce(obj => {
    buildFloorMapRef.value.hover(obj);
}, 50);

const hoverObj = obj => {
    hoverObjDebounce(obj);
};

defineExpose({
    chooseObj,
    hoverObj
});

const unhoverObj = () => {};
</script>
<style lang="less" scoped>
.map-scene {
    transition: all 0.5s;
    opacity: 1;

    height: 100%;
    display: flex;
    position: relative;
    background-color: #e8edf3;

    .time {
        left: 12px;
        top: 20px;
        position: absolute;
        font-size: 18px;
        line-height: 22px;
        font-weight: 500;
        color: #1b2129;
        z-index: 1;
    }

    .webgl-wrap {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: #e8edf3;
    }

    .webgl-dom {
        position: absolute;
        width: 100%;
        height: 100%;
        right: 0;
        top: 0;
        background-color: #e8edf3;
    }

    .loading-msg {
        background-color: rgba(27, 33, 41, 0.9);
        border-radius: 4px;
        padding: 8px 12px;
        color: #fff;

        font-size: 14px;
        font-weight: var(--platform-font-weight);
        line-height: 18px;
        position: absolute;
        z-index: 2;
        top: 64px;
        left: 50%;
        transform: translateX(-50%);
    }

    .loading-mask {
        position: absolute;
        z-index: 0;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }

    .bottom-wrap {
        position: absolute;
        width: calc(100%);
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        justify-content: center;
    }
}
// element-plus loading style 样式污染处理
:deep(.el-loading-mask) {
    background-color: #d6dde5 !important;
}
:deep(.el-loading-spinner .path) {
    stroke: rgb(141, 147, 153) !important;
}
:deep(.el-loading-spinner .circular) {
    width: 24px !important;
    height: 24px !important;
}
</style>
