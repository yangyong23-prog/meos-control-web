import React, { useRef, useState, useEffect, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';

interface MTipsTooltipProps {
    text?: React.ReactNode;
    children?: React.ReactNode;
    content?: string;
    className?: string;
    wrapperClassName?: string;
    maxLines?: number;
    alwaysShowTooltip?: boolean;
    position?: 'top' | 'bottom'; // 新增位置参数
}

export const MTipsTooltip: React.FC<MTipsTooltipProps> = ({
    text,
    children,
    content,
    className = '',
    wrapperClassName = 'min-w-0 flex-1',
    maxLines = 1,
    alwaysShowTooltip = false,
    position = 'top'
}) => {
    const [isTruncated, setIsTruncated] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false);
    const [coords, setCoords] = useState({ top: 0, left: 0 });
    const textRef = useRef<HTMLDivElement>(null);

    const displayContent = text !== undefined ? text : children;

    const checkTruncation = () => {
        const el = textRef.current;
        if (!el) return;

        // Slight buffer (1px) for sub-pixel rendering differences
        if (maxLines > 1) {
            setIsTruncated(el.scrollHeight > el.clientHeight + 0.5);
        } else {
            setIsTruncated(el.scrollWidth > el.clientWidth + 0.5);
        }
    };

    useLayoutEffect(() => {
        checkTruncation();
    }, [displayContent, maxLines, className]);

    useEffect(() => {
        const el = textRef.current;
        if (!el) return;

        const observer = new ResizeObserver(checkTruncation);
        observer.observe(el);

        window.addEventListener('resize', checkTruncation);
        return () => {
            observer.disconnect();
            window.removeEventListener('resize', checkTruncation);
        };
    }, []);

    const handleMouseEnter = () => {
        checkTruncation(); // Double check on hover
        if ((alwaysShowTooltip || isTruncated) && textRef.current) {
            const rect = textRef.current.getBoundingClientRect();
            const viewportWidth = window.innerWidth;
            const tooltipWidth = 300; // max-w-[300px]

            let leftPosition = rect.left + rect.width / 2;

            // 小屏幕下防止超出右边界
            const tooltipRightEdge = leftPosition + tooltipWidth / 2;
            if (tooltipRightEdge > viewportWidth) {
                leftPosition = viewportWidth - tooltipWidth / 2;
            }

            // 防止超出左边界
            const tooltipLeftEdge = leftPosition - tooltipWidth / 2;
            if (tooltipLeftEdge < 0) {
                leftPosition = tooltipWidth / 2;
            }

            setCoords({
                top: rect.top, // Viewport relative
                left: leftPosition
            });
            setShowTooltip(true);
        }
    };

    // 提取 React 元素中的文本内容
    const extractText = (node: React.ReactNode): string => {
        if (typeof node === 'string' || typeof node === 'number') return String(node);
        if (!node) return '';
        if (Array.isArray(node)) return node.map(extractText).join('');
        if (typeof node === 'object' && 'props' in node) {
            const maybeNode = node as any;
            if (maybeNode?.props?.children) {
                return extractText(maybeNode.props.children);
            }
        }
        return '';
    };

    const tooltipText = content || extractText(displayContent);

    return (
        <div className={`relative group ${wrapperClassName}`} onMouseEnter={handleMouseEnter} onMouseLeave={() => setShowTooltip(false)}>
            <div
                ref={textRef}
                className={`${className} ${maxLines > 1 ? 'line-clamp-' + maxLines : 'truncate'}`}
                style={maxLines > 1 ? { display: '-webkit-box', WebkitLineClamp: maxLines, WebkitBoxOrient: 'vertical', overflow: 'hidden' } : { width: '100%' }}
            >
                {displayContent}
            </div>

            {showTooltip &&
                (alwaysShowTooltip || isTruncated) &&
                tooltipText &&
                createPortal(
                    <div
                        className="fixed z-[9999] w-max max-w-[300px] pointer-events-none"
                        style={{
                            top: position === 'top' ? coords.top - 8 : coords.top + 8,
                            left: coords.left,
                            transform: position === 'top' ? 'translate(-50%, -100%)' : 'translate(-50%, 50%)'
                        }}
                    >
                        <div className="bg-[rgba(27,33,41,0.8)] flex items-start px-[12px] py-[8px] relative rounded-[4px] shadow-lg backdrop-blur-[2px]">
                            <div aria-hidden="true" className="absolute border border-[#e0e4eb]/20 border-solid inset-0 pointer-events-none rounded-[4px]" />
                            <p className="flex-[1_0_0] font-['Microsoft_YaHei_UI',sans-serif] leading-[22px] min-h-px min-w-px not-italic relative text-[14px] text-white break-words whitespace-pre-wrap text-left">
                                {tooltipText}
                            </p>
                        </div>
                    </div>,
                    document.body
                )}
        </div>
    );
};
