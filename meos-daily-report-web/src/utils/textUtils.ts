/**
 * 使用 Canvas API 精确测量文本宽度
 * @param text 要测量的文本
 * @param fontSize 字体大小
 * @param fontWeight 字体粗细，默认 bold
 * @param fontFamily 字体族，默认 sans-serif
 * @returns 文本宽度（像素）
 */
export const measureTextWidth = (text: string, fontSize: number, fontWeight = 'bold', fontFamily = 'sans-serif'): number => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) return text.length * fontSize * 0.6;
    context.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
    return context.measureText(text).width;
};
