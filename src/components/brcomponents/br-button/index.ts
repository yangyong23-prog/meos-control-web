import BrButton from './index.vue';

BrButton.install = (Vue: any) => {
    Vue.component(BrButton.name, BrButton);
};

export default BrButton;
