import React from "react";
import { TableText } from "@/app/components/common/TableText";

interface VentilationSectionProps {
  data: {
    name: string;
    standard?: string;
    fullDescription?: string;
    noExceptionText?: string;
    exceptionLogs?: { time: string; device: string; action: string }[];
    heatmapData?: { building?: string; floor: string; name: string; status: number[] }[];
    offHoursEquipment?: { category: string; name: string; periods: string; duration: string; spaces: string }[];
  };
}

export const VentilationSection: React.FC<VentilationSectionProps> = ({ data }) => {
  if (!data) return null;

  const hasLogs = data.exceptionLogs && data.exceptionLogs.length > 0;
  const hasHeatmap = data.heatmapData && data.heatmapData.length > 0;
  const hasEquipment = data.offHoursEquipment && data.offHoursEquipment.length > 0;

  const timeSlots = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"];

  return (
    <div className="bg-[rgba(255,255,255,0.5)] backdrop-blur-sm flex flex-col gap-[12px] items-start p-[20px] relative rounded-[8px] w-full border border-white shadow-sm">
      {/* 模块标题区域 */}
      <div className="relative inline-block mb-1">
        <h3 className="text-xl font-bold text-[#2E3742] relative z-10">{data.name}</h3>
        <div className="absolute bottom-0.5 left-0 right-0 h-3 bg-[#0094FF]/20 z-0" />
      </div>

      {/* 描述文字 (来自 Excel 自定义字段, 优先显示自定义全文描述) */}
      <p className="leading-[24px] min-w-full text-[#626c78] text-[15px] whitespace-pre-wrap">
        {data.fullDescription || data.standard || "未配置运行标准"}
      </p>

      {/* 1. 空间热力图部分 */}
      {hasHeatmap && (
        <div className="bg-white p-4 rounded-lg border border-[#E1E5EB] flex flex-col gap-[6px] w-full">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-[#1B2129] font-bold">
              <span>空间</span>
            </div>
            
            <div className="flex items-center gap-4 text-xs text-[#626C78]">
              <div className="flex items-center gap-1.5"><div className="w-3.5 h-[3px] bg-[#B6E9C7]" />达标</div>
              <div className="flex items-center gap-1.5"><div className="w-3.5 h-[3px] bg-[#FFD873]" />不达标</div>
            </div>
          </div>
          
          <div className="overflow-hidden rounded-none border border-[#E1E5EB]">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[#EBF4FE] text-[12px] text-[#626C78]">
                  <th className="px-4 py-2.5 font-normal border-r border-b border-[#E1E5EB] w-16 text-center">楼层</th>
                  <th className="px-4 py-2.5 font-normal border-r border-b border-[#E1E5EB] text-left">空间名称</th>
                  {timeSlots.map(time => (
                    <th key={time} className="px-1 py-2.5 font-normal border-r border-b border-[#E1E5EB] text-center">{time}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.heatmapData!.map((row, idx) => (
                  <tr key={`${row.floor}-${row.name}`} className="text-sm">
                    <td className="px-4 py-2 border-r border-b border-[#E1E5EB] text-center text-[#1B2129] font-medium">{row.floor}</td>
                    <td className="px-4 py-2 border-r border-b border-[#E1E5EB] text-[#1B2129]">
                      <TableText text={row.name} />
                    </td>
                    {row.status.map((status, sIdx) => (
                      <td key={sIdx} className="p-[2px] border-r border-b border-[#E1E5EB]">
                        <div 
                          className="w-full h-8 transition-opacity hover:opacity-80"
                          style={{ backgroundColor: status === 0 ? "#B6E9C7" : "#FFD873" }}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2. 非通风时间段运行设备部分 */}
      {hasEquipment && (
        <div className="w-full space-y-3">
           <h4 className="font-bold text-[#2E3742] text-lg">非通风时间段运行的设备</h4>
           <div className="w-full bg-white rounded-[8px] overflow-hidden border border-[#E5E7EB]">
            <table className="w-full text-sm text-[#2E3742] min-w-[600px]">
              <thead className="bg-[#F5F7FA]">
                <tr>
                  <th className="py-3 px-4 font-medium text-left w-[100px] border-r border-[#E5E7EB]">分类</th>
                  <th className="py-3 px-4 font-medium text-left w-[150px] border-r border-[#E5E7EB]">设备名称</th>
                  <th className="py-3 px-4 font-medium text-left w-[200px] border-r border-[#E5E7EB]">运行时间段</th>
                  <th className="py-3 px-4 font-medium text-left w-[100px] border-r border-[#E5E7EB]">运行总时长</th>
                  <th className="py-3 px-4 font-medium text-left">服务空间</th>
                </tr>
              </thead>
              <tbody>
                {data.offHoursEquipment!.map((item, idx) => (
                  <tr key={`${item.category}-${item.name}-${idx}`} className="border-t border-[#F1F3F5] hover:bg-gray-50">
                    <td className="py-3 px-4 border-r border-[#F1F3F5]"><TableText text={item.category} /></td>
                    <td className="py-3 px-4 border-r border-[#F1F3F5]"><TableText text={item.name} /></td>
                    <td className="py-3 px-4 border-r border-[#F1F3F5]"><TableText text={item.periods} /></td>
                    <td className="py-3 px-4 border-r border-[#F1F3F5] whitespace-nowrap">{item.duration}</td>
                    <td className="py-3 px-4 text-[#626c78] text-xs leading-relaxed max-w-[300px]"><TableText text={item.spaces} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
           </div>
        </div>
      )}

      {/* 3. 设备异常记录卡片 */}
      <div className="bg-white relative rounded-[8px] shrink-0 w-full border border-solid border-white p-[12px] py-[16px] flex flex-col gap-[12px]">
        <div className="flex items-center justify-between relative shrink-0 w-full">
          <p className="font-bold leading-[24px] text-[#2e3742] text-[16px] whitespace-pre">
            设备异常记录
          </p>
        </div>

        {hasLogs ? (
          <div className="flex flex-col items-start relative shrink-0 w-full">
            {data.exceptionLogs?.map((log, idx) => (
              <div key={`${log.time}-${log.device}-${idx}`} className="w-full">
                <div className="flex gap-[12px] items-center relative shrink-0 w-full">
                  <p className="leading-[normal] text-[#626c78] text-[14px] w-[62px] whitespace-pre-wrap tabular-nums">
                    {log.time}
                  </p>
                  <div className="flex h-[17px] items-center relative shrink-0">
                    <div className="bg-[#a6aaac] rounded-full shrink-0 size-[10px]" />
                  </div>
                  <p className="leading-[normal] text-[#626c78] text-[14px] whitespace-normal break-words flex-1">
                    <span className="font-bold text-[#2e3742]">{log.device}</span>
                    <span> {log.action}</span>
                  </p>
                </div>

                {idx < (data.exceptionLogs?.length || 0) - 1 && (
                  <div className="h-[21px] relative shrink-0 w-full">
                    <div className="flex flex-row items-center h-full">
                      <div className="flex items-center px-[79px] py-0 relative h-full">
                        <div className="h-[30px] relative shrink-0 w-0">
                          <div className="absolute inset-[0_-0.5px]">
                            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1 30">
                              <path d="M0.5 0V30" stroke="#8B949E" strokeDasharray="3 3" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[#626c78] text-[14px]">
            {data.noExceptionText || "暂无设备异常"}
          </p>
        )}
      </div>
    </div>
  );
};
