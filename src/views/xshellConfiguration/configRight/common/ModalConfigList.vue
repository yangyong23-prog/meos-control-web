<template>
    <m-modal
        v-model:visible="showModal"
        :append-to="$modalAppendTo"
        :z-index="20"
        type="default"
        :width="840"
        :height="550"
        :max-height="550"
        :auto-close="false"
        @close="closeModal"
        @cancel="closeModal"
        @submit="submitModal"
    >
        <template #header>
            <div class="header-wrap">
                <span>{{ props.title }}</span>
                <span class="header-subTitle">{{ props.subTitle }}</span>
            </div>
        </template>
        <template #content>
            <template v-if="!modalConfigList?.length"> <Empty class="empty-container" :text="i18n.global.t('meos_control_web.no_content')" /></template>
            <div v-else ref="contentRef" class="content-wrap">
                <template v-for="(item, index) in modalConfigList" :key="index">
                    <m-form-item
                        :ref="ins => (selfFormItems[item.key] = ins)"
                        class="list-item"
                        :label="item.name"
                        :label-width="'250px'"
                        :prop="'row.' + index + '.count'"
                        :item-model="item.count"
                        :rules="[
                            {
                                type: 'number',
                                required: true,
                                message: i18n.global.t('meos_control_web.input_required_check_error_4'),
                                trigger: ['blur', 'change']
                            },
                            {
                                validator: (value, rule, callback) => validateInput(item, callback),
                                trigger: ['blur', 'change']
                            }
                        ]"
                    >
                        <template #label>
                            <span :id="`${item.key}_modal_config_list`" v-ellipsis class="item-label m-ellipsis">{{ item.name }}</span>
                        </template>
                        <m-input-number
                            v-model="item.count"
                            width="174"
                            text-align="left"
                            placeholder
                            controls="rightButton"
                            :precision="1"
                            :min="props.min"
                            :max="props.max"
                            :step="1"
                            title
                        >
                            <template #suffix>{{ props.unit }}</template>
                        </m-input-number>

                        <m-tips
                            :content="i18n.global.t('meos_control_web.default_value_is', { val: props.allDefaultValue })"
                            theme="darkTransparent"
                            :disabled="!props.allDefaultValue?.toString()"
                        >
                            <m-button
                                class="ml4"
                                type="link"
                                size="medium"
                                :style="{
                                    zIndex: 1,
                                    visibility: item?.count?.toString() && (item?.count ?? 0) !== (props.allDefaultValue ?? 0) ? 'visible' : 'hidden'
                                }"
                                @click="restoreDefault(item)"
                                >{{ i18n.global.t('meos_control_web.restore_default') }}</m-button
                            >
                        </m-tips>
                    </m-form-item>
                </template>
            </div>
        </template>
    </m-modal>
    <m-button @click="openModal">{{ i18n.global.t('meos_control_web.configuration') }}</m-button>
</template>

<script setup>
import i18n from '@/localization';
import { $Message } from 'meri-plus';
import Empty from '@/components/common/Empty.vue';

const props = defineProps({
    title: {
        type: String,
        default: ''
    },
    subTitle: {
        type: String,
        default: ''
    },
    min: {
        type: Number,
        default: 0
    },
    max: {
        type: Number,
        default: 99
    },
    unit: {
        type: String,
        default: '℃'
    },
    allDefaultValue: {
        type: Number,
        default: 40
    }
});

// [{key:string,name?:string,count?:number | string}]
const modalConfigList = defineModel({ type: Array, default: [] });
const emits = defineEmits(['change']);
const showModal = ref(false);
const selfFormItems = ref([]);
const contentRef = ref();

const checkInputInvalidError = item => {
    const curVal = item.count ?? 0;
    return curVal < props.min || curVal > props.max;
};

const checkEmptyError = item => {
    const curVal = item.count;
    return !curVal?.toString();
};

const validateInput = (item, callback) => {
    if (checkInputInvalidError(item)) {
        callback(
            new Error(
                i18n.global.t('meos_control_web.range_min_max1', {
                    min: props.min,
                    max: props.max
                })
            )
        );
    } else {
        callback();
    }
};

// const numberInputBlur = item => {
//     const curVal = item.count ?? 0;
//     if (curVal < props.min) {
//         item.count = props.min;
//     }
//     if (curVal > props.max) {
//         item.count = props.max;
//     }
// };

const restoreDefault = item => {
    item.count = props.allDefaultValue;
};

const openModal = () => {
    nextTick(() => {
        showModal.value = true;
    });
};

const closeModal = () => {
    nextTick(() => {
        showModal.value = false;
    });
};

const submitModal = () => {
    // 提前失去焦点触发校验
    contentRef.value?.click();
    const hasErrorArray = [];
    if (Array.isArray(modalConfigList.value)) {
        modalConfigList.value.forEach(item => {
            const checkEmpty = checkEmptyError(item);
            const checkInvalid = checkInputInvalidError(item);
            if (checkEmpty || checkInvalid) {
                hasErrorArray.push(item);
            }
            const formItemInstance = selfFormItems.value[item.key];
            formItemInstance?.validate();
        });
    }
    if (hasErrorArray.length === 0) {
        closeModal();
    } else {
        $Message.error({
            title: i18n.global.t('meos_control_web.input_error'),
            duration: 3000,
            showClose: true
        });
        const firstErrItemKey = hasErrorArray[0]?.key;
        const eleKey = firstErrItemKey + '_modal_config_list';
        const errElement = document.getElementById(eleKey);
        try {
            errElement?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } catch (error) {
            console.error('scrollIntoView error', error);
        }
    }
};
watch(
    () => modalConfigList.value,
    val => {
        const cloneVal = structuredClone(val);
        emits('change', cloneVal);
    },
    {
        deep: true
    }
);
</script>

<style lang="less" scoped>
.header-wrap {
    color: @grey-800;
    font-size: 16px;
    font-style: normal;
    font-weight: 700;
    line-height: 24px;

    .header-subTitle {
        margin-left: 4px;
        color: @grey-500;

        font-size: 12px;
        font-style: normal;
        font-weight: 400;
        line-height: 24px;
    }
}

:deep(.list-item) {
    display: flex;
    flex-direction: column;
    row-gap: 8px;

    .m-form-item__label {
        display: flex;
        justify-content: flex-start;
    }
}

:deep(.item-label) {
    max-width: 240px;
    display: inline-block;
}

.content-wrap {
    display: flex;
    flex-wrap: wrap;
    column-gap: 12px;
    padding-bottom: 20px;
}

.empty-container {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
