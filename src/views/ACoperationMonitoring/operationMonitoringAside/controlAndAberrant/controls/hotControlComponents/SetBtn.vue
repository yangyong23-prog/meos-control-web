<template>
    <template v-if="hasControls">
        <template v-if="controlItem.runStatus">
            <!-- 枚举 -->
            <template v-if="controlItem.infoCode === 'sysSwitchSet'">
                <m-button
                    v-if="controlItem.dataValue"
                    style="margin-top: 1px"
                    size="small"
                    @click="(e:any) => openControlPop(e, controlItem,controlItem.dataValue==='1'?'CLOSE':'')"
                >
                    {{ btnText1(controlItem) }}
                </m-button>
                <m-button
                    v-for="(io, iv) in controlItem.dataSource"
                    v-else
                    :key="iv"
                    class="ml4"
                    style="margin-top: 1px"
                    size="small"
                    @click="(e:any) => openControlPop(e, controlItem)"
                >
                    {{ io.name }}
                </m-button>
            </template>
            <!-- 非枚举 -->
            <m-button v-else style="margin-top: 1px" type="link" size="small" @click="(e:any) => openControlPop(e, controlItem)">
                {{ btnText1(controlItem) }}
            </m-button>
        </template>
        <m-tips v-else-if="btnText1(controlItem)" :content="content" theme="darkTransparent">
            <div class="btn-disabled">
                {{ btnText1(controlItem) }}
            </div>
        </m-tips>
    </template>
    <template v-else>
        <m-tips :content="i18n.global.t('meos_control_web.cloud_platform_control_not_supported_please_use_edge')" theme="darkTransparent">
            <div class="btn-disabled">
                {{ btnText1(controlItem) }}
            </div>
        </m-tips>
    </template>
</template>

<script lang="ts" setup>
// @ts-ignore
import i18n from '@/localization';
import { btnText1 } from '@/utils/tools';
const props = defineProps({
    controlItem: {
        type: Object,
        default: () => ({})
    },
    content: String
});
console.log(props.controlItem, 'controlItem');
const openControlPop: any = inject('openControlPop');
const hasControls: any = inject('hasControls');
</script>
<style lang="less" scoped>
.btn-disabled {
    cursor: not-allowed;
    color: var(--gray-400);
    padding: 0 4px;
}
</style>
