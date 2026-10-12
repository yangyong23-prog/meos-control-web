<template>
    <div class="card-content-box">
        <m-scrollbar box-class="mAnchorWrap" bar-y-size="0px" bar-x-size="0px" bar-hover-string="0px">
            <div ref="boxRef" class="scroll-content">
                <div v-for="item in props.moduleList" :key="item.id" class="card-container">
                    <div :id="item.label" class="container-header">
                        <span class="icon">
                            <img :src="getSvgByCode(item.menuCode)" alt="" />
                        </span>
                        <span class="name">{{ item.label ?? '--' }}</span>
                    </div>
                    <div class="container-main">
                        <CardItem v-for="(data, index) in getCardItemList(item.children)" :key="index" :data="data" :code="item.menuCode"></CardItem>
                    </div>
                </div>
            </div>
        </m-scrollbar>
    </div>
</template>
<script setup>
import i18n from '@/localization';
import { getSvgByCode, getCardItemList } from '../utils/index';
import CardItem from './cardItem.vue';
import usePosition from '../hooks/usePosition';
const props = defineProps({
    moduleList: {
        type: Array,
        default: () => []
    }
});

const emits = defineEmits(['topPx']);

// #获取头部距离顶部的距离
const { boxRef } = usePosition(props, emits);
</script>
<style lang="less" scoped>
.card-content-box {
    height: 100%;
    overflow: hidden;
    .scroll-content {
        padding-bottom: 40px;
        .card-container {
            overflow: hidden;
            &:first-child {
                .container-header {
                    padding-top: 0;
                }
            }
            .container-header {
                position: relative;
                display: flex;
                align-items: center;
                padding-top: var(--tittle-padding-top);
                padding-bottom: 16px;
                span {
                    display: inline-block;
                }
                .icon {
                    margin-right: 4px;
                    width: 24px;
                    height: 24px;
                    img {
                        width: 100%;
                        height: 100%;
                    }
                }
                .name {
                    color: @grey-800;
                    font-size: 18px;
                    font-weight: 700;
                    line-height: 24px;
                    // background: blue;
                }
            }
            .container-main {
                display: flex;
                flex-flow: wrap;
                width: 100%;
                gap: 16px;
                align-content: space-between;
            }
        }
    }
}
</style>
