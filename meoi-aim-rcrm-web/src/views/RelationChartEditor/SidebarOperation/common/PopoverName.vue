<template>
    <m-popover
        virtual-triggering
        :virtual-ref="popoverVirtualRef"
        :popover-class="'node-slot-popover'"
        trigger="manually"
        placement="bottom"
        :is-open="showActionEditor"
        @click-event="clickEvent"
    >
        <template #content>
            <div class="popover-content">
                <p class="popover-text">编辑名称（限制50个字）</p>
                <div class="popover-input">
                    <m-input
                        v-model="editName"
                        :autofocus="true"
                        :width="width"
                        :error-text="errorMessage"
                        :maxlength="maxlength"
                        @keyup.enter="submitNameChange(editName)"
                    >
                    </m-input>
                    <span v-if="errorMessage" class="popover-message">{{ errorMessage }}</span>
                </div>
                <m-button class="popover-btn" type="primary" size="small" @click.stop="submitNameChange(editName)"
                    >确定</m-button
                >
            </div>
        </template>
    </m-popover>
</template>

<script setup>
import { ref, inject, watch } from 'vue';
import { useSuccessMessage } from '@/utils';
import { editDuplicateName, updateTemplateName } from '@/api/RelationChartEditor';
import { currentHeaderItemKey } from '@/utils/injectionKey';
const currentHeaderItem = inject(currentHeaderItemKey);
const currentLeftItem = inject('currentItem');
const showActionEditor = inject('showActionEditor');
const props = defineProps({
    type: {
        type: String,
        default: ''
    },
    popoverVirtualRef: {
        type: Object,
        default: () => {}
    },
    width: {
        type: Number,
        default: 260
    },
    maxlength: {
        type: Number,
        default: 50
    }
});
const emits = defineEmits(['submitNameChange']);

const editName = ref('');
const errorMessage = ref('');
const editChangeName = async name => {
    try {
        let res;
        if (props.type === 'template') {
            res = await updateTemplateName({
                objectId: currentLeftItem.value.id,
                graphCodeType: currentLeftItem.value?.systemGraphCode,
                name: name.trim()
            });
        } else {
            res = await editDuplicateName({
                duplicateId: currentHeaderItem.value.id,
                duplicateName: name.trim()
            });
        }

        const { result } = res;
        if (result === 'success') {
            if (editName.value.trim()) {
                if (props.type === 'template') {
                    currentLeftItem.value.name = name;
                } else {
                    currentHeaderItem.value.name = name;
                }
            } else {
                if (props.type === 'template') {
                    currentLeftItem.value.name = res.data;
                } else {
                    currentHeaderItem.value.name = '副本图纸';
                }
            }
            useSuccessMessage('名称修改成功');
            editName.value = '';
            errorMessage.value = '';
            emits('submitNameChange');
        }
    } catch (e) {
        if (e.code === 'A0400') {
            errorMessage.value = '名称不可重复';
            return;
        }
    }
};
const submitNameChange = async name => {
    await editChangeName(name);
};
const clickEvent = (e, type) => {
    const dom = document.querySelector('.m-popover.m-popover-light.m-select-window');
    const isContains = dom?.contains(e.target);
    if (!type && !isContains) {
        showActionEditor.value = false;
    }
};
watch(
    showActionEditor,
    val => {
        if (!val) {
            errorMessage.value = false;
            editName.value = '';
            if (props.type === 'template') {
                currentLeftItem.value.isShowEdit = false;
                currentLeftItem.value = {};
            } else {
                currentHeaderItem.value.isShowEdit = false;
                currentHeaderItem.value = {};
            }
        } else {
            if (props.type === 'template') {
                editName.value = currentLeftItem?.value?.name;
            } else {
                editName.value = currentHeaderItem?.value?.name;
            }
        }
    },
    {
        immediate: true
    }
);
</script>

<style lang="scss">
.node-slot-popover {
    width: 300px;
    height: 128px;
    padding: 16px 20px !important;
    border-radius: 8px !important;
    .popover-content {
        .popover-text {
            color: #8b949e;
            font-family: 'Microsoft YaHei UI';
            font-size: 12px;
            line-height: 12px;
        }
        .popover-input {
            height: 32px;
            margin: 8px 0 16px;
        }
        .popover-message {
            font-size: 12px;
            color: #f55047;
        }
        .popover-btn {
            float: right;
        }
    }
}
</style>
