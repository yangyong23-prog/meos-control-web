<template>
    <div class="space-card" @mouseenter="showAll = true" @mouseleave="showAll = false">
        <div v-for="(module, i) in displayModules" :key="i" class="module">
            <div class="title">{{ module.moduleName }} <span class="arrow">›</span></div>
            <div class="circuits-row">
                <m-popover
                    v-for="(circuit, j) in module.circuits"
                    :key="j"
                    :content="i18n.global.t('meos_control_web.loop_id', { id: String(j + 1).padStart(2, '0') })"
                    trigger="hover"
                    theme="darkTransparent"
                    :show-arrow="false"
                    placement="top"
                >
                    <component :is="getCircuitSvg(circuit.status)" class="circuit-svg" />
                </m-popover>
            </div>
        </div>
        <div v-if="!showAll && modules.length > 3" class="more-tip">
            {{
                i18n.global.t('meos_control_web.has_num_modules', {
                    num: modules.length - 3
                })
            }}
        </div>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import { ref, computed } from 'vue';
import turnOnSvg from '@/assets/svg/indoorLighting/turn_on.svg';
import turnOffSvg from '@/assets/svg/indoorLighting/turn_off.svg';
import inconsistencySvg from '@/assets/svg/indoorLighting/inconsistency.svg';
import turnOnInconsistencySvg from '@/assets/svg/indoorLighting/turn_on_inconsistency.svg';
import turnOffInconsistencySvg from '@/assets/svg/indoorLighting/turn_off_inconsistency.svg';
import unknownSvg from '@/assets/svg/indoorLighting/unknown.svg';

// 业务数据示例
const modules = [
    {
        moduleName: '控制模块BY01',
        circuits: [
            { status: 'open' },
            { status: 'open' },
            { status: 'open' },
            { status: 'open' },
            { status: 'close' },
            { status: 'abnormal' },
            { status: 'partialOpen' },
            { status: 'unknown' }
            // ... 最多32个
        ]
    },
    {
        moduleName: '控制模块BY02',
        circuits: [
            { status: 'open' },
            { status: 'close' },
            { status: 'close' },
            { status: 'open' },
            { status: 'open' },
            { status: 'open' },
            { status: 'abnormal' },
            { status: 'partialOpen' }
        ]
    },
    {
        moduleName: '控制模块BY03',
        circuits: [{ status: 'open' }, { status: 'open' }, { status: 'open' }, { status: 'open' }, { status: 'open' }, { status: 'open' }, { status: 'open' }, { status: 'open' }]
    },
    {
        moduleName: '控制模块BY04',
        circuits: [
            { status: 'close' },
            { status: 'close' },
            { status: 'close' },
            { status: 'close' },
            { status: 'close' },
            { status: 'close' },
            { status: 'close' },
            { status: 'close' }
        ]
    }
];

const showAll = ref(false);
const displayModules = computed(() => (showAll.value ? modules : modules.slice(0, 3)));

const getCircuitSvg = status => {
    const svgMap = {
        open: turnOnSvg, // 开启 黄色
        close: turnOffSvg, // 关闭 灰色
        unknown: unknownSvg, // 未知 橙色斜杠
        abnormal: inconsistencySvg, // 多开/少开 橙色边框
        partialOpen: turnOnInconsistencySvg, // 黄色+橙色边框
        partialClose: turnOffInconsistencySvg // 灰色+橙色边框
    };
    return svgMap[status] || turnOffSvg;
};
</script>
<style lang="less" scoped>
.space-card {
    width: 138px;
    font-family: 'PingFang SC', Arial, sans-serif;
    background: white;
    padding: 4px;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

    .module {
        margin-bottom: 4px;

        .title {
            font-size: 12px;
            color: #222;
            margin-bottom: 4px;
            display: flex;
            align-items: center;

            .arrow {
                margin-left: 4px;
                color: #bbb;
                font-size: 12px;
            }
        }

        .circuits-row {
            display: flex;
            flex-wrap: wrap;
            gap: 2px 2px;
            margin-bottom: 2px;

            .circuit-svg {
                width: 14px;
                height: 14px;
                display: inline-block;
            }
        }
    }
    .more-tip {
        color: #999;
        font-size: 12px;
        text-align: center;
    }
}
</style>
