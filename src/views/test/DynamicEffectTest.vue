<template>
    <div style="height: 100%; width: 100%">
        <h1 style="text-align: center; padding: 50px">动态添加副作用测试</h1>
        <div class="test-loading-warp">
            <m-button @click="clickStart(['a', 'b'])">副作用a,b</m-button>
            <m-button @click="clickStart(['b', 'c'])">副作用b,c</m-button>

            <m-button @click="destory">移出副作用</m-button>
            <m-button @click="add('a')">add-a</m-button>
            <m-button @click="add('b')">add-b</m-button>
            <m-button @click="add('c')">add-c</m-button>
        </div>
        <div id="test-warp"></div>
        <m-button @click="removeChild">removeChild</m-button>
    </div>
</template>

<script setup>
import useEffectWarp from '@/hooks/useEffectWarp';
import { effectScope } from 'vue';

const scope = effectScope();

const { createEffect, destoryEffect } = useEffectWarp();

const ids = ref(['a', 'b']);
const dataMap = ref({
    a: { val: 1 },
    b: { val: 2 },
    c: { val: 3 }
});

const consoleIdEffect = () => {
    ids.value.forEach(_id => {
        watchEffect(() => {
            console.log(_id, '>>>>', dataMap.value[_id].val);
            // api
        });
    });
};

const clickStart = arr => {
    ids.value = arr;

    createEffect(consoleIdEffect);

    // destory();
    // scope.run(() => {
    //     ids.value.forEach(_id => {
    //         watchEffect(() => {
    //             console.log(_id, '>>>>', dataMap.value[_id].val);
    //         });
    //     });
    // });
};

const destory = () => {
    // scope.stop();
    destoryEffect();
};

onMounted(() => {
    const dom = document.getElementById('test-warp');
    const child1 = document.createElement('span');
    child1.classList.add('diy-span');
    child1.innerHTML = 'child1';
    child1.addEventListener('click', () => {
        console.log('child1 click');
    });

    const child2 = document.createElement('span');
    child2.classList.add('diy-span');
    child2.innerHTML = 'child2';
    child2.addEventListener('click', () => {
        console.log('child2 click');
    });

    const child3 = document.createElement('span');
    child3.classList.add('diy-span');
    child3.innerHTML = 'child3';
    child3.addEventListener('click', () => {
        console.log('child3 click');
    });

    dom.appendChild(child1);
    dom.appendChild(child2);
    dom.appendChild(child3);
});

const removeChild = () => {
    const dom = document.getElementById('test-warp');
    const { firstChild } = dom;
    dom.removeChild(firstChild);
};

const add = key => {
    dataMap.value[key].val++;
};

onBeforeUnmount(() => {
    destory();
});
</script>
<style lang="less" scoped>
.test-loading-warp {
    display: flex;
    gap: 10px;
    width: 100%;
    justify-content: center;
    align-items: center;
    .loading-item {
        flex: 1;
        border: 1px solid var(--gray-300);
        border-radius: 2px;
        height: 300px;
        margin-bottom: 20px;
        display: flex;
        flex-direction: column;
        align-items: center;
        overflow: hidden;
    }
}
</style>
