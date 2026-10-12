<template>
    <div class="fun-types h100">
        <m-list-skeleton v-if="funcTypeLoading" />
        <template v-else>
            <div
                v-for="item in funcTypes"
                :key="item.code"
                class="fun-type-item fc"
                :class="{ 'is-active': item.code === activeFuncType.code }"
                @click="changeActiveFuncType(item)"
            >
                {{ item.name }}
            </div>
        </template>
    </div>
</template>

<script setup>
import { activeFuncTypeKey, changeActiveFuncTypeKey } from '../../hooks/useLoopGroupHook';
const activeFuncType = inject(activeFuncTypeKey);
const changeActiveFuncType = inject(changeActiveFuncTypeKey);
defineProps({
    funcTypes: {
        type: Array,
        default: () => []
    },
    funcTypeLoading: {
        type: Boolean,
        default: false
    }
});
</script>
<style lang="less" scoped>
.fun-types {
    flex: 0 0 200px;
    padding: 8px 16px;
    background-color: var(--gray-50);
    border-right: 1px solid var(--gray-200);
    .fun-type-item {
        height: 44px;
        padding: 0 8px;
        border-radius: 4px;
        cursor: pointer;
        &:hover {
            background-color: var(--alpha-30);
        }
        &.is-active {
            background-color: var(--blue-100);
            font-weight: 700;
            color: var(--blue-500);
        }
    }
}
</style>
