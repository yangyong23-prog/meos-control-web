/* eslint-disable one-var */
/* eslint-disable no-param-reassign */
// 将十六进制颜色转换为RGB
export const hexToRgb = hex => {
    let bigint = parseInt(hex.slice(1), 16),
        r = (bigint >> 16) & 255,
        g = (bigint >> 8) & 255,
        b = bigint & 255;

    return { r, g, b };
};

// 将RGB转换回十六进制
export const rgbToHex = (r, g, b) => {
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
};

// 加深颜色的函数（减少RGB值）
export const darkenColor = (hex, amount) => {
    let { r, g, b } = hexToRgb(hex);

    r = Math.max(0, r - amount);
    g = Math.max(0, g - amount);
    b = Math.max(0, b - amount);

    return rgbToHex(r, g, b);
};

// RGB 转 HSL
export const rgbToHsl = (r, g, b) => {
    r /= 255;
    g /= 255;
    b /= 255;
    let max = Math.max(r, g, b),
        min = Math.min(r, g, b),
        h,
        s,
        l = (max + min) / 2;

    if (max === min) {
        h = s = 0; // 无色
    } else {
        let d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;
            case g:
                h = (b - r) / d + 2;
                break;
            case b:
                h = (r - g) / d + 4;
                break;
            default:
                break;
        }
        h /= 6;
    }

    return { h, s, l };
};

// HSL 转 RGB
export const hslToRgb = (h, s, l) => {
    let r, g, b;

    if (s === 0) {
        r = g = b = l; // 无色
    } else {
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };

        let q = l < 0.5 ? l * (1 + s) : l + s - l * s,
            p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }

    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
    };
};

// 增加饱和度
export const increaseSaturation = (hex, amount) => {
    let { r, g, b } = hexToRgb(hex),
        { h, s, l } = rgbToHsl(r, g, b);

    // 增加饱和度，确保值不超过1
    s = Math.min(1, s + amount / 100);

    // eslint-disable-next-line one-var
    let newRgb = hslToRgb(h, s, l);
    return rgbToHex(newRgb.r, newRgb.g, newRgb.b);
};

// 改吧颜色变深
export const changeColorDark = (hex, amount, amountSaturation) => {
    // 先变深
    let { r, g, b } = hexToRgb(hex);

    r = Math.max(0, r - amount);
    g = Math.max(0, g - amount);
    b = Math.max(0, b - amount);

    let { h, s, l } = rgbToHsl(r, g, b);
    // console.log('h, s, l: ', h, s, l);
    if (l > 0.83) {
        return rgbToHex(r, g, b);
    }

    // 增加饱和度，确保值不超过1
    s = Math.min(1, s + amountSaturation / 100);

    // eslint-disable-next-line one-var
    let newRgb = hslToRgb(h, s, l);
    return rgbToHex(newRgb.r, newRgb.g, newRgb.b);
};

export const blendWithWhite = (hex, blendHex, alpha) => {
    // 将颜色转换为RGBA格式
    // let r = parseInt(color.substring(1, 3), 16);
    // let g = parseInt(color.substring(3, 5), 16);
    // let b = parseInt(color.substring(5, 7), 16);
    let { r, g, b } = hexToRgb(hex);
    let blendRgb = hexToRgb(blendHex);

    // 计算混合后的颜色
    let blendedR = r + Math.abs(blendRgb.r - r) * alpha;
    let blendedG = g + Math.abs(blendRgb.g - g) * alpha;
    let blendedB = b + Math.abs(blendRgb.b - b) * alpha;

    // 返回结果
    return rgbToHex(Math.round(blendedR), Math.round(blendedG), Math.round(blendedB));
};
export const overlayColor = (foreground, background, alpha) => {
    // 将颜色转换为RGB
    const rgbForeground = hexToRgb(foreground);
    const rgbBackground = hexToRgb(background);

    // 应用透明度
    return rgbToHex(
        Math.floor((1 - alpha) * rgbBackground.r + alpha * rgbForeground.r),
        Math.floor((1 - alpha) * rgbBackground.g + alpha * rgbForeground.g),
        Math.floor((1 - alpha) * rgbBackground.b + alpha * rgbForeground.b)
    );
};
