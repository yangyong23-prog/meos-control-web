<template>
    <div class="overall-layout wh100">
        <!-- 顶部字号调整 -->
        <div class="overall-layout-top">
            <div class="title">全局设置</div>
            <SelectFontSize
                :font-size="globalFontSize"
                :tab-model="'OVERALL_LAYOUT'"
                @change="tempFontSizeChange"
            ></SelectFontSize>
            <m-button
                v-if="isEmpty"
                id="recalculatePipelineC"
                type="default"
                size="medium"
                width="300"
                class="btn"
                @click="refreshPipeline('recalculatePipelineC')"
            >
                重新计算布局
            </m-button>
        </div>
        <div class="overall-layout-sort">
            <template v-if="isEmpty">
                <div class="overall-layout-sort-empty fcc">
                    <div class="empty-text">选择<strong>「图中元素」</strong>进行同组排序 或调整文本框最大宽度</div>
                </div>
                <!-- 操作指南 -->
                <OperationGuide :tab-model="'OVERALL_LAYOUT'"></OperationGuide>
            </template>
            <template v-else>
                <div class="overall-layout-sort-line"></div>
                <div class="overall-layout-sort-title fw700">同类设备设置</div>
                <div class="overall-layout-sort-input">
                    <ViewWidthInput
                        v-model:width="localNameMaxWidth"
                        :card-width-error-text="localNameMaxWidthErrorText"
                        :tab-model="'OVERALL_LAYOUT'"
                    ></ViewWidthInput>
                </div>
                <div class="overall-layout-sort-box" :class="{ 'is-edit': isEdit }">
                    <m-scrollbar>
                        <div class="overall-layout-sort-box-index">
                            <div
                                v-for="(item, index) in list"
                                :key="item.id + index"
                                class="overall-layout-sort-box-index-item fc"
                            >
                                <div class="fcc">{{ index + 1 }}</div>
                            </div>
                            <div ref="scroll" class="is-scroll"></div>
                        </div>
                        <VueDraggable v-model="list" class="overall-layout-sort-box-list">
                            <div v-for="item in list" :key="item.id" class="overall-layout-sort-box-list-item fcb">
                                <div v-ellipsis class="m-ellipsis">{{ item.name }}</div>
                                <div class="fcc list-item-icon">
                                    <VueSvg :path="require('@/assets/svg/move.svg')" />
                                </div>
                            </div>
                        </VueDraggable>
                    </m-scrollbar>
                </div>

                <div class="overall-layout-sort-bottom" :class="{ 'is-scroll': isScroll }">
                    <div class="overall-layout-sort-btn fcc">
                        <m-button
                            id="recalculatePipelineB"
                            type="default"
                            size="medium"
                            width="300"
                            @click="refreshPipeline('recalculatePipelineB')"
                        >
                            重新计算布局
                        </m-button>
                    </div>
                </div>
            </template>
        </div>
    </div>
</template>

<script setup>
import { recalculatePipelineFunKey, isEditDetailsKey, editorKey, globalFontSizeKey } from '@/utils/injectionKey';
import { computed, ref, onMounted, inject, onUnmounted, watch, nextTick } from 'vue';
import { VueDraggable } from 'vue-draggable-plus';
import VueSvg from '@/components/VueSvg.vue';
import { cloneDeep } from 'yushu-js-utils';
import { orderBy, isEqual } from 'lodash';
import { useErrorMessage } from '@/utils';
import SelectFontSize from './common/SelectFontSize.vue';
import ViewWidthInput from './common/ViewWidthInput.vue';
import OperationGuide from './common/OperationGuide.vue';
const isEditDetails = inject(isEditDetailsKey);
const globalFontSize = inject(globalFontSizeKey);
const recalculatePipelineFun = inject(recalculatePipelineFunKey);

const localNameMaxWidth = ref();
const localNameMaxWidthErrorText = ref('');

// 从注入中获取编辑器和设备名称列表
const editor = inject(editorKey);
// 参与滚动观察的元素引用
const scroll = ref();
// 滚动状态的ref
const isScroll = ref(false);
// 判断列表是否为空的computed
const isEmpty = computed(() => {
    return list.value.length === 0;
});
// 设备列表的ref
const list = ref([]);
// 观察器实例的ref
const intersectionObserver = ref();
// 当前选中的设备组ID列表的ref
const currentlySelectedGroupIds = ref([]);

const tempFontSize = ref();

const tempFontSizeChange = val => {
    tempFontSize.value = val;
};

// globalFontSize 和 tempFontSize 不双向绑定
watch(
    globalFontSize,
    () => {
        if (!tempFontSize.value) {
            tempFontSize.value = globalFontSize.value;
        }
    },
    {
        immediate: true
    }
);

// 刷新管道列表的数据
const refreshPipeline = btnId => {
    if (btnId === 'recalculatePipelineB') {
        if (localNameMaxWidth.value || localNameMaxWidth.value === 0) {
            if (parseInt(localNameMaxWidth.value) < 1 || parseInt(localNameMaxWidth.value) > 600) {
                localNameMaxWidthErrorText.value = '宽度设置区间为1～600px';
                useErrorMessage('宽度设置区间为1～600px');
                return;
            } else {
                localNameMaxWidthErrorText.value = '';
            }
        } else {
            localNameMaxWidthErrorText.value = '请输入宽度值';
            useErrorMessage('请输入宽度值');
            return;
        }
    }

    const obj = {
        fontSize: tempFontSize.value
    };
    if (list.value?.length) {
        obj.parent2ObjectId2SortValue = {};
        const { parentContainerId } = list.value[0];
        list.value.forEach((item, i) => {
            if (!obj.parent2ObjectId2SortValue[item.parentContainerId]) {
                obj.parent2ObjectId2SortValue[item.parentContainerId] = {};
            }
            obj.parent2ObjectId2SortValue[item.parentContainerId][item.id] = i;
        });

        if (localNameMaxWidth.value) {
            obj.equipmentGroupDetails = {
                [parentContainerId]: {
                    textSizeMap: {
                        localName: localNameMaxWidth.value
                    }
                }
            };
        }
    }
    isEditDetails.value = false;

    recalculatePipeline(obj, btnId);
};

/**
 * 创建一个IntersectionObserver实例，并观察指定的目标元素。
 * 当目标元素的可见性发生变化时，调用回调函数并传递可见性状态。
 *
 * @param {Element} target - 需要被观察的目标元素。
 * @param {Function} callback - 当目标元素的可见性发生变化时调用的回调函数。
 * 函数接受一个布尔值参数，表示目标元素当前是否可见。
 */
const intersectionObserverFun = (target, callback) => {
    // 初始化IntersectionObserver实例
    intersectionObserver.value = new IntersectionObserver(entries => {
        // 检查第一个入口项的intersectionRatio，判断目标元素的可见性
        if (entries[0].intersectionRatio < 1) {
            callback(true);
        } else {
            callback(false);
        }
    });
    // 开始观察目标元素
    intersectionObserver.value.observe(target);
};

/**
 * 设置当前选中的组ID数组。
 *
 * 此函数用于根据提供的设备对象数据来更新当前选中的组ID数组。如果新数组与旧数组相同，则不进行更新，
 * 只有在数组内容发生变化时才更新当前选中的组ID数组。
 *
 * @param {Array} equipObjectData - 设备对象数据数组，每个对象应包含一个dataObjectId属性。
 * @returns {boolean} 返回true表示当前选中的组ID数组已更新，返回false表示数组未发生变化，无需更新。
 */
const setCurrentlySelectedGroupIds = (equipObjectData = []) => {
    // 提取设备对象数据数组中的ID，生成新的ID数组
    const ids = equipObjectData.map(item => item.dataObjectId);

    // 如果当前选中的组ID数组长度大于0
    if (currentlySelectedGroupIds.value.length > 0) {
        // 比较新ID数组与当前选中的组ID数组是否相同
        if (isEqual(ids, currentlySelectedGroupIds.value)) {
            // 如果相同，表示没有变化，返回false
            return false;
        } else {
            // 如果不同，更新当前选中的组ID数组为新ID数组，并返回true
            currentlySelectedGroupIds.value = ids;
            return true;
        }
    } else {
        // 如果当前选中的组ID数组为空，直接将其更新为新ID数组，并返回true
        currentlySelectedGroupIds.value = ids;
        return true;
    }
};

// 处理点击事件，更新设备列表
const handleClick = (data, GroupWidthEquipData = { equipObjectData: [] }) => {
    const modelData = data?.[0]?.getModelData() || {};
    localNameMaxWidth.value = modelData?.textMap?.localName?.size?.x;
    let { equipObjectData } = GroupWidthEquipData;
    if (equipObjectData.length === 0) {
        equipObjectData = [modelData];
    }
    if (setCurrentlySelectedGroupIds(equipObjectData)) {
        let processedItems = cloneDeep(equipObjectData || []);
        processedItems = processItems(processedItems, editor?.getEquipNameReactiveData() || []);
        processedItems = orderBy(processedItems, 'sortValue');
        list.value = processedItems.map(item => ({
            id: item.dataObjectId,
            name: item.name,
            parentContainerId: item.parentContainerId
        }));
    }
};

// const globalFontSizeChange = size => {
//     console.log('globalFontSizeChange>>>', size);
// };

const processItems = (items, names = []) => {
    items.forEach(item => {
        const name = names.find(val => item?.dataObjectId === val.dataObjectId) || {};
        item.name = name?.aliasName || name?.localName || item?.dataObject?.localName;
        item.sortValue = +item?.sortValue || 0;
    });
    return items;
};
const handleClear = () => {
    list.value = [];
    currentlySelectedGroupIds.value = [];
};
const recalculatePipeline = (data, btnId) => {
    recalculatePipelineFun(data, btnId || 'recalculatePipelineB');
};
// 在组件挂载后，初始化滚动观察
onMounted(() => {
    // 注册编辑器的设备选择事件监听
    editor?.on('chooseEquip', handleClick);
    editor?.on('clearChoose', handleClear);
});

watch(
    () => list.value,
    () => {
        nextTick(() => {
            if (scroll.value) {
                intersectionObserverFun(scroll.value, type => {
                    isScroll.value = type;
                    intersectionObserver.value?.disconnect();
                });
            }
        });
    }
);

onUnmounted(() => {
    editor?.off('clearChoose', handleClear);
    editor?.off('chooseEquip', handleClick);
});
</script>
<style lang="scss" scoped>
.overall-layout {
    font-size: 14px;
    overflow: hidden;
    .overall-layout-top {
        padding: 0 20px;
        .title {
            color: #2e3742;
            font-size: 14px;
            font-weight: 700;
            height: 22px;
            line-height: 22px;
            margin-bottom: 8px;
        }
        .btn {
            margin-top: 12px;
        }
    }
    .overall-layout-sort {
        height: calc(100% - 114px);
        padding-bottom: 18px;
        display: flex;
        flex-direction: column;
        &-empty {
            height: calc(100% - 146px);
            color: var(--gray-500);
            .empty-text {
                width: 207px;
                height: 48px;
                color: #2e3742;
                text-align: center;
                line-height: 24px;
                font-weight: 400;
            }
        }
        &-line {
            border-top: 1px solid #e1e5eb;
            margin: 18px 20px;
        }
        &-title {
            color: #2e3742;
            font-size: 14px;
            line-height: 22px;
            margin: 0 20px;
        }
        &-input {
            margin: 8px 20px 20px;
        }
        &-box {
            max-height: calc(100% - 108px);
            min-height: 0;
            &.is-edit {
                max-height: calc(100% - 182px);
            }
            /* stylelint-disable-next-line selector-class-pattern */
            :deep(.m-scrollbar) {
                padding: 0 20px;
                /* stylelint-disable-next-line selector-class-pattern */
                .m-scrollbar__content {
                    display: flex;
                    padding-bottom: 8px;
                }
            }
            &-index {
                margin-right: 8px;
                display: grid;
                gap: 16px;
                position: relative;
                &-item {
                    height: 40px;
                    div {
                        height: 24px;
                        width: 24px;
                        background-color: var(--gray-700);
                        color: var(--gray-0);
                        border-radius: 4px;
                    }
                }
                .is-scroll {
                    position: absolute;
                    bottom: 0;
                    height: 1px;
                    width: 100%;
                    opacity: 0;
                }
            }
            &-list {
                width: calc(100% - 32px);
                .overall-layout-sort-box-list-item + .overall-layout-sort-box-list-item {
                    margin-top: 16px;
                }
                &-item {
                    height: 40px;
                    background: var(--gray-50);
                    border-radius: 4px;
                    border: 1px solid var(--gray-300);
                    padding: 10px 12px;
                    cursor: grab;
                    .m-ellipsis {
                        width: calc(100% - 20px);
                    }
                    .list-item-icon {
                        width: 18px;
                        height: 18px;
                    }
                }
            }
        }
        &-bottom {
            padding: 12px 20px 0 12px;
            position: relative;
            z-index: 1;
            &.is-scroll {
                box-shadow: 0 -3px 12px 0 #1b21291f;
            }
        }
        &-edited {
            border-radius: 4px;
            background-color: var(--orange-100);
            color: var(--orange-800);
            height: 62px;
            margin-top: 12px;
            padding: 9px 12px;
        }
    }
}
</style>
