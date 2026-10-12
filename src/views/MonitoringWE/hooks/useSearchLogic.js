import { nameAllMatch } from '@/utils/viewUtils';

export default (searchList, keyWord, props) => {
    const normalFloorResult = ref([]);
    const searching = ref(false);

    const _doSearch = () => {
        if (!keyWord.value) {
            normalFloorResult.value = [];

            return;
        }
        const result = searchList?.data.filter(item => {
            let flag = item.localName?.includes(keyWord.value);
            if (flag && typeof props.equipFilterFn === 'function') {
                flag = props.equipFilterFn(item);
            }
            return flag;
        });

        const renderResult = result.map(item => {
            return {
                ...item,
                htmlTxt: nameAllMatch(item.localName, keyWord.value)
            };
        });
        normalFloorResult.value = renderResult;
    };

    let timer;
    const doSearch = () => {
        searching.value = true;
        normalFloorResult.value = [];
        clearTimeout(timer);
        timer = setTimeout(() => {
            _doSearch();
            searching.value = false;
        }, 500);
    };

    return {
        normalFloorResult,
        searching,
        doSearch
    };
};
