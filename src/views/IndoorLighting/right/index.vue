<template>
    <div class="indoor-lighting-right 100" :style="{ backgroundColor: currentFloorObj ? mapBgColor : '' }">
        <Console :class="{ hasNotify: notifyList?.length }" :loading="loading" />
        <div v-if="notifyList?.length" class="indoorlight-container-right-broadcast">
            <common-notify v-if="notifyList?.length" :notify-list="notifyList" />
        </div>
    </div>
</template>

<script setup>
import { mapBgColorKey, currentFloorObjInjectKey, notifyListKey } from '../hooks/useBaseHook';
import Console from './Console.vue';
import commonNotify from '@/components/commonNotify/index.vue';
defineProps({
    loading: {
        type: Boolean,
        default: false
    }
});
const notifyList = inject(notifyListKey, ref([]));
const mapBgColor = inject(mapBgColorKey);
const currentFloorObj = inject(currentFloorObjInjectKey);
</script>
<style lang="less" scoped>
.indoor-lighting-right {
    padding: 16px 16px 16px 0;
}
.indoorlight-container-right-broadcast {
    background-color: rgba(223, 238, 255, 0.8);
    border-radius: 8px;
    margin-top: 16px;
    box-shadow: 0px 8px 10px 0px #1b212908;
}
</style>
