export default () => {
    const weatherRef = ref(null);
    const setTopHeight = ref(1);
    const setTop = ref();
    const controlAberrantBox = inject('controlAberrantBox');

    function onSetTopHeight() {
        nextTick(() => {
            setTopHeight.value = controlAberrantBox?.value?.offsetHeight - 98 - weatherRef.value?.offsetHeight - 32;
        });
    }

    onMounted(() => {
        window.addEventListener('resize', onSetTopHeight);
    });

    onUnmounted(() => {
        window.removeEventListener('resize', onSetTopHeight);
    });

    watch(
        () => controlAberrantBox?.value?.offsetHeight,
        () => {
            console.log(controlAberrantBox?.value?.offsetHeight, '-------');
            onSetTopHeight();
        },
        {
            deep: true
        }
    );
    return {
        setTop,
        weatherRef,
        setTopHeight,
        onSetTopHeight
    };
};
