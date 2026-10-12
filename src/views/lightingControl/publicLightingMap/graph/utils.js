import { createApp } from 'vue';
const vueApp = (component, props) => {
    let oFragment = document?.createDocumentFragment(),
        app = createApp(component, props);
    app.mount(oFragment);
    const dispose = () => {
        oFragment.firstElementChild?.remove();
        app.unmount();
        app = null;
        oFragment = null;
    };

    return {
        getDom: () => oFragment.firstElementChild,
        dispose
    };
};
export default vueApp;
