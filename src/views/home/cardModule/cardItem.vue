<template>
    <div class="card-item" @click="jump">
        <div class="card-header">
            <m-tips :content="props.data?.localName" theme="darkTransparent" placement="top" trigger="hover" :disabled="popTitleVisible">
                <div ref="popTitle" class="card-title" :style="{ lineHeight: popTitleVisible ? '28px' : '22px' }">
                    {{ props.data?.localName || '--' }}
                </div>
            </m-tips>

            <div v-show="showAbnormal" class="abnormal" :class="{ danger: anomalousNumber > 0 }">
                <span>{{ anomalousNumber > 0 ? i18n.global.t('meos_control_web.abnormal_event_colon') : i18n.global.t('meos_control_web.abnormal_event_colon') + '0' }}</span>
                <span v-show="anomalousNumber > 0">{{ anomalousNumber }}</span>
            </div>
        </div>
        <div v-if="infoList.length > 0" class="card-data" :class="{ 'three-column': infoList.length === 3 }">
            <div v-for="(infoOne, index) in infoList" :key="index" class="data-info">
                <div v-if="String(infoOne.rule) === '1'">
                    <span v-ellipsis class="absolute-text">{{ infoOne?.dataSet?.name || infoOne?.dataSet?.localName || '--' }}</span>
                    <div v-ellipsis class="value-content">
                        <span class="number value-content-sub" style="font-family: 'Persagy2.0'">{{ getValueStr(infoOne?.dataSet?.ipValue) }}</span>
                        <span v-if="notEmptyValue(infoOne?.dataSet?.ipValue)" class="value-content-sub">{{ infoOne?.dataSet?.unit }}</span>
                    </div>
                </div>

                <div v-if="String(infoOne.rule) === '2'" v-ellipsis class="value-content">
                    <!-- 数值 -->
                    <span class="number value-content-sub">{{ getValueStr(infoOne?.dataSet?.ipValue) }}</span>
                    <span class="value-content-sub">/</span>
                    <!-- 在线数量 -->
                    <span class="all-count value-content-sub">{{ getValueStr(infoOne?.dataSet?.all) }}</span>
                    <!-- 单位 -->
                    <span v-if="notEmptyValue(infoOne?.dataSet?.all)" class="value-content-sub unit">{{ infoOne?.dataSet?.unit }}</span>
                </div>

                <div v-if="String(infoOne.rule) === '3'" v-ellipsis class="value-content">
                    <span v-if="!infoOne.dataSet?.terms?.length" class="value-content-sub number">--</span>
                    <template v-else>
                        <template v-for="(it, itIndex) in infoOne.dataSet.terms" :key="it.infoCode">
                            <span v-if="itIndex > 0" class="split-dot"></span>
                            <span style="font-family: 'Persagy2.0'" class="number value-content-sub">{{ getValueStr(it?.ipValue) }}</span>
                            <span v-if="notEmptyValue(it?.ipValue)" class="value-content-sub unit">{{ it?.unit || infoOne?.dataSet?.unit }}</span>
                        </template>
                    </template>
                </div>

                <template v-if="String(infoOne.rule) === '4'">
                    <!-- 多数据显示，如：液位 -->
                    <div v-if="infoOne.dataSet?.iotValue?.length" v-ellipsis class="value-content">
                        <template v-for="(it, itIndex) in infoOne.dataSet.iotValue.slice(0, 3)" :key="it.infoCode">
                            <span v-if="itIndex > 0" class="split-dot"></span>
                            <span class="number value-content-sub" style="font-family: 'Persagy2.0'">{{ getValueStr(it?.value) }}</span>
                            <span v-if="notEmptyValue(it?.value)" class="value-content-sub unit">{{ it?.unit || infoOne?.dataSet?.unit }}</span>
                        </template>
                    </div>
                    <div v-else v-ellipsis class="value-content">
                        <span class="number value-content-sub" style="font-family: 'Persagy2.0'">{{ getValueStr(infoOne?.dataSet?.ipValue) }}</span>
                        <span v-if="notEmptyValue(infoOne?.dataSet?.ipValue)" class="value-content-sub unit">{{ infoOne?.dataSet?.unit }}</span>
                    </div>
                </template>

                <div v-if="String(infoOne.rule) === '5'">
                    <span v-ellipsis class="absolute-text">{{ infoOne?.dataSet?.name || infoOne?.dataSet?.localName || '--' }}</span>
                    <div v-ellipsis class="value-content">
                        <span v-if="!infoOne.dataSet?.terms?.length" class="number value-content-sub">--</span>
                        <template v-else>
                            <template v-for="(it, itIndex) in infoOne.dataSet.terms" :key="it.infoCode">
                                <span v-if="itIndex > 0" class="dot value-content-sub">/</span>
                                <span class="number value-content-sub" style="font-family: 'Persagy2.0'">{{ getValueStr(it?.value) }}</span>
                            </template>
                            <span v-if="notEmptyValue(infoOne?.dataSet?.terms?.[infoOne?.dataSet?.terms?.length - 1]?.value)" class="value-content-sub unit">{{
                                infoOne?.dataSet?.unit
                            }}</span>
                        </template>
                    </div>
                </div>
                <p class="text">{{ infoOne?.name ?? '--' }}</p>
            </div>
        </div>
        <div v-if="infoList.length <= 0" class="card-no-data">
            <p class="text">{{ i18n.global.t('meos_control_web.no_system_parameter') }}</p>
        </div>
    </div>
</template>
<script setup>
import i18n from '@/localization';
const props = defineProps({
    data: {
        type: Object,
        default: () => ({})
    },
    code: {
        type: String,
        default: ''
    }
});

// #是否展示异常事件
const showAbnormal = computed(() => String(props.data.anomalousEvent) === '1');

// #异常事件数量
const anomalousNumber = computed(() => props.data?.anomalousEventNumber ?? 0);

// #卡片信息
const infoList = computed(() => props.data?.infos || []);

const getValueStr = val => {
    if (val || val === 0) return val;
    return '--';
};

const notEmptyValue = val => {
    return val || val === '0';
};

const jump = () => {
    let prefixUrl = location.href.split('system-status-home')[0],
        url = `${prefixUrl}${props.code}?redirect=system-status-home&sysName=${encodeURIComponent(props.data.localName)}&classCode=${encodeURIComponent(
            props.data.classCode
        )}&graphTypeCode=${encodeURIComponent(props.data.graphTypeCode)}`;
    location.href = url;
};
const popTitle = ref();

const popTitleVisible = ref(true);

onMounted(() => {
    // 获取文本容器的高度
    let containerHeight = popTitle.value.clientHeight,
        // 获取文本的高度
        textHeight = popTitle.value.scrollHeight;
    // 判断文本是否超出容器高度
    if (textHeight > containerHeight) {
        popTitleVisible.value = false;
    } else {
        popTitleVisible.value = true;
    }
});
</script>
<style lang="less" scoped>
.card-item {
    width: 308px;
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background: rgba(255, 255, 255, 0.95);
    padding: 16px;
    box-shadow: @shadow-gary30;
    border: 1.5px solid @white;
    cursor: pointer;
    &:hover {
        border: 1.5px solid @blue-500;
        box-shadow: @shadow-gary12;
        background: rgba(255, 255, 255, 0.95);
    }
    .card-header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 20px;
        max-height: 46px;
        .card-title {
            flex: 1;
            line-height: 28px;
            color: @black;
            font-size: 16px;
            font-weight: 700;
            overflow: hidden;
            display: -webkit-box;
            -webkit-line-clamp: 2; /* 设置最大显示行数 */
            -webkit-box-orient: vertical;
            text-overflow: ellipsis;
        }
        .abnormal {
            margin-left: 8px;
            border-radius: 4px;
            background: linear-gradient(270deg, rgba(255, 255, 255, 0) 0%, #e8fff1 100%);
            padding: 0 8px;
            font-feature-settings: 'clig' off, 'liga' off;

            font-size: 14px;
            font-style: normal;
            font-weight: var(--platform-font-weight);
            line-height: 28px;
            height: 28px;
            color: @green-500;
        }
        .danger {
            color: @red-500;
            background: @linear-gradient-red;
        }
    }
    .card-data {
        user-select: none;
        display: flex;
        justify-content: space-between;
        font-size: 14px;
        gap: 2px;
        .data-info {
            align-items: center;
            font-size: 16px;
            color: @grey-500;
            position: relative;
            max-width: 180px;

            .number {
                color: @grey-800;
                line-height: 20px;
                font-weight: 700;
                font-family: 'Persagy2.0';
            }

            .all-count {
                color: @grey-500;
                font-family: 'Persagy2.0';
                font-weight: 700;
            }

            .unit {
                font-size: 14px;
                color: @grey-600;
            }
            .absolute-text {
                position: absolute;
                height: 15px;
                left: 0;
                right: 0;
                top: -16px;
                font-size: 12px;
                line-height: 15px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                color: @grey-600;
            }
            .text {
                font-size: 14px;
                color: @grey-600;
                margin-top: 4px;
                overflow: hidden;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                text-overflow: ellipsis;
                white-space: normal;
                word-break: break-all;
            }

            .value-content {
                max-width: 180px;
                text-overflow: ellipsis;
                white-space: nowrap;
                overflow: hidden;
                padding: 1px 0;
                .value-content-sub {
                    line-height: 20px;
                    height: 20px;
                    display: inline-block;
                }
            }
        }
        &.three-column .data-info {
            max-width: 80px;
            .value-content {
                max-width: 80px;
            }
        }
    }
    .card-no-data {
        color: var(--gray-500);
        font-size: 14px;
        display: flex;
        justify-content: center;
        padding-top: 8px;
        padding-bottom: 16px;
    }
}
.dot {
    font-family: 'Persagy2.0';
    color: #8b949e;
    font-size: 16px;
    font-weight: 700;
    display: inline-block;
}
.split-dot {
    display: inline-block;
    height: 12px;
    background-color: #d9d9d9;
    width: 1px;
    margin: 0 4px;
}
</style>
