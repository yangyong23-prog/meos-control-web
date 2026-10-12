export const detailTooltipKey = Symbol('detailTooltipkey');
export default () => {
    const currentHoverElForDetail = ref(null);
    const lastMousePos = ref({ x: 0, y: 0 });
    const isOpenDetailPop = ref(false);

    provide(detailTooltipKey, {
        show: event => {
            console.log('event: ', event);

            lastMousePos.value = { x: event.clientX, y: event.clientY };
            currentHoverElForDetail.value = event.currentTarget;
            isOpenDetailPop.value = true;
        },
        hide: () => {
            isOpenDetailPop.value = false;
            currentHoverElForDetail.value = null;
        }
    });

    return {
        currentHoverElForDetail,
        isOpenDetailPop
    };
};
