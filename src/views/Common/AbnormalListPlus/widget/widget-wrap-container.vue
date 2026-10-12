<template>
    <template v-if="!data?.length"><span>--</span></template>
    <template v-else>
        <div v-for="(item, index) in data.slice(0, 2)" :key="index" v-ellipsis="{ class: ['abnormal-value-name-ellipsis-class'] }" class="ellipsis-item">
            {{ item?.name }}
        </div>
        <template v-if="isMore">
            <m-tips placement="bottom" theme="darkTransparent" :arrow-overflow="true" :popover-class="'custom-widget-wrap-popover'">
                <template #content>
                    <div class="more-content-wrap">
                        <div v-for="(item, index) in data.slice(2)" :key="index">{{ item?.name }}</div>
                    </div>
                </template>
                <div class="more-row">
                    <span>{{ i18n.global.t('meos_control_web.remaining') }}</span>
                    <span class="left-count">{{ data?.length - 2 }}</span>
                    <span>{{ i18n.global.t('meos_control_web.item') }}</span>
                    <span>{{ `${name}...` }}</span>
                </div>
            </m-tips>
        </template>
    </template>
</template>

<script setup>
import i18n from '@/localization';
const props = defineProps({
    data: {
        type: Array,
        default: () => []
    },
    name: {
        type: String,
        default: ''
    }
});

const isMore = computed(() => props.data.length > 2);
</script>

<style lang="less" scoped>
.ellipsis-item {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;

    & + .ellipsis-item {
        margin-top: 4px;
    }
}

.more-row {
    margin-top: 4px;
    color: var(--gray-600, #626c78);
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;

    .left-count {
        font-weight: 700;
    }
}
</style>
<style lang="less">
.custom-widget-wrap-popover {
    pointer-events: none;
    .m-tips {
        .more-content-wrap {
            max-width: 420px;
            display: flex;
            flex-direction: column;
            gap: 4px;
        }
    }
}
</style>
