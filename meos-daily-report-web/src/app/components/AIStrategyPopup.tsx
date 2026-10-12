import React, { useEffect } from "react";
import { X } from "lucide-react";
import { createPortal } from "react-dom";

interface AIStrategyPopupProps {
  onClose: () => void;
}

const TIMES = [
  "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", 
  "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00"
];

// Data structure: each row has a label and an array of values corresponding to TIMES
const STRATEGY_DATA = [
  {
    label: "冷站系统开关",
    values: [
      "开启", "开启", "开启", "开启", "开启", "开启", "开启", 
      "开启", "开启", "开启", "开启", "开启", "开启", "关闭", "关闭"
    ]
  },
  {
    label: "冷机台数",
    values: [
      "3台", "3台", "3台", "2台", "2台", "2台", "2台", 
      "3台", "3台", "3台", "3台", "2台", "2台", "2台", "2台"
    ]
  },
  {
    label: "冷机出水温度",
    values: [
      "3℃", "3℃", "3℃", "3℃", "3℃", "2℃", "2℃", 
      "2℃", "2℃", "2℃", "2℃", "2℃", "2℃", "2℃", "2℃"
    ]
  }
];

export const AIStrategyPopup: React.FC<AIStrategyPopupProps> = ({ onClose }) => {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return createPortal(
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-[2px]">
      <div className="bg-white rounded-[4px] shadow-lg w-[1260px] max-w-[95vw] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="h-[56px] shrink-0 border-b border-[#E8ECF0] flex items-center justify-between px-[24px] bg-white">
          <h2 className="text-[16px] font-bold text-[#2E3742] font-['Microsoft_YaHei_UI:Bold',sans-serif]">AI策略</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded transition-colors cursor-pointer">
            <X size={20} className="text-[#8B949E]" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-x-auto p-[24px]">
          <div className="border border-[#E1E5EB] rounded-[4px] overflow-hidden bg-white">
             <div className="flex flex-col w-full">
               {/* Table Header */}
               <div className="flex bg-[#F1F4F6] border-b border-[#E1E5EB] w-full">
                 {/* Sticky First Column Header */}
                 <div className="flex-none w-[208px] h-[40px] px-[16px] flex items-center bg-[#F1F4F6] border-r border-[#E1E5EB] font-['Microsoft_YaHei_UI',sans-serif] text-[12px] text-[#626C78]">
                   策略项
                 </div>
                 {/* Time Headers */}
                 {TIMES.map((time, index) => (
                   <div key={time} className="flex-1 min-w-[60px] h-[40px] px-[16px] flex items-center border-r border-[#E1E5EB] last:border-r-0 font-['Microsoft_YaHei_UI',sans-serif] text-[12px] text-[#626C78]">
                     {time}
                   </div>
                 ))}
               </div>

               {/* Table Body */}
               {STRATEGY_DATA.map((row, rowIndex) => (
                 <div key={row.label} className="flex border-b border-[#E1E5EB] last:border-b-0 w-full">
                   {/* Sticky First Column Label */}
                   <div className="flex-none w-[208px] h-[40px] px-[16px] flex items-center bg-white border-r border-[#E1E5EB] font-['Microsoft_YaHei_UI:Regular',sans-serif] text-[14px] text-[#1B2129]">
                     {row.label}
                   </div>
                   
                   {/* Value Cells */}
                   {row.values.map((value, colIndex) => {
                     const prevValue = colIndex > 0 ? row.values[colIndex - 1] : null;
                     const isChanged = colIndex > 0 && value !== prevValue;
                     const isFirst = colIndex === 0;
                     
                     let cellClass = "bg-white text-[#C4C9CF]"; // Default: Unchanged (Lighter Gray)
                     if (isFirst) {
                        cellClass = "bg-white text-[#1B2129]";
                     } else if (isChanged) {
                        cellClass = "bg-[#E8ECF0] text-[#1B2129]";
                     }
                     
                     return (
                       <div 
                         key={colIndex} 
                         className={`
                           flex-1 min-w-[60px] h-[40px] px-[16px] flex items-center border-r border-[#E1E5EB] last:border-r-0 text-[14px] truncate
                           ${cellClass}
                         `}
                         title={value}
                       >
                         <span className="truncate w-full font-['Microsoft_YaHei_UI',sans-serif]">
                            {value}
                         </span>
                       </div>
                     );
                   })}
                 </div>
               ))}
             </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
