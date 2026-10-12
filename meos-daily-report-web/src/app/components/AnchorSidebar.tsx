import React, { useMemo } from "react";
import { Anchor, ConfigProvider } from "antd";
import { TableText } from "@/app/components/common/TableText";
import { qiankunWindow } from "@/utils/helper";
import { qiankunStore } from "@/store/qiankunStore";

interface AnchorItem {
  id: string;
  label: string;
  children?: AnchorItem[];
}

interface AnchorSidebarProps {
  items: AnchorItem[];
}

export const AnchorSidebar: React.FC<AnchorSidebarProps> = ({ items }) => {
  // 获取正确的滚动容器
  const getScrollContainer = useMemo(() => {
    return () => {
      // 在乾坤微前端环境中
      if (qiankunWindow.__POWERED_BY_QIANKUN__) {
        const props = qiankunStore.getProps();
        // 尝试从主应用props中获取container
        if (props?.container) {
          // 如果container存在,返回其父元素或本身作为滚动容器
          return props.container.querySelector('#app') ? props.container.querySelector('#app') : document.getElementById('app');
        }
      }
      // 默认使用window
      return window;
    };
  }, []);

  // Transform items to Ant Design Anchor format
  const transformItems = (list: AnchorItem[]): any[] => {
    return list.map((item) => ({
      key: item.id,
      href: `#${item.id}`,
      title: (
        <div className="font-medium text-[14px] w-full cursor-pointer overflow-hidden block" title="">
          <TableText text={item.label} maxLines={1} className="cursor-pointer" tooltipOffsetX={24} />
        </div>
      ),
      children: item.children ? transformItems(item.children) : undefined,
    }));
  };

  const antdItems = transformItems(items);

  return (
    <div className="hidden min-[1600px]:block fixed left-1/2 ml-[704px] top-[100px] w-[160px] z-40 cursor-default">
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#246FE5',
            colorText: '#626C78',
            fontSize: 14,
          },
          components: {
            Anchor: {
              linkPaddingBlock: 6,
              linkPaddingInlineStart: 16,
            }
          }
        }}
      >
        <Anchor
          items={antdItems}
          targetOffset={200} // Header (50px) + Padding (~30px) + 报告名称区域
          showInkInFixed={true}
          affix={false} // We handle positioning via CSS class
          getContainer={getScrollContainer}
          getCurrentAnchor={(activeLink) => activeLink}
          onClick={(e) => e.preventDefault()} // Let AntD handle the scrolling
        />
      </ConfigProvider>
    </div>
  );
};
