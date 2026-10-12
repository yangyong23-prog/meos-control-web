import svgPaths from "./svg-hybku1mx2l";

function Frame5() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <div className="bg-[#2481f2] h-[3px] shrink-0 w-[16px]" data-name="矩形" />
      <p className="css-ew64yg font-['Microsoft_YaHei:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#626c78] text-[14px]">水阀#1</p>
    </div>
  );
}

function Frame10() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Frame5 />
    </div>
  );
}

function Frame11() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Frame10 />
    </div>
  );
}

function Frame14() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Frame11 />
    </div>
  );
}

function Frame7() {
  return (
    <div className="content-stretch flex h-[32px] items-center justify-between overflow-clip relative shrink-0 w-full">
      <p className="css-ew64yg font-['Microsoft_YaHei:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#2e3742] text-[16px]">开闭状态</p>
      <Frame14 />
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex gap-[20px] items-center py-[10px] relative shrink-0 w-full">
      <p className="css-4hzbpn font-['PingFang_SC:Regular',sans-serif] leading-[18px] not-italic relative shrink-0 text-[#646c73] text-[12px] text-right w-[24px]">开启</p>
      <div className="flex-[1_0_0] h-0 min-h-px min-w-px relative" data-name="line">
        <div className="absolute inset-[-0.5px_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1100 1">
            <path d="M1100 0.5H0" id="line" stroke="var(--stroke-0, #E4E6E7)" strokeDasharray="3 3" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Frame3() {
  return (
    <div className="content-stretch flex gap-[20px] items-center pt-[10px] relative shrink-0 w-full">
      <p className="css-4hzbpn font-['PingFang_SC:Regular',sans-serif] leading-[18px] not-italic relative shrink-0 text-[#646c73] text-[12px] text-right w-[24px]">关闭</p>
      <div className="flex-[1_0_0] h-0 min-h-px min-w-px relative" data-name="line">
        <div className="absolute inset-[-0.5px_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1100 1">
            <path d="M1100 0.5H0" id="line" stroke="var(--stroke-0, #C4C9CF)" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function x() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start justify-between min-h-px min-w-px overflow-clip relative w-full" data-name="图表X轴">
      <Frame2 />
      <Frame3 />
    </div>
  );
}

function Component() {
  return (
    <div className="h-[18px] relative shrink-0 w-full" data-name="横坐标">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex font-['Noto_Sans_SC:Regular',sans-serif] font-normal items-center justify-between leading-[14px] pl-[31px] relative size-full text-[#8d9399] text-[12px] text-center">
          <p className="css-ew64yg relative shrink-0" style={{ fontFeatureSettings: "'pwid'" }}>
            00:00
          </p>
          <p className="css-ew64yg relative shrink-0" style={{ fontFeatureSettings: "'pwid'" }}>
            04:00
          </p>
          <p className="css-ew64yg relative shrink-0" style={{ fontFeatureSettings: "'pwid'" }}>
            08:00
          </p>
          <p className="css-ew64yg relative shrink-0" style={{ fontFeatureSettings: "'pwid'" }}>
            12:00
          </p>
          <p className="css-ew64yg relative shrink-0" style={{ fontFeatureSettings: "'pwid'" }}>
            16:00
          </p>
          <p className="css-ew64yg relative shrink-0" style={{ fontFeatureSettings: "'pwid'" }}>
            18:00
          </p>
          <p className="css-ew64yg relative shrink-0" style={{ fontFeatureSettings: "'pwid'" }}>
            20:00
          </p>
          <p className="css-4hzbpn relative shrink-0 w-[30px]" style={{ fontFeatureSettings: "'pwid'" }}>
            24:00
          </p>
        </div>
      </div>
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col h-full items-start min-h-px min-w-px relative">
      <x />
      <Component />
    </div>
  );
}

function Component1() {
  return (
    <div className="content-stretch flex flex-[1_0_0] items-start min-h-px min-w-px relative w-full z-[1]" data-name="图表">
      <Frame1 />
    </div>
  );
}

function Frame4() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col isolate items-start min-h-px min-w-px relative w-full">
      <Component1 />
    </div>
  );
}

function Component2() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-h-px min-w-px relative w-full" data-name="动态图表">
      <Frame4 />
    </div>
  );
}

function Frame13() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <div className="bg-[#2481f2] h-[3px] shrink-0 w-[16px]" data-name="矩形" />
      <p className="css-ew64yg font-['Microsoft_YaHei:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#626c78] text-[14px]">水阀#1：</p>
    </div>
  );
}

function Frame6() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Frame13 />
      <p className="css-ew64yg font-['Microsoft_YaHei:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#1b2129] text-[14px]">开启</p>
    </div>
  );
}

function Frame12() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0">
      <Frame6 />
    </div>
  );
}

function Frame() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col gap-[12px] items-start left-[439px] p-[12px] rounded-[4px] top-[32px]">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-[1.221px] border-solid inset-[-1.221px] pointer-events-none rounded-[5.221px] shadow-[0px_3.664px_14.655px_0px_rgba(27,33,41,0.12),0px_0.611px_3.664px_0px_rgba(27,33,41,0.08)]" />
      <p className="css-ew64yg font-['Microsoft_YaHei:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#2e3742] text-[14px]">2025年8月27日 10:30</p>
      <div className="h-0 relative shrink-0 w-full">
        <div className="absolute inset-[-0.5px_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 146 1">
            <path d="M0 0.5H146" id="Vector 4527" stroke="var(--stroke-0, #E1E5EB)" />
          </svg>
        </div>
      </div>
      <Frame12 />
    </div>
  );
}

function Frame8() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] h-[162px] items-start relative shrink-0 w-full">
      <Component2 />
      <div className="absolute h-[116px] left-[48px] top-[19px] w-[1085.5px]">
        <div className="absolute inset-[-0.43%_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1085.5 117">
            <path d={svgPaths.p24b88400} id="Vector 4575" stroke="var(--stroke-0, #246FE5)" />
          </svg>
        </div>
      </div>
      <div className="absolute left-[439px] size-[8px] top-[15px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 8">
          <circle cx="4" cy="4" fill="var(--fill-0, white)" id="Ellipse 2" r="3" stroke="var(--stroke-0, #2481F2)" strokeWidth="2" />
        </svg>
      </div>
      <Frame />
    </div>
  );
}

function Frame15() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0 w-full">
      <Frame7 />
      <Frame8 />
    </div>
  );
}

export default function Frame9() {
  return (
    <div className="bg-white content-stretch flex flex-col items-start px-[12px] py-[16px] relative rounded-[8px] size-full">
      <div aria-hidden="true" className="absolute border border-solid border-white inset-0 pointer-events-none rounded-[8px]" />
      <Frame15 />
    </div>
  );
}