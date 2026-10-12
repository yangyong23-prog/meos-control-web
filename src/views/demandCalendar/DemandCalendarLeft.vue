<template>
    <template v-if="leftLoading">
        <div class="loading-container">
            <m-list-skeleton />
        </div>
    </template>
    <div v-show="!leftLoading" v-if="state.demandList" class="demand-calendar-left">
        <div v-for="(item, index) in state.demandList" :key="index">
            <div :class="[state.index == index ? 'active' : '', 'item']">
                <div :class="[state.index == index ? 'fb7' : '', 'content', 'fcb']" @click="activeBtn(index, item)">
                    <div class="fc">
                        <!-- <svg :style="`filter:grayscale(${state.index == index ? '0' : '1'})`" style="height: 24px; width: 24px">
                            <use :xlink:href="item.noActive" />
                        </svg> -->
                        <SvgIcon v-if="state.index == index" :name="item.active" width="10px" height="10px" />
                        <SvgIcon v-else :name="item.noActive" width="10px" height="10px" />
                        <div class="ml8 f14">{{ item.templateName }}</div>
                    </div>
                    <IconMeriComponentChevronRight v-if="state.index !== index" :size="20" />
                </div>
                <div class="more-item" :class="`template-loading-${item.templateType}`" :style="{ display: state.index == index ? 'block' : 'none' }">
                    <div v-if="state.templateList?.length">
                        <div v-for="(item1, indexs) in state.templateList" :key="item1.templateId">
                            <m-popover theme="darkTransparent" :show-arrow="false" :content="i18n.global.t('meos_control_web.view_template_detail_in_new_tab')">
                                <div v-if="item1.isEnabled" class="content template-item fc" @mouseover="show(indexs)" @mouseout="hide()" @click="openDetails(item, item1)">
                                    <div class="fc">
                                        <div class="bgcolor" :style="{ backgroundColor: getBackgroundColor(indexs) }"></div>
                                        <div class="ml8 f14 mr8 ellipsis">{{ item1.templateName }}</div>
                                        <div :style="{ display: state.showIndex == indexs ? 'block' : 'none' }" class="mt5">
                                            <SvgIcon name="noActiveShare" :width="'16'" :height="'16'" />
                                        </div>
                                    </div>
                                </div>
                            </m-popover>
                        </div>
                    </div>
                    <div v-else class="content" style="text-align: center; color: #626c78">
                        <span v-if="!leftItemLoading">{{ i18n.global.t('meos_control_web.no_template_enabled') }}</span>
                    </div>
                </div>
            </div>
            <div
                v-if="index == findLastIndexById('AIRCONDITIONING') || index == findLastIndexById('LIGHTING') || index == findLastIndexById('VENTILATION')"
                class="getLine mb12"
            ></div>
        </div>
    </div>
</template>

<script lang="ts" setup>
// @ts-ignore
import i18n from '@/localization';
import { IconMeriComponentChevronRight } from 'meri-icon';
import SvgIcon from '@/components/common/SvgIcon.vue';
import emitter from '@/utils/bus';
import { onMounted, reactive } from 'vue';
import { listTemplate, listTemplateType } from '@/apis/calendar';
import { useRouter, useRoute } from 'vue-router';
import baseStore from '@/store/baseStore';
import UseCancelTokenHooks from '@/hooks/UseCancelTokenHooks';
import { MLoading } from 'meri-plus';

const base = baseStore();
const router = useRouter();
const route = useRoute();
const type = route.query.templateType;

const { cancelQuest, cancelToken } = UseCancelTokenHooks();

// 权限枚举
const AUTH_EMUMERATION = ['requirementConfigurationManagement', 'lightingDemandManagement', 'ventilationDemand', 'securityDemand'];

// 权限清单
const authList = ref<any>([]);

const state = reactive<any>({
    index: 0,
    showIndex: -1,
    demandList: [],
    templateList: [],
    newArr: [],
    arr: [
        { templateType: 'AIRCONDITIONING', active: 'activeconditioner', noActive: 'conditioner' },

        { templateType: 'PUBLIC_AREA_LIGHTING', active: 'onCommon', noActive: 'offCommon' },
        { templateType: 'NIGHT_LIGHTING', active: 'activenocturne', noActive: 'nocturne' },
        { templateType: 'SIGN_LIGHTING', active: 'onIdentification', noActive: 'offIdentification' }, //标识照明
        { templateType: 'PARKING_LOT_LIGHTING', active: 'onParkingLighting', noActive: 'offParkingLighting' }, //停车场照明
        { templateType: 'LANDSCAPE_LIGHTING', active: 'onLandscapeLighting', noActive: 'offLandscapeLighting' }, //景观照明
        { templateType: 'BUILDING_LIGHTING', active: 'activecommonality', noActive: 'commonality' }, //楼梯照明

        { templateType: 'LOGISTICS_VENTILATION', active: 'activeMRL', noActive: 'noActiveMRL' }, //机房后勤
        { templateType: 'PARKING_VENTILATION', active: 'activeParkinglot', noActive: 'Parkinglot' },
        { templateType: 'TOILET_VENTILATION', active: 'activeRestRoom', noActive: 'noActiveRestRoom' }, //卫生间通风
        { templateType: 'DOME_VENTILATION', active: 'activedome', noActive: 'dome' },
        { templateType: 'ROOM_VENTILATION', active: 'activeindoor', noActive: 'indoor' },

        { templateType: 'ARMING', active: 'activeWAG', noActive: 'noActiveWAG' }, //撤防
        { templateType: 'PASSING', active: 'activeGT', noActive: 'noActiveGT' } //布防
    ],
    color: ['#9FC9FB', '#FFB800', '#E63C35', '#33D4D2', '#B286F5', '#FFD873', '#7188A6', '#E9A8E6', '#E6D1FF', '#D3B2FF', '#FCEF7E', '#FA9B96', '#F8766F'],
    color1: ['#B286F5', '#FFD873', '#7188A6', '#E9A8E6', '#E6D1FF', '#D3B2FF', '#FCEF7E', '#FA9B96', '#F8766F'],
    authList: ['requirementConfigurationManagement', 'lightingDemandManagement', 'ventilationDemand', 'securityDemand']
});
const findLastIndexById = (value: string) => {
    return state.demandList.map((item: any) => item.demandType).lastIndexOf(value);
};

const leftLoading = ref(false);
// template loading
const leftItemLoading = ref(false);

let loadingInstance: any = null;

onMounted(() => {
    filterAuth();
    getListDemandType(type);
});
const emits = defineEmits(['demandList']);

// 获取权限
const filterAuth = () => {
    authList.value = AUTH_EMUMERATION.filter(item => {
        return base.hasAuth(item);
    });
};

//初始化需求类型
const getListDemandType = (type: any) => {
    leftLoading.value = true;
    listTemplateType({})
        .then((res: any) => {
            let arr: any = [];
            if (res.data?.length) {
                /*
                逻辑解释：
                1、通风、空调、照明按照是否有对应菜单权限来确定（判断的标识：productCode） 有则按照接口内容展示
                2、撤布防 需要根据是否有“安防”的菜单权限来确定（判断的标识：productCode=== 'securityDemand'），如果有--只展示安防下撤布防
                */
                arr = res.data.filter((item: any) => {
                    if (item.productCode === 'securityDemand') {
                        if (authList.value.indexOf(item.productCode) === -1) return false;
                        const node = item.templateTypes.find((_item: any) => {
                            return _item.key === 'ARMING';
                        });
                        item.templateTypes = [node];
                        return !!node;
                    } else {
                        return authList.value.indexOf(item.productCode) > -1;
                    }
                });
                arr.forEach((item: any) => {
                    item.templateTypes.forEach((io: any) => {
                        state.demandList.push({
                            templateType: io.key,
                            templateName: io.value,
                            demandType: item.demandType
                        });
                    });
                });
                state.demandList.forEach((item: any) => {
                    state.arr.forEach((io: any) => {
                        if (item.templateType === io.templateType) {
                            item.active = io.active;
                            item.noActive = io.noActive;
                        }
                    });
                });
                emits('demandList', state.demandList);
                nextTick(() => {
                    if (type) {
                        getlistTemplate(type);
                        state.demandList.forEach((item: any, index: number) => {
                            if (item.templateType === type) {
                                state.index = index;
                            }
                        });
                    } else {
                        getlistTemplate('AIRCONDITIONING');
                    }
                });
            } else {
                state.demandList = [];
                leftLoading.value = false;
            }
        })
        .catch(() => {
            leftLoading.value = false;
        });
};

//初始化模板列表
// eslint-disable-next-line @typescript-eslint/no-shadow
const getlistTemplate = (type: any) => {
    if (state.demandList?.length) {
        leftItemLoading.value = true;
        state.templateList = [];
        cancelQuest();
        loadingInstance?.destroy();
        loadingInstance = MLoading.service({
            target: `.template-loading-${type}`,
            fullscreen: false,
            duration: 30000,
            lottieName: 'circle',
            loadIconStyle: {
                width: '150px',
                height: '150px'
            }
        });
        listTemplate(
            {
                templateType: type
            },
            { cancelToken: cancelToken() }
        )
            .then((res: any) => {
                if (res.data?.length) {
                    const result = res.data.every((item: any) => item.isEnabled === false);
                    state.templateList = result ? [] : res.data;
                } else {
                    state.templateList = [];
                }
                state.templateList.forEach((item: any, index: number) => {
                    if (index >= 13) {
                        item.color = state.color1[index % 9];
                    } else {
                        item.color = state.color[index % 13];
                    }
                });
                let obj = {
                    templateType: type,
                    arr: state.templateList
                };
                emitter.emit('getTemplateList', obj);
            })
            .finally(() => {
                leftLoading.value = false;
                leftItemLoading.value = false;
                loadingInstance?.destroy();
                loadingInstance = null;
            });
    }
};
//左侧模板点击事件
const activeBtn = (index: number, item: any) => {
    state.index = index;
    getlistTemplate(item.templateType);
    // emitter.emit('sendData', item)
};
const getBackgroundColor = (index: any) => {
    if (index >= 13) {
        return state.color1[index % 9];
    } else {
        return state.color[index % 13];
    }
};
//点击打开详情
const openDetails = (item: any, items: any) => {
    let name = '',
        typeParams = '';
    // eslint-disable-next-line default-case
    switch (item.demandType) {
        case 'AIRCONDITIONING': //末端
            // name = 'requirementConfigurationManagement';
            (name = 'demandManagementHome'), (typeParams = 'ac');
            break;
        case 'LIGHTING': //照明
            name = 'lightingDemandManagement';
            break;
        case 'VENTILATION': //通风
            // name = 'ventilationDemand';
            name = 'demandManagementHome';
            typeParams = 'vent';
            break;
        case 'SECURITY': //安防
            name = 'demandManagementHome';
            typeParams = 'sec';
            break;
    }
    const to: any = router.resolve({
        params: {
            type: typeParams
        },
        name: name,
        query: {
            templateId: items.templateId,
            templateTag: items.templateTag,
            templateType: items.templateType,
            islandPage: true as any,
            title: i18n.global.t('meos_control_web.demand_management')
        }
    });
    window.open(to.href, '_blank');
};
const show = (index: number) => {
    state.showIndex = index;
};
const hide = () => {
    state.showIndex = -1;
};
</script>
<style lang="less" scoped>
:deep(.m-loading-mask) {
    background-color: transparent !important;
}
.loading-container {
    border-right: 1px solid var(--gray-300);
    background: var(--gray-100);
    padding: 16px;
}
.demand-calendar-left {
    border-right: 1px solid var(--gray-300);
    background: var(--gray-100);
    padding: 16px;
    overflow-y: auto;
    .item {
        width: 100%;
        background-color: white;
        border-radius: 8px;
        margin-bottom: 12px;
        padding: 6px 7px;
        border: 1px solid transparent;
        .content {
            padding: 10px 8px;
            height: 41px;
        }
        .template-item:hover {
            background-color: rgba(196, 201, 207, 0.3);
            height: 41px;
        }
    }
    .item:hover {
        cursor: pointer;
        border: 1px solid var(--blue-400, #2481f2);
        /* Shadow/shadow-2 */
        box-shadow: 0px 0.5px 3px 0px rgba(27, 33, 41, 0.08), 0px 3px 12px 0px rgba(27, 33, 41, 0.12);
    }
    .active {
        border: 2px solid #246fe5;
    }
    .active:hover {
        border: 2px solid #246fe5;
        box-shadow: none;
    }
    .bgcolor {
        width: 20px;
        height: 3px;
    }
    .ellipsis {
        max-width: 150px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .more-item {
        max-height: 273px;
        overflow-y: auto;
    }
    .getLine {
        width: 100%;
        height: 1px;
        background-color: rgba(196, 201, 207, 0.3);
    }
}
</style>
