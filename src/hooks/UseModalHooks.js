import { ref } from 'vue';

function UseModalHooks(emits, config = {}) {
    const show = ref(config?.show ?? false);

    const handleModalAfterTransition = (fn = () => {}, timeout) => {
        setTimeout(() => {
            fn();
        }, timeout || 300);
    };

    const handleModalClose = () => {
        show.value = false;

        handleModalAfterTransition(() => {
            emits('close');
        });
    };

    return {
        show,
        handleModalAfterTransition,
        handleModalClose
    };
}

export default UseModalHooks;
