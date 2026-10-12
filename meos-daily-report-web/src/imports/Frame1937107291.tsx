import svgPaths from "./svg-vociqekjf8";

function Box() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="_基础组件/多选Box">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="_åºç¡ç»ä»¶/å¤éBox">
          <rect fill="var(--fill-0, #246FE5)" height="16" rx="2" width="16" />
          <path d={svgPaths.p1e8bd4c0} fill="var(--fill-0, white)" id="Rectangle 26" />
        </g>
      </svg>
    </div>
  );
}

function Checkbox() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="多选框&Checkbox">
      <Box />
      <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[22px] not-italic relative shrink-0 text-[#1b2129] text-[14px]">仅看品质异常空间</p>
    </div>
  );
}

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
    <div className="h-[32px] relative shrink-0 w-[290px]">
      <Frame />
    </div>
  );
}

function Frame3() {
  return (
    <div className="content-stretch flex gap-[10px] items-center relative shrink-0">
      <Checkbox />
      <Frame1 />
    </div>
  );
}

export default function Frame2() {
  return (
    <div className="content-stretch flex items-center relative size-full">
      <Frame3 />
    </div>
  );
}