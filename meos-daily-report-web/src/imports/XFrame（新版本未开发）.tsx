import svgPaths from "./svg-ggr56iixct";

function Meos() {
  return (
    <div className="absolute inset-[-1.42%_9.26%_-1.42%_0]" data-name="meos">
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
  );
}

function Group() {
  return (
    <div className="absolute contents inset-[-1.42%_9.26%_-1.42%_0]">
      <Meos />
    </div>
  );
}

function Frame1() {
  return (
    <div className="h-[13.333px] relative shrink-0 w-[60px]">
      <Group />
    </div>
  );
}

function Frame() {
  return (
    <div className="content-stretch flex gap-[2px] items-center justify-center relative shrink-0">
      <p className="font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[22px] not-italic relative shrink-0 text-[#1b2129] text-[14px] text-center whitespace-pre">禹数2#楼运行复盘报告</p>
    </div>
  );
}

function Component() {
  return (
    <div className="content-stretch flex gap-[6px] items-center justify-center relative shrink-0" data-name="内容">
      <Frame />
    </div>
  );
}

function Component1() {
  return (
    <div className="content-stretch flex h-[32px] items-center px-[8px] py-[5px] relative rounded-[4px] shrink-0" data-name="一级菜单">
      <Component />
    </div>
  );
}

function Component2() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] items-center min-h-px min-w-px overflow-clip relative" data-name="_左侧导航菜单">
      <Frame1 />
      <div className="bg-[#c4c9cf] h-[14px] shrink-0 w-px" data-name="分割线" />
      <Component1 />
    </div>
  );
}

function XFrame() {
  return (
    <div className="bg-white flex-[1_0_0] min-h-px min-w-px relative shadow-[0px_2px_10px_0px_rgba(27,33,41,0.1)]" data-name="X-Frame（新版本-未开发）">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex gap-[4px] items-center px-[16px] py-[8px] relative w-full">
          <Component2 />
        </div>
      </div>
    </div>
  );
}

export default function XFrame1() {
  return (
    <div className="content-stretch flex items-center relative size-full" data-name="X-Frame（新版本-未开发）">
      <XFrame />
    </div>
  );
}