<template>
    <div v-if="!hidden" v-show="active" class="drawer-pane">
        <slot :active="active"></slot>
    </div>
</template>
<script setup>
import { inject, onMounted, onUnmounted, reactive, useSlots, computed } from 'vue';
import { commonDrawerRootContextKey } from './constant';
import { computedEager } from '@vueuse/core';
import { shouldHideAbnormalPane } from '@/utils/opt/hideAbnormal';

const COMPONENT_NAME = 'DrawerPane';
defineOptions({
    name: COMPONENT_NAME
});

const commonDrawerRoot = inject(commonDrawerRootContextKey);
if (!commonDrawerRoot) console.error(COMPONENT_NAME, 'usage: <CommonDrawer><DrawerPane /></CommonDrawer>');

const props = defineProps({
    name: {
        type: String,
        default: ''
    },
    label: {
        type: String,
        default: ''
    }
});

// opt：OPT_HIDE_ABNORMAL_EVENTS 打开时，“异常事件”面板不注册页签、不渲染内容（内容组件不挂载，不再请求异常事件列表）
const hidden = shouldHideAbnormalPane(props.label);

const instance = getCurrentInstance();
const slots = useSlots();

const index = ref('');

const name = computed(() => props.name || index.value);
const label = computed(() => props.label || index.value);

const active = computedEager(() => commonDrawerRoot.curTab.value === (props.name || index.value));

const drawerPane = reactive({
    uid: instance.uid,
    slots,
    props,
    label,
    name,
    active,
    index
});

onMounted(() => {
    if (hidden) return;
    commonDrawerRoot.registerPane(drawerPane);
});

onUnmounted(() => {
    if (hidden) return;
    commonDrawerRoot.unregisterPane(drawerPane.uid);
});
</script>
<style lang="less" scoped>
.drawer-pane {
    height: 100%;
}
</style>
