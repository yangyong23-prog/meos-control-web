<template>
    <div class="diagram-controls">
        <div v-if="panelSelectData && panelSelectData.length > 0" class="setting-box fcc">
            <PanelSelect class="sele" :data="panelSelectData" :project-id="baseStore().projectId" :template-type="templateType" @change="panelSelectChange" />
        </div>
        <div class="icon-box-warp">
            <m-tips v-if="actualSize" :content="i18n.global.t('meos_control_web.actual_size')" theme="darkTransparent" placement="left">
                <div class="icon-box fcc">
                    <RatioIconSvg @click="emits('actualSizeView')" />
                </div>
            </m-tips>
            <m-tips v-if="resetDefault" :content="i18n.global.t('meos_control_web.restore_default')" theme="darkTransparent" placement="left" trigger="hover">
                <div class="icon-box fcc" :class="{ disabled: fitViewDisabled }">
                    <ResetIconSvg @click="emits('resetView')" />
                </div>
            </m-tips>
        </div>
    </div>
</template>
<script setup>
import i18n from '@/localization';
import { PanelSelect } from '@yushu/3d-graph-engine';
// eslint-disable-next-line import/no-extraneous-dependencies
import '@yushu/3d-graph-engine/dist/style.css';
import baseStore from '@/store/baseStore';

import RatioIconSvg from '@/assets/images/common/ratio-icon.svg';
import ResetIconSvg from '@/assets/images/common/reset-icon.svg';

defineProps({
    panelSelectData: {
        type: Array,
        default: () => {}
    },
    templateType: {
        type: String,
        default: ''
    },
    actualSize: {
        // 实际尺寸按钮
        type: Boolean,
        default: true
    },
    resetDefault: {
        // 恢复默认按钮
        type: Boolean,
        default: true
    },
    fitViewDisabled: {
        //
        type: Boolean,
        default: false
    }
});

const emits = defineEmits([
    'actualSizeView', // 实际尺寸事件
    'resetView', // 恢复默认按钮
    'panelSelectChange' //筛选面板变化
]);

const panelSelectChange = ids => {
    emits('panelSelectChange', ids);
};
</script>
<style lang="less" scoped>
.diagram-controls {
    position: absolute;
    right: 16px;
    bottom: 16px;
}
.setting-box {
    border-radius: 4px;
    // overflow: hidden;
    margin-bottom: 8px;
}

.icon-box-warp {
    border-radius: 4px;
    overflow: hidden;
    .icon-box {
        width: 32px;
        height: 32px;
        cursor: pointer;
        background: @white;
        user-select: none;

        & + .icon-box {
            border-top: 1px solid @grey-300;
        }

        &.disabled {
            cursor: not-allowed;
            path {
                fill: var(--gray-400);
            }
            &:hover {
                path {
                    fill: var(--gray-400);
                }
            }
        }
        &:hover {
            path,
            rect,
            circle {
                fill: var(--blue-500);
            }
        }
    }
}
</style>
