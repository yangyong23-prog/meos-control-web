import { createApp } from 'vue';
import GroupList from './GroupList.vue';

// const Group = createApp({
//     extends: GroupList
// });

let vm = null;
const showGroupVm = (props, dom) => {
    if (vm && vm.close) {
        vm.close();
    }
    const $warp = dom || document.body;
    vm = createApp({
        extends: GroupList,
        props
    });

    // vm = vm.$mount(); // 挂载
    vm = vm.mount();
    $warp.appendChild(vm.$el); // 插入dom
    return vm;
};

const hideGroupVm = () => {
    vm.$el.remove();
    vm?.$destroy();
};

export { showGroupVm, hideGroupVm };
