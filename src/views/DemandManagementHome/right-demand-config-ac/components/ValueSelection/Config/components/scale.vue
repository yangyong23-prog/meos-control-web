<template>
    <div
        ref="scaleBox"
        class="scale-temp"
        @mouseover="scaleTempMouseover"
        @mouseleave="scaleTempMouseout"
        @mousemove="scaleTempMove"
        @mousedown="scaleTempDown"
        @mouseup="scaleTempUp"
    >
        <!-- 背景条 -->
        <div class="scale-bg">
            <!-- 刻度线 -->
            <div class="scale-line">
                <ul>
                    <li v-for="(item, index) in markData.scaleInfo?.max * 10" :key="index"></li>
                </ul>
            </div>
        </div>
        <!-- 刻度值 -->
        <div class="scale-text">
            <ul>
                <li v-for="(item, index) in scaleText" :key="index">
                    {{ item.toFixed(1) }}<em>{{ (item + 1).toFixed(1) }}</em>
                </li>
            </ul>
        </div>
        <!-- 刻度标记 -->
        <div ref="markDomBlock" class="scale-mark">
            <div
                v-for="item in markData.markList"
                :key="item.id"
                class="scale-mark-temp"
                :class="{
                    'mark-temp-disabled': item.disabled,
                    'mark-temp-over': item.isHover,
                    'mark-temp-normal': !item.isHover && !item.disabled,
                    'mark-temp-active': item.value == markCurrent.value && !item.disabled
                }"
                :style="{ left: item.left + '%' }"
                @mouseover="markMouseover(item, $event)"
                @mouseleave="markMouseout(item, $event)"
                @mousedown="markDown(item, $event)"
                @mouseup="markUp(item)"
            >
                <input type="text" @keyup.delete="deleteMark(item, $event)" />
                <div v-if="!item.isCopy" class="temp-text">{{ item.value }}</div>
                <div v-if="!item.isCopy" class="temp-mark">
                    <span class="square"></span>
                    <span class="triangle"></span>
                </div>
                <div v-if="!item.isHover" class="temp-mark-line"><img :src="line" /></div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
// @ts-ignore
import i18n from '@/localization';
import _ from 'lodash';
import { markNodes } from './scaleTypes';
// eslint-disable-next-line import/extensions
import line from '@/assets/imgs/line.png';
import { ref, reactive } from 'vue';
import { isArrayBufferView } from 'util/types';

const scaleBox: any = ref(null);
// 刻度线的值
const scaleText: any = ref([]);
//是否执行了mouseout
const isChangeMouseout = ref(false);
// 鼠标进入时的位置
const mouseData: any = reactive({
    width: 580,
    max: 3,
    isMoving: false,
    isDown: false,
    markDown: false,
    domLeft: 0 //元素距离容器左侧距离
});
// 刻度标记数据
let markCurrent: any = reactive({});

const markData: any = inject('markData');

const emit = defineEmits(['setScaleData']);
const clickScale = () => {
    emit('setScaleData');
};
onMounted(() => {
    // 元素距离容器的宽度
    mouseData.domLeft = scaleBox?.value?.getBoundingClientRect().left;
    // 刻度线最大值
    let max = Number(markData.scaleInfo?.max);
    scaleText.value = Array.from(Array(max), (v, k) => k);
});
//触发区域 鼠标进入
const scaleTempMouseover = (e: any) => {
    mouseData.isMoving = true;
    let X = e.pageX - mouseData.domLeft,
        max = Number(markData.scaleInfo?.max);
    if (mouseData.markMouseover || mouseData.markDown) return;
    // 位置换算成百分比
    // eslint-disable-next-line one-var
    let left: any = (X / mouseData.width) * 100,
        val: any = (max * (left / 100)).toFixed(1);
    if (val <= 0 || val > max - 0.1) return;
    pushList(val, left);
};
// 触发区域 鼠标移动
const scaleTempMove = (e: any) => {
    if (!mouseData.isMoving) return;
    // 刻度线最大值
    let max = Number(markData.scaleInfo?.max),
        // (鼠标距离浏览器的距离)减去(容器距离屏幕的距离)=移动的位置
        moveDistance = e.clientX - mouseData.domLeft,
        // 移动的位置换算成百分比
        left: any = (moveDistance / mouseData.width) * 100,
        val: any = (max * (left / 100)).toFixed(1);
    // 超出的hover不显示start
    if (val <= 0 || val > max - 0.1) {
        scaleTempMouseout();
        // 标签按下移动时超出区域
        if (mouseData.markDown) {
            markUp(markCurrent);
        }

        mouseData.isMoving = true;
        isChangeMouseout.value = true;
    }
    if (isChangeMouseout.value) {
        //解决超出继续hover时不显示问题
        if (val > 0 && val < max) {
            pushList(val, left);
            isChangeMouseout.value = false;
            mouseData.isMoving = false;
        }
    }
    // 超出的hover不显示end
    //  标签move
    if (mouseData.markDown) {
        // 点击块 块move
        markCurrent.left = left;
        markCurrent.value = val < 0.1 ? 0.1 : val;
        clickScale();
    } else {
        // 触发区域mmove
        markData.markList.forEach((item: markNodes) => {
            if (item.isHover) {
                item.left = left;
                item.value = val;
            }
        });
    }
};
// 触发区域 鼠标离开
const scaleTempMouseout = () => {
    mouseData.isMoving = false;
    // mouseData.isDown = false
    // 鼠标离开时，只保留isHover状态为false的
    markData.markList = markData.markList.filter((item: markNodes) => !item.isHover);
};
// 打点-触发区域 鼠标按下
const scaleTempDown = (e: any) => {
    // // 刻度线最大值
    let max = Number(markData.scaleInfo?.max);
    // mouseData.isDown = true
    markData.markList.forEach((item: markNodes) => {
        if (item.isHover) {
            let val = item.value;
            item.left = (Number(val) / max) * 100;
            item.isHover = false;
        }
    });
    clickScale();
};
// 打点-触发区域 鼠标Up
const scaleTempUp = (e: any) => {
    mouseData.markDown = false;
};
// 标签事件
const markMouseover = (item: markNodes, e: any) => {
    if (item.isHover) return;
    mouseData.markMouseover = true;
    // 鼠标离开时，只保留isHover状态为false的
    markData.markList = markData.markList.filter((item: markNodes) => !item.isHover);
};
const markMouseout = (item: markNodes, e: any) => {
    mouseData.markMouseover = false;
};
const markDown = (item: markNodes, e: any) => {
    // 左右2个禁止点击
    if (item.disabled) return;
    markCurrent = item;
    item.isHover = true;
    item.isDown = true;
    mouseData.markDown = true;
    clickScale();
};
const markUp = (item: markNodes) => {
    item.isDown = false;
    mouseData.isMoving = false;
    // 去除重复
    // 去重复,避免解决点位重叠
    const uniqByArr = _.uniqBy(markData?.markList, 'value');
    markData!.markList = uniqByArr;
    // 刻度线最大值
    let max = Number(markData.scaleInfo?.max),
        // 移动的位置换算成百分比
        val = markCurrent.value;
    markCurrent.left = (Number(val) / max) * 100;
    mouseData.markDown = false;
};
const deleteMark = (item: markNodes, e: any) => {
    // 左右2个禁止点击
    if (item.disabled) return;
    markData.markList.forEach((n: any, index: number) => {
        // eslint-disable-next-line eqeqeq
        if (n.value == item.value) {
            markData.markList.splice(index, 1);
        }
    });
    mouseData.markMouseover = false;
    clickScale();
};
// 添加的元素
const pushList = (val: any, left: any) => {
    if (!_.find(markData.markList, { isHover: true })) {
        // hover时mark确定left值
        markData.markList.push({
            id: new Date().getTime(),
            value: val,
            left: left,
            isHover: true,
            tempFillRate: null,
            co2FillRate: null
        });
    }
};
</script>
<style scoped lang="less">
.scale-temp {
    width: 580px;
    position: relative;
    margin: 0 20px;
    color: #8b949e;
    font-size: 12px;
    // background: rgba(248, 118, 111, 0.2);
    height: 46px;
    user-select: none;
    .scale-bg {
        background: #2481f2;
        height: 16px;
        width: 100%;
        border-radius: 6px;
        overflow: hidden;
        position: absolute;
        bottom: 0;
    }
    .scale-line {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        ul {
            width: 100%;
            display: flex;
            li {
                height: 6px;
                width: 1px;
                margin-left: 1px;
                flex: 1;
                border-right: 1px solid #9fc9fb;
            }
        }
    }
    .scale-text {
        position: absolute;
        width: 100%;
        bottom: -18px;
        ul {
            width: 100%;
            display: flex;
            li {
                width: 21px;
                text-align: left;
                flex: 1;
                color: #8b949e;
                text-indent: -8px;
                position: relative;
                em {
                    position: absolute;
                    right: -5px;
                    top: 0;
                    display: none;
                }
                &:first-child {
                    margin-left: 0;
                }
                &:last-child {
                    em {
                        display: block;
                        font-style: normal;
                    }
                }
            }
        }
    }
    .scale-mark {
        position: absolute;
        height: 48px;
        bottom: 0;
        width: 100%;
    }
    .scale-mark-temp {
        transition: 0.1s;
        cursor: pointer;
        position: absolute;
        // margin-left: -10px;
        transform: translateX(-12px);
        height: 100%;
        width: 20px;
        .temp-text {
            background: #d9ebff;
            width: 19px;
            height: 20px;
            line-height: 24px;
            border-radius: 2px;
            line-height: 20px;
            text-align: center;
            margin: 0 auto;
        }

        .temp-mark {
            margin-left: 7px;
            position: relative;
            span {
                display: block;
            }
            .square {
                width: 8px;
                height: 8px;
                background: #64a6f7;
                border: 1px solid #fff;
                position: absolute;
                top: 0;
                left: 0;
                border-bottom: 0px;
                box-shadow: 0px 2px 2px 1px rgba(0, 0, 0, 0.1);
                transition: 0.1s;
            }
            .triangle {
                width: 5.5px;
                height: 5.5px;
                background: #64a6f7;
                border: 1px solid #fff;
                border-top: 0px;
                border-left: 0px;
                transform: rotate(45deg);
                position: absolute;
                top: 5px;
                left: 1.25px;
                transition: 0.1s;
            }
        }
        input {
            position: absolute;
            height: 48px;
            width: 21px;
            opacity: 0;
            z-index: 2;
        }
    }

    .mark-temp-disabled {
        transition: 0.1s;
        .temp-text {
            background: #e8ecf0;
        }
        .temp-mark {
            .square {
                background: #8b949e;
                border: 1px solid #fff;
            }
            .triangle {
                background: #8b949e;
                border: 1px solid #fff;
                border-top: 0px;
                border-left: 0px;
            }
        }
        .temp-mark-line {
            display: none;
            position: absolute;
            height: 16px;
            bottom: 0;
            left: 50%;
            margin-left: -3.5px;
            img {
                height: 100%;
            }
        }
    }
    .mark-temp-active {
        transition: 0.1s;
        .temp-text {
            background: #d9ebff;
            transform: scale(1.1);
        }
        .temp-mark {
            transform: scale(1.1);
            .square {
                background: #64a6f7 !important;
                border: 1px solid #246fe5 !important;
            }
            .triangle {
                background: #64a6f7 !important;
                border: 1px solid #246fe5 !important;
                border-top: 0px !important;
                border-left: 0px !important;
            }
        }
    }
    .mark-temp-normal {
        transition: 0.1s;
        z-index: 4;
        .temp-text {
            background: #d9ebff;
        }
        .temp-mark {
            .square {
                background: #64a6f7;
                border: 1px solid #fff;
            }
            .triangle {
                background: #64a6f7;
                border: 1px solid #fff;
                border-top: 0px;
                border-left: 0px;
            }
        }
        .temp-mark-line {
            position: absolute;
            height: 16px;
            bottom: 0;
            left: 50%;
            margin-left: -3px;
            img {
                height: 100%;
                vertical-align: top;
            }
        }
    }
}
</style>
