<template>
    <div :class="[type == '2' ? 'fan-water' : '']">
        <div :class="[type == '2' ? 'fcb flex-w' : '']">
            <div v-for="fan in list" :key="fan.id">
                <FanOrWaterBox :other-id="otherId" :type="type" :fan="fan" :manual-auto-set="manualAutoSet" :class-code="classCode" />
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { PropType } from 'vue';
import { FanList } from '../../types';
import FanOrWaterBox from './FanOrWaterBox.vue';
defineProps({
    list: {
        type: Array as PropType<FanList[]>,
        default: () => []
    },
    type: {
        type: String,
        default: ''
    },
    manualAutoSet: {
        type: Boolean,
        default: true
    },
    classCode: {
        type: String,
        default: ''
    },
    otherId: {
        type: String,
        default: ''
    }
});
</script>
<style lang="less" scoped>
.fan-water {
    // background-color: var(--gray-100);
    // padding: 20px 16px 4px 16px;
    // border-radius: 8px;
    // border: 1px solid var(--gray-300);
    .flex-w {
        flex-wrap: wrap;
    }
    .m-row {
        margin-left: 0px;
        margin-right: 0px;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        [class*='m-col-'] {
            padding: 0 8px;
        }
    }
}
</style>
