import { useCallback, useState } from 'react';
import { getReportChapterTree, getReportChapterDetail, getListTreeBuildingFloorSpace } from '../../apis/reportApi';
import { BuildFloorItem } from './useTreeBuildFloor';
import { isEmpty } from 'lodash';
// 章节树节点类型定义
interface ChapterNode {
    id: string;
    name: string;
    children?: ChapterNode[];
    [key: string]: any;
}

// 章节详情数据类型定义
interface ChapterDetail {
    id: string;
    data: any;
}

// Hook返回值类型
interface UseDailyDetailReturn {
    chapterDetails: ChapterNode[];
    reportIds: string[];
    loading: boolean;
    error: string | null;
    loadDailyReport: (reportDate: string, reportType: string) => Promise<void>;
    getBuildOrFloorById: (id?: string | number) => BuildFloorItem | undefined;
    buildData: any[];
}

export default (): UseDailyDetailReturn => {
    const [chapterDetails, setChapterDetails] = useState<ChapterNode[]>([]);
    const [reportIds, setReportIds] = useState<string[]>([]);
    const [buildFloorMap, setBuildFloorMap] = useState<Map<string, any>>(new Map());
    const [buildData, setBuildFloorData] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    // 加载日报报告数据
    const loadDailyReport = async (reportDate: string, reportType = 'daily') => {
        setLoading(true);
        setError(null);

        try {
            fetchTreeBuildFloorData();
            // 1. 获取报告章节目录树
            const treeResponse = await getReportChapterTree({
                reportDate,
                reportType
            });

            if (treeResponse.data.code === '00000') {
                const treeData = treeResponse.data.data || [];

                // 2. 提取所有章节ID
                const chapterIds: string[] = [];
                const extractChapterIds = (nodes: ChapterNode[]) => {
                    nodes.forEach(node => {
                        if (node.id) {
                            chapterIds.push(node.id);
                        }
                        if (node.children && node.children.length > 0) {
                            extractChapterIds(node.children);
                        }
                    });
                };

                extractChapterIds(treeData);

                // 3. 获取各章节详情数据
                if (chapterIds.length > 0) {
                    setReportIds(chapterIds);
                    const detailResponse = await getReportChapterDetail(chapterIds);

                    if (detailResponse.data.code === '00000') {
                        const detailData = detailResponse.data.data || [];

                        // 处理章节详情数据
                        const { chapterDetails } = processChapterDetails(detailData, treeData);

                        setChapterDetails(chapterDetails);
                    }
                }
            } else {
                throw new Error(treeResponse.data.message || '获取章节目录失败');
            }
        } catch (err: any) {
            const errorMessage = err.message || '加载日报数据失败';
            setError(errorMessage);
            console.error('Load daily report error:', err);
        } finally {
            setLoading(false);
        }
    };

    // 处理章节详情数据转换
    const processChapterDetails = (detailData: any[], treeData: any[]) => {
        const idMapDetail = detailData.reduce((acc, detail) => {
            acc[detail.id] = detail;
            return acc;
        }, {} as Record<string, ChapterDetail>);
        // 根据章节树结构来组织数据，将子章节的详情数据拉平到对应的一级节点
        // 同时处理同一级兄弟节点间可能存在的相同reportChapter情况
        const organizeDataByTreeStructure = (nodes: any[], parentReportChapter?: string) => {
            return nodes
                .map(node => {
                    // 查找与当前节点匹配的详情数据
                    const matchingDetail = idMapDetail[node.id];

                    const isLeaf = !node.children || node.children?.length === 0;
                    const newChildren: any[] | null = !isLeaf ? organizeDataByTreeStructure(node.children, parentReportChapter) : null;

                    let chapterDataWithReportChapter: any = { id: node.id, code: node.code, label: node.name || '', children: newChildren };
                    // 空调中 空调实例ID
                    if (node.objectId) {
                        chapterDataWithReportChapter.objectId = node.objectId;
                    }

                    const isEmptyChapterData = !matchingDetail?.chapterData || isEmpty(matchingDetail.chapterData);
                    // 过滤没有 chapterData 的数据或 chapterData 为空
                    if (matchingDetail && !isEmptyChapterData && Object.keys(matchingDetail.chapterData).length > 0) {
                        const { chapterData } = matchingDetail;

                        // 参考 L228-237 的处理方式，直接使用原始 chapterData 结构
                        chapterDataWithReportChapter = {
                            ...chapterDataWithReportChapter,
                            chapterData,
                            children: newChildren
                        };
                    }
                    //  else if (isLeaf && isEmptyChapterData) {
                    //     return null;
                    // }
                    return chapterDataWithReportChapter;
                })
                ?.filter(n => n && (!n.children || n.children?.length > 0));
        };

        // 开始组织数据
        const detailArr = organizeDataByTreeStructure(treeData);

        return { chapterDetails: detailArr };
    };
    const fetchTreeBuildFloorData = async () => {
        try {
            const response = await getListTreeBuildingFloorSpace({ isQuerySpace: false });
            const data: any = response.data?.data || [];
            const map = new Map();
            setBuildFloorData(data);
            data.forEach(element => {
                map.set(element.id, element);
                element.floors.forEach(floor => {
                    floor.buildingName = element.localName;
                    map.set(floor.id, floor);
                });
            });
            setBuildFloorMap(map);
        } catch (err: any) {
            const message = err?.message || '获取楼栋楼层树失败';
            throw err;
        }
    };
    const getBuildOrFloorById = (id?: string | number): BuildFloorItem | undefined => {
        return buildFloorMap.get(String(id));
    };
    return {
        chapterDetails,
        loading,
        error,
        reportIds,
        loadDailyReport,
        getBuildOrFloorById,
        buildData
    };
};
