<template>
    <m-tag v-for="tag in tagsValueFun" :key="tag.name" class="info-tag" color="#FFFFFF" :bg-color="tag.color" size="small">{{ tag.name }} </m-tag>
</template>
<script setup>
import { getStatusListBySpaceIdKey } from '../hooks/useBaseHook';
import { ABNORMAL_EVENT, SPACE_SWITCH_ABNORMAL, SPACE_SWITCH_NORMAL } from '../variables';
// import { isEdge } from '@/utils/envUtils';
const props = defineProps({
    spaceId: {
        type: String,
        default: ''
    },
    getStatusListBySpaceId: {
        type: Function,
        default: () => () => {}
    }
});
const getStatusListBySpaceId = inject(getStatusListBySpaceIdKey) || props.getStatusListBySpaceId;

const styles = {
    [ABNORMAL_EVENT.id]: {
        color: '#F55047'
    },
    // runStatus1: {
    //     color: '#F2CB0C'
    // },
    // runStatus0: {
    //     color: '#8B949E'
    // },
    // partOpen: {
    //     color: '#AE9B7D'
    // },
    [SPACE_SWITCH_ABNORMAL.id]: { color: '#F59847' },
    [SPACE_SWITCH_NORMAL.id]: { color: '#09B542' },
    controlDeviationStatus1: {
        color: '#FF992D'
    },
    controlDeviationStatus2: {
        color: '#FF992D'
    },
    runStatusNull: {
        color: '#FF992D'
    },
    localRemoteStatus0: {
        color: '#246FE5'
    }
};
const tagsValueFun = computed(() => {
    if (props.spaceId && getStatusListBySpaceId) {
        const statusList = getStatusListBySpaceId(props.spaceId);

        return statusList
            ?.map(info => {
                if (info.value && styles[info.id]) {
                    const rst = { color: styles[info.id].color, name: info.name };
                    if (info.number !== undefined) {
                        rst.name = `${info.name}${info.number}`;
                    }
                    return rst;
                }
                return null;
            })
            .filter(Boolean);
    }
    return [];
});
</script>

<style lang="less" scoped>
.info-tag {
    font-weight: var(--platform-font-weight) !important;
    margin-left: 0px !important;
}
</style>
