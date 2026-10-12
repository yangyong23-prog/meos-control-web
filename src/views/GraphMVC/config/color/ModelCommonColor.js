import i18n from '@/localization';
import { pipeColorConfig } from '@/config';

const PipeModelColor = {
    get ACPPAN() {
        return pipeColorConfig?.ACPPAN || '#59A0CF';
    },
    get ACPPAR() {
        return pipeColorConfig?.ACPPAR || '#59A0CF';
    },
    get ACPPAS() {
        return pipeColorConfig?.ACPPAS || '#063B8E';
    },
    get ACPPCE() {
        return pipeColorConfig?.ACPPCE || '#59A0CF';
    },
    get ACPPCF() {
        return pipeColorConfig?.ACPPCF || '#59A0CF';
    },
    get ACPPCP() {
        return pipeColorConfig?.ACPPCP || '#59A0CF';
    },
    get ACPPCR() {
        return pipeColorConfig?.ACPPCR || '#0071A1';
    },
    get ACPPCS() {
        return pipeColorConfig?.ACPPCS || '#0071A1';
    },
    get ACPPDD() {
        return pipeColorConfig?.ACPPDD || '#009B5D';
    },
    get ACPPEA() {
        return pipeColorConfig?.ACPPEA || '#FF9B6D';
    },
    get ACPPFS() {
        return pipeColorConfig?.ACPPFS || '#6FB42E';
    },
    get ACPPHP() {
        return pipeColorConfig?.ACPPHP || '#59A0CF';
    },
    get ACPPHR() {
        return pipeColorConfig?.ACPPHR || '#FF9B6D';
    },
    get ACPPHS() {
        return pipeColorConfig?.ACPPHS || '#FF6D22';
    },
    get ACPPKO() {
        return pipeColorConfig?.ACPPKO || '#926900';
    },
    get ACPPOP() {
        return pipeColorConfig?.ACPPOP || '#59A0CF';
    },
    get ACPPOR() {
        return pipeColorConfig?.ACPPOR || '#E06616';
    },
    get ACPPOS() {
        return pipeColorConfig?.ACPPOS || '#E7C82D';
    },
    get ACPPRA() {
        return pipeColorConfig?.ACPPRA || '#AD44B1';
    },
    get ACPPRE() {
        return pipeColorConfig?.ACPPRE || '#AD44B1';
    },
    get ACPPRR() {
        return pipeColorConfig?.ACPPRR || '#063B8E';
    },
    get ACPPSA() {
        return pipeColorConfig?.ACPPSA || '#063B8E';
    },
    get ACPPVE() {
        return pipeColorConfig?.ACPPVE || '#A3A49E';
    },
    get ACPPVS() {
        return pipeColorConfig?.ACPPVS || '#A3A49E';
    },
    get FFPPAE() {
        return pipeColorConfig?.FFPPAE || '#A3A49E';
    },
    get FFPPFH() {
        return pipeColorConfig?.FFPPFH || '#AE111E';
    },
    get FFPPFM() {
        return pipeColorConfig?.FFPPFM || '#AE111E';
    },
    get FFPPGE() {
        return pipeColorConfig?.FFPPGE || '#AE111E';
    },
    get FFPPMA() {
        return pipeColorConfig?.FFPPMA || '#EF9F76';
    },
    get FFPPME() {
        return pipeColorConfig?.FFPPME || '#A3A49E';
    },
    get FFPPMS() {
        return pipeColorConfig?.FFPPMS || '#AE111E';
    },
    get FFPPPA() {
        return pipeColorConfig?.FFPPPA || '#A3A49E';
    },
    get FFPPSM() {
        return pipeColorConfig?.FFPPSM || '#EF9F76';
    },
    get FFPPSR() {
        return pipeColorConfig?.FFPPSR || '#AE111E';
    },
    get FFPPTM() {
        return pipeColorConfig?.FFPPTM || '#AE111E';
    },
    get FFPPWM() {
        return pipeColorConfig?.FFPPWM || '#AE111E';
    },
    get FFPPWS() {
        return pipeColorConfig?.FFPPWS || '#AE111E';
    },
    get FGPPGP() {
        return pipeColorConfig?.FGPPGP || '#F7D455';
    },
    get WSPPDD() {
        return pipeColorConfig?.WSPPDD || '#93DB49';
    },
    get WSPPDW() {
        return pipeColorConfig?.WSPPDW || '#A3A49E';
    },
    get WSPPHW() {
        return pipeColorConfig?.WSPPHW || '#A3A49E';
    },
    get WSPPRN() {
        return pipeColorConfig?.WSPPRN || '#58554C';
    },
    get WSPPRW() {
        return pipeColorConfig?.WSPPRW || '#A9671E';
    },
    get WSPPSW() {
        return pipeColorConfig?.WSPPSW || '#58554C';
    },
    get WSPPWW() {
        return pipeColorConfig?.WSPPWW || '#404040';
    },
    // ADD
    get WSPPPW() {
        return pipeColorConfig?.WSPPPW || '#A3A49E';
    },
    get WSPPWP() {
        return pipeColorConfig?.WSPPWP || '#A3A49E';
    },
    get WSPPWD() {
        return pipeColorConfig?.WSPPWD || '#A3A49E';
    },
    get WSPPNG() {
        return pipeColorConfig?.WSPPNG || '#A3A49E';
    },
    get ACPPET() {
        return pipeColorConfig?.ACPPET || '#404040';
    },
    get TPPPAS() {
        return pipeColorConfig?.TPPPAS || '#A3A49E';
    },
    get CHPPST() {
        return pipeColorConfig?.CHPPST || '#AE111E';
    },
    get CHPPCD() {
        return pipeColorConfig?.CHPPCD || '#00713F';
    }
};

const pipesClassCodeToNameColorMap = {
    get ACPPAN() {
        return { name: i18n.global.t('meos_control_web.cold_hot_water_makeup_pipe'), color: pipeColorConfig?.ACPPAN || '#59A0CF' };
    }, // 冷热水补水管
    get ACPPAR() {
        return { name: i18n.global.t('meos_control_web.cold_hot_water_return_pipe'), color: pipeColorConfig?.ACPPAR || '#59A0CF' };
    }, // 冷热水回水管
    get ACPPAS() {
        return { name: i18n.global.t('meos_control_web.cold_hot_water_supply_pipe'), color: pipeColorConfig?.ACPPAS || '#063B8E' };
    }, // 冷热水供水管
    get ACPPCE() {
        return { name: i18n.global.t('meos_control_web.expansion_water_pipe'), color: pipeColorConfig?.ACPPCE || '#59A0CF' };
    }, // 膨胀水管
    get ACPPCF() {
        return { name: i18n.global.t('meos_control_web.softened_water_pipe'), color: pipeColorConfig?.ACPPCF || '#59A0CF' };
    }, // 软化水管
    get ACPPCP() {
        return { name: i18n.global.t('meos_control_web.chilled_water_makeup_pipe'), color: pipeColorConfig?.ACPPCP || '#59A0CF' };
    }, // 冷冻水补水管
    get ACPPCR() {
        return { name: i18n.global.t('meos_control_web.chilled_water_return_pipe'), color: pipeColorConfig?.ACPPCR || '#0071A1' };
    }, //'冷冻水回水管'
    get ACPPCS() {
        return { name: i18n.global.t('meos_control_web.chilled_water_supply_pipe'), color: pipeColorConfig?.ACPPCS || '#0071A1' };
    }, // 冷冻水供水管
    get ACPPDD() {
        return { name: i18n.global.t('meos_control_web.air_conditioning_condensate_drain_pipe'), color: pipeColorConfig?.ACPPDD || '#009B5D' };
    }, // 空调冷凝水排水管
    get ACPPEA() {
        return { name: i18n.global.t('meos_control_web.air_conditioning_exhaust_duct'), color: pipeColorConfig?.ACPPEA || '#FF9B6D' };
    }, // 空调排风管
    get ACPPFS() {
        return { name: i18n.global.t('meos_control_web.fresh_air_supply_duct'), color: pipeColorConfig?.ACPPFS || '#6FB42E' };
    }, //'新风送风管'
    get ACPPHP() {
        return { name: i18n.global.t('meos_control_web.heating_water_makeup_pipe'), color: pipeColorConfig?.ACPPHP || '#59A0CF' };
    }, // 采暖水补水管
    get ACPPHR() {
        return { name: i18n.global.t('meos_control_web.heating_water_return_pipe'), color: pipeColorConfig?.ACPPHR || '#E32F22' };
    }, // 采暖水回水管
    get ACPPHS() {
        return { name: i18n.global.t('meos_control_web.heating_water_supply_pipe'), color: pipeColorConfig?.ACPPHS || '#E32F22' };
    }, // 采暖水供水管
    get ACPPKO() {
        return { name: i18n.global.t('meos_control_web.kitchen_oil_smoke_exhaust_duct'), color: pipeColorConfig?.ACPPKO || '#926900' };
    }, // 厨房排油烟管
    get ACPPOP() {
        return { name: i18n.global.t('meos_control_web.cooling_water_makeup_pipe'), color: pipeColorConfig?.ACPPOP || '#59A0CF' };
    }, // 冷却水补水管
    get ACPPOR() {
        return { name: i18n.global.t('meos_control_web.cooling_water_return_pipe'), color: pipeColorConfig?.ACPPOR || '#E06616' };
    }, //'冷却水回水管'
    get ACPPOS() {
        return { name: i18n.global.t('meos_control_web.cooling_water_supply_pipe'), color: pipeColorConfig?.ACPPOS || '#E7C82D' };
    }, // 冷却水供水管
    get ACPPRA() {
        return { name: i18n.global.t('meos_control_web.air_conditioning_return_air_duct'), color: pipeColorConfig?.ACPPRA || '#AD44B1' };
    }, // 空调回风管
    get ACPPRE() {
        return { name: i18n.global.t('meos_control_web.return_air_and_exhaust_duct'), color: pipeColorConfig?.ACPPRE || '#AD44B1' };
    }, // 回风兼排风管
    get ACPPRR() {
        return { name: i18n.global.t('meos_control_web.multi_air_handler_refrigerant_supply_return_pipe'), color: pipeColorConfig?.ACPPRR || '#063B8E' };
    }, // 多联机供回制冷剂管
    get ACPPSA() {
        return { name: i18n.global.t('meos_control_web.air_conditioning_supply_air_duct'), color: pipeColorConfig?.ACPPSA || '#063B8E' };
    }, // 空调送风管
    get ACPPVE() {
        return { name: i18n.global.t('meos_control_web.ventilation_exhaust_duct'), color: pipeColorConfig?.ACPPVE || '#A3A49E' };
    }, // 通风排风管
    get ACPPVS() {
        return { name: i18n.global.t('meos_control_web.ventilation_supply_duct'), color: pipeColorConfig?.ACPPVS || '#A3A49E' };
    }, // 通风送风管
    get FFPPAE() {
        return { name: i18n.global.t('meos_control_web.exhaust_and_fire_mechanical_smoke_exhaust_duct'), color: pipeColorConfig?.FFPPAE || '#A3A49E' };
    }, // 排风兼消防机械排烟管
    get FFPPFH() {
        return { name: i18n.global.t('meos_control_web.fire_hydrant_pipe'), color: pipeColorConfig?.FFPPFH || '#AE111E' };
    }, // 消火栓管
    get FFPPFM() {
        return { name: i18n.global.t('meos_control_web.foam_pipe'), color: pipeColorConfig?.FFPPFM || '#AE111E' };
    }, // 泡沫管
    get FFPPGE() {
        return { name: i18n.global.t('meos_control_web.gas_extinguishing_pipe'), color: pipeColorConfig?.FFPPGE || '#AE111E' };
    }, // 气体灭火管
    get FFPPMA() {
        return { name: i18n.global.t('meos_control_web.fire_air_makeup_duct'), color: pipeColorConfig?.FFPPMA || '#EF9F76' };
    }, // 消防补风管
    get FFPPME() {
        return { name: i18n.global.t('meos_control_web.fire_mechanical_smoke_exhaust_duct'), color: pipeColorConfig?.FFPPME || '#A3A49E' };
    }, // 消防机械排烟管
    get FFPPMS() {
        return { name: i18n.global.t('meos_control_web.water_spray_pipe'), color: pipeColorConfig?.FFPPMS || '#AE111E' };
    }, // 水喷雾管
    get FFPPPA() {
        return { name: i18n.global.t('meos_control_web.fire_pressurized_supply_air_duct'), color: pipeColorConfig?.FFPPPA || '#A3A49E' };
    }, // 消防加压送风管
    get FFPPSM() {
        return { name: i18n.global.t('meos_control_web.supply_air_and_fire_air_makeup_duct'), color: pipeColorConfig?.FFPPSM || '#EF9F76' };
    }, // 送风兼消防补风管
    get FFPPSR() {
        return { name: i18n.global.t('meos_control_web.sprinkler_pipe'), color: pipeColorConfig?.FFPPSR || '#AE111E' };
    }, // 喷淋管
    get FFPPTM() {
        return { name: i18n.global.t('meos_control_web.water_mist_pipe'), color: pipeColorConfig?.FFPPTM || '#AE111E' };
    }, // 细水雾管
    get FFPPWM() {
        return { name: i18n.global.t('meos_control_web.fire_monitor_pipe'), color: pipeColorConfig?.FFPPWM || '#AE111E' };
    }, // 消防炮管
    get FFPPWS() {
        return { name: i18n.global.t('meos_control_web.fire_water_supply_pipe'), color: pipeColorConfig?.FFPPWS || '#AE111E' };
    }, // 消防给水管
    get FGPPGP() {
        return { name: i18n.global.t('meos_control_web.gas_pipe'), color: pipeColorConfig?.FFPPGP || '#F7D455' };
    }, // 燃气管
    get WSPPDD() {
        return { name: i18n.global.t('meos_control_web.direct_drinking_water_supply_pipe'), color: pipeColorConfig?.WSPPDD || '#93DB49' };
    }, // 直饮水给水管
    get WSPPDW() {
        return { name: i18n.global.t('meos_control_web.domestic_water_supply_pipe'), color: pipeColorConfig?.WSPPDW || '#A3A49E' };
    }, // 生活用水给水管
    get WSPPHW() {
        return { name: i18n.global.t('meos_control_web.domestic_hot_water_supply_pipe'), color: pipeColorConfig?.WSPPHW || '#A3A49E' };
    }, // 生活热水给水管
    get WSPPRN() {
        return { name: i18n.global.t('meos_control_web.rainwater_pipe'), color: pipeColorConfig?.WSPPRN || '#58554C' };
    }, // 雨水管
    get WSPPRW() {
        return { name: i18n.global.t('meos_control_web.reclaimed_water_supply_pipe'), color: pipeColorConfig?.WSPPRW || '#A9671E' };
    }, // 中水给水管
    get WSPPSW() {
        return { name: i18n.global.t('meos_control_web.sewage_pipe'), color: pipeColorConfig?.WSPPSW || '#58554C' };
    },
    get WSPPWW() {
        return { name: i18n.global.t('meos_control_web.wastewater_pipe'), color: pipeColorConfig?.WSPPWW || '#404040' };
    },
    // ADD
    get WSPPPW() {
        return { name: i18n.global.t('meos_control_web.pure_water_pipe'), color: pipeColorConfig?.WSPPPW || '#A3A49E' };
    },
    get WSPPWP() {
        return { name: i18n.global.t('meos_control_web.pure_water_waste_pipe'), color: pipeColorConfig?.WSPPWP || '#A3A49E' };
    },
    get WSPPWD() {
        return { name: i18n.global.t('meos_control_web.pure_water_liquid_chemical_dosing_pipe'), color: pipeColorConfig?.WSPPWD || '#A3A49E' };
    },
    get WSPPNG() {
        return { name: i18n.global.t('meos_control_web.nitrogen_pipe'), color: pipeColorConfig?.WSPPNG || '#A3A49E' };
    },
    get ACPPET() {
        return { name: i18n.global.t('meos_control_web.waste_gas_emission_pipe'), color: pipeColorConfig?.WSPPET || '#404040' };
    },

    get TPPPAS() {
        return { name: i18n.global.t('meos_control_web.compressed_air_pipe'), color: pipeColorConfig?.TPPPAS || '#A3A49E' };
    },
    get CHPPST() {
        return { name: i18n.global.t('meos_control_web.steam_heating_pipe'), color: pipeColorConfig?.CHPPST || '#AE111E' };
    },
    get CHPPCD() {
        return { name: i18n.global.t('meos_control_web.steam_heating_condensate_pipe'), color: pipeColorConfig?.CHPPCD || '#00713F' };
    }
};

const defaultPipesClassCodeToNameColorMap = {
    get SE() {
        return { name: i18n.global.t('meos_control_web.high_voltage_pipe'), color: pipeColorConfig?.SE || '#4CC5E1' };
    }, //强电专业管
    get AC() {
        return { name: i18n.global.t('meos_control_web.air_conditioning_pipe'), color: pipeColorConfig?.AC || '#82DACE' };
    }, //空调专业管
    get WE() {
        return { name: i18n.global.t('meos_control_web.low_voltage_pipe'), color: pipeColorConfig?.WE || '#83C7FC' };
    }, //弱电专业管
    get EL() {
        return { name: i18n.global.t('meos_control_web.elevator_pipe'), color: pipeColorConfig?.EL || '#839AD2' };
    }, //电梯专业管
    get LT() {
        return { name: i18n.global.t('meos_control_web.lighting_pipe'), color: pipeColorConfig?.LT || '#fbe750' };
    }, //照明专业管
    get FF() {
        return { name: i18n.global.t('meos_control_web.fire_fighting_pipe'), color: pipeColorConfig?.FF || '#fa9b96' };
    }, // 消防专业管
    get SP() {
        return { name: i18n.global.t('meos_control_web.security_pipe'), color: pipeColorConfig?.SP || '#ffd873' };
    }, // 安防专业管
    get WS() {
        return { name: i18n.global.t('meos_control_web.water_supply_and_drainage_pipe'), color: pipeColorConfig?.WS || '#8DD485' };
    }, // 给排水专业管
    get FG() {
        return { name: i18n.global.t('meos_control_web.gas_pipe_1'), color: pipeColorConfig?.FG || '#E787AA' };
    }, // 燃气专业管
    get CF() {
        return { name: i18n.global.t('meos_control_web.civil_engineering_pipe'), color: pipeColorConfig?.CF || '#D0D7E3' };
    }, //土建专业管
    get OT() {
        return { name: i18n.global.t('meos_control_web.other_professional_pipe'), color: pipeColorConfig?.OT || '#15ae55' };
    } //其他专业管
};

const isPipe = classCode => {
    return typeof classCode === 'string' && classCode && classCode.slice(2, 4) === 'PP';
};

export const getPipesLegendsFromClassCode = classCode => {
    const legendItem = pipesClassCodeToNameColorMap[classCode] || defaultPipesClassCodeToNameColorMap[classCode.slice(0, 2)] || defaultPipesClassCodeToNameColorMap.OT;
    const isPipeClassCode = isPipe(classCode);
    return { legendItem, isPipeClassCode };
};

const EquipModelColor = {
    SE: '#4CC5E1',
    AC: '#82DACE',
    WE: '#83C7FC',
    EL: '#839AD2',
    LT: '#fbe750',
    FF: '#fa9b96', // 消防
    SP: '#ffd873', // 安防
    WS: '#8DD485', // 给排水
    FG: '#E787AA', // 燃气
    CF: '#D0D7E3',
    OT: '#15ae55'
};

const RevitModelColorFromClassCode = classCode => {
    let color = PipeModelColor[classCode];
    if (color) {
        return color;
    }
    const marjorId = classCode.slice(0, 2);
    color = EquipModelColor[marjorId];
    return color || defaultPipesClassCodeToNameColorMap.OT?.color || '#ffffff';
};

export { PipeModelColor, EquipModelColor, RevitModelColorFromClassCode };
