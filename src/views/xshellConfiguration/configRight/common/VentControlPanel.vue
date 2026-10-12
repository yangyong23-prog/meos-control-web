<template>
    <div v-show="props.active" class="vent-control-panel">
        <template v-if="sceneTabs.length">
            <!-- 三级分类（场景）：单场景时常驻标题栏（复用 titleType）；多场景时以 Tab 呈现 -->
            <TitleType v-if="sceneTabs.length === 1" :title="sceneTabs[0].name" />
            <div v-else class="second-tabs">
                <m-tabs v-model="currentScene" type="border" size="medium" :data="sceneTabs" @change="sceneChange" />
            </div>

            <!-- 参数分组：由 item.tabObjectName 拆分而来，以 Tab 切换呈现，仅展示当前分组参数
                 复用 .second-tabs 以保证标题与 Tab、Tab 与表单之间的间距与其它页面一致 -->
            <div v-if="groupTabs.length" class="second-tabs">
                <m-tabs v-model="currentGroup" type="border" size="medium" :data="groupTabs" @change="groupChange" />
            </div>

            <!-- 各分组全部挂载、仅显隐切换：保证分组切换时表单实例与校验状态不丢失。
                 注意 xshellFormList 为多根节点组件，v-show 无法作用于组件本身，
                 因此外层包 div 承载显隐。 -->
            <div v-for="group in currentSceneData" v-show="group.key === currentGroup" :key="group.key" class="group-panel">
                <xshellFormList :ref="el => setFormRef(group.key, el)" :row="'2'" :label-width="'180px'" :xshell-params="props.xshellParams" :data-list="group.items" />
            </div>
            <EmptyNew v-if="!currentSceneData.length" :text="i18n.global.t('meos_control_web.no_content')" class="empty-new" />
        </template>
        <EmptyNew v-else :text="i18n.global.t('meos_control_web.no_content')" class="empty-new" />
    </div>
</template>

<script setup lang="ts">
// @ts-ignore
import i18n from '@/localization';
import EmptyNew from '@/components/common/Empty.vue';
import xshellFormList from './xshellFormList.vue';
import TitleType from './titleType.vue';
import { formatterValue } from '../../utils/tools';
import { VENT_SCENE_DEFS } from '../../constants/constant';

const props = defineProps({
    // 是否为当前激活的主 Tab：组件常驻挂载，由该属性控制显隐
    active: {
        type: Boolean,
        default: false
    },
    // 页面级共享状态（含 allItem / defaultItem），与主页面保持同一引用
    xshellParams: {
        type: Object,
        default: () => ({})
    }
});

const emit = defineEmits(['scene-change']);

/**
 * 场景子 Tab：由场景定义表生成，保证「新增场景仅追加定义」的扩展能力。
 * 后端按场景下发单个 group，因此场景数据存在即代表该场景已接入。
 */
const sceneTabs = computed(() =>
    VENT_SCENE_DEFS.map(def => ({
        id: def.scene,
        name: i18n.global.t(def.nameKey)
    }))
);

const currentScene = ref('');
// 当前场景按 tabObjectName 拆分后的参数分组：[{ key, name, items }]
const currentSceneData = ref<any[]>([]);
// 当前选中的参数分组（key 为 tabObjectName）
const currentGroup = ref('');
// 当前场景是否有参数数据（无数据时不参与校验）
const hasVentGroup = ref(false);

// 各分组的表单实例，key 为 tabObjectName
const formRefMap = ref<Record<string, any>>({});
const setFormRef = (groupKey: string, el: any) => {
    if (el) {
        formRefMap.value[groupKey] = el;
    } else {
        delete formRefMap.value[groupKey];
    }
};

/**
 * 场景 -> 后端分组映射。
 * 后端按场景下发一个 group（如 group_control_vent_dome），其 items 内含全部参数，
 * 组内再以 item.tabObjectName 区分参数分组，故此处按场景级 groupCode 匹配。
 */
const sceneGroupMap = computed<Record<string, any>>(() => {
    const map: Record<string, any> = {};
    VENT_SCENE_DEFS.forEach(def => {
        map[def.scene] = null;
    });
    (props.xshellParams?.allItem || []).forEach((group: any) => {
        const def = VENT_SCENE_DEFS.find(d => d.groupCode === group?.group);
        if (def) {
            map[def.scene] = group;
        }
    });
    return map;
});

/**
 * 已格式化过的分组记录：formatterValue 会就地改写 item，
 * 而 allItem 与 defaultItem 的差异比较依赖其 JSON 快照，
 * 因此同一分组只格式化一次，避免重复加工导致「未修改却已变更」的误判。
 */
const formattedGroupSet = new Set<string>();

// 当前场景的参数分组 Tab（名称即后端 tabObjectName）
const groupTabs = computed(() => currentSceneData.value.map((group: any) => ({ id: group.key, name: group.name })));

// 刷新当前场景的渲染数据
const refreshSceneData = () => {
    const group = sceneGroupMap.value[currentScene.value];
    if (!group?.items?.length) {
        currentSceneData.value = [];
        currentGroup.value = '';
        hasVentGroup.value = false;
        return;
    }

    if (!formattedGroupSet.has(group.group)) {
        formatterValue(group.items);
        formattedGroupSet.add(group.group);
    }

    // 按 tabObjectName 拆分，保持后端返回顺序
    const data: any[] = [];
    const indexMap = new Map<string, number>();
    group.items.forEach((item: any) => {
        const name = item.tabObjectName || '';
        if (!indexMap.has(name)) {
            indexMap.set(name, data.length);
            data.push({ key: name, name, items: [] });
        }
        data[indexMap.get(name) as number].items.push(item);
    });

    currentSceneData.value = data;
    hasVentGroup.value = true;
    // 分组切换保持：仍存在则沿用，否则回退到首个分组
    if (!data.some((d: any) => d.key === currentGroup.value)) {
        currentGroup.value = data[0]?.key || '';
    }
};

const sceneChange = (data: any) => {
    currentScene.value = data.id;
    refreshSceneData();
    emit('scene-change');
};

const groupChange = () => {
    emit('scene-change');
};

// 校验当前场景全部分组，返回是否全部通过
const validateScene = (callback?: (valid: boolean) => void) => {
    const refs = Object.values(formRefMap.value).filter((ref: any) => ref?.Mform);
    if (!refs.length) {
        callback?.(true);
        return;
    }
    Promise.all(
        refs.map(
            (ref: any) =>
                new Promise<boolean>(resolve => {
                    ref.Mform.validate((valid: boolean) => resolve(valid));
                })
        )
    ).then(results => callback?.(results.every(Boolean)));
};

const resetScene = () => {
    currentScene.value = '';
    currentGroup.value = '';
    currentSceneData.value = [];
    hasVentGroup.value = false;
    formRefMap.value = {};
    formattedGroupSet.clear();
};

/**
 * 主动初始化：由主页面在 defaultItem 快照前同步调用，
 * 保证 formatterValue 对 allItem 的加工被纳入默认值快照，
 * 避免「未修改却已变更」的误判。
 */
const initScene = () => {
    if (!currentScene.value) {
        currentScene.value = sceneTabs.value[0]?.id || '';
    }
    refreshSceneData();
};

watch(
    () => sceneTabs.value.length,
    () => initScene(),
    { immediate: true }
);

defineExpose({
    currentScene,
    hasVentGroup,
    initScene,
    resetScene,
    validateScene
});
</script>

<style scoped lang="less">
@import '../../styles/xshellConfigRight.less';

/**
 * 场景标题复用 titleType.vue，分组 Tab 复用该 less 中的 .second-tabs，
 * 以保证与「控制逻辑选机条件输入」等页面的标题/Tab 间距完全一致，
 * 故此处不再自定义标题与 Tab 的尺寸/间距样式。
 */
.empty-new {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 60px 0;
}
</style>
