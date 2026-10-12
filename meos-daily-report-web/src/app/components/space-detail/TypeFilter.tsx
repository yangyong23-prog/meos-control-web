import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

const OPTIONS = ["全部", "过冷", "持续偏冷", "持续偏热", "过热"];

export const TypeFilter = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState("全部");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      <div 
        className="flex items-center gap-2 cursor-pointer select-none group"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-sm text-[#626C78]">类型：</span>
        <div className="flex items-center gap-1">
          <span className="text-sm font-medium text-[#1B2129]">{selected}</span>
          <ChevronDown 
            size={12} 
            className={`text-[#8B949E] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
          />
        </div>
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-[120px] bg-white rounded-lg shadow-xl border border-[#E8ECF0] py-1 z-50">
          {OPTIONS.map((opt) => (
            <div
              key={opt}
              className={`px-3 py-2 text-sm cursor-pointer flex items-center justify-between
                ${selected === opt ? 'bg-[#EBF3FF] text-[#2481F2]' : 'text-[#1B2129] hover:bg-[#F5F7FA]'}
              `}
              onClick={() => {
                setSelected(opt);
                setIsOpen(false);
              }}
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
