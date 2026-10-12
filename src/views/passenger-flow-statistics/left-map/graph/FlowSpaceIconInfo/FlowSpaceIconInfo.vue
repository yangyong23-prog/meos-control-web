<template>
    <div class="flow-space-icon-info-warp" @mousemove.stop="emit('mouseMove', $event)" @dblclick.stop="emit('dbclick', $event)" @pointerdown="emit('pointerdown', $event)">
        <div v-if="mediaStyle.showMark" class="mark-icon-wrap">
            <svg width="35" height="38" viewBox="0 0 35 38" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M17.6817 0.517578C8.20328 0.517578 0.519531 8.15024 0.519531 17.5656C0.519531 25.1636 5.52334 31.6007 12.4361 33.8026C13.8388 34.2494 15.1595 34.9802 16.0777 36.1245L17.3659 37.7299C17.5275 37.9314 17.8358 37.9314 17.9974 37.7299L19.2856 36.1245C20.2038 34.9802 21.5245 34.2494 22.9272 33.8026C29.84 31.6007 34.8438 25.1636 34.8438 17.5656C34.8438 8.15024 27.1601 0.517578 17.6817 0.517578Z"
                    fill="#036FEB"
                />
                <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M11 17.75C11 21.4779 16.8125 26 17.75 26C18.6875 26 24.5 21.4779 24.5 17.75C24.5 14.0221 21.4779 11 17.75 11C14.0221 11 11 14.0221 11 17.75ZM17.7503 20.0827C19.2305 20.0827 20.4303 18.8828 20.4303 17.4027C20.4303 15.9225 19.2305 14.7227 17.7503 14.7227C16.2702 14.7227 15.0703 15.9225 15.0703 17.4027C15.0703 18.8828 16.2702 20.0827 17.7503 20.0827Z"
                    fill="white"
                />
                <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M17.5 1.03351C8.40963 1.03351 1.04043 8.35371 1.04043 17.3836C1.04043 24.6698 5.83873 30.8441 12.469 32.956C13.9176 33.4174 15.3269 34.1858 16.3199 35.4232L17.5 36.894L18.6801 35.4232C19.6731 34.1858 21.0824 33.4174 22.531 32.956C29.1613 30.8441 33.9596 24.6698 33.9596 17.3836C33.9596 8.35371 26.5904 1.03351 17.5 1.03351ZM0 17.3836C0 7.78292 7.83502 0 17.5 0C27.165 0 35 7.78292 35 17.3836C35 25.132 29.897 31.6951 22.8487 33.9402C21.5216 34.3629 20.3176 35.0406 19.4937 36.0674L18.2192 37.6558C17.851 38.1147 17.149 38.1147 16.7808 37.6558L15.5063 36.0674C14.6824 35.0406 13.4784 34.3629 12.1513 33.9402C5.10299 31.6951 0 25.132 0 17.3836Z"
                    fill="white"
                />
            </svg>
        </div>
        <div v-if="mediaStyle.showCard && renderData.num" class="statistics-card" :style="{ backgroundColor: mediaStyle.cardBgColor }">
            <span class="statistics-icon-warp" :style="`--icon-color:${mediaStyle.iconColor};`">
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="12" viewBox="0 0 13 12" fill="none">
                    <g clip-path="url(#clip0_3512_15170)">
                        <path
                            d="M8.8889 8.10391C8.11663 7.38672 6.2639 6.95547 6.07288 6.52656C5.9721 6.30039 5.93109 6.04609 6.19945 5.78945C6.7889 5.34648 7.18499 4.53437 7.18499 3.60508C7.18499 2.20234 6.28382 1.06445 5.17171 1.06445C4.0596 1.06445 3.15843 2.20234 3.15843 3.60508C3.15843 4.53906 3.55804 5.35469 4.15218 5.79648C4.15218 5.79648 4.63148 6.45156 4.09828 6.72227C3.56507 6.99297 2.24203 7.56484 1.68538 7.94219C1.12874 8.31953 0.372885 9.12695 0.518198 10.9363H9.75374C9.75257 10.9363 9.96937 9.10703 8.8889 8.10391Z"
                        />
                        <path
                            d="M11.6184 8.10391C10.8461 7.38672 8.99336 6.95547 8.80234 6.52656C8.70156 6.30039 8.66055 6.04609 8.92891 5.78945C9.51836 5.34648 9.91445 4.53437 9.91445 3.60508C9.91445 2.20234 9.01328 1.06445 7.90117 1.06445C7.61406 1.06445 7.34102 1.14062 7.09375 1.27656C7.80391 1.66914 8.29961 2.56328 8.29961 3.60391C8.29961 4.5332 7.90469 5.34531 7.31406 5.78828C7.0457 6.04492 7.08672 6.29922 7.1875 6.52539C7.37852 6.9543 9.23125 7.38555 10.0035 8.10273C11.084 9.10703 10.8672 10.9352 10.8672 10.9352H12.4809C12.482 10.9363 12.6988 9.10703 11.6184 8.10391Z"
                        />
                    </g>
                    <defs>
                        <clipPath id="clip0_3512_15170">
                            <rect width="12" height="12" fill="white" transform="translate(0.5)" />
                        </clipPath>
                    </defs>
                </svg>
            </span>
            <span class="statistics-card-text" :style="{ color: mediaStyle.cardFontColor }">{{ renderData.num }}{{ i18n.global.t('common.human') }}</span>
            <div class="card-before" :style="{ borderColor: mediaStyle.cardBgColor }" />
        </div>
        <div class="flow-space-name" :style="{ color: mediaStyle.nameColor }">{{ renderData.localName ?? '--' }}</div>
    </div>
</template>
<script setup>
import i18n from '@/localization';
import { inject } from 'vue';
const renderData = inject('renderData');
const mediaStyle = inject('mediaStyle');
const emit = defineEmits(['mouseMove', 'dbclick', 'pointerdown']);
</script>
<style lang="less" scoped>
.flow-space-icon-info-warp {
    display: inline-block;
    position: relative;
    cursor: pointer;

    .mark-icon-wrap {
        position: absolute;
        top: calc(-100% - 22px);
        left: 50%;
        transform: translateX(-50%);
    }
    .statistics-card {
        position: absolute;
        display: flex;
        height: 20px;
        padding: 2px 4px;
        align-items: center;
        gap: 2px;
        border-radius: 4px;
        top: calc(-100% - 12px);
        left: 50%;
        transform: translateX(-50%);
        white-space: nowrap;
        box-shadow: 0px 3px 12px 0px rgba(27, 33, 41, 0.12), 0px 0.5px 3px 0px rgba(27, 33, 41, 0.08);

        .statistics-icon-warp {
            display: inline-block;
            color: var(--gray-900);
            path {
                fill: var(--icon-color);
            }
        }
        .statistics-card-text {
            font-size: 12px;
            white-space: nowrap;
        }
        .card-before {
            position: absolute;
            bottom: -4px;
            left: 50%;
            transform: translateX(-50%) rotateZ(45deg);
            z-index: 1;
            height: 8px;
            width: 8px;
            border-left: 4px solid transparent;
            border-top: 4px solid transparent;
            border-bottom: 4px solid #fff;
            border-right: 4px solid #fff;
        }
    }
    .flow-space-name {
        font-size: 12px;
        text-shadow: 1px 0 0 #fff, 0 1px 0 #fff, -1px 0 0 #fff, 0 -1px 0 #fff;
    }
}
</style>
