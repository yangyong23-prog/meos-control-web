// @ts-nocheck
import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useSearchParams } from 'react-router-dom';
import { Header } from '@/app/components/Header';
import { OverviewSection } from '@/app/components/OverviewSection';
import { EnergyAnalysisSection } from '@/app/components/EnergyAnalysisSection';
import { EnergyBudgetSection } from '@/app/components/EnergyBudgetSection';
import { ACDetailsSection } from '@/app/components/ACDetailsSection';
import { EnvQualitySection } from '@/app/components/EnvQualitySection';
import { ColdStationSection } from '@/app/components/CoolingSystemSection';
import { LightingSection } from '@/app/components/LightingSection';
import { VentilationSection } from '@/app/components/VentilationSection';
import { Toaster, toast } from 'sonner';
import * as XLSX from 'xlsx';
import { toJpeg } from 'html-to-image';
import jsPDF from 'jspdf';
import bgPattern from '@/assets/6df8f5011f9c40a0461c1cc5478e35d550bcab24.png';
import loadingGif from '@/assets/loading.gif';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { AnchorSidebar } from '@/app/components/AnchorSidebar';
import Loading from '@/app/components/Loading';
import { SectionRemarkInput } from '@/app/components/SectionRemarkInput';
import { ErrorBoundary } from '@/app/components/ErrorBoundary';
import { GlobalMessage, MessageType } from '@/app/components/GlobalMessage';
import { showSuccessToast, showErrorToast } from '@/utils/toast';
import { MTipsTooltip } from '@/app/components/common/MTipsTooltip';

import useDailyDetail from '@/app/hooks/useDailyDetail';
import { Calendar, TrendingUp } from 'lucide-react';

import svgPathsWaves from '@/imports/svg-tm4b4gnx6j';
import bgWaves from '@/assets/4c8653c84b1ed57a3a7b71433f884a5c3d62ebae.png';
import { dayTz } from '@/utils/dayjsTool';
import { qiankunStore } from '@/store/qiankunStore';
import { hasAuthorization } from '@/store/baseSlice';
import { PERMISSIONS } from '@/constants/permissions';
import { TreeBuildFloorContext } from './hooks/useTreeBuildFloor';
import { ScheduleInfoCodeDefineProvider } from '@/app/hooks/useScheduleInfoCodeDefine';
import { coldStationSectionHandler } from '@/app/handler/ac';
import { AirZoneSection } from '@/app/components/AirZone';
import useRemark from '@/app/hooks/useRemark';
import { downloadReport } from '@/apis/reportApi';
import { baseSelector } from '@/store/baseSlice';
import { hasAuthorizationByKey } from '@/store/baseSlice';
import { useAppSelector } from '@/hooks/redux';

const ReportSections = React.memo(
    ({ anchorItems, reportDate, buildRemarkAnchorId }: { anchorItems: any[]; reportDate: string; buildRemarkAnchorId: (reportId?: string, objectId?: string) => string }) => {
        const renderContentSection = (item: any) => {
            switch (item.code) {
                case 'report_chapter_run_overview':
                    return (
                        <ErrorBoundary key={item.id} sectionName="运行概述">
                            <div id={item.id} className="scroll-mt-[100px]">
                                <OverviewSection data={item} />
                                <div className="mt-4">
                                    <div data-remark-anchor={buildRemarkAnchorId(item.id, item.objectId)} />
                                </div>
                            </div>
                        </ErrorBoundary>
                    );
                case 'report_chapter_energy_analysis':
                    return (
                        <ErrorBoundary key={item.id} sectionName={item.label}>
                            <div id={item.id} className="scroll-mt-[100px]">
                                <EnergyAnalysisSection data={item} reportDate={reportDate}>
                                    <div data-remark-anchor={buildRemarkAnchorId(item.id, item.objectId)} />
                                </EnergyAnalysisSection>
                            </div>
                        </ErrorBoundary>
                    );
                case 'report_chapter_energy_budget':
                    return (
                        <ErrorBoundary key={item.id} sectionName="能耗预算">
                            <div id={item.id} className="scroll-mt-[100px]">
                                <EnergyBudgetSection data={item} reportDate={reportDate}>
                                    <div data-remark-anchor={buildRemarkAnchorId(item.id, item.objectId)} />
                                </EnergyBudgetSection>
                            </div>
                        </ErrorBoundary>
                    );
                case 'report_chapter_ac':
                    return (
                        <div key={item.id} id={item.id} className="scroll-mt-[100px] flex flex-col gap-[12px]">
                            <div className="flex items-center gap-2">
                                <div className="bg-[#246FE5] h-[20px] w-[3px] rounded-full" />
                                <h2 className="text-xl font-bold text-[#2E3742]">{item.label}</h2>
                            </div>
                            {item.children?.map((subItem: any) => {
                                switch (subItem.code) {
                                    case 'report_chapter_cooling_analysis':
                                        return (
                                            <ErrorBoundary key={subItem.id} sectionName={subItem.label}>
                                                <div id={subItem.id} className="scroll-mt-[100px]">
                                                    <ACDetailsSection data={subItem} date={reportDate}>
                                                        <div data-remark-anchor={buildRemarkAnchorId(subItem.id, subItem.objectId)} />
                                                    </ACDetailsSection>
                                                </div>
                                            </ErrorBoundary>
                                        );
                                    case 'report_chapter_env_quality':
                                        return (
                                            <ErrorBoundary key={subItem.id} sectionName="环境品质">
                                                <div id={subItem.id} className="scroll-mt-[100px]">
                                                    <EnvQualitySection data={subItem} reportDate={reportDate}>
                                                        <div data-remark-anchor={buildRemarkAnchorId(subItem.id, subItem.objectId)} />
                                                    </EnvQualitySection>
                                                </div>
                                            </ErrorBoundary>
                                        );
                                    case 'report_chapter_cooling_sys_run':
                                        return (
                                            <ErrorBoundary key={subItem.id} sectionName="冷站系统运行">
                                                <div id={subItem.id} className="bg-white/50 backdrop-blur-sm p-4 rounded-[8px] space-y-[12px] scroll-mt-[100px] mb-[12px]">
                                                    <div className="relative inline-block">
                                                        <h3 className="text-xl font-bold text-[#2E3742] relative z-10">冷站系统运行</h3>
                                                        <div className="absolute bottom-0.5 left-0 right-0 h-3 bg-[#0094FF]/20 z-0" />
                                                    </div>
                                                    {subItem.children?.map((child: any) => {
                                                        const systemData = coldStationSectionHandler(child, subItem.chapterData, reportDate) || {};
                                                        return (
                                                            <div key={child.id} id={child.id} className="scroll-mt-[100px] space-y-[12px]">
                                                                <ColdStationSection
                                                                    data={{
                                                                        exceptionLogsEmptyMessage: '暂无设备异常',
                                                                        ...systemData,
                                                                        reportDate: reportDate
                                                                    }}
                                                                />
                                                                <div data-remark-anchor={buildRemarkAnchorId(child.id, child.objectId)} />
                                                                {systemData?.airConditioningControlZones?.map((zone: any) => (
                                                                    <div key={zone.id}>
                                                                        <AirZoneSection data={{ ...zone, reportDate: reportDate }} system={systemData.system} />
                                                                        <div data-remark-anchor={buildRemarkAnchorId(child.id, zone?.id || zone?.objectId)} />
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </ErrorBoundary>
                                        );
                                    default:
                                        return null;
                                }
                            })}
                        </div>
                    );
                // case 'lighting-root':
                //     return (
                //         <div key={item.id} id="lighting-root" className="scroll-mt-[100px]">
                //             <div className="flex items-center gap-2 mb-4">
                //                 <div className="bg-[#246FE5] h-[20px] w-[3px] rounded-full" />
                //                 <h2 className="text-xl font-bold text-[#2E3742]">照明</h2>
                //             </div>
                //             <div className="space-y-8">
                //                 {item.children?.map((subItem: any) => {
                //                     const idx = parseInt(subItem.id.split('-')[1]);
                //                     const dataItem = data.lightingDetails[idx];
                //                     if (!dataItem) return null;
                //                     return (
                //                         <ErrorBoundary key={subItem.id} sectionName={`照明-${dataItem.name}`}>
                //                             <div id={subItem.id} className="scroll-mt-[100px]">
                //                                 <LightingSection data={dataItem} />
                //                             </div>
                //                         </ErrorBoundary>
                //                     );
                //                 })}
                //             </div>
                //             <div data-remark-anchor={buildRemarkAnchorId(item.id, item.objectId)} />
                //         </div>
                //     );
                // case 'ventilation-root':
                //     return (
                //         <div key={item.id} id="ventilation-root" className="scroll-mt-[100px]">
                //             <div className="flex items-center gap-[9px] mt-8 mb-4 relative rounded-[4px]">
                //                 <div className="bg-[#246FE5] h-[20px] w-[3px] shrink-0" />
                //                 <h2 className="text-[20px] font-bold text-[#2E3742] leading-[28px]">通风</h2>
                //             </div>
                //             <div className="space-y-8">
                //                 {item.children?.map((subItem: any) => {
                //                     const idx = parseInt(subItem.id.split('-')[1]);
                //                     const dataItem = data.ventilationDetails[idx];
                //                     if (!dataItem) return null;
                //                     return (
                //                         <ErrorBoundary key={subItem.id} sectionName={`通风-${dataItem.name}`}>
                //                             <div id={subItem.id} className="scroll-mt-[100px]">
                //                                 <VentilationSection data={dataItem} />
                //                             </div>
                //                         </ErrorBoundary>
                //                     );
                //                 })}
                //             </div>
                //             <div data-remark-anchor={buildRemarkAnchorId(item.id, item.objectId)} />
                //         </div>
                //     );
                default:
                    return null;
            }
        };
        return <>{anchorItems.map(item => renderContentSection(item))}</>;
    }
);

const RemarkLayer = ({
    targets,
    isEditing,
    getRemarkValue,
    onChange,
    version
}: {
    targets: Array<{ reportId: string; objectId?: string; key: string; anchorId: string }>;
    isEditing: boolean;
    getRemarkValue: (reportId?: string, objectId?: string) => string;
    onChange: (reportId?: string, objectId?: string, value?: string) => void;
    version: number;
}) => {
    const [anchorMap, setAnchorMap] = useState<Record<string, HTMLElement>>({});

    useEffect(() => {
        const next: Record<string, HTMLElement> = {};
        targets.forEach(target => {
            const anchor = document.querySelector(`[data-remark-anchor="${target.anchorId}"]`) as HTMLElement | null;
            if (anchor) {
                next[target.key] = anchor;
            }
        });
        setAnchorMap(next);
    }, [targets, isEditing, version]);

    return (
        <>
            {targets.map(target => {
                const anchor = anchorMap[target.key];
                if (!anchor) return null;
                return createPortal(
                    <SectionRemarkInput
                        id={target.key}
                        value={getRemarkValue(target.reportId, target.objectId)}
                        onChange={value => onChange(target.reportId, target.objectId, value)}
                        visible={isEditing}
                    />,
                    anchor
                );
            })}
        </>
    );
};

export default function App() {
    const [searchParams] = useSearchParams();
    const defaultDate = dayTz().format('YYYY-MM-DD');
    const reportDate = searchParams.get('reportDate') || defaultDate;
    const reportType = searchParams.get('reportType') || 'daily';
    const reportMode = searchParams.get('reportMode') || '';

    // 组件挂载时通知mid-frame-web隐藏title
    useEffect(() => {
        qiankunStore.setGlobalState?.({ showHeader: false });
        qiankunStore.setGlobalState?.({
            customTitle: {
                type: '1',
                params: {
                    title: '运行复盘报告'
                }
            }
        });
    }, []);
    const { loading, chapterDetails, loadDailyReport, chapterTree, getBuildOrFloorById, reportIds, buildData } = useDailyDetail();
    const { remark, remarkMap, loadRemark, saveRemark } = useRemark(reportIds);
    const { projectName } = useAppSelector(baseSelector);

    // 组件挂载时加载日报数据
    useEffect(() => {
        // 从URL参数获取日期，如果没有则使用默认日期
        loadDailyReport(reportDate, reportType);
    }, [reportDate, reportType]);

    const [data, setData] = useState({});
    const [isExporting, setIsExporting] = useState(false);
    const [exportProgress, setExportProgress] = useState(0);
    const [isPresentationMode, setIsPresentationMode] = useState(false);
    const [presentationZoom, setPresentationZoom] = useState(1);
    const [isSimulating, setIsSimulating] = useState(false);
    const [originalData, setOriginalData] = useState<any>(null);
    const [isDownloading, setIsDownloading] = useState(false);

    // 检查下载报告权限
    const hasDownloadPermission = useAppSelector(state => hasAuthorization(state, PERMISSIONS.DOWNLOAD_DAILY_REPORT));

    const hasEditPower = useAppSelector(hasAuthorizationByKey(PERMISSIONS.RUNRETROREPORT_EDIT));
    console.log('hasEditPower: ', hasEditPower);
    // Edit Mode State
    const [isEditing, setIsEditing] = useState(false);
    const appRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setIsEditing(hasEditPower && reportMode === '1');
    }, [reportMode, hasEditPower]);

    const [globalMsg, setGlobalMsg] = useState<{ type: MessageType; msg: string; show: boolean }>({ type: 'success', msg: '', show: false });

    const draftRemarkRef = useRef<Record<string, any>>({});
    const [draftVersion, setDraftVersion] = useState(0);

    const buildRemarkKey = useCallback((reportId?: string, objectId?: string) => {
        return `${reportId || ''}__${objectId || ''}`;
    }, []);

    const buildRemarkAnchorId = useCallback(
        (reportId?: string, objectId?: string) => {
            return `remark-anchor-${buildRemarkKey(reportId, objectId)}`;
        },
        [buildRemarkKey]
    );

    const syncDraftRemarks = useCallback(
        (items?: any[]) => {
            const next: Record<string, any> = {};
            (Array.isArray(items) ? items : []).forEach(item => {
                const key = buildRemarkKey(item?.reportId, item?.objectId);
                next[key] = item;
            });
            draftRemarkRef.current = next;
            setDraftVersion(v => v + 1);
        },
        [buildRemarkKey]
    );

    useEffect(() => {
        syncDraftRemarks(remark);
    }, [remark, syncDraftRemarks]);

    const getRemarkValue = useCallback(
        (reportId?: string, objectId?: string) => {
            if (!reportId) return '';
            const key = buildRemarkKey(reportId, objectId);
            if (draftRemarkRef.current[key]?.remark !== undefined) {
                return draftRemarkRef.current[key]?.remark || '';
            }
            return remarkMap[key]?.remark || '';
        },
        [buildRemarkKey, remarkMap]
    );

    const updateRemarkValue = useCallback(
        (reportId?: string, objectId?: string, value?: string) => {
            if (!reportId) return;
            const key = buildRemarkKey(reportId, objectId);
            const current = draftRemarkRef.current[key] || { reportId, objectId, remark: '' };
            draftRemarkRef.current[key] = { ...current, reportId, objectId, remark: value ?? '' };
        },
        [buildRemarkKey]
    );

    const handleToggleEdit = async () => {
        const next = !isEditing;
        setIsEditing(next);
        if (next) {
            void loadRemark(reportIds);
        } else {
            syncDraftRemarks(remark);
        }
    };

    useEffect(() => {
        const handleResize = () => {
            if (!isPresentationMode) {
                setPresentationZoom(1);
                return;
            }
            const availableWidth = window.innerWidth - 48;
            // Use 1440 as the base design width
            const scale = availableWidth / 1440;
            setPresentationZoom(scale);
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [isPresentationMode]);

    const timeSlots = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'];

    const anchorItems = chapterDetails;

    const handleExportPDF = async () => {
        if (!appRef.current) return;

        let interval: NodeJS.Timeout | undefined;

        try {
            setIsExporting(true);
            setExportProgress(0);

            // 模拟进度条动画
            interval = setInterval(() => {
                setExportProgress(prev => {
                    if (prev >= 90) return prev;
                    // 可以在此处添加非线性逻辑，或者简单线性
                    return prev + 2;
                });
            }, 100);

            toast.info('正在生成 PDF，请稍候...');

            const filter = (node: any) => {
                // Safe check for nodes that might not be Elements
                if (!node || typeof node.hasAttribute !== 'function') {
                    return true;
                }
                return !node.hasAttribute('data-html2canvas-ignore');
            };

            // 等待 UI 渲染进度条遮罩
            await new Promise(resolve => setTimeout(resolve, 100));

            const dataUrl = await toJpeg(appRef.current, {
                filter: filter,
                backgroundColor: '#EBF6FF',
                pixelRatio: 3.0, // 提升分辨率以保证清晰度 (2.0 -> 3.0)
                quality: 0.8, // 提高 JPEG 质量 (0.6 -> 0.8)
                cacheBust: false
            });

            if (interval) clearInterval(interval);
            setExportProgress(95);

            const img = new Image();
            img.src = dataUrl;

            const imgWidth = appRef.current.scrollWidth;
            const imgHeight = appRef.current.scrollHeight;

            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'px',
                format: [imgWidth, imgHeight]
            });

            pdf.addImage(dataUrl, 'JPEG', 0, 0, imgWidth, imgHeight);

            // 格式化日期文件名: 去除分隔符，例如 2025.08.27 -> 20250827
            const dateStr = reportDate.replace(/[^\d]/g, '');
            pdf.save(`运行复盘报告${dateStr}.pdf`);

            setExportProgress(100);
            toast.success('PDF 导出成功');

            setTimeout(() => {
                setIsExporting(false);
                setExportProgress(0);
            }, 500);
        } catch (error: any) {
            if (interval) clearInterval(interval);
            setIsExporting(false);
            console.error('PDF Export Error:', error);
            toast.error(`PDF 导出失败: ${error?.message || '未知错误'}`);
        }
    };

    // 下载报告处理函数
    const handleDownloadReport = async () => {
        if (isDownloading) return;

        try {
            setIsDownloading(true);

            const response = await downloadReport({
                reportDate: reportDate,
                reportType: reportType
            });

            const blob = response.data;
            const baseName = `${projectName ?? '--'}${reportDate}运行复盘日报`;
            const fileName = `${baseName}.csv`;

            const downloadUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(downloadUrl);

            showSuccessToast('报告下载成功');
        } catch (error: any) {
            console.error('下载报告失败:', error);
            showErrorToast(`下载失败: ${error?.message || '未知错误'}`);
        } finally {
            setIsDownloading(false);
        }
    };

    const handleSaveRemarks = async () => {
        const success = await saveRemark(Object.values(draftRemarkRef.current));
        if (success) {
            setGlobalMsg({ type: 'success', msg: '编辑成功', show: true });
            setIsEditing(false);
            await loadRemark(reportIds);
        } else {
            setGlobalMsg({ type: 'error', msg: '编辑成失败', show: true });
        }
    };

    const handleCancelEdit = () => {
        syncDraftRemarks(remark);
        setIsEditing(false);
    };
    const remarkTargets = useMemo(() => {
        const targets: Array<{ reportId: string; objectId?: string; key: string; anchorId: string }> = [];
        const addTarget = (reportId?: string, objectId?: string) => {
            if (!reportId) return;
            const key = buildRemarkKey(reportId, objectId);
            targets.push({ reportId, objectId, key, anchorId: buildRemarkAnchorId(reportId, objectId) });
        };
        anchorItems.forEach(item => {
            switch (item.code) {
                case 'report_chapter_run_overview':
                case 'report_chapter_energy_analysis':
                case 'report_chapter_energy_budget':
                    addTarget(item.id, item.objectId);
                    break;
                case 'report_chapter_ac':
                    item.children?.forEach((subItem: any) => {
                        switch (subItem.code) {
                            case 'report_chapter_cooling_analysis':
                            case 'report_chapter_env_quality':
                                addTarget(subItem.id, subItem.objectId);
                                break;
                            case 'cooling-system':
                            case 'report_chapter_cooling_sys_run':
                                subItem.children?.forEach((child: any) => {
                                    addTarget(child.id, child.objectId);
                                    const systemData = coldStationSectionHandler(child, subItem.chapterData, reportDate) || {};
                                    systemData?.airConditioningControlZones?.forEach((zone: any) => {
                                        addTarget(child.id, zone?.id || zone?.objectId);
                                    });
                                });
                                break;
                            case 'ac-control-zone':
                                addTarget(subItem.id, 'north-zone');
                                addTarget(subItem.id, 'pump-group-1');
                                break;
                            default:
                                break;
                        }
                    });
                    break;
                case 'lighting-root':
                case 'ventilation-root':
                    addTarget(item.id, item.objectId);
                    break;
                default:
                    break;
            }
        });
        return targets;
    }, [anchorItems, buildRemarkAnchorId, buildRemarkKey]);

    if (loading) {
        return <Loading size={100} showText={false} className="fixed inset-0 bg-white" />;
    }
    return (
        <ScheduleInfoCodeDefineProvider>
            <TreeBuildFloorContext.Provider value={{ getBuildOrFloorById, buildData }}>
                <div ref={appRef} className="min-h-screen bg-[#EBF6FF] text-[#333] font-sans relative overflow-x-hidden">
                    {/* Anchor Sidebar */}
                    <div
                        style={{
                            opacity: isPresentationMode ? 0 : 1,
                            pointerEvents: isPresentationMode ? 'none' : 'auto',
                            transition: 'opacity 0.2s'
                        }}
                    >
                        <AnchorSidebar items={anchorItems} />
                    </div>

                    {/* Edit Footer Actions */}
                    {isEditing && (
                        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E5E6EB] p-4 flex gap-4 z-50 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] pl-[60px] justify-start">
                            <div
                                onClick={handleSaveRemarks}
                                className="px-6 py-2 bg-[#246FE5] text-white rounded-[4px] hover:bg-[#1B5BC4] font-medium text-sm transition-colors cursor-pointer"
                            >
                                确定
                            </div>
                            <div
                                onClick={handleCancelEdit}
                                className="px-6 py-2 bg-white border border-[#E5E6EB] text-[#4E5969] rounded-[4px] hover:bg-gray-50 font-medium text-sm transition-colors cursor-pointer"
                            >
                                取消
                            </div>
                        </div>
                    )}

                    {/* Background Decoration */}
                    <div className="absolute top-[50px] left-0 right-0 h-[600px] pointer-events-none z-0 opacity-100">
                        <ImageWithFallback src={bgPattern} className="w-full h-full object-cover object-top" alt="background decoration" />
                    </div>

                    <Header
                        isEditing={isEditing}
                        onToggleEdit={handleToggleEdit}
                        isExporting={isExporting}
                        exportProgress={exportProgress}
                        onExportPDF={handleExportPDF}
                        isPresentationMode={isPresentationMode}
                        onPresentationClick={() => setIsPresentationMode(!isPresentationMode)}
                        isSimulating={isSimulating}
                        reportDate={reportDate}
                        onDownloadReport={handleDownloadReport}
                        isDownloading={isDownloading}
                        hasDownloadPermission={hasDownloadPermission}
                    />

                    <GlobalMessage type={globalMsg.type} message={globalMsg.msg} visible={globalMsg.show} onClose={() => setGlobalMsg(prev => ({ ...prev, show: false }))} />

                    <main
                        className={`max-w-[1440px] mx-auto space-y-8 relative z-10 transition-transform origin-top-center ${isPresentationMode ? 'mt-[74px]' : 'mt-[74px] px-6'}`}
                        style={{
                            transform: isPresentationMode ? `scale(${presentationZoom}) translateZ(0)` : 'translateZ(0)',
                            willChange: 'transform',
                            transformOrigin: isPresentationMode ? 'top center' : 'none',
                            marginBottom: isPresentationMode ? '0' : '80px',
                            height: isPresentationMode ? '100vh' : 'auto'
                        }}
                    >
                        {/* 1. Header Area with Waves */}
                        <div className="relative -mx-6 -mt-8 px-6 pt-12 pb-7 overflow-hidden" style={{ marginBottom: 0 }}>
                            <div className="relative z-10 flex flex-col gap-[4px]">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <h1 className="text-[30px] font-bold text-[#2E3742]">运行复盘报告{reportDate}</h1>
                                        <span className="px-2 py-0.5 bg-[#CBF7F3] text-[#00A2A7] text-sm font-medium rounded">日报</span>
                                    </div>
                                    {handleToggleEdit &&
                                        !isPresentationMode &&
                                        (hasEditPower ? (
                                            <div
                                                onClick={handleToggleEdit}
                                                className="bg-white flex items-center justify-center px-[16px] py-[5px] relative rounded-[4px] transition-colors cursor-pointer hover:bg-gray-50"
                                            >
                                                <div aria-hidden="true" className="absolute border border-[#c4c9cf] border-solid inset-0 pointer-events-none rounded-[4px]" />
                                                <div className="flex flex-col items-center justify-center relative shrink-0">
                                                    <div className="flex gap-[4px] items-center justify-center relative shrink-0">
                                                        <p className="font-['Microsoft_YaHei_UI',sans-serif] leading-[22px] not-italic relative shrink-0 text-[14px] text-center text-[#1b2129]">
                                                            {isEditing ? '退出编辑' : '编辑'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <MTipsTooltip
                                                text={
                                                    <div className="bg-[#E8ECF0] flex items-center justify-center px-[16px] py-[5px] relative rounded-[4px] transition-colors cursor-not-allowed">
                                                        <div
                                                            aria-hidden="true"
                                                            className="absolute border border-[#c4c9cf] border-solid inset-0 pointer-events-none rounded-[4px]"
                                                        />
                                                        <div className="flex flex-col items-center justify-center relative shrink-0">
                                                            <div className="flex gap-[4px] items-center justify-center relative shrink-0">
                                                                <p className="font-['Microsoft_YaHei_UI',sans-serif] leading-[22px] not-italic relative shrink-0 text-[14px] text-center text-[#C4C9CF]">
                                                                    {isEditing ? '退出编辑' : '编辑'}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                }
                                                content="暂无操作权限，如有需要请联系管理员新增权限"
                                                wrapperClassName="inline-block"
                                                className=""
                                                alwaysShowTooltip={true}
                                            />
                                        ))}
                                </div>
                                <div className="flex items-center gap-2 text-[#626C78] text-sm">
                                    <Calendar size={14} />
                                    报告日期：{reportDate?.replace(/^\d{4}\./, '') || ''}
                                </div>
                            </div>
                        </div>
                        <ReportSections anchorItems={anchorItems} reportDate={reportDate} buildRemarkAnchorId={buildRemarkAnchorId} />
                        <RemarkLayer targets={remarkTargets} isEditing={isEditing} getRemarkValue={getRemarkValue} onChange={updateRemarkValue} version={draftVersion} />
                    </main>

                    <Toaster position="top-center" />
                </div>
            </TreeBuildFloorContext.Provider>
        </ScheduleInfoCodeDefineProvider>
    );
}
