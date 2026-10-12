<template>
    <div class="ac-space-abm-icon-warp">
        <div class="space-icon-wrap">
            <div class="icon-content">
                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="33" viewBox="0 0 30 33" fill="none">
                    <g :filter="`url(#filter0_d_3310_${id})`">
                        <path
                            d="M14.9996 3.90918C19.5342 3.90918 23.2102 7.58521 23.2102 12.1197C23.2102 14.7791 21.9464 17.1427 19.9861 18.6431L19.9769 18.6495C19.7719 18.806 15.002 22.5 15.002 22.5C15.002 22.5 10.2185 18.7992 10.0136 18.6428C8.05353 17.1423 6.78906 14.7789 6.78906 12.1197C6.78906 7.58521 10.4651 3.90918 14.9996 3.90918Z"
                            :fill="`url(#paint0_linear_3310_${id})`"
                        />
                        <path
                            d="M15.002 22.5L14.6619 22.9394L14.6618 22.9392L14.6611 22.9387L14.6585 22.9367L14.6483 22.9288L14.6082 22.8978L14.4561 22.7801L13.9114 22.3587L12.2447 21.0695C11.0217 20.1236 9.77708 19.1612 9.67646 19.0844L9.67589 19.0839C7.58449 17.4829 6.23351 14.9592 6.23351 12.1197C6.23351 7.27838 10.1582 3.35362 14.9996 3.35362C19.841 3.35362 23.7658 7.27838 23.7658 12.1197C23.7658 14.9593 22.4156 17.4832 20.3238 19.0843L20.3129 19.0926L20.3038 19.0989C20.1484 19.2182 18.9404 20.1532 17.7527 21.0727L16.0906 22.3596L15.5475 22.7802L15.3957 22.8977L15.3558 22.9286L15.3456 22.9366L15.343 22.9386L15.3423 22.9391L15.3422 22.9392L15.002 22.5ZM15.002 22.5L14.662 22.9394L15.0021 23.2025L15.3421 22.9392L15.002 22.5Z"
                            stroke="white"
                            stroke-opacity="0.32"
                            stroke-width="1.11111"
                        />
                        <path
                            d="M16.0823 8.9668L15.5433 13.6012H14.4297L13.8906 8.9668H16.0823ZM15.0735 16.6982C14.4187 16.6982 13.8915 16.1445 13.8915 15.5775C13.8915 14.9701 14.4614 14.399 15.0735 14.399C15.6997 14.399 16.2549 14.9701 16.2549 15.5775C16.2549 16.1714 15.7139 16.6982 15.0735 16.6982Z"
                            fill="white"
                        />
                    </g>
                    <defs>
                        <filter
                            :id="`filter0_d_3310_${id}`"
                            x="-0.30303"
                            y="0.525125"
                            width="30.6061"
                            height="31.7135"
                            filterUnits="userSpaceOnUse"
                            color-interpolation-filters="sRGB"
                        >
                            <feFlood flood-opacity="0" result="BackgroundImageFix" />
                            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                            <feOffset dy="3.0303" />
                            <feGaussianBlur stdDeviation="2.65151" />
                            <feColorMatrix type="matrix" values="0 0 0 0 0.859075 0 0 0 0 0.211061 0 0 0 0 0.184378 0 0 0 0.32 0" />
                            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_3310_85200" />
                            <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_3310_85200" result="shape" />
                        </filter>
                        <linearGradient :id="`paint0_linear_3310_${id}`" x1="14.9996" y1="3.90918" x2="14.9996" y2="22.091" gradientUnits="userSpaceOnUse">
                            <stop stop-color="#FF7D72" />
                            <stop offset="1" stop-color="#DF2A16" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>
        </div>
    </div>
</template>
<script setup>
//
const props = defineProps({
    model: {
        type: Object,
        default: () => ({})
    },
    currentStyle: {
        type: Object,
        default: () => ({})
    }
});
const { id } = unref(props).model?.data || '';
const svgFilterId = ``;
</script>
<style lang="less" scoped>
.ac-space-abm-icon-warp {
    cursor: pointer;
    width: 24px;
    height: 24px;
    pointer-events: auto;
    .space-icon-wrap {
        width: 100%;
        height: 100%;
        // border: 1px solid rgba(255, 255, 255, 0.7);
        // border-radius: 4px;

        // .icon-content {
        //     width: 100%;
        //     height: 100%;
        //     display: flex;
        //     justify-content: center;
        //     align-items: center;
        //     :deep(svg) {
        //         fill: var(--icon-color);
        //         stroke: var(--icon-color);
        //         path {
        //             fill: var(--icon-color);
        //             stroke: var(--icon-color);
        //         }
        //     }
        // }
    }
}
</style>
