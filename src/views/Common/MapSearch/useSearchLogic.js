// @ts-ignore
import i18n from '@/localization';
import { nameAllMatch } from '@/utils/viewUtils';

export default (searchList, keyWord, selectTab, props) => {
    const normalFloorResult = ref([]);
    const otherFloorResult = ref([]);
    const searching = ref(false);

    const _doSearch = () => {
        if (!keyWord.value) {
            normalFloorResult.value = [];
            otherFloorResult.value = [];
            return;
        }
        const result = searchList.data.filter(item => {
            let flag = item.localName?.toLowerCase().includes(keyWord.value.toLowerCase());
            if (flag && selectTab.value === 'space' && typeof props.spaceFilterFn === 'function') {
                flag = props.spaceFilterFn(item);
            }
            if (flag && selectTab.value === 'equipment' && typeof props.equipFilterFn === 'function') {
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

        // 排序
        renderResult.sort((a, b) => {
            return a.floorSequenceId - b.floorSequenceId;
        });

        if (!props.currentFloorId) {
            normalFloorResult.value = renderResult;
            otherFloorResult.value = [];
            return;
        }
        normalFloorResult.value = renderResult.filter(item => {
            return item.floorId === props.currentFloorId;
        });

        otherFloorResult.value = renderResult.filter(item => {
            return item.floorId !== props.currentFloorId;
        });
    };

    let timer;
    const doSearch = () => {
        searching.value = true;
        normalFloorResult.value = [];
        otherFloorResult.value = [];
        clearTimeout(timer);
        timer = setTimeout(() => {
            _doSearch();
            searching.value = false;
        }, 500);
    };

    return {
        normalFloorResult,
        otherFloorResult,
        searching,
        doSearch
    };
};
