import React from "react";
import { FileText, MonitorPlay, Download } from "lucide-react";
import svgPaths from "@/imports/svg-ggr56iixct";
import { MTipsTooltip } from "@/app/components/common/MTipsTooltip";

interface HeaderProps {
  onExportPDF: () => void;
  onPresentationClick: () => void;
  onSimulateClick?: () => void;
  onDownloadReport?: () => void;
  isPresentationMode: boolean;
  isSimulating?: boolean;
  isDownloading?: boolean;
  hasDownloadPermission?: boolean;
  isEditing?: boolean;
  onToggleEdit?: () => void;
  isExporting?: boolean;
  exportProgress?: number;
  reportDate?: string;
}

function MeosLogo() {
  return (
    <div className="h-[13.333px] w-[60px] relative">
      <div className="absolute inset-[-1.42%_9.26%_-1.42%_0]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 54.4444 13.713">
          <g id="meos">
            <path d={svgPaths.p2ff3e500} fill="var(--fill-0, #2E3742)" id="Shape" />
            <path d={svgPaths.p5675700} fill="var(--fill-0, #2E3742)" id="Shape_2" />
            <path d={svgPaths.p319f4098} fill="var(--fill-0, #2E3742)" id="Shape_3" />
            <path d={svgPaths.p2229af00} fill="var(--fill-0, #246FE5)" id="Shape_4" />
            <path d={svgPaths.p3c9ddb80} fill="var(--fill-0, #2E3742)" id="Rectangle-path" />
            <path d={svgPaths.p29348280} fill="var(--fill-0, #2E3742)" id="Shape_5" />
            <path d={svgPaths.p1afe00} fill="var(--fill-0, #2E3742)" id="Shape_6" />
          </g>
        </svg>
      </div>
    </div>
  );
}

export const Header: React.FC<HeaderProps> = ({ onExportPDF, onPresentationClick, onSimulateClick, onDownloadReport, isPresentationMode, isSimulating, isDownloading, hasDownloadPermission }) => {
  
  const startDownloadReport = () => {
    if (isDownloading || !hasDownloadPermission) {
      return;
    }
    onDownloadReport?.();
  }

  return (
    <header 
      data-html2canvas-ignore="true"
      className="h-[50px] bg-white shadow-[0px_2px_10px_0px_rgba(27,33,41,0.1)] flex items-center justify-between px-6 fixed top-0 left-0 right-0 z-50"
    >
      <div className="flex items-center gap-[4px]">
        <div className="flex items-center gap-[8px]">
          <MeosLogo />
          <div className="bg-[#c4c9cf] h-[14px] w-px" />
          <div className="px-[8px] py-[5px]">
            <p className="font-['Microsoft_YaHei_UI:Regular',sans-serif] font-normal leading-[22px] not-italic text-[#1b2129] text-[14px] whitespace-pre">报告详情</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6">
        {onSimulateClick && (
           <div 
            onClick={onSimulateClick}
            className={`flex items-center gap-2 transition-colors text-sm font-medium cursor-pointer ${isSimulating ? 'text-blue-600' : 'text-[#4E5969] hover:text-blue-600'}`}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v4"/><path d="m16.2 7.8 2.9-2.9"/><path d="M18 12h4"/><path d="m16.2 16.2 2.9 2.9"/><path d="M12 18v4"/><path d="m4.9 19.1 2.9-2.9"/><path d="M2 12h4"/><path d="m4.9 4.9 2.9 2.9"/></svg>
            {isSimulating ? '退出模拟' : '超多数据模拟'}
          </div>
        )}
        {/* <button 
          onClick={onExportPDF}
          className="flex items-center gap-2 text-[#4E5969] hover:text-blue-600 transition-colors text-sm font-medium cursor-pointer"
        >
          <FileText size={16} />
          导出 PDF
        </button> */}
        {onDownloadReport && (
          <MTipsTooltip
            content={!hasDownloadPermission ? '暂无操作权限，如有需要请联系管理员新增权限' : undefined}
            alwaysShowTooltip={!hasDownloadPermission}
            wrapperClassName=""
            position="bottom"
          >
            <div 
              onClick={startDownloadReport}
              className={`flex items-center gap-2 transition-colors text-sm font-medium ${hasDownloadPermission && !isDownloading ? 'text-[#4E5969] hover:text-blue-600 cursor-pointer' : 'text-[#C4C9CF] cursor-not-allowed'} disabled:opacity-50`}
            >
              <Download size={16} />
              {isDownloading ? '下载中...' : '下载报告'}
            </div>
          </MTipsTooltip>
        )}
        <div 
          onClick={onPresentationClick}
          className={`flex items-center gap-2 transition-colors text-sm font-medium cursor-pointer  text-[#4E5969] hover:text-blue-600`}
        >
          <MonitorPlay size={16} />
          {isPresentationMode ? '退出演示' : '演示模式'}
        </div>
      </div>
    </header>
  );
};
