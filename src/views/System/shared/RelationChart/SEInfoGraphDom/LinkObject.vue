<template>
    <div class="link-object-warp" :style="style">
        <div class="link-object-content" :style="{ maxWidth: `${props.data.w}px` }">
            <span class="link-label">{{ i18n.global.t('meos_control_web.connected_object') }} : </span>
            <span v-ellipsis class="link-name" :style="{ maxWidth: `${props.data.w - 120}px` }" @click="switchGraph">{{ data.linkObj?.dataObject?.localName ?? '--' }}</span>
        </div>
    </div>
</template>
<script setup>
import i18n from '@/localization';
const props = defineProps({
    data: {
        type: Object,
        default: () => {}
    }
});

const emits = defineEmits(['switchRelationChart', 'openDetail']);

const style = computed(() => {
    const { x, y, w, h } = props.data || {};
    return {
        top: `${y}px`,
        left: `${x}px`,
        width: `${w}px`,
        height: `${h}px`
    };
});

const switchGraph = () => {
    const { data } = props;
    const { linkObj = {} } = data;

    const { systemObjectId, dataObject } = linkObj;
    if (systemObjectId) {
        emits('switchRelationChart', linkObj);
    } else {
        emits('openDetail', dataObject);
    }
};
</script>
<style lang="less" scoped>
.link-object-warp {
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    font-size: 24px;
    .link-object-content {
        height: 100%;
        gap: 4px;
        border-radius: 4px;
        background: var(--gray-100);
        padding: 4px;
        display: flex;
        justify-content: center;
        align-items: flex-start;
        .link-label {
            width: 110px;
            white-space: nowrap;
        }
        .link-name {
            flex: 1;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            color: var(--blue-500);
            font-weight: 700;
            cursor: pointer;
        }
    }
}
</style>
