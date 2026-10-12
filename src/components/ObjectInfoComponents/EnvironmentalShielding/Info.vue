<template>
    <div v-if="list.length" class="environmental-shielding-info">
        <I18nSlot html-tag="span" name-key="meos_control_web.environmental_shielding_info">
            <template #infoCode>
                <span style="color: var(--gray-900)" class="fw700">{{ list.join('、') }}</span>
            </template>
        </I18nSlot>
    </div>
</template>

<script setup lang="ts">
import { GroupChildConfig } from '@/types/InfoCodeConfig';
import I18nSlot from '@/components/I18nSlot.vue';
import DockSingleton from '@/hooks/responsiveDock';
import { IS_SHIELD } from '@/utils/globalVariables';
const { getIotData } = DockSingleton.getInstance();

const props = defineProps({
    groupChildren: {
        type: Array as () => Array<GroupChildConfig>,
        default: () => []
    },
    selectObj: {
        type: Object as () => { id: string },
        default: () => ({})
    }
});

const parseShowStyle = (showStyle?: string): { relSet?: string } => {
    if (!showStyle) {
        return {};
    }

    try {
        return JSON.parse(showStyle);
    } catch (error) {
        console.error('showStyle parse error', error);
        return {};
    }
};

const list = computed<string[]>(() => {
    const relInfoCodeConfigs: string[] = [];
    const infoCodeNameSet = new Set<string>();
    props.groupChildren.forEach(item => {
        item.relInfoCodeConfigs.forEach(config => {
            const relSetId = parseShowStyle(config.showStyle).relSet;
            if (relSetId) {
                const iotData = getIotData(props.selectObj.id, relSetId);
                const shouldShow = iotData?.dataValue === IS_SHIELD && !infoCodeNameSet.has(config.infoCodeName);
                if (shouldShow) {
                    infoCodeNameSet.add(config.infoCodeName);
                    relInfoCodeConfigs.push(config.infoCodeName);
                }
            }
        });
    });
    return relInfoCodeConfigs;
});
</script>

<style scoped lang="less">
.environmental-shielding-info {
    width: 100%;
    padding: 5px 8px;
    border-radius: var(--big-radius, 4px);
    background: var(--alpha-30, rgba(196, 201, 207, 0.3));
    margin-bottom: 12px;
    color: var(--gray-600);
}
</style>
