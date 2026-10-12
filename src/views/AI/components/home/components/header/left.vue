<template>
    <div class="AI-headr-left">
        <video width="70" autoplay loop muted="true" src="@/assets/webm/AI_title_new.webm"></video>
        <m-select v-model="system" :options="options" trigger="click" noborder label-key="label" size="auto" max-width="330" @change="change"> </m-select>
    </div>
</template>

<script setup>
import { ref, inject } from 'vue';
import { AISystemlistKey, currentSystemIdKey } from '../../../../hooks/useStaticData';
import useStore from '@/store';
import emitter from '@/utils/bus';

const { base } = useStore();
const { projectId } = base;

const system = inject(currentSystemIdKey);
const options = inject(AISystemlistKey);

watch(options, value => {
    system.value = options.value && options.value.length > 0 ? options.value[0].key : '';
    emitter.emit('init-system');
});

const change = key => {
    emitter.emit('change-system');
};
</script>

<style lang="less" scoped>
.AI-headr-left {
    display: flex;
    align-items: center;
    width: 400px;
    :deep(.m-select-wrap) {
        width: calc(100% - 70px);
    }

    ::v-deep .m-select {
        width: fit-content;
        max-width: 100%;
        justify-content: flex-start;
        color: var(--Grey-Grey-0, #fff);
        text-align: center;
        font-size: 22px;
        font-style: normal;
        font-weight: 700;
        line-height: 32px; /* 114.286% */
    }
    :deep(.m-select-inner) {
        padding-left: 4px;
    }
}
</style>
