<template>
    <div class="empty-box">
        <div class="img">
            {{
                i18n.global.t('meos_control_web.no_config_exist', {
                    equip: getMessage(type)
                })
            }}
        </div>
    </div>
</template>
<script lang="ts" setup>
/**
 * 壳配置空状态组件
 * 根据 type prop 展示"当前项目未交付XXX，请先完成交付后进行配置"提示文案
 *
 * type 枚举值分类：
 *   中央空调系统 — ACAC（供冷全系统）、ACAH（供热全系统）、ACAI（冷热源全系统）、ACCAIR（供冷全系统，与 ACAC 重复）
 *   基础冷热源系统 — ACCC（供冷）、ACCH（供热）、ACCI（冷热源）
 *   泵组/控制组 — ACCPC（冷冻水泵）、ACOPC（冷却水泵）、ACOTC（冷却塔）、ACCGP（乙二醇泵）、ACCST（蓄冷热槽）、ACHPC（供热水泵）、ACPPC（冷热共用水泵）、GROUP（泵组通用）
 */
// @ts-ignore
import i18n from '@/localization';

defineProps({
    type: {
        type: String,
        default: ''
    }
});

/**
 * type 映射到对应的设备/系统名称 i18n 文案
 * @todo ACAC 与 ACCCAIR 指向同一文案，建议统一键名
 */
const messages: Record<string, string> = {
    // ---- 中央空调系统 ----
    ACAC: i18n.global.t('meos_control_web.central_hvac_cooling_full_system'), // 中央空调供冷全系统
    ACAH: i18n.global.t('meos_control_web.central_hvac_heating_system'), // 中央空调供热全系统
    ACAI: i18n.global.t('meos_control_web.central_hvac_cold_hot_source_system'), // 中央空调冷热源全系统
    ACCCAIR: i18n.global.t('meos_control_web.central_hvac_cooling_full_system'), // 与 ACAC 重复，中央空调供冷全系统

    // ---- 基础冷热源系统 ----
    ACCC: i18n.global.t('meos_control_web.central_cooling_system'), // 中央供冷系统
    ACCH: i18n.global.t('meos_control_web.central_heating_system'), // 中央供热系统
    ACCI: i18n.global.t('meos_control_web.central_heat_cool_source_system'), // 中央冷热源系统

    // ---- 泵组 / 控制组（供冷侧） ----
    ACCPC: i18n.global.t('meos_control_web.cool_pump_group'), // 冷冻水泵控制组
    ACOPC: i18n.global.t('meos_control_web.chil_pump_group'), // 冷却水泵控制组
    ACOTC: i18n.global.t('meos_control_web.cool_tower_group'), // 冷却塔控制组
    ACCGP: i18n.global.t('meos_control_web.cgly_pump_group'), // 供冷乙二醇泵控制组
    ACCST: i18n.global.t('meos_control_web.cool_hslo_group'), // 蓄冷热槽控制组

    // ---- 泵组 / 控制组（供热侧） ----
    ACHPC: i18n.global.t('meos_control_web.hot_pump_group'), // 供热水泵控制组

    // ---- 泵组 / 控制组（双工况/通用） ----
    ACPPC: i18n.global.t('meos_control_web.cool_hot_pump'), // 冷热共用水泵控制组
    GROUP: i18n.global.t('meos_control_web.pump_group'), // 泵组（通用/兜底）
    CONTROL_GROUP: i18n.global.t('meos_control_web.control_team') // 控制组
};

/**
 * 根据 type 返回对应的 i18n 文案
 * @param type - 设备/系统类型编码
 * @returns 对应的设备/系统名称，未匹配时返回空字符串
 */
const getMessage = (type: string) => {
    if (!Object.prototype.hasOwnProperty.call(messages, type)) {
        return '';
    }
    return messages[type as keyof typeof messages];
};
</script>
<style scoped lang="less">
.empty-box {
    position: relative;
    height: 277px;
    .img {
        width: 100%;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        color: var(--gray-600, #626c78);
        text-align: center;
        font-family: Microsoft YaHei UI;
        font-size: 14px;
        font-style: normal;
        font-weight: var(--platform-font-weight);
        line-height: 22px;
    }
}
</style>
