<template>
    <div class="run-control-entry">
        <div class="tab-head">
            <div class="tab-box">
                <m-tabs v-model="curTab" :data="tabItems" size="large">
                    <template #name="{ item }">{{ item.name }}</template>
                </m-tabs>
            </div>
        </div>

        <div ref="tabBottomRef" class="tab-bottom" :style="{ '--tab-bottom-height': (height || 0) + 'px' }">
            <!-- <m-scrollbar :height="'100%'">
                <DemandChangeTab />
            </m-scrollbar> -->
            <m-scrollbar v-if="curTab === '1'" :height="'100%'">
                <DemandChangeTab />
            </m-scrollbar>
            <m-scrollbar v-else-if="curTab === '2'" :height="'100%'">
                <DemandTargetTab :has-spaces="props.hasSpaces" :container-height="height" />
            </m-scrollbar>
            <template v-else>
                <BatchControl />
            </template>
        </div>
    </div>
</template>

<script setup lang="ts">
// @ts-ignore
import i18n from '@/localization';
import { useElementSize } from '@vueuse/core';
import DemandChangeTab from './DemandChangeTab.vue';
import DemandTargetTab from './DemandTargetTab.vue';
import BatchControl from './BatchControl.vue';
import { isEdge } from '@/utils/envUtils';
const props = defineProps({
    hasSpaces: {
        type: Boolean,
        default: true
    }
});
const curTab = ref('1');
const tabItems = ref<Record<string, string>[]>([]);
watch(
    () => isEdge(),
    () => {
        if (isEdge()) {
            tabItems.value = [
                {
                    id: '1',
                    name: `${i18n.global.t('meos_control_web.data_statistics')}`
                },
                {
                    id: '2',
                    name: `${i18n.global.t('meos_control_web.requirement_target')}`
                },
                {
                    id: '3',
                    name: `${i18n.global.t('meos_control_web.batch_control')}`
                }
            ];
        } else {
            tabItems.value = [
                {
                    id: '1',
                    name: `${i18n.global.t('meos_control_web.data_statistics')}`
                },
                {
                    id: '2',
                    name: `${i18n.global.t('meos_control_web.requirement_target')}`
                }
            ];
        }
    },
    {
        immediate: true
    }
);
const tabBottomRef = ref(null);
const { height } = useElementSize(tabBottomRef);
</script>
<style lang="less" scoped>
.run-control-entry {
    width: 100%;
    height: 100%;
    position: relative;
}
.tab-head {
    height: 42px;
    width: calc(100% - 32px);
    margin: 0 auto;
    border-bottom: 1px solid #e8ecf0;
    padding: 0 16px;
    position: relative;

    .tab-box {
        width: 100%;
        position: absolute;
        top: 0;
        left: -12px;
    }
}

/deep/ .m-tabs-line .m-tabs-list {
    padding: 4px 0 5px 0;
}
.tab-bottom {
    position: relative;
    height: calc(100% - 43px);
    // height: calc(100%);
}
</style>
