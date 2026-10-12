import svgPaths from "./svg-ohn79aih7m";

function Frame21() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <div className="bg-[#2481f2] h-[3px] shrink-0 w-[14px]" data-name="矩形" />
      <p className="css-ew64yg font-['Microsoft_YaHei:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#626c78] text-[14px]">空间实际温度平均值：</p>
    </div>
  );
}

function Frame10() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Frame21 />
      <p className="css-ew64yg font-['Microsoft_YaHei:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#1b2129] text-[14px]">28℃</p>
    </div>
  );
}

function Frame22() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <div className="bg-[#b286f5] h-[3px] shrink-0 w-[14px]" data-name="矩形" />
      <p className="css-ew64yg font-['Microsoft_YaHei:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#626c78] text-[14px]">空间目标温度平均值：</p>
    </div>
  );
}

function Frame12() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Frame22 />
      <p className="css-ew64yg font-['Microsoft_YaHei:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#1b2129] text-[14px]">29℃</p>
    </div>
  );
}

function Frame23() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <div className="bg-[#ffd873] h-[3px] shrink-0 w-[14px]" data-name="矩形" />
      <p className="css-ew64yg font-['Microsoft_YaHei:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#626c78] text-[14px]">电价：</p>
    </div>
  );
}

function Frame13() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Frame23 />
      <p className="css-ew64yg font-['Microsoft_YaHei:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#1b2129] text-[14px]">1.6元/kwh</p>
    </div>
  );
}

function Frame20() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0">
      <Frame10 />
      <Frame12 />
      <Frame13 />
    </div>
  );
}

function Frame7() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col gap-[12px] items-start left-[391px] p-[12px] rounded-[4px] top-[74px] z-[6]">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-[1.221px] border-solid inset-[-1.221px] pointer-events-none rounded-[5.221px] shadow-[0px_3.664px_14.655px_0px_rgba(27,33,41,0.12),0px_0.611px_3.664px_0px_rgba(27,33,41,0.08)]" />
      <p className="css-ew64yg font-['Microsoft_YaHei:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#2e3742] text-[14px]">{`2025年8月25日 07:00 `}</p>
      <div className="h-0 relative shrink-0 w-full">
        <div className="absolute inset-[-0.5px_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 189 1">
            <path d="M0 0.5H189" id="Vector 4527" stroke="var(--stroke-0, #E1E5EB)" />
          </svg>
        </div>
      </div>
      <Frame20 />
    </div>
  );
}

function Frame40() {
  return (
    <div className="absolute h-[112.7px] left-[58px] top-[79px] w-[1047.03px] z-[5]">
      <div className="absolute inset-[0_-0.03%_-2.23%_-0.13%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1048.71 115.212">
          <g id="Frame 1937107290">
            <path d={svgPaths.p3fb52280} id="Vector 4577" stroke="var(--stroke-0, #246FE5)" />
            <path d={svgPaths.p3bb1d480} id="Vector 4578" stroke="var(--stroke-0, #B286F5)" />
            <path d={svgPaths.p3da27d00} id="Vector 4579" stroke="var(--stroke-0, #FFD873)" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Component() {
  return (
    <div className="content-stretch flex gap-[8px] items-center justify-center relative shrink-0" data-name="内容">
      <div className="css-g0mm18 flex flex-col font-['Microsoft_YaHei_UI:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#246fe5] text-[14px] text-center">
        <p className="css-ew64yg leading-[22px]">图表</p>
      </div>
    </div>
  );
}

function Component1() {
  return (
    <div className="bg-white content-stretch flex gap-[4px] items-center justify-center overflow-clip px-[16px] py-px relative rounded-[4px] shadow-[0px_2px_10px_0px_rgba(27,33,41,0.1)] shrink-0" data-name="页签">
      <Component />
    </div>
  );
}

function Component2() {
  return (
    <div className="content-stretch flex gap-[8px] items-center justify-center relative shrink-0" data-name="内容">
      <div className="css-g0mm18 flex flex-col font-['Microsoft_YaHei_UI:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#1b2129] text-[14px] text-center">
        <p className="css-ew64yg leading-[22px]">列表</p>
      </div>
    </div>
  );
}

function Component3() {
  return (
    <div className="content-stretch flex gap-[4px] items-center justify-center overflow-clip px-[16px] py-px relative rounded-[4px] shrink-0" data-name="页签">
      <Component2 />
    </div>
  );
}

function Tab() {
  return (
    <div className="bg-[#e8ecf0] content-stretch flex items-start p-[2px] relative rounded-[4px] shrink-0" data-name="页签&Tab">
      <Component1 />
      <Component3 />
    </div>
  );
}

function Frame34() {
  return (
    <div className="content-stretch flex gap-[12px] items-center relative shrink-0">
      <div className="css-g0mm18 flex flex-col font-['Microsoft_YaHei_UI:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#1b2129] text-[14px] text-center">
        <p className="css-ew64yg leading-[22px]">空间平均温度调节</p>
      </div>
      <Tab />
    </div>
  );
}

function Frame24() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <div className="bg-[#2481f2] h-[3px] shrink-0 w-[14px]" data-name="矩形" />
      <p className="css-ew64yg font-['Microsoft_YaHei:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#626c78] text-[14px]">实际值</p>
    </div>
  );
}

function Frame11() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Frame24 />
    </div>
  );
}

function Frame25() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <div className="bg-[#b286f5] h-[3px] shrink-0 w-[14px]" data-name="矩形" />
      <p className="css-ew64yg font-['Microsoft_YaHei:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#626c78] text-[14px]">目标值</p>
    </div>
  );
}

function Frame17() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Frame25 />
    </div>
  );
}

function Frame26() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <div className="bg-[#ffd873] h-[3px] shrink-0 w-[14px]" data-name="矩形" />
      <p className="css-ew64yg font-['Microsoft_YaHei:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#626c78] text-[14px]">电价</p>
    </div>
  );
}

function Frame16() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Frame26 />
    </div>
  );
}

function Frame8() {
  return (
    <div className="content-center flex flex-wrap gap-[12px] items-center relative shrink-0">
      <Frame11 />
      <Frame17 />
      <Frame16 />
    </div>
  );
}

function Frame31() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full z-[3]">
      <Frame34 />
      <Frame8 />
    </div>
  );
}

function Frame32() {
  return (
    <div className="content-stretch flex font-['Microsoft_YaHei_UI:Regular',sans-serif] items-center justify-between leading-[0] not-italic relative shrink-0 text-[#626c78] text-[14px] text-center w-full z-[2]">
      <div className="css-g0mm18 flex flex-col justify-center relative shrink-0">
        <p className="css-ew64yg leading-[22px]">℃</p>
      </div>
      <div className="css-g0mm18 flex flex-col justify-center relative shrink-0">
        <p className="css-ew64yg leading-[22px]">元</p>
      </div>
    </div>
  );
}

function Frame3() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] items-center min-h-px min-w-px py-[10px] relative w-full">
      <p className="css-4hzbpn font-['PingFang_SC:Regular',sans-serif] leading-[18px] not-italic relative shrink-0 text-[#646c73] text-[12px] text-right w-[18px]">40</p>
      <div className="flex-[1_0_0] h-0 min-h-px min-w-px relative" data-name="line">
        <div className="absolute inset-[-0.5px_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1070 1">
            <path d="M1070 0.5H0" id="line" stroke="var(--stroke-0, #E4E6E7)" strokeDasharray="3 3" />
          </svg>
        </div>
      </div>
      <p className="css-4hzbpn font-['PingFang_SC:Regular',sans-serif] leading-[18px] not-italic relative shrink-0 text-[12px] text-[rgba(100,108,115,0)] w-[18px]">16</p>
      <p className="css-4hzbpn font-['PingFang_SC:Regular',sans-serif] leading-[18px] not-italic relative shrink-0 text-[#646c73] text-[12px] text-right w-[18px]">2.0</p>
    </div>
  );
}

function Frame5() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] items-center min-h-px min-w-px py-[10px] relative w-full">
      <p className="css-4hzbpn font-['PingFang_SC:Regular',sans-serif] leading-[18px] not-italic relative shrink-0 text-[#646c73] text-[12px] text-right w-[18px]">32</p>
      <div className="flex-[1_0_0] h-0 min-h-px min-w-px relative" data-name="line">
        <div className="absolute inset-[-0.5px_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1070 1">
            <path d="M1070 0.5H0" id="line" stroke="var(--stroke-0, #E4E6E7)" strokeDasharray="3 3" />
          </svg>
        </div>
      </div>
      <p className="css-4hzbpn font-['PingFang_SC:Regular',sans-serif] leading-[18px] not-italic relative shrink-0 text-[12px] text-[rgba(100,108,115,0)] w-[18px]">16</p>
      <p className="css-4hzbpn font-['PingFang_SC:Regular',sans-serif] leading-[18px] not-italic relative shrink-0 text-[#646c73] text-[12px] text-right w-[18px]">1.6</p>
    </div>
  );
}

function Frame4() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] items-center min-h-px min-w-px py-[10px] relative w-full">
      <p className="css-4hzbpn font-['PingFang_SC:Regular',sans-serif] leading-[18px] not-italic relative shrink-0 text-[#646c73] text-[12px] text-right w-[18px]">24</p>
      <div className="flex-[1_0_0] h-0 min-h-px min-w-px relative" data-name="line">
        <div className="absolute inset-[-0.5px_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1070 1">
            <path d="M1070 0.5H0" id="line" stroke="var(--stroke-0, #E4E6E7)" strokeDasharray="3 3" />
          </svg>
        </div>
      </div>
      <p className="css-4hzbpn font-['PingFang_SC:Regular',sans-serif] leading-[18px] not-italic relative shrink-0 text-[12px] text-[rgba(100,108,115,0)] w-[18px]">12</p>
      <p className="css-4hzbpn font-['PingFang_SC:Regular',sans-serif] leading-[18px] not-italic relative shrink-0 text-[#646c73] text-[12px] text-right w-[18px]">1.2</p>
    </div>
  );
}

function Frame() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] items-center min-h-px min-w-px py-[10px] relative w-full">
      <p className="css-4hzbpn font-['PingFang_SC:Regular',sans-serif] leading-[18px] not-italic relative shrink-0 text-[#646c73] text-[12px] text-right w-[18px]">16</p>
      <div className="flex-[1_0_0] h-0 min-h-px min-w-px relative" data-name="line">
        <div className="absolute inset-[-0.5px_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1070 1">
            <path d="M1070 0.5H0" id="line" stroke="var(--stroke-0, #E4E6E7)" strokeDasharray="3 3" />
          </svg>
        </div>
      </div>
      <p className="css-4hzbpn font-['PingFang_SC:Regular',sans-serif] leading-[18px] not-italic relative shrink-0 text-[12px] text-[rgba(100,108,115,0)] w-[18px]">8</p>
      <p className="css-4hzbpn font-['PingFang_SC:Regular',sans-serif] leading-[18px] not-italic relative shrink-0 text-[#646c73] text-[12px] text-right w-[18px]">0.8</p>
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] items-center min-h-px min-w-px py-[10px] relative w-full">
      <p className="css-4hzbpn font-['PingFang_SC:Regular',sans-serif] leading-[18px] not-italic relative shrink-0 text-[#646c73] text-[12px] text-right w-[18px]">8</p>
      <div className="flex-[1_0_0] h-0 min-h-px min-w-px relative" data-name="line">
        <div className="absolute inset-[-0.5px_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1070 1">
            <path d="M1070 0.5H0" id="line" stroke="var(--stroke-0, #E4E6E7)" strokeDasharray="3 3" />
          </svg>
        </div>
      </div>
      <p className="css-4hzbpn font-['PingFang_SC:Regular',sans-serif] leading-[18px] not-italic relative shrink-0 text-[12px] text-[rgba(100,108,115,0)] w-[18px]">4</p>
      <p className="css-4hzbpn font-['PingFang_SC:Regular',sans-serif] leading-[18px] not-italic relative shrink-0 text-[#646c73] text-[12px] text-right w-[18px]">0.4</p>
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex gap-[8px] h-[32px] items-center pt-[10px] relative shrink-0 w-full">
      <p className="css-4hzbpn font-['PingFang_SC:Regular',sans-serif] leading-[18px] not-italic relative shrink-0 text-[#646c73] text-[12px] text-right w-[18px]">0</p>
      <div className="flex-[1_0_0] h-0 min-h-px min-w-px relative" data-name="line">
        <div className="absolute inset-[-0.5px_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1070 1">
            <path d="M1070 0.5H0" id="line" stroke="var(--stroke-0, #C4C9CF)" />
          </svg>
        </div>
      </div>
      <p className="css-4hzbpn font-['PingFang_SC:Regular',sans-serif] leading-[18px] not-italic relative shrink-0 text-[12px] text-[rgba(100,108,115,0)] w-[18px]">0</p>
      <p className="css-4hzbpn font-['PingFang_SC:Regular',sans-serif] leading-[18px] not-italic relative shrink-0 text-[#646c73] text-[12px] text-right w-[18px]">0</p>
    </div>
  );
}

function x() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start justify-between min-h-px min-w-px overflow-clip relative w-full" data-name="左侧X轴">
      <Frame3 />
      <Frame5 />
      <Frame4 />
      <Frame />
      <Frame1 />
      <Frame2 />
    </div>
  );
}

function Component4() {
  return (
    <div className="h-[18px] relative shrink-0 w-full" data-name="横坐标">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex font-['Noto_Sans_SC:Regular',sans-serif] font-normal items-center justify-between leading-[14px] pl-[40px] pr-[36px] relative size-full text-[#8d9399] text-[12px] text-center">
          <p className="css-ew64yg relative shrink-0" style={{ fontFeatureSettings: "'pwid'" }}>
            00:00
          </p>
          <p className="css-ew64yg relative shrink-0" style={{ fontFeatureSettings: "'pwid'" }}>
            01:00
          </p>
          <p className="css-ew64yg relative shrink-0" style={{ fontFeatureSettings: "'pwid'" }}>
            02:00
          </p>
          <p className="css-ew64yg relative shrink-0" style={{ fontFeatureSettings: "'pwid'" }}>
            03:00
          </p>
          <p className="css-ew64yg relative shrink-0" style={{ fontFeatureSettings: "'pwid'" }}>
            04:00
          </p>
          <p className="css-ew64yg relative shrink-0" style={{ fontFeatureSettings: "'pwid'" }}>
            05:00
          </p>
          <p className="css-ew64yg relative shrink-0" style={{ fontFeatureSettings: "'pwid'" }}>
            06:00
          </p>
          <p className="css-ew64yg relative shrink-0" style={{ fontFeatureSettings: "'pwid'" }}>
            07:00
          </p>
          <p className="css-ew64yg relative shrink-0" style={{ fontFeatureSettings: "'pwid'" }}>
            08:00
          </p>
          <p className="css-ew64yg relative shrink-0" style={{ fontFeatureSettings: "'pwid'" }}>
            09:00
          </p>
          <p className="css-ew64yg relative shrink-0" style={{ fontFeatureSettings: "'pwid'" }}>
            10:00
          </p>
          <p className="css-ew64yg relative shrink-0" style={{ fontFeatureSettings: "'pwid'" }}>
            11:00
          </p>
          <p className="css-ew64yg relative shrink-0" style={{ fontFeatureSettings: "'pwid'" }}>
            12:00
          </p>
          <p className="css-ew64yg relative shrink-0" style={{ fontFeatureSettings: "'pwid'" }}>
            13:00
          </p>
          <p className="css-ew64yg relative shrink-0" style={{ fontFeatureSettings: "'pwid'" }}>
            14:00
          </p>
          <p className="css-ew64yg relative shrink-0" style={{ fontFeatureSettings: "'pwid'" }}>
            15:00
          </p>
          <p className="css-ew64yg relative shrink-0" style={{ fontFeatureSettings: "'pwid'" }}>
            16:00
          </p>
          <p className="css-ew64yg relative shrink-0" style={{ fontFeatureSettings: "'pwid'" }}>
            17:00
          </p>
          <p className="css-ew64yg relative shrink-0" style={{ fontFeatureSettings: "'pwid'" }}>
            18:00
          </p>
          <p className="css-ew64yg relative shrink-0" style={{ fontFeatureSettings: "'pwid'" }}>
            19:00
          </p>
          <p className="css-ew64yg relative shrink-0" style={{ fontFeatureSettings: "'pwid'" }}>
            20:00
          </p>
          <p className="css-ew64yg relative shrink-0" style={{ fontFeatureSettings: "'pwid'" }}>
            21:00
          </p>
          <p className="css-ew64yg relative shrink-0" style={{ fontFeatureSettings: "'pwid'" }}>
            22:00
          </p>
          <p className="css-ew64yg relative shrink-0" style={{ fontFeatureSettings: "'pwid'" }}>
            23:00
          </p>
        </div>
      </div>
    </div>
  );
}

function Frame15() {
  return (
    <div className="content-stretch flex flex-col h-[172px] items-start relative shrink-0 w-[1148px]">
      <x />
      <Component4 />
    </div>
  );
}

function Component5() {
  return (
    <div className="content-stretch flex items-start relative shrink-0 z-[1]" data-name="坐标">
      <Frame15 />
    </div>
  );
}

function Frame6() {
  return (
    <div className="content-stretch flex flex-col h-[175px] isolate items-start relative shrink-0 w-full z-[1]">
      <Component5 />
    </div>
  );
}

function Component54() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col gap-[6px] isolate items-start left-[48px] px-[12px] py-[16px] rounded-[8px] top-[32px] w-[1168px]" data-name="Component 390">
      <div aria-hidden="true" className="absolute border border-solid border-white inset-0 pointer-events-none rounded-[8px] shadow-[0px_4px_20px_0px_rgba(0,0,0,0.04)]" />
      <Frame7 />
      <Frame40 />
      <Frame31 />
      <Frame32 />
      <Frame6 />
    </div>
  );
}

function Component6() {
  return (
    <div className="content-stretch flex gap-[8px] items-center justify-center relative shrink-0" data-name="内容">
      <div className="css-g0mm18 flex flex-col font-['Microsoft_YaHei_UI:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#1b2129] text-[14px] text-center">
        <p className="css-ew64yg leading-[22px]">图表</p>
      </div>
    </div>
  );
}

function Component7() {
  return (
    <div className="content-stretch flex gap-[4px] items-center justify-center overflow-clip px-[16px] py-px relative rounded-[4px] shrink-0" data-name="页签">
      <Component6 />
    </div>
  );
}

function Component8() {
  return (
    <div className="content-stretch flex gap-[8px] items-center justify-center relative shrink-0" data-name="内容">
      <div className="css-g0mm18 flex flex-col font-['Microsoft_YaHei_UI:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#246fe5] text-[14px] text-center">
        <p className="css-ew64yg leading-[22px]">列表</p>
      </div>
    </div>
  );
}

function Component9() {
  return (
    <div className="bg-white content-stretch flex gap-[4px] items-center justify-center overflow-clip px-[16px] py-px relative rounded-[4px] shadow-[0px_2px_10px_0px_rgba(27,33,41,0.1)] shrink-0" data-name="页签">
      <Component8 />
    </div>
  );
}

function Tab1() {
  return (
    <div className="bg-[#e8ecf0] content-stretch flex items-start p-[2px] relative rounded-[4px] shrink-0" data-name="页签&Tab">
      <Component7 />
      <Component9 />
    </div>
  );
}

function Frame35() {
  return (
    <div className="content-stretch flex gap-[12px] items-center relative shrink-0">
      <div className="css-g0mm18 flex flex-col font-['Microsoft_YaHei_UI:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#1b2129] text-[14px] text-center">
        <p className="css-ew64yg leading-[22px]">空间平均温度调节</p>
      </div>
      <Tab1 />
    </div>
  );
}

function Frame27() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <div className="bg-[#2481f2] h-[3px] shrink-0 w-[14px]" data-name="矩形" />
      <p className="css-ew64yg font-['Microsoft_YaHei:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#626c78] text-[14px]">实际值</p>
    </div>
  );
}

function Frame14() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Frame27 />
    </div>
  );
}

function Frame28() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <div className="bg-[#b286f5] h-[3px] shrink-0 w-[14px]" data-name="矩形" />
      <p className="css-ew64yg font-['Microsoft_YaHei:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#626c78] text-[14px]">目标值</p>
    </div>
  );
}

function Frame18() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Frame28 />
    </div>
  );
}

function Frame29() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <div className="bg-[#ffd873] h-[3px] shrink-0 w-[14px]" data-name="矩形" />
      <p className="css-ew64yg font-['Microsoft_YaHei:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#626c78] text-[14px]">电价</p>
    </div>
  );
}

function Frame19() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Frame29 />
    </div>
  );
}

function Frame9() {
  return (
    <div className="content-center flex flex-wrap gap-[12px] items-center opacity-0 relative shrink-0">
      <Frame14 />
      <Frame18 />
      <Frame19 />
    </div>
  );
}

function Frame33() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full z-[2]">
      <Frame35 />
      <Frame9 />
    </div>
  );
}

function Component10() {
  return (
    <div className="bg-[#ebf4fe] h-[38px] relative shrink-0 w-full z-[14]" data-name="表头">
      <div aria-hidden="true" className="absolute border border-[#e1e5eb] border-solid inset-[-0.5px] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[10px] relative size-full">
          <p className="css-g0mm18 font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[18px] leading-[20px] not-italic overflow-hidden relative shrink-0 text-[#626c78] text-[12px] text-ellipsis w-full">时间</p>
        </div>
      </div>
    </div>
  );
}

function Component11() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[22px] not-italic overflow-hidden relative shrink-0 text-[#1b2129] text-[14px] text-ellipsis">00:15</p>
    </div>
  );
}

function Component12() {
  return (
    <div className="flex-[1_0_0] h-[36px] min-h-px min-w-px relative" data-name="单元格">
      <div aria-hidden="true" className="absolute border border-[#e1e5eb] border-solid inset-[-0.5px] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative size-full">
          <Component11 />
        </div>
      </div>
    </div>
  );
}

function Frame36() {
  return (
    <div className="content-stretch flex items-start relative shrink-0 w-full z-[13]">
      <Component12 />
    </div>
  );
}

function Component13() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[22px] not-italic overflow-hidden relative shrink-0 text-[#1b2129] text-[14px] text-ellipsis">00:30</p>
    </div>
  );
}

function Component14() {
  return (
    <div className="flex-[1_0_0] h-[36px] min-h-px min-w-px relative" data-name="单元格">
      <div aria-hidden="true" className="absolute border border-[#e1e5eb] border-solid inset-[-0.5px] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative size-full">
          <Component13 />
        </div>
      </div>
    </div>
  );
}

function Frame37() {
  return (
    <div className="content-stretch flex items-start relative shrink-0 w-full z-[12]">
      <Component14 />
    </div>
  );
}

function Component15() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[22px] not-italic overflow-hidden relative shrink-0 text-[#1b2129] text-[14px] text-ellipsis">00:45</p>
    </div>
  );
}

function Component16() {
  return (
    <div className="flex-[1_0_0] h-[36px] min-h-px min-w-px relative" data-name="单元格">
      <div aria-hidden="true" className="absolute border border-[#e1e5eb] border-solid inset-[-0.5px] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative size-full">
          <Component15 />
        </div>
      </div>
    </div>
  );
}

function Frame38() {
  return (
    <div className="content-stretch flex items-start relative shrink-0 w-full z-[11]">
      <Component16 />
    </div>
  );
}

function Component17() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[22px] not-italic overflow-hidden relative shrink-0 text-[#1b2129] text-[14px] text-ellipsis">01:00</p>
    </div>
  );
}

function Component18() {
  return (
    <div className="flex-[1_0_0] h-[36px] min-h-px min-w-px relative" data-name="单元格">
      <div aria-hidden="true" className="absolute border border-[#e1e5eb] border-solid inset-[-0.5px] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative size-full">
          <Component17 />
        </div>
      </div>
    </div>
  );
}

function Frame39() {
  return (
    <div className="content-stretch flex items-start relative shrink-0 w-full z-[10]">
      <Component18 />
    </div>
  );
}

function Component19() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col isolate items-start min-h-px min-w-px overflow-clip relative" data-name="列内容">
      <Component10 />
      <Frame36 />
      <Frame37 />
      <Frame38 />
      <Frame39 />
    </div>
  );
}

function Component20() {
  return (
    <div className="content-stretch flex items-start relative shrink-0 w-[314px]" data-name="列">
      <div aria-hidden="true" className="absolute border border-[#e1e5eb] border-solid inset-[-0.5px] pointer-events-none" />
      <Component19 />
    </div>
  );
}

function Component21() {
  return (
    <div className="bg-[#ebf4fe] h-[38px] relative shrink-0 w-full z-[14]" data-name="表头">
      <div aria-hidden="true" className="absolute border border-[#e1e5eb] border-solid inset-[-0.5px] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[10px] relative size-full">
          <p className="css-g0mm18 font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[18px] leading-[20px] not-italic overflow-hidden relative shrink-0 text-[#626c78] text-[12px] text-ellipsis w-full">实际值</p>
        </div>
      </div>
    </div>
  );
}

function Component22() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[22px] not-italic overflow-hidden relative shrink-0 text-[#1b2129] text-[14px] text-ellipsis">32℃</p>
    </div>
  );
}

function Component23() {
  return (
    <div className="h-[36px] relative shrink-0 w-full z-[13]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative size-full">
          <Component22 />
        </div>
      </div>
    </div>
  );
}

function Component24() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[22px] not-italic overflow-hidden relative shrink-0 text-[#1b2129] text-[14px] text-ellipsis">32℃</p>
    </div>
  );
}

function Component25() {
  return (
    <div className="h-[36px] relative shrink-0 w-full z-[3]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative size-full">
          <Component24 />
        </div>
      </div>
    </div>
  );
}

function Component26() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[22px] not-italic overflow-hidden relative shrink-0 text-[#1b2129] text-[14px] text-ellipsis">32℃</p>
    </div>
  );
}

function Component27() {
  return (
    <div className="h-[36px] relative shrink-0 w-full z-[2]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative size-full">
          <Component26 />
        </div>
      </div>
    </div>
  );
}

function Component28() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[22px] not-italic overflow-hidden relative shrink-0 text-[#1b2129] text-[14px] text-ellipsis">32℃</p>
    </div>
  );
}

function Component29() {
  return (
    <div className="h-[36px] relative shrink-0 w-full z-[1]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative size-full">
          <Component28 />
        </div>
      </div>
    </div>
  );
}

function Component30() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col isolate items-start min-h-px min-w-px overflow-clip relative" data-name="列内容">
      <Component21 />
      <Component23 />
      <Component25 />
      <Component27 />
      <Component29 />
    </div>
  );
}

function Component31() {
  return (
    <div className="content-stretch flex items-start relative shrink-0 w-[232px]" data-name="列">
      <div aria-hidden="true" className="absolute border border-[#e1e5eb] border-solid inset-[-0.5px] pointer-events-none" />
      <Component30 />
    </div>
  );
}

function Component32() {
  return (
    <div className="bg-[#ebf4fe] h-[38px] relative shrink-0 w-full z-[14]" data-name="表头">
      <div aria-hidden="true" className="absolute border border-[#e1e5eb] border-solid inset-[-0.5px] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[10px] relative size-full">
          <p className="css-g0mm18 font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[18px] leading-[20px] not-italic overflow-hidden relative shrink-0 text-[#626c78] text-[12px] text-ellipsis w-full">目标值</p>
        </div>
      </div>
    </div>
  );
}

function Component33() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[22px] not-italic overflow-hidden relative shrink-0 text-[#1b2129] text-[14px] text-ellipsis">32℃</p>
    </div>
  );
}

function Component34() {
  return (
    <div className="h-[36px] relative shrink-0 w-full z-[13]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative size-full">
          <Component33 />
        </div>
      </div>
    </div>
  );
}

function Component35() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[22px] not-italic overflow-hidden relative shrink-0 text-[#1b2129] text-[14px] text-ellipsis">32℃</p>
    </div>
  );
}

function Component36() {
  return (
    <div className="h-[36px] relative shrink-0 w-full z-[3]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative size-full">
          <Component35 />
        </div>
      </div>
    </div>
  );
}

function Component37() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[22px] not-italic overflow-hidden relative shrink-0 text-[#1b2129] text-[14px] text-ellipsis">32℃</p>
    </div>
  );
}

function Component38() {
  return (
    <div className="h-[36px] relative shrink-0 w-full z-[2]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative size-full">
          <Component37 />
        </div>
      </div>
    </div>
  );
}

function Component39() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[22px] not-italic overflow-hidden relative shrink-0 text-[#1b2129] text-[14px] text-ellipsis">32℃</p>
    </div>
  );
}

function Component40() {
  return (
    <div className="h-[36px] relative shrink-0 w-full z-[1]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative size-full">
          <Component39 />
        </div>
      </div>
    </div>
  );
}

function Component41() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col isolate items-start min-h-px min-w-px overflow-clip relative" data-name="列内容">
      <Component32 />
      <Component34 />
      <Component36 />
      <Component38 />
      <Component40 />
    </div>
  );
}

function Component42() {
  return (
    <div className="content-stretch flex flex-[1_0_0] items-start min-h-px min-w-px relative" data-name="列">
      <div aria-hidden="true" className="absolute border border-[#e1e5eb] border-solid inset-[-0.5px] pointer-events-none" />
      <Component41 />
    </div>
  );
}

function Component43() {
  return (
    <div className="bg-[#ebf4fe] h-[38px] relative shrink-0 w-full z-[14]" data-name="表头">
      <div aria-hidden="true" className="absolute border border-[#e1e5eb] border-solid inset-[-0.5px] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[10px] relative size-full">
          <p className="css-g0mm18 font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[18px] leading-[20px] not-italic overflow-hidden relative shrink-0 text-[#626c78] text-[12px] text-ellipsis w-full">电价</p>
        </div>
      </div>
    </div>
  );
}

function Component44() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[22px] not-italic overflow-hidden relative shrink-0 text-[#1b2129] text-[14px] text-ellipsis">1.6元/kwh</p>
    </div>
  );
}

function Component45() {
  return (
    <div className="h-[36px] relative shrink-0 w-full z-[13]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative size-full">
          <Component44 />
        </div>
      </div>
    </div>
  );
}

function Component46() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[22px] not-italic overflow-hidden relative shrink-0 text-[#1b2129] text-[14px] text-ellipsis">1.6元/kwh</p>
    </div>
  );
}

function Component47() {
  return (
    <div className="h-[36px] relative shrink-0 w-full z-[3]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative size-full">
          <Component46 />
        </div>
      </div>
    </div>
  );
}

function Component48() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[22px] not-italic overflow-hidden relative shrink-0 text-[#1b2129] text-[14px] text-ellipsis">1.6元/kwh</p>
    </div>
  );
}

function Component49() {
  return (
    <div className="h-[36px] relative shrink-0 w-full z-[2]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative size-full">
          <Component48 />
        </div>
      </div>
    </div>
  );
}

function Component50() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[22px] not-italic overflow-hidden relative shrink-0 text-[#1b2129] text-[14px] text-ellipsis">1.6元/kwh</p>
    </div>
  );
}

function Component51() {
  return (
    <div className="h-[36px] relative shrink-0 w-full z-[1]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative size-full">
          <Component50 />
        </div>
      </div>
    </div>
  );
}

function Component52() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col isolate items-start min-h-px min-w-px overflow-clip relative" data-name="列内容">
      <Component43 />
      <Component45 />
      <Component47 />
      <Component49 />
      <Component51 />
    </div>
  );
}

function Component53() {
  return (
    <div className="content-stretch flex flex-[1_0_0] items-start min-h-px min-w-px relative" data-name="列">
      <div aria-hidden="true" className="absolute border border-[#e1e5eb] border-solid inset-[-0.5px] pointer-events-none" />
      <Component52 />
    </div>
  );
}

function Frame30() {
  return (
    <div className="content-stretch flex items-start overflow-clip relative shrink-0 w-full z-[1]">
      <Component20 />
      <Component31 />
      <Component42 />
      <Component53 />
    </div>
  );
}

function Component55() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col gap-[6px] isolate items-start left-[50px] px-[12px] py-[16px] rounded-[8px] top-[335px] w-[1168px]" data-name="Component 391">
      <div aria-hidden="true" className="absolute border border-solid border-white inset-0 pointer-events-none rounded-[8px] shadow-[0px_4px_20px_0px_rgba(0,0,0,0.04)]" />
      <Frame33 />
      <Frame30 />
    </div>
  );
}

export default function Frame41() {
  return (
    <div className="bg-[#ebf6ff] relative size-full">
      <Component54 />
      <Component55 />
    </div>
  );
}