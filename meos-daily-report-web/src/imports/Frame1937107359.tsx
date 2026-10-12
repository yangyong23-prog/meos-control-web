import svgPaths from "./svg-ajf558li5l";
import imgFrame1937107242 from "@/assets/ed07366a06320f72100f9b26c58eca5ec52423c3.png";
import imgGestureCopy22 from "@/assets/3f08508c51c8fcfd2fcbf93d340e307172f4cf1b.png";

function Frame1() {
  return (
    <div className="content-stretch flex flex-col isolate items-start pb-[12px] relative shrink-0">
      <p className="css-ew64yg font-['Microsoft_YaHei_UI:Bold',sans-serif] leading-[28px] not-italic relative shrink-0 text-[#2e3742] text-[20px] z-[2]">空调控制分区</p>
      <div className="bg-[rgba(0,148,255,0.2)] h-[12px] mb-[-12px] shrink-0 w-full z-[1]" />
    </div>
  );
}

function Frame137() {
  return (
    <div className="relative rounded-[4px] shrink-0 w-full">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[4px] size-full" src={imgFrame1937107242} />
      <div className="content-stretch flex flex-col items-start px-[12px] py-[8px] relative w-full">
        <p className="css-ew64yg font-['Microsoft_YaHei_UI:Bold',sans-serif] leading-[22px] not-italic relative shrink-0 text-[#2e3742] text-[16px]">北区空调控制分区</p>
      </div>
    </div>
  );
}

function Frame128() {
  return (
    <div className="content-stretch flex flex-[1_0_0] h-full items-center min-h-px min-w-px relative">
      <div className="h-full relative shrink-0 w-0">
        <div className="absolute inset-[0_-0.5px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1 39">
            <path d="M0.5 0V39" id="Vector 4569" stroke="var(--stroke-0, #E1E5EB)" strokeDasharray="4 4" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Component() {
  return (
    <div className="absolute content-stretch flex h-[39px] items-center justify-between left-[187px] top-[97px] w-[969px]" data-name="虚线">
      {[...Array(14).keys()].map((_, i) => (
        <Frame128 key={i} />
      ))}
    </div>
  );
}

function Button() {
  return (
    <div className="content-stretch flex gap-[12px] items-center justify-center px-[8px] py-[5px] relative rounded-[4px] shrink-0" data-name="按钮&Button">
      <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[22px] not-italic relative shrink-0 text-[#246fe5] text-[14px] text-center">查看时间表</p>
    </div>
  );
}

function Button1() {
  return (
    <div className="content-stretch flex gap-[12px] items-center justify-center px-[8px] py-[5px] relative rounded-[4px] shrink-0" data-name="按钮&Button">
      <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[22px] not-italic relative shrink-0 text-[#246fe5] text-[14px] text-center">查看人工干预记录</p>
    </div>
  );
}

function Frame135() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <Button />
      <div className="bg-[#e1e5eb] h-[14px] shrink-0 w-px" />
      <Button1 />
    </div>
  );
}

function Frame130() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <p className="css-ew64yg font-['Microsoft_YaHei_UI:Bold',sans-serif] leading-[24px] not-italic relative shrink-0 text-[#2e3742] text-[16px]">调节记录</p>
      <Frame135 />
    </div>
  );
}

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
    <div className="content-stretch flex gap-[8px] items-center opacity-0 relative shrink-0" data-name="多选框&Checkbox">
      <Box />
      <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[22px] not-italic relative shrink-0 text-[#1b2129] text-[14px]">显示AI策略</p>
    </div>
  );
}

function Frame82() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <Frame130 />
      <Checkbox />
    </div>
  );
}

function Frame108() {
  return (
    <div className="content-stretch flex h-full items-center py-[8px] relative shrink-0 w-[175px]">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-[0_0_-0.5px_0] pointer-events-none" />
      <p className="css-ew64yg font-['Noto_Sans_SC:Regular',sans-serif] font-normal leading-[14px] relative shrink-0 text-[#8d9399] text-[12px]" style={{ fontFeatureSettings: "'pwid'" }}>
        调节参数名称
      </p>
    </div>
  );
}

function Frame103() {
  return (
    <div className="content-stretch flex flex-[1_0_0] h-full items-center min-h-px min-w-px py-[8px] relative">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-[0_0_-0.5px_0] pointer-events-none" />
      <p className="css-ew64yg font-['Noto_Sans_SC:Regular',sans-serif] font-normal leading-[14px] relative shrink-0 text-[#8d9399] text-[12px]" style={{ fontFeatureSettings: "'pwid'" }}>
        08:00
      </p>
    </div>
  );
}

function Frame104() {
  return (
    <div className="content-stretch flex flex-[1_0_0] h-full items-center min-h-px min-w-px py-[8px] relative">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-[0_0_-0.5px_0] pointer-events-none" />
      <p className="css-ew64yg font-['Noto_Sans_SC:Regular',sans-serif] font-normal leading-[14px] relative shrink-0 text-[#8d9399] text-[12px]" style={{ fontFeatureSettings: "'pwid'" }}>
        09:00
      </p>
    </div>
  );
}

function Frame105() {
  return (
    <div className="content-stretch flex flex-[1_0_0] h-full items-center min-h-px min-w-px py-[8px] relative">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-[0_0_-0.5px_0] pointer-events-none" />
      <p className="css-ew64yg font-['Noto_Sans_SC:Regular',sans-serif] font-normal leading-[14px] relative shrink-0 text-[#8d9399] text-[12px]" style={{ fontFeatureSettings: "'pwid'" }}>
        10:00
      </p>
    </div>
  );
}

function Frame106() {
  return (
    <div className="content-stretch flex flex-[1_0_0] h-full items-center min-h-px min-w-px py-[8px] relative">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-[0_0_-0.5px_0] pointer-events-none" />
      <p className="css-ew64yg font-['Noto_Sans_SC:Regular',sans-serif] font-normal leading-[14px] relative shrink-0 text-[#8d9399] text-[12px]" style={{ fontFeatureSettings: "'pwid'" }}>
        11:00
      </p>
    </div>
  );
}

function Frame107() {
  return (
    <div className="content-stretch flex flex-[1_0_0] h-full items-center min-h-px min-w-px py-[8px] relative">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-[0_0_-0.5px_0] pointer-events-none" />
      <p className="css-ew64yg font-['Noto_Sans_SC:Regular',sans-serif] font-normal leading-[14px] relative shrink-0 text-[#8d9399] text-[12px]" style={{ fontFeatureSettings: "'pwid'" }}>
        12:00
      </p>
    </div>
  );
}

function Frame109() {
  return (
    <div className="content-stretch flex flex-[1_0_0] h-full items-center min-h-px min-w-px py-[8px] relative">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-[0_0_-0.5px_0] pointer-events-none" />
      <p className="css-ew64yg font-['Noto_Sans_SC:Regular',sans-serif] font-normal leading-[14px] relative shrink-0 text-[#8d9399] text-[12px]" style={{ fontFeatureSettings: "'pwid'" }}>
        13:00
      </p>
    </div>
  );
}

function Frame110() {
  return (
    <div className="content-stretch flex flex-[1_0_0] h-full items-center min-h-px min-w-px py-[8px] relative">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-[0_0_-0.5px_0] pointer-events-none" />
      <p className="css-ew64yg font-['Noto_Sans_SC:Regular',sans-serif] font-normal leading-[14px] relative shrink-0 text-[#8d9399] text-[12px]" style={{ fontFeatureSettings: "'pwid'" }}>
        14:00
      </p>
    </div>
  );
}

function Frame111() {
  return (
    <div className="content-stretch flex flex-[1_0_0] h-full items-center min-h-px min-w-px py-[8px] relative">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-[0_0_-0.5px_0] pointer-events-none" />
      <p className="css-ew64yg font-['Noto_Sans_SC:Regular',sans-serif] font-normal leading-[14px] relative shrink-0 text-[#8d9399] text-[12px]" style={{ fontFeatureSettings: "'pwid'" }}>
        15:00
      </p>
    </div>
  );
}

function Frame112() {
  return (
    <div className="content-stretch flex flex-[1_0_0] h-full items-center min-h-px min-w-px py-[8px] relative">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-[0_0_-0.5px_0] pointer-events-none" />
      <p className="css-ew64yg font-['Noto_Sans_SC:Regular',sans-serif] font-normal leading-[14px] relative shrink-0 text-[#8d9399] text-[12px]" style={{ fontFeatureSettings: "'pwid'" }}>
        16:00
      </p>
    </div>
  );
}

function Frame113() {
  return (
    <div className="content-stretch flex flex-[1_0_0] h-full items-center min-h-px min-w-px py-[8px] relative">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-[0_0_-0.5px_0] pointer-events-none" />
      <p className="css-ew64yg font-['Noto_Sans_SC:Regular',sans-serif] font-normal leading-[14px] relative shrink-0 text-[#8d9399] text-[12px]" style={{ fontFeatureSettings: "'pwid'" }}>
        17:00
      </p>
    </div>
  );
}

function Frame114() {
  return (
    <div className="content-stretch flex flex-[1_0_0] h-full items-center min-h-px min-w-px py-[8px] relative">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-[0_0_-0.5px_0] pointer-events-none" />
      <p className="css-ew64yg font-['Noto_Sans_SC:Regular',sans-serif] font-normal leading-[14px] relative shrink-0 text-[#8d9399] text-[12px]" style={{ fontFeatureSettings: "'pwid'" }}>
        18:00
      </p>
    </div>
  );
}

function Frame115() {
  return (
    <div className="content-stretch flex flex-[1_0_0] h-full items-center min-h-px min-w-px py-[8px] relative">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-[0_0_-0.5px_0] pointer-events-none" />
      <p className="css-ew64yg font-['Noto_Sans_SC:Regular',sans-serif] font-normal leading-[14px] relative shrink-0 text-[#8d9399] text-[12px]" style={{ fontFeatureSettings: "'pwid'" }}>
        19:00
      </p>
    </div>
  );
}

function Frame116() {
  return (
    <div className="content-stretch flex flex-[1_0_0] h-full items-center min-h-px min-w-px py-[8px] relative">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-[0_0_-0.5px_0] pointer-events-none" />
      <p className="css-ew64yg font-['Noto_Sans_SC:Regular',sans-serif] font-normal leading-[14px] relative shrink-0 text-[#8d9399] text-[12px]" style={{ fontFeatureSettings: "'pwid'" }}>
        20:00
      </p>
    </div>
  );
}

function Frame117() {
  return (
    <div className="content-stretch flex flex-[1_0_0] h-full items-center min-h-px min-w-px py-[8px] relative">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-[0_0_-0.5px_0] pointer-events-none" />
      <p className="css-ew64yg font-['Noto_Sans_SC:Regular',sans-serif] font-normal leading-[14px] relative shrink-0 text-[#8d9399] text-[12px]" style={{ fontFeatureSettings: "'pwid'" }}>
        21:00
      </p>
    </div>
  );
}

function Frame118() {
  return (
    <div className="content-stretch flex h-full items-center py-[8px] relative shrink-0 w-[32px]">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-[0_0_-0.5px_0] pointer-events-none" />
      <p className="css-ew64yg font-['Noto_Sans_SC:Regular',sans-serif] font-normal leading-[14px] relative shrink-0 text-[#8d9399] text-[12px]" style={{ fontFeatureSettings: "'pwid'" }}>
        22:00
      </p>
    </div>
  );
}

function Component1() {
  return (
    <div className="content-stretch flex items-center py-[4px] relative shrink-0 w-full" data-name="横坐标">
      <div className="flex flex-row items-center self-stretch">
        <Frame108 />
      </div>
      <div className="flex flex-[1_0_0] flex-row items-center self-stretch">
        <Frame103 />
      </div>
      <div className="flex flex-[1_0_0] flex-row items-center self-stretch">
        <Frame104 />
      </div>
      <div className="flex flex-[1_0_0] flex-row items-center self-stretch">
        <Frame105 />
      </div>
      <div className="flex flex-[1_0_0] flex-row items-center self-stretch">
        <Frame106 />
      </div>
      <div className="flex flex-[1_0_0] flex-row items-center self-stretch">
        <Frame107 />
      </div>
      <div className="flex flex-[1_0_0] flex-row items-center self-stretch">
        <Frame109 />
      </div>
      <div className="flex flex-[1_0_0] flex-row items-center self-stretch">
        <Frame110 />
      </div>
      <div className="flex flex-[1_0_0] flex-row items-center self-stretch">
        <Frame111 />
      </div>
      <div className="flex flex-[1_0_0] flex-row items-center self-stretch">
        <Frame112 />
      </div>
      <div className="flex flex-[1_0_0] flex-row items-center self-stretch">
        <Frame113 />
      </div>
      <div className="flex flex-[1_0_0] flex-row items-center self-stretch">
        <Frame114 />
      </div>
      <div className="flex flex-[1_0_0] flex-row items-center self-stretch">
        <Frame115 />
      </div>
      <div className="flex flex-[1_0_0] flex-row items-center self-stretch">
        <Frame116 />
      </div>
      <div className="flex flex-[1_0_0] flex-row items-center self-stretch">
        <Frame117 />
      </div>
      <div className="flex flex-row items-center self-stretch">
        <Frame118 />
      </div>
    </div>
  );
}

function Frame119() {
  return (
    <div className="bg-[#e6fcf7] content-stretch flex h-full items-center p-[8px] relative shrink-0 w-[113px]">
      <div aria-hidden="true" className="absolute border-[#14c4c4] border-l-2 border-solid inset-[0_0_0_-1px] pointer-events-none" />
      <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[14px] not-italic relative shrink-0 text-[#1b2129] text-[14px]" style={{ fontFeatureSettings: "'pwid'" }}>
        分区开关
      </p>
    </div>
  );
}

function Frame120() {
  return (
    <div className="bg-[#e6fcf7] flex-[1_0_0] min-h-px min-w-px relative rounded-[4px] w-full">
      <div aria-hidden="true" className="absolute border-[#a6ede8] border-[0.5px] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <div className="flex flex-row justify-center size-full">
        <div className="content-stretch flex items-start justify-center p-[8px] relative size-full">
          <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[14px] not-italic relative shrink-0 text-[#1b2129] text-[14px]" style={{ fontFeatureSettings: "'pwid'" }}>
            设定值
          </p>
        </div>
      </div>
    </div>
  );
}

function Frame131() {
  return (
    <div className="content-stretch flex flex-col h-full items-start justify-center relative shrink-0">
      <Frame120 />
    </div>
  );
}

function Frame132() {
  return (
    <div className="content-stretch flex gap-[4px] h-full items-center relative shrink-0">
      <Frame119 />
      <Frame131 />
    </div>
  );
}

function Frame89() {
  return (
    <div className="bg-[#e6fcf7] flex-[1_0_0] min-h-px min-w-px relative rounded-[4px]">
      <div aria-hidden="true" className="absolute border-[#a6ede8] border-[0.5px] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col gap-[8px] items-start justify-center p-[8px] relative w-full">
          <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[14px] not-italic relative shrink-0 text-[#00a2a7] text-[14px] text-center">开启</p>
        </div>
      </div>
    </div>
  );
}

function Frame92() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-full">
      <Frame89 />
    </div>
  );
}

function Frame94() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-h-px min-w-px relative">
      <Frame92 />
    </div>
  );
}

function Component2() {
  return (
    <div className="content-stretch flex gap-[8px] items-center py-[4px] relative shrink-0 w-full" data-name="横坐标">
      <div className="flex flex-row items-center self-stretch">
        <Frame132 />
      </div>
      <Frame94 />
    </div>
  );
}

function Frame91() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full">
      <Component1 />
      <Component2 />
    </div>
  );
}

function Frame33() {
  return (
    <div className="bg-white relative rounded-[8px] shrink-0 w-full">
      <div aria-hidden="true" className="absolute border border-solid border-white inset-0 pointer-events-none rounded-[8px]" />
      <div className="content-stretch flex flex-col gap-[12px] items-start px-[12px] py-[16px] relative w-full">
        <Component />
        <Frame82 />
        <Frame91 />
      </div>
    </div>
  );
}

function Frame14() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <div className="bg-[#2481f2] h-[3px] shrink-0 w-[16px]" data-name="矩形" />
      <p className="css-ew64yg font-['Microsoft_YaHei:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#626c78] text-[14px]">水阀#1</p>
    </div>
  );
}

function Frame37() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Frame14 />
    </div>
  );
}

function Frame38() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Frame37 />
    </div>
  );
}

function Frame65() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Frame38 />
    </div>
  );
}

function Frame30() {
  return (
    <div className="content-stretch flex h-[32px] items-center justify-between overflow-clip relative shrink-0 w-full">
      <p className="css-ew64yg font-['Microsoft_YaHei:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#2e3742] text-[16px]">开闭状态</p>
      <Frame65 />
    </div>
  );
}

function Frame4() {
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

function Frame7() {
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
      <Frame4 />
      <Frame7 />
    </div>
  );
}

function Component3() {
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

function Frame3() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col h-full items-start min-h-px min-w-px relative">
      <x />
      <Component3 />
    </div>
  );
}

function Component4() {
  return (
    <div className="content-stretch flex flex-[1_0_0] items-start min-h-px min-w-px relative w-full z-[1]" data-name="图表">
      <Frame3 />
    </div>
  );
}

function Frame10() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col isolate items-start min-h-px min-w-px relative w-full">
      <Component4 />
    </div>
  );
}

function Component5() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-h-px min-w-px relative w-full" data-name="动态图表">
      <Frame10 />
    </div>
  );
}

function Frame64() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <div className="bg-[#2481f2] h-[3px] shrink-0 w-[16px]" data-name="矩形" />
      <p className="css-ew64yg font-['Microsoft_YaHei:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#626c78] text-[14px]">水阀#1：</p>
    </div>
  );
}

function Frame29() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Frame64 />
      <p className="css-ew64yg font-['Microsoft_YaHei:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#1b2129] text-[14px]">开启</p>
    </div>
  );
}

function Frame63() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0">
      <Frame29 />
    </div>
  );
}

function Frame2() {
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
      <Frame63 />
    </div>
  );
}

function Frame31() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] h-[162px] items-start relative shrink-0 w-full">
      <Component5 />
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
      <Frame2 />
    </div>
  );
}

function Frame81() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0 w-full">
      <Frame30 />
      <Frame31 />
    </div>
  );
}

function Frame35() {
  return (
    <div className="bg-white h-[235px] relative rounded-[8px] shrink-0 w-full">
      <div aria-hidden="true" className="absolute border border-solid border-white inset-0 pointer-events-none rounded-[8px]" />
      <div className="content-stretch flex flex-col items-start px-[12px] py-[16px] relative size-full">
        <Frame81 />
      </div>
    </div>
  );
}

function Frame67() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-[144px]">
      <p className="css-ew64yg font-['Microsoft_YaHei_UI:Bold',sans-serif] leading-[24px] not-italic relative shrink-0 text-[#2e3742] text-[16px]">设备异常记录</p>
    </div>
  );
}

function Frame16() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <div className="bg-[#2481f2] h-[3px] shrink-0 w-[16px]" data-name="矩形" />
      <p className="css-ew64yg font-['Microsoft_YaHei:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#626c78] text-[14px]">冷机台数设定</p>
    </div>
  );
}

function Frame15() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <div className="bg-[#09b3b5] h-[3px] shrink-0 w-[16px]" data-name="矩形" />
      <p className="css-ew64yg font-['Microsoft_YaHei:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#626c78] text-[14px]">AI策略台数设定</p>
    </div>
  );
}

function Frame43() {
  return (
    <div className="content-stretch flex gap-[12px] items-center relative shrink-0">
      <Frame16 />
      <Frame15 />
    </div>
  );
}

function Frame44() {
  return (
    <div className="content-stretch flex items-center opacity-0 relative shrink-0">
      <Frame43 />
    </div>
  );
}

function Frame66() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <Frame67 />
      <Frame44 />
    </div>
  );
}

function Component6() {
  return <div className="bg-[#a6aaac] rounded-[12px] shrink-0 size-[10px]" data-name="步骤点" />;
}

function Frame75() {
  return (
    <div className="content-stretch flex h-[17px] items-center relative shrink-0">
      <Component6 />
    </div>
  );
}

function Frame76() {
  return (
    <div className="content-stretch flex gap-[12px] items-center relative shrink-0">
      <p className="css-4hzbpn font-['Persagy2.0:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#626c78] text-[14px] w-[62px]">01:15:00</p>
      <Frame75 />
      <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[0] not-italic relative shrink-0 text-[#626c78] text-[14px] text-right">
        <span className="font-['Microsoft_YaHei_UI:Bold',sans-serif] leading-[normal]">2#电动通断水阀</span>
        <span className="leading-[normal]">{` 发生 控制失能报警`}</span>
      </p>
    </div>
  );
}

function Frame70() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
      <Frame76 />
    </div>
  );
}

function Frame32() {
  return (
    <div className="bg-white relative rounded-[8px] shrink-0 w-full">
      <div aria-hidden="true" className="absolute border border-solid border-white inset-0 pointer-events-none rounded-[8px]" />
      <div className="content-stretch flex flex-col gap-[12px] items-start px-[12px] py-[16px] relative w-full">
        <Frame66 />
        <Frame70 />
      </div>
    </div>
  );
}

function Frame147() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full">
      <Frame137 />
      <Frame33 />
      <Frame35 />
      <Frame32 />
    </div>
  );
}

function Frame139() {
  return (
    <div className="relative rounded-[4px] shrink-0 w-full">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[4px] size-full" src={imgFrame1937107242} />
      <div className="content-stretch flex flex-col items-start px-[12px] py-[8px] relative w-full">
        <p className="css-ew64yg font-['Microsoft_YaHei_UI:Bold',sans-serif] leading-[22px] not-italic relative shrink-0 text-[#2e3742] text-[16px]">空调控制分组-末级泵组</p>
      </div>
    </div>
  );
}

function Frame129() {
  return (
    <div className="content-stretch flex flex-[1_0_0] h-full items-center min-h-px min-w-px relative">
      <div className="h-full relative shrink-0 w-0">
        <div className="absolute inset-[0_-0.5px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1 277">
            <path d="M0.5 0V277" id="Vector 4569" stroke="var(--stroke-0, #E1E5EB)" strokeDasharray="4 4" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Component7() {
  return (
    <div className="absolute content-stretch flex h-[277px] items-center justify-between left-[187px] top-[97px] w-[969px]" data-name="虚线">
      {[...Array(14).keys()].map((_, i) => (
        <Frame129 key={i} />
      ))}
    </div>
  );
}

function Button2() {
  return (
    <div className="content-stretch flex gap-[12px] items-center justify-center px-[8px] py-[5px] relative rounded-[4px] shrink-0" data-name="按钮&Button">
      <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[22px] not-italic relative shrink-0 text-[#246fe5] text-[14px] text-center">查看时间表</p>
    </div>
  );
}

function Button3() {
  return (
    <div className="content-stretch flex gap-[12px] items-center justify-center px-[8px] py-[5px] relative rounded-[4px] shrink-0" data-name="按钮&Button">
      <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[22px] not-italic relative shrink-0 text-[#246fe5] text-[14px] text-center">查看人工干预记录</p>
    </div>
  );
}

function Frame141() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <Button2 />
      <div className="bg-[#e1e5eb] h-[14px] shrink-0 w-px" />
      <Button3 />
    </div>
  );
}

function Frame142() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <p className="css-ew64yg font-['Microsoft_YaHei_UI:Bold',sans-serif] leading-[24px] not-italic relative shrink-0 text-[#2e3742] text-[16px]">调节记录</p>
      <Frame141 />
    </div>
  );
}

function Box1() {
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

function Checkbox1() {
  return (
    <div className="content-stretch flex gap-[8px] items-center opacity-0 relative shrink-0" data-name="多选框&Checkbox">
      <Box1 />
      <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[22px] not-italic relative shrink-0 text-[#1b2129] text-[14px]">显示AI策略</p>
    </div>
  );
}

function Frame83() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <Frame142 />
      <Checkbox1 />
    </div>
  );
}

function Frame121() {
  return (
    <div className="content-stretch flex h-full items-center py-[8px] relative shrink-0 w-[175px]">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-[0_0_-0.5px_0] pointer-events-none" />
      <p className="css-ew64yg font-['Noto_Sans_SC:Regular',sans-serif] font-normal leading-[14px] relative shrink-0 text-[#8d9399] text-[12px]" style={{ fontFeatureSettings: "'pwid'" }}>
        调节参数名称
      </p>
    </div>
  );
}

function Frame122() {
  return (
    <div className="content-stretch flex flex-[1_0_0] h-full items-center min-h-px min-w-px py-[8px] relative">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-[0_0_-0.5px_0] pointer-events-none" />
      <p className="css-ew64yg font-['Noto_Sans_SC:Regular',sans-serif] font-normal leading-[14px] relative shrink-0 text-[#8d9399] text-[12px]" style={{ fontFeatureSettings: "'pwid'" }}>
        08:00
      </p>
    </div>
  );
}

function Frame123() {
  return (
    <div className="content-stretch flex flex-[1_0_0] h-full items-center min-h-px min-w-px py-[8px] relative">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-[0_0_-0.5px_0] pointer-events-none" />
      <p className="css-ew64yg font-['Noto_Sans_SC:Regular',sans-serif] font-normal leading-[14px] relative shrink-0 text-[#8d9399] text-[12px]" style={{ fontFeatureSettings: "'pwid'" }}>
        09:00
      </p>
    </div>
  );
}

function Frame124() {
  return (
    <div className="content-stretch flex flex-[1_0_0] h-full items-center min-h-px min-w-px py-[8px] relative">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-[0_0_-0.5px_0] pointer-events-none" />
      <p className="css-ew64yg font-['Noto_Sans_SC:Regular',sans-serif] font-normal leading-[14px] relative shrink-0 text-[#8d9399] text-[12px]" style={{ fontFeatureSettings: "'pwid'" }}>
        10:00
      </p>
    </div>
  );
}

function Frame125() {
  return (
    <div className="content-stretch flex flex-[1_0_0] h-full items-center min-h-px min-w-px py-[8px] relative">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-[0_0_-0.5px_0] pointer-events-none" />
      <p className="css-ew64yg font-['Noto_Sans_SC:Regular',sans-serif] font-normal leading-[14px] relative shrink-0 text-[#8d9399] text-[12px]" style={{ fontFeatureSettings: "'pwid'" }}>
        11:00
      </p>
    </div>
  );
}

function Frame126() {
  return (
    <div className="content-stretch flex flex-[1_0_0] h-full items-center min-h-px min-w-px py-[8px] relative">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-[0_0_-0.5px_0] pointer-events-none" />
      <p className="css-ew64yg font-['Noto_Sans_SC:Regular',sans-serif] font-normal leading-[14px] relative shrink-0 text-[#8d9399] text-[12px]" style={{ fontFeatureSettings: "'pwid'" }}>
        12:00
      </p>
    </div>
  );
}

function Frame127() {
  return (
    <div className="content-stretch flex flex-[1_0_0] h-full items-center min-h-px min-w-px py-[8px] relative">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-[0_0_-0.5px_0] pointer-events-none" />
      <p className="css-ew64yg font-['Noto_Sans_SC:Regular',sans-serif] font-normal leading-[14px] relative shrink-0 text-[#8d9399] text-[12px]" style={{ fontFeatureSettings: "'pwid'" }}>
        13:00
      </p>
    </div>
  );
}

function Frame143() {
  return (
    <div className="content-stretch flex flex-[1_0_0] h-full items-center min-h-px min-w-px py-[8px] relative">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-[0_0_-0.5px_0] pointer-events-none" />
      <p className="css-ew64yg font-['Noto_Sans_SC:Regular',sans-serif] font-normal leading-[14px] relative shrink-0 text-[#8d9399] text-[12px]" style={{ fontFeatureSettings: "'pwid'" }}>
        14:00
      </p>
    </div>
  );
}

function Frame144() {
  return (
    <div className="content-stretch flex flex-[1_0_0] h-full items-center min-h-px min-w-px py-[8px] relative">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-[0_0_-0.5px_0] pointer-events-none" />
      <p className="css-ew64yg font-['Noto_Sans_SC:Regular',sans-serif] font-normal leading-[14px] relative shrink-0 text-[#8d9399] text-[12px]" style={{ fontFeatureSettings: "'pwid'" }}>
        15:00
      </p>
    </div>
  );
}

function Frame145() {
  return (
    <div className="content-stretch flex flex-[1_0_0] h-full items-center min-h-px min-w-px py-[8px] relative">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-[0_0_-0.5px_0] pointer-events-none" />
      <p className="css-ew64yg font-['Noto_Sans_SC:Regular',sans-serif] font-normal leading-[14px] relative shrink-0 text-[#8d9399] text-[12px]" style={{ fontFeatureSettings: "'pwid'" }}>
        16:00
      </p>
    </div>
  );
}

function Frame146() {
  return (
    <div className="content-stretch flex flex-[1_0_0] h-full items-center min-h-px min-w-px py-[8px] relative">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-[0_0_-0.5px_0] pointer-events-none" />
      <p className="css-ew64yg font-['Noto_Sans_SC:Regular',sans-serif] font-normal leading-[14px] relative shrink-0 text-[#8d9399] text-[12px]" style={{ fontFeatureSettings: "'pwid'" }}>
        17:00
      </p>
    </div>
  );
}

function Frame153() {
  return (
    <div className="content-stretch flex flex-[1_0_0] h-full items-center min-h-px min-w-px py-[8px] relative">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-[0_0_-0.5px_0] pointer-events-none" />
      <p className="css-ew64yg font-['Noto_Sans_SC:Regular',sans-serif] font-normal leading-[14px] relative shrink-0 text-[#8d9399] text-[12px]" style={{ fontFeatureSettings: "'pwid'" }}>
        18:00
      </p>
    </div>
  );
}

function Frame154() {
  return (
    <div className="content-stretch flex flex-[1_0_0] h-full items-center min-h-px min-w-px py-[8px] relative">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-[0_0_-0.5px_0] pointer-events-none" />
      <p className="css-ew64yg font-['Noto_Sans_SC:Regular',sans-serif] font-normal leading-[14px] relative shrink-0 text-[#8d9399] text-[12px]" style={{ fontFeatureSettings: "'pwid'" }}>
        19:00
      </p>
    </div>
  );
}

function Frame155() {
  return (
    <div className="content-stretch flex flex-[1_0_0] h-full items-center min-h-px min-w-px py-[8px] relative">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-[0_0_-0.5px_0] pointer-events-none" />
      <p className="css-ew64yg font-['Noto_Sans_SC:Regular',sans-serif] font-normal leading-[14px] relative shrink-0 text-[#8d9399] text-[12px]" style={{ fontFeatureSettings: "'pwid'" }}>
        20:00
      </p>
    </div>
  );
}

function Frame156() {
  return (
    <div className="content-stretch flex flex-[1_0_0] h-full items-center min-h-px min-w-px py-[8px] relative">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-[0_0_-0.5px_0] pointer-events-none" />
      <p className="css-ew64yg font-['Noto_Sans_SC:Regular',sans-serif] font-normal leading-[14px] relative shrink-0 text-[#8d9399] text-[12px]" style={{ fontFeatureSettings: "'pwid'" }}>
        21:00
      </p>
    </div>
  );
}

function Frame157() {
  return (
    <div className="content-stretch flex h-full items-center py-[8px] relative shrink-0 w-[32px]">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-[0_0_-0.5px_0] pointer-events-none" />
      <p className="css-ew64yg font-['Noto_Sans_SC:Regular',sans-serif] font-normal leading-[14px] relative shrink-0 text-[#8d9399] text-[12px]" style={{ fontFeatureSettings: "'pwid'" }}>
        22:00
      </p>
    </div>
  );
}

function Component8() {
  return (
    <div className="content-stretch flex items-center py-[4px] relative shrink-0 w-full" data-name="横坐标">
      <div className="flex flex-row items-center self-stretch">
        <Frame121 />
      </div>
      <div className="flex flex-[1_0_0] flex-row items-center self-stretch">
        <Frame122 />
      </div>
      <div className="flex flex-[1_0_0] flex-row items-center self-stretch">
        <Frame123 />
      </div>
      <div className="flex flex-[1_0_0] flex-row items-center self-stretch">
        <Frame124 />
      </div>
      <div className="flex flex-[1_0_0] flex-row items-center self-stretch">
        <Frame125 />
      </div>
      <div className="flex flex-[1_0_0] flex-row items-center self-stretch">
        <Frame126 />
      </div>
      <div className="flex flex-[1_0_0] flex-row items-center self-stretch">
        <Frame127 />
      </div>
      <div className="flex flex-[1_0_0] flex-row items-center self-stretch">
        <Frame143 />
      </div>
      <div className="flex flex-[1_0_0] flex-row items-center self-stretch">
        <Frame144 />
      </div>
      <div className="flex flex-[1_0_0] flex-row items-center self-stretch">
        <Frame145 />
      </div>
      <div className="flex flex-[1_0_0] flex-row items-center self-stretch">
        <Frame146 />
      </div>
      <div className="flex flex-[1_0_0] flex-row items-center self-stretch">
        <Frame153 />
      </div>
      <div className="flex flex-[1_0_0] flex-row items-center self-stretch">
        <Frame154 />
      </div>
      <div className="flex flex-[1_0_0] flex-row items-center self-stretch">
        <Frame155 />
      </div>
      <div className="flex flex-[1_0_0] flex-row items-center self-stretch">
        <Frame156 />
      </div>
      <div className="flex flex-row items-center self-stretch">
        <Frame157 />
      </div>
    </div>
  );
}

function Frame158() {
  return (
    <div className="bg-[#e6fcf7] content-stretch flex h-full items-center p-[8px] relative shrink-0 w-[113px]">
      <div aria-hidden="true" className="absolute border-[#14c4c4] border-l-2 border-solid inset-[0_0_0_-1px] pointer-events-none" />
      <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[14px] not-italic relative shrink-0 text-[#1b2129] text-[14px]" style={{ fontFeatureSettings: "'pwid'" }}>
        分区开关
      </p>
    </div>
  );
}

function Frame159() {
  return (
    <div className="bg-[#e6fcf7] flex-[1_0_0] min-h-px min-w-px relative rounded-[4px] w-full">
      <div aria-hidden="true" className="absolute border-[#a6ede8] border-[0.5px] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <div className="flex flex-row justify-center size-full">
        <div className="content-stretch flex items-start justify-center p-[8px] relative size-full">
          <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[14px] not-italic relative shrink-0 text-[#1b2129] text-[14px]" style={{ fontFeatureSettings: "'pwid'" }}>
            设定值
          </p>
        </div>
      </div>
    </div>
  );
}

function Frame160() {
  return (
    <div className="content-stretch flex flex-col h-full items-start justify-center relative shrink-0">
      <Frame159 />
    </div>
  );
}

function Frame161() {
  return (
    <div className="content-stretch flex gap-[4px] h-full items-center relative shrink-0">
      <Frame158 />
      <Frame160 />
    </div>
  );
}

function Frame93() {
  return (
    <div className="bg-[#e6fcf7] flex-[1_0_0] min-h-px min-w-px relative rounded-[4px]">
      <div aria-hidden="true" className="absolute border-[#a6ede8] border-[0.5px] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col gap-[8px] items-start justify-center p-[8px] relative w-full">
          <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[14px] not-italic relative shrink-0 text-[#00a2a7] text-[14px] text-center">开启</p>
        </div>
      </div>
    </div>
  );
}

function Frame95() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-full">
      <Frame93 />
    </div>
  );
}

function Frame96() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-h-px min-w-px relative">
      <Frame95 />
    </div>
  );
}

function Component9() {
  return (
    <div className="content-stretch flex gap-[8px] items-center py-[4px] relative shrink-0 w-full" data-name="横坐标">
      <div className="flex flex-row items-center self-stretch">
        <Frame161 />
      </div>
      <Frame96 />
    </div>
  );
}

function Frame162() {
  return (
    <div className="bg-[#ebf6ff] flex-[1_0_0] h-full min-h-px min-w-px relative">
      <div aria-hidden="true" className="absolute border-[#246fe5] border-l-2 border-solid inset-[0_0_0_-1px] pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center p-[8px] relative size-full">
          <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[14px] not-italic relative shrink-0 text-[#1b2129] text-[14px]" style={{ fontFeatureSettings: "'pwid'" }}>
            水泵开启台数
          </p>
        </div>
      </div>
    </div>
  );
}

function Frame163() {
  return (
    <div className="bg-[#ebf6ff] flex-[1_0_0] min-h-px min-w-px relative rounded-[4px] w-full">
      <div aria-hidden="true" className="absolute border-[#9fc9fb] border-[0.5px] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center p-[8px] relative size-full">
          <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[14px] not-italic relative shrink-0 text-[#1b2129] text-[14px]" style={{ fontFeatureSettings: "'pwid'" }}>
            设定值
          </p>
        </div>
      </div>
    </div>
  );
}

function Frame164() {
  return (
    <div className="content-stretch flex flex-col h-full items-start justify-center relative shrink-0">
      <Frame163 />
    </div>
  );
}

function Frame150() {
  return (
    <div className="content-stretch flex gap-[4px] h-[64px] items-start relative shrink-0 w-[175px]">
      <Frame162 />
      <Frame164 />
    </div>
  );
}

function Frame84() {
  return (
    <div className="bg-[#ebf6ff] content-stretch flex flex-col gap-[8px] items-start justify-center p-[8px] relative rounded-[4px] shrink-0 w-[126px]">
      <div aria-hidden="true" className="absolute border-[#9fc9fb] border-[0.5px] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[14px] not-italic relative shrink-0 text-[#215dd9] text-[14px] text-center">0大0小</p>
    </div>
  );
}

function Frame85() {
  return (
    <div className="bg-[#ebf6ff] content-stretch flex flex-col gap-[8px] items-start justify-center opacity-0 p-[8px] relative rounded-[4px] shrink-0 w-[26px]">
      <div aria-hidden="true" className="absolute border-[#9fc9fb] border-[0.5px] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[14px] not-italic relative shrink-0 text-[#215dd9] text-[14px] text-center">0大1小</p>
    </div>
  );
}

function Frame86() {
  return (
    <div className="bg-[#ebf6ff] content-stretch flex flex-col gap-[8px] items-start justify-center p-[8px] relative rounded-[4px] shrink-0">
      <div aria-hidden="true" className="absolute border-[#9fc9fb] border-[0.5px] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[14px] not-italic relative shrink-0 text-[#215dd9] text-[14px] text-center">1大2小</p>
    </div>
  );
}

function Frame97() {
  return (
    <div className="bg-[#d9ebff] content-stretch flex flex-col gap-[8px] items-start justify-center p-[8px] relative rounded-[4px] shrink-0 w-[487px]">
      <div aria-hidden="true" className="absolute border-[#246fe5] border-[0.5px] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[14px] not-italic relative shrink-0 text-[#215dd9] text-[14px] text-center">2大2小</p>
    </div>
  );
}

function Frame90() {
  return (
    <div className="bg-[#ebf6ff] flex-[1_0_0] min-h-px min-w-px relative rounded-[4px]">
      <div aria-hidden="true" className="absolute border-[#9fc9fb] border-[0.5px] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col gap-[8px] items-start justify-center p-[8px] relative w-full">
          <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[14px] not-italic relative shrink-0 text-[#215dd9] text-[14px] text-center">1大1小</p>
        </div>
      </div>
    </div>
  );
}

function MouseHover() {
  return (
    <div className="absolute left-[487px] size-[24px] top-[8px]" data-name="mouse / hover">
      <div className="absolute flex inset-0 items-center justify-center">
        <div className="flex-none h-[20.079px] rotate-[-12.88deg] skew-x-[0.24deg] w-[19.943px]">
          <div className="relative size-full" data-name="gesture copy 2备份 2">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <img alt="" className="absolute left-0 max-w-none size-full top-0" src={imgGestureCopy22} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame98() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0 w-full">
      <Frame84 />
      <Frame85 />
      <Frame86 />
      <Frame85 />
      <Frame97 />
      <Frame90 />
      <MouseHover />
    </div>
  );
}

function Frame87() {
  return (
    <div className="bg-[#ebf6ff] content-stretch flex flex-col gap-[8px] items-start justify-center opacity-0 p-[8px] relative rounded-[4px] shrink-0 w-[126px]">
      <div aria-hidden="true" className="absolute border-[#9fc9fb] border-[0.5px] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[14px] not-italic relative shrink-0 text-[#215dd9] text-[14px] text-center">0大0小</p>
    </div>
  );
}

function Frame88() {
  return (
    <div className="bg-[#ebf6ff] content-stretch flex flex-col gap-[8px] items-start justify-center opacity-0 p-[8px] relative rounded-[4px] shrink-0">
      <div aria-hidden="true" className="absolute border-[#9fc9fb] border-[0.5px] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[14px] not-italic relative shrink-0 text-[#215dd9] text-[14px] text-center">0大1小</p>
    </div>
  );
}

function Frame99() {
  return (
    <div className="bg-[#ebf6ff] opacity-0 relative rounded-[4px] shrink-0 w-[10px]">
      <div aria-hidden="true" className="absolute border-[#9fc9fb] border-[0.5px] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col gap-[8px] items-start justify-center p-[8px] relative w-full">
          <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[14px] not-italic relative shrink-0 text-[#215dd9] text-[14px] text-center">1大2小</p>
        </div>
      </div>
    </div>
  );
}

function Frame100() {
  return (
    <div className="bg-[#ebf6ff] content-stretch flex flex-col gap-[8px] items-start justify-center p-[8px] relative rounded-[4px] shrink-0 w-[38px]">
      <div aria-hidden="true" className="absolute border-[#9fc9fb] border-[0.5px] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[14px] not-italic relative shrink-0 text-[#215dd9] text-[14px] text-center">0大1小</p>
    </div>
  );
}

function Frame101() {
  return (
    <div className="bg-[#ebf6ff] content-stretch flex flex-col gap-[8px] items-start justify-center opacity-0 p-[8px] relative rounded-[4px] shrink-0 w-[487px]">
      <div aria-hidden="true" className="absolute border-[#9fc9fb] border-[0.5px] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[14px] not-italic relative shrink-0 text-[#215dd9] text-[14px] text-center">2大2小</p>
    </div>
  );
}

function Frame102() {
  return (
    <div className="bg-[#ebf6ff] flex-[1_0_0] min-h-px min-w-px opacity-0 relative rounded-[4px]">
      <div aria-hidden="true" className="absolute border-[#9fc9fb] border-[0.5px] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col gap-[8px] items-start justify-center p-[8px] relative w-full">
          <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[14px] not-italic relative shrink-0 text-[#215dd9] text-[14px] text-center">1大1小</p>
        </div>
      </div>
    </div>
  );
}

function Frame165() {
  return (
    <div className="relative shrink-0 w-full">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[2px] items-center px-[16px] relative w-full">
          <Frame87 />
          <Frame88 />
          <Frame99 />
          <Frame100 />
          <Frame101 />
          <Frame102 />
        </div>
      </div>
    </div>
  );
}

function Frame166() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full">
      <Frame98 />
      <Frame165 />
    </div>
  );
}

function Frame133() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-h-px min-w-px relative">
      <Frame166 />
    </div>
  );
}

function Frame167() {
  return (
    <div className="absolute bg-[#ebf6ff] content-stretch flex flex-col gap-[8px] items-start justify-center left-[312px] p-[8px] rounded-[4px] top-[38px] w-[33px]">
      <div aria-hidden="true" className="absolute border-[#9fc9fb] border-[0.5px] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[14px] not-italic relative shrink-0 text-[#215dd9] text-[14px] text-center">0大1小</p>
    </div>
  );
}

function Component10() {
  return (
    <div className="content-stretch flex gap-[8px] items-center py-[4px] relative shrink-0 w-full" data-name="横坐标">
      <Frame150 />
      <Frame133 />
      <Frame167 />
    </div>
  );
}

function Frame168() {
  return (
    <div className="bg-[#fff2fd] flex-[1_0_0] min-h-px min-w-px relative self-stretch">
      <div aria-hidden="true" className="absolute border-[#be49c5] border-l-2 border-solid inset-[0_0_0_-1px] pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center p-[8px] relative size-full">
          <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[14px] not-italic relative shrink-0 text-[#1b2129] text-[14px]" style={{ fontFeatureSettings: "'pwid'" }}>
            水泵频率
          </p>
        </div>
      </div>
    </div>
  );
}

function Frame169() {
  return (
    <div className="bg-[#fff2fd] flex-[1_0_0] min-h-px min-w-px relative rounded-[4px] w-full">
      <div aria-hidden="true" className="absolute border-[#f1c5ee] border-[0.5px] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center p-[8px] relative size-full">
          <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[14px] not-italic relative shrink-0 text-[#1b2129] text-[14px]" style={{ fontFeatureSettings: "'pwid'" }}>
            设定值
          </p>
        </div>
      </div>
    </div>
  );
}

function Frame170() {
  return (
    <div className="content-stretch flex flex-col items-start justify-center relative self-stretch shrink-0">
      <Frame169 />
    </div>
  );
}

function Frame151() {
  return (
    <div className="content-stretch flex gap-[4px] items-start relative shrink-0 w-[175px]">
      <Frame168 />
      <Frame170 />
    </div>
  );
}

function Frame171() {
  return (
    <div className="bg-[#fff2fd] content-stretch flex flex-col gap-[8px] items-start justify-center p-[8px] relative rounded-[4px] shrink-0 w-[379px]">
      <div aria-hidden="true" className="absolute border-[#f1c5ee] border-[0.5px] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[14px] not-italic relative shrink-0 text-[#a928b7] text-[14px] text-center">32℃</p>
    </div>
  );
}

function Frame172() {
  return (
    <div className="bg-[#fff2fd] content-stretch flex flex-col gap-[8px] items-start justify-center p-[8px] relative rounded-[4px] shrink-0 w-[200px]">
      <div aria-hidden="true" className="absolute border-[#f1c5ee] border-[0.5px] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[14px] not-italic relative shrink-0 text-[#a928b7] text-[14px] text-center">24℃</p>
    </div>
  );
}

function Frame173() {
  return (
    <div className="bg-[#fff2fd] content-stretch flex flex-col gap-[8px] items-start justify-center p-[8px] relative rounded-[4px] shrink-0 w-[116px]">
      <div aria-hidden="true" className="absolute border-[#f1c5ee] border-[0.5px] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[14px] not-italic relative shrink-0 text-[#a928b7] text-[14px] text-center">17℃</p>
    </div>
  );
}

function Frame174() {
  return (
    <div className="bg-[#fff2fd] flex-[1_0_0] min-h-px min-w-px relative rounded-[4px]">
      <div aria-hidden="true" className="absolute border-[#f1c5ee] border-[0.5px] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col gap-[8px] items-start justify-center p-[8px] relative w-full">
          <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[14px] not-italic relative shrink-0 text-[#a928b7] text-[14px] text-center">22℃</p>
        </div>
      </div>
    </div>
  );
}

function Frame175() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0 w-full">
      <Frame171 />
      <Frame172 />
      <Frame173 />
      <Frame174 />
    </div>
  );
}

function Frame176() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-h-px min-w-px relative">
      <Frame175 />
    </div>
  );
}

function Component11() {
  return (
    <div className="content-stretch flex gap-[8px] items-center py-[4px] relative shrink-0 w-full" data-name="横坐标">
      <Frame151 />
      <Frame176 />
    </div>
  );
}

function Frame177() {
  return (
    <div className="bg-[#f1e5fe] flex-[1_0_0] h-full min-h-px min-w-px relative">
      <div aria-hidden="true" className="absolute border-[#8252e3] border-l-2 border-solid inset-[0_0_0_-1px] pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center p-[8px] relative size-full">
          <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[14px] not-italic relative shrink-0 text-[#1b2129] text-[14px]" style={{ fontFeatureSettings: "'pwid'" }}>
            供回水压差
          </p>
        </div>
      </div>
    </div>
  );
}

function Frame178() {
  return (
    <div className="bg-[#fcf5ff] content-stretch flex h-full items-start justify-center p-[8px] relative rounded-[4px] shrink-0 w-[58px]">
      <div aria-hidden="true" className="absolute border-[#e6d1ff] border-[0.5px] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[14px] not-italic relative shrink-0 text-[#1b2129] text-[14px]" style={{ fontFeatureSettings: "'pwid'" }}>
        设定值
      </p>
    </div>
  );
}

function Frame152() {
  return (
    <div className="content-stretch flex gap-[4px] h-[30px] items-start relative shrink-0 w-[175px]">
      <Frame177 />
      <Frame178 />
    </div>
  );
}

function Frame179() {
  return (
    <div className="bg-[#fcf5ff] content-stretch flex flex-col gap-[8px] items-start justify-center p-[8px] relative rounded-[4px] shrink-0 w-[201px]">
      <div aria-hidden="true" className="absolute border-[#e6d1ff] border-[0.5px] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[14px] not-italic relative shrink-0 text-[#a928b7] text-[14px] text-center">32kPa</p>
    </div>
  );
}

function Frame180() {
  return (
    <div className="bg-[#fcf5ff] content-stretch flex flex-col gap-[8px] items-start justify-center p-[8px] relative rounded-[4px] shrink-0 w-[166px]">
      <div aria-hidden="true" className="absolute border-[#e6d1ff] border-[0.5px] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[14px] not-italic relative shrink-0 text-[#a928b7] text-[14px] text-center">22kPa</p>
    </div>
  );
}

function Frame181() {
  return (
    <div className="bg-[#fcf5ff] content-stretch flex flex-col gap-[8px] items-start justify-center p-[8px] relative rounded-[4px] shrink-0 w-[57px]">
      <div aria-hidden="true" className="absolute border-[#e6d1ff] border-[0.5px] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[14px] not-italic relative shrink-0 text-[#a928b7] text-[14px] text-center">17kPa</p>
    </div>
  );
}

function Frame182() {
  return (
    <div className="bg-[#fcf5ff] flex-[1_0_0] min-h-px min-w-px relative rounded-[4px]">
      <div aria-hidden="true" className="absolute border-[#e6d1ff] border-[0.5px] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col gap-[8px] items-start justify-center p-[8px] relative w-full">
          <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[14px] not-italic relative shrink-0 text-[#a928b7] text-[14px] text-center">26kPa</p>
        </div>
      </div>
    </div>
  );
}

function Frame183() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0 w-full">
      <Frame179 />
      <Frame180 />
      <Frame181 />
      <Frame182 />
    </div>
  );
}

function Frame184() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-h-px min-w-px relative">
      <Frame183 />
    </div>
  );
}

function Component12() {
  return (
    <div className="content-stretch flex gap-[8px] items-center py-[4px] relative shrink-0 w-full" data-name="横坐标">
      <Frame152 />
      <Frame184 />
    </div>
  );
}

function Frame185() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full">
      <Component8 />
      <Component9 />
      <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[14px] not-italic relative shrink-0 text-[#666] text-[12px]">泵组#1</p>
      <Component10 />
      <Component11 />
      <Component12 />
    </div>
  );
}

function Frame138() {
  return (
    <div className="bg-white relative rounded-[8px] shrink-0 w-full">
      <div aria-hidden="true" className="absolute border border-solid border-white inset-0 pointer-events-none rounded-[8px]" />
      <div className="content-stretch flex flex-col gap-[12px] items-start px-[12px] py-[16px] relative w-full">
        <Component7 />
        <Frame83 />
        <Frame185 />
      </div>
    </div>
  );
}

function Box2() {
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

function Checkbox2() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="多选框&Checkbox">
      <Box2 />
      <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[22px] not-italic relative shrink-0 text-[#1b2129] text-[14px]">仅看有开启记录的水泵</p>
    </div>
  );
}

function Frame186() {
  return (
    <div className="content-stretch flex items-center justify-end relative shrink-0">
      <Checkbox2 />
    </div>
  );
}

function Frame68() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0">
      <p className="css-ew64yg font-['Microsoft_YaHei_UI:Bold',sans-serif] leading-[0] not-italic relative shrink-0 text-[#2e3742] text-[16px]">
        <span className="leading-[24px]">水泵运行频率</span>
        <span className="font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[24px]">(Hz)</span>
      </p>
      <Frame186 />
    </div>
  );
}

function Frame17() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <div className="bg-[#2481f2] h-[3px] shrink-0 w-[16px]" data-name="矩形" />
      <p className="css-ew64yg font-['Microsoft_YaHei:Regular',sans-serif] leading-[0] not-italic relative shrink-0 text-[#626c78] text-[14px]">
        <span className="leading-[normal]">水泵#1</span>
        <span className="leading-[normal] text-[#8b949e]">(5000m³/h)</span>
      </p>
    </div>
  );
}

function Frame45() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Frame17 />
    </div>
  );
}

function Frame46() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Frame45 />
    </div>
  );
}

function Frame18() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Frame46 />
    </div>
  );
}

function Frame47() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Frame18 />
    </div>
  );
}

function Frame48() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Frame47 />
    </div>
  );
}

function Frame19() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <div className="bg-[#33d4d2] h-[3px] shrink-0 w-[16px]" data-name="矩形" />
      <p className="css-ew64yg font-['Microsoft_YaHei:Regular',sans-serif] leading-[0] not-italic relative shrink-0 text-[#626c78] text-[14px]">
        <span className="leading-[normal]">水泵#2</span>
        <span className="leading-[normal] text-[#8b949e]">(5000m³/h)</span>
      </p>
    </div>
  );
}

function Frame49() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Frame19 />
    </div>
  );
}

function Frame50() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Frame49 />
    </div>
  );
}

function Frame20() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Frame50 />
    </div>
  );
}

function Frame51() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Frame20 />
    </div>
  );
}

function Frame39() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Frame51 />
    </div>
  );
}

function Frame21() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <div className="bg-[#ffd873] h-[3px] shrink-0 w-[16px]" data-name="矩形" />
      <p className="css-ew64yg font-['Microsoft_YaHei:Regular',sans-serif] leading-[0] not-italic relative shrink-0 text-[#626c78] text-[14px]">
        <span className="leading-[normal]">水泵#3</span>
        <span className="leading-[normal] text-[#8b949e]">(5000m³/h)</span>
      </p>
    </div>
  );
}

function Frame52() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Frame21 />
    </div>
  );
}

function Frame53() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Frame52 />
    </div>
  );
}

function Frame22() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Frame53 />
    </div>
  );
}

function Frame54() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Frame22 />
    </div>
  );
}

function Frame40() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Frame54 />
    </div>
  );
}

function Frame23() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <div className="bg-[#b286f5] h-[3px] shrink-0 w-[16px]" data-name="矩形" />
      <p className="css-ew64yg font-['Microsoft_YaHei:Regular',sans-serif] leading-[0] not-italic relative shrink-0 text-[#626c78] text-[14px]">
        <span className="leading-[normal]">水泵#4</span>
        <span className="leading-[normal] text-[#8b949e]">(5000m³/h)</span>
      </p>
    </div>
  );
}

function Frame55() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Frame23 />
    </div>
  );
}

function Frame56() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Frame55 />
    </div>
  );
}

function Frame24() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Frame56 />
    </div>
  );
}

function Frame57() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Frame24 />
    </div>
  );
}

function Frame41() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Frame57 />
    </div>
  );
}

function Frame25() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <div className="bg-[#7188a6] h-[3px] shrink-0 w-[16px]" data-name="矩形" />
      <p className="css-ew64yg font-['Microsoft_YaHei:Regular',sans-serif] leading-[0] not-italic relative shrink-0 text-[#626c78] text-[14px]">
        <span className="leading-[normal]">水泵#5</span>
        <span className="leading-[normal] text-[#8b949e]">(5000m³/h)</span>
      </p>
    </div>
  );
}

function Frame58() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Frame25 />
    </div>
  );
}

function Frame59() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Frame58 />
    </div>
  );
}

function Frame26() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Frame59 />
    </div>
  );
}

function Frame60() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Frame26 />
    </div>
  );
}

function Frame42() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Frame60 />
    </div>
  );
}

function Frame187() {
  return (
    <div className="content-stretch flex gap-[8px] items-center justify-end relative shrink-0">
      <Frame48 />
      <Frame39 />
      <Frame40 />
      <Frame41 />
      <Frame42 />
    </div>
  );
}

function Frame136() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Frame187 />
    </div>
  );
}

function Frame71() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <Frame68 />
      <Frame136 />
    </div>
  );
}

function Frame() {
  return <div className="absolute h-[143px] left-[48px] top-0 w-[1092px] z-[3]" />;
}

function Frame8() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] items-center min-h-px min-w-px py-[10px] relative w-full">
      <p className="css-4hzbpn font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[18px] not-italic relative shrink-0 text-[#646c73] text-[12px] text-right w-[24px]">100</p>
      <div className="flex-[1_0_0] h-0 min-h-px min-w-px relative" data-name="line">
        <div className="absolute inset-[-0.5px_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1086 1">
            <path d="M1086 0.5H0" id="line" stroke="var(--stroke-0, #E4E6E7)" strokeDasharray="3 3" />
          </svg>
        </div>
      </div>
      <p className="css-4hzbpn font-['PingFang_SC:Regular',sans-serif] leading-[18px] not-italic relative shrink-0 text-[12px] text-[rgba(100,108,115,0)] w-[18px]">20</p>
    </div>
  );
}

function Frame9() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] items-center min-h-px min-w-px py-[10px] relative w-full">
      <p className="css-4hzbpn font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[18px] not-italic relative shrink-0 text-[#646c73] text-[12px] text-right w-[24px]">80</p>
      <div className="flex-[1_0_0] h-0 min-h-px min-w-px relative" data-name="line">
        <div className="absolute inset-[-0.5px_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1086 1">
            <path d="M1086 0.5H0" id="line" stroke="var(--stroke-0, #E4E6E7)" strokeDasharray="3 3" />
          </svg>
        </div>
      </div>
      <p className="css-4hzbpn font-['PingFang_SC:Regular',sans-serif] leading-[18px] not-italic relative shrink-0 text-[12px] text-[rgba(100,108,115,0)] w-[18px]">16</p>
    </div>
  );
}

function Frame11() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] items-center min-h-px min-w-px py-[10px] relative w-full">
      <p className="css-4hzbpn font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[18px] not-italic relative shrink-0 text-[#646c73] text-[12px] text-right w-[24px]">60</p>
      <div className="flex-[1_0_0] h-0 min-h-px min-w-px relative" data-name="line">
        <div className="absolute inset-[-0.5px_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1086 1">
            <path d="M1086 0.5H0" id="line" stroke="var(--stroke-0, #E4E6E7)" strokeDasharray="3 3" />
          </svg>
        </div>
      </div>
      <p className="css-4hzbpn font-['PingFang_SC:Regular',sans-serif] leading-[18px] not-italic relative shrink-0 text-[12px] text-[rgba(100,108,115,0)] w-[18px]">12</p>
    </div>
  );
}

function Frame5() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] items-center min-h-px min-w-px py-[10px] relative w-full">
      <p className="css-4hzbpn font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[18px] not-italic relative shrink-0 text-[#646c73] text-[12px] text-right w-[24px]">40</p>
      <div className="flex-[1_0_0] h-0 min-h-px min-w-px relative" data-name="line">
        <div className="absolute inset-[-0.5px_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1086 1">
            <path d="M1086 0.5H0" id="line" stroke="var(--stroke-0, #E4E6E7)" strokeDasharray="3 3" />
          </svg>
        </div>
      </div>
      <p className="css-4hzbpn font-['PingFang_SC:Regular',sans-serif] leading-[18px] not-italic relative shrink-0 text-[12px] text-[rgba(100,108,115,0)] w-[18px]">8</p>
    </div>
  );
}

function Frame6() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] items-center min-h-px min-w-px py-[10px] relative w-full">
      <p className="css-4hzbpn font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[18px] not-italic relative shrink-0 text-[#646c73] text-[12px] text-right w-[24px]">20</p>
      <div className="flex-[1_0_0] h-0 min-h-px min-w-px relative" data-name="line">
        <div className="absolute inset-[-0.5px_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1086 1">
            <path d="M1086 0.5H0" id="line" stroke="var(--stroke-0, #E4E6E7)" strokeDasharray="3 3" />
          </svg>
        </div>
      </div>
      <p className="css-4hzbpn font-['PingFang_SC:Regular',sans-serif] leading-[18px] not-italic relative shrink-0 text-[12px] text-[rgba(100,108,115,0)] w-[18px]">4</p>
    </div>
  );
}

function Frame12() {
  return (
    <div className="content-stretch flex gap-[8px] h-[32px] items-center pt-[10px] relative shrink-0 w-full">
      <p className="css-4hzbpn font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[18px] not-italic relative shrink-0 text-[#646c73] text-[12px] text-right w-[24px]">0</p>
      <div className="flex-[1_0_0] h-0 min-h-px min-w-px relative" data-name="line">
        <div className="absolute inset-[-0.5px_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1086 1">
            <path d="M1086 0.5H0" id="line" stroke="var(--stroke-0, #C4C9CF)" />
          </svg>
        </div>
      </div>
      <p className="css-4hzbpn font-['PingFang_SC:Regular',sans-serif] leading-[18px] not-italic relative shrink-0 text-[12px] text-[rgba(100,108,115,0)] w-[18px]">0</p>
    </div>
  );
}

function x1() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start justify-between min-h-px min-w-px overflow-clip relative w-full" data-name="左侧X轴">
      <Frame8 />
      <Frame9 />
      <Frame11 />
      <Frame5 />
      <Frame6 />
      <Frame12 />
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

function Frame36() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col h-[172px] items-start min-h-px min-w-px relative">
      <x1 />
      <Component13 />
    </div>
  );
}

function Component14() {
  return (
    <div className="content-stretch flex items-start relative shrink-0 w-full z-[2]" data-name="坐标">
      <Frame36 />
    </div>
  );
}

function Frame134() {
  return (
    <div className="absolute h-[120.5px] left-[37px] top-[12px] w-[1096px] z-[1]">
      <div className="absolute inset-[-0.44%_-0.01%_-0.26%_-0.04%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1096.47 121.352">
          <g id="Frame 1937107229">
            <path d={svgPaths.p37aaba10} id="Vector 4570" stroke="var(--stroke-0, #FFD873)" />
            <path d={svgPaths.p1c543c40} id="Vector 4571" stroke="var(--stroke-0, #B286F5)" />
            <path d={svgPaths.p7d61540} id="Vector 4572" stroke="var(--stroke-0, #7188A6)" />
            <path d={svgPaths.p12c5c440} id="Vector 4573" stroke="var(--stroke-0, #33D4D2)" />
            <path d={svgPaths.p3a67c600} id="Vector 4574" stroke="var(--stroke-0, #2481F2)" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Frame13() {
  return (
    <div className="content-stretch flex flex-col gap-[14px] h-[172px] isolate items-start relative shrink-0 w-full">
      <Frame />
      <Component14 />
      <Frame134 />
    </div>
  );
}

function Frame140() {
  return (
    <div className="bg-white relative rounded-[8px] shrink-0 w-full">
      <div aria-hidden="true" className="absolute border border-solid border-white inset-0 pointer-events-none rounded-[8px]" />
      <div className="content-stretch flex flex-col gap-[12px] items-start px-[12px] py-[16px] relative w-full">
        <Frame71 />
        <Frame13 />
      </div>
    </div>
  );
}

function Frame72() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-[144px]">
      <p className="css-ew64yg font-['Microsoft_YaHei_UI:Bold',sans-serif] leading-[24px] not-italic relative shrink-0 text-[#2e3742] text-[16px]">设备异常记录</p>
    </div>
  );
}

function Frame27() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <div className="bg-[#2481f2] h-[3px] shrink-0 w-[16px]" data-name="矩形" />
      <p className="css-ew64yg font-['Microsoft_YaHei:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#626c78] text-[14px]">冷机台数设定</p>
    </div>
  );
}

function Frame28() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <div className="bg-[#09b3b5] h-[3px] shrink-0 w-[16px]" data-name="矩形" />
      <p className="css-ew64yg font-['Microsoft_YaHei:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#626c78] text-[14px]">AI策略台数设定</p>
    </div>
  );
}

function Frame61() {
  return (
    <div className="content-stretch flex gap-[12px] items-center relative shrink-0">
      <Frame27 />
      <Frame28 />
    </div>
  );
}

function Frame62() {
  return (
    <div className="content-stretch flex items-center opacity-0 relative shrink-0">
      <Frame61 />
    </div>
  );
}

function Frame74() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <Frame72 />
      <Frame62 />
    </div>
  );
}

function Component15() {
  return <div className="bg-[#a6aaac] rounded-[12px] shrink-0 size-[10px]" data-name="步骤点" />;
}

function Frame77() {
  return (
    <div className="content-stretch flex h-[17px] items-center relative shrink-0">
      <Component15 />
    </div>
  );
}

function Frame69() {
  return (
    <div className="content-stretch flex gap-[12px] items-center relative shrink-0">
      <p className="css-4hzbpn font-['Persagy2.0:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#626c78] text-[14px] w-[62px]">00:30:00</p>
      <Frame77 />
      <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[0] not-italic relative shrink-0 text-[#626c78] text-[14px] text-right">
        <span className="font-['Microsoft_YaHei_UI:Bold',sans-serif] leading-[normal]">1#冷冻水泵</span>
        <span className="leading-[normal]">{` 发生 变频器状态反馈与指令不符报警`}</span>
      </p>
    </div>
  );
}

function Frame73() {
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

function Component16() {
  return <div className="bg-[#a6aaac] rounded-[12px] shrink-0 size-[10px]" data-name="步骤点" />;
}

function Frame78() {
  return (
    <div className="content-stretch flex h-[17px] items-center relative shrink-0">
      <Component16 />
    </div>
  );
}

function Frame79() {
  return (
    <div className="content-stretch flex gap-[12px] items-center relative shrink-0">
      <p className="css-4hzbpn font-['Persagy2.0:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#626c78] text-[14px] w-[62px]">01:15:00</p>
      <Frame78 />
      <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[0] not-italic relative shrink-0 text-[#626c78] text-[14px] text-right">
        <span className="font-['Microsoft_YaHei_UI:Bold',sans-serif] leading-[normal]">2#电动通断水阀</span>
        <span className="leading-[normal]">{` 发生 控制失能报警`}</span>
      </p>
    </div>
  );
}

function Frame80() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
      <Frame69 />
      <Frame73 />
      <Frame79 />
    </div>
  );
}

function Frame34() {
  return (
    <div className="bg-white relative rounded-[8px] shrink-0 w-full">
      <div aria-hidden="true" className="absolute border border-solid border-white inset-0 pointer-events-none rounded-[8px]" />
      <div className="content-stretch flex flex-col gap-[12px] items-start px-[12px] py-[16px] relative w-full">
        <Frame74 />
        <Frame80 />
      </div>
    </div>
  );
}

function Frame148() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full">
      <Frame139 />
      <Frame138 />
      <Frame140 />
      <Frame34 />
    </div>
  );
}

function Frame149() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-full">
      <Frame147 />
      <Frame148 />
    </div>
  );
}

function Frame188() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0.5)] content-stretch flex flex-col gap-[12px] items-start left-0 p-[16px] rounded-[8px] top-[-607.5px] w-[1200px]">
      <div aria-hidden="true" className="absolute border border-solid border-white inset-0 pointer-events-none rounded-[8px] shadow-[0px_4px_20px_0px_rgba(0,0,0,0.04)]" />
      <Frame1 />
      <Frame149 />
    </div>
  );
}

export default function Frame189() {
  return (
    <div className="relative size-full">
      <Frame188 />
    </div>
  );
}