<template>
    <div class="demand-management-main">
        <component :is="component(active)" v-if="active && showMain" />
    </div>
</template>

<script lang="ts" setup>
import { Ref } from 'vue';
import requirementconfigurationmanagement from '../requirementconfigurationmanagement/index.vue';
import xshellConfiguration from '../xshellConfiguration/index.vue';
const showMain = ref(true);
const active: Ref<string> = inject('active', ref(''));
const component = (activeId: string) => {
    switch (activeId) {
        case 'requirementconfigurationmanagement':
            return requirementconfigurationmanagement;
        case 'xshellConfiguration':
            return xshellConfiguration;
        default:
            return '';
    }
};
watch(
    () => active.value,
    () => {
        showMain.value = false;
        nextTick(() => {
            showMain.value = true;
        });
    }
);
</script>
<style lang="less" scoped>
.demand-management-main {
    height: 100%;
    overflow-x: auto;
}
</style>
