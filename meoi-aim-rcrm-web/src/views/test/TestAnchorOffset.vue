<template>
    <img v-if="base64" :src="base64" alt="" />
</template>
<script setup>
// import NodeEditorModal from '@/views/Common/NodeEditorModal';
import { ref } from 'vue';
// const show = ref(true);

// const close = () => {
//     show.value = false;
// };

// const save = data => {
//     console.log('save', data);
//     show.value = false;
// };

// const nodeData = ref({
//     id: '25b1e4e7-8e62-4d70-8731-4c24df159ea0',
//     size: {
//         x: 151,
//         y: 80
//     },
//     name: '冷冻水泵1',
//     url: '',
//     anchors: [
//         {
//             id: '1',
//             type: 'static',
//             position: {
//                 x: 20,
//                 y: 0
//             },
//             offset: {
//                 x: 0,
//                 y: 0
//             }
//         },
//         {
//             id: '2',
//             type: 'h',
//             position: {
//                 x: 0,
//                 y: 40
//             },
//             offset: {
//                 x: 0,
//                 y: 0
//             }
//         },
//         {
//             id: '3',
//             type: 'v',
//             position: {
//                 x: 100,
//                 y: 0
//             },
//             offset: {
//                 x: 0,
//                 y: 0
//             }
//         }
//     ]
// });
const base64 = ref('');
fetch('https://dev-minioapi.ysbdtp.com/meoi-relation-chart-images/20230818/Group%2048098656.svg')
    .then(reponse => reponse.blob())
    .then(blobData => {
        console.log(blobData);
        // 将二进制数据转换为 base64
        const reader = new FileReader();
        reader.onload = () => {
            const base64Data = reader.result.split(',')[1];
            console.log('base64Data', base64Data);
            base64.value = 'data:image/svg+xml;base64,' + base64Data;
        };
        reader.readAsDataURL(blobData);
    });
</script>
<style lang="scss" scoped>
img {
    width: 100px;
    height: 100px;
}
</style>
