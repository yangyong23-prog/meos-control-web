import React from "react";
import { TableText } from "@/app/components/common/TableText";
import { MTipsTooltip } from "@/app/components/common/MTipsTooltip";

interface LightingSectionProps {
  data: {
    name: string;
    standard: string;
    circuitCount?: number | string;
    manualCount?: number;
    timeRange?: string;
    deviceError?: number;
    status?: string;
    savingRate?: string;
    autoRate?: string;
    fullDescription?: string;
    noExceptionText?: string;
    overrideData?: any[];
    exceptionLogs?: any[];
  };
}

export const LightingSection: React.FC<LightingSectionProps> = ({ data }) => {
  if (!data) return null;

  const exceptionLogs = data.exceptionLogs || [];

  const overrideData = data.overrideData || [
    { scene: "营业前（00：00-07：00）", count: "20次", tag: "人工控制最多" },
    { scene: "营业中（07：00-22：00）", count: "全按照明需求自动运行，未进行人工控制", color: "text-[#0C9B4A]" },
    { scene: "营业结束（07-00-2200）", count: "10次" }
  ];

  return (
    <div className="space-y-4">
      <div className="bg-white/50 backdrop-blur-sm p-4 rounded-[8px] space-y-6">
        <div>
          <div className="relative inline-block mb-4">
            <h3 className="text-xl font-bold text-[#2E3742] relative z-10">{data.name}</h3>
            <div className="absolute bottom-0.5 left-0 right-0 h-3 bg-[#0094FF]/20 z-0" />
          </div>

          {/* Standards Card */}
          <div className="bg-white rounded-lg border border-[#E1E5EB] overflow-hidden mb-4">
            <div className="bg-[#F5F9FF] px-3 py-2 border-b border-[#E1E5EB]">
              <h4 className="font-bold text-[#2E3742] text-[16px]">照明运行标准</h4>
            </div>
            <div className="p-4 space-y-4">
              <div className="text-[14px] text-[#626C78] leading-relaxed">
                {(!data.standard && !data.fullDescription) ? "未配置运行标准" : (
                  data.fullDescription ? data.fullDescription : (
                    <>
                      {data.standard}。共{data.circuitCount || 100}条回路，
                      {Number(data.manualCount) === 0 ? (
                        <span className="text-[#0C9B4A]">全按照明需求自动运行，未进行人工控制</span>
                      ) : (
                        <>
                          其中人工控制了<span className="font-bold text-[#1B2129]">{data.manualCount}</span>次，主要集中于“<span className="font-bold text-[#1B2129]">{data.timeRange}</span>”时段
                        </>
                      )}。
                      {Number(data.deviceError) > 0 && (
                        <>此外，共有 <span className="font-bold text-[#1B2129]">{data.deviceError}</span> 台设备运行异常。</>
                      )}
                    </>
                  )
                )}
              </div>
              
              <div className="border border-[#E1E5EB] rounded-none overflow-hidden bg-white">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-[#EBF4FE] text-[12px] text-[#626C78] border-b border-[#E1E5EB]">
                      <th className="px-4 py-2.5 font-normal border-r border-[#E1E5EB]">场景时段</th>
                      <th className="px-4 py-2.5 font-normal">人工控制次数</th>
                    </tr>
                  </thead>
                  <tbody>
                    {overrideData.map((row, idx) => (
                      <tr key={row.scene} className="border-b border-[#E1E5EB] last:border-0 text-[14px]">
                        <td className="px-4 py-3.5 text-[#1B2129] border-r border-[#E1E5EB]">
                          <TableText text={row.scene} />
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-2">
                            <span className={row.color || "text-[#1B2129]"}>{row.count}</span>
                            {row.tag && (
                              <div className="bg-[#FFF0CC] text-[#E68600] text-[12px] px-1 rounded-[2px] max-w-[120px] inline-block align-middle">
                                <MTipsTooltip text={row.tag} />
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Exception Logs Card */}
          <div className="bg-white rounded-lg border border-[#E1E5EB] overflow-hidden">
            <div className="p-4">
              <h4 className="font-bold text-[#2E3742] text-[16px] mb-4">设备异常记录</h4>
              {exceptionLogs.length > 0 ? (
                <div className="space-y-0">
                  {exceptionLogs.map((log, i) => (
                    <div key={`${log.time}-${log.device}-${i}`} className="flex gap-3 relative">
                      <span className="text-[14px] text-[#626C78] w-[70px] tabular-nums shrink-0 leading-[20px]">{log.time}</span>
                      
                      <div className="relative flex flex-col items-center w-2.5 shrink-0">
                        <div className="relative z-10 w-2.5 h-2.5 rounded-full bg-[#A6AAAC] border-2 border-white mt-[5px]" />
                        {i < exceptionLogs.length - 1 && (
                          <div className="absolute top-[10px] bottom-[-4px] w-px border-l border-dashed border-[#8B949E]" />
                        )}
                      </div>

                      <div className="text-[14px] text-[#626C78] pb-4 leading-[20px]">
                        <span className="font-bold text-[#1B2129]">{log.device}</span>
                        <span> {log.action}</span>
                      </div>
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
        </div>
      </div>
    </div>
  );
};
