<template>
    <div class="plan-node-container" :style="outStyle">
        <div class="plan-node">
            <div v-ellipsis class="plan-node-title">{{ nodeData.relDataObjectName }}</div>
            <div
                v-for="(item, index) in iotItems"
                :key="index"
                class="plan-node-item"
                :class="[item.linkCodes?.length ? 'plan-node-item-links' : 'plan-node-item-link']"
            >
                <template v-if="item.linkCodes?.length">
                    <div v-ellipsis class="plan-node-item-key">
                        {{ item.aliasName || item.name }}
                    </div>
                    <div class="plan-node-item-value">
                        <div
                            v-for="(linkItem, linkIdx) in item.linkCodes"
                            :key="`linkCode_${item.infoCode}_${linkIdx}`"
                            class="plan-node-item-value-box"
                        >
                            <div v-ellipsis class="value">
                                {{ linkItem.hasColon ? linkItem.name : linkItem.name + ':'
                                }}{{ linkItem.dataValue || '--' }}<span>{{ linkItem.unit }}</span>
                            </div>
                            <div v-if="linkIdx < item.linkCodes.length - 1" class="line"></div>
                        </div>
                    </div>
                </template>

                <div v-else class="plan-node-item-link-box">
                    <div v-ellipsis class="plan-node-item-key">{{ item.aliasName || item.name }}</div>
                    <div v-ellipsis class="plan-node-item-value">{{ getItemValText(item) }}</div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { computed } from 'vue';
const props = defineProps({
    nodeData: {
        type: Object,
        default: () => {}
    },
    legendScaleRatio: {
        type: Number,
        default: 1
    }
});
const outStyle = computed(() => {
    const { absoluteLocation } = props.nodeData;
    return {
        left: absoluteLocation?.x + 'px',
        top: absoluteLocation?.y + 'px',
        transform: `scale(${props.legendScaleRatio})`
    };
});

const iotItems = computed(() => {
    const mergeRec = {};
    const normalArr = [];
    props.nodeData?.infoCodes?.forEach(obj => {
        if (obj.mergeCode) {
            if (!mergeRec[obj.mergeCode]) {
                mergeRec[obj.mergeCode] = [];
            }
            mergeRec[obj.mergeCode].push({
                ...obj,
                name: obj.abbreviationName || obj.aliasName || obj.name,
                hasColon: !!obj.abbreviationName
            });
        } else {
            normalArr.push(obj);
        }
    });
    const mergeArr =
        Object.keys(mergeRec).map(mergeCode => {
            const linkCodes = mergeRec[mergeCode];
            return {
                mergeCode,
                infoCode: mergeCode,
                name: linkCodes[0].mergeName,
                linkCodes
            };
        }) || [];
    return [...mergeArr, ...normalArr];
});

const getItemValText = data => {
    let curData;
    if (data.dataType === 'ENUM') {
        curData = data.dataSource.filter(item => item.code === data.view);
    }
    if (curData?.length) {
        return `${curData[0].name}`;
    } else {
        return `${data.dataValue || '--'}${data.unit}`;
    }
};
</script>
<style lang="scss" scoped>
.plan-node-container {
    overflow: auto;
    border-radius: 4px;
    border: 0.6px solid #e1e5eb;
    background: rgb(255 255 255 / 80%);
    padding: 8px;
    width: 214px;
    max-height: 394px;
    position: absolute;
    font-size: 14px;
    .plan-node {
        &-title {
            color: #424c59;
            font-weight: 700;
            margin-bottom: 4px;
            height: 22px;
            line-height: 22px;

            @include text-ellipsis;
        }
        &-item {
            border-bottom: 0.5px solid #c4c9cf;
            margin-bottom: 4px;
            padding-bottom: 2px;
            .plan-node-item-key {
                color: #626c78;

                @include text-ellipsis;
            }
            .plan-node-item-value {
                color: #424c59;

                @include text-ellipsis;
            }
        }
        .plan-node-item-link {
            &-box {
                width: 100%;
                height: 22px;
                line-height: 22px;

                @include flex-display(space-between, center);
                .plan-node-item-key {
                    max-width: 120px;
                    margin-right: 4px;
                    color: #626c78;
                }
                .plan-node-item-value {
                    max-width: 70px;
                    color: #1b2129;
                }
            }
        }
        .plan-node-item-links {
            .plan-node-item-key {
                color: #626c78;
                height: 22px;
                line-height: 22px;
                margin-bottom: 4px;
                padding-bottom: 2px;
            }
            .plan-node-item-value {
                color: #424c59;
                height: 22px;
                display: flex;
                &-box {
                    display: flex;
                    align-items: center;
                    white-space: nowrap;
                    .value {
                        max-width: 60px;

                        @include text-ellipsis;
                    }
                    .line {
                        display: inline-block;
                        background: #c4c9cf;
                        width: 0.5px;
                        height: 10px;
                        margin: 0 4px;
                    }
                }
            }
        }
    }
}
</style>
