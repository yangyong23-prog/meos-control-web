<template>
    <div class="fc wh100 set-value-action-column">
        <SetDiv v-for="item in data.dataSource" v-bind="$attrs" :key="item.code" @click="e => click(e, item.code, item)">{{ item.name }}</SetDiv>
    </div>
</template>

<script setup>
import SetDiv from '@/components/common/SetDiv.vue';
import { openControlFormKey } from '../../hooks/useControlHook';
const openControlForm = inject(openControlFormKey);
const props = defineProps({
    data: {
        type: Object,
        required: true
    },
    id: {
        type: String,
        required: true
    },
    value: {
        type: String,
        default: ''
    }
});
const click = (e, value, item) => {
    openControlForm({ el: e, value, data: { ...props.data, id: props.id } }, item);
};
</script>
<style lang="less" scoped>
.set-value-action-column {
    padding: 8px 12px;
}
</style>
