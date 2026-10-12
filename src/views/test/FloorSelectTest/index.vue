<template>
    <FloorSelectPlus v-model:floorId="floorId" :building-floors="buildingFloors" @expand-change="expandChange" @change="onChange" />
</template>
<script setup>
import FloorSelectPlus from '@/components/common/FloorSelectPlus/index.vue';
import data from './floor.json';

data.forEach((building, index) => {
    building.floors.sort((a, b) => b.floorSequenceId - a.floorSequenceId);
    building.dot = true;
    building.floors.forEach((f, index) => {
        if (index % 3 === 0) {
            f.disabled = true;
            f.disabledTip = '该楼层已下架';
        }

        if (index % 5 === 0) {
            f.dot = true; // 加圆点
        }
    });
    // building.disabledTip = '该项目已下架';
    console.log(building);
});
// let copy = JSON.parse(JSON.stringify(data[1])),
//     index = 0;
// copy.id = copy.id + index++;
// data.push(copy);

// copy = JSON.parse(JSON.stringify(copy));
// copy.id = copy.id + index++;
// data.push(copy);

// copy = JSON.parse(JSON.stringify(copy));
// copy.id = copy.id + index++;
// data.push(copy);

// copy = JSON.parse(JSON.stringify(copy));
// copy.id = copy.id + index++;
// data.push(copy);

// copy = JSON.parse(JSON.stringify(copy));
// copy.id = copy.id + index++;
// data.push(copy);

// copy = JSON.parse(JSON.stringify(copy));
// copy.id = copy.id + index++;
// data.push(copy);

// copy = JSON.parse(JSON.stringify(copy));
// copy.id = copy.id + index++;
// data.push(copy);

// copy = JSON.parse(JSON.stringify(copy));
// copy.id = copy.id + index++;
// data.push(copy);

const floorId = ref('');
const buildingFloors = ref(data);

const onChange = (id, floor, building) => {
    console.log(id, floor, building);
};

const expandChange = (id, building) => {
    console.log(id, building);
};
</script>
