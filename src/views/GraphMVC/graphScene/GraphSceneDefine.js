export const RenderOrder = {
    groupEquip: 0,
    equip: 10,
    postionSpace: 15,
    space: 20,
    collided: 30,
    selected: 40,
    active: 50,
    hover: 60,
    card: 70,
    cardTips: 75,
    hide: 80,
    clickOn: 90
};
export const CollidedOrder = {
    // 碰撞默认权重，值越大权重越大
    space: 10,
    equip: 20
};
export const StatePriority = {
    normal: 0,
    grey: 10,
    absorb: 15,
    active: 20,
    hover: 30,
    selected: 40
};

export const modelNameEnum = {
    AbstractCard: Symbol('AbstractCard'),
    Space: Symbol('Space'),
    MultipleSpace: Symbol('MultipleSpace'),
    SpaceBorder: Symbol('SpaceBorder'),
    SpaceIconInfo: Symbol('SpaceIconInfo'),
    SpaceIconInfoCommon: Symbol('SpaceIconInfoCommon'),
    Civil: Symbol('Civil'),
    Equip: Symbol('Equip'),
    EquipDotInfo: Symbol('EquipDotInfo'),
    EquipStateDotInfo: Symbol('EquipStateDotInfo'),
    EquipIconInfo: Symbol('EquipIconInfo'),
    EquipIcon: Symbol('EquipIcon'),
    EquipPopoverInfo: Symbol('EquipPopoverInfo'),
    Group: Symbol('Group'),
    OutlinePipe: Symbol('OutlinePipe'),
    OutlineMergedPipe: Symbol('OutlineMergedPipe'),
    RevitMergedPipe: Symbol('RevitMergedPipe'),
    LinkMergedParasite: Symbol('LinkMergedParasite'),
    PipeInfo: Symbol('PipeInfo'),
    RevitPipe: Symbol('RevitPipe'),
    RootNode: Symbol('RootNode'),
    SimpleLinkLine: Symbol('SimpleLinkLine'),
    LinkLineInfo: Symbol('LinkLineInfo'),
    AdvanceLinkLine: Symbol('AdvanceLinkLine'),
    ValveRiser: Symbol('ValveRiser'),
    ValveRiserIconInfo: Symbol('ValveRiserIconInfo'),
    Shaft: Symbol('Shaft'),
    FloorTagInfo: Symbol('FloorTagInfo'),
    SimpleCard: Symbol('SimpleCard'),
    Floor: Symbol('Floor'),
    AbstractIOTCard: Symbol('AbstractIOTCard'),
    IotIconDotInfo: Symbol('IotIconDotInfo'),
    InfoPoint: Symbol('InfoPointMedia'),
    AbstractCardol: Symbol('AbstractCardol'),
    SpaceIconInfool: Symbol('SpaceIconInfool'),
    TipsDiv: Symbol('TipsDiv'),
    SpaceLabelInfo: Symbol('SpaceLabelInfo'),
    ModuleCount: Symbol('ModuleCount'),
    AirEquipIconInfo: Symbol('AirEquipIconInfo'),
    FlowEquipIconInfo: Symbol('FlowEquipIconInfo'),
    FlowSpaceIconInfo: Symbol('FlowSpaceIconInfo'),
    EquipRunningIconInfo: Symbol('EquipRunningIconInfo'),
    RobotInfo: Symbol('RobotInfo'),
    SpacePopoverInfo: Symbol('SpacePopoverInfo'),
    SpaceNameInfo: Symbol('SpaceNameInfo'),
    MachineRoomFloorEquipInfo: Symbol('MachineRoomFloorEquipInfo'),
    SpaceQualityInfo: Symbol('SpaceQualityInfo'),
    SpaceCard: Symbol('SpaceCard'),
    SpaceAggregatorInfo: Symbol('SpaceAggregatorInfo')
};
export const PIPE_SCALE_Y = 0.01;
export const PIPE_RADIUS = 0.15;
