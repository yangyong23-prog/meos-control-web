<template>
    <m-scrollbar>
        <div v-for="item in list" :key="item.name" class="box-item">
            <div class="box-item-title">{{ item.name }}</div>
            <div class="box-item-tree">
                <m-tree v-model="treeData" :data="item.tree" readonly @change="changeTree" />
            </div>
        </div>
    </m-scrollbar>
</template>

<script lang="ts" setup>
import { queryRelationObjectTreeByObjectId } from '@/apis/systemDiagram';
import { SUCCESSCODE } from '@/utils/globalVariables';
import { Ref } from 'vue';
const systemId: Ref<string> = inject('systemId', ref(''));
const emits = defineEmits(['changeTree']);
const props = defineProps({
    classCode: {
        type: String,
        default: ''
    },
    id: {
        type: String,
        default: ''
    },
    localName: {
        type: String,
        default: ''
    }
});
const treeData = ref([]);
const list = ref<any[]>([]);
const showType = inject<Ref<string>>('showType', ref(''));
const getTree = () => {
    list.value = [];
    queryRelationObjectTreeByObjectId({
        systemId: systemId.value,
        objectId: props.id,
        classCode: props.classCode
    }).then((res: any) => {
        if (res.code === SUCCESSCODE) {
            if (res.data) {
                for (const key in res.data) {
                    if (Object.prototype.hasOwnProperty.call(res.data, key)) {
                        const element = res.data[key];
                        element.forEach(handleForEach);
                        list.value.push({ name: key, tree: element });
                    }
                }
            }
        }
    });
};
const handleForEach = (data: any) => {
    data.id = data.classCode;
    if (data.children?.length) {
        data.name = data.className;
        data.children.forEach(handleForEach);
    } else {
        data.name = data.localName ?? '--';
    }
};
const changeTree = (ids: unknown, data: unknown) => {
    emits('changeTree', ids, data);
};
onMounted(() => {
    if (showType.value === '3D') {
        getTree();
    }
});
</script>
<style lang="less" scoped></style>
