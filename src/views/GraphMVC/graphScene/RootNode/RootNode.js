import { isEmpty } from 'lodash';
import BaseModel from '../../core/Model/BaseModel';
import AbstractCard from '../AbstractCard/AbstractCard';
import AbstractCardol from '../AbstractCardol/AbstractCardol';
import { modelNameEnum } from '../GraphSceneDefine';
import { registerMedia } from '../../core/Graph';
import SpaceMedia from '../Space/SpaceMedia';
import MultipleSpaceMedia from '../MultipleSpace/MultipleSpaceMedia';
import SpaceBorderMedia from '../SpaceBorder/SpaceBorderMedia';
import EquipMedia from '../Equip/EquipMedia';
import SpaceIconInfoMedia from '../SpaceIconInfo/SpaceIconInfoMedia';
import SpaceIconInfoMediaol from '../SpaceIconInfool/SpaceIconInfoMediaol';
import SpaceIconInfoCommonMedia from '../SpaceIconInfoCommon/SpaceIconInfoCommonMedia';
import OutlinePipeMedia from '../OutlinePipe/OutlinePipeMedia';
import RevitPipeMedia from '../RevitPipe/RevitPipeMedia';
import AbstractCardMedia from '../AbstractCard/AbstractCardMedia';
import AdvanceLinkLineMedia from '../AdvanceLinkLine/AdvanceLinkLineMedia';
import AbstractCardMediaol from '../AbstractCardol/AbstractCardMediaol';
import SimpleLinkLineMedia from '../SimpleLinkLine/SimpleLinkLineMedia';
import LinkLineInfoMedia from '../LinkLineInfo/LinkLineInfoMedia';
import EquipDotInfoMedia from '../EquipDotInfo/EquipDotInfoMedia';
import EquipStateInfoMedia from '../EquipStateInfo/EquipStateInfoMedia';
import EquipIconInfoMedia from '../EquipIconInfo/EquipIconInfoMedia';
import EquipIconMedia from '../EquipIcon/EquipIconMedia';
import GroupMedia from '../Group/GroupMedia';
import CivilMedia from '../Civil/CivilMedia';
import PipeInfo from '../PipeInfo/PipeInfo';
import SpaceIconInfo from '../SpaceIconInfo/SpaceIconInfo';
import PipeInfoMedia from '../PipeInfo/PipeInfoMedia';
import ValveRiserMedia from '../ValveRiser/ValveRiserMedia';
import ValveRiserIconInfoMedia from '../ValveRiserIconInfo/ValveRiserIconInfoMedia';
import ShaftMedia from '../Shaft/ShaftMedia';
import FloorTagInfoMedia from '../FloorTagInfo/FloorTagInfoMedia';
import FloorMedia from '../Floor/FloorMedia';
import OutlineMergedPipeMedia from '../OutlineMergedPipe/OutlineMergedPipeMedia';
import RevitMergedPipeMedia from '../RevitMergedPipe/RevitMergedPipeMedia';
import InfoPointMedia from '../InfoPoint/InfoPointMedia';
import TipsDivMedia from '../TipsDiv/TipsDivMedia';
import EquipPopoverInfoMedia from '../EquipPopoverInfo/EquipPopoverInfoMedia';
import SpaceLabelInfoMedia from '@/views/lightingControl/publicLightingMap/graph/SpaceLabel/SpaceLabelInfoMedia';
import ModuleCountMedia from '@/views/lightingControl/publicLightingMap/graph/ModuleCount/ModuleCountMedia';
import RobotInfoMedia from '@/views/robotPoc/RobotInfo/RobotInfoMedia';
import RootNodeMedia from './RootNodeMedia';
import { queryObjSummary } from '@/apis/commonRequest';
import * as _ from 'lodash';
import { getQuerySpaceDemandInfo } from '@/apis/xplantindoorenv3d';
import xplantindoorenvStore from '@/store/xplantindoorenv';
import baseStore from '@/store/baseStore';
import SpaceAggregatorInfoMedia from '@/views/IndoorLighting/left/FloorMap/graph/SpaceAggregatorInfo/SpaceAggregatorInfoMedia';

export default class RootNode extends BaseModel {
    constructor() {
        super();

        this.lastHoverSpace = null;
        this.lastSelectSpace = null;

        this.lastSelectEquip = null;
        this.lastHoverEquip = null;
        this.lastHoverLinkLine = null;

        this.lastHoverOutLinePipe = null;

        this.lastAbstractCard = null;
        this.name = modelNameEnum.RootNode;

        this.show = true;

        this.defineStyles = _.assign({}, this.defineStyles, {
            normal: { show: true, visible: true },
            hidden: {
                visible: false
            }
        });
        this.normalStyle = this.defineStyles.normal;
        this.styles.add(this.defineStyles.normal);
    }

    static registerAll() {
        registerMedia(modelNameEnum.Civil, CivilMedia);
        registerMedia(modelNameEnum.Space, SpaceMedia);
        registerMedia(modelNameEnum.MultipleSpace, MultipleSpaceMedia);
        registerMedia(modelNameEnum.SpaceBorder, SpaceBorderMedia);
        registerMedia(modelNameEnum.SpaceIconInfo, SpaceIconInfoMedia);
        registerMedia(modelNameEnum.SpaceIconInfoCommon, SpaceIconInfoCommonMedia);
        registerMedia(modelNameEnum.SpaceIconInfool, SpaceIconInfoMediaol);
        registerMedia(modelNameEnum.Equip, EquipMedia);
        registerMedia(modelNameEnum.EquipPopoverInfo, EquipPopoverInfoMedia);
        registerMedia(modelNameEnum.EquipDotInfo, EquipDotInfoMedia);
        registerMedia(modelNameEnum.EquipIconInfo, EquipIconInfoMedia);
        registerMedia(modelNameEnum.EquipIcon, EquipIconMedia);
        registerMedia(modelNameEnum.OutlinePipe, OutlinePipeMedia);
        registerMedia(modelNameEnum.PipeInfo, PipeInfoMedia);
        registerMedia(modelNameEnum.RevitPipe, RevitPipeMedia);
        registerMedia(modelNameEnum.AbstractCard, AbstractCardMedia);
        registerMedia(modelNameEnum.AbstractCardol, AbstractCardMediaol);
        registerMedia(modelNameEnum.RootNode, RootNodeMedia);
        registerMedia(modelNameEnum.Group, GroupMedia);
        registerMedia(modelNameEnum.AdvanceLinkLine, AdvanceLinkLineMedia);
        registerMedia(modelNameEnum.SimpleLinkLine, SimpleLinkLineMedia);
        registerMedia(modelNameEnum.LinkLineInfo, LinkLineInfoMedia);
        registerMedia(modelNameEnum.ValveRiser, ValveRiserMedia);
        registerMedia(modelNameEnum.ValveRiserIconInfo, ValveRiserIconInfoMedia);
        registerMedia(modelNameEnum.Shaft, ShaftMedia);
        registerMedia(modelNameEnum.FloorTagInfo, FloorTagInfoMedia);
        registerMedia(modelNameEnum.Floor, FloorMedia);
        registerMedia(modelNameEnum.OutlineMergedPipe, OutlineMergedPipeMedia);
        registerMedia(modelNameEnum.RevitMergedPipe, RevitMergedPipeMedia);
        registerMedia(modelNameEnum.InfoPoint, InfoPointMedia);
        registerMedia(modelNameEnum.TipsDiv, TipsDivMedia);
        registerMedia(modelNameEnum.SpaceLabelInfo, SpaceLabelInfoMedia);
        registerMedia(modelNameEnum.ModuleCount, ModuleCountMedia);
        registerMedia(modelNameEnum.EquipStateDotInfo, EquipStateInfoMedia);
        registerMedia(modelNameEnum.RobotInfo, RobotInfoMedia);
        registerMedia(modelNameEnum.SpaceAggregatorInfo, SpaceAggregatorInfoMedia);
    }

    cameraSelect(space) {
        space.forEach(item => {
            item.setState('hover', true);
        });
    }
    // MARK: - Space

    hoverSpace(space) {
        if (space && space.spaceData) {
            if (space.spaceIconInfo === null && !space.getState('selected')) {
                const spaceIconInfo = new SpaceIconInfo(space.spaceData, {
                    height: space.height,
                    floorHeight: space.floorHeight,
                    iconCatgory: space.iconCatgory
                });

                spaceIconInfo._createAdd = true;
                space.addSpaceIconInfo(spaceIconInfo);
            }
            this.lastHoverSpace = space;
            space.setState('hover', true);
        }
    }

    unhoverSpace() {
        if (this.lastHoverSpace) {
            const { spaceIconInfo } = this.lastHoverSpace || {};
            if (spaceIconInfo && spaceIconInfo._createAdd === true && !this.lastHoverSpace.getState('selected')) {
                spaceIconInfo._createAdd = false;
                this.lastHoverSpace.removeSpaceIconInfo(spaceIconInfo);
            }
            this.lastHoverSpace.setState('hover', false);
            this.lastHoverSpace = null;
        }
    }

    unactiveSpace() {
        if (this.lastActiveSpace) {
            this.lastActiveSpace.setState('active', false);
            this.lastActiveSpace = null;
        }
    }

    activeSpace(space) {
        if (space) {
            space.setState('active', true);
            this.lastActiveSpace = space;
        }
    }

    selectSpace(space, IconInfoClass = SpaceIconInfo) {
        if (space) {
            if (space.spaceIconInfo === null) {
                const spaceIconInfo = new IconInfoClass(space.spaceData, {
                    height: space.height,
                    floorHeight: space.floorHeight,
                    iconCatgory: space.iconCatgory
                });
                spaceIconInfo._createAdd = true;
                space.addSpaceIconInfo(spaceIconInfo);
            }
            space.setState('selected', true);
            this.lastSelectSpace = space;
        }
    }

    unselectSpace() {
        if (this.lastSelectSpace) {
            const { spaceIconInfo } = this.lastSelectSpace || {};
            if (spaceIconInfo && spaceIconInfo._createAdd === true) {
                spaceIconInfo._createAdd = false;
                this.lastSelectSpace.removeSpaceIconInfo(spaceIconInfo);
            }
            this.lastSelectSpace.setState('selected', false);
            this.lastSelectSpace = null;
        }
    }

    // 设备相关开始----------------------
    removeAllEquips() {
        this.equips.forEach(equip => {
            this.emit('RemoveEquip', equip);
        });
        this.equips = [];
    }

    hoverEquip(equip) {
        if (!equip) return;
        equip.setState('hover', true);
        this.lastHoverEquip = equip;
    }

    unhoverEquip() {
        if (this.lastHoverEquip) {
            this.lastHoverEquip.setState('hover', false);
            this.lastHoverEquip = null;
        }

        // TODO
        // if (this.lastHoverEquip) {
        //     const { equipData } = this.lastHoverEquip || {};
        //     if (this.lastHoverEquip._createAdd === true) {
        //         this.lastHoverEquip._createAdd = false;
        //         this.removeEquipIconInfo(this.lastHoverEquip);
        //     } else {
        //         const state = shiftRemove(this.lastHoverEquip.state, State.hover);
        //         this.lastHoverEquip.changeState(state);
        //     }
        //     this.normalLinkLine(equipData.id);
        //     this.lastHoverEquip = null;
        // }
    }

    activeEquip(equip) {
        if (equip) {
            equip.setState('active', true);
            this.lastActiveEquip = equip;
        }
    }

    unactiveEquip() {
        if (this.lastActiveEquip) {
            this.lastActiveEquip.setState('active', false);
            this.lastActiveEquip = null;
        }
    }

    selectEquip(equip) {
        if (equip) {
            equip.setState('selected', true);
            this.lastSelectEquip = equip;
        }
    }

    unselectEquip() {
        if (this.lastSelectEquip) {
            this.lastSelectEquip.setState('selected', false);
            this.lastSelectEquip = null;
        }
    }

    // 设备相关结束----------------------

    // MARK: - Card

    queryAbstractCardData(id, floorHeight, positionOffset, absorbToBimLocation, isInterface, spaceData, tabType) {
        if (this.lastQueryObjSummary && typeof this.lastQueryObjSummary === 'function') {
            // cancel 掉上次请求
            this.lastQueryObjSummary();
            this.lastQueryObjSummary = null;
        }
        if (isInterface === false) {
            let params = {
                    projectId: baseStore().projectId,
                    spaceId: spaceData.id,
                    infoCode: xplantindoorenvStore().infoCode,
                    monitorType: tabType
                },
                units = xplantindoorenvStore().leftInfoItem().unit;
            getQuerySpaceDemandInfo(params).then(res => {
                const { code, data } = res;
                if (code === '00000') {
                    spaceData.demandInfo = data;
                    spaceData.demandInfo.unit = units;

                    const { buildingId, bimLocation } = spaceData;
                    if (bimLocation) {
                        // 优化避免同时有多个卡片添加
                        this.removeAbstractCard();
                        const abstractCard = new AbstractCardol(spaceData, floorHeight, positionOffset);
                        this.addAbstractCard(abstractCard);
                    }
                }
            });
        } else {
            if (isEmpty(id)) {
                return;
            }
            queryObjSummary(
                {
                    objId: id,
                    queryIot: true
                },
                cancel => {
                    this.lastQueryObjSummary = cancel;
                }
            ).then(res => {
                const data = {
                    ...res,
                    title: res && res.localName ? res.localName : '--'
                };
                if (data.bimLocation) {
                    if (absorbToBimLocation) {
                        data.bimLocation = absorbToBimLocation;
                    }
                    if (id === data.id) {
                        // 优化避免同时有多个卡片添加
                        this.removeAbstractCard();
                        const abstractCard = new AbstractCard(data, floorHeight, positionOffset);
                        this.addAbstractCard(abstractCard);
                    }
                }
            });
        }
    }

    addAbstractCard(card) {
        super.add(card);
        this.emit('addChild', card);
        this.lastAbstractCard = card;
    }

    removeAbstractCard() {
        if (this.lastQueryObjSummary && typeof this.lastQueryObjSummary === 'function') {
            // cancel 掉上次请求
            this.lastQueryObjSummary();
        }
        if (this.lastAbstractCard) {
            super.remove(this.lastAbstractCard);
            this.emit('removeChild', this.lastAbstractCard);
            this.lastAbstractCard = null;
        }
    }

    hoverOutLinePipe(outLinePipe) {
        if (!outLinePipe) return;
        outLinePipe.setState('hover', true);
        this.lastHoverOutLinePipe = outLinePipe;
    }

    unhoverOutLinePipe() {
        if (this.lastHoverOutLinePipe) {
            this.lastHoverOutLinePipe.setState('hover', false);
            this.lastHoverOutLinePipe = null;
        }
    }

    hoverRevitPipe(revitPipe) {
        if (!revitPipe) return;
        revitPipe.setState('hover', true);
        this.lastHoverRevitPipe = revitPipe;
    }

    unhoverRevitPipe() {
        if (this.lastHoverRevitPipe) {
            this.lastHoverRevitPipe.setState('hover', false);
            this.lastHoverRevitPipe = null;
        }
    }

    longHoverOutPipe(outLinePipe, piont) {
        if (!outLinePipe) return;
        const pipeInfo = new PipeInfo(outLinePipe.data, piont);
        outLinePipe.addPipeInfo(pipeInfo);
        this.lastLongHoverOutLinePipe = outLinePipe;
    }

    unLongHoverOutPipe() {
        if (this.lastLongHoverOutLinePipe) {
            this.lastLongHoverOutLinePipe.removePipeInfo();
            this.lastLongHoverOutLinePipe = null;
        }
    }

    longhoverRevitPipe(revitPipe, piont) {
        if (!revitPipe) return;
        const pipeInfo = new PipeInfo([revitPipe.pipeData], piont);
        revitPipe.addPipeInfo(pipeInfo);
        this.lastLongHoverRevitPipe = revitPipe;
    }

    unLongHoverRevitPipe() {
        if (this.lastLongHoverRevitPipe) {
            this.lastLongHoverRevitPipe.removePipeInfo();
            this.lastLongHoverRevitPipe = null;
        }
    }

    hoverLinkLine(linkLine) {
        if (!linkLine) return;
        linkLine.setState('hover', true);
        this.lastHoverLinkLine = linkLine;
    }

    unhoverLinkLine() {
        if (this.lastHoverLinkLine) {
            this.lastHoverLinkLine.setState('hover', false);

            this.lastHoverLinkLine = null;
        }
    }

    hoverValveRiser(valveRiser) {
        if (!valveRiser) return;
        valveRiser.setState('hover', true);
        this.lastHoverValveRiser = valveRiser;
    }

    unhoverValveRiser() {
        if (this.lastHoverValveRiser) {
            this.lastHoverValveRiser.setState('hover', false);
            this.lastHoverValveRiser = null;
        }
    }

    showInfoPoint(infoPoint) {
        if (!infoPoint || infoPoint === this.lastShowInfoPoint) return;
        infoPoint.setState('activeList', true);
        this.lastShowInfoPoint = infoPoint;
    }

    hideInfoPoint() {
        if (this.lastShowInfoPoint) {
            this.lastShowInfoPoint.setState('activeList', false);
            this.lastShowInfoPoint = null;
        }
    }

    hoverInfoPoint(infoPoint) {
        if (!infoPoint || infoPoint === this.lastHoverInfoPoint) return;
        infoPoint.setState('hover', true);
        this.lastHoverInfoPoint = infoPoint;
    }

    unhoverInfoPoint() {
        if (this.lastHoverInfoPoint) {
            this.lastHoverInfoPoint.setState('hover', false);
            this.lastHoverInfoPoint = null;
        }
    }
}
