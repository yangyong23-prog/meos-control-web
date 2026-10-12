<template>
    <div class="space-card-2d-warp" :class="{ hide: !showCard }" :style="{ opacity: opacityRef }">
        <div
            class="container-wrap"
            :style="{ transform: `translateY(calc(-50% - ${bottomGap}px))` }"
            @mouseenter.stop="hoverIn = true"
            @mouseleave.stop="hoverIn = false"
            @mousemove.stop="mouseAction"
        >
            <div class="list-wrap">
                <div v-for="(controller, i) in displayControllers" :key="i" class="Controller">
                    <div class="title" :class="{ 'title--selected': selectedControlerId === controller.id && showSelect }" @click="handleControllerClick(controller)">
                        <m-tips :style="{ pointerEvents: 'none' }" :content="controller.localName ?? '--'" theme="darkTransparent" trigger="hover" :enterable="false">
                            <span>
                                {{ controller.localName ?? '--' }}
                            </span>
                        </m-tips>
                        <arrowRight />
                    </div>
                    <div class="circuits-row">
                        <template v-for="(circuit, j) in controller.controlsLoops" :key="j">
                            <m-tips :style="{ pointerEvents: 'none' }" :content="circuit.localName ?? '--'" theme="darkTransparent" trigger="hover" :enterable="false">
                                <span
                                    class="circuit-svg"
                                    :class="[getCircuitCssClasses(circuit), selectedCircuitId === circuit.id && showSelect ? 'circuit-svg-selected' : '']"
                                    @click="handleCircuitClick(circuit)"
                                >
                                    <!-- <component
                                        :is="getCircuitSvg(circuit)"
                                        v-if="!(selectedCircuitId === circuit.id && showSelect)"
                                    /> -->
                                </span>
                            </m-tips>
                        </template>
                    </div>
                </div>
                <div v-if="!showAll" class="more-tip">
                    {{ i18n.global.t('meos_control_web.there_are_still', { name: '' }) }}
                    <span>{{ i18n.global.t('meos_control_web.certain_number', { count: currentControllers.length - 4 }) }}</span>
                    {{ i18n.global.t('meos_control_web.control_module_ellipsis') }}
                </div>
            </div>
            <svg class="arrow" xmlns="http://www.w3.org/2000/svg" width="9" height="5" viewBox="0 0 9 5" fill="none">
                <path d="M4.5 4.29687L0.169823 -0.000923437L8.83008 -0.00092268L4.5 4.29687Z" fill="white" />
            </svg>
            <div class="bottom"></div>
        </div>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import { MTips } from 'meri-plus';
import turnOnSvg from '@/assets/svg/indoorLighting/turn_on.svg';
import turnOffSvg from '@/assets/svg/indoorLighting/turn_off.svg';
import inconsistencySvg from '@/assets/svg/indoorLighting/inconsistency.svg';
import turnOnInconsistencySvg from '@/assets/svg/indoorLighting/turn_on_inconsistency.svg';
import turnOffInconsistencySvg from '@/assets/svg/indoorLighting/turn_off_inconsistency.svg';
import unknownSvg from '@/assets/svg/indoorLighting/unknown.svg';
import arrowRight from '@/assets/svg/indoorLighting/arrow.right.svg';
import DockSingleton from '@/hooks/responsiveDock';
import { INFOCODE } from '@/views/IndoorLighting/variables';
import { getLoopListByFloorIdKey } from '@/views/IndoorLighting/hooks/useBaseHook';

const props = defineProps({
    model: {
        type: Object,
        required: true
    },
    currentStyle: {
        type: Object,
        default: () => ({})
    }
});
const showCard = ref(false);

let hideTimeout = null;
const requestHideCard = () => {
    showCard.value = false;
};
// 状态变量
const hoverIn = ref(false);

const mouseAction = () => {
    emit('hover');
};

// 当前显示的控制器: 根据状态样式属性，是否过滤异常回路及控制模块
const currentControllers = computed(() => {
    let targetControllers = allControllers.value;
    const newArr = [];
    if (!fullShow.value) {
        // 过滤掉没有异常回路（多开少开本地）的控制器
        targetControllers?.forEach(controller => {
            if (!controller.originControlsLoops) {
                controller.originControlsLoops = controller.controlsLoops;
            }
            const newController = { ...controller };
            delete newController.controlsLoops;
            const newControlsLoops = controller.controlsLoops.filter(loop => {
                const runStatusInfo = getIotData(loop.id, INFOCODE.runStatus0.infoCode);
                const open = runStatusInfo?.dataValue === INFOCODE.runStatus1.dataValue;
                const close = runStatusInfo?.dataValue === INFOCODE.runStatus0.dataValue;
                const more = getIotData(loop.id, INFOCODE.controlDeviationStatus1.infoCode).dataValue === INFOCODE.controlDeviationStatus1.dataValue;
                const less = getIotData(loop.id, INFOCODE.controlDeviationStatus2.infoCode).dataValue === INFOCODE.controlDeviationStatus2.dataValue;
                const local = getIotData(loop.id, INFOCODE.localRemoteStatus0.infoCode).dataValue === INFOCODE.localRemoteStatus0.dataValue;
                // 多开少开状态未知，本地
                return more || less || local || !(open || close);
            });
            newController.controlsLoops = newControlsLoops;
            if (newController.controlsLoops.length > 0) {
                newArr.push(newController);
            }
            // return controller.controlsLoops?.length > 0;
        });
    } else {
        newArr.push(...targetControllers);
    }

    return newArr;
});
const showAll = computed(() => {
    if (showSelect.value) {
        return true;
    } else if (currentControllers.value.length > 4) {
        return hoverIn.value;
    }
    return true;
});

// #当前图元的叠加样式集合
const currentStyle = ref(props?.model?.caclCurrentStyle() || {});

const opacityRef = computed(() => currentStyle.value?.opacity || 1);

const bottomGap = computed(() => currentStyle.value?.bottomGap || 20);

// 计算属性

const allControllers = computed(() => props.model.data?.hostsControlers || []);
const show = computed(() => currentStyle.value?.show && displayControllers.value.length > 0);
const showSelect = computed(() => currentStyle.value?.showSelect);
const fullShow = computed(() => currentStyle.value?.fullShow || hoverIn.value);
const displayControllers = computed(() => {
    let targetControllers = currentControllers.value;

    return showAll.value ? targetControllers : targetControllers.slice(0, 4);
});

props.model.addObserver('ChangeState', e => {
    currentStyle.value = props?.model?.caclCurrentStyle() || {};
});

const { getIotData } = DockSingleton.getInstance();

// 获取回路状态对应的图标
const getCircuitSvg = circuit => {
    // TODO: 待优化
    const local = getIotData(circuit.id, INFOCODE.runStatus0.infoCode).dataValue === INFOCODE.runStatus0.dataValue;
    const close = getIotData(circuit.id, INFOCODE.runStatus0.infoCode).dataValue === INFOCODE.runStatus0.dataValue;
    const open = getIotData(circuit.id, INFOCODE.runStatus1.infoCode).dataValue === INFOCODE.runStatus1.dataValue;
    const unknown = INFOCODE.runStatusNull.checkDataValue(getIotData(circuit.id, INFOCODE.runStatusNull.infoCode).dataValue);
    const more = getIotData(circuit.id, INFOCODE.controlDeviationStatus1.infoCode).dataValue === INFOCODE.controlDeviationStatus1.dataValue;
    const less = getIotData(circuit.id, INFOCODE.controlDeviationStatus2.infoCode).dataValue === INFOCODE.controlDeviationStatus2.dataValue;

    if (close && (more || less)) {
        return turnOffInconsistencySvg;
    } else if (open && (more || less)) {
        return turnOnInconsistencySvg;
    } else if (open) {
        return turnOnSvg;
    } else if (close) {
        return turnOffSvg;
    }
    return unknownSvg;
};

const getCircuitCssClasses = loop => {
    const classes = [];
    const runStatusInfo = getIotData(loop.id, INFOCODE.runStatus0.infoCode);
    const open = runStatusInfo?.dataValue === INFOCODE.runStatus1.dataValue;
    const close = runStatusInfo?.dataValue === INFOCODE.runStatus0.dataValue;
    const more = getIotData(loop.id, INFOCODE.controlDeviationStatus1.infoCode).dataValue === INFOCODE.controlDeviationStatus1.dataValue;
    const less = getIotData(loop.id, INFOCODE.controlDeviationStatus2.infoCode).dataValue === INFOCODE.controlDeviationStatus2.dataValue;
    const local = getIotData(loop.id, 'localRemoteStatus').dataValue === '0';
    classes.push(open ? 'open' : close ? 'close' : 'unknown');
    if (less || more) {
        classes.push('less-more');
    }
    if (local) classes.push('local');
    return classes.join(' ');
};

const selectedControler = () => {
    selectedControlerId.value = '';
};

const clearSelectedCircuit = () => {
    selectedCircuitId.value = '';
};

const emit = defineEmits(['clickCircuit', 'clickControler', 'hover']);
const selectedCircuitId = ref('');
const selectedControlerId = ref('');

const handleControllerClick = controller => {
    clearSelectedCircuit();
    selectedControler();
    selectedControlerId.value = controller.id;
    emit('clickControler', controller);
};

const handleCircuitClick = circuit => {
    clearSelectedCircuit();
    selectedControler();
    selectedCircuitId.value = circuit.id;
    emit('clickCircuit', circuit);
};
onMounted(() => {
    watch(
        [show, hoverIn],
        () => {
            if (!show.value && !hoverIn.value) {
                requestHideCard();
            } else {
                showCard.value = true;
            }
        },
        { immediate: true }
    );
});
</script>

<style lang="less" scoped>
.space-card-2d-warp {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    pointer-events: none;

    .container-wrap {
        display: inline-flex;
        flex-direction: column;
        align-items: center;
        width: 138px;
        background: white;
        border-radius: 4px;
        box-shadow: 0px 2px 10px 0px rgba(137, 137, 137, 0.4);
        pointer-events: auto;

        .list-wrap {
            width: 100%;
            padding: 4px;

            .Controller {
                margin-bottom: 4px;

                .title {
                    display: inline-block;
                    font-size: 12px;
                    color: var(--gray-600, #626c78);
                    margin-bottom: 4px;
                    display: flex;
                    align-items: center;
                    font-weight: var(--platform-font-weight);
                    cursor: pointer;
                    height: 20px;
                    padding: 0px 2px;
                    border-radius: 2px;

                    span {
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                    }

                    :deep(svg) {
                        path {
                            fill: #626c78;
                        }
                    }

                    &:hover {
                        background-color: rgba(98, 108, 120, 0.1);
                    }

                    &.title--selected {
                        background-color: rgba(98, 108, 120, 0.15);
                        color: var(--Grey-Grey-0, #fff);
                        background: var(--blue-500, #246fe5);

                        :deep(svg) {
                            path {
                                fill: #fff;
                            }
                        }
                    }
                }

                .circuits-row {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 2px;
                    margin-bottom: 2px;

                    .circuit-svg {
                        width: 14px;
                        height: 14px;
                        position: relative;
                        display: inline-block;
                        cursor: pointer;
                        border-radius: 50%;
                        border: 2px solid transparent;

                        &.open {
                            background-color: #33d4d2;
                        }
                        &.close {
                            background-color: #a0a5aa;
                        }
                        &.unknown {
                            background-color: #fa9b96;
                        }
                        &.less-more {
                            border: 2px solid #f16800;
                        }
                        &.local::after {
                            content: ''; /* 伪元素必须有 content */
                            display: block;
                            position: absolute;
                            left: 0.5px;
                            top: 5px;
                            width: 0px;
                            height: 0px;
                            /* 边框设置：下边框为白色，左右为透明（方向可根据需求调整） */
                            border-left: 4px solid transparent;
                            border-right: 4px solid transparent;
                            border-bottom: 8px solid #fff; /* 三角形的高度和颜色 */
                            /* 调整位置（可选，让三角形更居中） */
                            transform: translateY(-5px); /* 微调垂直位置 */
                        }
                        &.circuit-svg-selected {
                            background-color: var(--blue-500, #246fe5);
                        }
                    }
                }
            }

            .more-tip {
                color: #626c78;
                font-size: 12px;
                font-weight: var(--platform-font-weight);
                span {
                    color: #246fe5;
                }
            }
        }

        .arrow {
            position: absolute;
            width: 9px;
            height: 5px;
            bottom: -5px;
        }
        .bottom {
            position: absolute;
            width: 100%;
            height: 10px;
            bottom: -10px;
            pointer-events: auto;
        }
    }

    &.hide {
        display: none;
    }
}
</style>
