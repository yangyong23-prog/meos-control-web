<template>
    <div>
        <m-popover placement="left-end" popover-class="floor-map-setting-popover" :show-arrow="false" trigger="click" @show="() => (openPop = true)" @hide="hidePopover">
            <!-- 设置按钮 -->
            <div class="setting-btn">
                <div class="text" :class="openPop && 'open'">{{ i18n.global.t('meos_control_web.settings') }}</div>
            </div>
            <template #content>
                <!-- 设置面板 -->
                <div class="panel">
                    <div class="item">
                        <span class="title">{{ i18n.global.t('meos_control_web.space_and_equipment_collision') }}</span>
                        <m-switch v-model="collisionChecked" size="small" />
                    </div>
                    <m-radio-group v-if="collisionChecked === 'checked'" v-model="priority">
                        <div class="item">
                            <m-radio v-for="item in priorityOptions" :key="item.id" :label="item.id" :margin="8">{{ i18n.global.t(item.i18nKey) }}</m-radio>
                        </div>
                    </m-radio-group>
                </div>
            </template>
        </m-popover>
    </div>
</template>
<script setup>
import { computed, ref, watch } from 'vue';
import { MPopover, MRadio, MRadioGroup, MSwitch } from 'meri-plus';
import 'meri-plus/theme/index.css';
import i18n from '@/localization';

const props = defineProps({
    projectId: {
        type: String,
        default: ''
    },
    templateType: {
        type: String,
        default: ''
    }
});

// 外部通过 v-model:settings 传入 / 读取设置值
const settings = defineModel('settings', {
    type: Object,
    default: () => ({ collision: 'uncheck', priority: 'equip' })
});

// 显示优先级选项，默认选择第一项「设备优先」
const priorityOptions = [
    { id: 'equip', i18nKey: 'meos_control_web.equipment_priority' },
    { id: 'space', i18nKey: 'meos_control_web.space_priority' }
];

// 开关状态：m-switch 值为 'checked' / 'uncheck'
const collisionChecked = computed({
    get: () => settings.value.collision,
    set: val => {
        settings.value = { ...settings.value, collision: val };
    }
});

// 显示优先级，默认 'equip'
const priority = computed({
    get: () => settings.value.priority,
    set: val => {
        settings.value = { ...settings.value, priority: val };
    }
});

const openPop = ref(false);

const hidePopover = () => {
    openPop.value = false;
};

// localStorage 存储 key，按项目与模板隔离
const storageKey = computed(() => (props.projectId && props.templateType ? `${props.projectId}_${props.templateType}_floorMapSetting` : ''));

// 归一化设置值，保证字段完整与合法性
const normalizeSettings = raw => {
    const collision = raw?.collision ?? raw?.collisionChecked;
    const priorityVal = raw?.priority;
    return {
        collision: collision === 'checked' || collision === 'uncheck' ? collision : 'uncheck',
        priority: priorityOptions.some(option => option.id === priorityVal) ? priorityVal : 'equip'
    };
};

// 初始化：以 localStorage 为准，无值则用外部传入的默认值
const loadSetting = () => {
    let base = settings.value;
    if (storageKey.value) {
        const raw = localStorage.getItem(storageKey.value);
        if (raw) {
            try {
                base = normalizeSettings(JSON.parse(raw));
            } catch {
                // 数据损坏时使用默认值
            }
        }
    }
    settings.value = normalizeSettings(base);
};

loadSetting();

// 值变化后保存到 localStorage
watch(
    () => settings.value,
    () => {
        if (storageKey.value) {
            localStorage.setItem(storageKey.value, JSON.stringify(settings.value));
        }
    },
    { deep: true }
);
</script>
<style lang="scss" scoped>
.setting-btn {
    display: flex;
    align-items: center;
    flex-direction: column;
    width: 32px;
    border-radius: 4px;
    cursor: pointer;
    background: #ffffff;
    .text {
        color: #1b2129;
        font-size: 12px;
        font-style: normal;
        font-weight: var(--platform-font-weight);
        text-align: center;
        line-height: 22px;
        &:hover,
        &.open {
            color: #246fe5;
        }
    }
}
</style>
<style lang="scss">
.floor-map-setting-popover.m-popover.m-flexible-overlay {
    padding: 4px 0;
    display: flex;
    background-color: transparent;
    box-shadow: none;
    border: none;
    flex-direction: row-reverse;
    .panel {
        width: max-content;
        padding: 4px 0;
        border: none;
        border-radius: 4px;
        background: var(--Grey-Grey-0, #ffffff);

        /* Shadow/shadow-2 */
        box-shadow: 0 3px 12px 0 rgb(27 33 41 / 12%), 0 0.5px 3px 0 rgb(27 33 41 / 8%);
        .item {
            display: flex;
            height: 40px;
            padding: 9px 12px;
            align-items: center;
            column-gap: 10px;
            position: relative;
            .title {
                color: #1b2129;
                line-height: 22px;
                white-space: nowrap;
            }
        }
    }
}
</style>
