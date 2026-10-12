<template>
    <div class="group-loop-config-edit-container">
        <div class="header">
            <div class="left-wrap">
                <template v-if="isHideRadio">{{ i18n.global.t('meos_control_web.loop_configuration') }}</template>
                <m-radio-group v-else v-model="curMode">
                    <m-radio v-for="item in props.configRadioOptions" :key="item.label" :label="item.value" :disabled="item.disabled" :size="14">
                        {{ item.label }}
                    </m-radio>
                </m-radio-group>
            </div>
            <div class="right-wrap">
                <m-search
                    v-if="curMode === 'group'"
                    :width="206"
                    immediate
                    type="enter"
                    :placeholder="i18n.global.t('meos_control_web.press_enter_search_group_name')"
                    @change="searchInputChange"
                    @clear="curGroupSearchInput = ''"
                >
                </m-search>
            </div>
        </div>
        <div class="content-wrap">
            <template v-if="curMode === 'group'">
                <template v-if="isLoading"></template>
                <template v-else-if="!loadedData?.length">
                    <m-illustration class="empty-content-wrap" :title="i18n.global.t('meos_control_web.no_available_group')" type="noContent"></m-illustration>
                </template>
                <GroupConfigEditTable
                    v-else
                    v-model="curGroupList"
                    :func-type-obj="props.funcTypeObj"
                    :data-source="computedDataSource"
                    :search-input="curGroupSearchInput"
                ></GroupConfigEditTable>
            </template>
            <template v-else-if="curMode === 'loop'">
                <CircuitSettingEdit :func-type-obj="props.funcTypeObj"></CircuitSettingEdit>
            </template>
        </div>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import { useFetchAbortController } from '@/hooks/useFetchAbortController';
import { listInstanceGroup } from '@/apis/lightingRequirements';
import useStore from '@/store';
import GroupConfigEditTable from './GroupConfigEditTable.vue';
import CircuitSettingEdit from './CircuitSettingEdit.vue';
import { NOT_CONFIGURED } from '../constants';

const props = defineProps({
    funcTypeObj: {
        type: Object,
        default: () => {}
    },
    configRadioOptions: {
        type: Array,
        default: () => []
    }
});

const curMode = defineModel('radio', { type: String });
const curGroupList = defineModel('group', { type: Array });
const curGroupSearchInput = ref('');

const { base } = useStore();
const curControlledObjId = inject('curControlledObjId');
const curControlledObjType = inject('curControlledObjType');
const templateType = inject('templateType');

const isHideRadio = computed(() => {
    // 如果是空间或非公区/停车场，则无编组配置
    const isSpace = curControlledObjType?.value === 'SPACE';
    const isPublicOrPartLot = ['PUBLIC_AREA_LIGHTING', 'PARKING_LOT_LIGHTING'].includes(templateType?.value);
    return isSpace || !isPublicOrPartLot;
});
const { startRequest, isLoading, loadedData, startLoading, endLoading } = useFetchAbortController({
    request: listInstanceGroup,
    params: {
        templateType: base.templateType,
        tags: [props?.funcTypeObj?.funcType],
        // TODO 是否选中当前实例？
        belongInstance: [{ instanceType: curControlledObjType?.value, instanceId: curControlledObjId?.value?.[0] }]
    },
    initData: []
});
const searchInputChange = val => {
    curGroupSearchInput.value = val;
};

watchEffect(() => {
    if (curMode.value !== 'loop' && curControlledObjType?.value === 'SPACE') {
        curMode.value = 'loop';
    }
});

const computedDataSource = computed(() => {
    const groupArr = loadedData.value;
    const circuitGroupSettings = props.funcTypeObj?.circuitGroupSettings || [];
    return groupArr.map(obj => {
        const { name, relObjects } = obj || {};
        const { settingMode } = circuitGroupSettings?.find(v => v?.groupId === obj.id) || {};
        const finalMode = settingMode || NOT_CONFIGURED;
        return { ...obj, settingMode: finalMode, lastSavedMode: finalMode, filterName: name, count: relObjects?.length ?? 0 };
    });
});

onMounted(() => {
    if (!isHideRadio.value) {
        startRequest();
    }
});

watch(
    () => isLoading.value,
    curLoading => {
        if (curLoading && curMode?.value === 'group') {
            startLoading?.({ className: '.content-wrap' });
        } else {
            endLoading?.();
        }
    },
    {
        immediate: true
    }
);
</script>

<style lang="less" scoped>
.group-loop-config-edit-container {
    height: 100%;
    position: relative;
    display: flex;
    flex-direction: column;
    row-gap: 12px;
}
.header {
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.left-wrap {
    display: flex;
    align-items: center;
}
.right-wrap {
    min-height: 32px;
}

.content-wrap {
    height: calc(100% - 32px - 12px);
}
.empty-content-wrap {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
