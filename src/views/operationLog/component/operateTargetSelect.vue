<!--更多筛选 - 选择操作对象-->
<template>
    <div>
        <m-select multiple :options="options" :menu-size="450" popover-class="operate-target-select-popover" @blur="handleHide">
            <template #default>
                <m-input
                    v-model="keyWord"
                    clearable
                    :placeholder="i18n.global.t('meos_control_web.press_enter_to_search_all')"
                    prefix-icon="IconMeriActionSearch"
                    @press-enter="handleSearchChange"
                    @input="handleSearchInput"
                >
                </m-input>
                <m-scrollbar :max-height="250">
                    <div v-if="keyWord.length && isPressEnter">
                        <ul v-if="equipmentList && equipmentList.length" class="equipment-list">
                            <li v-for="item in equipmentList" :key="item.objectId" class="equipment-list__item" @click="handleChange(item, item.checked)">
                                <m-checkbox v-model="item.checked" @change="handleChange(item, $event === 'checked' ? 'uncheck' : 'checked')" />
                                <span class="equipment-list__item_name" v-html="item.objectNameHtml"></span>
                                <m-tag size="small" :color="item.objectCategoryColor" :bg-color="item.objectCategoryBgColor">{{ item.objectCategoryName }} </m-tag>
                            </li>
                        </ul>
                        <div v-else class="search-no-data">{{ i18n.global.t('meos_control_web.search_no_results') }}</div>
                    </div>
                    <div v-else>
                        <div class="desc">{{ i18n.global.t('meos_control_web.search_history') }}</div>
                        <div v-if="searchHistory && searchHistory.length" class="search-history">
                            <m-tag v-for="(item, index) in searchHistory" :key="index" size="small" color="#1B2129" bg-color="#E8ECF0" @click="handleSearchHistoryClick(item)"
                                >{{ item }}
                            </m-tag>
                        </div>
                        <div v-else class="search-no-data">{{ i18n.global.t('meos_control_web.no_content') }}</div>
                    </div>
                </m-scrollbar>
            </template>
            <template #trigger>
                <m-button class="target-insert">
                    <template #icon>
                        <IconMeriComponentButtonAdd :size="16" color="#1B2129" hover-color="#246FE5" />
                    </template>
                    {{ i18n.global.t('meos_control_web.add') }}
                </m-button>
            </template>
        </m-select>
    </div>
</template>
<script setup lang="ts">
// @ts-ignore
import i18n from '@/localization';
import { IconMeriComponentButtonAdd } from 'meri-icon';
import { queryEquipmentList } from '@/apis/operationLog';
import { defineProps, defineEmits } from 'vue';
import baseStore from '@/store/baseStore';
import { getItem, setItem } from '@/utils/storageUtils';

const props = defineProps(['modelValue', 'systemId', 'requestData', 'systemClassCode']);
const emits = defineEmits(['update:modelValue']);
const options = ref([{}]) as any;
// 设备列表
let equipmentList = ref([]) as any,
    // 选中的设备列表
    selectedEquipmentList = ref([]) as any,
    // 搜索记录列表 - 获取本地存储
    searchHistory = ref([]) as any;
searchHistory.value = getItem('operationLogSearchHistory') ? JSON.parse(getItem('operationLogSearchHistory') as string) : [];
// eslint-disable-next-line one-var
let keyWord = ref(''),
    // 是否点击回车
    isPressEnter = ref(false),
    // 对象分类对应关系
    objectCategoryMap = {
        project: { name: i18n.global.t('meos_control_web.project'), color: '#A928B7', bgColor: '#F7E3F5' },
        equipment: { name: i18n.global.t('meos_control_web.equipment'), color: '#1B4ACC', bgColor: '#D9EBFF' },
        space: { name: i18n.global.t('common.space'), color: '#0C9B4A', bgColor: '#DAF7E1' },
        floor: { name: i18n.global.t('meos_control_web.floor'), color: '#E68600', bgColor: '#FFF0CC' },
        building: { name: i18n.global.t('meos_control_web.building'), color: '#D72824', bgColor: '#FFE6E5' },
        group: { name: i18n.global.t('meos_control_web.device_group'), color: '#00A2A7', bgColor: '#CBF7F3' },
        system: { name: i18n.global.t('meos_control_web.system'), color: '#683BD6', bgColor: '#F1E5FE' }
    } as any;

// 事件 - 搜索框input事件
const handleSearchInput = () => {
    if (keyWord.value.length) {
        isPressEnter.value = false;
    }
};

// 事件 - 搜索回车
const handleSearchChange = () => {
    isPressEnter.value = true;
    // 本地存储搜索记录
    let searchList = [],
        searchHistoryStr = getItem('operationLogSearchHistory');
    if (searchHistoryStr) {
        searchList = JSON.parse(searchHistoryStr);
        keyWord.value.trim().length && searchList.unshift(keyWord.value);
    } else {
        keyWord.value.trim().length && (searchList = [keyWord.value]);
    }
    // 搜索记录列表去重
    searchList = [...new Set(searchList)];
    // 去除空记录
    searchList = searchList.filter((o: any) => o.trim().length > 0);

    setItem('operationLogSearchHistory', JSON.stringify(searchList));
    searchHistory.value = searchList;
    console.log('搜索结果：', searchList);

    queryEquipmentList({
        systemId: props.systemId === 'all' ? null : props.systemId, // 所属系统
        word: keyWord.value.trim(),
        systemClassCode: props.systemClassCode, // 所属系统分类
        categoryList: props.requestData.secondCategoryList, // 二级分类
        dataStartTime: props.requestData.startTime,
        dataEndTime: props.requestData.endTime,
        type: props.requestData.type
    })
        .then(({ code, data }) => {
            if (code === '00000') {
                equipmentList.value = data;
                const reg = new RegExp(keyWord.value.trim());
                equipmentList.value.forEach((item: any) => {
                    // 搜索文案高亮显示
                    item.objectNameHtml = item.objectName.replace(reg, `<span style="color:#246FE5;">${keyWord.value.trim()}</span>`);
                    item.checked = props.modelValue.find((o: any) => o.objectId === item.objectId) ? 'checked' : 'uncheck';
                    item.objectCategoryName = objectCategoryMap[item.objectCategory].name;
                    item.objectCategoryColor = objectCategoryMap[item.objectCategory].color;
                    item.objectCategoryBgColor = objectCategoryMap[item.objectCategory].bgColor;
                });
            }
        })
        .finally(() => {
            // isPressEnter.value = false
        });
};

// 事件 - 搜索历史记录点击事件
const handleSearchHistoryClick = (item: string) => {
    keyWord.value = item;
    handleSearchChange();
};
// 事件 - 选中变更
const handleChange = (item: any, value: string) => {
    if (value === 'uncheck') {
        selectedEquipmentList.value.push(item);
        item.checked = 'checked';
    } else {
        item.checked = 'uncheck';
        selectedEquipmentList.value = selectedEquipmentList.value.filter((o: any) => o.objectId !== item.objectId);
    }
    emits('update:modelValue', selectedEquipmentList.value);
};

// 事件 - 下拉框隐藏
const handleHide = () => {
    keyWord.value = '';
};
</script>
<style lang="less">
.operate-target-select-popover {
    .m-select-menu-content {
        padding: 12px 0 12px 12px;

        .m-input {
            width: calc(100% - 12px) !important;
        }

        .desc {
            color: #8b949e;
            padding-top: 12px;
        }

        .equipment-list {
            padding-right: 12px;

            &__item {
                display: flex;
                align-items: center;
                height: 40px;
                cursor: pointer;

                &_name {
                    margin-left: 12px;
                    flex: 1;
                }
            }
        }

        .search-no-data {
            text-align: center;
            padding: 24px 0;
            color: #626c78;
        }

        .search-history {
            margin-top: 8px;
            height: 48px;
            overflow: hidden;

            .m-tag {
                margin-bottom: 4px;
                cursor: pointer;
            }

            .m-tag-small {
                margin-left: 0;
                margin-right: 4px;
            }
        }
    }
}
</style>
<style lang="less" scoped>
.target-insert {
    &:hover {
        /deep/ svg path {
            fill: #246fe5 !important;
        }
    }
}
</style>
