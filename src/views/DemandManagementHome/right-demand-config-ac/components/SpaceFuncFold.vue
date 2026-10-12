<template>
    <div class="space-func-item-wrap" @click.stop="clickItem">
        <div class="left-container">
            <IconMeriComponentArrowDown v-if="isOpen" :color="iconColor" />
            <IconMeriComponentArrowRight v-else :color="iconColor" />
            <div v-ellipsis class="m-ellipsis text">
                {{ title }}
            </div>
        </div>
        <div v-if="!isHideAction" class="right-container">
            <m-tips :disabled="!props?.disabled" :content="i18n.global.t('meos_control_web.please_unshield_before_operation')" theme="darkTransparent" trigger="hover">
                <m-button type="link" :disabled="props?.disabled" @click="editConfig">{{ i18n.global.t('common.edit') }}</m-button>
            </m-tips>
            <div v-if="!props?.isGlobal" class="config-divider"></div>
            <m-tips :disabled="!props?.disabled" :content="i18n.global.t('meos_control_web.please_unshield_before_operation')" theme="darkTransparent" trigger="hover">
                <m-button v-if="!(props?.isGlobal && props?.isEmpty)" type="link" :disabled="props?.disabled" @click="removeConfig">{{ i18n.global.t('common.delete') }}</m-button>
            </m-tips>
        </div>
    </div>
</template>
<script setup>
import { IconMeriComponentArrowDown, IconMeriComponentArrowRight } from 'meri-icon';
import { isHideActionKey } from '../../constant/injectKey';
import i18n from '@/localization';

const props = defineProps({
    data: {
        type: Object,
        default: () => {}
    },
    isOpen: {
        type: Boolean,
        default: false
    }
});

const emits = defineEmits(['editConfig', 'removeConfig', 'toggleFold']);
const isHideAction = inject(isHideActionKey);

const iconColor = '#8B949E';

const title = computed(() => {
    return props.data?.funcTypes?.map(obj => obj.name).join('、');
});

const editConfig = () => {
    emits('editConfig', { type: 'space', data: props.data });
};

const removeConfig = e => {
    e.stopPropagation();

    emits('removeConfig', props.data);
};

const clickItem = () => {
    emits('toggleFold');
};
</script>
<style scoped>
.space-func-item-wrap {
    width: 100%;
    display: flex;
    padding: 0 4px;
    justify-content: space-between;
    align-items: center;
    align-self: stretch;
    cursor: pointer;
    &:hover {
        border-radius: 4px;
        background: rgb(196 201 207 / 30%);
    }
    .left-container {
        display: flex;
        align-items: center;
        gap: 4px;
        flex: 1;
        overflow: hidden;
        color: #000000;
        font-size: 16px;
        font-style: normal;
        font-weight: 700;
        line-height: 24px; /* 150% */
        .text {
            flex: 1;
        }
    }
    .right-container {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        gap: 4px;
    }
}
</style>
