import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceDot, LabelList } from "recharts";
import { X } from "lucide-react";
import { createPortal } from "react-dom";
import { isNil } from "lodash";
import { measureTextWidth } from "../../utils/textUtils";

// --- Types & Data ---

type MetricType = 'system_eer' | 'chiller_cop' | 'chilled_water_coeff' | 'cooling_water_coeff' | 'heat_dissipation_coeff' | 'heat_imbalance';

interface MetricConfig {
  id: string;
  label: string;
  value: string;
  unit?: string;
  status: 'excellent' | 'good' | 'general' | 'bad';
  statusLabel: string;
  trend: number[];
  stops: number[]; // [min, limit1, limit2, limit3, max]
}

const METRICS: MetricConfig[] = [
  { 
    id: 'system_eer', 
    label: '系统EER', 
    value: '3.5', 
    status: 'good', 
    statusLabel: '良好',
    trend: [2.3, 3.8, 3.0, 4.1, 2.7, 4.2, 3.5],
    stops: [0, 2.5, 3.5, 4, 6]
  },
  { 
    id: 'chiller_cop', 
    label: '冷机组COP', 
    value: '3.2', 
    status: 'bad', 
    statusLabel: '需改善',
    trend: [3.0, 3.1, 3.2, 3.0, 2.9, 3.1, 3.2],
    stops: [0, 3.6, 5.5, 6.5, 8]
  },
  { 
    id: 'chilled_water_coeff', 
    label: '冷冻水输配系数', 
    value: '24', 
    status: 'general', 
    statusLabel: '一般',
    trend: [22, 23, 25, 24, 23, 25, 24],
    stops: [0, 22, 40, 45, 60]
  },
  { 
    id: 'cooling_water_coeff', 
    label: '冷却水输配系数', 
    value: '56', 
    status: 'excellent', 
    statusLabel: '优秀',
    trend: [50, 52, 55, 54, 56, 55, 56],
    stops: [0, 30, 45, 55, 75] 
  },
  { 
    id: 'heat_dissipation_coeff', 
    label: '冷却塔散热系数', 
    value: '56', 
    status: 'excellent', 
    statusLabel: '优秀',
    trend: [54, 55, 56, 55, 54, 56, 56],
    stops: [0, 30, 45, 55, 75]
  },
  { 
    id: 'heat_imbalance', 
    label: '热不平衡率', 
    value: '12.2%', 
    status: 'good', 
    statusLabel: '良好',
    trend: [10.5, 11.0, 11.5, 12.0, 11.8, 12.5, 12.2],
    stops: [0, 5, 10, 15, 25]
  },
];

const DATES = ['08.21', '08.22', '08.23', '08.24', '08.25', '08.26', '08.27 ( 报告日 )'];

const STATUS_STYLES = {
  excellent: { bg: 'bg-[#daf7e1]', text: 'text-[#0c9b4a]' },
  good: { bg: 'bg-[#d9ebff]', text: 'text-[#1b4acc]' },
  general: { bg: 'bg-[#fff0cc]', text: 'text-[#e68600]' },
  bad: { bg: 'bg-[#ffe6e5]', text: 'text-[#d72824]' },
};

// --- Components ---

const RulerBar: React.FC<{ metric: MetricConfig }> = ({ metric }) => {
  const stops = metric.stops;
  const min = stops[0];
  const max = stops[stops.length - 1];
  const totalRange = max - min;
  

  // Parse value (remove '%')
  const numVal =  metric.value; // parseFloat(metric?.value?.replace('%', ''));
  const percent = ((numVal - min) / totalRange) * 100;
  
  // alg_air_cooling_eff_sysc 冷站EER
  // alg_air_cooling_eff_chic 冷机组COP
  // alg_air_cooling_eff_wtfch 冷冻水输配系数
  // alg_air_cooling_eff_wtfc 冷却水输配系数
  // alg_air_cooling_eff_cthf 冷却塔散热系数
  // alg_air_cooling_eff_tubr 热不平衡率

  const getSegments = () => {
    if (metric.id === 'alg_air_cooling_eff_tubr') {
      return [
        { range: stops[1] - stops[0], color: 'bg-[#F85E5E]', label: '需改善' },
        { range: stops[2] - stops[1], color: 'bg-[#5DADFF]', label: '良好' },
        { range: stops[3] - stops[2], color: 'bg-[#55D485]', label: '优秀' },
        { range: stops[4] - stops[3], color: 'bg-[#5DADFF]', label: '良好' },,
        { range: stops[5] - stops[4], color: 'bg-[#F85E5E]', label: '需改善' },
      ];
    }
    return [
      { range: stops[1] - stops[0], color: 'bg-[#F85E5E]', label: '需改善' },
      { range: stops[2] - stops[1], color: 'bg-[#FFD15C]', label: '一般' },
      { range: stops[3] - stops[2], color: 'bg-[#5DADFF]', label: '良好' },
      { range: stops[4] - stops[3], color: 'bg-[#55D485]', label: '优秀' },
    ];
  };
  
  return (
    <div className="bg-[#F7F9FA] p-4 rounded-[4px]">
      {/* Header */}
      <div className="flex items-center text-[14px] mb-1">
         <span className="font-bold text-[#2e3742] mr-1">{metric.label}</span>
         <span className="text-[#626c78]">（当前值:{metric.value ?? '--'}）</span>
      </div>

      {/* Ruler Container - Mimicking Frame6 Layout */}
      <div className="relative h-[50px]"> 
        {/* Labels Row - Top */}
        <div className="absolute top-[24px] w-full flex text-[14px] text-[#626c78]">
           {getSegments().map((seg, i) => (
              <div key={i} style={{ width: `${(seg.range / totalRange) * 100}%` }} className="text-center relative">
                 <span className="absolute bottom-1 left-1/2 -translate-x-1/2 whitespace-nowrap">{seg.label}</span>
              </div>
           ))}
        </div>

        {/* Bar - Middle */}
        <div className="absolute top-[28px] w-full h-[8px] rounded-[4px] overflow-hidden flex z-10">
           {getSegments().map((seg, i) => (
              <div key={i} style={{ width: `${(seg.range / totalRange) * 100}%` }} className={`${seg.color} border-r border-white last:border-0 h-full`} />
           ))}
        </div>
        
        {/* Ticks - Bottom */}
        <div className="absolute top-[40px] w-full h-[20px] text-[14px] text-[#626c78]">
           {stops.map((stop, i) => (
             <span key={i} className="absolute transform -translate-x-1/2" style={{ left: `${((stop - min) / totalRange) * 100}%` }}>
               {stop}
             </span>
           ))}
        </div>
        
        {/* Pointer */}
        {
          !isNil(metric.value) &&
          (<div 
             className="absolute top-[22px] z-20 transform -translate-x-1/2 flex flex-col items-center pointer-events-none transition-all duration-500"
             style={{ left: `${Math.min(Math.max(percent, 0), 100)}%` }}
          >
             {/* Marker: Blue vertical rectangle + Triangle */}
             <div className="w-[12px] h-[24.5px] relative">
                <svg className="block w-full h-full" viewBox="0 0 12 25" fill="none">
                   <path d="M0 2C0 0.895431 0.895431 0 2 0H10C11.1046 0 12 0.895431 12 2V16L6 24.5L0 16V2Z" fill="#246FE5" stroke="white" strokeWidth="1.5"/>
                </svg>
             </div>
            </div>)
        }
      </div>
    </div>
  );
};

const RulerPopup = ({ onClose, rulerData }: { onClose: () => void; rulerData?: MetricConfig[]; }) => {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-[8px] w-[800px] flex flex-col shadow-xl relative max-h-[90vh]" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="h-[56px] flex justify-between items-center px-[24px] py-[12px] border-b border-[#e8ecf0] shrink-0">
          <h3 className="text-[16px] font-bold text-[#626c78] font-['Microsoft_YaHei_UI:Bold',sans-serif]">报告日运行效率标尺</h3>
          <button onClick={onClose} className="text-[#8B949E] hover:text-[#2E3742] transition-colors">
            <X size={24} />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4">
           {(rulerData ?? []).map(metric => (
             <RulerBar key={metric.id} metric={metric} />
           ))}
        </div>
      </div>
    </div>,
    document.body
  );
};

export const EfficiencySection: React.FC<{ data: any; efficiencyDate: string[] }> = ({ data, efficiencyDate }) => {
  const [selectedMetricId, setSelectedMetricId] = useState<string>(data?.[0]?.id);
  const [showRuler, setShowRuler] = useState(false);

  const selectedMetric = data?.find(m => m.id === selectedMetricId) || data?.[0];
  
  const chartData = efficiencyDate?.map((date, i) => ({
    date,
    value: selectedMetric?.trend?.[i]
  }));

  const isDataEmpty = () => {
    let hasData = false;
    for (const key in (data || {})) {
      const trend = data?.[key]?.trend;
      if (!isNil(trend?.find(item => !isNil(item) && item !== '--'))) {
        hasData = true;
        break;
      }
    }
    let hasDate = !isNil(efficiencyDate) && efficiencyDate.length > 0;
    return !hasData || !hasDate;
  };

  const CustomDot = (props: any) => {
    const { cx, cy, index, value } = props;
    const isLast = index === chartData.length - 1;
    if (isNil(value)) {
      return null;
    }
    if (isLast) {
      return (
        <svg x={cx - 5} y={cy - 5} width={10} height={10} viewBox="0 0 10 10">
           <circle cx="5" cy="5" r="5" fill="#246FE5" stroke="white" strokeWidth="2" />
        </svg>
      );
    }
    
    return (
      <circle cx={cx} cy={cy} r={3} fill="white" stroke="#246FE5" strokeWidth={1.5} />
    );
  };

  const CustomLabel = (props: any) => {
    const { x, y, value, index } = props;
    const isLast = index === chartData.length - 1;

    // 计算文本内容
    const textContent = `${value}${selectedMetric?.unit ?? ''}`;

    const charWidth = measureTextWidth(textContent, 10);

    // rect 宽度 = 文本宽度 + 左右padding (各2px)，最小宽度28px
    const rectWidth = Math.max(28, charWidth + 4);
    const rectHeight = 18;

    return (
      <g>
        <rect
          x={x - rectWidth / 2}
          y={y - 28}
          width={rectWidth}
          height={rectHeight}
          rx={2}
          fill={isLast ? "#246FE5" : "white"}
          stroke={isLast ? "#246FE5" : "#C4C9CF"}
        />
        <text
          x={x}
          y={y - 19}
          textAnchor="middle"
          fill={isLast ? "white" : "#626C78"}
          fontSize={10}
          fontWeight="bold"
          dominantBaseline="middle"
        >
          {textContent}
        </text>
      </g>
    );
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      // Find full year date from partial date if needed, or just use label
      return (
        <div className="bg-white p-[12px] rounded-[4px] border border-[#E1E5EB] shadow-[0px_3.664px_14.655px_0px_rgba(27,33,41,0.12),0px_0.611px_3.664px_0px_rgba(27,33,41,0.08)] z-50">
          <p className="text-[14px] font-bold text-[#2E3742] font-['Microsoft_YaHei_UI:Bold',sans-serif] leading-normal mb-[8px]">
            {label}
          </p>
          <div className="flex items-center gap-[4px]">
            <div className="w-[12px] h-[3px] bg-[#246FE5] rounded-[0.5px] shrink-0"></div>
            <span className="text-[14px] text-[#626C78] font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-normal">{selectedMetric?.label}：</span>
            <span className="text-[14px] font-bold text-[#1B2129] font-['Microsoft_YaHei_UI:Bold',sans-serif] leading-normal">{payload[0].value}{selectedMetric?.unit ?? ''}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  if (isDataEmpty()) {
    return null;
  }
  return (
    <div className="bg-white p-[16px] rounded-[8px] w-full min-w-0">
      {/* Header */}
      <div className="flex items-center mb-[12px]">
        <h3 className="flex text-[14px] text-[#626c78] font-['Microsoft_YaHei_UI:Regular',sans-serif] text-center">报告日运行效率</h3>
        <span className="text-[14px] text-[#246FE5] cursor-pointer px-[8px] ml-[8px] rounded-[4px] hover:bg-[rgba(196,201,207,0.30)] transition-colors"
          onClick={() => setShowRuler(true)}
        >
          查看标尺
        </span>
      </div>

      {/* Cards - Height 66px, Gap 12px */}
      <div className="grid grid-cols-6 gap-[12px] mb-[12px]">
        {data?.map((metric) => {
          const isSelected = metric.id === selectedMetricId;
          const statusStyle = STATUS_STYLES[metric.status] || STATUS_STYLES['general'];
          
          return (
            <div 
              key={metric.id}
              className={`
                rounded-[4px] p-[8px] cursor-pointer transition-all border h-[66px] flex flex-col justify-center
                ${isSelected 
                  ? 'bg-[#EBF4FE] border-[#EBF4FE]' 
                  : 'bg-[#F7F9FA] border-[#F7F9FA] hover:border-[#D2E2FB]'
                }
              `}
              onClick={() => setSelectedMetricId(metric.id)}
            >
              <div className="flex items-center gap-[4px] mb-1">
                <span className={`text-[24px] font-bold font-['Persagy2.0:Bold',sans-serif] leading-[28px] ${isSelected ? 'text-[#246FE5]' : 'text-[#2e3742]'}`}>
                  {metric.value ?? '--'}{metric.unit}
                </span>
                <span className={`text-[12px] px-[4px] py-0 rounded-[2px] leading-[20px] ${statusStyle.bg} ${statusStyle.text}`}>
                  {metric.statusLabel}
                </span>
              </div>
              <p className={`text-[14px] leading-[22px] ${isSelected ? 'text-[#246FE5]' : 'text-[#626c78]'}`}>
                {metric.label}
              </p>
            </div>
          );
        })}
      </div>

      {/* Chart Section */}
      <div className="w-full min-w-0">
        <div className="flex justify-between items-center mb-[12px]">
          <h4 className="text-[14px] text-[#626c78]">近7日运行效率</h4>
          <div className="flex items-center gap-1">
            <div className="w-[14px] h-[3px] bg-[#2481f2]"></div>
            <span className="text-[14px] text-[#626c78]">{selectedMetric?.label}</span>
          </div>
        </div>
        
        <div className="h-[194px] w-full min-w-0">
          <ResponsiveContainer width="100%" height="100%" minWidth={100} minHeight={100} debounce={200}>
            <LineChart data={chartData} margin={{ top: 30, right: 10, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E4E6E7" />
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                tick={({ x, y, payload }) => {
                   const isLast = payload.value.includes('报告日');
                   return (
                     <text x={x} y={y + 12} textAnchor="middle" fill={isLast ? "#246fe5" : "#8d9399"} fontSize={12} fontWeight={isLast ? "bold" : "normal"}>
                       {payload.value}
                     </text>
                   );
                }}
                padding={{ left: 20, right: 20 }}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#8D9399', fontSize: 12 }}
                domain={['auto', 'auto']}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#246FE5', strokeWidth: 1, strokeDasharray: '3 3' }} />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#246FE5" 
                strokeWidth={1.5} 
                dot={<CustomDot />}
                activeDot={{ r: 4, fill: "#246FE5", stroke: "white", strokeWidth: 2 }}
                isAnimationActive={true}
              >
                <LabelList content={<CustomLabel />} />
              </Line>
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      {showRuler && <RulerPopup rulerData={data} onClose={() => setShowRuler(false)} />}
    </div>
  );
};
