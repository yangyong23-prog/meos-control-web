import React, { useEffect, useState } from "react";
import { X, ArrowUpDown } from "lucide-react";
import { createPortal } from "react-dom";
import { OperationType } from "../variables";
import Loading from "@/app/components/Loading";
import Empty from "@/app/components/Empty";
import { queryRunningLogListByPage } from '@/app/hooks/useOperationLog';

interface RecordItem {
  time: string;
  category: string;
  tag: string;
  operator: string;
  object: string;
  content: string;
  effectiveTime: string;
  reason: string;
}

interface ManualInterventionPopupProps {
  onClose: () => void;
  objectId?: string;
  objectIds?: string[];
  reportDate?: string;
}

export const ManualInterventionPopup: React.FC<ManualInterventionPopupProps> = ({ onClose, objectId, objectIds, reportDate }) => {
  const [loading, setLoading] = useState(false);
  const [records, setRecords] = useState<RecordItem[]>([]);
  
  // 在组件加载时设置loading状态
  useEffect(() => {
    if (!reportDate || !objectId) {
      setRecords([]);
      return;
    }
    setLoading(true);
    queryRunningLogListByPage(reportDate, objectId, objectIds)
      .then((result) => {
        setRecords(result.data || []);
      })
      .catch((err) => {
        console.error('查询运行日志失败:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [objectId, reportDate, objectIds]);
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return createPortal(
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-[2px]">
      <div className="bg-white rounded-[4px] shadow-lg w-[1260px] max-w-[95vw] h-[600px] flex flex-col overflow-hidden relative">
        <div className="h-[56px] shrink-0 border-b border-[#E8ECF0] flex items-center justify-between px-[24px] bg-white">
          <h2 className="text-[16px] font-bold text-[#2E3742] font-['Microsoft_YaHei_UI:Bold',sans-serif]">人工干预记录</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded transition-colors cursor-pointer">
            <X size={20} className="text-[#8B949E]" />
          </button>
        </div>
        { loading && (
          <div className="flex-1 relative overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <Loading showText={false} size={100} className="overflow-hidden bg-transparent" />
            </div>
          </div>
        )}
        {!loading && records.length === 0 && (
          <Empty text="暂无内容" />
        )}
        {!loading && records.length > 0 && (
          <div className="flex-1 overflow-hidden p-[24px]">
            <div className="w-full h-full border border-[#E1E5EB] rounded-[4px] overflow-auto bg-white">
              <table className="w-full border-collapse table-fixed min-w-full">
                <thead className="sticky top-0 z-10">
                  <tr className="bg-[#F1F4F6] border-b border-[#E1E5EB] h-[40px]">
                    <th className="w-[12%] px-[16px] text-left border-r border-[#E1E5EB] font-['Microsoft_YaHei_UI',sans-serif] text-[12px] text-[#626C78] font-normal truncate">
                      <div className="flex items-center gap-1 cursor-pointer hover:text-[#2E3742]">
                        操作时间
                        <ArrowUpDown size={12} className="text-[#8D9399]" />
                      </div>
                    </th>
                    <th className="w-[12%] px-[16px] text-left border-r border-[#E1E5EB] font-['Microsoft_YaHei_UI',sans-serif] text-[12px] text-[#626C78] font-normal truncate">日志分类</th>
                    <th className="w-[8%] px-[16px] text-left border-r border-[#E1E5EB] font-['Microsoft_YaHei_UI',sans-serif] text-[12px] text-[#626C78] font-normal truncate">日志标识</th>
                    <th className="w-[8%] px-[16px] text-left border-r border-[#E1E5EB] font-['Microsoft_YaHei_UI',sans-serif] text-[12px] text-[#626C78] font-normal truncate">操作人</th>
                    <th className="w-[15%] px-[16px] text-left border-r border-[#E1E5EB] font-['Microsoft_YaHei_UI',sans-serif] text-[12px] text-[#626C78] font-normal truncate">操作对象</th>
                    <th className="w-[20%] px-[16px] text-left border-r border-[#E1E5EB] font-['Microsoft_YaHei_UI',sans-serif] text-[12px] text-[#626C78] font-normal truncate">操作内容</th>
                    <th className="w-[15%] px-[16px] text-left border-r border-[#E1E5EB] font-['Microsoft_YaHei_UI',sans-serif] text-[12px] text-[#626C78] font-normal truncate">生效时间</th>
                    <th className="w-[10%] px-[16px] text-left font-['Microsoft_YaHei_UI',sans-serif] text-[12px] text-[#626C78] font-normal truncate">操作原因</th>
                  </tr>
                </thead>
                <tbody>
                  {(records || []).map((record, index) => (
                    <tr key={index} className="border-b border-[#E1E5EB] hover:bg-[#F9FAFB]">
                      <td className="!px-[16px] !py-[13px] border-r border-[#E1E5EB] text-[14px] text-[#1B2129] font-['Microsoft_YaHei_UI',sans-serif]" title={record.time}>
                        <div className="line-clamp-2">{record.time}</div>
                      </td>
                      <td className="!px-[16px] !py-[13px] border-r border-[#E1E5EB] text-[14px] text-[#1B2129] font-['Microsoft_YaHei_UI',sans-serif]" title={record.category}>
                        <div className="line-clamp-2">{record.category}</div>
                      </td>
                      <td className="!px-[16px] !py-[13px] border-r border-[#E1E5EB] text-[14px] text-[#1B2129] font-['Microsoft_YaHei_UI',sans-serif]">
                        <span className="inline-block px-[8px] py-[2px] bg-[#FFF7E6] text-[#FA8C16] text-[12px] rounded-[2px]" title={OperationType[record.tag] || '--'}>
                          {OperationType[record.tag] || '--'}
                        </span>
                      </td>
                      <td className="!px-[16px] !py-[13px] border-r border-[#E1E5EB] text-[14px] text-[#1B2129] font-['Microsoft_YaHei_UI',sans-serif]" title={record.operator}>
                        <div className="line-clamp-2">{record.operator}</div>
                      </td>
                      <td className="!px-[16px] !py-[13px] border-r border-[#E1E5EB] text-[14px] text-[#1B2129] font-['Microsoft_YaHei_UI',sans-serif]" title={record.object}>
                        <div className="line-clamp-2">{record.object}</div>
                      </td>
                      <td className="!px-[16px] !py-[13px] border-r border-[#E1E5EB] text-[14px] text-[#1B2129] font-['Microsoft_YaHei_UI',sans-serif]" title={record.content}>
                        <div className="line-clamp-2">{record.content}</div>
                      </td>
                      <td className="!px-[16px] !py-[13px] border-r border-[#E1E5EB] text-[14px] text-[#1B2129] font-['Microsoft_YaHei_UI',sans-serif]" title={record.effectiveTime}>
                        <div className="line-clamp-2">{record.effectiveTime}</div>
                      </td>
                      <td className="!px-[16px] !py-[13px] text-[14px] text-[#1B2129] font-['Microsoft_YaHei_UI',sans-serif]" title={record.reason}>
                        <div className="line-clamp-2">{record.reason}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};
