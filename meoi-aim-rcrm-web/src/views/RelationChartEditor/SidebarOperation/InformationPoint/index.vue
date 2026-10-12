<template>
    <div v-loading="isLoading" class="imformation" element-loading-lottiename="circle">
        <template v-if="!isLoading && (infoCodeListParams.length || infoCodeListTags.length)">
            <template v-if="infoPointSearch">
                <!-- 有模糊查询就不展示更多和收起 -->
                <div class="information-box">
                    <template v-for="item in infoCodeListParams" :key="item.name">
                        <PointItem
                            :item="item"
                            @toggle-select="toggleSelect"
                            @toggle-select-tag="toggleSelectTag"
                        ></PointItem>
                    </template>
                </div>
            </template>
            <template v-else>
                <div ref="imformationRef" class="information-box">
                    <template v-for="item in infoCodeListWithLevel" :key="item.name">
                        <PointItem
                            :item="item"
                            @toggle-select="toggleSelect"
                            @toggle-select-tag="toggleSelectTag"
                        ></PointItem>
                    </template>
                    <template v-if="showInfoPointMore">
                        <template v-for="item in infoCodeListWithoutLevel" :key="item.name">
                            <PointItem
                                :item="item"
                                @toggle-select="toggleSelect"
                                @toggle-select-tag="toggleSelectTag"
                            ></PointItem>
                        </template>
                    </template>
                </div>
                <span
                    v-if="
                        (hasHiddenItems && !showInfoPointMore) ||
                        (hasHiddenItems && showInfoPointMore && !openBtnBottom)
                    "
                    class="rel-btn"
                    :style="{ width: showInfoPointMore ? '52px' : '80px' }"
                    @click="showInfoPointMore = !showInfoPointMore"
                >
                    <template v-if="!showInfoPointMore"
                        >更多参数 <IconMeriComponentChevronDown size="14" color="#246FE5"
                    /></template>
                    <template v-else-if="showInfoPointMore && !openBtnBottom"
                        >收起<IconMeriComponentChevronUp size="14" color="#246FE5"
                    /></template>
                </span>
            </template>

            <template v-if="!isMutil">
                <div v-if="infoCodeListTags.length" class="line"><span class="text">运行参数标签</span></div>
                <div class="information-box">
                    <template v-for="item in infoCodeListTags" :key="item.name">
                        <PointItem
                            :item="item"
                            @toggle-select="toggleSelect"
                            @toggle-select-tag="toggleSelectTag"
                        ></PointItem>
                    </template>
                </div>
            </template>
        </template>
        <div v-else-if="!isLoading" class="no-data">暂无信息点</div>
    </div>
</template>

<script setup>
import { $Message } from 'meri-plus';
import { ref, watch, provide, inject, watchEffect, nextTick } from 'vue';
import PointItem from './PointItem.vue';
import { IconMeriComponentChevronDown, IconMeriComponentChevronUp } from 'meri-icon';
const showInfoPointMore = inject('showInfoPointMore');
const openBtnBottom = inject('openBtnBottom');
const imformationRef = ref(null);
const selectList = ref([]);
const selectTagList = ref([]);

const props = defineProps({
    parentHeight: {
        type: Number,
        default: 0
    },
    isLoading: {
        type: Boolean,
        default: false
    },
    infoCodeListParams: {
        type: Array,
        default: () => []
    },
    infoCodeListTags: {
        type: Array,
        default: () => []
    },
    isMutil: {
        type: Boolean,
        default: false
    },
    infoPointSearch: {
        type: String,
        default: ''
    }
});

const emit = defineEmits(['change']);

const haveSelected = item => {
    return selectList.value.some(code => code.infoCode === item.infoCode);
};

const tagHaveSelected = item => {
    return selectTagList.value.some(code => code.infoCode === item.infoCode);
};

const isShiftDown = ref(false);

const toggleSelect = item => {
    if (item.disabled) return;
    if (selectTagList.value.length) {
        $Message.error({
            title: '请选择相同类型的信息点',
            showClose: true,
            className: 'information-box-message'
        });
        return;
    }
    const isSelected = haveSelected(item);
    if (isSelected) {
        selectList.value = selectList.value.filter(sel => sel.infoCode !== item.infoCode);
    } else {
        if (props.isMutil) {
            selectList.value = [item];
        } else {
            if (isShiftDown.value) {
                selectList.value.push(item);
            } else {
                selectList.value = [item];
            }
        }
    }

    emit('change', 'normal', selectList.value);
};

const toggleSelectTag = item => {
    if (item.disabled) return;
    if (selectList.value.length) {
        $Message.error({
            title: '请选择相同类型的信息点',
            showClose: true,
            className: 'information-box-message'
        });
        return;
    }
    const isSelected = tagHaveSelected(item);
    if (isSelected) {
        selectTagList.value = selectTagList.value.filter(sel => sel.infoCode !== item.infoCode);
    } else {
        if (props.isMutil) {
            selectTagList.value = [item];
        } else {
            if (isShiftDown.value) {
                selectTagList.value.push(item);
            } else {
                selectTagList.value = [item];
            }
        }
    }
    const curSelectTagList = selectTagList?.value.map(sel => sel.infoCode);
    const curInfoCodeListTags = props.infoCodeListTags;
    if (curSelectTagList.includes('localAndManualStatus')) {
        curInfoCodeListTags.forEach(element => {
            if (element.infoCode === 'localRemoteStatus' || element.infoCode === 'manualAutoStatus') {
                element.disabled = true;
                element.isCur = true;
            }
        });
    } else {
        curInfoCodeListTags.forEach(element => {
            if (
                (element.infoCode === 'localRemoteStatus' ||
                    element.infoCode === 'manualAutoStatus' ||
                    element.infoCode === 'localAndManualStatus') &&
                element.isCur === true
            ) {
                element.disabled = false;
            }
        });
    }
    if (curSelectTagList.includes('localRemoteStatus') || curSelectTagList.includes('manualAutoStatus')) {
        curInfoCodeListTags.forEach(element => {
            if (element.infoCode === 'localAndManualStatus') {
                element.disabled = true;
                element.isCur = true;
            }
        });
    }
    emit('change', 'tag', selectTagList.value);
};

// 更多参数外层
const infoCodeListWithLevel = ref([]);
// 更多参数里层
const infoCodeListWithoutLevel = ref([]);
// 是否展示更多参数
const hasHiddenItems = ref(false);

provide('selectList', selectList);
provide('selectTagList', selectTagList);
provide('isShiftDown', isShiftDown);

watch([() => props.infoCodeListParams, () => props.infoCodeListTags], () => {
    selectList.value = [];
    selectTagList.value = [];
});
watchEffect(() => {
    infoCodeListWithLevel.value = props?.infoCodeListParams?.filter(item => item.importanceLevel) ?? [];
    infoCodeListWithoutLevel.value = props?.infoCodeListParams?.filter(item => !item.importanceLevel) ?? [];
    if (!props.infoPointSearch) {
        hasHiddenItems.value = props?.infoCodeListParams.length > 0;
    }
});

watch(
    showInfoPointMore,
    () => {
        nextTick(() => {
            if (props.parentHeight > imformationRef?.value?.offsetHeight) {
                openBtnBottom.value = false;
            } else {
                openBtnBottom.value = true;
            }
        });
    },
    {
        immediate: true
    }
);
</script>
<style lang="scss" scoped>
.imformation {
    height: 100%;
    position: relative;
    .information-box {
        display: grid;
        gap: 12px;
        grid-template-columns: repeat(2, 144px);
    }
    .line {
        height: 1px;
        margin: 23px 0;
        background: linear-gradient(to left, transparent 0%, transparent 50%, #c4c9cf 50%, #c4c9cf 100%);
        background-size: 10px 1px;
        background-repeat: repeat-x;
        position: relative;
        .text {
            display: inline-block;
            background: #ffffff;
            padding: 0 18px;
            color: #626c78;
            font-size: 12px;
            line-height: 22px;
            position: absolute;
            top: -12px;
            left: 95px;
        }
    }
    .no-data {
        color: #626c78;
        text-align: center;
        font-family: 'Microsoft YaHei UI';
        font-size: 12px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
    .rel-btn {
        height: 22px;
        color: #246fe5;
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 12px;
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
</style>
