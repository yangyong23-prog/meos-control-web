<template>
    <div class="spatial-indicator-wrapper">
        <template v-for="(iotInfo, i) in iotItems" :key="i">
            <div class="text" :style="{ color: textColorRef }">{{ iotInfo.name }}{{ iotInfo.valText }}</div>
            <svg v-if="i < iotItems.length - 1" class="split-line" xmlns="http://www.w3.org/2000/svg" width="4" height="13" viewBox="0 0 4 13" fill="none">
                <path
                    d="M0.666016 11.7812V12.2812H1.16602H2.16602H2.66602V11.7812V1.78125V1.28125H2.16602H1.16602H0.666016V1.78125V11.7812Z"
                    fill="#8B949E"
                    fill-opacity="0.6"
                    stroke="white"
                />
            </svg>
            <!-- <div v-if="i < iotItems.length - 1" class="split-line">
            </div> -->
        </template>
    </div>
</template>

<script setup>
import i18n from '@/localization';
const props = defineProps({
    model: {
        type: Object,
        default: () => ({})
    },
    infoCodes: {
        type: Array,
        default: () => []
    },
    currentStyle: {
        type: Object,
        default: () => ({})
    }
});

const showTextRef = ref(true);
const textColorRef = ref('');

const iotItems = computed(() => {
    // console.log('props.model?.data: ', props.infoCodes);
    return props.infoCodes?.map(obj => {
        return {
            ...obj,
            name: `${obj.infoCodeName || ''}：`,
            valText: `${obj.dataValue || '--'}${obj.unit || ''}`
        };
    });
});

watch(
    () => props.currentStyle,
    () => {
        if (!props.currentStyle) return;
        // XXX 待确认渲染样式
        const { showText, color } = props.currentStyle;
        showTextRef.value = showText;
        textColorRef.value = color;
    },
    {
        immediate: true
    }
);
</script>

<style lang="less" scoped>
.spatial-indicator-wrapper {
    // width: 100%;
    // height: 100%;
    display: inline-flex;
    height: 18px;
    padding: 0px 4px;
    // transform: translateY(16px);

    justify-content: center;
    align-items: center;
    gap: 6px;
    flex-shrink: 0;
    pointer-events: auto;

    .text {
        color: var(--gray-600, #626c78);
        text-align: center;
        font-size: 12px;
        font-style: normal;
        font-weight: var(--platform-font-weight);
        line-height: normal;
        text-shadow: 1px 0 0 @white, 0 1px 0 @white, -1px 0 0 @white, 0 -1px 0 @white;
    }

    .split-line {
        width: 4px;
        height: 13px;
        fill: rgba(139, 148, 158, 0.6);

        stroke-width: 1px;
        stroke: #fff;
    }

    .container {
        display: flex;
        column-gap: 6px;

        .separator {
            width: 1px;
            height: 10px;
            background-color: #8b949e;
        }
    }
}
</style>
