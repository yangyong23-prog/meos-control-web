<template>
    <div class="legend-warp">
        <div class="legend-view">
            <div v-for="(group, ind) in mapLegend" :key="ind" class="group-item">
                <div v-if="mapLegend.length > 1" class="label">{{ group.label }}：</div>
                <div v-for="(item, indI) in group.data" :key="indI + item.name" class="legend-item">
                    <div :class="`icon-${group.type}`" :style="`background-color: ${item.color}`" />
                    <div class="name">{{ item.name }}</div>
                </div>
                <div v-if="ind < mapLegend.length - 1" class="divider" />
            </div>
        </div>
    </div>
</template>
<script>
import i18n from '@/localization';
import { defineComponent, computed, nextTick, onMounted, onUnmounted } from 'vue';

export default defineComponent({
    name: 'MapLegend',
    props: {
        spaceLegendList: {
            type: Array,
            default: () => []
        },
        pipeLegendList: {
            type: Array,
            default: () => []
        },
        shaftLegendList: {
            type: Array,
            default: () => []
        }
    },
    setup(props) {
        const mapLegend = computed(() => {
            const arr = [];
            if (props.spaceLegendList?.length) {
                arr.push({ label: i18n.global.t('common.space'), data: props.spaceLegendList, type: 'space' });
            }
            if (props.pipeLegendList?.length) {
                arr.push({ label: i18n.global.t('meos_control_web.pipeline'), data: props.pipeLegendList, type: 'pipe' });
            }
            if (props.shaftLegendList?.length) {
                arr.push({ label: i18n.global.t('meos_control_web.shaft'), data: props.shaftLegendList, type: 'shaft' });
            }
            return arr;
        });

        return {
            mapLegend
        };
    }
});
</script>
<style lang="less" scoped>
.legend-warp {
    width: 100%;
    display: flex;
    justify-content: center;

    .legend-view {
        padding: 5px 8px;
        background: linear-gradient(180deg, #e4eaef 0%, rgba(228, 234, 239, 0.9) 100%);
        border-radius: 4px 4px 0 0;
        // align-items: center;
        // flex-wrap: wrap;

        .group-item {
            display: inline;
            vertical-align: middle;
            // align-items: center;
            // flex-wrap: wrap;
        }

        .label {
            display: inline-block;
            margin-left: 12px;
            // margin-right: 8px;
            font-weight: 700;
            font-size: 12px;
            line-height: 18px;
            color: var(--gray-800);
            vertical-align: middle;
        }

        .legend-item {
            display: inline-flex;
            align-items: center;
            margin: 5px 12px;
            vertical-align: middle;

            .icon-space {
                width: 14px;
                height: 14px;
                border-radius: 2px;
                margin-right: 8px;
                border: 0.5px solid #a9a9a9;
            }

            .icon-pipe {
                width: 14px;
                height: 3px;
                margin-right: 8px;
            }

            .icon-shaft {
                // .wh(14px, 14px);

                border-radius: 2px;
                margin-right: 8px;
            }

            .name {
                font-style: normal;
                font-weight: var(--platform-font-weight);
                font-size: 12px;
                line-height: 18px;
                color: var(--gray-600);
                white-space: nowrap;
            }
        }

        .divider {
            display: inline-block;
            vertical-align: middle;
            width: 1px;
            height: 12px;
            margin-left: 4px;
            margin-right: 4px;
            background: var(--gray-400);
            border-radius: 100px;
        }
    }
}
</style>
