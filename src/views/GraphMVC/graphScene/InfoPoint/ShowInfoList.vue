<!-- eslint-disable vue/no-v-html -->
<template>
    <div class="info-list-warp" :style="{ left: `${left}px`, top: `${top}px` }">
        <div class="tittle-info">{{ i18n.global.t('meos_control_web.modify_effective_on') }}{{ model.className || model.treeNodeName }}</div>
        <div class="list-warp">
            <div v-for="item in model.rwdInfoVos" :key="item.code" class="list-item" :class="{ active: item.code === selectedCode }" @click="clickItem(item)">
                <div class="item-name">{{ item.name }}</div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref, unref } from 'vue';

const emits = defineEmits(['hide', 'click']);

const props = defineProps({
    // eslint-disable-next-line vue/require-default-prop
    equipData: {
        type: Object
    },
    selectedCode: {
        type: String,
        default: ''
    },
    left: {
        type: Number,
        default: 0
    },
    top: {
        type: Number,
        default: 0
    }
});

const model = ref(unref(props).equipData);

const close = () => {
    emits('hide');
};

const clickItem = infoCode => {
    emits('click', infoCode);
};

defineExpose({
    close
});
</script>
<style lang="less" scoped>
.info-list-warp {
    position: absolute;
    z-index: 9999;
    // transform: translateY(-50%);
    background-color: #fff;
    width: 225px;
    padding-top: 8px;
    border-radius: 4px;
    overflow: hidden;

    .tittle-info {
        padding: 4px 13px;
        color: var(--grey-500);
        font-size: 12px;
    }

    .list-warp {
        max-height: 300px;
        overflow-y: auto;

        .list-item {
            padding: 9px 12px;
            font-size: 14px;
            font-style: normal;
            font-weight: var(--platform-font-weight);
            line-height: 22px;
            color: var(--grey-900);
            cursor: pointer;

            &:hover {
                background-color: var(--grey-100);
            }

            &.active {
                background-color: var(--blue-100);
                color: var(--blue-500);
            }
        }
    }
}
</style>
