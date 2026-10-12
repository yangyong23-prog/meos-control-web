import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Search, ChevronRight } from "lucide-react";

interface TreeNode {
  id: string;
  label: string;
  level: number;
  isLeaf?: boolean;
  expanded?: boolean;
  children?: TreeNode[];
}

const MOCK_TREE: TreeNode[] = [
  {
    id: "1",
    label: "建筑",
    level: 0,
    expanded: true,
    children: [
      {
        id: "1-1",
        label: "项目",
        level: 1,
        expanded: true,
        children: [
            { id: "1-1-1", label: "制冷间#1", level: 2, isLeaf: true },
            { id: "1-1-2", label: "制冷间#2", level: 2, isLeaf: true },
        ]
      },
      { id: "1-2", label: "选项一", level: 1, isLeaf: true },
    ]
  },
  { id: "2", label: "项目", level: 0, expanded: false },
  { id: "3", label: "项目", level: 0, expanded: false },
  { id: "4", label: "项目", level: 0, expanded: false },
];

export const SpaceTreeFilter = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState("制冷间#1");
  const [treeData, setTreeData] = useState(MOCK_TREE);
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

  const toggleExpand = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const toggleNode = (nodes: TreeNode[]): TreeNode[] => {
      return nodes.map(node => {
        if (node.id === id) {
          return { ...node, expanded: !node.expanded };
        }
        if (node.children) {
          return { ...node, children: toggleNode(node.children) };
        }
        return node;
      });
    };
    setTreeData(toggleNode(treeData));
  };

  const renderTree = (nodes: TreeNode[]) => {
    return nodes.map(node => (
      <div key={node.id}>
        <div 
          className={`flex items-center py-1.5 px-2 cursor-pointer text-sm hover:bg-[#F5F7FA]
            ${node.isLeaf && selected === node.label ? 'text-[#2481F2] bg-[#EBF3FF] hover:bg-[#EBF3FF]' : 'text-[#1B2129]'}
          `}
          style={{ paddingLeft: `${node.level * 16 + 8}px` }}
          onClick={() => {
            if (node.isLeaf) {
              setSelected(node.label);
              setIsOpen(false);
            } else {
               // Optional: click parent to expand
               // But usually parent isn't selectable
            }
          }}
        >
          {!node.isLeaf && (
            <div 
              className="mr-1 p-0.5 hover:bg-gray-200 rounded cursor-pointer text-[#8B949E]"
              onClick={(e) => toggleExpand(node.id, e)}
            >
              {node.expanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
            </div>
          )}
          {node.isLeaf && <span className="w-4 mr-1" />} {/* Indent for leaf */}
          <span>{node.label}</span>
        </div>
        {node.expanded && node.children && renderTree(node.children)}
      </div>
    ));
  };

  return (
    <div className="relative" ref={containerRef}>
      <div 
        className="flex items-center gap-2 cursor-pointer select-none group"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-sm text-[#626C78]">空间名称：</span>
        <div className="flex items-center gap-1">
          <span className="text-sm font-medium text-[#1B2129]">{selected}</span>
          <ChevronDown 
            size={12} 
            className={`text-[#8B949E] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
          />
        </div>
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-[240px] bg-white rounded-lg shadow-xl border border-[#E8ECF0] flex flex-col z-50">
          {/* Search */}
          <div className="p-3 border-b border-[#E8ECF0]">
            <div className="relative">
               <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#8B949E]" />
               <input 
                 type="text" 
                 placeholder="搜索"
                 className="w-full h-8 pl-8 pr-3 text-xs border border-[#E8ECF0] rounded-md focus:outline-none focus:border-[#2481F2] placeholder-[#8B949E]"
               />
            </div>
          </div>
          
          {/* Tree */}
          <div className="py-2 max-h-[240px] overflow-y-auto custom-scrollbar">
             {renderTree(treeData)}
          </div>
        </div>
      )}
    </div>
  );
};
