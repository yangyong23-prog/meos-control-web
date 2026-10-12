<template>
    <template v-if="controlItem.runStatus">
        <!-- 枚举 -->
        <template v-if="controlItem.infoCode === 'sysSwitchSet'">
            <SetButton
                v-if="controlItem.dataValue"
                style="margin-top: 1px"
                type="link"
                size="small"
                @click="(el, e) => openControlPop(e, controlItem, controlItem.dataValue === '1' ? 'CLOSE' : '')"
            >
                {{ btnText1(controlItem) }}
            </SetButton>
            <template v-else>
                <SetButton v-for="(io, iv) in controlItem.dataSource" :key="iv" class="ml4" style="margin-top: 1px" size="small" @click="(el, e) => openControlPop(e, controlItem)">
                    {{ io.name }}
                </SetButton>
            </template>
        </template>
        <!-- 非枚举 -->
        <SetButton v-else style="margin-top: 1px" type="link" size="small" @click="(el, e) => openControlPop(e, controlItem)">
            {{ btnText1(controlItem) }}
        </SetButton>
    </template>
    <SetDiv v-else-if="btnText1(controlItem)" :disabled="true" :content="content">
        {{ btnText1(controlItem) }}
    </SetDiv>
</template>

<script setup>
// @ts-ignore
import SetButton from '@/components/common/SetButton.vue';
import SetDiv from '@/components/common/SetDiv.vue';
import { btnText1 } from '@/utils/tools';
const props = defineProps({
    controlItem: {
        type: Object,
        default: () => ({})
    },
    content: String
});
const openControlPop = inject('openControlPop');
</script>
<style lang="less" scoped>
.btn-disabled {
    cursor: not-allowed;
    color: var(--gray-400);
    padding: 0 4px;
}
</style>
