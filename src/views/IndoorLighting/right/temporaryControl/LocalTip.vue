<template>
    <div class="local-tip">
        <I18nSlot html-tag="span" name-key="meos_control_web.local_control_loops_tip">
            <template #num>
                <m-tips placement="bottom" theme="darkTransparent">
                    <template #content>
                        <m-scrollbar max-height="320px">
                            <div v-for="item in data.loops" :key="item">{{ item }}</div>
                        </m-scrollbar>
                    </template>
                    <span class="local-tip__count fw700">{{ loopCount }}</span>
                </m-tips>
            </template>
        </I18nSlot>
    </div>
</template>

<script setup lang="ts">
import I18nSlot from '@/components/I18nSlot.vue';
import { computed } from 'vue';

const props = withDefaults(
    defineProps<{
        data?: {
            loops: string[];
        };
    }>(),
    {
        data: () => {
            return { loops: [] };
        }
    }
);

const loopCount = computed(() => props.data.loops.length);
</script>

<style scoped lang="less">
.local-tip {
    color: var(--gray-600);
    font-size: 14px;
    line-height: 22px;
    display: flex;
    align-items: center;
    gap: 4px;
    margin-bottom: 12px;
}

.local-tip__count {
    color: var(--blue-600);
    cursor: default;
    white-space: nowrap;
}
</style>
