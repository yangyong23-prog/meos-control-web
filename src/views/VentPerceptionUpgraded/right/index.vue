<template>
    <div class="vent-upgraded-right h100" :style="{ backgroundColor: headerModelView === 'model' ? mapBgColor : '' }">
        <Console :class="{ hasNotify: notifyList?.length }" />
        <CommonNotify v-if="notifyList?.length" :notify-list="notifyList" style="margin-top: 16px; background-color: #dfeeffcc; border-radius: 8px" />
    </div>
</template>

<script setup>
import { mapBgColorKey, notifyListKey, headerModelViewKey } from '../hooks/useBaseHook';
import Console from './Console.vue';
import CommonNotify from '@/components/commonNotify/index.vue';
const notifyList = inject(notifyListKey, ref([]));
const mapBgColor = inject(mapBgColorKey);
const headerModelView = inject(headerModelViewKey);
</script>
<style lang="less" scoped>
.vent-upgraded-right {
    width: var(--broken-width);
    padding: 0px 16px 0px 0;
}
</style>
