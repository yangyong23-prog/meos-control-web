import ACATAH1 from '@/assets/svg/HalfSectionView/ACATAH-1.svg';
import ACATAH2 from '@/assets/svg/HalfSectionView/ACATAH-2.svg';
import ACATAH3 from '@/assets/svg/HalfSectionView/ACATAH-3.svg';
import ACATFU1 from '@/assets/svg/HalfSectionView/ACATFU-1.svg';
import ACATFU2 from '@/assets/svg/HalfSectionView/ACATFU-2.svg';

import ACAHG1Base from '@/assets/svg/HalfSectionView/ACAHG-1-base.svg';
import ACAHG1StartSingle from '@/assets/svg/HalfSectionView/ACAHG-1-start-single.svg';
import ACAHG1StartMult from '@/assets/svg/HalfSectionView/ACAHG-1-start-mult.svg';
import ACAHG1Middle from '@/assets/svg/HalfSectionView/ACAHG-1-middle.svg';
import ACAHG1End from '@/assets/svg/HalfSectionView/ACAHG-1-end.svg';
import ACAHG2Base from '@/assets/svg/HalfSectionView/ACAHG-2-base.svg';
import ACAHG2StartSingle from '@/assets/svg/HalfSectionView/ACAHG-2-start-single.svg';
import ACAHG2StartMult from '@/assets/svg/HalfSectionView/ACAHG-2-start-mult.svg';
import ACAHG2Middle from '@/assets/svg/HalfSectionView/ACAHG-2-middle.svg';
import ACAHG2End from '@/assets/svg/HalfSectionView/ACAHG-2-end.svg';
import ACAHG3Base from '@/assets/svg/HalfSectionView/ACAHG-3-base.svg';
import ACAHG3StartSingle from '@/assets/svg/HalfSectionView/ACAHG-3-start-single.svg';
import ACAHG3StartMult from '@/assets/svg/HalfSectionView/ACAHG-3-start-mult.svg';
import ACAHG3Middle from '@/assets/svg/HalfSectionView/ACAHG-3-middle.svg';
import ACAHG3End from '@/assets/svg/HalfSectionView/ACAHG-3-end.svg';

import XinfengfaSvg from '@/assets/svg/HalfSectionView/xinfengfa.svg';
import HuifengfaSvg from '@/assets/svg/HalfSectionView/huifengfa.svg';
import ChuxiaoSvg from '@/assets/svg/HalfSectionView/chuxiao.svg';
import HuifengchuxiaoSvg from '@/assets/svg/HalfSectionView/huifengchuxiao.svg';
import HuifengjianpaifengfaSvg from '@/assets/svg/HalfSectionView/huifengjianpaifengfa.svg';
import JiashiqiSvg from '@/assets/svg/HalfSectionView/jiashiqi.svg';
import JingdianchuchenSvg from '@/assets/svg/HalfSectionView/jingdianchuchen.svg';
import LengpanguanSvg from '@/assets/svg/HalfSectionView/lengpanguan.svg';
import PaifengfaSvg from '@/assets/svg/HalfSectionView/paifengfa.svg';
import RepanguanSvg from '@/assets/svg/HalfSectionView/repanguan.svg';
import RezhuanlunSvg from '@/assets/svg/HalfSectionView/rezhuanlun.svg';
import SongfengfaSvg from '@/assets/svg/HalfSectionView/songfengfa.svg';
import ZairepanguanSvg from '@/assets/svg/HalfSectionView/zairepanguan.svg';
import ZhongxiaoSvg from '@/assets/svg/HalfSectionView/zhongxiao.svg';
import ChuanganqiSvg from '@/assets/svg/HalfSectionView/chuanganqi.svg';
import ArrowLeftSvg from '@/assets/svg/HalfSectionView/arrow_left.svg';
import ArrowRightSvg from '@/assets/svg/HalfSectionView/arrow_right.svg';

import SongfengJi from '@/components/HalfSectionView/components/SongfengJi.vue';
import PaifengJi from '@/components/HalfSectionView/components/PaifengJi.vue';
import _ from 'lodash';

import { useBreakpoints } from '@vueuse/core';
import { useQiankunElementSize } from '@/hooks/useQiankunElementSize';
import {
    calcNameMaxWidth,
    genPartId,
    genPartNameId,
    getRealOffsetRelativeToParent,
    getChildrenBound,
    getAabbUnion,
    genAnchorStyle
} from '@/components/HalfSectionView/utils/index';

export const graphContainerWidthKey = Symbol('graphContainerWidth');

export default props => {
    const componentMap = {
        'ACAHG-1': ACAHG1Base,
        'ACAHG-1-start-single': ACAHG1StartSingle,
        'ACAHG-1-start-mult': ACAHG1StartMult,
        'ACAHG-1-middle': ACAHG1Middle,
        'ACAHG-1-end': ACAHG1End,

        'ACAHG-2': ACAHG2Base,
        'ACAHG-2-start-single': ACAHG2StartSingle,
        'ACAHG-2-start-mult': ACAHG2StartMult,
        'ACAHG-2-middle': ACAHG2Middle,
        'ACAHG-2-end': ACAHG2End,

        'ACAHG-3': ACAHG3Base,
        'ACAHG-3-start-single': ACAHG3StartSingle,
        'ACAHG-3-start-mult': ACAHG3StartMult,
        'ACAHG-3-middle': ACAHG3Middle,
        'ACAHG-3-end': ACAHG3End,

        'ACATAH-1': ACATAH1,
        'ACATAH-2': ACATAH2,
        'ACATAH-3': ACATAH3,
        'ACATFU-1': ACATFU1,
        'ACATFU-2': ACATFU2,
        xinfengfa: XinfengfaSvg,
        hunfengfa: XinfengfaSvg,
        huifengfa: HuifengfaSvg,
        chuxiao: ChuxiaoSvg,
        chuanganqi: ChuanganqiSvg,
        huifengchuxiao: HuifengchuxiaoSvg,

        huifengjianpaifengfa: HuifengjianpaifengfaSvg,
        jiashiqi: JiashiqiSvg,
        jingdianchuchen: JingdianchuchenSvg,
        lengpanguan: LengpanguanSvg,
        lengpanguan01: LengpanguanSvg,
        paifengfa: PaifengfaSvg,
        yure: RepanguanSvg,
        yure01: RepanguanSvg,
        repanguan: RepanguanSvg,
        rezhuanlun: RezhuanlunSvg,
        songfengfa: SongfengfaSvg,
        zairepanguan: ZairepanguanSvg,
        zairepanguan01: ZairepanguanSvg,
        zhongxiao: ZhongxiaoSvg,
        songfengji: SongfengJi,
        paifengji: PaifengJi
    };
    const pipeBgInfos = ref(null);
    const curGraphScale = ref(1);
    const nameInfoFontSize = ref(14);

    const graphContainerRef = ref(null);
    const curTemplateData = ref(null);
    // 当前hover的部件编码
    const curHoverPartId = ref('');
    const graphStyle = ref({});
    const domLayerStyle = ref({});
    const namesStyleMap = ref({});
    const infoCardsStyleMap = ref({});
    const airOutletCardStyleMap = ref({});
    const relEquipNamesStyleMap = ref({});
    const partsData = ref([]);
    const relEquipNameAnchors = ref([]);
    const arrowsData = ref([]);

    // 响应式断点
    const breakpoints = useBreakpoints({
        sm: 1600,
        lg: 2160
    });
    // 是否小于 lg 断点
    const smallerLargeWidth = breakpoints.smaller('lg');
    // 小于1600宽度
    const smaller1600Width = breakpoints.smaller('sm');
    const { width: graphContainerWidth, height: graphContainerHeight } = useQiankunElementSize(graphContainerRef);

    const getSvgItemStyle = part => {
        return {
            left: part.locationCenter.x + 'px',
            transform: `translate(-50%, -50%)`,
            top: part.locationCenter.y + 'px'
        };
    };

    const hoverPartAbout = part => {
        curHoverPartId.value = part?.id;
    };
    const unhoverPartAbout = () => {
        curHoverPartId.value = '';
    };

    const infoCardList = computed(() => {
        return partsData.value
            ?.filter(part => !!part.infoCard && part.cardInfoList?.length > 0)
            .map(part => {
                return {
                    ...part,
                    cardInfoList: part.cardInfoList,
                    infoCard: part.infoCard
                };
            });
    });

    const airOutletCards = computed(() => {
        return curTemplateData.value?.airOutletCards ?? [];
    });

    watchEffect(() => {
        const _templateData = props.templateData;

        curTemplateData.value = _templateData;

        const _pipeBgInfos = [],
            baseParts = _templateData?.baseParts,
            equipParts = _templateData?.equipParts,
            relEquipName = _templateData?.relEquipName ?? {};

        const dynBgBasePos = _templateData?.pipeDynBgInfos ?? {};

        const equipPartsLen = equipParts?.length ?? 0;
        const pipeBgBaseImg = componentMap[_templateData?.code];

        _pipeBgInfos.push({ img: pipeBgBaseImg, style: {} });
        // 动态区域相关坐标，管道高度
        const { x = 0, y = 0, middleHeight, firstHeight } = dynBgBasePos;
        if (_templateData?.pipeBgType === 'dynamic' && equipPartsLen > 0) {
            for (let i = 0; i < equipPartsLen; i++) {
                //根据设备（空调机组）数量 动态计算匹配背景管道图片
                let bgImgCode = '',
                    curY = y;
                // 只有一个设备，只用独立的横管
                if (equipPartsLen === 1) {
                    bgImgCode = `${_templateData?.code}-start-single`;
                } else if (i === 0) {
                    // 整体>1个，第一个横管用有下部连接段的管
                    bgImgCode = `${_templateData?.code}-start-mult`;
                } else if (i === equipPartsLen - 1) {
                    // 整体>1个，最后一个横管用有上部连接段的管
                    curY = y + firstHeight + (i - 1) * middleHeight;
                    bgImgCode = `${_templateData?.code}-end`;
                } else {
                    // 整体>1个，中间的横管用有上下部连接段的管
                    curY = y + firstHeight + (i - 1) * middleHeight;
                    bgImgCode = `${_templateData?.code}-middle`;
                }
                const bgImg = componentMap[bgImgCode];
                _pipeBgInfos.push({ img: bgImg, style: { left: `${x}px`, top: `${curY}px` } });
            }
        }
        pipeBgInfos.value = _pipeBgInfos;

        const _parts = [],
            _relEquipNames = [];
        baseParts?.forEach(part => {
            _parts.push({
                ...part,
                equipId: props?.targetData?.id,
                id: genPartId(part),
                nameId: genPartNameId(part)
            });
        });
        // 对于设备（空调机组）下的部件，计算新的坐标
        equipParts?.forEach((eq, index) => {
            let rowRelY = 0;
            if (index > 0) {
                // 第2排以后的设备部件 y值要加上偏移量=index 乘以中间管的高度
                rowRelY += middleHeight * index;
            }
            _relEquipNames.push({
                ...relEquipName,
                anchorLocation: {
                    x: relEquipName.anchorLocation.x,
                    y: relEquipName.anchorLocation.y + rowRelY
                },
                ...eq,
                domId: `anchor_eq_name_${eq.id}`
            });
            eq.parts?.forEach(part => {
                const center = part.locationCenter;
                const curY = rowRelY + center.y;
                _parts.push({
                    ...part,
                    equipId: eq.id,
                    locationCenter: { x: center.x, y: curY },
                    id: genPartId(part, eq.id),
                    nameId: genPartNameId(part, eq.id)
                });
            });
        });

        partsData.value = _parts;
        relEquipNameAnchors.value = _relEquipNames;
        //  baseParts?.map(part => ({
        //     ...part,
        //     id: genPartId(part),
        //     nameId: genPartNameId(part)
        // }));

        // console.log('partsData.value: ', partsData.value);

        arrowsData.value = _templateData?.arrows?.map(obj => {
            // TODO 计算位置等
            return {
                img: obj.direction === 'left' ? ArrowLeftSvg : ArrowRightSvg,
                ...obj
            };
        });
    });

    const updateGraphBaseStyle = () => {
        const graphOriginWidth = curTemplateData.value?.size.width ?? 0;
        const graphOriginHeight = curTemplateData.value?.size.height ?? 0;
        const _style = {
            width: (graphOriginWidth ?? 0) + 'px',
            height: (graphOriginHeight ?? 0) + 'px'
        };

        if (props.useScale && graphOriginWidth > 0) {
            const paddingVal = smaller1600Width.value ? 48 : 108;
            nameInfoFontSize.value = smaller1600Width.value ? 12 : 14;

            // console.log('containerWidth: ', graphContainerWidth.value);
            const targetWidth = graphContainerWidth.value - paddingVal * 2;
            // 计算缩放比例
            let scale = targetWidth / graphOriginWidth;
            // 限制最大缩放比例为 1
            scale = Math.min(scale, 1);
            curGraphScale.value = scale;
            _style.transform = `scale(${scale})`;

            _style.left = `${(graphContainerWidth.value - graphOriginWidth * scale) / 2}px`;
            const top = (graphContainerHeight.value - graphOriginHeight * scale - 80) / 2;

            _style.top = `0px`;
        }

        graphStyle.value = _style;
    };

    const updateNameStyle = () => {
        namesStyleMap.value = partsData?.value
            ?.map(part => {
                const _dom = document.getElementById(part.id);
                if (!_dom) {
                    return false;
                }
                // ... existing code ...
                const posRect = getRealOffsetRelativeToParent(_dom, graphContainerRef.value);
                // console.log('posRect: ', posRect, _dom);
                const { nameMaxWidth, nameOffset = { y: 8 }, translateY = '0' } = part.nameStyle ?? {};

                const maxWidth = calcNameMaxWidth(nameMaxWidth, posRect);
                return {
                    id: part.id,
                    left: `${posRect.left + posRect.width / 2}px`,
                    top: `${posRect.top + posRect.height + nameOffset.y}px`,
                    // width: `${posRect.width}px`,
                    maxWidth: `${maxWidth}px`,
                    fontSize: `${nameInfoFontSize.value}px`,
                    transform: `translate(-50%, ${translateY})`
                };
            })
            .filter(Boolean)
            .reduce((acc, item) => {
                acc[item.id] = item; //
                return acc;
            }, {});
    };

    const updateAirOutletCardStyle = () => {
        airOutletCardStyleMap.value = airOutletCards?.value
            ?.map(card => {
                const _dom = document.getElementById(card.code);
                if (!_dom) {
                    return false;
                }
                // const { placement, offset } = card;
                // ... existing code ...
                const posRect = getRealOffsetRelativeToParent(_dom, graphContainerRef.value);

                return genAnchorStyle(posRect, card, nameInfoFontSize.value);
            })
            .reduce((acc, item) => {
                acc[item.id] = item; //
                return acc;
            }, {});
    };

    // 更新关联设备名称的样式
    const updateRelEquipNames = () => {
        relEquipNamesStyleMap.value = relEquipNameAnchors?.value
            ?.map(obj => {
                const _dom = document.getElementById(obj.domId);

                if (!_dom) {
                    return false;
                }
                const posRect = getRealOffsetRelativeToParent(_dom, graphContainerRef.value);
                return genAnchorStyle(posRect, obj, nameInfoFontSize.value);
            })
            .reduce((acc, item) => {
                acc[item.id] = item; //
                return acc;
            }, {});
    };

    const updateCardStyle = () => {
        infoCardsStyleMap.value = partsData?.value
            ?.map(part => {
                if (!part.infoCard || !graphContainerRef.value) {
                    return false;
                }
                const { id, nameId } = part;
                const { placement, offset } = part.infoCard;
                const { type, value } = offset;
                const targetId = type === 'relParentName' ? nameId : id;
                const _dom = document.getElementById(targetId);
                if (!_dom) {
                    return false;
                }
                // ... existing code ...
                const posRect = getRealOffsetRelativeToParent(_dom, graphContainerRef.value);

                // 根据placement动态计算transform，确保元素正确定位
                let left, top, transform;
                switch (placement) {
                    case 'top':
                        // 定位到目标元素上方中心位置
                        left = posRect.left + posRect.width / 2;
                        top = posRect.top - value;
                        transform = 'translate(-50%, -100%)'; // 水平居中，垂直向上对齐
                        break;
                    case 'bottom':
                        // 定位到目标元素下方中心位置
                        left = posRect.left + posRect.width / 2;
                        top = posRect.top + posRect.height + value;
                        transform = 'translate(-50%, 0)'; // 水平居中，垂直向下对齐
                        break;
                    case 'left':
                        // 定位到目标元素左侧中心位置
                        left = posRect.left - value;
                        top = posRect.top + posRect.height / 2;
                        transform = 'translate(-100%, -50%)'; // 水平向左对齐，垂直居中
                        break;
                    case 'right':
                        // 定位到目标元素右侧中心位置
                        left = posRect.left + posRect.width + value;
                        top = posRect.top + posRect.height / 2;
                        transform = 'translate(0, -50%)'; // 水平向右对齐，垂直居中
                        break;
                    default:
                        // 默认定位到右侧
                        left = posRect.left + posRect.width + value;
                        top = posRect.top + posRect.height / 2;
                        transform = 'translate(0, -50%)';
                }

                return {
                    id: part.id,
                    left: `${left}px`,
                    top: `${top}px`,
                    transform: transform,
                    fontSize: `${nameInfoFontSize.value}px`
                };
                // ... existing code ...
            })
            .filter(Boolean)
            // 转换为对象，方便后续操作
            .reduce((acc, item) => {
                acc[item.id] = item; //
                return acc;
            }, {});
    };

    const updateGraphContainerHeight = async () => {
        const graphOriginWidth = curTemplateData.value?.size.width ?? 0;

        const bgEl = document.querySelector('.base-layer');
        const infoCardsEl = document.querySelector('.dom-layer');

        const bgAabb = getChildrenBound(bgEl, infoCardsEl);
        const infoCardsAabb = getChildrenBound(infoCardsEl);

        const aabb = getAabbUnion(bgAabb, infoCardsAabb);
        // console.log('el: ', bgAabb, infoCardsAabb, aabb);

        if (props.useScale && graphOriginWidth > 0) {
            // const paddingVal = smaller1600Width.value ? 48 : 108;
            // nameInfoFontSize.value = smaller1600Width.value ? 12 : 14;

            const scale = curGraphScale.value;
            const allH = aabb.max.y - aabb.min.y;
            const bgH = bgAabb.max.y - bgAabb.min.y;
            const bgContianerH = scale > 0 ? bgH / scale : bgH;
            graphStyle.value.height = bgContianerH + 'px';

            if (graphContainerHeight.value > allH && allH > 0) {
                const allTop = (graphContainerHeight.value - allH) / 2;
                // console.log('allTop: ', graphContainerHeight.value, allH, allTop, infoCardsAabb.min.y < bgAabb.min.y, infoCardsAabb.min.y, bgAabb.min.y);
                if (infoCardsAabb.min.y < bgAabb.min.y) {
                    const graphNewTop = bgAabb.min.y - (infoCardsAabb.min.y - allTop);

                    graphStyle.value.top = `${graphNewTop}px`;
                } else {
                    graphStyle.value.top = `${allTop}px`;
                }
            } else {
                const val = infoCardsAabb.min.y < bgAabb.min.y ? bgAabb.min.y - infoCardsAabb.min.y : 0;

                graphStyle.value.top = `${val}px`;
            }
            // const top = graphContainerHeight.value > h ? (graphContainerHeight.value - h) / 2 : 0;
            // graphStyle.value.top = `${top}px`;
            // console.log('graphStyle.value.top: ', graphStyle.value.top);
            domLayerStyle.value = { width: `${graphContainerWidth.value}px`, height: `${allH}px` };
        }
    };

    const resetScroll = () => {
        if (graphContainerRef.value) {
            graphContainerRef.value.scrollTop = 0; // 直接回到最顶部
        }
    };

    const renderInPass = async (needUpdateContainer = false) => {
        if (needUpdateContainer) {
            updateGraphBaseStyle();
        }
        await nextTick();
        updateNameStyle();
        updateAirOutletCardStyle();
        updateRelEquipNames();
        await nextTick();
        updateCardStyle();
        await nextTick();
        if (needUpdateContainer) {
            await nextTick();
            await updateGraphContainerHeight();
        }
    };

    watch([graphContainerWidth, graphContainerHeight, partsData], async () => {
        if (!graphContainerHeight.value || !graphContainerWidth.value) {
            return;
        }
        // 重置滚动条
        resetScroll();

        await renderInPass(true);
        await nextTick();
        await renderInPass(false);
    });

    onMounted(() => {});
    provide(graphContainerWidthKey, graphContainerWidth);
    return {
        pipeBgInfos,
        partsData,
        arrowsData,
        graphStyle,
        domLayerStyle,
        graphContainerRef,
        namesStyleMap,
        infoCardsStyleMap,
        airOutletCardStyleMap,
        componentMap,
        infoCardList,
        curHoverPartId,
        airOutletCards,
        nameInfoFontSize,
        relEquipNameAnchors,
        relEquipNamesStyleMap,
        hoverPartAbout,
        unhoverPartAbout,
        getSvgItemStyle
    };
};
