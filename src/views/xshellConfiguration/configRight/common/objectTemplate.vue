<template>
    <title-type v-if="alwaysShow || (tabData?.length ?? 0 > 1)" :title="computedTitle" :sub-title="subTitle" />
    <template v-if="tabData?.length">
        <div class="second-tabs">
            <m-tabs v-if="tabData?.length > 1" v-model="chooseModel" type="border" size="medium" :data="tabData" @change="secondTabChange" />
        </div>
        <slot></slot>
    </template>
    <template v-else-if="alwaysShow">
        <EmptyNew v-if="showNewEmpty" :text="i18n.global.t('meos_control_web.no_content')" class="empty-new" />
        <empty v-else :type="type" />
    </template>
</template>

<script setup lang="ts">
// @ts-ignore
import i18n from '@/localization';
import TitleType from './titleType.vue';
import Empty from './empty.vue';
import EmptyNew from '@/components/common/Empty.vue';
const props = defineProps({
    name: {
        type: String,
        default: ''
    },
    type: {
        type: String,
        default: ''
    },
    title: {
        // 标题
        type: String,
        default: ''
    },
    subTitle: {
        // 副标题
        type: String,
        default: ''
    },
    tabData: {
        type: Array,
        default: () => []
    },
    modelValue: {
        type: String,
        default: ''
    },
    // 分类是否常驻
    alwaysShow: {
        type: Boolean,
        default: true
    },
    // 是否显示分类标题
    isJoinTitle: {
        type: Boolean,
        default: false
    },
    showNewEmpty: {
        type: Boolean,
        default: false
    }
});
const emit = defineEmits(['secondTabChange', 'update:modelValue']);

const computedTitle = computed(() => {
    const tabList = props.tabData as any;
    const firstTabName = tabList?.[0]?.name;
    const finalName = props.isJoinTitle ? `${props.title}-${firstTabName}` : firstTabName;
    return props.tabData && props.tabData.length === 1 ? (props?.subTitle ? firstTabName + props.title : finalName) : props.title;
});

const secondTabChange = (data: any) => {
    emit('update:modelValue', data.id);
    emit('secondTabChange', data, props.name);
};

const chooseModel = computed({
    get() {
        return props.modelValue;
    },
    set(val) {
        emit('update:modelValue', val);
    }
});
</script>

<style scoped lang="less">
@import '../../styles/xshellConfigRight.less';

.empty-new {
    position: absolute;
    top: 42px;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
