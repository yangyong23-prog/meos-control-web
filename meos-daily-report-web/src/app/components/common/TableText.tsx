import React, { useRef, useState, useEffect, useLayoutEffect } from "react";
import { createPortal } from "react-dom";

interface TableTextProps {
  text?: React.ReactNode;
  children?: React.ReactNode;
  content?: string; // Optional override for tooltip content
  className?: string; // Classes for the text element
  wrapperClassName?: string; // Classes for the wrapper div
  maxLines?: number;
  tooltipOffsetX?: number;
}

export const TableText: React.FC<TableTextProps> = ({ 
  text,
  children,
  content, 
  className = "", 
  wrapperClassName = "min-w-0 flex-1", 
  maxLines = 2,
  tooltipOffsetX = 0
}) => {
  const [isTruncated, setIsTruncated] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const textRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  // Support both text prop and children
  const displayContent = text !== undefined ? text : children;
  const tooltipText = content || (typeof displayContent === 'string' || typeof displayContent === 'number' ? String(displayContent) : "");

  const checkTruncation = () => {
    const el = textRef.current;
    if (!el) return;
    
    // Slight buffer (0.5px) for sub-pixel rendering differences
    if (maxLines > 1) {
      // For multiline, check if scrollHeight is greater than clientHeight
      setIsTruncated(el.scrollHeight > el.clientHeight + 0.5);
    } else {
      // For single line, check if scrollWidth is greater than clientWidth
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
    checkTruncation();
    if (isTruncated && textRef.current) {
      const rect = textRef.current.getBoundingClientRect();
      const viewportWidth = document.documentElement.clientWidth || window.innerWidth;
      const tooltipMaxWidth = Math.min(300, Math.max(120, viewportWidth - 24));
      const viewportPadding = 12;
      const halfTooltipWidth = tooltipMaxWidth / 2;
      const proposedLeft = rect.left + rect.width / 2 + tooltipOffsetX;
      const clampedLeft = Math.max(
        viewportPadding + halfTooltipWidth + 2,
        Math.min(viewportWidth - viewportPadding - halfTooltipWidth - 2, proposedLeft)
      );
      setCoords({
        top: rect.top,
        left: clampedLeft
      });
      setShowTooltip(true);
    }
  };

  useLayoutEffect(() => {
    if (!showTooltip || !tooltipRef.current) return;
    const viewportWidth = document.documentElement.clientWidth || window.innerWidth;
    const viewportPadding = 12;
    const rect = tooltipRef.current.getBoundingClientRect();
    const overflowRight = rect.right - (viewportWidth - viewportPadding);
    const overflowLeft = viewportPadding - rect.left;
    if (overflowRight > 0.5) {
      setCoords(prev => ({ ...prev, left: prev.left - overflowRight - 2 }));
      return;
    }
    if (overflowLeft > 0.5) {
      setCoords(prev => ({ ...prev, left: prev.left + overflowLeft + 2 }));
    }
  }, [showTooltip, tooltipText, coords.left]);

  return (
    <div 
      className={`relative group ${wrapperClassName}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div
        ref={textRef}
        className={`${className} ${maxLines > 1 ? 'line-clamp-' + maxLines : 'truncate'}`}
        style={maxLines > 1 ? { display: '-webkit-box', WebkitLineClamp: maxLines, WebkitBoxOrient: 'vertical', overflow: 'hidden' } : {}}
      >
        {displayContent}
      </div>
      
      {showTooltip && isTruncated && tooltipText && createPortal(
        <div 
          ref={tooltipRef}
          className="fixed z-[9999] w-max max-w-[300px] pointer-events-none"
          style={{
            top: coords.top - 8,
            left: coords.left,
            transform: 'translate(-50%, -100%)'
          }}
        >
          {/* MTips Style Implementation */}
          <div className="bg-[rgba(27,33,41,0.8)] backdrop-blur-[2px] flex items-start px-[12px] py-[8px] relative rounded-[4px] shadow-xl">
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
