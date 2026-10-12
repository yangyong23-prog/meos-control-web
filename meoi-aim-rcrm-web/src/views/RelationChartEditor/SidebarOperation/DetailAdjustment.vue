<template>
    <div class="detail-adjustment">
        <div v-if="isEmpty" class="empty-warp">
            <div class="empty">
                <!-- 可以添加系统信息点的 -->
                <div v-if="graphHeaderData?.objType === 'system' || copyGraphTypeList?.length" class="empty-system">
                    <div class="empty-text">选择<strong>「图中元素」</strong>进行编辑</div>
                    <div class="empty-tag">
                        <m-tag color="#8B949E" bg-color="#E8ECF0" size="medium">或</m-tag>
                    </div>
                    <div class="empty-btn">
                        <m-button
                            v-if="graphHeaderData?.objType === 'system'"
                            type="default"
                            size="medium"
                            style="width: 100%; margin-bottom: 12px"
                            @click="addSystemInfoPoint(graphHeaderData)"
                            >添加系统信息点</m-button
                        >
                        <m-button
                            v-if="copyGraphTypeList?.length"
                            type="default"
                            size="medium"
                            style="width: 100%"
                            @click="copyDetailData()"
                            >引用其他副本信息点</m-button
                        >
                    </div>
                </div>
                <!-- 不可添加的 -->
                <div v-else class="empty-text">选择<strong>「图中元素」</strong>进行编辑</div>
            </div>
            <!-- 操作指南 -->
            <OperationGuide :tab-model="'DETAIL_ADJUSTMENT'"></OperationGuide>
        </div>
        <template v-else>
            <m-scrollbar ref="scrollbarRef" class="opeartion-scroll-warp">
                <CopyInfoPoint v-if="isCopyInfoPointData" @clear-choose="clearChoose" />
                <template v-else>
                    <div ref="opeartionScrollBoxRef" class="opeartion-scroll-box">
                        <template v-if="!isShowSystemInfoPoint">
                            <!-- 组合命名 -->
                            <template v-if="isShowGroupName">
                                <div class="opeartion-scroll-warp-title">
                                    组合命名<m-switch
                                        v-model="showGroupName"
                                        @change="changeGroupNameOpenClose"
                                    ></m-switch>
                                </div>
                                <m-input
                                    v-if="showGroupName === 'checked'"
                                    v-model="groupName"
                                    class="group-name-input"
                                    width="300"
                                    @blur="modifyGroupNameChange"
                                    @keyup.enter="modifyGroupNameChange"
                                >
                                </m-input>
                            </template>
                            <!-- 选中设备 -->
                            <template v-if="isShowSelectedEquip">
                                <div class="opeartion-scroll-warp-title selected-equip-title">选中设备</div>
                                <SelectedEquipSelect
                                    v-model="selectedEquipIds"
                                    :options="selectedEquipOptions"
                                    :disabled="isDisabledSelectedEquip"
                                    @change="changeSelectedEquips"
                                />
                            </template>
                            <!-- 设备名称 -->
                            <template v-if="isShowEquipName && !isSelectedEquipLoading">
                                <div class="opeartion-scroll-warp-title">设备名称</div>
                                <m-input
                                    v-model="equipName"
                                    width="300"
                                    class="equip-name-input"
                                    @blur="modifyEquipName"
                                    @keyup.enter="modifyEquipName"
                                />
                            </template>
                            <!-- 信息点字号 -->
                            <div v-if="isShowInfoPointFontSize" class="font-select">
                                <SelectFontSize
                                    v-model:font-size="cardFontSize"
                                    :tab-model="'DETAIL_ADJUSTMENT'"
                                    @change="modifyCardFontSize"
                                ></SelectFontSize>
                            </div>
                            <!-- 信息卡片宽度 -->
                            <div v-if="isShowInfoPointWidth" class="width-input">
                                <ViewWidthInput
                                    v-model:width="cardWidth"
                                    :card-width-error-text="cardWidthErrorText"
                                    :tab-model="'DETAIL_ADJUSTMENT'"
                                    @change="modifyCardWidth"
                                ></ViewWidthInput>
                            </div>
                            <!-- 小附件大小 -->
                            <template v-if="isShowPassByScaleAndPos">
                                <div class="multiplier-select">
                                    <SelectMultiplier
                                        :now-multiplier="passByScale"
                                        @change-pass-by-scale="changePassByScale"
                                    ></SelectMultiplier>
                                </div>
                                <div class="opeartion-scroll-warp-title mt18">小附件名称</div>
                                <m-input
                                    v-model="passByName"
                                    width="300"
                                    class="passby-name-input"
                                    maxlength="20"
                                    @blur="modifyPassByName"
                                    @keyup.enter="modifyPassByName"
                                />
                                <template v-if="!isMutil">
                                    <div class="opeartion-scroll-warp-line"></div>
                                    <div class="opeartion-scroll-warp-title opeartion-scroll-warp-title-position">
                                        位置<span class="remark">（可以在图中顺着管道拖拽小附件）</span>
                                    </div>
                                </template>
                            </template>
                            <!-- 单独展示不需要 -->
                            <div
                                v-if="
                                    (isShowInfoPointWidth ||
                                        isShowInfoPointFontSize ||
                                        isShowEquipName ||
                                        isShowSelectedEquip ||
                                        isShowGroupName ||
                                        isShowPassByScaleAndPos) &&
                                    (isShowInfoPointList || isShowSystemInfoPoint || isShowAlignment)
                                "
                                class="opeartion-scroll-warp-line"
                            ></div>
                            <!-- 对齐方式 -->
                            <template v-if="isShowAlignment">
                                <Alignment @modify-align="modifyAlign"></Alignment>
                            </template>
                        </template>

                        <!-- 信息点  -->
                        <template v-if="isShowInfoPointList || isShowSystemInfoPoint">
                            <div class="info-point-container">
                                <div class="opeartion-scroll-warp-title">
                                    {{ isShowSystemInfoPoint ? '系统信息' : '信息点' }}
                                    <span v-if="!isMutil" class="remark"
                                        >可添加参数至图中，<strong> 按住[Shift]</strong>多选</span
                                    >
                                </div>
                                <m-input
                                    v-model="infoPointSearch"
                                    class="info-point-input"
                                    :width="300"
                                    :clearable="true"
                                    prefix-icon="IconMeriActionSearch"
                                    @keyup.enter="handleBlur"
                                    @blur="handleBlur"
                                    @input="handleInput"
                                ></m-input>
                                <div
                                    ref="infoPointBoxRef"
                                    class="info-point-box"
                                    :style="{
                                        paddingBottom: infoCodeListParams?.length > 0 && showInfoPointMore ? '32px' : 0
                                    }"
                                >
                                    <Information
                                        :parent-height="parentHeight"
                                        :is-loading="isLoading"
                                        :is-mutil="isMutil"
                                        :info-point-search="infoPointSearch"
                                        :info-code-list-params="infoCodeListParams"
                                        :info-code-list-tags="infoCodeListTags"
                                        @handle-blur="handleBlur"
                                        @change="infoPointChooseChange"
                                    />
                                </div>
                            </div>
                        </template>
                    </div>
                    <!-- 收起 写到这里是要始终置底 -->
                    <div
                        v-if="infoCodeListParams?.length > 0 && showInfoPointMore && openBtnBottom"
                        class="retract-box"
                    >
                        <span class="rel-btn" @click="showInfoPointMore = !showInfoPointMore">
                            收起<IconMeriComponentChevronUp size="14" color="#246FE5" />
                        </span>
                    </div>
                </template>
            </m-scrollbar>

            <div v-if="infoPointData" class="detail-bottom">
                <m-button type="primary" class="detail-bottom-btn" size="medium" width="299" @click="addToChart"
                    >添加至图中</m-button
                >
                <PreviewModel :info-point-data="infoPointData" />
            </div>
        </template>
    </div>
</template>

<script setup>
import { computed, ref, inject, onUnmounted, watch, provide } from 'vue';
import { IconMeriComponentChevronUp } from 'meri-icon';
import { graphHeaderDataKey } from '@/utils/injectionKey';
import Information from './InformationPoint/index.vue';
import useAdjustment from '../hooks/useAdjustment';
import useAdjustmentShowNode from '../hooks/useAdjustmentShowNode';
import { editorKey } from '@/utils/injectionKey';
import PreviewModel from './PreviewModel.vue';
import SelectFontSize from './common/SelectFontSize.vue';
import ViewWidthInput from './common/ViewWidthInput.vue';
import SelectMultiplier from './common/SelectMultiplier.vue';
import OperationGuide from './common/OperationGuide.vue';
import Alignment from './common/Alignment.vue';
import CopyInfoPoint from './copyInfoPoint.vue';
import SelectedEquipSelect from './common/SelectedEquipSelect.vue';
const editor = inject(editorKey);
const graphHeaderData = inject(graphHeaderDataKey);

const scrollbarRef = ref();
const opeartionScrollBoxRef = ref(null);
const infoPointBoxRef = ref(null);
const parentHeight = ref(0);
const openBtnBottom = ref(false);

const updateScrollbar = () => {
    scrollbarRef.value?.update();
};

const {
    isLoading,
    showGroupName, // 是否显示组合名称
    isEmpty, // 是否为空
    isShowSystemInfoPoint, // 是否显示系统信息点
    isMutil, // 是否选择了多个
    groupName, // 分组名字
    passByName, // 小附件名字
    equipName, // 设备名字
    passByScale, // 当前小部件 缩放等级
    infoCodeListParams, // 可选信息点列表
    infoCodeListTags, // 可选标签列表
    infoPointData, // 用于预览的信息点数据
    currentChooseModles, // 当前选中的model,
    cardFontSize, // 卡片字号
    cardWidth, // 卡片宽度
    cardWidthErrorText, // 卡片宽度错误信息
    infoPointSearch, // 信息点搜索
    showInfoPointMore, // 是否显示更多信息点
    isCopyInfoPointData, // 引用其他副本信息点列表
    copyGraphTypeList,
    selectedEquipOptions,
    selectedEquipIds,
    isSelectedEquipLoading,
    handleBlur, // 信息点模糊搜索
    handleInput,
    addToChart, // 添加到图中
    handleChoose, // 图中选中
    clearChoose, // 清除选中
    infoPointChooseChange, // 信息点选中
    modifyGroupNameChange, // 组合命名
    changeGroupNameOpenClose, // 组合命名开关
    modifyEquipName, // 设备名称修改
    modifyPassByName, // 小附件名称修改
    addSystemInfoPoint, // 添加系统信息点
    modifyCardWidth, // 修改卡片宽度
    modifyCardFontSize,
    changePassByScale, // 小部件缩放等级修改
    modifyAlign,
    copyDetailData, // 引用其他副本信息点
    changeSelectedEquips
} = useAdjustment(updateScrollbar, graphHeaderData);
const {
    isShowEquipName,
    isShowGroupName,
    isShowInfoPointList,
    isShowPassByScaleAndPos,
    isShowInfoPointFontSize,
    isShowInfoPointWidth,
    isShowAlignment
} = useAdjustmentShowNode(currentChooseModles);
const isShowSelectedEquip = computed(() => selectedEquipOptions.value.length > 0);
const isDisabledSelectedEquip = computed(() => selectedEquipOptions.value.length <= 1);
editor?.on('choose', handleChoose);
editor?.on('clearChoose', clearChoose);

onUnmounted(() => {
    editor?.off('choose', handleChoose);
    editor?.off('clearChoose', clearChoose);
});

watch(
    showInfoPointMore,
    () => {
        parentHeight.value = opeartionScrollBoxRef?.value?.offsetHeight;
    },
    {
        immediate: true
    }
);
provide('openBtnBottom', openBtnBottom);
</script>

<style lang="scss" scoped>
.detail-adjustment {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    .empty-warp {
        height: 100%;
        display: flex;
        flex-direction: column;
        .empty {
            flex: 1;
            padding-top: 16px;
            color: #8b949e;
            font-size: 14px;
            &-text {
                color: #2e3742;
                font-size: 14px;
                line-height: 24px;
                height: 24px;
                width: 100%;
                text-align: center;
            }
            &-tag {
                margin: 12px 0;
                text-align: center;
            }
            &-btn {
                width: calc(100% - 40px);
                margin-left: 20px;
            }
        }
    }
    :deep(.inner-input) {
        height: 32px;
    }
    /* stylelint-disable-next-line selector-class-pattern */
    :deep(.m-scrollbar__content) {
        height: 100%;
    }
    .opeartion-scroll-warp {
        flex: 1;
        overflow: hidden;
        position: relative;
        &-line {
            height: 1px;
            min-height: 1px;
            background: #e1e5eb;
            margin: 18px 20px;
        }
        &-title {
            display: flex;
            justify-content: space-between;
            align-items: center;
            color: #2e3742;
            font-size: 14px;
            font-weight: 700;
            line-height: 22px;
            margin: 0 20px;
            min-height: 22px;
            .remark {
                color: #00818c;
                font-weight: 400;
                line-height: 20px;
            }
        }
        .mt18 {
            margin-top: 18px;
        }
        .opeartion-scroll-warp-title-position {
            justify-content: flex-start;
            .remark {
                color: #8b949e;
                font-size: 14px;
                font-weight: 400;
                line-height: 22px;
            }
        }
        .opeartion-scroll-box {
            height: 100%;
            display: flex;
            flex-direction: column;
        }
        .equip-name-input {
            margin: 12px 0 0 20px;
        }
        .selected-equip-title {
            margin-top: 18px;
        }
        .selected-equip-select {
            margin: 12px 0 0 20px;
        }
        .selected-equip-select + .opeartion-scroll-warp-title {
            margin-top: 18px;
        }
        .passby-name-input {
            margin: 12px 0 0 20px;
        }
        .group-name-input {
            margin: 12px 20px 0;
        }
        .info-point-container {
            flex: 1;
            padding-bottom: 12px;
            .info-point-input {
                margin: 12px 20px;
            }
            .info-point-box {
                height: calc(100% - 78px);
                margin: 0 20px;
            }
        }
        .multiplier-select {
            margin: 0 20px;
        }
        .font-select {
            margin: 0 20px 18px;
        }
        .width-input {
            margin: 0 20px;
        }
        .retract-box {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 32px;
            padding: 4px 20px;
            background: #ffffff;
            .rel-btn {
                height: 22px;
                width: 52px;
                color: #246fe5;
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 3px 4px;
                border-radius: 4px;
                font-size: 14px;
                line-height: 22px;
                cursor: pointer;
                &:hover {
                    background-color: rgb(196 201 207 / 30%);
                }
            }
        }
    }
    .detail-bottom {
        &-btn {
            margin-left: 20px;
            margin-bottom: 8px;
        }
    }
}
</style>
