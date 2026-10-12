<template>
    <div v-loading="loadinhGridData" class="fb over-h" element-loading-lottiename="circle">
        <template v-if="gridsData?.length">
            <div id="onScrollId" style="flex: 1; overflow-y: auto; height: 100%" @scroll="onScroll">
                <div
                    v-for="(items, indexs) in gridsData"
                    :id="`floor_${items.buildingId}-${items.floorId}`"
                    :key="indexs"
                    :ref="e => targetFun(e, items)"
                    :class="{
                        'flex-item': true,
                        scrollActive: items.floorId === floorId
                    }"
                >
                    <div class="f18 fb7 floor-info" @click="entryFloor(items.floorId)">
                        {{ items.name }}

                        <span :class="['entry-floor-btn']">{{ i18n.global.t('meos_control_web.enter_floor') }}</span>
                    </div>
                    <div class="gp12 fw grid-columns mt16 mb16 mr8">
                        <div
                            v-for="(item, index) in items.list"
                            :key="index"
                            :class="['grids-item', 'cp', item.id === selectModuleInfo?.id ? 'bn' : '']"
                            :style="{
                                border: getBorder(item)
                            }"
                            @click.stop="gridsBtn(item, index)"
                        >
                            <div
                                :class="{
                                    'grids-item-top': true,
                                    'grids-item-top-active': item.id === selectModuleInfo?.id
                                }"
                                :style="{
                                    background: getBackgroundColor(item)
                                }"
                            >
                                <div class="fc">
                                    <!-- 1开启 0关闭 其余与数据状态 -->
                                    <div
                                        :class="[
                                            getRunStatusVal(item.id) === '1' ? 'exhaust-fan-gif' : getRunStatusVal(item.id) === '0' ? 'exhaust-fan-ash' : 'exhaust-fan-none',
                                            'exhaust-fan'
                                        ]"
                                    >
                                        <!-- 异常 -->
                                        <AnomalousRedDot :type="getAbnormalWeight(item?.id)" />
                                        <!-- 控反不一致 -->
                                        <!-- <AnomalousRedDot :type="'2'" /> -->
                                        <!-- 多状态 -->
                                        <!-- <AnomalousRedDot :type="'3'" /> -->
                                        <!-- 离线 -->
                                        <!-- <AnomalousRedDot :type="'4'" /> -->
                                    </div>
                                    <span
                                        v-ellipsis
                                        :class="[
                                            'f16',
                                            'ml8',
                                            getRunStatusVal(item.id) === undefined ? 'ft1' : '',
                                            item.id === selectModuleInfo?.id ? 'fwhite' : '',
                                            'm-ellipsis',
                                            equipStatus(item?.id) === '3' ? 'fred' : ''
                                        ]"
                                        >{{ item.name }}</span
                                    >
                                </div>
                                <!-- <div class="ft1 f14 mt8">{{ i18n.global.t('meos_control_web.operation_time_slot') }} : {{ item.time || '--' }}</div> -->
                            </div>
                            <div
                                :class="{
                                    fc: true,
                                    'grids-item-bottom': true,
                                    'grids-item-bottom-active': item.id === selectModuleInfo?.id
                                }"
                                :style="{ background: getBackgroundColor1(item) }"
                            >
                                <!-- 补风机 -->
                                <div v-if="item.relation.supplementalFans" class="grids-item-bottom-img mr4" style="width: 70px">
                                    <div class="fc" style="position: relative">
                                        <m-tips :content="item.relation.supplementalFans.list[0].localName ?? '--'" theme="darkTransparent">
                                            <div
                                                :class="['fcc', item?.relation?.supplementalFans?.list?.[0].id === selectModuleInfo?.id ? 'svgIconActive' : '']"
                                                @click.stop="equipmentBtn(item?.relation?.supplementalFans?.list?.[0], item?.relation?.supplementalFans?.list?.[0].id)"
                                            >
                                                <div style="position: relative" class="fcc">
                                                    <Svgicon
                                                        :name="
                                                            getRunStatusVal(item?.relation?.supplementalFans?.list?.[0].id) === '1'
                                                                ? 'Auxiliary-fan'
                                                                : getRunStatusVal(item?.relation?.supplementalFans?.list?.[0].id) === '0'
                                                                ? 'Auxiliary-fan-ash'
                                                                : 'noDataExhaustFan'
                                                        "
                                                    />
                                                    <AnomalousRedDot :type="getAbnormalWeight(item?.relation?.supplementalFans?.list?.[0].id)" />
                                                </div>
                                            </div>
                                        </m-tips>

                                        <div v-if="item.relation.supplementalFans.list.length > 1" class="icon-box fc">
                                            <m-tips :content="item.relation.supplementalFans.list[1].localName ?? '--'" theme="darkTransparent">
                                                <div
                                                    :class="[
                                                        item.id === selectModuleInfo?.id ? 'icon-active' : '',
                                                        'icon-border',
                                                        item?.relation?.supplementalFans?.list?.[1].id === selectModuleInfo?.id ? 'svgIconActive' : ''
                                                    ]"
                                                    :style="{ background: getBackgroundColor1(item) }"
                                                    @click.stop="equipmentBtn(item?.relation?.supplementalFans?.list?.[1], item?.relation?.supplementalFans?.list?.[1].id)"
                                                >
                                                    <div style="position: relative" class="fcc">
                                                        <Svgicon
                                                            :name="
                                                                getRunStatusVal(item?.relation?.supplementalFans?.list?.[1].id) === '1'
                                                                    ? 'Auxiliary-fan'
                                                                    : getRunStatusVal(item?.relation?.supplementalFans?.list?.[1].id) === '0'
                                                                    ? 'Auxiliary-fan-ash'
                                                                    : 'noDataExhaustFan'
                                                            "
                                                        />
                                                        <AnomalousRedDot :type="getAbnormalWeight(item?.relation?.supplementalFans?.list?.[1].id)" />
                                                    </div>
                                                </div>
                                            </m-tips>
                                            <div
                                                v-if="item.relation.supplementalFans.list.length > 2"
                                                :class="[item.id === selectModuleInfo?.id ? 'left-more-active' : '', 'left-more']"
                                                :style="{ border: getBorder1(item) }"
                                                @click.stop="e => leftMoreBtn(e, item, '1')"
                                            >
                                                <div style="position: relative">
                                                    <div
                                                        :class="{
                                                            'left-more-item': true,
                                                            'left-more-item-active': selectOwnId === item.id && selectAreaType == 'moreEquip' && leftMoreItemId === '1',
                                                            fcc: true
                                                        }"
                                                    >
                                                        <span class="f12"> {{ item.relation.supplementalFans.list.length - 2 }} </span>
                                                        <IconMeriComponentChevronDown
                                                            v-show="gridsId !== item.id || leftMoreItemId !== '1'"
                                                            :class="[
                                                                selectOwnId === item.id && selectAreaType == 'moreEquip' && leftMoreItemId === '1' ? 'arrow-Down-active' : '',
                                                                'arrow-Down'
                                                            ]"
                                                        />
                                                        <IconMeriComponentChevronUp
                                                            v-show="gridsId === item.id && leftMoreItemId === '1'"
                                                            :class="[
                                                                selectOwnId === item.id && selectAreaType == 'moreEquip' && leftMoreItemId === '1' ? 'arrow-Down-active' : '',
                                                                'arrow-Down'
                                                            ]"
                                                        />
                                                    </div>
                                                    <AnomalousRedDot :type="moreEquipStatus(item?.relation?.supplementalFans?.list.slice(2))" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div v-ellipsis class="f14 ft mt8 m-ellipsis font-w">{{ item.relation.supplementalFans.name }}</div>
                                </div>
                                <!-- 油烟净化器 -->
                                <div v-if="item.relation.oilFumePurifiers" class="grids-item-bottom-img" style="width: 70px">
                                    <div class="fc" style="position: relative">
                                        <m-tips :content="item.relation.oilFumePurifiers.list[0].localName ?? '--'" theme="darkTransparent">
                                            <div
                                                :class="['fcc', item?.relation?.oilFumePurifiers?.list?.[0].id === selectModuleInfo?.id ? 'svgIconActive' : '']"
                                                @click.stop="equipmentBtn(item?.relation?.oilFumePurifiers?.list?.[0], item?.relation?.oilFumePurifiers?.list?.[0].id)"
                                            >
                                                <!-- <Svgicon name="purifier1" /> -->
                                                <div style="position: relative" class="fcc">
                                                    <Svgicon
                                                        :name="
                                                            getRunStatusVal(item?.relation?.oilFumePurifiers?.list?.[0].id) === '1'
                                                                ? 'purifier1'
                                                                : getRunStatusVal(item?.relation?.oilFumePurifiers?.list?.[0].id) === '0'
                                                                ? 'purifier1-ash'
                                                                : 'noDataRangeHood'
                                                        "
                                                    />
                                                    <AnomalousRedDot :type="getAbnormalWeight(item?.relation?.oilFumePurifiers?.list?.[0].id)" />
                                                </div>
                                            </div>
                                        </m-tips>
                                        <div v-if="item.relation.oilFumePurifiers.list.length > 1" class="icon-box fc">
                                            <m-tips :content="item.relation.oilFumePurifiers.list[1].localName ?? '--'" theme="darkTransparent">
                                                <div
                                                    :class="[
                                                        item.id === selectModuleInfo?.id ? 'icon-active' : '',
                                                        'icon-border',
                                                        item?.relation?.oilFumePurifiers?.list?.[1].id === selectModuleInfo?.id ? 'svgIconActive' : ''
                                                    ]"
                                                    :style="{ background: getBackgroundColor1(item) }"
                                                    @click.stop="equipmentBtn(item?.relation?.oilFumePurifiers?.list?.[1], item?.relation?.oilFumePurifiers?.list?.[1].id)"
                                                >
                                                    <div style="position: relative" class="fcc">
                                                        <Svgicon
                                                            :name="
                                                                getRunStatusVal(item?.relation?.oilFumePurifiers?.list?.[1].id) === '1'
                                                                    ? 'purifier1'
                                                                    : getRunStatusVal(item?.relation?.oilFumePurifiers?.list?.[1].id) === '0'
                                                                    ? 'purifier1-ash'
                                                                    : 'noDataRangeHood'
                                                            "
                                                        />
                                                        <AnomalousRedDot :type="getAbnormalWeight(item?.relation?.oilFumePurifiers?.list?.[1].id)" />
                                                    </div>
                                                </div>
                                            </m-tips>

                                            <div
                                                v-if="item.relation.oilFumePurifiers.list.length > 2"
                                                :class="[item.id === selectModuleInfo?.id ? 'left-more-active' : '', 'left-more']"
                                                :style="{ border: getBorder1(item) }"
                                                @click.stop="e => leftMoreBtn(e, item, '2')"
                                            >
                                                <div style="position: relative">
                                                    <div
                                                        :class="{
                                                            'left-more-item': true,
                                                            'left-more-item-active': selectOwnId === item.id && selectAreaType == 'moreEquip' && leftMoreItemId === '2',
                                                            fcc: true
                                                        }"
                                                    >
                                                        <span class="f12">{{ item.relation.oilFumePurifiers.list.length - 2 }}</span>

                                                        <IconMeriComponentChevronDown
                                                            v-show="gridsId !== item.id || leftMoreItemId !== '2'"
                                                            :class="[
                                                                selectOwnId === item.id && selectAreaType == 'moreEquip' && leftMoreItemId === '2' ? 'arrow-Down-active' : '',
                                                                'arrow-Down'
                                                            ]"
                                                        />
                                                        <IconMeriComponentChevronUp
                                                            v-show="gridsId === item.id && leftMoreItemId === '2'"
                                                            :class="[
                                                                selectOwnId === item.id && selectAreaType == 'moreEquip' && leftMoreItemId === '2' ? 'arrow-Down-active' : '',
                                                                'arrow-Down'
                                                            ]"
                                                        />
                                                    </div>
                                                    <AnomalousRedDot :type="moreEquipStatus(item?.relation?.oilFumePurifiers?.list.slice(2))" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div v-ellipsis class="f14 ft mt8 m-ellipsis font-w">{{ item.relation.oilFumePurifiers.name }}</div>
                                </div>
                                <div v-if="item.relation.oilFumePurifiers || item.relation.supplementalFans" class="get-line ml18 mr18"></div>
                                <!-- 服务空间 -->
                                <div v-if="item.relation.serviceSpaces.length > 0" style="flex: 1; overflow: hidden">
                                    <div class="fc" style="white-space: nowrap">
                                        <div
                                            :class="{
                                                'bgc-more': leftMoreItemId !== '3',
                                                'space-item-card-active': selectOwnId === item.id && selectAreaType == 'moreSpace',
                                                fc: true
                                            }"
                                            @click.stop="e => moreBtn(e, '3', item)"
                                        >
                                            <span class="ftb f16 fb7 font-w">{{ item.relation.serviceSpaces.length }}</span>
                                            <span class="ml4 mr4 f14 ft font-w">{{ i18n.global.t('meos_control_web.service_spaces') }}</span>
                                            <IconMeriComponentChevronRight
                                                v-show="gridsId !== item.id || leftMoreItemId !== '3'"
                                                :class="[(selectOwnId === item.id && selectAreaType == 'moreSpace') || item.id === selectModuleInfo?.id ? 'arrow-icon' : '']"
                                            />
                                            <IconMeriComponentChevronUp
                                                v-show="gridsId === item.id && leftMoreItemId === '3'"
                                                :class="[(selectOwnId === item.id && selectAreaType == 'moreSpace') || item.id === selectModuleInfo?.id ? 'arrow-icon' : '']"
                                            />
                                        </div>
                                    </div>
                                    <div class="mt8 fc" style="white-space: nowrap">
                                        <div v-for="(io, iv) in item.relation.serviceSpaces" :key="iv" :class="['fc', 'mr4']" @click.stop="spaceBtn(io, io.id, 'more')">
                                            <div :class="['mr4', 'font-w', selectModuleInfo?.id === io.id && moreItemType === 'more' ? 'space-item-active' : 'space-item-hover']">
                                                {{ io.localName ?? '--' }}
                                            </div>
                                            <div v-if="io?.subItem?.length" class="fc" style="position: relative">
                                                <m-tips :content="io.subItem?.[0].localName ?? '--'" theme="darkTransparent">
                                                    <div
                                                        :class="['fcc', io?.subItem?.length > 1 ? 'mr5' : '']"
                                                        @click.stop="equipmentBtn(io.subItem[0], io.subItem[0].id, 'moreEquip')"
                                                    >
                                                        <div style="position: relative" class="fcc">
                                                            <Svgicon v-if="selectModuleInfo?.id === io.subItem[0].id && moreItemType === 'moreEquip'" name="Air-blower-active" />
                                                            <Svgicon
                                                                v-else
                                                                :name="
                                                                    getRunStatusVal(io?.subItem?.[0].id) === '1'
                                                                        ? 'Air-blower'
                                                                        : getRunStatusVal(io?.subItem?.[0].id) === '0'
                                                                        ? 'Air-blower-Off'
                                                                        : 'Air-blower-noData'
                                                                "
                                                            />
                                                            <AnomalousRedDot :type="getAbnormalWeight(io?.subItem?.[0].id)" />
                                                        </div>
                                                    </div>
                                                </m-tips>

                                                <div
                                                    v-if="io.subItem.length > 1"
                                                    :class="[item.id === selectModuleInfo?.id ? 'left-more-active' : '', 'left-more']"
                                                    :style="{ border: getBorder1(item) }"
                                                    @click.stop="e => leftMoreBtn(e, io, '3')"
                                                >
                                                    <div style="position: relative">
                                                        <div
                                                            :class="{
                                                                'left-more-item': true,
                                                                'left-more-item-active': selectOwnId === io.id && selectAreaType == 'moreEquip' && leftMoreItemId === '3',
                                                                fcc: true
                                                            }"
                                                        >
                                                            <span class="f12">{{ io.subItem.length - 1 }}</span>
                                                            <IconMeriComponentChevronDown
                                                                v-show="gridsId !== io.id || leftMoreItemId !== '3'"
                                                                :class="[
                                                                    selectOwnId === io.id && selectAreaType == 'moreEquip' && leftMoreItemId === '3' ? 'arrow-Down-active' : '',
                                                                    'arrow-Down'
                                                                ]"
                                                            />
                                                            <IconMeriComponentChevronUp
                                                                v-show="gridsId === io.id && leftMoreItemId === '3'"
                                                                :class="[
                                                                    selectOwnId === io.id && selectAreaType == 'moreEquip' && leftMoreItemId === '3' ? 'arrow-Down-active' : '',
                                                                    'arrow-Down'
                                                                ]"
                                                            />
                                                        </div>
                                                        <AnomalousRedDot :type="moreEquipStatus(io?.subItem?.slice(1))" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div
                                        :class="[item.id === selectModuleInfo?.id ? 'active-masking' : '', 'masking']"
                                        :style="{
                                            background: getBackgroundMaxking(item)
                                        }"
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 右侧楼层刻度尺 -->
            <m-scrollbar box-class="control-scrollbar">
                <floorSelector :floors="gridsData" @floor-select="scrollFloor"></floorSelector>
            </m-scrollbar>
        </template>
        <div v-if="!loadinhGridData && !gridsData?.length" class="nodata">
            <m-illustration :title="i18n.global.t('meos_control_web.no_content')" type="noContent"></m-illustration>
        </div>
    </div>
    <!-- 更多空间popup -->
    <m-popover
        ref="PopSpaceRef"
        virtual-triggering
        :virtual-ref="morePopRef"
        class="control-model-pop"
        popover-class="space-popup"
        trigger="manually"
        placement="bottom-start"
        style="height: auto; padding-right: 0; max-width: 590px"
        :is-open="morePop"
        :show-arrow="false"
        @click-event="clickEvent"
    >
        <template #content>
            <m-scrollbar max-height="590px" style="padding-right: 12px">
                <div v-for="(items, indexs) in cardSpaceItem.relation.serviceSpacesTree" :key="indexs">
                    <div class="f14 fb7">{{ items.name }}</div>
                    <div :class="['mt12', 'mb12', items.list.length > 1 ? 'grid-wrapper-item' : items.list.length === 1 ? 'grid-wrapper' : 'grid-wrapper']">
                        <div
                            v-for="(item, index) in items.list"
                            :key="index"
                            :class="[selectModuleInfo?.id === item.id && moreItemType === 'moreList' ? 'active-space-item' : '', 'space-item', 'cp']"
                            style="max-width: 273px"
                            @click.stop="spaceBtn(item, cardSpaceItem.id, 'moreList')"
                        >
                            <div class="fc" style="position: relative">
                                <div v-ellipsis class="mr4 m-ellipsis">{{ item.localName ?? '--' }}</div>
                                <iconBox :id="item.id" :list="item.subItem" :select-module-info-id="selectModuleInfo?.id" :more-item-type="moreItemType" />
                            </div>
                            <div class="ft f14">{{ i18n.global.t('meos_control_web.demand_time_range_placeholder') }}</div>
                        </div>
                    </div>
                </div>
            </m-scrollbar>
        </template>
    </m-popover>

    <!-- 更多设备popup -->
    <m-popover
        ref="PopEquipRef"
        virtual-triggering
        :virtual-ref="moreEquipmentPopRef"
        class="control-model-pop"
        popover-class="space-popup"
        trigger="manually"
        placement="bottom-start"
        style="height: auto; padding: 0 0 0 8px"
        :is-open="moreEquipmentPop"
        :show-arrow="false"
        width="260px"
        @click-event="clickEvent"
    >
        <template #content>
            <m-scrollbar max-height="590px" style="padding-right: 12px">
                <div class="mt12 mb12 item-wrapper">
                    <div
                        v-for="(item, index) in leftMoreItemId === '1'
                            ? leftMoreItem.relation.supplementalFans.list.slice(2)
                            : leftMoreItemId === '2'
                            ? leftMoreItem.relation.oilFumePurifiers.list.slice(2)
                            : leftMoreItem.subItem.slice(1)"
                        :key="index"
                        :class="[selectModuleInfo?.id === item.id ? 'active-space-item' : '', 'space-item', 'cp']"
                        @click="equipmentBtn(item, leftMoreItem.id)"
                    >
                        <div class="fc">
                            <div style="position: relative" class="fcc">
                                <template v-if="leftMoreItemId === '1'">
                                    <Svgicon
                                        :name="getRunStatusVal(item.id) === '1' ? 'Auxiliary-fan' : getRunStatusVal(item.id) === '0' ? 'Auxiliary-fan-ash' : 'noDataExhaustFan'"
                                    />
                                </template>
                                <template v-else-if="leftMoreItemId === '2'">
                                    <Svgicon :name="getRunStatusVal(item.id) === '1' ? 'purifier1' : getRunStatusVal(item.id) === '0' ? 'purifier1-ash' : 'noDataRangeHood'" />
                                </template>
                                <template v-else>
                                    <Svgicon :name="getRunStatusVal(item.id) === '1' ? 'Air-blower' : getRunStatusVal(item.id) === '0' ? 'Air-blower-Off' : 'Air-blower-noData'" />
                                </template>
                                <AnomalousRedDot :type="getAbnormalWeight(item.id)" />
                            </div>
                            <div v-ellipsis class="ml4 m-ellipsis">{{ item.localName ?? '--' }}</div>
                        </div>
                    </div>
                </div>
            </m-scrollbar>
        </template>
    </m-popover>
</template>
<script setup>
import floorSelector from './floorSelector.vue';
import AnomalousRedDot from './AnomalousRedDot.vue';
import Svgicon from '@/components/common/SvgIcon.vue';
import iconBox from '../left-grids/iconBox.vue';
import { showModuleInfoInjectKey, selectModuleInfoInjectKey, gridDataKey, loadinhGridDataKey } from '../constant/injectKey';
import { IconMeriComponentChevronRight, IconMeriComponentChevronUp, IconMeriComponentChevronDown } from 'meri-icon';
import { entryFloorKey } from '../hooks/useKitchenFumesGlobal';
import i18n from '@/localization';
import { OBJ_TYPE } from '@/utils/globalVariables';

const emits = defineEmits(['changeSpace', 'changeEquipment']);
const PopSpaceRef = ref(null);
const PopEquipRef = ref(null);
const morePopRef = ref({});
const moreEquipmentPopRef = ref({});
const morePop = ref(false);
const moreEquipmentPop = ref(false);
const leftMoreItemId = ref(-1);
const leftMoreItem = ref([]);
const cardSpaceItem = ref([]);
const activeFloor = ref({ time: '', floorOrder: '' });
const gridsId = ref('');
const floorId = ref('');
const unitId = ref('');
const targets = ref({});
const gridsData = inject(gridDataKey);
const loadinhGridData = inject(loadinhGridDataKey);
const showModuleInfo = inject(showModuleInfoInjectKey);
const selectModuleInfo = inject(selectModuleInfoInjectKey);
const selectOwnId = inject('selectOwnId'); //记录卡片id
const selectAreaType = inject('selectAreaType'); //记录卡片类型
const getAbnormalWeight = inject('getAbnormalWeight'); //记录设备状态小圆点 1:异常事件，2:控反不一致，3:离线，其它：无
const getRunStatusVal = inject('getRunStatusVal'); //1:开启，0:关闭
const isCardHasAbnormal = inject('isCardHasAbnormal'); //记录卡片异常
const moreItemType = inject('moreItemType'); //记录卡片异常
console.log(gridsData, 'gridsData');
const entryFloor = inject(entryFloorKey);
const targetFun = (e, items) => {
    targets.value[items.id] = e;
};
const onScroll = () => {
    PopSpaceRef?.value?.popoverRef.updatePosition();
    PopEquipRef?.value?.popoverRef.updatePosition();
};
const gridsBtn = (item, index) => {
    // emits('changeSpace', item);
    selectOwnId.value = '';
    showModuleInfo.value = true;
    selectModuleInfo.value = item;
    selectModuleInfo.value.objType = OBJ_TYPE.EQUIPMENT;
};

const spaceBtn = (item, id, type) => {
    selectOwnId.value = id;
    showModuleInfo.value = true;
    selectModuleInfo.value = item;
    moreItemType.value = type;
    selectModuleInfo.value.objType = OBJ_TYPE.SPACE;
    selectAreaType.value = 'moreSpace';
};
const equipmentBtn = (item, id, type) => {
    selectOwnId.value = id;
    moreItemType.value = type;
    showModuleInfo.value = true;
    selectModuleInfo.value = item;
    selectModuleInfo.value.objType = OBJ_TYPE.EQUIPMENT;
    selectAreaType.value = 'moreEquip';
};
const scrollFloor = item => {
    if (item.floorId) {
        floorId.value = item.floorId;
        unitId.value = item.unitId;
        activeFloor.value = {
            floorOrder: `${item.unitId}-${item.floorId}`,
            time: Date().valueOf()?.toString()
        };
        nextTick(() => {
            const ele = document.getElementById(`floor_${activeFloor.value.floorOrder}`);
            ele?.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
                inline: 'nearest'
            });
        });
        setTimeout(() => {
            floorId.value = '';
        }, 2000);
    }
};
const closePop = () => {
    morePop.value = false;
    moreEquipmentPop.value = false;
    gridsId.value = '';
};
const clickEvent = (e, type) => {
    const dom = document.querySelector('.m-popover.m-popover-light');
    const isContains = dom?.contains(e.target);
    if (!type && !isContains) {
        closePop();
    }
};
const moreBtn = (e, type, item) => {
    cardSpaceItem.value = item;
    leftMoreItemId.value = type;
    morePopRef.value = e.target.parentNode;
    morePop.value = !morePop.value;
    gridsId.value = morePop.value ? item.id : '';
};
const leftMoreBtn = (e, item, type) => {
    leftMoreItem.value = item;
    leftMoreItemId.value = type;
    moreEquipmentPopRef.value = e.target.parentNode;
    moreEquipmentPop.value = !moreEquipmentPop.value;
    gridsId.value = moreEquipmentPop.value ? item.id : '';
};
//更多设备的状态
const moreEquipStatus = items => {
    items.map(item => {
        if (getAbnormalWeight(item.id)?.includes(1)) {
            return '1'; //异常
        } else if (getAbnormalWeight(item.id)?.includes(2)) {
            return '2'; //控反不一致
        } else if (getAbnormalWeight(item.id)?.includes(3)) {
            return '4'; //离线
        } else {
            return null;
        }
    });
};
//卡片上设备的状态
const equipStatus = id => {
    if (getAbnormalWeight(id, true)?.length >= 3) {
        return '3'; //多状态
    } else if (getAbnormalWeight(id)?.includes(1)) {
        return '1'; //异常
    } else if (getAbnormalWeight(id)?.includes(2)) {
        return '2'; //控反不一致
    } else if (getAbnormalWeight(id)?.includes(3)) {
        return '4'; //离线
    } else {
        return null;
    }
};
//更多空间的状态
const moreSpaceStatus = id => {
    if (getAbnormalWeight(id)?.includes(1)) {
        return '1'; //异常
    } else if (getAbnormalWeight(id)?.includes(2)) {
        return '2'; //控反不一致
    } else if (getAbnormalWeight(id)?.includes(3)) {
        return '4'; //离线
    } else {
        return null;
    }
};
const getBorder = item => {
    if (isCardHasAbnormal(item, true)) {
        //异常
        return '1px solid #f55047';
    } else if (getRunStatusVal(item.id) === '1') {
        //开启
        return '1px solid #bcdcdb';
    } else {
        return '1px solid #E1E5EB'; //关闭 //无数据
    }
};
const getBorder1 = item => {
    if (isCardHasAbnormal(item, true)) {
        //异常
        return '2.5px solid #F7E2E3';
    } else if (getRunStatusVal(item.id) === '1') {
        //开启
        return '2.5px solid #DBECED';
    } else if (getRunStatusVal(item.id) === '0') {
        return '2.5px solid #EFF1F3'; //关闭
    } else {
        return '2.5px solid #E2E5E9'; //无数据
    }
};
const getBackgroundColor = item => {
    if (isCardHasAbnormal(item, true)) {
        //异常
        return '#F9E9EA';
    } else if (getRunStatusVal(item.id) === '1') {
        //开启
        return '#E3F2F3';
    } else if (getRunStatusVal(item.id) === '0') {
        return '#E6EAEF'; //关闭
    } else {
        return '#F1F4F6'; //无数据
    }
};
const getBackgroundColor1 = item => {
    if (isCardHasAbnormal(item, true)) {
        //异常
        return '#F7E2E3';
    } else if (getRunStatusVal(item.id) === '1') {
        //开启
        return '#DBECED';
    } else if (getRunStatusVal(item.id) === '0') {
        return '#E2E5E9'; //关闭
    } else {
        return '#EFF1F3'; //无数据
    }
};
const getBackgroundMaxking = item => {
    if (isCardHasAbnormal(item, true)) {
        //异常
        return 'linear-gradient(90deg, rgba(247, 226, 227, 0.00) 0%, #F7E2E3 67.37%)';
    } else if (getRunStatusVal(item.id) === '1') {
        //开启
        return 'linear-gradient(90deg, rgba(219, 236, 237, 0) 0%, rgba(219, 236, 237, 0.98) 67.37%)';
    } else if (getRunStatusVal(item.id) === '0') {
        //关闭
        return 'linear-gradient(90deg, rgba(226, 229, 233, 0.00) 0%, rgba(226, 229, 233, 0.98) 67.37%)';
    } else {
        //无数据
        return 'linear-gradient(90deg, rgba(239, 241, 243, 0.00) 0%, rgba(239, 241, 243, 0.98) 67.37%)';
    }
};

onUnmounted(() => {
    activeFloor.value = {
        floorOrder: '',
        time: ''
    };
});
provide('equipStatus', equipStatus);
provide('equipmentBtn', equipmentBtn);
</script>
<style lang="less" scoped>
:deep(.el-loading-mask) {
    background: transparent !important;
    .el-loading-spinner .path {
        stroke: #626c78;
    }
    .el-loading-spinner .circular {
        width: 32px;
        height: 32px;
    }
}
.grid-columns {
    display: grid;
    overflow: hidden;
}
.flex-item {
    width: 100%;
}
.floor-info {
    cursor: pointer;
    padding: 4px 4px;
    border-radius: 4px;
    &:hover {
        background: rgba(196, 201, 207, 0.3);
    }
}
.entry-floor-btn {
    min-width: fit-content;
    color: var(--blue-500);
    font-size: 14px;
    font-style: normal;
    font-weight: var(--platform-font-weight);
    line-height: 22px;
    padding: 4px;
}
.bn {
    border: 1px solid #246fe5 !important;
}
.grids-item {
    border-radius: 8px;
    overflow: hidden;
    &-top {
        padding: 12px 12px 12px 18px;
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
        border-bottom: 1px solid var(--Grey-Alpha-30, rgba(196, 201, 207, 0.3));
        &-active {
            background: var(--blue-500, #246fe5) !important;
            div {
                color: #fff;
            }
        }
    }
    &-bottom {
        padding: 14px 12px 14px 18px;
        border-bottom-left-radius: 8px;
        border-bottom-right-radius: 8px;
        position: relative;
        height: 77px;
        &-active {
            background: rgba(15, 98, 231, 0.8) !important;
            .font-w {
                color: #fff;
            }
        }
    }
}
.icon-active {
    background: #4786e9 !important;
}
.exhaust-fan {
    position: relative;
    background-repeat: no-repeat;
    background-size: cover;
    display: inline-block;
    width: 26px;
    height: 26px;
}
.masking {
    width: 36px;
    height: 77px;
    position: absolute;
    right: 0;
    top: 0;
    border-bottom-right-radius: 8px;
}
.active-masking {
    background: linear-gradient(90deg, rgba(71, 134, 233, 0) 0%, rgba(71, 134, 233, 0.98) 67.37%) !important;
}
.exhaust-fan-gif {
    background-image: url('../../../assets/imgs/exhaustFan.gif');
}
.exhaust-fan-ash {
    background-image: url('../../../assets/svg/Exhaustfanash.svg');
}
.exhaust-fan-none {
    background-image: url('../../../assets/svg/exhaustFanNone.svg');
}

.icon-red-dot {
    width: 5.5px;
    height: 5.5px;
    border-radius: 50%;
    position: absolute;
    right: 2px;
    top: -1px;
    z-index: 5;
    background-color: #f55047;
}
.icon-red-dot1 {
    width: 5.5px;
    height: 5.5px;
    border-radius: 50%;
    position: absolute;
    right: 3px;
    top: 1px;
    z-index: 5;
    background-color: #f55047;
}

.icon-box {
    position: absolute;
    left: 14px;
    .icon-border {
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 25px;
        height: 25px;
    }
}
.left-more {
    border-radius: 27px;
    // border: 2.5px solid #e2e5e9;
    background: var(--gray-50, #f7f9fa);
    width: 35px;
    // position: absolute;
    // left: 16px;
    margin-left: -10px;
    z-index: 1;
    &-item {
        border: 1px solid var(--gray-400, #c4c9cf);
        background: var(--gray-50, #f7f9fa);
        border-radius: 27px;
        height: 20px;
        &-active {
            color: #fff;
            border-radius: 27px;
            background: var(--blue-500, #246fe5);
        }
        &-active:hover {
            color: #fff;
            border-radius: 27px;
            background: var(--blue-500, #246fe5);
        }
    }
    &-item:hover {
        border-radius: 27px;
        background: var(--gray-200, #e8ecf0);
    }
}
.left-more-active {
    border: 2.5px solid rgba(15, 98, 231, 0.8) !important;
}
.left-more-item-active:hover {
    background: var(--blue-700, #1b4acc);
}
.bgc-more:hover {
    // width: 100%;
    border-radius: 2px;
    background: rgba(196, 201, 207, 0.5);
}
.space-item-card-active {
    border-radius: 2px;
    background: var(--blue-500, #246fe5);
    span {
        color: #fff;
    }
}
.space-item-card-active:hover {
    background: var(--blue-700, #1b4acc);
}
.space-item-active {
    border-radius: 2px;
    background: var(--blue-500, #246fe5);
    color: white;
}
.space-item-hover:hover {
    color: #246fe5;
    background: rgba(196, 201, 207, 0.5);
}
.arrow-Down {
    width: 8px;
    height: 8px;
}
.arrow-icon {
    :deep(.fill_color) {
        fill: #fff !important;
    }
}
.arrow-Down-active {
    :deep(.fill_color) {
        fill: #fff !important;
    }
}
:deep(.purifier1):hover {
    .svgPath {
        fill: #00818c !important;
    }
}
:deep(.Auxiliary-fan):hover {
    .svgPath {
        fill: #00818c !important;
    }
}
:deep(.Air-blower):hover {
    .svgPath {
        fill: #72e1de !important;
        stroke: #00a2a7 !important;
    }
}
:deep(.purifier1-ash):hover {
    .svgPath {
        fill: #1b2129 !important;
    }
}
:deep(.Auxiliary-fan-ash):hover {
    .svgPath {
        fill: #1b2129 !important;
    }
}
:deep(.Air-blower-Off):hover {
    .svgPath {
        fill: #c4c9cf !important;
        stroke: #626c78 !important;
    }
}
:deep(.noDataRangeHood):hover {
    .svgPath {
        fill: #8b949e !important;
    }
}
:deep(.noDataExhaustFan):hover {
    .svgPath {
        fill: #8b949e !important;
    }
}
:deep(.Air-blower-noData):hover {
    .svgPath {
        fill: #cbd0d9 !important;
        stroke: #d9dce0 !important;
    }
    .svgPath1 {
        fill: #abb3bc !important;
    }
    .svgPath2 {
        fill: #abb3bc !important;
        stroke: #dadee3 !important;
    }
}
.svgIconActive {
    :deep(.svgPath) {
        fill: #246fe5 !important;
    }
}
.svgIconActive:hover {
    :deep(.svgPath) {
        fill: #246fe5 !important;
    }
}
.control-model-pop {
    .grid-wrapper-item {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 8px;
    }
    .grid-wrapper {
        overflow: hidden;
    }
    .grid-wrapper,
    .grid-wrapper-item {
        .space-item {
            padding: 6px 8px 8px 12px;
            border-radius: 4px;
            border: 1px solid transparent;
            border-right: 0;
            background: linear-gradient(90deg, #f1f4f6 0%, rgba(241, 244, 246, 0.24) 100%);
            width: 273px;
        }
        .space-item:hover {
            border: 1px solid var(--blue-500, #246fe5);
        }
        .active-space-item {
            background: rgba(15, 98, 231, 0.8) !important;
            box-shadow: 0px 3px 20px 0px rgba(36, 111, 229, 0.4);
            div {
                color: #fff;
            }
        }
    }
    .item-wrapper {
        .space-item {
            padding: 10px 8px;
            border-radius: 4px;
        }
        .space-item:hover {
            background: var(--gray-200, #e8ecf0);
        }
        .active-space-item {
            border-radius: 4px;
            background: var(--blue-100, #d9ebff);
            div {
                color: #246fe5;
            }
        }
        .active-space-item:hover {
            border-radius: 4px;
            background: var(--blue-100, #d9ebff);
            div {
                color: #246fe5;
            }
        }
    }
}
.m-popover {
    padding: 0px !important;
}
.fred {
    color: #f55047;
}
.grids-item:hover {
    border: 1px solid var(--blue-500, #246fe5) !important;
    box-shadow: 0px 2px 20px 0px rgba(36, 111, 229, 0.2);
}
.get-line {
    width: 2px;
    height: 48px;
    background-color: rgba(196, 201, 207, 0.5);
}
@media (max-width: 1280px) {
    .grid-columns {
        grid-template-columns: repeat(1, 1fr);
    }
}
@media screen and (min-width: 1280px) and (max-width: 1600px) {
    .grid-columns {
        grid-template-columns: repeat(2, 1fr);
    }
}
@media screen and (min-width: 1600px) and (max-width: 1800px) {
    .grid-columns {
        grid-template-columns: repeat(3, 1fr);
    }
}
@media screen and (min-width: 1800px) and (max-width: 2560px) {
    .grid-columns {
        grid-template-columns: repeat(4, 1fr);
    }
}
@media (min-width: 2560px) {
    .grid-columns {
        grid-template-columns: repeat(5, 1fr);
    }
}
.over-h {
    overflow: hidden;
    height: 100%;
}

.scrollActive {
    animation: 850ms cubic-bezier(0.25, 0.1, 0.25, 1) 50ms 2 fadeGray;
}

@keyframes fadeGray {
    0% {
        background-color: initial;
    }
    35.29% {
        background-color: @grey-300;
    }
    41.18% {
        background-color: @grey-300;
    }
    100% {
        background-color: initial;
    }
}
.nodata {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
