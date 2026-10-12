import { createApp } from 'vue';
import ShowInfoList from './ShowInfoList.vue';

// const ShowInfoListComp = Vue.extend(ShowInfoList);

let vm = null;
const showListVm = (props, dom) => {
    if (vm && vm.close) {
        vm.close();
    }
    const $warp = dom || document.body;
    vm = createApp({
        extends: ShowInfoList,
        props
    });
    // vm = new ShowInfoListComp({
    //     propsData: props
    // }); // 实例化
    // vm = vm.$mount(); // 挂载
    vm = vm.mount(); // 挂载
    $warp.appendChild(vm.$el); // 插入dom
    return vm;
};

const hideListVm = () => {
    vm.$el.remove();
    vm?.$destroy();
};

export { showListVm, hideListVm };
