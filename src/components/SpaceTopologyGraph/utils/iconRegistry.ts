/**
 * 图标 URL 注册表
 *
 * 通过 import.meta.glob + ?url 收集 PNG 路径映射为 URL 字符串，
 * 避免模板字符串在生产构建中路径解析错误的问题。
 */

/** 有独立图标文件的编码 */
export const AVAILABLE_ICON_CODES = new Set([
    'ACAHG',
    'ACVVER',
    'ACATDH',
    'ACATAH',
    'ACATFC',
    'ACVRVI',
    'ACCCWP',
    'ACATFA',
    'ACATVA',
    'ACATFU',
    'ACATRA',
    'ACVTAC',
    'ACVTSF',
    'FFSCAF',
    'CFCSEW',
    'ACATHT'
]);

/** 图标别名映射：使用其他编码的图标 */
const ICON_ALIAS_MAP: Record<string, string> = {
    ACVVEA: 'ACVVER'
};

/** 收集 PNG 路径映射: classCode → URL 字符串 */
const iconModules = import.meta.glob('/src/assets/images/SpaceTopologyGraph/card_icon_*.png', {
    eager: true,
    query: '?url'
}) as Record<string, { default: string }>;

const iconUrlMap: Record<string, string> = {};
Object.entries(iconModules).forEach(([path, mod]) => {
    const match = path.match(/card_icon_([A-Z0-9]+)\.png$/);
    if (match) iconUrlMap[match[1]] = mod.default;
});

/**
 * 根据 classCode 获取 PNG 图标 URL
 * @param classCode 设备类编码
 * @returns 图片 URL，无对应编码时返回 undefined
 */
export function getIconUrl(classCode?: string): string | undefined {
    if (!classCode) return undefined;
    // 先查别名
    const alias = ICON_ALIAS_MAP[classCode];
    if (alias) return iconUrlMap[alias];
    // 再查独立图标
    if (AVAILABLE_ICON_CODES.has(classCode)) return iconUrlMap[classCode];
    return undefined;
}
