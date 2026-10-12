<template>
    <m-collapse v-model="subCollapseIds" class="second-collapse-container">
        <m-collapse-item v-for="subItem in props.data" :id="subItem.id" :key="subItem.id">
            <template #title="{ isActive }">
                <div class="risk-list-name-wrap">
                    <div v-ellipsis class="risk-list-name m-ellipsis">{{ subItem.localName || '' }}</div>
                </div>
                <IconMeriComponentChevronDown :color="'#8B949E'" :class="{ 'collapse-custom-icon': true, 'is-active': isActive }" />
            </template>
            <template #icon>
                <span></span>
            </template>
            <template #default="{ isActive }">
                <WrapTemplateCard :is-active="isActive" :data="subItem.danegerEventList" :risk-card-show-type="props.riskCardShowType" />
            </template>
        </m-collapse-item>
    </m-collapse>
</template>

<script setup>
import { IconMeriComponentChevronDown } from 'meri-icon';
import WrapTemplateCard from './WrapTemplateCard.vue';
// import { useIdleRenderCards } from '@/hooks/useIdleRenderCards';

const props = defineProps({
    active: {
        type: Boolean,
        default: false
    },
    data: {
        type: Array,
        default: () => []
    },
    riskCardShowType: {
        type: String,
        // unknown、riskManagement(状态不明、风险管控)
        default: 'unknown'
    }
});
const subCollapseIds = defineModel({ type: Array, default: () => [] });

// const { renderedCards, timeSlicing } = useIdleRenderCards(props);

// watch([() => props.data, () => props.active], () => {
//     if (props.active) {
//         timeSlicing();
//     }
// });
</script>

<style lang="less" scoped>
.second-collapse-container {
    display: flex;
    flex-direction: column;
    row-gap: 8px;

    :deep(.m-collapse-item) {
        border-radius: 8px;
        background: var(--Grey-Grey-50, #f7f9fa);
        border: 1px solid transparent;
        &:hover {
            border-color: #246fe5;

            & > .m-collapse-item__header {
                position: relative;
                background-color: transparent;
            }
        }
    }

    :deep(.m-collapse-item__header-icon) {
        margin: 0px;
        margin-left: auto;
    }
}
.risk-list-name-wrap {
    margin-right: auto;
    display: flex;
    align-items: center;
    min-width: 0;
}
.risk-list-name {
    color: var(--Grey-Grey-800, #2e3742);
    font-size: 16px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
}

.collapse-custom-icon {
    min-width: 16px;
    &:hover {
        background-color: rgba(196, 201, 207, 0.3);
    }

    &.is-active {
        transform: rotate(180deg);
    }
}
</style>
