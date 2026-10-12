<template>
    <div class="node-anchor-warp">
        <template v-if="mode === 'edit'">
            <m-button class="upload-btn" :type="('link' as any)" :loading="loading" @click="triggerUpload">
                上传图标
            </m-button>
            <m-image-upload
                v-show="false"
                v-if="showFileCom"
                ref="upFileCom"
                class="upload-container"
                accepts=".png"
                :limit="1"
                @upload="upFile"
            >
                上传
            </m-image-upload>
        </template>

        <div class="opera-box">
            <div
                class="opera-area"
                :style="{ width: `${frontNodeData.size?.x || 0}px`, height: `${frontNodeData.size?.y || 0}px` }"
            >
                <NodeImg v-if="frontNodeData.fileUrl" :file-id="frontNodeData.fileUrl"></NodeImg>
                <!-- <NodeImg v-if="imgData&&props.mode=='edit'" :file-id="imgObj.fileUrl"></NodeImg> -->
                <div v-else class="empty"><VueSvg :path="require('@/assets/svg/add.svg')" /></div>
                <Anchor
                    v-for="anchor in frontNodeData.anchors"
                    :key="anchor.id"
                    :anchor="anchor"
                    :move-target="moveTarget"
                    :size="frontNodeData.size"
                    :mode="mode"
                    @capture-target="captureTarget"
                ></Anchor>
            </div>
        </div>
        <div v-if="mode === 'edit'" class="anchor-legend">
            <div class="legend-item">
                <VueSvg :path="require('@/assets/svg/anchor-static.svg')" />
                <span class="legend-desc">静态锚点</span>
            </div>
            <div class="legend-item">
                <VueSvg :path="require('@/assets/svg/anchor-h.svg')" />
                <span class="legend-desc">横向动态锚点</span>
            </div>
            <div class="legend-item">
                <VueSvg :path="require('@/assets/svg/anchor-v.svg')" />
                <span class="legend-desc">纵向动态锚点</span>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import VueSvg from '@/components/VueSvg.vue';
import Anchor from './Anchor.vue';
import { onMounted, onUnmounted, ref, watchEffect } from 'vue';
import { MImageUpload, MButton } from 'meri-plus';
import useNodeUplaod from './useNodeUplaod';
import NodeImg from './NodeImg.vue';
import emitter from '@/utils/bus';
const frontNodeData = ref<{ [key: string]: any }>({});
const imgIndex = ref(0);
const partnerTagMap: { [key: string]: string } = {
    T: 'B',
    B: 'T',
    L: 'R',
    R: 'L'
};

const props = defineProps({
    nodeData: {
        type: Object,
        default: () => {}
    },
    mode: {
        type: String, // view | edit
        default: 'view'
    },
    imgObj: {
        type: Object,
        default: () => {}
    }
});

type Vector2 = { x: number; y: number };

const getPosition = (name: string, size: Vector2) => {
    const p = { x: 0, y: 0 };

    const dx = size.x / 6;
    const dy = size.y / 6;

    const tag = name[0];
    const i = Number(name[1]);

    if (isNaN(i)) return p;

    if (tag === 'T') {
        p.x = dx * i;
        p.y = 0;
    }

    if (tag === 'B') {
        p.x = dx * i;
        p.y = size.y;
    }

    if (tag === 'L') {
        p.x = 0;
        p.y = dy * i;
    }

    if (tag === 'R') {
        p.x = size.x;
        p.y = dy * i;
    }
    return p;
};

// 需要将nodeData 做一次数据转换
watchEffect(() => {
    const data = JSON.parse(JSON.stringify(props.nodeData)) || {};
    const { anchors, size } = data;
    if (size) {
        (anchors || []).forEach((d: any) => {
            const tag = d.code[0];
            if (data.attachType) {
                d.type = tag === 'T' || tag === 'B' ? 'ah' : 'av';
            } else if (d.multiple) {
                d.type = tag === 'T' || tag === 'B' ? 'h' : 'v';
            } else {
                d.type = 'static';
            }
            d.active = false;
            d.offset = d.coordinateDto;
            d.position = getPosition(d.code, size);
        });
    }
    frontNodeData.value = data;
    console.log(2);
    // if (props.mode === 'edit' && props.imgObj) {
    //     frontNodeData.value.fileUrl = props.imgObj.fileUrl;
    //     frontNodeData.value.legendName = props.imgObj.legendName;
    // }
});

let points: { x: number; y: number }[] = [];
const moveTarget = ref();
const partnerMoveTarget = ref();

const updateModal = (dx: number, dy: number) => {
    if (moveTarget.value) {
        const { size } = frontNodeData.value;
        const { type } = moveTarget.value;

        const { x: ox, y: oy } = moveTarget.value.offset;
        const { x: px, y: py } = moveTarget.value.position;

        let nx = ox + (type !== 'h' && type !== 'av' ? dx : 0);
        let ny = oy + (type !== 'v' && type !== 'ah' ? dy : 0);

        const sx = px + nx;
        const sy = py + ny;

        if (sx < 0) {
            nx = 0 - px;
        }

        if (sx > size.x) {
            nx = size.x - px;
        }

        if (sy < 0) {
            ny = 0 - py;
        }

        if (sy > size.y) {
            ny = size.y - py;
        }

        moveTarget.value.offset.x = nx;
        moveTarget.value.offset.y = ny;

        if (partnerMoveTarget.value) {
            const tag = partnerMoveTarget.value.code[0];
            if (tag === 'T' || tag === 'B') {
                partnerMoveTarget.value.offset.x = nx;
            } else {
                partnerMoveTarget.value.offset.y = ny;
            }
        }
    }
};

const getPartnerMoveTarget = (target: any) => {
    const { code, type } = target;
    if (type === 'ah' || type === 'av') {
        const tag = code[0] as string;
        const i = code[1] as string;
        const partnerCode = partnerTagMap[tag] + i;
        const { anchors } = frontNodeData.value;
        const partner = anchors.find((a: any) => a.code === partnerCode && a.type !== 'static');
        return partner || null;
    }
    return null;
};

const captureTarget = (target: any, e: MouseEvent) => {
    moveTarget.value = target;
    moveTarget.value.active = true;

    partnerMoveTarget.value = getPartnerMoveTarget(target);
    if (partnerMoveTarget.value) {
        partnerMoveTarget.value.active = true;
    }

    points = [];
    points.push({ x: e.x, y: e.y });
};

const move = (e: MouseEvent) => {
    if (moveTarget.value) {
        points.push({ x: e.x, y: e.y });
        points = points.slice(-2);
        const [p1, p2] = points;
        updateModal(p2.x - p1.x, p2.y - p1.y);
    }
};

const cancelMove = () => {
    if (moveTarget.value) {
        moveTarget.value.active = false;
    }
    moveTarget.value = null;

    if (partnerMoveTarget.value) {
        partnerMoveTarget.value.active = false;
    }
    partnerMoveTarget.value = null;
    points = [];
};

if (props.mode === 'edit') {
    onMounted(() => {
        window.addEventListener('mousemove', move);
        window.addEventListener('mouseup', cancelMove);
    });

    onUnmounted(() => {
        window.removeEventListener('mousemove', move);
        window.addEventListener('mouseup', cancelMove);
    });
}

const updateFileId = (fileId: string) => {
    console.log(fileId, 'fileId');
    frontNodeData.value.fileUrl = fileId;
    // eslint-disable-next-line vue/no-mutating-props
    props.nodeData.fileUrl = fileId;
    let obj = {
        index: imgIndex.value,
        fileId: fileId
    };
    emitter.emit('updateLeftImg', obj);
};

const { loading, showFileCom, upFileCom, upFile, triggerUpload } = useNodeUplaod(updateFileId);

const getData = () => {
    const data = JSON.parse(JSON.stringify(props.nodeData)) || {};
    data.fileUrl = frontNodeData.value.fileUrl;
    const { anchors } = data;
    const { anchors: fAnchors } = frontNodeData.value;
    anchors.forEach((d: any, i: number) => {
        const offset = JSON.parse(JSON.stringify(fAnchors[i].offset));
        offset.x = offset.x || 0;
        offset.y = offset.y || 0;
        d.coordinateDto = offset;
    });
    return data;
};
const getUrl = (item: any, index: number) => {
    frontNodeData.value.fileUrl = item.fileUrl;
    imgIndex.value = index;
    console.log(item, index, '2');
};
defineExpose({ getData, getUrl });
</script>
<style lang="scss" scoped>
.node-anchor-warp {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: var(--grey-100);
    overflow: hidden;

    // margin: 12px 0 16px;
    -webkit-user-select: none; /* Chrome, Safari, Opera */
    user-select: none; /* 兼容其他浏览器 */
    position: relative;
    .upload-btn {
        position: absolute;
        top: 0;
        right: 0;
    }
    .upload-container {
        position: absolute;
        z-index: -1;
    }
    .opera-box {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        .opera-area {
            box-sizing: content-box;
            border: 1.5px dashed #be49c5;
            background: rgb(190 73 197 / 8%);
            position: relative;
            .node-img {
                width: 100%;
                height: 100%;
            }
            .empty {
                color: var(--grey-500);
                font-size: 16px;
                width: 100%;
                height: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
                white-space: nowrap;
            }
        }
    }
    .anchor-legend {
        width: 100%;
        display: flex;
        padding: 11px 20px;
        justify-content: center;
        align-items: center;
        gap: 32px;
        border-radius: 4px 4px 0 0;
        background: var(--grey-300);
        text-align: center;
        .legend-item {
            display: flex;
            align-items: center;
            gap: 4px;
            .legend-desc {
                display: inline-block;
                font-size: 12px;
                color: var(--grey-600);
            }
        }
    }
}
</style>
