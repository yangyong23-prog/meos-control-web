<template>
    <div class="header-set">
        <m-scrollbar
            v-if="setList.length"
            :key="key"
            ref="scrollbar"
            max-height="400px"
            style="padding: 8px 12px"
            @scroll="scroll"
        >
            <VueDraggable
                v-model="setList"
                animation="200"
                handle=".mover"
                chosen-class="chosen"
                force-fallback
                allback-on-body
                @unchoose="unchoose"
            >
                <transition-group>
                    <div
                        v-for="(level1, i) in setList"
                        :key="level1.dataIndex + i"
                        class="level-1"
                    >
                        <div class="level-1-title fc">
                            <div class="mover">
                                <SortSvg />
                            </div>
                            &nbsp;{{ level1.title }}
                        </div>
                        <VueDraggable
                            v-model="level1.children"
                            animation="200"
                            handle=".mover"
                            chosen-class="chosen"
                            force-fallback
                            allback-on-body
                            @unchoose="unchoose"
                        >
                            <transition-group>
                                <div
                                    v-for="(level2, j) in level1.children"
                                    :key="level2.dataIndex + j"
                                    class="level-2"
                                >
                                    <div class="level-2-title fcb">
                                        <div class="fc">
                                            <div class="mover">
                                                <SortSvg />
                                            </div>
                                            <CheckBox
                                                v-if="!level2.children?.length"
                                                v-model="level2.show"
                                                style="width: calc(100% - 15px)"
                                                @change="changeShow(level2)"
                                            >
                                                <div
                                                    class="m-ellipsis"
                                                    style="width: calc(100% - 24px)"
                                                >
                                                    {{ level2.title }}
                                                </div>
                                            </CheckBox>
                                            <div v-else>{{ level2.title }}</div>
                                        </div>
                                        <CheckBox
                                            v-if="!level2.children?.length && level2.showStyle?.allowSearch && level2.show"
                                            v-model="level2.search"
                                        >
                                            {{ i18n.global.t('meos_control_web.add_to_filter') }}</CheckBox
                                        >
                                    </div>
                                    <div
                                        v-for="(level3, index) in level2.children"
                                        :key="level3.dataIndex + index"
                                        class="level-3"
                                    >
                                        <div class="level-3-title fcb">
                                            <div class="fc">
                                                <CheckBox
                                                    v-model="level3.show"
                                                    @change="changeShow(level3)"
                                                >
                                                    {{ level3.title }}</CheckBox
                                                >
                                            </div>
                                            <div class="fc">
                                                <CheckBox
                                                    v-if="level3.showStyle?.allowSearch && level3.show"
                                                    v-model="level3.search"
                                                >
                                                    {{ i18n.global.t('meos_control_web.add_to_filter') }}</CheckBox
                                                >
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </transition-group>
                        </VueDraggable>
                    </div>
                </transition-group>
            </VueDraggable>
        </m-scrollbar>
        <div
            v-else
            class="fcc"
            style="height: 160px; color: var(--gray-600)"
        >
            {{ i18n.global.t('meos_control_web.no_content') }}
        </div>
        <div class="footer-btn">
            <m-tips
                :content="i18n.global.t('meos_control_web.operate_interrupt_in_saveing')"
                :disabled="!btnLoading"
                theme="darkTransparent"
            >
                <m-button
                    size="small"
                    :disabled="btnLoading"
                    style="margin-right: 10px"
                    @click="closeForm"
                    >{{ i18n.global.t('common.cancel') }}</m-button
                >
            </m-tips>
            <m-button
                type="primary"
                size="small"
                :loading="btnLoading"
                @click="handleSubmit"
                >{{ i18n.global.t('common.confirm') }}</m-button
            >
        </div>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import { VueDraggable } from 'vue-draggable-plus';
import SortSvg from '@/assets/svg/sort.svg';
import CheckBox from './components/CheckBox.vue';
import { saveTableHeader } from '@/apis/equipmentList';
import { paramsKey, curClassCodeObjKey, refreshTableFnKey } from '../hooks/useBaseHook';
import { SUCCESSCODE } from '@/utils/globalVariables';
import { setColumnsKey } from '../hooks/useBaseHook';
const params = inject(paramsKey);
const curClassCodeObj = inject(curClassCodeObjKey);
const refreshTableFn = inject(refreshTableFnKey);
const setColumns = inject(setColumnsKey);
const props = defineProps({
    columns: {
        type: Array,
        default: () => []
    }
});
const scrollbar = ref(null);
const setList = ref([]);
const btnLoading = ref(false);
const key = ref(0);
const scrollTop = ref(0);
const emit = defineEmits(['close', 'submit']);
const closeForm = () => {
    emit('close');
};
const handleSubmit = async () => {
    if (setList.value.length === 0) {
        closeForm();
        return;
    }
    const cfgInfoCodeGroupVOList = [];
    setList.value.forEach((level1, j) => {
        const a = {
            groupCode: level1.groupCode,
            infoCode: level1.groupCode,
            order: j + 1
        };
        cfgInfoCodeGroupVOList.push(a);
        level1.children.forEach((level2, i) => {
            const obj = {
                groupCode: level1.groupCode,
                infoCode: level2.infoCode,
                show: level2.show,
                search: level2.search && level2.show,
                order: i + 1
            };
            cfgInfoCodeGroupVOList.push(obj);
            if (level2.children?.length) {
                level2.children.forEach(level3 => {
                    const obj = {
                        groupCode: level1.groupCode,
                        infoCode: level3.infoCode,
                        show: level3.show,
                        search: level3.search && level3.show,
                        order: i + 1
                    };
                    cfgInfoCodeGroupVOList.push(obj);
                });
            }
        });
    });
    btnLoading.value = true;
    try {
        const res = await saveTableHeader({
            ...params.value,
            templateTypeId: curClassCodeObj.value.templateTypeId,
            templateTypeKey: curClassCodeObj.value.templateTypeKey,
            cfgInfoCodeGroupVOList
        });
        if (res.code === SUCCESSCODE) {
            refreshTableFn();
            setColumns.value = [];
        }
    } catch (error) {
        console.error(error);
    } finally {
        btnLoading.value = false;
        closeForm();
    }
};
const unchoose = () => {
    key.value++;
    nextTick(() => {
        scrollbar.value?.setScrollTop(scrollTop.value);
    });
};
const scroll = data => {
    scrollTop.value = data.scrollTop;
};
const handleSetList = () => {
    setList.value = setList.value.filter(level1 => level1.children?.length);
};
const changeShow = val => {
    val.search = false;
};
onMounted(() => {
    console.log(props, setColumns.value);

    const arr = structuredClone(setColumns.value?.length ? setColumns.value : props.columns);
    setList.value = arr.filter(item => item.children?.length);
    handleSetList();
});
</script>
<style lang="less" scoped>
.level-1 {
    & + .level-1 {
        margin-top: 4px;
    }
    &-title {
        height: 36px;
        position: relative;
        text-indent: 0;
        font-weight: 700;
    }
    .mover {
        cursor: move;
        margin-right: 4px;
    }
}
.level-2 {
    background-color: var(--gray-100);
    border-radius: 4px;
    &-title {
        height: 36px;
        padding: 4px;
        padding-left: 16px;
        padding-right: 12px;
        user-select: none;
        display: grid;
        grid-template-columns: minmax(0, 1fr) auto;
    }
    & + .level-2 {
        margin-top: 4px;
    }
}
.level-3 {
    &-title {
        height: 36px;
        padding: 4px 12px;
        padding-left: 36px;
        user-select: none;
    }
}
.chosen {
    opacity: 0.5;
}
.footer-btn {
    border-top: 1px solid var(--alpha-30);
    text-align: right;
    padding: 12px 16px;
}
</style>
