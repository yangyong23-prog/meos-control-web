import i18n from '@/localization';
// eslint-disable-next-line import/extensions
import loadingGif from '@/assets/gif/loading.gif';

export interface AppLoadingOptions {
    target: string | HTMLElement;
    text?: string;
    size?: number;
    showText?: boolean;
    /** 遮罩背景色，默认白底 rgba(255,255,255,1) */
    background?: string;
    /** 图标类型，默认 'gif'：gif = loading.gif 动图；circle = 缺口圆环 SVG 旋转动画（与 meri element-loading-lottiename="circle" 视觉一致） */
    icon?: 'gif' | 'circle';
}

export interface AppLoadingInstance {
    destroy: () => void;
}

const SPIN_STYLE_ID = 'app-loading-spin-style';
let spinStyleInjected = false;

/** 幂等注入缺口圆环旋转动画所需 keyframes（service 为纯 DOM 创建，无 scoped 样式可依赖） */
const ensureSpinStyle = () => {
    if (spinStyleInjected || typeof document === 'undefined') return;
    spinStyleInjected = true;
    let style = document.getElementById(SPIN_STYLE_ID) as HTMLStyleElement | null;
    if (!style) {
        style = document.createElement('style');
        style.id = SPIN_STYLE_ID;
        style.textContent =
            '@keyframes app-loading-rotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } } .app-loading__spin { animation: app-loading-rotate 1s linear infinite; }';
        document.head.appendChild(style);
    }
};

/** 创建缺口圆环 SVG（复刻 src/assets/images/common/circle_loading.svg，缺口随旋转形成环绕效果） */
const createCircleSvg = (size: number) => {
    const ns = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('width', `${size}px`);
    svg.setAttribute('height', `${size}px`);
    svg.setAttribute('viewBox', '0 0 16 16');
    svg.setAttribute('fill', 'none');
    svg.classList.add('app-loading__spin');
    const path = document.createElementNS(ns, 'path');
    path.setAttribute('d', 'M15 8C15 11.866 11.866 15 8 15C4.13401 15 1 11.866 1 8C1 4.13401 4.13401 1 8 1');
    path.setAttribute('stroke', '#626C78');
    svg.appendChild(path);
    return svg;
};

/**
 * 基于 GIF/SVG 的纯 DOM loading service，作为 meri-plus MLoading 的替代。
 * 不经过 Vue 组件/响应式，destroy 时直接移除 DOM，彻底避免 Vue effect 泄漏。
 */
export const AppLoadingService = {
    service(options: AppLoadingOptions): AppLoadingInstance {
        const target = (typeof options.target === 'string' ? document.querySelector(options.target) : options.target) as HTMLElement | null;
        const wrap = document.createElement('div');
        wrap.className = 'app-loading-container';
        Object.assign(wrap.style, {
            position: target ? 'absolute' : 'fixed',
            inset: '0',
            zIndex: '10',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: options.background ?? 'rgba(255, 255, 255, 1)'
        });

        const box = document.createElement('div');
        box.className = 'app-loading-box';
        box.style.cssText = 'display:inline-flex;flex-direction:column;align-items:center;justify-content:center; pointer-events:none;';

        const size = options.size ?? 100;
        if (options.icon === 'circle') {
            ensureSpinStyle();
            box.appendChild(createCircleSvg(size));
        } else {
            const img = document.createElement('img');
            img.src = loadingGif;
            img.style.width = `${size}px`;
            img.style.height = `${size}px`;
            box.appendChild(img);
        }

        if (options.showText !== false) {
            const span = document.createElement('span');
            span.className = 'app-loading__text';
            span.textContent = options.text || i18n.global.t('common.loading');
            span.style.cssText = 'font-size:14px;font-weight:500;white-space:nowrap;';
            box.appendChild(span);
        }

        wrap.appendChild(box);

        if (target) {
            if (window.getComputedStyle(target).position === 'static') {
                target.style.position = 'relative';
            }
            target.appendChild(wrap);
        } else {
            document.body.appendChild(wrap);
        }

        return {
            destroy: () => {
                wrap.remove();
            }
        };
    }
};
