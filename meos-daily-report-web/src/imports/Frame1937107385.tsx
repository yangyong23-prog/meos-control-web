import svgPaths from "./svg-wsyutytnrh";

function Component() {
  return (
    <div className="content-stretch flex font-['Microsoft_YaHei_UI:Regular',sans-serif] items-center justify-center leading-[22px] not-italic relative shrink-0 text-[14px]" data-name="内容">
      <p className="css-ew64yg relative shrink-0 text-[#626c78]">类型：</p>
      <p className="css-ew64yg relative shrink-0 text-[#1b2129] text-center">全部</p>
    </div>
  );
}

function Component1() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="下拉图标">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="ä¸æå¾æ ">
          <path clipRule="evenodd" d={svgPaths.p2ad65d40} fill="var(--fill-0, #C4C9CF)" fillRule="evenodd" id="Union" />
        </g>
      </svg>
    </div>
  );
}

function Select() {
  return (
    <div className="content-stretch flex gap-[4px] items-center pl-[12px] pr-[8px] py-[5px] relative rounded-[4px] shrink-0" data-name="选择器&Select">
      <Component />
      <Component1 />
    </div>
  );
}

function Component2() {
  return (
    <div className="content-stretch flex font-['Microsoft_YaHei_UI:Regular',sans-serif] items-center justify-center leading-[22px] not-italic relative shrink-0 text-[14px]" data-name="内容">
      <p className="css-ew64yg relative shrink-0 text-[#626c78]">空间名称：</p>
      <p className="css-ew64yg relative shrink-0 text-[#c4c9cf] text-center">请选择</p>
    </div>
  );
}

function Component3() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="下拉图标">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="ä¸æå¾æ ">
          <path clipRule="evenodd" d={svgPaths.p2ad65d40} fill="var(--fill-0, #C4C9CF)" fillRule="evenodd" id="Union" />
        </g>
      </svg>
    </div>
  );
}

function Select1() {
  return (
    <div className="content-stretch flex gap-[4px] items-center overflow-clip pl-[12px] pr-[8px] py-[5px] relative rounded-[4px] shrink-0" data-name="选择器&Select">
      <Component2 />
      <Component3 />
    </div>
  );
}

function Frame() {
  return (
    <div className="absolute content-stretch flex gap-[4px] items-center left-[-7px] top-0">
      <Select />
      <div className="bg-[#d9d9d9] h-[13px] shrink-0 w-px" />
      <Select1 />
    </div>
  );
}

function Frame1() {
  return (
    <div className="absolute h-[32px] left-[64px] top-[51px] w-[290px]">
      <Frame />
    </div>
  );
}

function Component4() {
  return (
    <div className="absolute inset-[2.97%_3.01%]" data-name="搜索">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15.0374 15.0492">
        <g id="æç´¢">
          <path d={svgPaths.p31c5baf0} fill="var(--fill-0, #8B949E)" id="ç´çº¿ 6å¤ä»½ 2" />
          <path d={svgPaths.p2f80fb00} fill="var(--fill-0, #1B2129)" id="æ¤­åå½¢å¤ä»½ 20" />
        </g>
      </svg>
    </div>
  );
}

function Search() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="search">
      <Component4 />
    </div>
  );
}

function Component5() {
  return (
    <div className="bg-white relative rounded-[4px] shrink-0 w-full" data-name="搜索">
      <div aria-hidden="true" className="absolute border border-[#c4c9cf] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[8px] items-center pl-[12px] pr-[8px] py-[5px] relative w-full">
          <Search />
          <p className="css-4hzbpn flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[22px] min-h-px min-w-px not-italic relative text-[#c4c9cf] text-[14px]">搜索</p>
        </div>
      </div>
    </div>
  );
}

function Component6() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col items-center justify-center left-0 pb-[4px] pt-[12px] px-[12px] top-0 w-[300px]" data-name="搜索区域">
      <Component5 />
    </div>
  );
}

function Component7() {
  return (
    <div className="relative rounded-[4px] shrink-0 size-[16px]" data-name="展开箭头">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="å±å¼">
          <path clipRule="evenodd" d={svgPaths.p2ad65d40} fill="var(--fill-0, #8B949E)" fillRule="evenodd" id="Union" />
        </g>
      </svg>
    </div>
  );
}

function Component8() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] items-center min-h-px min-w-px py-[9px] relative" data-name="内容">
      <Component7 />
      <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[22px] not-italic relative shrink-0 text-[#1b2129] text-[14px]">建筑</p>
    </div>
  );
}

function Component9() {
  return (
    <div className="bg-white relative shrink-0 w-full" data-name="一级树">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[8px] items-center pl-[8px] pr-[12px] relative w-full">
          <Component8 />
        </div>
      </div>
    </div>
  );
}

function Component10() {
  return (
    <div className="relative rounded-[4px] shrink-0 size-[16px]" data-name="展开箭头">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="å±å¼">
          <path clipRule="evenodd" d={svgPaths.p2ad65d40} fill="var(--fill-0, #8B949E)" fillRule="evenodd" id="Union" />
        </g>
      </svg>
    </div>
  );
}

function Component11() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] items-center min-h-px min-w-px py-[9px] relative" data-name="内容">
      <Component10 />
      <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[22px] not-italic relative shrink-0 text-[#1b2129] text-[14px]">楼层</p>
    </div>
  );
}

function Component12() {
  return (
    <div className="bg-white relative shrink-0 w-full" data-name="二级树">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[8px] items-center pl-[32px] pr-[12px] relative w-full">
          <Component11 />
        </div>
      </div>
    </div>
  );
}

function Component13() {
  return (
    <div className="opacity-0 relative rounded-[4px] shrink-0 size-[16px]" data-name="展开箭头">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="æ¶èµ·">
          <path clipRule="evenodd" d={svgPaths.p2211cd00} fill="var(--fill-0, #8B949E)" fillRule="evenodd" id="Union" />
        </g>
      </svg>
    </div>
  );
}

function Component14() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] items-center min-h-px min-w-px py-[9px] relative" data-name="内容">
      <Component13 />
      <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[22px] not-italic relative shrink-0 text-[#1b2129] text-[14px]">空间</p>
    </div>
  );
}

function Component15() {
  return (
    <div className="bg-white relative shrink-0 w-full" data-name="三级树">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[8px] items-center pl-[56px] pr-[12px] relative w-full">
          <Component14 />
        </div>
      </div>
    </div>
  );
}

function Component16() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="二级树">
      <Component12 />
      <Component15 />
    </div>
  );
}

function Component17() {
  return (
    <div className="relative rounded-[4px] shrink-0 size-[16px]" data-name="展开箭头">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="æ¶èµ·">
          <path clipRule="evenodd" d={svgPaths.p2211cd00} fill="var(--fill-0, #8B949E)" fillRule="evenodd" id="Union" />
        </g>
      </svg>
    </div>
  );
}

function Component18() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] items-center min-h-px min-w-px py-[9px] relative" data-name="内容">
      <Component17 />
      <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[22px] not-italic relative shrink-0 text-[#1b2129] text-[14px]">选项一</p>
    </div>
  );
}

function Component19() {
  return (
    <div className="bg-white relative shrink-0 w-full" data-name="二级树">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[8px] items-center pl-[32px] pr-[12px] relative w-full">
          <Component18 />
        </div>
      </div>
    </div>
  );
}

function Component20() {
  return (
    <div className="bg-white relative shrink-0 w-full" data-name="条目">
      <div className="content-stretch flex flex-col items-start pl-[8px] relative w-full">
        <Component9 />
        <Component16 />
        <Component19 />
      </div>
    </div>
  );
}

function Component21() {
  return (
    <div className="relative rounded-[4px] shrink-0 size-[16px]" data-name="展开箭头">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="æ¶èµ·">
          <path clipRule="evenodd" d={svgPaths.p2211cd00} fill="var(--fill-0, #8B949E)" fillRule="evenodd" id="Union" />
        </g>
      </svg>
    </div>
  );
}

function Component22() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] items-center min-h-px min-w-px py-[9px] relative" data-name="内容">
      <Component21 />
      <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[22px] not-italic relative shrink-0 text-[#1b2129] text-[14px]">项目</p>
    </div>
  );
}

function Component23() {
  return (
    <div className="bg-white relative shrink-0 w-full" data-name="条目">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[8px] items-center pl-[8px] pr-[12px] relative w-full">
          <Component22 />
        </div>
      </div>
    </div>
  );
}

function Component24() {
  return (
    <div className="relative rounded-[4px] shrink-0 size-[16px]" data-name="展开箭头">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="æ¶èµ·">
          <path clipRule="evenodd" d={svgPaths.p2211cd00} fill="var(--fill-0, #8B949E)" fillRule="evenodd" id="Union" />
        </g>
      </svg>
    </div>
  );
}

function Component25() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] items-center min-h-px min-w-px py-[9px] relative" data-name="内容">
      <Component24 />
      <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[22px] not-italic relative shrink-0 text-[#1b2129] text-[14px]">选项一</p>
    </div>
  );
}

function Component26() {
  return (
    <div className="bg-white relative shrink-0 w-full" data-name="条目">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[8px] items-center pl-[8px] pr-[12px] relative w-full">
          <Component25 />
        </div>
      </div>
    </div>
  );
}

function Tree() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col items-start left-0 pb-[8px] px-[4px] right-0 top-[48px]" data-name="树&Tree">
      <Component20 />
      {[...Array(3).keys()].map((_, i) => (
        <Component23 key={i} />
      ))}
      {[...Array(3).keys()].map((_, i) => (
        <Component26 key={i} />
      ))}
    </div>
  );
}

function Component27() {
  return (
    <div className="h-[348px] relative shrink-0 w-full" data-name="内部">
      <Component6 />
      <Tree />
    </div>
  );
}

function Component28() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[94px] overflow-clip right-[296px] rounded-[4px] shadow-[0px_3px_12px_0px_rgba(27,33,41,0.12),0px_0.5px_3px_0px_rgba(27,33,41,0.08)] top-[120px]" data-name="下拉面板">
      <Component27 />
    </div>
  );
}

export default function Frame2() {
  return (
    <div className="bg-white relative size-full">
      <Frame1 />
      <Component28 />
    </div>
  );
}