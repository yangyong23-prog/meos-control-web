<template>
    <m-scrollbar v-if="classCodeList.length" class="class-code-list">
        <template v-for="item in classCodeList" :key="item.id">
            <div class="class-code-item fcb" :class="{ 'is-active': curClassCodeObj.id === item.id }" @click="changeCurClassCode(item)">
                <div v-ellipsis class="item-name m-ellipsis">{{ item.name }}</div>
                <div class="fcc">
                    <div v-if="curClassCodeObj.id === item.id && treeBuildFloorData.length" class="item-btn" @click.stop="toggleSelect(item)">
                        {{ item.multiple ? i18n.global.t('meos_control_web.switch_to_single') : i18n.global.t('meos_control_web.switch_to_multi') }}
                    </div>
                    <div class="item-num">&nbsp;{{ item.number }}</div>
                </div>
            </div>
            <BuildFloorTree v-if="curClassCodeObj.id === item.id" :data="item" />
        </template>
    </m-scrollbar>
    <div v-else class="fcc" style="height: calc(100% - 48px); color: var(--notes-color)">{{ i18n.global.t('common.no_data') }}</div>
</template>

<script setup>
import i18n from '@/localization';
import { curClassCodeObjKey, classCodeListKey, changeCurClassCodeKey, treeBuildFloorDataKey } from '../hooks/useBaseHook';
import BuildFloorTree from './BuildFloorTree.vue';
const treeBuildFloorData = inject(treeBuildFloorDataKey);
const curClassCodeObj = inject(curClassCodeObjKey);
const classCodeList = inject(classCodeListKey);
const changeCurClassCode = inject(changeCurClassCodeKey, () => {});

const toggleSelect = item => {
    item.multiple = !item.multiple;
    item.treeData = [];
    changeCurClassCode(item);
};
</script>
<style lang="less" scoped>
.class-code-list {
    padding: 8px 0;
    .class-code-item {
        height: 40px;
        padding: 0 12px 0 8px;
        margin: 0 8px;
        cursor: pointer;
        border-radius: 4px;
        &:hover {
            background: var(--alpha-30);
        }
        .item-name {
            flex: 1;
        }
        .item-btn {
            color: var(--blue-500);
            padding: 4px;
            border-radius: 4px;
            user-select: none;
            &:hover {
                background: var(--alpha-30);
            }
        }
        .item-num {
            color: var(--gray-600);
        }
        &.is-active {
            background-color: var(--blue-100);
            .item-name {
                font-weight: 700;
                color: var(--blue-500);
            }
        }
    }
}
</style>
