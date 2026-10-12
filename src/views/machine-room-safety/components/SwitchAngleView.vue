<template>
    <div class="switch-angle">
        <span class="angle-images">
            <div class="angle-oper angle-up" @click="switchAngle('up')">
                <img v-if="angle === 'up'" :src="getImageUrl('up-on.png')" />
                <img v-else :src="getImageUrl('up-off.png')" />
            </div>
            <div class="angle-oper angle-back" @click="switchAngle('back')">
                <img v-if="angle === 'back'" :src="getImageUrl('back-on.png')" />
                <img v-else :src="getImageUrl('back-off.png')" />
            </div>
            <div class="angle-oper angle-left" @click="switchAngle('left')">
                <img v-if="angle === 'left'" :src="getImageUrl('left-on.png')" />
                <img v-else :src="getImageUrl('left-off.png')" />
            </div>
            <div class="angle-oper angle-right" @click="switchAngle('right')">
                <img v-if="angle === 'right'" :src="getImageUrl('right-on.png')" />
                <img v-else :src="getImageUrl('right-off.png')" />
            </div>
            <div :class="`angle-tip rotating ${angle}`">
                <img :src="angleBox" />
            </div>
        </span>
    </div>
</template>
<script setup>
import angleBox from '@/assets/images/space-map/box.png';
import { getImageUrl } from '@/utils/i18nImageUtils';

defineProps({
    angle: {
        type: String,
        default: ''
    }
});

const emit = defineEmits(['switchAngle']);

const switchAngle = ang => {
    emit('switchAngle', ang);
};
</script>
<style lang="less" scoped>
.angle-images {
    position: relative;
    width: 84px;
    height: 84px;
    display: block;

    > div.angle-oper {
        position: absolute;

        &:hover {
            cursor: pointer;
        }
    }

    > div.angle-tip {
        position: absolute;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        pointer-events: none;
    }

    .angle-up {
        left: 29px;
        bottom: 0;
    }

    .angle-back {
        left: 29px;
        top: 0;
    }

    .angle-left {
        left: 0;
        top: 29px;
    }

    .angle-right {
        right: 0;
        top: 29px;
    }

    img {
        width: 26px;
        height: 26px;
    }

    .angle-tip {
        transform-origin: center center;
        transition: 1s ease all;

        img {
            width: 17.25px;
            height: 20px;
        }
    }

    .angle-tip.rotating.up {
        transform: rotateY(-180deg);
    }

    .angle-tip.rotating.right {
        transform: rotateX(-180deg);
    }

    .angle-tip.rotating.back {
        transform: rotateX(180deg);
    }

    .angle-tip.rotating.left {
        transform: rotateY(180deg);
    }
}
</style>
