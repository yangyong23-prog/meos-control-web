import svgPaths from "./svg-6tcouf0sb6";

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

function Frame27() {
  return (
    <div className="absolute content-stretch flex gap-[4px] items-center left-[-7px] top-0">
      <Select />
      <div className="bg-[#d9d9d9] h-[13px] shrink-0 w-px" />
      <Select1 />
    </div>
  );
}

function Frame46() {
  return (
    <div className="h-[32px] relative shrink-0 w-[290px]">
      <Frame27 />
    </div>
  );
}

function Frame8() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <div className="bg-[#d069d2] h-[3px] shrink-0 w-[16px]" data-name="矩形" />
      <p className="css-ew64yg font-['Microsoft_YaHei:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#626c78] text-[14px]">目标温度</p>
    </div>
  );
}

function Frame25() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Frame8 />
    </div>
  );
}

function Frame13() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <div className="bg-[#2481f2] h-[3px] shrink-0 w-[16px]" data-name="矩形" />
      <p className="css-ew64yg font-['Microsoft_YaHei:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#626c78] text-[14px]">实际温度</p>
    </div>
  );
}

function Frame22() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Frame13 />
    </div>
  );
}

function Frame14() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <div className="bg-[#33d4d2] h-[3px] shrink-0 w-[16px]" data-name="矩形" />
      <p className="css-ew64yg font-['Microsoft_YaHei:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#626c78] text-[14px]">AI预测温度</p>
    </div>
  );
}

function Frame23() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Frame14 />
    </div>
  );
}

function Frame15() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <div className="bg-[#d2e3f8] shrink-0 size-[14px]" />
      <p className="css-ew64yg font-['Microsoft_YaHei:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#626c78] text-[14px]">营业时间范围</p>
    </div>
  );
}

function Frame24() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Frame15 />
    </div>
  );
}

function Frame17() {
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

function Frame9() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <Frame17 />
      <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[22px] not-italic relative shrink-0 text-[#626c78] text-[14px]">过冷门限</p>
    </div>
  );
}

function Frame18() {
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

function Frame11() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <Frame18 />
      <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[22px] not-italic relative shrink-0 text-[#626c78] text-[14px]">舒适区下限</p>
    </div>
  );
}

function Frame19() {
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

function Frame10() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <Frame19 />
      <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[22px] not-italic relative shrink-0 text-[#626c78] text-[14px]">舒适区上限</p>
    </div>
  );
}

function Frame20() {
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

function Frame12() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <Frame20 />
      <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[22px] not-italic relative shrink-0 text-[#626c78] text-[14px]">过热门限</p>
    </div>
  );
}

function Frame16() {
  return (
    <div className="content-center flex flex-wrap gap-[12px] items-center relative shrink-0">
      <Frame25 />
      <Frame22 />
      <Frame23 />
      <Frame24 />
      <Frame9 />
      <Frame11 />
      <Frame10 />
      <Frame12 />
    </div>
  );
}

function Frame26() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <Frame46 />
      <Frame16 />
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

function Frame3() {
  return (
    <div className="content-stretch flex flex-[1_0_0] items-center min-h-px min-w-px py-[10px] relative w-full">
      <p className="css-4hzbpn font-['PingFang_SC:Regular',sans-serif] leading-[18px] not-italic relative shrink-0 text-[#646c73] text-[12px] w-[18px]">℃</p>
    </div>
  );
}

function Frame6() {
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

function Frame4() {
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

function Frame5() {
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

function Frame() {
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

function Frame1() {
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

function Frame2() {
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
      <Frame3 />
      <Frame6 />
      <Frame4 />
      <Frame5 />
      <Frame />
      <Frame1 />
      <Frame2 />
    </div>
  );
}

function Frame28() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0">
      <p className="css-ew64yg font-['Noto_Sans_SC:Regular',sans-serif] font-normal leading-[14px] relative shrink-0 text-[#8d9399] text-[12px] text-center" style={{ fontFeatureSettings: "'pwid'" }}>
        07:00
      </p>
    </div>
  );
}

function Frame29() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0">
      <p className="css-ew64yg font-['Noto_Sans_SC:Regular',sans-serif] font-normal leading-[14px] relative shrink-0 text-[#8d9399] text-[12px] text-center" style={{ fontFeatureSettings: "'pwid'" }}>
        08:00
      </p>
    </div>
  );
}

function Frame30() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0">
      <p className="css-ew64yg font-['Noto_Sans_SC:Regular',sans-serif] font-normal leading-[14px] relative shrink-0 text-[#8d9399] text-[12px] text-center" style={{ fontFeatureSettings: "'pwid'" }}>
        09:00
      </p>
    </div>
  );
}

function Frame31() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0">
      <p className="css-ew64yg font-['Noto_Sans_SC:Regular',sans-serif] font-normal leading-[14px] relative shrink-0 text-[#8d9399] text-[12px] text-center" style={{ fontFeatureSettings: "'pwid'" }}>
        10:00
      </p>
    </div>
  );
}

function Frame32() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0">
      <p className="css-ew64yg font-['Noto_Sans_SC:Regular',sans-serif] font-normal leading-[14px] relative shrink-0 text-[#8d9399] text-[12px] text-center" style={{ fontFeatureSettings: "'pwid'" }}>
        11:00
      </p>
    </div>
  );
}

function Frame41() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0">
      <p className="css-ew64yg font-['Noto_Sans_SC:Regular',sans-serif] font-normal leading-[14px] relative shrink-0 text-[#8d9399] text-[12px] text-center" style={{ fontFeatureSettings: "'pwid'" }}>
        12:00
      </p>
    </div>
  );
}

function Frame34() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0">
      <p className="css-ew64yg font-['Noto_Sans_SC:Regular',sans-serif] font-normal leading-[14px] relative shrink-0 text-[#8d9399] text-[12px] text-center" style={{ fontFeatureSettings: "'pwid'" }}>
        13:00
      </p>
    </div>
  );
}

function Frame35() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0">
      <p className="css-ew64yg font-['Noto_Sans_SC:Regular',sans-serif] font-normal leading-[14px] relative shrink-0 text-[#8d9399] text-[12px] text-center" style={{ fontFeatureSettings: "'pwid'" }}>
        14:00
      </p>
    </div>
  );
}

function Frame36() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0">
      <p className="css-ew64yg font-['Noto_Sans_SC:Regular',sans-serif] font-normal leading-[14px] relative shrink-0 text-[#8d9399] text-[12px] text-center" style={{ fontFeatureSettings: "'pwid'" }}>
        15:00
      </p>
    </div>
  );
}

function Frame37() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0">
      <p className="css-ew64yg font-['Noto_Sans_SC:Regular',sans-serif] font-normal leading-[14px] relative shrink-0 text-[#8d9399] text-[12px] text-center" style={{ fontFeatureSettings: "'pwid'" }}>
        16:00
      </p>
    </div>
  );
}

function Frame38() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0">
      <p className="css-ew64yg font-['Noto_Sans_SC:Regular',sans-serif] font-normal leading-[14px] relative shrink-0 text-[#8d9399] text-[12px] text-center" style={{ fontFeatureSettings: "'pwid'" }}>
        17:00
      </p>
    </div>
  );
}

function Frame39() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0">
      <p className="css-ew64yg font-['Noto_Sans_SC:Regular',sans-serif] font-normal leading-[14px] relative shrink-0 text-[#8d9399] text-[12px] text-center" style={{ fontFeatureSettings: "'pwid'" }}>
        18:00
      </p>
    </div>
  );
}

function Frame40() {
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
        <Frame28 />
        <Frame29 />
        <Frame30 />
        <Frame31 />
        <Frame32 />
        <Frame41 />
        <Frame34 />
        <Frame35 />
        <Frame36 />
        <Frame37 />
        <Frame38 />
        <Frame39 />
        <Frame40 />
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

function Frame21() {
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
      <Frame21 />
    </div>
  );
}

function Frame7() {
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

function Frame33() {
  return (
    <div className="bg-[#e6fcf7] content-stretch flex items-center justify-center relative shrink-0">
      <p className="css-4hzbpn font-['Noto_Sans_SC:Regular',sans-serif] font-normal leading-[14px] relative shrink-0 text-[#14c4c4] text-[12px] text-center w-[30px]" style={{ fontFeatureSettings: "'pwid'" }}>
        达标
      </p>
    </div>
  );
}

function Frame47() {
  return (
    <div className="content-stretch flex gap-px items-center relative shrink-0 w-[139px]">
      <div className="flex-[1_0_0] h-0 min-h-px min-w-px relative">
        <div className="absolute inset-[-2.31px_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 53.5 4.6188">
            <path d={svgPaths.p2999f880} fill="var(--stroke-0, #14C4C4)" id="Vector 4568" />
          </svg>
        </div>
      </div>
      <Frame33 />
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

function Frame42() {
  return (
    <div className="bg-[#fff5f5] content-stretch flex items-center justify-center relative shrink-0">
      <p className="css-4hzbpn font-['Noto_Sans_SC:Regular',sans-serif] font-normal leading-[14px] relative shrink-0 text-[#f55047] text-[12px] text-center w-[30px]" style={{ fontFeatureSettings: "'pwid'" }}>
        过热
      </p>
    </div>
  );
}

function Frame48() {
  return (
    <div className="content-stretch flex gap-px items-center relative shrink-0 w-[139px]">
      <div className="flex-[1_0_0] h-0 min-h-px min-w-px relative">
        <div className="absolute inset-[-2.31px_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 53.5 4.6188">
            <path d={svgPaths.p2999f880} fill="var(--stroke-0, #F55047)" id="Vector 4568" />
          </svg>
        </div>
      </div>
      <Frame42 />
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

function Frame43() {
  return (
    <div className="bg-[#d9ebff] content-stretch flex items-center justify-center relative shrink-0">
      <p className="css-4hzbpn font-['Noto_Sans_SC:Regular',sans-serif] font-normal leading-[14px] relative shrink-0 text-[#246fe5] text-[12px] text-center w-[30px]" style={{ fontFeatureSettings: "'pwid'" }}>
        过冷
      </p>
    </div>
  );
}

function Frame50() {
  return (
    <div className="content-stretch flex gap-px items-center relative shrink-0 w-[139px]">
      <div className="flex-[1_0_0] h-0 min-h-px min-w-px relative">
        <div className="absolute inset-[-2.31px_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 53.5 4.6188">
            <path d={svgPaths.p2999f880} fill="var(--stroke-0, #246FE5)" id="Vector 4568" />
          </svg>
        </div>
      </div>
      <Frame43 />
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

function Frame44() {
  return (
    <div className="bg-[#fffbe6] content-stretch flex items-center justify-center relative shrink-0">
      <p className="css-ew64yg font-['Noto_Sans_SC:Regular',sans-serif] font-normal leading-[14px] relative shrink-0 text-[#f29f00] text-[12px] text-center" style={{ fontFeatureSettings: "'pwid'" }}>
        持续偏热
      </p>
    </div>
  );
}

function Frame49() {
  return (
    <div className="content-stretch flex gap-px items-center relative shrink-0 w-[139px]">
      <div className="flex-[1_0_0] h-0 min-h-px min-w-px relative">
        <div className="absolute inset-[-2.31px_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 44.5 4.6188">
            <path d={svgPaths.p11629080} fill="var(--stroke-0, #F29F00)" id="Vector 4568" />
          </svg>
        </div>
      </div>
      <Frame44 />
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

function Frame52() {
  return (
    <div className="absolute content-stretch flex items-start left-[372px] top-[272px]">
      <Frame47 />
      <Frame48 />
      <Frame50 />
      <Frame49 />
    </div>
  );
}

function Frame51() {
  return (
    <div className="bg-white h-[305px] relative rounded-[8px] shrink-0 w-full">
      <div className="content-stretch flex flex-col gap-[8px] items-start px-[12px] py-[16px] relative size-full">
        <Frame26 />
        <Component4 />
        <Frame7 />
        <div className="absolute flex h-[147px] items-center justify-center left-[372px] top-[97px] w-[551px]">
          <div className="flex-none rotate-180">
            <div className="bg-gradient-to-t from-[rgba(57,146,255,0)] h-[147px] opacity-20 to-[#3992ff] w-[551px]" />
          </div>
        </div>
        <Frame52 />
      </div>
    </div>
  );
}

function Frame45() {
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

export default function Frame53() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-start relative size-full">
      <Component />
      <Frame51 />
      <Frame45 />
      <Component8 />
    </div>
  );
}