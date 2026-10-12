import svgPaths from "./svg-39mf360yq5";

function ComponentSuccessFill() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="component/success.fill">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="component/success.fill">
          <path d={svgPaths.p34811000} fill="var(--fill-0, white)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Y() {
  return <div className="shrink-0 size-[0.001px]" data-name="y" />;
}

function X() {
  return <div className="shrink-0 size-[0.001px]" data-name="x" />;
}

function Placeholder() {
  return (
    <div className="content-stretch flex gap-[164px] items-start relative shrink-0" data-name="placeholder">
      <Y />
      <X />
    </div>
  );
}

function Text() {
  return (
    <div className="content-stretch flex flex-col items-start py-[3px] relative shrink-0" data-name="text">
      <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[22px] not-italic relative shrink-0 text-[14px] text-white">成功信息</p>
      <Placeholder />
    </div>
  );
}

function X1() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="x">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="x">
          <path clipRule="evenodd" d={svgPaths.p232edd80} fill="var(--fill-0, white)" fillRule="evenodd" id="Union" />
        </g>
      </svg>
    </div>
  );
}

function Component() {
  return (
    <div className="content-stretch flex items-center justify-end relative shrink-0" data-name="右边">
      <X1 />
    </div>
  );
}

export default function Message() {
  return (
    <div className="bg-[#3fbe72] content-stretch flex gap-[8px] items-center justify-center pl-[16px] pr-[12px] py-[6px] relative rounded-[4px] size-full" data-name="全局提示&Message">
      <ComponentSuccessFill />
      <Text />
      <Component />
    </div>
  );
}