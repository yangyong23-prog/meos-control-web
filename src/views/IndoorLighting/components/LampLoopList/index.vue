<template>
    <div class="list-container">
        <div v-for="lamp in list" :key="lamp.id" class="lamp-group">
            <div class="lamp">
                <m-tips
                    :content="!lampDisabledMap[lamp.id]?.value ? lampDisabledMap[lamp.id]?.text || '' : ''"
                    :disabled="lampDisabledMap[lamp.id]?.value"
                    trigger="hover"
                    theme="darkTransparent"
                >
                    <m-checkbox :disabled="!lampDisabledMap[lamp.id]?.value" :model-value="lampsCheckedMap[lamp.id]" @click="emits('checkLamp', lamp)">{{
                        lamp.name ?? '--'
                    }}</m-checkbox>
                </m-tips>
            </div>
            <LoopOrModuleItem
                v-for="obj in lamp?.children"
                :key="obj.id"
                :checked="loopCheckedMap[obj.id] ? 'checked' : 'uncheck'"
                :is-open="loopOpenedMap[obj.id]"
                :data="obj"
                :enable-info="loopDisabledMap[obj.id]"
                :use-hover-loop-linkage="useHoverLoopLinkage"
                @open-item="id => (loopOpenedMap[id] = !loopOpenedMap[id])"
                @check="checkItem"
            >
            </LoopOrModuleItem>
        </div>
    </div>
</template>
<script setup>
import LoopOrModuleItem from '../LoopOrModuleItem.vue';
import { isEdge } from '@/utils/envUtils';
const props = defineProps({
    list: {
        type: Array,
        default: () => []
    },
    lampsCheckedMap: {
        type: Object,
        default: () => {}
    },
    loopCheckedMap: {
        type: Object,
        default: () => {}
    },
    loopOpenedMap: {
        type: Object,
        default: () => {}
    },
    loopDisabledMap: {
        type: Object,
        default: () => {}
    },
    // 是否开启回路hover联动
    useHoverLoopLinkage: {
        type: Boolean,
        default: false
    }
});
const emits = defineEmits(['checkLamp', 'checkLoop']);
const checkItem = d => {
    emits('checkLoop', d);
    // if (d) {
    //     const { id, checked } = d;
    //     props.loopCheckedMap[id] = checked !== 'checked';
    // }
};
const lampDisabledMap = computed(() => {
    const idMap = {};
    if (props.list && props.loopDisabledMap) {
        props.list?.forEach(lamp => {
            if (lamp.children?.length > 0) {
                const hasEnabled = lamp.children?.some(loop => props.loopDisabledMap[loop.id]?.value);
                if (hasEnabled) {
                    idMap[lamp.id] = { value: true, text: '' };
                } else {
                    const disableLoopId = lamp.children?.find(loop => !props.loopDisabledMap[loop.id]?.value)?.id;
                    if (disableLoopId) {
                        idMap[lamp.id] = props.loopDisabledMap[disableLoopId];
                    }
                }
            }
        });
    }

    return idMap;
});
</script>
<style lang="less" scoped>
.list-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
    align-self: stretch;

    .lamp {
        display: flex;
        width: 100%;
        padding: 0px 12px;
        align-items: center;
        gap: 4px;
    }
    .lamp-group {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
    }
}
</style>
