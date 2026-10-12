import { queryAbnormalEventList } from '@/apis/systemDiagram';
import { getDayjsTz, SUCCESSCODE } from '@/utils/globalVariables';
import dayjs from 'dayjs';
import { onMounted, onUnmounted } from 'vue';

export default (queryDataRef, customRequest) => {
    const abnormalEventList = ref([]);
    const abnormalEventCount = ref(null);
    const abnormalEventListUpdateTime = ref(null);
    const abnormalEventListLoading = ref(true);

    let timer = null;

    async function onQueryAbnormalEventList(hasLoding = false) {
        if (!queryDataRef.value) {
            abnormalEventListLoading.value = false;
            return;
        }

        if (hasLoding) {
            abnormalEventListLoading.value = true;
            abnormalEventCount.value = 0;
        }

        const requestFn = customRequest || queryAbnormalEventList;

        try {
            const res = await requestFn(queryDataRef.value);
            if (res.code === SUCCESSCODE) {
                abnormalEventList.value = res.data;
                abnormalEventCount.value = Number(res.total || abnormalEventList.value.length);
                abnormalEventListUpdateTime.value = getDayjsTz().format('YYYY-MM-DD HH:mm');
            }
        } finally {
            abnormalEventListLoading.value = false;
        }
    }

    function loopRequestAbnormalEventList() {
        timer && clearInterval(timer);
        onQueryAbnormalEventList(true);
        timer = setInterval(() => {
            onQueryAbnormalEventList();
        }, 1000 * 60);
    }

    watch(
        queryDataRef,
        () => {
            loopRequestAbnormalEventList();
        },
        {
            immediate: true
        }
    );

    onUnmounted(() => {
        clearInterval(timer);
    });

    return {
        abnormalEventListLoading,
        abnormalEventListUpdateTime,
        abnormalEventCount,
        abnormalEventList
    };
};
