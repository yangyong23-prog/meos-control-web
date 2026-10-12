import svgPaths from "./svg-t4hlvhg2eb";

function CommonClose() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="common/close">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="common/close">
          <path d={svgPaths.p74d500} fill="var(--fill-0, #8B949E)" id="ç©å½¢" />
          <path clipRule="evenodd" d={svgPaths.p1a561100} fill="var(--fill-0, #1B2129)" fillRule="evenodd" id="ç©å½¢å¤ä»½ 44" />
        </g>
      </svg>
    </div>
  );
}

function Title() {
  return (
    <div className="h-[56px] relative shrink-0 w-full" data-name="title">
      <div aria-hidden="true" className="absolute border-[#e8ecf0] border-b border-solid inset-[0_0_-1px_0] pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between px-[24px] py-[12px] relative size-full">
          <p className="css-ew64yg font-['Microsoft_YaHei_UI:Bold',sans-serif] leading-[24px] not-italic relative shrink-0 text-[#2e3742] text-[16px]">空间详细分析</p>
          <CommonClose />
        </div>
      </div>
    </div>
  );
}

function Component() {
  return (
    <div className="content-stretch flex gap-[9px] items-center relative rounded-[4px] shrink-0" data-name="小蓝标">
      <div className="bg-[#246fe5] h-[14px] shrink-0 w-[3px]" />
      <p className="css-ew64yg font-['Microsoft_YaHei_UI:Bold',sans-serif] leading-[24px] not-italic relative shrink-0 text-[#2e3742] text-[16px]">空间温度</p>
    </div>
  );
}

function Component1() {
  return (
    <div className="content-stretch flex font-['Microsoft_YaHei_UI:Regular',sans-serif] items-center justify-center leading-[22px] not-italic relative shrink-0 text-[14px]" data-name="内容">
      <p className="css-ew64yg relative shrink-0 text-[#626c78]">类型：</p>
      <p className="css-ew64yg relative shrink-0 text-[#1b2129] text-center">全部</p>
    </div>
  );
}

function Component2() {
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
      <Component1 />
      <Component2 />
    </div>
  );
}

function Component3() {
  return (
    <div className="content-stretch flex font-['Microsoft_YaHei_UI:Regular',sans-serif] items-center justify-center leading-[22px] not-italic relative shrink-0 text-[14px]" data-name="内容">
      <p className="css-ew64yg relative shrink-0 text-[#626c78]">空间名称：</p>
      <p className="css-ew64yg relative shrink-0 text-[#1b2129] text-center">制冷间#1</p>
    </div>
  );
}

function Component5() {
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
    <div className="content-stretch flex gap-[4px] items-center pl-[12px] pr-[8px] py-[5px] relative rounded-[4px] shrink-0" data-name="选择器&Select">
      <Component3 />
      <Component5 />
    </div>
  );
}

function Frame212() {
  return (
    <div className="absolute content-stretch flex gap-[4px] items-center left-[-7px] top-0">
      <Select />
      <div className="bg-[#d9d9d9] h-[13px] shrink-0 w-px" />
      <Select1 />
    </div>
  );
}

function Frame261() {
  return (
    <div className="h-[32px] relative shrink-0 w-[290px]">
      <Frame212 />
    </div>
  );
}

function Frame56() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <div className="bg-[#d069d2] h-[3px] shrink-0 w-[16px]" data-name="矩形" />
      <p className="css-ew64yg font-['Microsoft_YaHei:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#626c78] text-[14px]">目标温度</p>
    </div>
  );
}

function Frame140() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Frame56 />
    </div>
  );
}

function Frame61() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <div className="bg-[#2481f2] h-[3px] shrink-0 w-[16px]" data-name="矩形" />
      <p className="css-ew64yg font-['Microsoft_YaHei:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#626c78] text-[14px]">实际温度</p>
    </div>
  );
}

function Frame137() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Frame61 />
    </div>
  );
}

function Frame62() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <div className="bg-[#33d4d2] h-[3px] shrink-0 w-[16px]" data-name="矩形" />
      <p className="css-ew64yg font-['Microsoft_YaHei:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#626c78] text-[14px]">AI预测温度</p>
    </div>
  );
}

function Frame138() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Frame62 />
    </div>
  );
}

function Frame63() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <div className="bg-[#d2e3f8] shrink-0 size-[14px]" />
      <p className="css-ew64yg font-['Microsoft_YaHei:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#626c78] text-[14px]">营业时间范围</p>
    </div>
  );
}

function Frame139() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Frame63 />
    </div>
  );
}

function Frame116() {
  return (
    <div className="content-stretch flex gap-px items-center overflow-clip relative shrink-0 w-[12px]">
      <div className="bg-[#508cea] h-[3px] shrink-0 w-[2px]" data-name="矩形" />
      <div className="bg-[#508cea] h-[3px] shrink-0 w-[2px]" data-name="矩形" />
      <div className="bg-[#508cea] h-[3px] shrink-0 w-[2px]" data-name="矩形" />
      <div className="bg-[#508cea] h-[3px] shrink-0 w-[2px]" data-name="矩形" />
      <div className="bg-[#508cea] h-[3px] shrink-0 w-[2px]" data-name="矩形" />
      <div className="bg-[#508cea] h-[3px] shrink-0 w-[2px]" data-name="矩形" />
    </div>
  );
}

function Frame57() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <Frame116 />
      <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[22px] not-italic relative shrink-0 text-[#626c78] text-[14px]">过冷门限</p>
    </div>
  );
}

function Frame117() {
  return (
    <div className="content-stretch flex gap-px items-center overflow-clip relative shrink-0 w-[12px]">
      <div className="bg-[#ffad33] h-[3px] shrink-0 w-[2px]" data-name="矩形" />
      <div className="bg-[#ffad33] h-[3px] shrink-0 w-[2px]" data-name="矩形" />
      <div className="bg-[#ffad33] h-[3px] shrink-0 w-[2px]" data-name="矩形" />
      <div className="bg-[#ffad33] h-[3px] shrink-0 w-[2px]" data-name="矩形" />
      <div className="bg-[#ffad33] h-[3px] shrink-0 w-[2px]" data-name="矩形" />
      <div className="bg-[#ffad33] h-[3px] shrink-0 w-[2px]" data-name="矩形" />
    </div>
  );
}

function Frame59() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <Frame117 />
      <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[22px] not-italic relative shrink-0 text-[#626c78] text-[14px]">舒适区下限</p>
    </div>
  );
}

function Frame118() {
  return (
    <div className="content-stretch flex gap-px items-center overflow-clip relative shrink-0 w-[12px]">
      <div className="bg-[#61d5e5] h-[3px] shrink-0 w-[2px]" data-name="矩形" />
      <div className="bg-[#61d5e5] h-[3px] shrink-0 w-[2px]" data-name="矩形" />
      <div className="bg-[#61d5e5] h-[3px] shrink-0 w-[2px]" data-name="矩形" />
      <div className="bg-[#61d5e5] h-[3px] shrink-0 w-[2px]" data-name="矩形" />
      <div className="bg-[#61d5e5] h-[3px] shrink-0 w-[2px]" data-name="矩形" />
      <div className="bg-[#61d5e5] h-[3px] shrink-0 w-[2px]" data-name="矩形" />
    </div>
  );
}

function Frame58() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <Frame118 />
      <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[22px] not-italic relative shrink-0 text-[#626c78] text-[14px]">舒适区上限</p>
    </div>
  );
}

function Frame119() {
  return (
    <div className="content-stretch flex gap-px items-center overflow-clip relative shrink-0 w-[12px]">
      <div className="bg-[#f7736c] h-[3px] shrink-0 w-[2px]" data-name="矩形" />
      <div className="bg-[#f7736c] h-[3px] shrink-0 w-[2px]" data-name="矩形" />
      <div className="bg-[#f7736c] h-[3px] shrink-0 w-[2px]" data-name="矩形" />
      <div className="bg-[#f7736c] h-[3px] shrink-0 w-[2px]" data-name="矩形" />
      <div className="bg-[#f7736c] h-[3px] shrink-0 w-[2px]" data-name="矩形" />
      <div className="bg-[#f7736c] h-[3px] shrink-0 w-[2px]" data-name="矩形" />
    </div>
  );
}

function Frame60() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <Frame119 />
      <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[22px] not-italic relative shrink-0 text-[#626c78] text-[14px]">过热门限</p>
    </div>
  );
}

function Frame85() {
  return (
    <div className="content-center flex flex-wrap gap-[12px] items-center relative shrink-0">
      <Frame140 />
      <Frame137 />
      <Frame138 />
      <Frame139 />
      <Frame57 />
      <Frame59 />
      <Frame58 />
      <Frame60 />
    </div>
  );
}

function Frame206() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <Frame261 />
      <Frame85 />
    </div>
  );
}

function Component4() {
  return (
    <div className="absolute h-[48px] left-[318.47px] top-[-8px] w-[39.692px]" data-name="交互组件-4标记点">
      <div className="-translate-x-1/2 -translate-y-1/2 absolute flex flex-col font-['PingFang_SC:Semibold',sans-serif] h-[43.195px] justify-center leading-[0] left-[19.85px] not-italic text-[23.154px] text-center text-white top-[21.6px] w-[39.692px]">
        <p className="css-4hzbpn leading-[normal]">1</p>
      </div>
    </div>
  );
}

function Group() {
  return (
    <div className="absolute h-[148px] left-[26.19px] top-[40px] w-[1146.753px] z-[7]">
      <div className="absolute inset-[0_-0.03%_0_0]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1147.11 148">
          <g id="Group 852827948">
            <g id="Frame 1937106615"></g>
            <path d={svgPaths.p33c65200} id="Vector 4096" stroke="var(--stroke-0, #33D4D2)" strokeWidth="1.5" />
            <path d={svgPaths.p1c63a800} id="Vector 4097" stroke="var(--stroke-0, #2481F2)" strokeWidth="1.5" />
            <path d={svgPaths.p30404900} id="Vector 4098" stroke="var(--stroke-0, #D069D2)" strokeWidth="1.5" />
            <circle cx="791.811" cy="45" fill="var(--fill-0, white)" id="Ellipse 1" r="3" stroke="var(--stroke-0, #33D4D2)" strokeWidth="2" />
            <circle cx="791.811" cy="56.834" fill="var(--fill-0, white)" id="Ellipse 2" r="3" stroke="var(--stroke-0, #2481F2)" strokeWidth="2" />
            <circle cx="791.811" cy="68.668" fill="var(--fill-0, white)" id="Ellipse 3" r="3" stroke="var(--stroke-0, #D069D2)" strokeWidth="2" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Frame13() {
  return (
    <div className="content-stretch flex flex-[1_0_0] items-center min-h-px min-w-px py-[10px] relative w-full">
      <p className="css-4hzbpn font-['PingFang_SC:Regular',sans-serif] leading-[18px] not-italic relative shrink-0 text-[#646c73] text-[12px] w-[18px]">℃</p>
    </div>
  );
}

function Frame16() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] items-center min-h-px min-w-px py-[10px] relative w-full">
      <p className="css-4hzbpn font-['PingFang_SC:Regular',sans-serif] leading-[18px] not-italic relative shrink-0 text-[#646c73] text-[12px] text-right w-[18px]">40</p>
      <div className="flex-[1_0_0] h-0 min-h-px min-w-px relative" data-name="line">
        <div className="absolute inset-[-0.5px_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1162 1">
            <path d="M1162 0.5H0" id="line" stroke="var(--stroke-0, #E8ECF0)" strokeDasharray="3 3" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Frame14() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] items-center min-h-px min-w-px py-[10px] relative w-full">
      <p className="css-4hzbpn font-['PingFang_SC:Regular',sans-serif] leading-[18px] not-italic relative shrink-0 text-[#646c73] text-[12px] text-right w-[18px]">32</p>
      <div className="flex-[1_0_0] h-0 min-h-px min-w-px relative" data-name="line">
        <div className="absolute inset-[-0.5px_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1162 1">
            <path d="M1162 0.5H0" id="line" stroke="var(--stroke-0, #E8ECF0)" strokeDasharray="3 3" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Frame15() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] items-center min-h-px min-w-px py-[10px] relative w-full">
      <p className="css-4hzbpn font-['PingFang_SC:Regular',sans-serif] leading-[18px] not-italic relative shrink-0 text-[#646c73] text-[12px] text-right w-[18px]">24</p>
      <div className="flex-[1_0_0] h-0 min-h-px min-w-px relative" data-name="line">
        <div className="absolute inset-[-0.5px_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1162 1">
            <path d="M1162 0.5H0" id="line" stroke="var(--stroke-0, #E8ECF0)" strokeDasharray="3 3" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Frame10() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] items-center min-h-px min-w-px py-[10px] relative w-full">
      <p className="css-4hzbpn font-['PingFang_SC:Regular',sans-serif] leading-[18px] not-italic relative shrink-0 text-[#646c73] text-[12px] text-right w-[18px]">16</p>
      <div className="flex-[1_0_0] h-0 min-h-px min-w-px relative" data-name="line">
        <div className="absolute inset-[-0.5px_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1162 1">
            <path d="M1162 0.5H0" id="line" stroke="var(--stroke-0, #E8ECF0)" strokeDasharray="3 3" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Frame11() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] items-center min-h-px min-w-px py-[10px] relative w-full">
      <p className="css-4hzbpn font-['PingFang_SC:Regular',sans-serif] leading-[18px] not-italic relative shrink-0 text-[#646c73] text-[12px] text-right w-[18px]">8</p>
      <div className="flex-[1_0_0] h-0 min-h-px min-w-px relative" data-name="line">
        <div className="absolute inset-[-0.5px_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1162 1">
            <path d="M1162 0.5H0" id="line" stroke="var(--stroke-0, #E8ECF0)" strokeDasharray="3 3" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Frame12() {
  return (
    <div className="content-stretch flex gap-[8px] h-[32px] items-center pt-[10px] relative shrink-0 w-full">
      <p className="css-4hzbpn font-['PingFang_SC:Regular',sans-serif] leading-[18px] not-italic relative shrink-0 text-[#646c73] text-[12px] text-right w-[18px]">0</p>
      <div className="flex-[1_0_0] h-0 min-h-px min-w-px relative" data-name="line">
        <div className="absolute inset-[-0.5px_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1162 1">
            <path d="M1162 0.5H0" id="line" stroke="var(--stroke-0, #C4C9CF)" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function x() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start justify-between min-h-px min-w-px overflow-clip relative w-full" data-name="左侧X轴">
      <Frame13 />
      <Frame16 />
      <Frame14 />
      <Frame15 />
      <Frame10 />
      <Frame11 />
      <Frame12 />
    </div>
  );
}

function Frame213() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0">
      <p className="css-ew64yg font-['Noto_Sans_SC:Regular',sans-serif] font-normal leading-[14px] relative shrink-0 text-[#8d9399] text-[12px] text-center" style={{ fontFeatureSettings: "'pwid'" }}>
        07:00
      </p>
    </div>
  );
}

function Frame214() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0">
      <p className="css-ew64yg font-['Noto_Sans_SC:Regular',sans-serif] font-normal leading-[14px] relative shrink-0 text-[#8d9399] text-[12px] text-center" style={{ fontFeatureSettings: "'pwid'" }}>
        08:00
      </p>
    </div>
  );
}

function Frame215() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0">
      <p className="css-ew64yg font-['Noto_Sans_SC:Regular',sans-serif] font-normal leading-[14px] relative shrink-0 text-[#8d9399] text-[12px] text-center" style={{ fontFeatureSettings: "'pwid'" }}>
        09:00
      </p>
    </div>
  );
}

function Frame216() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0">
      <p className="css-ew64yg font-['Noto_Sans_SC:Regular',sans-serif] font-normal leading-[14px] relative shrink-0 text-[#8d9399] text-[12px] text-center" style={{ fontFeatureSettings: "'pwid'" }}>
        10:00
      </p>
    </div>
  );
}

function Frame217() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0">
      <p className="css-ew64yg font-['Noto_Sans_SC:Regular',sans-serif] font-normal leading-[14px] relative shrink-0 text-[#8d9399] text-[12px] text-center" style={{ fontFeatureSettings: "'pwid'" }}>
        11:00
      </p>
    </div>
  );
}

function Frame226() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0">
      <p className="css-ew64yg font-['Noto_Sans_SC:Regular',sans-serif] font-normal leading-[14px] relative shrink-0 text-[#8d9399] text-[12px] text-center" style={{ fontFeatureSettings: "'pwid'" }}>
        12:00
      </p>
    </div>
  );
}

function Frame219() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0">
      <p className="css-ew64yg font-['Noto_Sans_SC:Regular',sans-serif] font-normal leading-[14px] relative shrink-0 text-[#8d9399] text-[12px] text-center" style={{ fontFeatureSettings: "'pwid'" }}>
        13:00
      </p>
    </div>
  );
}

function Frame220() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0">
      <p className="css-ew64yg font-['Noto_Sans_SC:Regular',sans-serif] font-normal leading-[14px] relative shrink-0 text-[#8d9399] text-[12px] text-center" style={{ fontFeatureSettings: "'pwid'" }}>
        14:00
      </p>
    </div>
  );
}

function Frame221() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0">
      <p className="css-ew64yg font-['Noto_Sans_SC:Regular',sans-serif] font-normal leading-[14px] relative shrink-0 text-[#8d9399] text-[12px] text-center" style={{ fontFeatureSettings: "'pwid'" }}>
        15:00
      </p>
    </div>
  );
}

function Frame222() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0">
      <p className="css-ew64yg font-['Noto_Sans_SC:Regular',sans-serif] font-normal leading-[14px] relative shrink-0 text-[#8d9399] text-[12px] text-center" style={{ fontFeatureSettings: "'pwid'" }}>
        16:00
      </p>
    </div>
  );
}

function Frame223() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0">
      <p className="css-ew64yg font-['Noto_Sans_SC:Regular',sans-serif] font-normal leading-[14px] relative shrink-0 text-[#8d9399] text-[12px] text-center" style={{ fontFeatureSettings: "'pwid'" }}>
        17:00
      </p>
    </div>
  );
}

function Frame224() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0">
      <p className="css-ew64yg font-['Noto_Sans_SC:Regular',sans-serif] font-normal leading-[14px] relative shrink-0 text-[#8d9399] text-[12px] text-center" style={{ fontFeatureSettings: "'pwid'" }}>
        18:00
      </p>
    </div>
  );
}

function Frame225() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0">
      <p className="css-ew64yg font-['Noto_Sans_SC:Regular',sans-serif] font-normal leading-[14px] relative shrink-0 text-[#8d9399] text-[12px] text-center" style={{ fontFeatureSettings: "'pwid'" }}>
        19:00
      </p>
    </div>
  );
}

function Component6() {
  return (
    <div className="relative shrink-0 w-full" data-name="横坐标">
      <div className="content-stretch flex items-start justify-between pl-[28px] pr-[36px] relative w-full">
        <p className="css-ew64yg font-['Noto_Sans_SC:Regular',sans-serif] font-normal leading-[14px] relative shrink-0 text-[#8d9399] text-[12px] text-center" style={{ fontFeatureSettings: "'pwid'" }}>
          00:00
        </p>
        <p className="css-ew64yg font-['Noto_Sans_SC:Regular',sans-serif] font-normal leading-[14px] relative shrink-0 text-[#8d9399] text-[12px] text-center" style={{ fontFeatureSettings: "'pwid'" }}>
          01:00
        </p>
        <p className="css-ew64yg font-['Noto_Sans_SC:Regular',sans-serif] font-normal leading-[14px] relative shrink-0 text-[#8d9399] text-[12px] text-center" style={{ fontFeatureSettings: "'pwid'" }}>
          02:00
        </p>
        <p className="css-ew64yg font-['Noto_Sans_SC:Regular',sans-serif] font-normal leading-[14px] relative shrink-0 text-[#8d9399] text-[12px] text-center" style={{ fontFeatureSettings: "'pwid'" }}>
          03:00
        </p>
        <p className="css-ew64yg font-['Noto_Sans_SC:Regular',sans-serif] font-normal leading-[14px] relative shrink-0 text-[#8d9399] text-[12px] text-center" style={{ fontFeatureSettings: "'pwid'" }}>
          04:00
        </p>
        <p className="css-ew64yg font-['Noto_Sans_SC:Regular',sans-serif] font-normal leading-[14px] relative shrink-0 text-[#8d9399] text-[12px] text-center" style={{ fontFeatureSettings: "'pwid'" }}>
          05:00
        </p>
        <p className="css-ew64yg font-['Noto_Sans_SC:Regular',sans-serif] font-normal leading-[14px] relative shrink-0 text-[#8d9399] text-[12px] text-center" style={{ fontFeatureSettings: "'pwid'" }}>
          06:00
        </p>
        <Frame213 />
        <Frame214 />
        <Frame215 />
        <Frame216 />
        <Frame217 />
        <Frame226 />
        <Frame219 />
        <Frame220 />
        <Frame221 />
        <Frame222 />
        <Frame223 />
        <Frame224 />
        <Frame225 />
        <p className="css-ew64yg font-['Noto_Sans_SC:Regular',sans-serif] font-normal leading-[14px] relative shrink-0 text-[#8d9399] text-[12px] text-center" style={{ fontFeatureSettings: "'pwid'" }}>
          20:00
        </p>
        <p className="css-ew64yg font-['Noto_Sans_SC:Regular',sans-serif] font-normal leading-[14px] relative shrink-0 text-[#8d9399] text-[12px] text-center" style={{ fontFeatureSettings: "'pwid'" }}>
          21:00
        </p>
        <p className="css-ew64yg font-['Noto_Sans_SC:Regular',sans-serif] font-normal leading-[14px] relative shrink-0 text-[#8d9399] text-[12px] text-center" style={{ fontFeatureSettings: "'pwid'" }}>
          22:00
        </p>
        <p className="css-ew64yg font-['Noto_Sans_SC:Regular',sans-serif] font-normal leading-[14px] relative shrink-0 text-[#8d9399] text-[12px] text-center" style={{ fontFeatureSettings: "'pwid'" }}>
          23:00
        </p>
      </div>
    </div>
  );
}

function Frame126() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col h-full items-start min-h-px min-w-px relative">
      <x />
      <Component6 />
    </div>
  );
}

function Component7() {
  return (
    <div className="content-stretch flex flex-[1_0_0] items-start min-h-px min-w-px relative w-full z-[6]" data-name="坐标">
      <Frame126 />
    </div>
  );
}

function Frame17() {
  return (
    <div className="content-stretch flex flex-col gap-[14px] h-[212px] isolate items-start relative shrink-0 w-full">
      <Group />
      <Component7 />
      <div className="absolute h-[147px] left-[818px] top-[41px] w-0 z-[5]">
        <div className="absolute inset-[0_-0.5px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1 147">
            <path d="M0.5 147V0" id="Vector 4556" stroke="var(--stroke-0, #E1E5EB)" />
          </svg>
        </div>
      </div>
      <div className="absolute h-0 left-[26px] top-[111px] w-[1107px] z-[4]">
        <div className="absolute inset-[-1px_0_0_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1107 1">
            <line id="Line 23" stroke="var(--stroke-0, #61D5E5)" strokeDasharray="4 4" x2="1107" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
      <div className="absolute h-0 left-[26px] top-[147px] w-[1107px] z-[3]">
        <div className="absolute inset-[-1px_0_0_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1107 1">
            <line id="Line 25" stroke="var(--stroke-0, #508CEA)" strokeDasharray="4 4" x2="1107" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
      <div className="absolute h-0 left-[26px] top-[89px] w-[1107px] z-[2]">
        <div className="absolute inset-[-0.5px_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1107 1">
            <path d="M0 0.5H1107" id="Line 24" stroke="var(--stroke-0, #FFAD33)" strokeDasharray="4 4" />
          </svg>
        </div>
      </div>
      <div className="absolute h-0 left-[26px] top-[53px] w-[1107px] z-[1]">
        <div className="absolute inset-[-0.5px_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1107 1">
            <path d="M0 0.5H1107" id="Line 26" stroke="var(--stroke-0, #F7736C)" strokeDasharray="4 4" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Frame218() {
  return (
    <div className="bg-[#e6fcf7] content-stretch flex items-center justify-center relative shrink-0">
      <p className="css-4hzbpn font-['Noto_Sans_SC:Regular',sans-serif] font-normal leading-[14px] relative shrink-0 text-[#14c4c4] text-[12px] text-center w-[30px]" style={{ fontFeatureSettings: "'pwid'" }}>
        达标
      </p>
    </div>
  );
}

function Frame262() {
  return (
    <div className="content-stretch flex gap-px items-center relative shrink-0 w-[139px]">
      <div className="flex-[1_0_0] h-0 min-h-px min-w-px relative">
        <div className="absolute inset-[-2.31px_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 53.5 4.6188">
            <path d={svgPaths.p2999f880} fill="var(--stroke-0, #14C4C4)" id="Vector 4568" />
          </svg>
        </div>
      </div>
      <Frame218 />
      <div className="flex-[1_0_0] h-0 min-h-px min-w-px relative">
        <div className="absolute inset-[-2.31px_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 53.5 4.6188">
            <path d={svgPaths.p3669ea80} fill="var(--stroke-0, #14C4C4)" id="Vector 4567" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Frame237() {
  return (
    <div className="bg-[#fff5f5] content-stretch flex items-center justify-center relative shrink-0">
      <p className="css-4hzbpn font-['Noto_Sans_SC:Regular',sans-serif] font-normal leading-[14px] relative shrink-0 text-[#f55047] text-[12px] text-center w-[30px]" style={{ fontFeatureSettings: "'pwid'" }}>
        过热
      </p>
    </div>
  );
}

function Frame263() {
  return (
    <div className="content-stretch flex gap-px items-center relative shrink-0 w-[139px]">
      <div className="flex-[1_0_0] h-0 min-h-px min-w-px relative">
        <div className="absolute inset-[-2.31px_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 53.5 4.6188">
            <path d={svgPaths.p2999f880} fill="var(--stroke-0, #F55047)" id="Vector 4568" />
          </svg>
        </div>
      </div>
      <Frame237 />
      <div className="flex-[1_0_0] h-0 min-h-px min-w-px relative">
        <div className="absolute inset-[-2.31px_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 53.5 4.6188">
            <path d={svgPaths.p3669ea80} fill="var(--stroke-0, #F55047)" id="Vector 4567" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Frame238() {
  return (
    <div className="bg-[#d9ebff] content-stretch flex items-center justify-center relative shrink-0">
      <p className="css-4hzbpn font-['Noto_Sans_SC:Regular',sans-serif] font-normal leading-[14px] relative shrink-0 text-[#246fe5] text-[12px] text-center w-[30px]" style={{ fontFeatureSettings: "'pwid'" }}>
        过冷
      </p>
    </div>
  );
}

function Frame265() {
  return (
    <div className="content-stretch flex gap-px items-center relative shrink-0 w-[139px]">
      <div className="flex-[1_0_0] h-0 min-h-px min-w-px relative">
        <div className="absolute inset-[-2.31px_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 53.5 4.6188">
            <path d={svgPaths.p2999f880} fill="var(--stroke-0, #246FE5)" id="Vector 4568" />
          </svg>
        </div>
      </div>
      <Frame238 />
      <div className="flex-[1_0_0] h-0 min-h-px min-w-px relative">
        <div className="absolute inset-[-2.31px_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 53.5 4.6188">
            <path d={svgPaths.p3669ea80} fill="var(--stroke-0, #246FE5)" id="Vector 4567" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Frame239() {
  return (
    <div className="bg-[#fffbe6] content-stretch flex items-center justify-center relative shrink-0">
      <p className="css-ew64yg font-['Noto_Sans_SC:Regular',sans-serif] font-normal leading-[14px] relative shrink-0 text-[#f29f00] text-[12px] text-center" style={{ fontFeatureSettings: "'pwid'" }}>
        持续偏热
      </p>
    </div>
  );
}

function Frame264() {
  return (
    <div className="content-stretch flex gap-px items-center relative shrink-0 w-[139px]">
      <div className="flex-[1_0_0] h-0 min-h-px min-w-px relative">
        <div className="absolute inset-[-2.31px_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 44.5 4.6188">
            <path d={svgPaths.p11629080} fill="var(--stroke-0, #F29F00)" id="Vector 4568" />
          </svg>
        </div>
      </div>
      <Frame239 />
      <div className="flex-[1_0_0] h-0 min-h-px min-w-px relative">
        <div className="absolute inset-[-2.31px_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 44.5 4.6188">
            <path d={svgPaths.p3f72be70} fill="var(--stroke-0, #F29F00)" id="Vector 4567" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Frame272() {
  return (
    <div className="absolute content-stretch flex items-start left-[372px] top-[272px]">
      <Frame262 />
      <Frame263 />
      <Frame265 />
      <Frame264 />
    </div>
  );
}

function Frame210() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start leading-[normal] not-italic relative shrink-0 text-[14px]">
      <p className="css-ew64yg font-['Microsoft_YaHei:Bold',sans-serif] relative shrink-0 text-[#2e3742]">2025年8月27日 08:15</p>
      <p className="css-ew64yg font-['Microsoft_YaHei:Regular',sans-serif] relative shrink-0 text-[#626c78]">营业时间：07:30-19:30</p>
    </div>
  );
}

function Frame178() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <div className="bg-[#2481f2] h-[3px] shrink-0 w-[14px]" data-name="矩形" />
      <p className="css-ew64yg font-['Microsoft_YaHei:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#626c78] text-[14px]">实际温度：</p>
    </div>
  );
}

function Frame101() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Frame178 />
      <p className="css-ew64yg font-['Microsoft_YaHei:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#1b2129] text-[14px]">30.3℃</p>
    </div>
  );
}

function Frame180() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <div className="bg-[#09b3b5] h-[3px] shrink-0 w-[14px]" data-name="矩形" />
      <p className="css-ew64yg font-['Microsoft_YaHei:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#626c78] text-[14px]">AI预测温度：</p>
    </div>
  );
}

function Frame100() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Frame180 />
      <p className="css-ew64yg font-['Microsoft_YaHei:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#1b2129] text-[14px]">30.5℃</p>
    </div>
  );
}

function Frame181() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <div className="bg-[#c46cd6] h-[3px] shrink-0 w-[14px]" data-name="矩形" />
      <p className="css-ew64yg font-['Microsoft_YaHei:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#626c78] text-[14px]">目标温度：</p>
    </div>
  );
}

function Frame102() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Frame181 />
      <p className="css-ew64yg font-['Microsoft_YaHei:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#1b2129] text-[14px]">28.7℃</p>
    </div>
  );
}

function Frame176() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0">
      <Frame101 />
      <Frame100 />
      <Frame102 />
    </div>
  );
}

function Frame120() {
  return (
    <div className="content-stretch flex gap-px items-center overflow-clip relative shrink-0 w-[12px]">
      <div className="bg-[#508cea] h-[3px] shrink-0 w-[2px]" data-name="矩形" />
      <div className="bg-[#508cea] h-[3px] shrink-0 w-[2px]" data-name="矩形" />
      <div className="bg-[#508cea] h-[3px] shrink-0 w-[2px]" data-name="矩形" />
      <div className="bg-[#508cea] h-[3px] shrink-0 w-[2px]" data-name="矩形" />
      <div className="bg-[#508cea] h-[3px] shrink-0 w-[2px]" data-name="矩形" />
      <div className="bg-[#508cea] h-[3px] shrink-0 w-[2px]" data-name="矩形" />
    </div>
  );
}

function Frame64() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <Frame120 />
      <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[22px] not-italic relative shrink-0 text-[#626c78] text-[14px]">过冷门限：</p>
    </div>
  );
}

function Frame104() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Frame64 />
      <p className="css-ew64yg font-['Microsoft_YaHei:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#1b2129] text-[14px]">30.5℃</p>
    </div>
  );
}

function Frame121() {
  return (
    <div className="content-stretch flex gap-px items-center overflow-clip relative shrink-0 w-[12px]">
      <div className="bg-[#ffad33] h-[3px] shrink-0 w-[2px]" data-name="矩形" />
      <div className="bg-[#ffad33] h-[3px] shrink-0 w-[2px]" data-name="矩形" />
      <div className="bg-[#ffad33] h-[3px] shrink-0 w-[2px]" data-name="矩形" />
      <div className="bg-[#ffad33] h-[3px] shrink-0 w-[2px]" data-name="矩形" />
      <div className="bg-[#ffad33] h-[3px] shrink-0 w-[2px]" data-name="矩形" />
      <div className="bg-[#ffad33] h-[3px] shrink-0 w-[2px]" data-name="矩形" />
    </div>
  );
}

function Frame65() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <Frame121 />
      <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[22px] not-italic relative shrink-0 text-[#626c78] text-[14px]">舒适区下限：</p>
    </div>
  );
}

function Frame105() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Frame65 />
      <p className="css-ew64yg font-['Microsoft_YaHei:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#1b2129] text-[14px]">30.5℃</p>
    </div>
  );
}

function Frame122() {
  return (
    <div className="content-stretch flex gap-px items-center overflow-clip relative shrink-0 w-[12px]">
      <div className="bg-[#61d5e5] h-[3px] shrink-0 w-[2px]" data-name="矩形" />
      <div className="bg-[#61d5e5] h-[3px] shrink-0 w-[2px]" data-name="矩形" />
      <div className="bg-[#61d5e5] h-[3px] shrink-0 w-[2px]" data-name="矩形" />
      <div className="bg-[#61d5e5] h-[3px] shrink-0 w-[2px]" data-name="矩形" />
      <div className="bg-[#61d5e5] h-[3px] shrink-0 w-[2px]" data-name="矩形" />
      <div className="bg-[#61d5e5] h-[3px] shrink-0 w-[2px]" data-name="矩形" />
    </div>
  );
}

function Frame66() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <Frame122 />
      <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[22px] not-italic relative shrink-0 text-[#626c78] text-[14px]">舒适区上限：</p>
    </div>
  );
}

function Frame106() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Frame66 />
      <p className="css-ew64yg font-['Microsoft_YaHei:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#1b2129] text-[14px]">30.5℃</p>
    </div>
  );
}

function Frame123() {
  return (
    <div className="content-stretch flex gap-px items-center overflow-clip relative shrink-0 w-[12px]">
      <div className="bg-[#f7736c] h-[3px] shrink-0 w-[2px]" data-name="矩形" />
      <div className="bg-[#f7736c] h-[3px] shrink-0 w-[2px]" data-name="矩形" />
      <div className="bg-[#f7736c] h-[3px] shrink-0 w-[2px]" data-name="矩形" />
      <div className="bg-[#f7736c] h-[3px] shrink-0 w-[2px]" data-name="矩形" />
      <div className="bg-[#f7736c] h-[3px] shrink-0 w-[2px]" data-name="矩形" />
      <div className="bg-[#f7736c] h-[3px] shrink-0 w-[2px]" data-name="矩形" />
    </div>
  );
}

function Frame67() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <Frame123 />
      <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[22px] not-italic relative shrink-0 text-[#626c78] text-[14px]">过热门限：</p>
    </div>
  );
}

function Frame103() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Frame67 />
      <p className="css-ew64yg font-['Microsoft_YaHei:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#1b2129] text-[14px]">30.5℃</p>
    </div>
  );
}

function Frame211() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0">
      <Frame104 />
      <Frame105 />
      <Frame106 />
      <Frame103 />
    </div>
  );
}

function Frame54() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col gap-[12px] items-start left-[943.74px] p-[12px] rounded-[4px] top-[43px] w-[242px]">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-[1.221px] border-solid inset-[-1.221px] pointer-events-none rounded-[5.221px] shadow-[0px_3.664px_14.655px_0px_rgba(27,33,41,0.12),0px_0.611px_3.664px_0px_rgba(27,33,41,0.08)]" />
      <Frame210 />
      <div className="h-0 relative shrink-0 w-full">
        <div className="absolute inset-[-0.5px_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 218 1">
            <path d="M0 0.5H218" id="Vector 4527" stroke="var(--stroke-0, #E1E5EB)" />
          </svg>
        </div>
      </div>
      <Frame176 />
      <div className="h-0 relative shrink-0 w-full">
        <div className="absolute inset-[-0.5px_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 218 1">
            <path d="M0 0.5H218" id="Vector 4527" stroke="var(--stroke-0, #E1E5EB)" />
          </svg>
        </div>
      </div>
      <Frame211 />
    </div>
  );
}

function Frame266() {
  return (
    <div className="bg-white h-[305px] relative rounded-[8px] shrink-0 w-full">
      <div className="content-stretch flex flex-col gap-[8px] items-start px-[12px] py-[16px] relative size-full">
        <Frame206 />
        <Component4 />
        <Frame17 />
        <div className="absolute flex h-[147px] items-center justify-center left-[372px] top-[97px] w-[551px]">
          <div className="flex-none rotate-180">
            <div className="bg-gradient-to-t from-[rgba(57,146,255,0)] h-[147px] opacity-20 to-[#3992ff] w-[551px]" />
          </div>
        </div>
        <Frame272 />
        <Frame54 />
      </div>
    </div>
  );
}

function Frame260() {
  return (
    <div className="content-stretch flex flex-col font-['Microsoft_YaHei_UI:Regular',sans-serif] gap-[4px] items-start justify-center leading-[22px] not-italic relative shrink-0 text-[#626c78] text-[14px]">
      <p className="css-ew64yg relative shrink-0">服务该空间的系统：东区冷站</p>
      <p className="css-ew64yg relative shrink-0">温度标准：在空间营业时段内，室内温度不可超过过冷/过热门限，允许持续偏冷/偏热不超过1.5h，但其中12:00~14:00,15:00~21:00温度仅能保持在舒适区间</p>
    </div>
  );
}

function Component8() {
  return (
    <div className="absolute h-[48px] left-[197.7px] top-[327px] w-[39.692px]" data-name="交互组件-4标记点">
      <div className="-translate-x-1/2 -translate-y-1/2 absolute flex flex-col font-['PingFang_SC:Semibold',sans-serif] h-[43.195px] justify-center leading-[0] left-[19.85px] not-italic text-[23.154px] text-center text-white top-[21.6px] w-[39.692px]">
        <p className="css-4hzbpn leading-[normal]">2</p>
      </div>
    </div>
  );
}

function Frame273() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0 w-full">
      <Component />
      <Frame266 />
      <Frame260 />
      <Component8 />
    </div>
  );
}

function Component9() {
  return (
    <div className="content-stretch flex gap-[9px] items-center relative rounded-[4px] shrink-0" data-name="小蓝标">
      <div className="bg-[#246fe5] h-[14px] shrink-0 w-[3px]" />
      <p className="css-ew64yg font-['Microsoft_YaHei_UI:Bold',sans-serif] leading-[24px] not-italic relative shrink-0 text-[#2e3742] text-[16px]">服务空间的空调机组</p>
    </div>
  );
}

function Frame55() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <div className="bg-[#626c78] h-[3px] shrink-0 w-[16px]" data-name="矩形" />
      <p className="css-ew64yg font-['Microsoft_YaHei:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#626c78] text-[14px]">设备开关设定</p>
    </div>
  );
}

function Frame141() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Frame55 />
    </div>
  );
}

function Frame142() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Frame141 />
    </div>
  );
}

function Frame278() {
  return (
    <div className="content-stretch flex items-start justify-between relative shrink-0 w-[16px]">
      <div className="bg-[#626c78] shrink-0 size-[3px]" data-name="矩形" />
      <div className="bg-[#626c78] shrink-0 size-[3px]" data-name="矩形" />
      <div className="bg-[#626c78] shrink-0 size-[3px]" data-name="矩形" />
      <div className="bg-[#626c78] shrink-0 size-[3px]" data-name="矩形" />
    </div>
  );
}

function Frame68() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <Frame278 />
      <p className="css-ew64yg font-['Microsoft_YaHei:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#626c78] text-[14px]">运行状态</p>
    </div>
  );
}

function Frame146() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Frame68 />
    </div>
  );
}

function Frame145() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Frame146 />
    </div>
  );
}

function Frame69() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <div className="bg-[#2481f2] h-[3px] shrink-0 w-[16px]" data-name="矩形" />
      <p className="css-ew64yg font-['Microsoft_YaHei:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#626c78] text-[14px]">空调机组#1</p>
    </div>
  );
}

function Frame147() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Frame69 />
    </div>
  );
}

function Frame144() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Frame147 />
    </div>
  );
}

function Frame70() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <div className="bg-[#33d4d2] h-[3px] shrink-0 w-[16px]" data-name="矩形" />
      <p className="css-ew64yg font-['Microsoft_YaHei:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#626c78] text-[14px]">空调机组#2</p>
    </div>
  );
}

function Frame148() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Frame70 />
    </div>
  );
}

function Frame143() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Frame148 />
    </div>
  );
}

function Frame207() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0">
      <Frame142 />
      <Frame145 />
      <Frame144 />
      <Frame143 />
    </div>
  );
}

function Frame107() {
  return (
    <div className="content-stretch flex h-[32px] items-center justify-between overflow-clip relative shrink-0 w-full">
      <p className="css-ew64yg font-['Microsoft_YaHei:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#2e3742] text-[16px]">运行状态</p>
      <Frame207 />
    </div>
  );
}

function Frame9() {
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
      <p className="css-4hzbpn font-['PingFang_SC:Regular',sans-serif] leading-[18px] not-italic relative shrink-0 text-[#646c73] text-[12px] text-right w-[24px]">停止</p>
    </div>
  );
}

function Frame18() {
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
      <p className="css-4hzbpn font-['PingFang_SC:Regular',sans-serif] leading-[18px] not-italic relative shrink-0 text-[#646c73] text-[12px] text-right w-[24px]">运行</p>
    </div>
  );
}

function x1() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start justify-between min-h-px min-w-px overflow-clip relative w-full" data-name="图表X轴">
      <Frame9 />
      <Frame18 />
    </div>
  );
}

function Component10() {
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

function Frame5() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col h-full items-start min-h-px min-w-px relative">
      <x1 />
      <Component10 />
    </div>
  );
}

function Component11() {
  return (
    <div className="content-stretch flex flex-[1_0_0] items-start min-h-px min-w-px relative w-full z-[1]" data-name="图表">
      <Frame5 />
    </div>
  );
}

function Frame19() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col isolate items-start min-h-px min-w-px relative w-full">
      <Component11 />
    </div>
  );
}

function Component12() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-h-px min-w-px relative w-full" data-name="动态图表">
      <Frame19 />
    </div>
  );
}

function Frame108() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] h-[162px] items-start relative shrink-0 w-full">
      <Component12 />
      <div className="absolute h-[116px] left-[48px] top-[19px] w-[1085.5px]">
        <div className="absolute inset-[-0.43%_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1085.5 117">
            <path d={svgPaths.p24b88400} id="Vector 4575" stroke="var(--stroke-0, #246FE5)" />
          </svg>
        </div>
      </div>
      <div className="absolute h-[116px] left-[45.8px] top-[19px] w-[1098.202px]">
        <div className="absolute inset-[-0.43%_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1098.2 117">
            <path d={svgPaths.p5912b40} id="Vector 4577" stroke="var(--stroke-0, #246FE5)" />
          </svg>
        </div>
      </div>
      <div className="absolute h-[116px] left-[43.58px] top-[19px] w-[1100.416px]">
        <div className="absolute inset-[-0.43%_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1100.42 117">
            <path d={svgPaths.p11c82f00} id="Vector 4578" stroke="var(--stroke-0, #246FE5)" strokeDasharray="4 4" />
          </svg>
        </div>
      </div>
      <div className="absolute h-[116px] left-[42.75px] top-[19px] w-[1101.253px]">
        <div className="absolute inset-[-0.43%_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1101.25 117">
            <path d={svgPaths.p1716d098} id="Vector 4576" stroke="var(--stroke-0, #14C4C4)" strokeDasharray="4 4" />
          </svg>
        </div>
      </div>
      <div className="absolute left-[439px] size-[8px] top-[15px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 8">
          <circle cx="4" cy="4" fill="var(--fill-0, white)" id="Ellipse 2" r="3" stroke="var(--stroke-0, #2481F2)" strokeWidth="2" />
        </svg>
      </div>
    </div>
  );
}

function Frame257() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0 w-full">
      <Frame107 />
      <Frame108 />
    </div>
  );
}

function Frame113() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <p className="css-ew64yg font-['Microsoft_YaHei_UI:Bold',sans-serif] leading-[22px] not-italic relative shrink-0 text-[#1b2129] text-[14px]">设备开关设定</p>
    </div>
  );
}

function Frame179() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <div className="bg-[#2481f2] h-[3px] shrink-0 w-[16px]" data-name="矩形" />
      <p className="css-ew64yg font-['Microsoft_YaHei:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#626c78] text-[14px]">空调机组#1：</p>
    </div>
  );
}

function Frame96() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Frame179 />
      <p className="css-ew64yg font-['Microsoft_YaHei:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#1b2129] text-[14px]">开启</p>
    </div>
  );
}

function Frame182() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <div className="bg-[#33d4d2] h-[3px] shrink-0 w-[16px]" data-name="矩形" />
      <p className="css-ew64yg font-['Microsoft_YaHei:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#626c78] text-[14px]">空调机组#2：</p>
    </div>
  );
}

function Frame97() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Frame182 />
      <p className="css-ew64yg font-['Microsoft_YaHei:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#1b2129] text-[14px]">关闭</p>
    </div>
  );
}

function Frame175() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0">
      <Frame96 />
      <Frame97 />
    </div>
  );
}

function Frame115() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0">
      <Frame113 />
      <Frame175 />
    </div>
  );
}

function Frame114() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <p className="css-ew64yg font-['Microsoft_YaHei_UI:Bold',sans-serif] leading-[22px] not-italic relative shrink-0 text-[#1b2129] text-[14px]">运行状态</p>
    </div>
  );
}

function Frame279() {
  return (
    <div className="content-stretch flex items-start justify-between relative shrink-0 w-[16px]">
      <div className="bg-[#2481f2] shrink-0 size-[3px]" data-name="矩形" />
      <div className="bg-[#2481f2] shrink-0 size-[3px]" data-name="矩形" />
      <div className="bg-[#2481f2] shrink-0 size-[3px]" data-name="矩形" />
      <div className="bg-[#2481f2] shrink-0 size-[3px]" data-name="矩形" />
    </div>
  );
}

function Frame183() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <Frame279 />
      <p className="css-ew64yg font-['Microsoft_YaHei:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#626c78] text-[14px]">空调机组#1：</p>
    </div>
  );
}

function Frame98() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Frame183 />
      <p className="css-ew64yg font-['Microsoft_YaHei:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#1b2129] text-[14px]">运行</p>
    </div>
  );
}

function Frame280() {
  return (
    <div className="content-stretch flex items-start justify-between relative shrink-0 w-[16px]">
      <div className="bg-[#33d4d2] shrink-0 size-[3px]" data-name="矩形" />
      <div className="bg-[#33d4d2] shrink-0 size-[3px]" data-name="矩形" />
      <div className="bg-[#33d4d2] shrink-0 size-[3px]" data-name="矩形" />
      <div className="bg-[#33d4d2] shrink-0 size-[3px]" data-name="矩形" />
    </div>
  );
}

function Frame184() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <Frame280 />
      <p className="css-ew64yg font-['Microsoft_YaHei:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#626c78] text-[14px]">空调机组#2：</p>
    </div>
  );
}

function Frame99() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Frame184 />
      <p className="css-ew64yg font-['Microsoft_YaHei:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#1b2129] text-[14px]">停止</p>
    </div>
  );
}

function Frame8() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-[218px]">
      <Frame114 />
      <Frame98 />
      <Frame99 />
    </div>
  );
}

function Frame4() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col gap-[12px] items-start left-[505.38px] p-[12px] rounded-[4px] top-[9px]">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-[1.221px] border-solid inset-[-1.221px] pointer-events-none rounded-[5.221px] shadow-[0px_3.664px_14.655px_0px_rgba(27,33,41,0.12),0px_0.611px_3.664px_0px_rgba(27,33,41,0.08)]" />
      <p className="css-ew64yg font-['Microsoft_YaHei:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#2e3742] text-[14px]">2025年8月27日 10:30</p>
      <div className="h-0 relative shrink-0 w-full">
        <div className="absolute inset-[-0.5px_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 218 1">
            <path d="M0 0.5H218" id="Vector 4527" stroke="var(--stroke-0, #E1E5EB)" />
          </svg>
        </div>
      </div>
      <Frame115 />
      <div className="h-0 relative shrink-0 w-full">
        <div className="absolute inset-[-0.5px_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 218 1">
            <path d="M0 0.5H218" id="Vector 4527" stroke="var(--stroke-0, #E1E5EB)" />
          </svg>
        </div>
      </div>
      <Frame8 />
    </div>
  );
}

function Frame125() {
  return (
    <div className="bg-white h-[235px] relative rounded-[8px] shrink-0 w-full">
      <div aria-hidden="true" className="absolute border border-solid border-white inset-0 pointer-events-none rounded-[8px]" />
      <div className="content-stretch flex flex-col gap-[12px] items-start px-[12px] py-[16px] relative size-full">
        <Frame257 />
        <Frame4 />
      </div>
    </div>
  );
}

function Frame228() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <p className="css-ew64yg font-['Microsoft_YaHei_UI:Bold',sans-serif] leading-[0] not-italic relative shrink-0 text-[#2e3742] text-[16px]">
        <span className="leading-[24px]">服务区域温度</span>
        <span className="font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[24px]">(℃)</span>
      </p>
    </div>
  );
}

function Frame71() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <div className="bg-[#626c78] h-[3px] shrink-0 w-[16px]" data-name="矩形" />
      <p className="css-ew64yg font-['Microsoft_YaHei:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#626c78] text-[14px]">服务区域温度设定</p>
    </div>
  );
}

function Frame149() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Frame71 />
    </div>
  );
}

function Frame150() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Frame149 />
    </div>
  );
}

function Frame281() {
  return (
    <div className="content-stretch flex items-start justify-between relative shrink-0 w-[16px]">
      <div className="bg-[#626c78] shrink-0 size-[3px]" data-name="矩形" />
      <div className="bg-[#626c78] shrink-0 size-[3px]" data-name="矩形" />
      <div className="bg-[#626c78] shrink-0 size-[3px]" data-name="矩形" />
      <div className="bg-[#626c78] shrink-0 size-[3px]" data-name="矩形" />
    </div>
  );
}

function Frame72() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <Frame281 />
      <p className="css-ew64yg font-['Microsoft_YaHei:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#626c78] text-[14px]">服务区域温度</p>
    </div>
  );
}

function Frame151() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Frame72 />
    </div>
  );
}

function Frame152() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Frame151 />
    </div>
  );
}

function Frame73() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <div className="bg-[#2481f2] h-[3px] shrink-0 w-[16px]" data-name="矩形" />
      <p className="css-ew64yg font-['Microsoft_YaHei:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#626c78] text-[14px]">空调机组#1</p>
    </div>
  );
}

function Frame153() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Frame73 />
    </div>
  );
}

function Frame154() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Frame153 />
    </div>
  );
}

function Frame74() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <div className="bg-[#33d4d2] h-[3px] shrink-0 w-[16px]" data-name="矩形" />
      <p className="css-ew64yg font-['Microsoft_YaHei:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#626c78] text-[14px]">空调机组#2</p>
    </div>
  );
}

function Frame155() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Frame74 />
    </div>
  );
}

function Frame156() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Frame155 />
    </div>
  );
}

function Frame229() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0">
      <Frame150 />
      <Frame152 />
      <Frame154 />
      <Frame156 />
    </div>
  );
}

function Frame227() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <Frame228 />
      <Frame229 />
    </div>
  );
}

function Frame() {
  return <div className="absolute h-[143px] left-[48px] top-0 w-[1092px] z-[3]" />;
}

function Frame20() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] items-center min-h-px min-w-px py-[10px] relative w-full">
      <p className="css-4hzbpn font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[18px] not-italic relative shrink-0 text-[#646c73] text-[12px] text-right w-[24px]">50</p>
      <div className="flex-[1_0_0] h-0 min-h-px min-w-px relative" data-name="line">
        <div className="absolute inset-[-0.5px_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1130 1">
            <path d="M1130 0.5H0" id="line" stroke="var(--stroke-0, #E4E6E7)" strokeDasharray="3 3" />
          </svg>
        </div>
      </div>
      <p className="css-4hzbpn font-['PingFang_SC:Regular',sans-serif] leading-[18px] not-italic relative shrink-0 text-[12px] text-[rgba(100,108,115,0)] w-[18px]">20</p>
    </div>
  );
}

function Frame21() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] items-center min-h-px min-w-px py-[10px] relative w-full">
      <p className="css-4hzbpn font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[18px] not-italic relative shrink-0 text-[#646c73] text-[12px] text-right w-[24px]">40</p>
      <div className="flex-[1_0_0] h-0 min-h-px min-w-px relative" data-name="line">
        <div className="absolute inset-[-0.5px_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1130 1">
            <path d="M1130 0.5H0" id="line" stroke="var(--stroke-0, #E4E6E7)" strokeDasharray="3 3" />
          </svg>
        </div>
      </div>
      <p className="css-4hzbpn font-['PingFang_SC:Regular',sans-serif] leading-[18px] not-italic relative shrink-0 text-[12px] text-[rgba(100,108,115,0)] w-[18px]">16</p>
    </div>
  );
}

function Frame22() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] items-center min-h-px min-w-px py-[10px] relative w-full">
      <p className="css-4hzbpn font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[18px] not-italic relative shrink-0 text-[#646c73] text-[12px] text-right w-[24px]">30</p>
      <div className="flex-[1_0_0] h-0 min-h-px min-w-px relative" data-name="line">
        <div className="absolute inset-[-0.5px_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1130 1">
            <path d="M1130 0.5H0" id="line" stroke="var(--stroke-0, #E4E6E7)" strokeDasharray="3 3" />
          </svg>
        </div>
      </div>
      <p className="css-4hzbpn font-['PingFang_SC:Regular',sans-serif] leading-[18px] not-italic relative shrink-0 text-[12px] text-[rgba(100,108,115,0)] w-[18px]">12</p>
    </div>
  );
}

function Frame23() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] items-center min-h-px min-w-px py-[10px] relative w-full">
      <p className="css-4hzbpn font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[18px] not-italic relative shrink-0 text-[#646c73] text-[12px] text-right w-[24px]">20</p>
      <div className="flex-[1_0_0] h-0 min-h-px min-w-px relative" data-name="line">
        <div className="absolute inset-[-0.5px_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1130 1">
            <path d="M1130 0.5H0" id="line" stroke="var(--stroke-0, #E4E6E7)" strokeDasharray="3 3" />
          </svg>
        </div>
      </div>
      <p className="css-4hzbpn font-['PingFang_SC:Regular',sans-serif] leading-[18px] not-italic relative shrink-0 text-[12px] text-[rgba(100,108,115,0)] w-[18px]">8</p>
    </div>
  );
}

function Frame24() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] items-center min-h-px min-w-px py-[10px] relative w-full">
      <p className="css-4hzbpn font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[18px] not-italic relative shrink-0 text-[#646c73] text-[12px] text-right w-[24px]">10</p>
      <div className="flex-[1_0_0] h-0 min-h-px min-w-px relative" data-name="line">
        <div className="absolute inset-[-0.5px_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1130 1">
            <path d="M1130 0.5H0" id="line" stroke="var(--stroke-0, #E4E6E7)" strokeDasharray="3 3" />
          </svg>
        </div>
      </div>
      <p className="css-4hzbpn font-['PingFang_SC:Regular',sans-serif] leading-[18px] not-italic relative shrink-0 text-[12px] text-[rgba(100,108,115,0)] w-[18px]">4</p>
    </div>
  );
}

function Frame25() {
  return (
    <div className="content-stretch flex gap-[8px] h-[32px] items-center pt-[10px] relative shrink-0 w-full">
      <p className="css-4hzbpn font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[18px] not-italic relative shrink-0 text-[#646c73] text-[12px] text-right w-[24px]">0</p>
      <div className="flex-[1_0_0] h-0 min-h-px min-w-px relative" data-name="line">
        <div className="absolute inset-[-0.5px_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1130 1">
            <path d="M1130 0.5H0" id="line" stroke="var(--stroke-0, #C4C9CF)" />
          </svg>
        </div>
      </div>
      <p className="css-4hzbpn font-['PingFang_SC:Regular',sans-serif] leading-[18px] not-italic relative shrink-0 text-[12px] text-[rgba(100,108,115,0)] w-[18px]">0</p>
    </div>
  );
}

function x2() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start justify-between min-h-px min-w-px overflow-clip relative w-full" data-name="左侧X轴">
      <Frame20 />
      <Frame21 />
      <Frame22 />
      <Frame23 />
      <Frame24 />
      <Frame25 />
    </div>
  );
}

function Component13() {
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

function Frame127() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col h-[172px] items-start min-h-px min-w-px relative">
      <x2 />
      <Component13 />
    </div>
  );
}

function Component14() {
  return (
    <div className="content-stretch flex items-start relative shrink-0 w-full z-[2]" data-name="坐标">
      <Frame127 />
    </div>
  );
}

function Frame268() {
  return (
    <div className="absolute h-[120.5px] left-[37px] top-[12px] w-[1096px] z-[1]">
      <div className="absolute inset-[-7.15%_0_0_-0.03%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1096.29 129.111">
          <g id="Frame 1937107229">
            <path d={svgPaths.p17dfbce0} id="Vector 4573" stroke="var(--stroke-0, #33D4D2)" />
            <path d={svgPaths.p14667100} id="Vector 4576" stroke="var(--stroke-0, #33D4D2)" strokeDasharray="4 4" />
            <path d={svgPaths.p9a6e500} id="Vector 4574" stroke="var(--stroke-0, #2481F2)" />
            <path d={svgPaths.p235d4900} id="Vector 4575" stroke="var(--stroke-0, #2481F2)" strokeDasharray="4 4" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Frame26() {
  return (
    <div className="content-stretch flex flex-col gap-[14px] h-[172px] isolate items-start relative shrink-0 w-full">
      <Frame />
      <Component14 />
      <Frame268 />
    </div>
  );
}

function Frame124() {
  return (
    <div className="bg-white relative rounded-[8px] shrink-0 w-full">
      <div aria-hidden="true" className="absolute border border-solid border-white inset-0 pointer-events-none rounded-[8px]" />
      <div className="content-stretch flex flex-col gap-[12px] items-start px-[12px] py-[16px] relative w-full">
        <Frame227 />
        <Frame26 />
      </div>
    </div>
  );
}

function Frame240() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <p className="css-ew64yg font-['Microsoft_YaHei_UI:Bold',sans-serif] leading-[0] not-italic relative shrink-0 text-[#2e3742] text-[16px]">
        <span className="leading-[24px]">送风温度</span>
        <span className="font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[24px]">(℃)</span>
      </p>
    </div>
  );
}

function Frame75() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <div className="bg-[#626c78] h-[3px] shrink-0 w-[16px]" data-name="矩形" />
      <p className="css-ew64yg font-['Microsoft_YaHei:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#626c78] text-[14px]">送风温度设定</p>
    </div>
  );
}

function Frame157() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Frame75 />
    </div>
  );
}

function Frame158() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Frame157 />
    </div>
  );
}

function Frame282() {
  return (
    <div className="content-stretch flex items-start justify-between relative shrink-0 w-[16px]">
      <div className="bg-[#626c78] shrink-0 size-[3px]" data-name="矩形" />
      <div className="bg-[#626c78] shrink-0 size-[3px]" data-name="矩形" />
      <div className="bg-[#626c78] shrink-0 size-[3px]" data-name="矩形" />
      <div className="bg-[#626c78] shrink-0 size-[3px]" data-name="矩形" />
    </div>
  );
}

function Frame76() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <Frame282 />
      <p className="css-ew64yg font-['Microsoft_YaHei:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#626c78] text-[14px]">送风温度</p>
    </div>
  );
}

function Frame159() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Frame76 />
    </div>
  );
}

function Frame160() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Frame159 />
    </div>
  );
}

function Frame77() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <div className="bg-[#2481f2] h-[3px] shrink-0 w-[16px]" data-name="矩形" />
      <p className="css-ew64yg font-['Microsoft_YaHei:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#626c78] text-[14px]">空调机组#1</p>
    </div>
  );
}

function Frame161() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Frame77 />
    </div>
  );
}

function Frame162() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Frame161 />
    </div>
  );
}

function Frame78() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <div className="bg-[#33d4d2] h-[3px] shrink-0 w-[16px]" data-name="矩形" />
      <p className="css-ew64yg font-['Microsoft_YaHei:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#626c78] text-[14px]">空调机组#2</p>
    </div>
  );
}

function Frame163() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Frame78 />
    </div>
  );
}

function Frame164() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Frame163 />
    </div>
  );
}

function Frame241() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0">
      <Frame158 />
      <Frame160 />
      <Frame162 />
      <Frame164 />
    </div>
  );
}

function Frame242() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <Frame240 />
      <Frame241 />
    </div>
  );
}

function Frame1() {
  return <div className="absolute h-[143px] left-[48px] top-0 w-[1092px] z-[3]" />;
}

function Frame27() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] items-center min-h-px min-w-px py-[10px] relative w-full">
      <p className="css-4hzbpn font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[18px] not-italic relative shrink-0 text-[#646c73] text-[12px] text-right w-[24px]">50</p>
      <div className="flex-[1_0_0] h-0 min-h-px min-w-px relative" data-name="line">
        <div className="absolute inset-[-0.5px_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1130 1">
            <path d="M1130 0.5H0" id="line" stroke="var(--stroke-0, #E4E6E7)" strokeDasharray="3 3" />
          </svg>
        </div>
      </div>
      <p className="css-4hzbpn font-['PingFang_SC:Regular',sans-serif] leading-[18px] not-italic relative shrink-0 text-[12px] text-[rgba(100,108,115,0)] w-[18px]">20</p>
    </div>
  );
}

function Frame28() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] items-center min-h-px min-w-px py-[10px] relative w-full">
      <p className="css-4hzbpn font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[18px] not-italic relative shrink-0 text-[#646c73] text-[12px] text-right w-[24px]">40</p>
      <div className="flex-[1_0_0] h-0 min-h-px min-w-px relative" data-name="line">
        <div className="absolute inset-[-0.5px_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1130 1">
            <path d="M1130 0.5H0" id="line" stroke="var(--stroke-0, #E4E6E7)" strokeDasharray="3 3" />
          </svg>
        </div>
      </div>
      <p className="css-4hzbpn font-['PingFang_SC:Regular',sans-serif] leading-[18px] not-italic relative shrink-0 text-[12px] text-[rgba(100,108,115,0)] w-[18px]">16</p>
    </div>
  );
}

function Frame29() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] items-center min-h-px min-w-px py-[10px] relative w-full">
      <p className="css-4hzbpn font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[18px] not-italic relative shrink-0 text-[#646c73] text-[12px] text-right w-[24px]">30</p>
      <div className="flex-[1_0_0] h-0 min-h-px min-w-px relative" data-name="line">
        <div className="absolute inset-[-0.5px_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1130 1">
            <path d="M1130 0.5H0" id="line" stroke="var(--stroke-0, #E4E6E7)" strokeDasharray="3 3" />
          </svg>
        </div>
      </div>
      <p className="css-4hzbpn font-['PingFang_SC:Regular',sans-serif] leading-[18px] not-italic relative shrink-0 text-[12px] text-[rgba(100,108,115,0)] w-[18px]">12</p>
    </div>
  );
}

function Frame30() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] items-center min-h-px min-w-px py-[10px] relative w-full">
      <p className="css-4hzbpn font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[18px] not-italic relative shrink-0 text-[#646c73] text-[12px] text-right w-[24px]">20</p>
      <div className="flex-[1_0_0] h-0 min-h-px min-w-px relative" data-name="line">
        <div className="absolute inset-[-0.5px_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1130 1">
            <path d="M1130 0.5H0" id="line" stroke="var(--stroke-0, #E4E6E7)" strokeDasharray="3 3" />
          </svg>
        </div>
      </div>
      <p className="css-4hzbpn font-['PingFang_SC:Regular',sans-serif] leading-[18px] not-italic relative shrink-0 text-[12px] text-[rgba(100,108,115,0)] w-[18px]">8</p>
    </div>
  );
}

function Frame31() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] items-center min-h-px min-w-px py-[10px] relative w-full">
      <p className="css-4hzbpn font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[18px] not-italic relative shrink-0 text-[#646c73] text-[12px] text-right w-[24px]">10</p>
      <div className="flex-[1_0_0] h-0 min-h-px min-w-px relative" data-name="line">
        <div className="absolute inset-[-0.5px_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1130 1">
            <path d="M1130 0.5H0" id="line" stroke="var(--stroke-0, #E4E6E7)" strokeDasharray="3 3" />
          </svg>
        </div>
      </div>
      <p className="css-4hzbpn font-['PingFang_SC:Regular',sans-serif] leading-[18px] not-italic relative shrink-0 text-[12px] text-[rgba(100,108,115,0)] w-[18px]">4</p>
    </div>
  );
}

function Frame32() {
  return (
    <div className="content-stretch flex gap-[8px] h-[32px] items-center pt-[10px] relative shrink-0 w-full">
      <p className="css-4hzbpn font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[18px] not-italic relative shrink-0 text-[#646c73] text-[12px] text-right w-[24px]">0</p>
      <div className="flex-[1_0_0] h-0 min-h-px min-w-px relative" data-name="line">
        <div className="absolute inset-[-0.5px_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1130 1">
            <path d="M1130 0.5H0" id="line" stroke="var(--stroke-0, #C4C9CF)" />
          </svg>
        </div>
      </div>
      <p className="css-4hzbpn font-['PingFang_SC:Regular',sans-serif] leading-[18px] not-italic relative shrink-0 text-[12px] text-[rgba(100,108,115,0)] w-[18px]">0</p>
    </div>
  );
}

function x3() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start justify-between min-h-px min-w-px overflow-clip relative w-full" data-name="左侧X轴">
      <Frame27 />
      <Frame28 />
      <Frame29 />
      <Frame30 />
      <Frame31 />
      <Frame32 />
    </div>
  );
}

function Component15() {
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

function Frame128() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col h-[172px] items-start min-h-px min-w-px relative">
      <x3 />
      <Component15 />
    </div>
  );
}

function Component16() {
  return (
    <div className="content-stretch flex items-start relative shrink-0 w-full z-[2]" data-name="坐标">
      <Frame128 />
    </div>
  );
}

function Frame269() {
  return (
    <div className="absolute h-[120.5px] left-[37px] top-[12px] w-[1096px] z-[1]">
      <div className="absolute inset-[-7.15%_0_0_-0.03%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1096.29 129.111">
          <g id="Frame 1937107229">
            <path d={svgPaths.p17dfbce0} id="Vector 4573" stroke="var(--stroke-0, #33D4D2)" />
            <path d={svgPaths.p14667100} id="Vector 4576" stroke="var(--stroke-0, #33D4D2)" strokeDasharray="4 4" />
            <path d={svgPaths.p9a6e500} id="Vector 4574" stroke="var(--stroke-0, #2481F2)" />
            <path d={svgPaths.p235d4900} id="Vector 4575" stroke="var(--stroke-0, #2481F2)" strokeDasharray="4 4" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Frame33() {
  return (
    <div className="content-stretch flex flex-col gap-[14px] h-[172px] isolate items-start relative shrink-0 w-full">
      <Frame1 />
      <Component16 />
      <Frame269 />
    </div>
  );
}

function Frame129() {
  return (
    <div className="bg-white relative rounded-[8px] shrink-0 w-full">
      <div aria-hidden="true" className="absolute border border-solid border-white inset-0 pointer-events-none rounded-[8px]" />
      <div className="content-stretch flex flex-col gap-[12px] items-start px-[12px] py-[16px] relative w-full">
        <Frame242 />
        <Frame33 />
      </div>
    </div>
  );
}

function Frame274() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0 w-full">
      <Component9 />
      <Frame125 />
      <Frame124 />
      <Frame129 />
    </div>
  );
}

function Component17() {
  return (
    <div className="content-stretch flex gap-[9px] items-center relative rounded-[4px] shrink-0" data-name="小蓝标">
      <div className="bg-[#246fe5] h-[14px] shrink-0 w-[3px]" />
      <p className="css-ew64yg font-['Microsoft_YaHei_UI:Bold',sans-serif] leading-[24px] not-italic relative shrink-0 text-[#2e3742] text-[16px]">服务空间的新风机组</p>
    </div>
  );
}

function Frame79() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <div className="bg-[#626c78] h-[3px] shrink-0 w-[16px]" data-name="矩形" />
      <p className="css-ew64yg font-['Microsoft_YaHei:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#626c78] text-[14px]">设备开关设定</p>
    </div>
  );
}

function Frame165() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Frame79 />
    </div>
  );
}

function Frame166() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Frame165 />
    </div>
  );
}

function Frame283() {
  return (
    <div className="content-stretch flex items-start justify-between relative shrink-0 w-[16px]">
      <div className="bg-[#626c78] shrink-0 size-[3px]" data-name="矩形" />
      <div className="bg-[#626c78] shrink-0 size-[3px]" data-name="矩形" />
      <div className="bg-[#626c78] shrink-0 size-[3px]" data-name="矩形" />
      <div className="bg-[#626c78] shrink-0 size-[3px]" data-name="矩形" />
    </div>
  );
}

function Frame80() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <Frame283 />
      <p className="css-ew64yg font-['Microsoft_YaHei:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#626c78] text-[14px]">运行状态</p>
    </div>
  );
}

function Frame167() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Frame80 />
    </div>
  );
}

function Frame168() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Frame167 />
    </div>
  );
}

function Frame81() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <div className="bg-[#2481f2] h-[3px] shrink-0 w-[16px]" data-name="矩形" />
      <p className="css-ew64yg font-['Microsoft_YaHei:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#626c78] text-[14px]">新风机组#1</p>
    </div>
  );
}

function Frame169() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Frame81 />
    </div>
  );
}

function Frame170() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Frame169 />
    </div>
  );
}

function Frame82() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <div className="bg-[#33d4d2] h-[3px] shrink-0 w-[16px]" data-name="矩形" />
      <p className="css-ew64yg font-['Microsoft_YaHei:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#626c78] text-[14px]">新风机组2</p>
    </div>
  );
}

function Frame171() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Frame82 />
    </div>
  );
}

function Frame172() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Frame171 />
    </div>
  );
}

function Frame208() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0">
      <Frame166 />
      <Frame168 />
      <Frame170 />
      <Frame172 />
    </div>
  );
}

function Frame109() {
  return (
    <div className="content-stretch flex h-[32px] items-center justify-between overflow-clip relative shrink-0 w-full">
      <p className="css-ew64yg font-['Microsoft_YaHei:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#2e3742] text-[16px]">运行状态</p>
      <Frame208 />
    </div>
  );
}

function Frame34() {
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
      <p className="css-4hzbpn font-['PingFang_SC:Regular',sans-serif] leading-[18px] not-italic relative shrink-0 text-[#646c73] text-[12px] text-right w-[24px]">停止</p>
    </div>
  );
}

function Frame35() {
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
      <p className="css-4hzbpn font-['PingFang_SC:Regular',sans-serif] leading-[18px] not-italic relative shrink-0 text-[#646c73] text-[12px] text-right w-[24px]">运行</p>
    </div>
  );
}

function x4() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start justify-between min-h-px min-w-px overflow-clip relative w-full" data-name="图表X轴">
      <Frame34 />
      <Frame35 />
    </div>
  );
}

function Component18() {
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

function Frame6() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col h-full items-start min-h-px min-w-px relative">
      <x4 />
      <Component18 />
    </div>
  );
}

function Component19() {
  return (
    <div className="content-stretch flex flex-[1_0_0] items-start min-h-px min-w-px relative w-full z-[1]" data-name="图表">
      <Frame6 />
    </div>
  );
}

function Frame36() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col isolate items-start min-h-px min-w-px relative w-full">
      <Component19 />
    </div>
  );
}

function Component20() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-h-px min-w-px relative w-full" data-name="动态图表">
      <Frame36 />
    </div>
  );
}

function Frame110() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] h-[162px] items-start relative shrink-0 w-full">
      <Component20 />
      <div className="absolute h-[116px] left-[48px] top-[19px] w-[1085.5px]">
        <div className="absolute inset-[-0.43%_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1085.5 117">
            <path d={svgPaths.p24b88400} id="Vector 4575" stroke="var(--stroke-0, #246FE5)" />
          </svg>
        </div>
      </div>
      <div className="absolute h-[116px] left-[45.8px] top-[19px] w-[1098.202px]">
        <div className="absolute inset-[-0.43%_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1098.2 117">
            <path d={svgPaths.p5912b40} id="Vector 4577" stroke="var(--stroke-0, #246FE5)" />
          </svg>
        </div>
      </div>
      <div className="absolute h-[116px] left-[43.58px] top-[19px] w-[1100.416px]">
        <div className="absolute inset-[-0.43%_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1100.42 117">
            <path d={svgPaths.p11c82f00} id="Vector 4578" stroke="var(--stroke-0, #246FE5)" strokeDasharray="4 4" />
          </svg>
        </div>
      </div>
      <div className="absolute h-[116px] left-[42.75px] top-[19px] w-[1101.253px]">
        <div className="absolute inset-[-0.43%_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1101.25 117">
            <path d={svgPaths.p1716d098} id="Vector 4576" stroke="var(--stroke-0, #14C4C4)" strokeDasharray="4 4" />
          </svg>
        </div>
      </div>
      <div className="absolute left-[439px] size-[8px] top-[15px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 8">
          <circle cx="4" cy="4" fill="var(--fill-0, white)" id="Ellipse 2" r="3" stroke="var(--stroke-0, #2481F2)" strokeWidth="2" />
        </svg>
      </div>
    </div>
  );
}

function Frame258() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0 w-full">
      <Frame109 />
      <Frame110 />
    </div>
  );
}

function Frame130() {
  return (
    <div className="bg-white h-[235px] relative rounded-[8px] shrink-0 w-full">
      <div aria-hidden="true" className="absolute border border-solid border-white inset-0 pointer-events-none rounded-[8px]" />
      <div className="content-stretch flex flex-col items-start px-[12px] py-[16px] relative size-full">
        <Frame258 />
      </div>
    </div>
  );
}

function Frame243() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <p className="css-ew64yg font-['Microsoft_YaHei_UI:Bold',sans-serif] leading-[0] not-italic relative shrink-0 text-[#2e3742] text-[16px]">
        <span className="leading-[24px]">服务区域温度</span>
        <span className="font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[24px]">(℃)</span>
      </p>
    </div>
  );
}

function Frame83() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <div className="bg-[#626c78] h-[3px] shrink-0 w-[16px]" data-name="矩形" />
      <p className="css-ew64yg font-['Microsoft_YaHei:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#626c78] text-[14px]">服务区域温度设定</p>
    </div>
  );
}

function Frame173() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Frame83 />
    </div>
  );
}

function Frame174() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Frame173 />
    </div>
  );
}

function Frame284() {
  return (
    <div className="content-stretch flex items-start justify-between relative shrink-0 w-[16px]">
      <div className="bg-[#626c78] shrink-0 size-[3px]" data-name="矩形" />
      <div className="bg-[#626c78] shrink-0 size-[3px]" data-name="矩形" />
      <div className="bg-[#626c78] shrink-0 size-[3px]" data-name="矩形" />
      <div className="bg-[#626c78] shrink-0 size-[3px]" data-name="矩形" />
    </div>
  );
}

function Frame84() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <Frame284 />
      <p className="css-ew64yg font-['Microsoft_YaHei:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#626c78] text-[14px]">服务区域温度</p>
    </div>
  );
}

function Frame177() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Frame84 />
    </div>
  );
}

function Frame185() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Frame177 />
    </div>
  );
}

function Frame86() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <div className="bg-[#2481f2] h-[3px] shrink-0 w-[16px]" data-name="矩形" />
      <p className="css-ew64yg font-['Microsoft_YaHei:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#626c78] text-[14px]">新风机组#1</p>
    </div>
  );
}

function Frame186() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Frame86 />
    </div>
  );
}

function Frame187() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Frame186 />
    </div>
  );
}

function Frame87() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <div className="bg-[#33d4d2] h-[3px] shrink-0 w-[16px]" data-name="矩形" />
      <p className="css-ew64yg font-['Microsoft_YaHei:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#626c78] text-[14px]">新风机组#2</p>
    </div>
  );
}

function Frame188() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Frame87 />
    </div>
  );
}

function Frame189() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Frame188 />
    </div>
  );
}

function Frame244() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0">
      <Frame174 />
      <Frame185 />
      <Frame187 />
      <Frame189 />
    </div>
  );
}

function Frame245() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <Frame243 />
      <Frame244 />
    </div>
  );
}

function Frame2() {
  return <div className="absolute h-[143px] left-[48px] top-0 w-[1092px] z-[3]" />;
}

function Frame37() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] items-center min-h-px min-w-px py-[10px] relative w-full">
      <p className="css-4hzbpn font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[18px] not-italic relative shrink-0 text-[#646c73] text-[12px] text-right w-[24px]">50</p>
      <div className="flex-[1_0_0] h-0 min-h-px min-w-px relative" data-name="line">
        <div className="absolute inset-[-0.5px_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1130 1">
            <path d="M1130 0.5H0" id="line" stroke="var(--stroke-0, #E4E6E7)" strokeDasharray="3 3" />
          </svg>
        </div>
      </div>
      <p className="css-4hzbpn font-['PingFang_SC:Regular',sans-serif] leading-[18px] not-italic relative shrink-0 text-[12px] text-[rgba(100,108,115,0)] w-[18px]">20</p>
    </div>
  );
}

function Frame38() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] items-center min-h-px min-w-px py-[10px] relative w-full">
      <p className="css-4hzbpn font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[18px] not-italic relative shrink-0 text-[#646c73] text-[12px] text-right w-[24px]">40</p>
      <div className="flex-[1_0_0] h-0 min-h-px min-w-px relative" data-name="line">
        <div className="absolute inset-[-0.5px_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1130 1">
            <path d="M1130 0.5H0" id="line" stroke="var(--stroke-0, #E4E6E7)" strokeDasharray="3 3" />
          </svg>
        </div>
      </div>
      <p className="css-4hzbpn font-['PingFang_SC:Regular',sans-serif] leading-[18px] not-italic relative shrink-0 text-[12px] text-[rgba(100,108,115,0)] w-[18px]">16</p>
    </div>
  );
}

function Frame39() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] items-center min-h-px min-w-px py-[10px] relative w-full">
      <p className="css-4hzbpn font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[18px] not-italic relative shrink-0 text-[#646c73] text-[12px] text-right w-[24px]">30</p>
      <div className="flex-[1_0_0] h-0 min-h-px min-w-px relative" data-name="line">
        <div className="absolute inset-[-0.5px_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1130 1">
            <path d="M1130 0.5H0" id="line" stroke="var(--stroke-0, #E4E6E7)" strokeDasharray="3 3" />
          </svg>
        </div>
      </div>
      <p className="css-4hzbpn font-['PingFang_SC:Regular',sans-serif] leading-[18px] not-italic relative shrink-0 text-[12px] text-[rgba(100,108,115,0)] w-[18px]">12</p>
    </div>
  );
}

function Frame40() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] items-center min-h-px min-w-px py-[10px] relative w-full">
      <p className="css-4hzbpn font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[18px] not-italic relative shrink-0 text-[#646c73] text-[12px] text-right w-[24px]">20</p>
      <div className="flex-[1_0_0] h-0 min-h-px min-w-px relative" data-name="line">
        <div className="absolute inset-[-0.5px_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1130 1">
            <path d="M1130 0.5H0" id="line" stroke="var(--stroke-0, #E4E6E7)" strokeDasharray="3 3" />
          </svg>
        </div>
      </div>
      <p className="css-4hzbpn font-['PingFang_SC:Regular',sans-serif] leading-[18px] not-italic relative shrink-0 text-[12px] text-[rgba(100,108,115,0)] w-[18px]">8</p>
    </div>
  );
}

function Frame41() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] items-center min-h-px min-w-px py-[10px] relative w-full">
      <p className="css-4hzbpn font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[18px] not-italic relative shrink-0 text-[#646c73] text-[12px] text-right w-[24px]">10</p>
      <div className="flex-[1_0_0] h-0 min-h-px min-w-px relative" data-name="line">
        <div className="absolute inset-[-0.5px_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1130 1">
            <path d="M1130 0.5H0" id="line" stroke="var(--stroke-0, #E4E6E7)" strokeDasharray="3 3" />
          </svg>
        </div>
      </div>
      <p className="css-4hzbpn font-['PingFang_SC:Regular',sans-serif] leading-[18px] not-italic relative shrink-0 text-[12px] text-[rgba(100,108,115,0)] w-[18px]">4</p>
    </div>
  );
}

function Frame42() {
  return (
    <div className="content-stretch flex gap-[8px] h-[32px] items-center pt-[10px] relative shrink-0 w-full">
      <p className="css-4hzbpn font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[18px] not-italic relative shrink-0 text-[#646c73] text-[12px] text-right w-[24px]">0</p>
      <div className="flex-[1_0_0] h-0 min-h-px min-w-px relative" data-name="line">
        <div className="absolute inset-[-0.5px_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1130 1">
            <path d="M1130 0.5H0" id="line" stroke="var(--stroke-0, #C4C9CF)" />
          </svg>
        </div>
      </div>
      <p className="css-4hzbpn font-['PingFang_SC:Regular',sans-serif] leading-[18px] not-italic relative shrink-0 text-[12px] text-[rgba(100,108,115,0)] w-[18px]">0</p>
    </div>
  );
}

function x5() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start justify-between min-h-px min-w-px overflow-clip relative w-full" data-name="左侧X轴">
      <Frame37 />
      <Frame38 />
      <Frame39 />
      <Frame40 />
      <Frame41 />
      <Frame42 />
    </div>
  );
}

function Component21() {
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

function Frame131() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col h-[172px] items-start min-h-px min-w-px relative">
      <x5 />
      <Component21 />
    </div>
  );
}

function Component22() {
  return (
    <div className="content-stretch flex items-start relative shrink-0 w-full z-[2]" data-name="坐标">
      <Frame131 />
    </div>
  );
}

function Frame270() {
  return (
    <div className="absolute h-[120.5px] left-[37px] top-[12px] w-[1096px] z-[1]">
      <div className="absolute inset-[-7.15%_0_0_-0.03%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1096.29 129.111">
          <g id="Frame 1937107229">
            <path d={svgPaths.p17dfbce0} id="Vector 4573" stroke="var(--stroke-0, #33D4D2)" />
            <path d={svgPaths.p14667100} id="Vector 4576" stroke="var(--stroke-0, #33D4D2)" strokeDasharray="4 4" />
            <path d={svgPaths.p9a6e500} id="Vector 4574" stroke="var(--stroke-0, #2481F2)" />
            <path d={svgPaths.p235d4900} id="Vector 4575" stroke="var(--stroke-0, #2481F2)" strokeDasharray="4 4" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Frame43() {
  return (
    <div className="content-stretch flex flex-col gap-[14px] h-[172px] isolate items-start relative shrink-0 w-full">
      <Frame2 />
      <Component22 />
      <Frame270 />
    </div>
  );
}

function Frame132() {
  return (
    <div className="bg-white relative rounded-[8px] shrink-0 w-full">
      <div aria-hidden="true" className="absolute border border-solid border-white inset-0 pointer-events-none rounded-[8px]" />
      <div className="content-stretch flex flex-col gap-[12px] items-start px-[12px] py-[16px] relative w-full">
        <Frame245 />
        <Frame43 />
      </div>
    </div>
  );
}

function Frame276() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0 w-full">
      <Component17 />
      <Frame130 />
      <Frame132 />
    </div>
  );
}

function Component23() {
  return (
    <div className="content-stretch flex gap-[9px] items-center relative rounded-[4px] shrink-0" data-name="小蓝标">
      <div className="bg-[#246fe5] h-[14px] shrink-0 w-[3px]" />
      <p className="css-ew64yg font-['Microsoft_YaHei_UI:Bold',sans-serif] leading-[24px] not-italic relative shrink-0 text-[#2e3742] text-[16px]">服务空间的风机盘管</p>
    </div>
  );
}

function Frame88() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <div className="bg-[#626c78] h-[3px] shrink-0 w-[16px]" data-name="矩形" />
      <p className="css-ew64yg font-['Microsoft_YaHei:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#626c78] text-[14px]">设备开关设定</p>
    </div>
  );
}

function Frame190() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Frame88 />
    </div>
  );
}

function Frame191() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Frame190 />
    </div>
  );
}

function Frame285() {
  return (
    <div className="content-stretch flex items-start justify-between relative shrink-0 w-[16px]">
      <div className="bg-[#626c78] shrink-0 size-[3px]" data-name="矩形" />
      <div className="bg-[#626c78] shrink-0 size-[3px]" data-name="矩形" />
      <div className="bg-[#626c78] shrink-0 size-[3px]" data-name="矩形" />
      <div className="bg-[#626c78] shrink-0 size-[3px]" data-name="矩形" />
    </div>
  );
}

function Frame89() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <Frame285 />
      <p className="css-ew64yg font-['Microsoft_YaHei:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#626c78] text-[14px]">运行状态</p>
    </div>
  );
}

function Frame192() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Frame89 />
    </div>
  );
}

function Frame193() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Frame192 />
    </div>
  );
}

function Frame90() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <div className="bg-[#2481f2] h-[3px] shrink-0 w-[16px]" data-name="矩形" />
      <p className="css-ew64yg font-['Microsoft_YaHei:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#626c78] text-[14px]">新风机组#1</p>
    </div>
  );
}

function Frame194() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Frame90 />
    </div>
  );
}

function Frame195() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Frame194 />
    </div>
  );
}

function Frame91() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <div className="bg-[#33d4d2] h-[3px] shrink-0 w-[16px]" data-name="矩形" />
      <p className="css-ew64yg font-['Microsoft_YaHei:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#626c78] text-[14px]">新风机组2</p>
    </div>
  );
}

function Frame196() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Frame91 />
    </div>
  );
}

function Frame197() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Frame196 />
    </div>
  );
}

function Frame209() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0">
      <Frame191 />
      <Frame193 />
      <Frame195 />
      <Frame197 />
    </div>
  );
}

function Frame111() {
  return (
    <div className="content-stretch flex h-[32px] items-center justify-between overflow-clip relative shrink-0 w-full">
      <p className="css-ew64yg font-['Microsoft_YaHei:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#2e3742] text-[16px]">运行状态</p>
      <Frame209 />
    </div>
  );
}

function Frame44() {
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
      <p className="css-4hzbpn font-['PingFang_SC:Regular',sans-serif] leading-[18px] not-italic relative shrink-0 text-[#646c73] text-[12px] text-right w-[24px]">停止</p>
    </div>
  );
}

function Frame45() {
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
      <p className="css-4hzbpn font-['PingFang_SC:Regular',sans-serif] leading-[18px] not-italic relative shrink-0 text-[#646c73] text-[12px] text-right w-[24px]">运行</p>
    </div>
  );
}

function x6() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start justify-between min-h-px min-w-px overflow-clip relative w-full" data-name="图表X轴">
      <Frame44 />
      <Frame45 />
    </div>
  );
}

function Component24() {
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

function Frame7() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col h-full items-start min-h-px min-w-px relative">
      <x6 />
      <Component24 />
    </div>
  );
}

function Component25() {
  return (
    <div className="content-stretch flex flex-[1_0_0] items-start min-h-px min-w-px relative w-full z-[1]" data-name="图表">
      <Frame7 />
    </div>
  );
}

function Frame46() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col isolate items-start min-h-px min-w-px relative w-full">
      <Component25 />
    </div>
  );
}

function Component26() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-h-px min-w-px relative w-full" data-name="动态图表">
      <Frame46 />
    </div>
  );
}

function Frame112() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] h-[162px] items-start relative shrink-0 w-full">
      <Component26 />
      <div className="absolute h-[116px] left-[48px] top-[19px] w-[1085.5px]">
        <div className="absolute inset-[-0.43%_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1085.5 117">
            <path d={svgPaths.p24b88400} id="Vector 4575" stroke="var(--stroke-0, #246FE5)" />
          </svg>
        </div>
      </div>
      <div className="absolute h-[116px] left-[45.8px] top-[19px] w-[1098.202px]">
        <div className="absolute inset-[-0.43%_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1098.2 117">
            <path d={svgPaths.p5912b40} id="Vector 4577" stroke="var(--stroke-0, #246FE5)" />
          </svg>
        </div>
      </div>
      <div className="absolute h-[116px] left-[43.58px] top-[19px] w-[1100.416px]">
        <div className="absolute inset-[-0.43%_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1100.42 117">
            <path d={svgPaths.p11c82f00} id="Vector 4578" stroke="var(--stroke-0, #246FE5)" strokeDasharray="4 4" />
          </svg>
        </div>
      </div>
      <div className="absolute h-[116px] left-[42.75px] top-[19px] w-[1101.253px]">
        <div className="absolute inset-[-0.43%_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1101.25 117">
            <path d={svgPaths.p1716d098} id="Vector 4576" stroke="var(--stroke-0, #14C4C4)" strokeDasharray="4 4" />
          </svg>
        </div>
      </div>
      <div className="absolute left-[439px] size-[8px] top-[15px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 8">
          <circle cx="4" cy="4" fill="var(--fill-0, white)" id="Ellipse 2" r="3" stroke="var(--stroke-0, #2481F2)" strokeWidth="2" />
        </svg>
      </div>
    </div>
  );
}

function Frame259() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0 w-full">
      <Frame111 />
      <Frame112 />
    </div>
  );
}

function Frame133() {
  return (
    <div className="bg-white h-[235px] relative rounded-[8px] shrink-0 w-full">
      <div aria-hidden="true" className="absolute border border-solid border-white inset-0 pointer-events-none rounded-[8px]" />
      <div className="content-stretch flex flex-col items-start px-[12px] py-[16px] relative size-full">
        <Frame259 />
      </div>
    </div>
  );
}

function Frame246() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <p className="css-ew64yg font-['Microsoft_YaHei_UI:Bold',sans-serif] leading-[0] not-italic relative shrink-0 text-[#2e3742] text-[16px]">
        <span className="leading-[24px]">服务区域温度</span>
        <span className="font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[24px]">(℃)</span>
      </p>
    </div>
  );
}

function Frame92() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <div className="bg-[#626c78] h-[3px] shrink-0 w-[16px]" data-name="矩形" />
      <p className="css-ew64yg font-['Microsoft_YaHei:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#626c78] text-[14px]">服务区域温度设定</p>
    </div>
  );
}

function Frame198() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Frame92 />
    </div>
  );
}

function Frame199() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Frame198 />
    </div>
  );
}

function Frame286() {
  return (
    <div className="content-stretch flex items-start justify-between relative shrink-0 w-[16px]">
      <div className="bg-[#626c78] shrink-0 size-[3px]" data-name="矩形" />
      <div className="bg-[#626c78] shrink-0 size-[3px]" data-name="矩形" />
      <div className="bg-[#626c78] shrink-0 size-[3px]" data-name="矩形" />
      <div className="bg-[#626c78] shrink-0 size-[3px]" data-name="矩形" />
    </div>
  );
}

function Frame93() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <Frame286 />
      <p className="css-ew64yg font-['Microsoft_YaHei:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#626c78] text-[14px]">服务区域温度</p>
    </div>
  );
}

function Frame200() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Frame93 />
    </div>
  );
}

function Frame201() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Frame200 />
    </div>
  );
}

function Frame94() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <div className="bg-[#2481f2] h-[3px] shrink-0 w-[16px]" data-name="矩形" />
      <p className="css-ew64yg font-['Microsoft_YaHei:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#626c78] text-[14px]">新风机组#1</p>
    </div>
  );
}

function Frame202() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Frame94 />
    </div>
  );
}

function Frame203() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Frame202 />
    </div>
  );
}

function Frame95() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <div className="bg-[#33d4d2] h-[3px] shrink-0 w-[16px]" data-name="矩形" />
      <p className="css-ew64yg font-['Microsoft_YaHei:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#626c78] text-[14px]">新风机组#2</p>
    </div>
  );
}

function Frame204() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Frame95 />
    </div>
  );
}

function Frame205() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Frame204 />
    </div>
  );
}

function Frame247() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0">
      <Frame199 />
      <Frame201 />
      <Frame203 />
      <Frame205 />
    </div>
  );
}

function Frame248() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <Frame246 />
      <Frame247 />
    </div>
  );
}

function Frame3() {
  return <div className="absolute h-[143px] left-[48px] top-0 w-[1092px] z-[3]" />;
}

function Frame47() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] items-center min-h-px min-w-px py-[10px] relative w-full">
      <p className="css-4hzbpn font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[18px] not-italic relative shrink-0 text-[#646c73] text-[12px] text-right w-[24px]">50</p>
      <div className="flex-[1_0_0] h-0 min-h-px min-w-px relative" data-name="line">
        <div className="absolute inset-[-0.5px_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1130 1">
            <path d="M1130 0.5H0" id="line" stroke="var(--stroke-0, #E4E6E7)" strokeDasharray="3 3" />
          </svg>
        </div>
      </div>
      <p className="css-4hzbpn font-['PingFang_SC:Regular',sans-serif] leading-[18px] not-italic relative shrink-0 text-[12px] text-[rgba(100,108,115,0)] w-[18px]">20</p>
    </div>
  );
}

function Frame48() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] items-center min-h-px min-w-px py-[10px] relative w-full">
      <p className="css-4hzbpn font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[18px] not-italic relative shrink-0 text-[#646c73] text-[12px] text-right w-[24px]">40</p>
      <div className="flex-[1_0_0] h-0 min-h-px min-w-px relative" data-name="line">
        <div className="absolute inset-[-0.5px_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1130 1">
            <path d="M1130 0.5H0" id="line" stroke="var(--stroke-0, #E4E6E7)" strokeDasharray="3 3" />
          </svg>
        </div>
      </div>
      <p className="css-4hzbpn font-['PingFang_SC:Regular',sans-serif] leading-[18px] not-italic relative shrink-0 text-[12px] text-[rgba(100,108,115,0)] w-[18px]">16</p>
    </div>
  );
}

function Frame49() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] items-center min-h-px min-w-px py-[10px] relative w-full">
      <p className="css-4hzbpn font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[18px] not-italic relative shrink-0 text-[#646c73] text-[12px] text-right w-[24px]">30</p>
      <div className="flex-[1_0_0] h-0 min-h-px min-w-px relative" data-name="line">
        <div className="absolute inset-[-0.5px_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1130 1">
            <path d="M1130 0.5H0" id="line" stroke="var(--stroke-0, #E4E6E7)" strokeDasharray="3 3" />
          </svg>
        </div>
      </div>
      <p className="css-4hzbpn font-['PingFang_SC:Regular',sans-serif] leading-[18px] not-italic relative shrink-0 text-[12px] text-[rgba(100,108,115,0)] w-[18px]">12</p>
    </div>
  );
}

function Frame50() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] items-center min-h-px min-w-px py-[10px] relative w-full">
      <p className="css-4hzbpn font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[18px] not-italic relative shrink-0 text-[#646c73] text-[12px] text-right w-[24px]">20</p>
      <div className="flex-[1_0_0] h-0 min-h-px min-w-px relative" data-name="line">
        <div className="absolute inset-[-0.5px_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1130 1">
            <path d="M1130 0.5H0" id="line" stroke="var(--stroke-0, #E4E6E7)" strokeDasharray="3 3" />
          </svg>
        </div>
      </div>
      <p className="css-4hzbpn font-['PingFang_SC:Regular',sans-serif] leading-[18px] not-italic relative shrink-0 text-[12px] text-[rgba(100,108,115,0)] w-[18px]">8</p>
    </div>
  );
}

function Frame51() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] items-center min-h-px min-w-px py-[10px] relative w-full">
      <p className="css-4hzbpn font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[18px] not-italic relative shrink-0 text-[#646c73] text-[12px] text-right w-[24px]">10</p>
      <div className="flex-[1_0_0] h-0 min-h-px min-w-px relative" data-name="line">
        <div className="absolute inset-[-0.5px_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1130 1">
            <path d="M1130 0.5H0" id="line" stroke="var(--stroke-0, #E4E6E7)" strokeDasharray="3 3" />
          </svg>
        </div>
      </div>
      <p className="css-4hzbpn font-['PingFang_SC:Regular',sans-serif] leading-[18px] not-italic relative shrink-0 text-[12px] text-[rgba(100,108,115,0)] w-[18px]">4</p>
    </div>
  );
}

function Frame52() {
  return (
    <div className="content-stretch flex gap-[8px] h-[32px] items-center pt-[10px] relative shrink-0 w-full">
      <p className="css-4hzbpn font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[18px] not-italic relative shrink-0 text-[#646c73] text-[12px] text-right w-[24px]">0</p>
      <div className="flex-[1_0_0] h-0 min-h-px min-w-px relative" data-name="line">
        <div className="absolute inset-[-0.5px_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1130 1">
            <path d="M1130 0.5H0" id="line" stroke="var(--stroke-0, #C4C9CF)" />
          </svg>
        </div>
      </div>
      <p className="css-4hzbpn font-['PingFang_SC:Regular',sans-serif] leading-[18px] not-italic relative shrink-0 text-[12px] text-[rgba(100,108,115,0)] w-[18px]">0</p>
    </div>
  );
}

function x7() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start justify-between min-h-px min-w-px overflow-clip relative w-full" data-name="左侧X轴">
      <Frame47 />
      <Frame48 />
      <Frame49 />
      <Frame50 />
      <Frame51 />
      <Frame52 />
    </div>
  );
}

function Component27() {
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

function Frame134() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col h-[172px] items-start min-h-px min-w-px relative">
      <x7 />
      <Component27 />
    </div>
  );
}

function Component28() {
  return (
    <div className="content-stretch flex items-start relative shrink-0 w-full z-[2]" data-name="坐标">
      <Frame134 />
    </div>
  );
}

function Frame271() {
  return (
    <div className="absolute h-[120.5px] left-[37px] top-[12px] w-[1096px] z-[1]">
      <div className="absolute inset-[-7.15%_0_0_-0.03%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1096.29 129.111">
          <g id="Frame 1937107229">
            <path d={svgPaths.p17dfbce0} id="Vector 4573" stroke="var(--stroke-0, #33D4D2)" />
            <path d={svgPaths.p14667100} id="Vector 4576" stroke="var(--stroke-0, #33D4D2)" strokeDasharray="4 4" />
            <path d={svgPaths.p9a6e500} id="Vector 4574" stroke="var(--stroke-0, #2481F2)" />
            <path d={svgPaths.p235d4900} id="Vector 4575" stroke="var(--stroke-0, #2481F2)" strokeDasharray="4 4" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Frame53() {
  return (
    <div className="content-stretch flex flex-col gap-[14px] h-[172px] isolate items-start relative shrink-0 w-full">
      <Frame3 />
      <Component28 />
      <Frame271 />
    </div>
  );
}

function Frame135() {
  return (
    <div className="bg-white relative rounded-[8px] shrink-0 w-full">
      <div aria-hidden="true" className="absolute border border-solid border-white inset-0 pointer-events-none rounded-[8px]" />
      <div className="content-stretch flex flex-col gap-[12px] items-start px-[12px] py-[16px] relative w-full">
        <Frame248 />
        <Frame53 />
      </div>
    </div>
  );
}

function Frame277() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0 w-full">
      <Component23 />
      <Frame133 />
      <Frame135 />
    </div>
  );
}

function Component29() {
  return (
    <div className="content-stretch flex gap-[9px] items-center relative rounded-[4px] shrink-0" data-name="小蓝标">
      <div className="bg-[#246fe5] h-[14px] shrink-0 w-[3px]" />
      <p className="css-ew64yg font-['Microsoft_YaHei_UI:Bold',sans-serif] leading-[24px] not-italic relative shrink-0 text-[#2e3742] text-[16px]">设备异常记录</p>
    </div>
  );
}

function Component30() {
  return <div className="bg-[#a6aaac] rounded-[12px] shrink-0 size-[10px]" data-name="步骤点" />;
}

function Frame235() {
  return (
    <div className="content-stretch flex h-[17px] items-center relative shrink-0">
      <Component30 />
    </div>
  );
}

function Frame267() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[0] not-italic relative shrink-0 text-[#626c78] text-[14px] text-right">
        <span className="font-['Microsoft_YaHei_UI:Bold',sans-serif] leading-[normal]">{`1#冷机 `}</span>
        <span className="leading-[normal]">发生 冷冻侧水阀开关状态反馈与指令不符报警</span>
      </p>
    </div>
  );
}

function Frame249() {
  return (
    <div className="content-stretch flex gap-[12px] items-center relative shrink-0">
      <p className="css-4hzbpn font-['Persagy2.0:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#626c78] text-[14px] w-[62px]">00:15:00</p>
      <Frame235 />
      <Frame267 />
    </div>
  );
}

function Frame232() {
  return (
    <div className="h-[21px] relative shrink-0 w-full">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center px-[79px] relative size-full">
          <div className="h-[30px] relative shrink-0 w-0" data-name="线">
            <div className="absolute inset-[0_-0.5px]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1 30">
                <path d="M0.5 0V30" id="çº¿" stroke="var(--stroke-0, #8B949E)" strokeDasharray="3 3" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Component31() {
  return <div className="bg-[#a6aaac] rounded-[12px] shrink-0 size-[10px]" data-name="步骤点" />;
}

function Frame250() {
  return (
    <div className="content-stretch flex h-[17px] items-center relative shrink-0">
      <Component31 />
    </div>
  );
}

function Frame230() {
  return (
    <div className="content-stretch flex gap-[12px] items-center relative shrink-0">
      <p className="css-4hzbpn font-['Persagy2.0:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#626c78] text-[14px] w-[62px]">00:30:00</p>
      <Frame250 />
      <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[0] not-italic relative shrink-0 text-[#626c78] text-[14px] text-right">
        <span className="font-['Microsoft_YaHei_UI:Bold',sans-serif] leading-[normal]">1#冷冻水泵</span>
        <span className="leading-[normal]">{` 发生 变频器状态反馈与指令不符报警`}</span>
      </p>
    </div>
  );
}

function Component32() {
  return <div className="bg-[#a6aaac] rounded-[12px] shrink-0 size-[10px]" data-name="步骤点" />;
}

function Frame251() {
  return (
    <div className="content-stretch flex h-[17px] items-center relative shrink-0">
      <Component32 />
    </div>
  );
}

function Frame234() {
  return (
    <div className="content-center flex flex-[1_0_0] flex-wrap gap-[10px] items-center justify-center min-h-px min-w-px relative">
      <p className="css-4hzbpn flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[0] min-h-px min-w-px not-italic relative text-[#626c78] text-[14px]">
        <span className="font-['Microsoft_YaHei_UI:Bold',sans-serif] leading-[normal]">3#冷却水泵</span>
        <span className="leading-[normal]">{` 发生 变频器状态反馈与指令不符报警`}</span>
      </p>
    </div>
  );
}

function Frame233() {
  return (
    <div className="content-start flex flex-wrap gap-[12px] items-start relative shrink-0 w-full">
      <p className="css-4hzbpn font-['Persagy2.0:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#626c78] text-[14px] w-[62px]">00:45:00</p>
      <Frame251 />
      <Frame234 />
    </div>
  );
}

function Frame252() {
  return (
    <div className="h-[21px] relative shrink-0 w-full">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center px-[79px] relative size-full">
          <div className="h-[85px] relative shrink-0 w-0" data-name="线">
            <div className="absolute inset-[0_-0.5px]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1 85">
                <path d="M0.5 0V85" id="çº¿" stroke="var(--stroke-0, #8B949E)" strokeDasharray="3 3" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Component33() {
  return <div className="bg-[#a6aaac] rounded-[12px] shrink-0 size-[10px]" data-name="步骤点" />;
}

function Frame253() {
  return (
    <div className="content-stretch flex h-[17px] items-center relative shrink-0">
      <Component33 />
    </div>
  );
}

function Frame254() {
  return (
    <div className="content-center flex flex-[1_0_0] flex-wrap gap-[10px] items-center justify-center min-h-px min-w-px relative">
      <p className="css-4hzbpn flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[0] min-h-px min-w-px not-italic relative text-[#626c78] text-[14px]">
        <span className="font-['Microsoft_YaHei_UI:Bold',sans-serif] leading-[normal]">5#冷却塔风机</span>
        <span className="leading-[normal]">{` 发生 控制失能报警`}</span>
      </p>
    </div>
  );
}

function Frame255() {
  return (
    <div className="content-start flex flex-wrap gap-[12px] items-start relative shrink-0 w-full">
      <p className="css-4hzbpn font-['Persagy2.0:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#626c78] text-[14px] w-[62px]">01:00:00</p>
      <Frame253 />
      <Frame254 />
    </div>
  );
}

function Component34() {
  return <div className="bg-[#a6aaac] rounded-[12px] shrink-0 size-[10px]" data-name="步骤点" />;
}

function Frame256() {
  return (
    <div className="content-stretch flex h-[17px] items-center relative shrink-0">
      <Component34 />
    </div>
  );
}

function Frame236() {
  return (
    <div className="content-stretch flex gap-[12px] items-center relative shrink-0">
      <p className="css-4hzbpn font-['Persagy2.0:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#626c78] text-[14px] w-[62px]">01:15:00</p>
      <Frame256 />
      <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[0] not-italic relative shrink-0 text-[#626c78] text-[14px] text-right">
        <span className="font-['Microsoft_YaHei_UI:Bold',sans-serif] leading-[normal]">2#电动通断水阀</span>
        <span className="leading-[normal]">{` 发生 控制失能报警`}</span>
      </p>
    </div>
  );
}

function Frame231() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
      <Frame249 />
      <Frame232 />
      <Frame230 />
      <Frame232 />
      <Frame233 />
      <Frame252 />
      <Frame255 />
      <Frame232 />
      <Frame236 />
    </div>
  );
}

function Frame136() {
  return (
    <div className="bg-white relative rounded-[8px] shrink-0 w-full">
      <div aria-hidden="true" className="absolute border border-solid border-white inset-0 pointer-events-none rounded-[8px]" />
      <div className="content-stretch flex flex-col items-start px-[12px] py-[16px] relative w-full">
        <Frame231 />
      </div>
    </div>
  );
}

function Frame275() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0 w-full">
      <Component29 />
      <Frame136 />
    </div>
  );
}

function Padding() {
  return (
    <div className="bg-[#f1f4f6] relative shrink-0 w-full" data-name="padding">
      <div className="content-stretch flex flex-col gap-[24px] items-start px-[24px] py-[16px] relative w-full">
        <Frame273 />
        <Frame274 />
        <Frame276 />
        <Frame277 />
        <Frame275 />
      </div>
    </div>
  );
}

function Popup() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col items-start left-0 overflow-clip rounded-[8px] shadow-[0px_20px_30px_0px_rgba(27,33,41,0.15)] top-[-1304px] w-[1260px]" data-name="弹窗&Popup">
      <Title />
      <Padding />
    </div>
  );
}

export default function Frame287() {
  return (
    <div className="relative size-full">
      <Popup />
    </div>
  );
}