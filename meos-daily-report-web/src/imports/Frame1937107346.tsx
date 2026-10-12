import svgPaths from "./svg-hydhokhw1j";
import imgFrame1937107242 from "@/assets/ed07366a06320f72100f9b26c58eca5ec52423c3.png";
import { imgFrame852824547 } from "./svg-chodc";

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

function Group1() {
  return (
    <div className="absolute contents inset-[-1.42%_9.26%_-1.42%_0]">
      <Meos />
    </div>
  );
}

function Frame6() {
  return (
    <div className="h-[13.333px] relative shrink-0 w-[60px]">
      <Group1 />
    </div>
  );
}

function Frame5() {
  return (
    <div className="content-stretch flex gap-[2px] items-center justify-center relative shrink-0">
      <p className="font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[22px] not-italic relative shrink-0 text-[#1b2129] text-[14px] text-center whitespace-pre">禹数2#楼运行复盘报告</p>
    </div>
  );
}

function Component() {
  return (
    <div className="content-stretch flex gap-[6px] items-center justify-center relative shrink-0" data-name="内容">
      <Frame5 />
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
      <Frame6 />
      <div className="bg-[#c4c9cf] h-[14px] shrink-0 w-px" data-name="分割线" />
      <Component1 />
    </div>
  );
}

function Frame() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Frame">
          <path d={svgPaths.p1c88f800} fill="var(--fill-0, #373C43)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Component3() {
  return (
    <div className="content-stretch flex gap-[4px] items-center justify-center relative shrink-0" data-name="内容">
      <Frame />
      <p className="font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[22px] not-italic relative shrink-0 text-[#1b2129] text-[14px] text-center whitespace-pre">下载报告</p>
    </div>
  );
}

function Button() {
  return (
    <div className="content-stretch flex items-center justify-center px-[8px] py-[5px] relative rounded-[4px] shrink-0" data-name="按钮&Button">
      <Component3 />
    </div>
  );
}

function Component4() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="左图标">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="å·¦å¾æ ">
          <path d={svgPaths.p361ab680} fill="var(--fill-0, #1B2129)" id="ä¸è§å½¢" />
        </g>
      </svg>
    </div>
  );
}

function Component5() {
  return (
    <div className="content-stretch flex gap-[4px] items-center justify-center relative shrink-0" data-name="内容">
      <Component4 />
      <p className="font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[22px] not-italic relative shrink-0 text-[#1b2129] text-[14px] text-center whitespace-pre">演示模式</p>
    </div>
  );
}

function Button1() {
  return (
    <div className="content-stretch flex items-center justify-center px-[8px] py-[5px] relative rounded-[4px] shrink-0" data-name="按钮&Button">
      <Component5 />
    </div>
  );
}

function XFrame() {
  return (
    <div className="bg-white flex-[1_0_0] min-h-px min-w-px relative shadow-[0px_2px_10px_0px_rgba(27,33,41,0.1)]" data-name="X-Frame（新版本-未开发）">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex gap-[4px] items-center px-[16px] py-[8px] relative w-full">
          <Component2 />
          <Button />
          <div className="bg-[#d9d9d9] h-[14px] shrink-0 w-px" />
          <Button1 />
        </div>
      </div>
    </div>
  );
}

function XFrame1() {
  return (
    <div className="content-stretch flex h-[48px] items-center relative shrink-0 w-full z-[3]" data-name="X-Frame（新版本-未开发）">
      <XFrame />
    </div>
  );
}

function Property() {
  return (
    <div className="bg-[#cbf7f3] content-stretch flex items-center justify-center px-[8px] py-px relative rounded-[4px] shrink-0" data-name="属性标签&Property">
      <p className="font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[22px] not-italic relative shrink-0 text-[#00a2a7] text-[14px] whitespace-pre">日报</p>
    </div>
  );
}

function Frame57() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0">
      <p className="font-['Microsoft_YaHei_UI:Bold',sans-serif] leading-[40px] not-italic relative shrink-0 text-[#2e3742] text-[30px] whitespace-pre">运行复盘报告2025.08.27</p>
      <Property />
    </div>
  );
}

function Component6() {
  return (
    <div className="content-stretch flex gap-[4px] items-center justify-center relative shrink-0" data-name="内容">
      <p className="font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[22px] not-italic relative shrink-0 text-[#1b2129] text-[14px] text-center whitespace-pre">编辑</p>
    </div>
  );
}

function Component7() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center relative shrink-0" data-name="限制宽度">
      <Component6 />
    </div>
  );
}

function Button2() {
  return (
    <div className="bg-white content-stretch flex items-center justify-center min-w-[80px] px-[16px] py-[5px] relative rounded-[4px] shrink-0" data-name="按钮&Button">
      <div aria-hidden="true" className="absolute border border-[#c4c9cf] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <Component7 />
    </div>
  );
}

function Component8() {
  return (
    <div className="content-stretch flex gap-[4px] items-center justify-center relative shrink-0" data-name="内容">
      <p className="font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[22px] not-italic relative shrink-0 text-[#1b2129] text-[14px] text-center whitespace-pre">更新报告</p>
    </div>
  );
}

function Component9() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center relative shrink-0" data-name="限制宽度">
      <Component8 />
    </div>
  );
}

function Button3() {
  return (
    <div className="bg-white content-stretch flex items-center justify-center min-w-[80px] px-[16px] py-[5px] relative rounded-[4px] shrink-0" data-name="按钮&Button">
      <div aria-hidden="true" className="absolute border border-[#c4c9cf] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <Component9 />
    </div>
  );
}

function Frame62() {
  return (
    <div className="content-stretch flex gap-[4px] items-center justify-end opacity-0 relative shrink-0 w-[485px]">
      <Button2 />
      <Button3 />
    </div>
  );
}

function Frame8() {
  return (
    <div className="content-stretch flex flex-[1_0_0] items-center justify-between min-h-px min-w-px relative w-full">
      <Frame57 />
      <Frame62 />
    </div>
  );
}

function CommonTime() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="common/time">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="common/time">
          <path d={svgPaths.p2d903ac0} fill="var(--fill-0, #1B2129)" id="æ¤­åå½¢" />
          <rect fill="var(--fill-0, #8B949E)" height="4.26667" id="ç©å½¢" rx="0.666667" width="1.33333" x="6.57102" y="5.06161" />
          <rect fill="var(--fill-0, #8B949E)" height="5.23636" id="ç©å½¢å¤ä»½ 36" rx="0.666667" transform="rotate(90 11.8864 8.22716)" width="1.33333" x="11.8864" y="8.22716" />
        </g>
      </svg>
    </div>
  );
}

function Frame29() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0 w-full">
      <CommonTime />
      <p className="font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[22px] not-italic relative shrink-0 text-[#626c78] text-[14px] whitespace-pre">报告日期：</p>
      <p className="font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[22px] not-italic relative shrink-0 text-[#626c78] text-[14px] whitespace-pre">2025.08.27</p>
    </div>
  );
}

function Frame7() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] h-[66px] items-start relative shrink-0 w-full">
      <Frame8 />
      <Frame29 />
    </div>
  );
}

function Component10() {
  return (
    <div className="content-stretch flex gap-[9px] items-center relative rounded-[4px] shrink-0" data-name="小蓝标">
      <div className="bg-[#246fe5] h-[20px] shrink-0 w-[3px]" />
      <p className="font-['Microsoft_YaHei_UI:Bold',sans-serif] leading-[28px] not-italic relative shrink-0 text-[#2e3742] text-[20px] whitespace-pre">空调</p>
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex flex-col isolate items-start pb-[12px] pt-0 px-0 relative shrink-0">
      <p className="font-['Microsoft_YaHei_UI:Bold',sans-serif] leading-[28px] not-italic relative shrink-0 text-[#2e3742] text-[20px] whitespace-pre z-[2]">供冷量分析</p>
      <div className="bg-[rgba(0,148,255,0.2)] h-[12px] mb-[-12px] shrink-0 w-full z-[1]" />
    </div>
  );
}

function Frame39() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <div className="bg-[#2481f2] h-[3px] shrink-0 w-[14px]" data-name="矩形" />
      <p className="font-['Microsoft_YaHei:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#626c78] text-[14px] whitespace-pre">空间实际温度平均值：</p>
    </div>
  );
}

function Frame19() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Frame39 />
      <p className="font-['Microsoft_YaHei:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#1b2129] text-[14px] whitespace-pre">28℃</p>
    </div>
  );
}

function Frame40() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <div className="bg-[#b286f5] h-[3px] shrink-0 w-[14px]" data-name="矩形" />
      <p className="font-['Microsoft_YaHei:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#626c78] text-[14px] whitespace-pre">空间目标温度平均值：</p>
    </div>
  );
}

function Frame21() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Frame40 />
      <p className="font-['Microsoft_YaHei:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#1b2129] text-[14px] whitespace-pre">29℃</p>
    </div>
  );
}

function Frame41() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <div className="bg-[#ffd873] h-[3px] shrink-0 w-[14px]" data-name="矩形" />
      <p className="font-['Microsoft_YaHei:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#626c78] text-[14px] whitespace-pre">电价：</p>
    </div>
  );
}

function Frame22() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Frame41 />
      <p className="font-['Microsoft_YaHei:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#1b2129] text-[14px] whitespace-pre">1.6元/kwh</p>
    </div>
  );
}

function Frame38() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0">
      <Frame19 />
      <Frame21 />
      <Frame22 />
    </div>
  );
}

function Frame17() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col gap-[12px] items-start left-[391px] p-[12px] rounded-[4px] top-[74px] z-[6]">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-[1.221px] border-solid inset-[-1.221px] pointer-events-none rounded-[5.221px] shadow-[0px_3.664px_14.655px_0px_rgba(27,33,41,0.12),0px_0.611px_3.664px_0px_rgba(27,33,41,0.08)]" />
      <p className="font-['Microsoft_YaHei:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#2e3742] text-[14px] whitespace-pre">{`2025年8月25日 07:00 `}</p>
      <div className="h-0 relative shrink-0 w-full">
        <div className="absolute inset-[-0.5px_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 189 1">
            <path d="M0 0.5H189" id="Vector 4527" stroke="var(--stroke-0, #E1E5EB)" />
          </svg>
        </div>
      </div>
      <Frame38 />
    </div>
  );
}

function Frame63() {
  return (
    <div className="absolute h-[112.7px] left-[58px] top-[79px] w-[1047.03px] z-[5]">
      <div className="absolute inset-[0_-0.03%_-2.23%_-0.13%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1048.71 115.212">
          <g id="Frame 1937107290">
            <path d={svgPaths.p3df87800} id="Vector 4577" stroke="var(--stroke-0, #246FE5)" />
            <path d={svgPaths.p3a18b680} id="Vector 4578" stroke="var(--stroke-0, #B286F5)" />
            <path d={svgPaths.p3da27d00} id="Vector 4579" stroke="var(--stroke-0, #FFD873)" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Frame54() {
  return (
    <div className="content-stretch flex gap-[12px] items-center relative shrink-0">
      <div className="flex flex-col font-['Microsoft_YaHei_UI:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#1b2129] text-[14px] text-center whitespace-nowrap">
        <p className="leading-[22px] whitespace-pre">空间平均温度调节</p>
      </div>
    </div>
  );
}

function Frame42() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <div className="bg-[#2481f2] h-[3px] shrink-0 w-[14px]" data-name="矩形" />
      <p className="font-['Microsoft_YaHei:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#626c78] text-[14px] whitespace-pre">实际值</p>
    </div>
  );
}

function Frame20() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Frame42 />
    </div>
  );
}

function Frame43() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <div className="bg-[#b286f5] h-[3px] shrink-0 w-[14px]" data-name="矩形" />
      <p className="font-['Microsoft_YaHei:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#626c78] text-[14px] whitespace-pre">目标值</p>
    </div>
  );
}

function Frame34() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Frame43 />
    </div>
  );
}

function Frame44() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <div className="bg-[#ffd873] h-[3px] shrink-0 w-[14px]" data-name="矩形" />
      <p className="font-['Microsoft_YaHei:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#626c78] text-[14px] whitespace-pre">电价</p>
    </div>
  );
}

function Frame33() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Frame44 />
    </div>
  );
}

function Frame18() {
  return (
    <div className="content-center flex flex-wrap gap-[12px] items-center relative shrink-0">
      <Frame20 />
      <Frame34 />
      <Frame33 />
    </div>
  );
}

function Frame51() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full z-[3]">
      <Frame54 />
      <Frame18 />
    </div>
  );
}

function Frame52() {
  return (
    <div className="content-stretch flex font-['Microsoft_YaHei_UI:Regular',sans-serif] items-center justify-between leading-[0] not-italic relative shrink-0 text-[#626c78] text-[14px] text-center w-full whitespace-nowrap z-[2]">
      <div className="flex flex-col justify-center relative shrink-0">
        <p className="leading-[22px] whitespace-pre">℃</p>
      </div>
      <div className="flex flex-col justify-center relative shrink-0">
        <p className="leading-[22px] whitespace-pre">元</p>
      </div>
    </div>
  );
}

function Frame12() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] items-center min-h-px min-w-px px-0 py-[10px] relative w-full">
      <p className="font-['PingFang_SC:Regular',sans-serif] leading-[18px] not-italic relative shrink-0 text-[#646c73] text-[12px] text-right w-[18px] whitespace-pre-wrap">40</p>
      <div className="flex-[1_0_0] h-0 min-h-px min-w-px relative" data-name="line">
        <div className="absolute inset-[-0.5px_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1070 1">
            <path d="M1070 0.5H0" id="line" stroke="var(--stroke-0, #E4E6E7)" strokeDasharray="3 3" />
          </svg>
        </div>
      </div>
      <p className="font-['PingFang_SC:Regular',sans-serif] leading-[18px] not-italic relative shrink-0 text-[12px] text-[rgba(100,108,115,0)] w-[18px] whitespace-pre-wrap">16</p>
      <p className="font-['PingFang_SC:Regular',sans-serif] leading-[18px] not-italic relative shrink-0 text-[#646c73] text-[12px] text-right w-[18px] whitespace-pre-wrap">2.0</p>
    </div>
  );
}

function Frame14() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] items-center min-h-px min-w-px px-0 py-[10px] relative w-full">
      <p className="font-['PingFang_SC:Regular',sans-serif] leading-[18px] not-italic relative shrink-0 text-[#646c73] text-[12px] text-right w-[18px] whitespace-pre-wrap">32</p>
      <div className="flex-[1_0_0] h-0 min-h-px min-w-px relative" data-name="line">
        <div className="absolute inset-[-0.5px_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1070 1">
            <path d="M1070 0.5H0" id="line" stroke="var(--stroke-0, #E4E6E7)" strokeDasharray="3 3" />
          </svg>
        </div>
      </div>
      <p className="font-['PingFang_SC:Regular',sans-serif] leading-[18px] not-italic relative shrink-0 text-[12px] text-[rgba(100,108,115,0)] w-[18px] whitespace-pre-wrap">16</p>
      <p className="font-['PingFang_SC:Regular',sans-serif] leading-[18px] not-italic relative shrink-0 text-[#646c73] text-[12px] text-right w-[18px] whitespace-pre-wrap">1.6</p>
    </div>
  );
}

function Frame13() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] items-center min-h-px min-w-px px-0 py-[10px] relative w-full">
      <p className="font-['PingFang_SC:Regular',sans-serif] leading-[18px] not-italic relative shrink-0 text-[#646c73] text-[12px] text-right w-[18px] whitespace-pre-wrap">24</p>
      <div className="flex-[1_0_0] h-0 min-h-px min-w-px relative" data-name="line">
        <div className="absolute inset-[-0.5px_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1070 1">
            <path d="M1070 0.5H0" id="line" stroke="var(--stroke-0, #E4E6E7)" strokeDasharray="3 3" />
          </svg>
        </div>
      </div>
      <p className="font-['PingFang_SC:Regular',sans-serif] leading-[18px] not-italic relative shrink-0 text-[12px] text-[rgba(100,108,115,0)] w-[18px] whitespace-pre-wrap">12</p>
      <p className="font-['PingFang_SC:Regular',sans-serif] leading-[18px] not-italic relative shrink-0 text-[#646c73] text-[12px] text-right w-[18px] whitespace-pre-wrap">1.2</p>
    </div>
  );
}

function Frame9() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] items-center min-h-px min-w-px px-0 py-[10px] relative w-full">
      <p className="font-['PingFang_SC:Regular',sans-serif] leading-[18px] not-italic relative shrink-0 text-[#646c73] text-[12px] text-right w-[18px] whitespace-pre-wrap">16</p>
      <div className="flex-[1_0_0] h-0 min-h-px min-w-px relative" data-name="line">
        <div className="absolute inset-[-0.5px_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1070 1">
            <path d="M1070 0.5H0" id="line" stroke="var(--stroke-0, #E4E6E7)" strokeDasharray="3 3" />
          </svg>
        </div>
      </div>
      <p className="font-['PingFang_SC:Regular',sans-serif] leading-[18px] not-italic relative shrink-0 text-[12px] text-[rgba(100,108,115,0)] w-[18px] whitespace-pre-wrap">8</p>
      <p className="font-['PingFang_SC:Regular',sans-serif] leading-[18px] not-italic relative shrink-0 text-[#646c73] text-[12px] text-right w-[18px] whitespace-pre-wrap">0.8</p>
    </div>
  );
}

function Frame10() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] items-center min-h-px min-w-px px-0 py-[10px] relative w-full">
      <p className="font-['PingFang_SC:Regular',sans-serif] leading-[18px] not-italic relative shrink-0 text-[#646c73] text-[12px] text-right w-[18px] whitespace-pre-wrap">8</p>
      <div className="flex-[1_0_0] h-0 min-h-px min-w-px relative" data-name="line">
        <div className="absolute inset-[-0.5px_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1070 1">
            <path d="M1070 0.5H0" id="line" stroke="var(--stroke-0, #E4E6E7)" strokeDasharray="3 3" />
          </svg>
        </div>
      </div>
      <p className="font-['PingFang_SC:Regular',sans-serif] leading-[18px] not-italic relative shrink-0 text-[12px] text-[rgba(100,108,115,0)] w-[18px] whitespace-pre-wrap">4</p>
      <p className="font-['PingFang_SC:Regular',sans-serif] leading-[18px] not-italic relative shrink-0 text-[#646c73] text-[12px] text-right w-[18px] whitespace-pre-wrap">0.4</p>
    </div>
  );
}

function Frame11() {
  return (
    <div className="content-stretch flex gap-[8px] h-[32px] items-center pb-0 pt-[10px] px-0 relative shrink-0 w-full">
      <p className="font-['PingFang_SC:Regular',sans-serif] leading-[18px] not-italic relative shrink-0 text-[#646c73] text-[12px] text-right w-[18px] whitespace-pre-wrap">0</p>
      <div className="flex-[1_0_0] h-0 min-h-px min-w-px relative" data-name="line">
        <div className="absolute inset-[-0.5px_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1070 1">
            <path d="M1070 0.5H0" id="line" stroke="var(--stroke-0, #C4C9CF)" />
          </svg>
        </div>
      </div>
      <p className="font-['PingFang_SC:Regular',sans-serif] leading-[18px] not-italic relative shrink-0 text-[12px] text-[rgba(100,108,115,0)] w-[18px] whitespace-pre-wrap">0</p>
      <p className="font-['PingFang_SC:Regular',sans-serif] leading-[18px] not-italic relative shrink-0 text-[#646c73] text-[12px] text-right w-[18px] whitespace-pre-wrap">0</p>
    </div>
  );
}

function x() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start justify-between min-h-px min-w-px overflow-clip relative w-full" data-name="左侧X轴">
      <Frame12 />
      <Frame14 />
      <Frame13 />
      <Frame9 />
      <Frame10 />
      <Frame11 />
    </div>
  );
}

function Component11() {
  return (
    <div className="h-[18px] relative shrink-0 w-full" data-name="横坐标">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex font-['Noto_Sans_SC:Regular',sans-serif] font-normal items-center justify-between leading-[14px] pl-[40px] pr-[36px] py-0 relative size-full text-[#8d9399] text-[12px] text-center whitespace-pre">
          <p className="relative shrink-0" style={{ fontFeatureSettings: "'pwid'" }}>
            00:00
          </p>
          <p className="relative shrink-0" style={{ fontFeatureSettings: "'pwid'" }}>
            01:00
          </p>
          <p className="relative shrink-0" style={{ fontFeatureSettings: "'pwid'" }}>
            02:00
          </p>
          <p className="relative shrink-0" style={{ fontFeatureSettings: "'pwid'" }}>
            03:00
          </p>
          <p className="relative shrink-0" style={{ fontFeatureSettings: "'pwid'" }}>
            04:00
          </p>
          <p className="relative shrink-0" style={{ fontFeatureSettings: "'pwid'" }}>
            05:00
          </p>
          <p className="relative shrink-0" style={{ fontFeatureSettings: "'pwid'" }}>
            06:00
          </p>
          <p className="relative shrink-0" style={{ fontFeatureSettings: "'pwid'" }}>
            07:00
          </p>
          <p className="relative shrink-0" style={{ fontFeatureSettings: "'pwid'" }}>
            08:00
          </p>
          <p className="relative shrink-0" style={{ fontFeatureSettings: "'pwid'" }}>
            09:00
          </p>
          <p className="relative shrink-0" style={{ fontFeatureSettings: "'pwid'" }}>
            10:00
          </p>
          <p className="relative shrink-0" style={{ fontFeatureSettings: "'pwid'" }}>
            11:00
          </p>
          <p className="relative shrink-0" style={{ fontFeatureSettings: "'pwid'" }}>
            12:00
          </p>
          <p className="relative shrink-0" style={{ fontFeatureSettings: "'pwid'" }}>
            13:00
          </p>
          <p className="relative shrink-0" style={{ fontFeatureSettings: "'pwid'" }}>
            14:00
          </p>
          <p className="relative shrink-0" style={{ fontFeatureSettings: "'pwid'" }}>
            15:00
          </p>
          <p className="relative shrink-0" style={{ fontFeatureSettings: "'pwid'" }}>
            16:00
          </p>
          <p className="relative shrink-0" style={{ fontFeatureSettings: "'pwid'" }}>
            17:00
          </p>
          <p className="relative shrink-0" style={{ fontFeatureSettings: "'pwid'" }}>
            18:00
          </p>
          <p className="relative shrink-0" style={{ fontFeatureSettings: "'pwid'" }}>
            19:00
          </p>
          <p className="relative shrink-0" style={{ fontFeatureSettings: "'pwid'" }}>
            20:00
          </p>
          <p className="relative shrink-0" style={{ fontFeatureSettings: "'pwid'" }}>
            21:00
          </p>
          <p className="relative shrink-0" style={{ fontFeatureSettings: "'pwid'" }}>
            22:00
          </p>
          <p className="relative shrink-0" style={{ fontFeatureSettings: "'pwid'" }}>
            23:00
          </p>
        </div>
      </div>
    </div>
  );
}

function Frame31() {
  return (
    <div className="content-stretch flex flex-col h-[172px] items-start relative shrink-0 w-[1148px]">
      <x />
      <Component11 />
    </div>
  );
}

function Component12() {
  return (
    <div className="content-stretch flex items-start relative shrink-0 z-[1]" data-name="坐标">
      <Frame31 />
    </div>
  );
}

function Frame15() {
  return (
    <div className="content-stretch flex flex-col h-[175px] isolate items-start relative shrink-0 w-full z-[1]">
      <Component12 />
    </div>
  );
}

function Component154() {
  return (
    <div className="bg-white content-stretch flex flex-col gap-[6px] isolate items-start px-[12px] py-[16px] relative rounded-[8px] shrink-0 w-[1168px]" data-name="Component 394">
      <div aria-hidden="true" className="absolute border border-solid border-white inset-0 pointer-events-none rounded-[8px] shadow-[0px_4px_20px_0px_rgba(0,0,0,0.04)]" />
      <Frame17 />
      <Frame63 />
      <Frame51 />
      <Frame52 />
      <Frame15 />
    </div>
  );
}

function Frame58() {
  return (
    <div className="content-stretch flex flex-col font-['Microsoft_YaHei_UI:Regular',sans-serif] gap-[4px] items-start leading-[22px] not-italic relative shrink-0 text-[14px] w-full whitespace-pre-wrap z-[4]">
      <p className="min-w-full relative shrink-0 text-[#1b2129] w-[min-content]">温度调节所需冷量与能耗使用</p>
      <p className="min-w-full relative shrink-0 text-[#626c78] w-[min-content]">冷站未运行</p>
    </div>
  );
}

function Component155() {
  return (
    <div className="bg-white relative rounded-[8px] shrink-0 w-full" data-name="Component 395">
      <div aria-hidden="true" className="absolute border border-solid border-white inset-0 pointer-events-none rounded-[8px] shadow-[0px_4px_20px_0px_rgba(0,0,0,0.04)]" />
      <div className="content-stretch flex flex-col gap-[6px] isolate items-start px-[12px] py-[16px] relative w-full">
        <Frame58 />
      </div>
    </div>
  );
}

function Frame24() {
  return (
    <div className="bg-[rgba(255,255,255,0.5)] content-stretch flex flex-col gap-[12px] items-start p-[16px] relative rounded-[8px] shrink-0 w-[1200px]">
      <div aria-hidden="true" className="absolute border border-solid border-white inset-0 pointer-events-none rounded-[8px] shadow-[0px_4px_20px_0px_rgba(0,0,0,0.04)]" />
      <Frame1 />
      <Component154 />
      <Component155 />
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex flex-col isolate items-start pb-[12px] pt-0 px-0 relative shrink-0">
      <p className="font-['Microsoft_YaHei_UI:Bold',sans-serif] leading-[28px] not-italic relative shrink-0 text-[#2e3742] text-[20px] whitespace-pre z-[2]">环境品质</p>
      <div className="bg-[rgba(0,148,255,0.2)] h-[12px] mb-[-12px] shrink-0 w-full z-[1]" />
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
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="多选框&Checkbox">
      <Box />
      <p className="font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[22px] not-italic relative shrink-0 text-[#1b2129] text-[14px] whitespace-pre">仅看品质异常空间</p>
    </div>
  );
}

function Component13() {
  return (
    <div className="content-stretch flex font-['Microsoft_YaHei_UI:Regular',sans-serif] items-center justify-center leading-[22px] not-italic relative shrink-0 text-[14px] whitespace-pre" data-name="内容">
      <p className="relative shrink-0 text-[#626c78]">类型：</p>
      <p className="relative shrink-0 text-[#1b2129] text-center">全部</p>
    </div>
  );
}

function Component14() {
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
      <Component13 />
      <Component14 />
    </div>
  );
}

function Component15() {
  return (
    <div className="content-stretch flex font-['Microsoft_YaHei_UI:Regular',sans-serif] items-center justify-center leading-[22px] not-italic relative shrink-0 text-[14px] whitespace-pre" data-name="内容">
      <p className="relative shrink-0 text-[#626c78]">空间名称：</p>
      <p className="relative shrink-0 text-[#c4c9cf] text-center">请选择</p>
    </div>
  );
}

function Component16() {
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
      <Component15 />
      <Component16 />
    </div>
  );
}

function Frame55() {
  return (
    <div className="absolute content-stretch flex gap-[4px] items-center left-[-7px] top-[-0.95px]">
      <Select />
      <div className="bg-[#d9d9d9] h-[13px] shrink-0 w-px" />
      <Select1 />
    </div>
  );
}

function Frame56() {
  return (
    <div className="h-[32px] relative shrink-0 w-[290px]">
      <Frame55 />
    </div>
  );
}

function Frame65() {
  return (
    <div className="content-stretch flex gap-[10px] items-center relative shrink-0">
      <Checkbox />
      <Frame56 />
    </div>
  );
}

function Frame45() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <div className="bg-[#b6e9c7] h-[3px] shrink-0 w-[14px]" data-name="矩形" />
      <p className="font-['Microsoft_YaHei:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#626c78] text-[14px] whitespace-pre">达标</p>
    </div>
  );
}

function Frame23() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Frame45 />
    </div>
  );
}

function Frame46() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <div className="bg-[#ffd873] h-[3px] shrink-0 w-[14px]" data-name="矩形" />
      <p className="font-['Microsoft_YaHei:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#626c78] text-[14px] whitespace-pre">持续偏热</p>
    </div>
  );
}

function Frame36() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Frame46 />
    </div>
  );
}

function Frame47() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <div className="bg-[#fdc1be] h-[3px] shrink-0 w-[14px]" data-name="矩形" />
      <p className="font-['Microsoft_YaHei:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#626c78] text-[14px] whitespace-pre">空间过热</p>
    </div>
  );
}

function Frame32() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Frame47 />
    </div>
  );
}

function Frame48() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <div className="bg-[#7ed8e4] h-[3px] shrink-0 w-[14px]" data-name="矩形" />
      <p className="font-['Microsoft_YaHei:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#626c78] text-[14px] whitespace-pre">持续偏冷</p>
    </div>
  );
}

function Frame35() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Frame48 />
    </div>
  );
}

function Frame49() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <div className="bg-[#64a6f7] h-[3px] shrink-0 w-[14px]" data-name="矩形" />
      <p className="font-['Microsoft_YaHei:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#626c78] text-[14px] whitespace-pre">空间过冷</p>
    </div>
  );
}

function Frame37() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Frame49 />
    </div>
  );
}

function Frame66() {
  return (
    <div className="content-stretch flex gap-[10px] items-center relative shrink-0">
      <Frame23 />
      <Frame36 />
      <Frame32 />
      <Frame35 />
      <Frame37 />
    </div>
  );
}

function Frame64() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full z-[2]">
      <Frame65 />
      <Frame66 />
    </div>
  );
}

function Component17() {
  return (
    <div className="bg-[#ebf4fe] h-[38px] relative shrink-0 w-full z-[14]" data-name="表头">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-[0_0_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[10px] relative size-full">
          <p className="font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[18px] leading-[20px] not-italic overflow-hidden relative shrink-0 text-[#626c78] text-[12px] text-ellipsis w-full whitespace-nowrap">楼层</p>
        </div>
      </div>
    </div>
  );
}

function Component18() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#1b2129] text-[14px] text-ellipsis whitespace-nowrap">1F</p>
    </div>
  );
}

function Component19() {
  return (
    <div className="relative shrink-0 w-full z-[13]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-[0_0_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative w-full">
          <Component18 />
        </div>
      </div>
    </div>
  );
}

function Component20() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#1b2129] text-[14px] text-ellipsis whitespace-nowrap">2F</p>
    </div>
  );
}

function Component21() {
  return (
    <div className="h-[96px] relative shrink-0 w-full z-[12]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-[0_0_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative size-full">
          <Component20 />
        </div>
      </div>
    </div>
  );
}

function Component22() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#1b2129] text-[14px] text-ellipsis whitespace-nowrap">3F</p>
    </div>
  );
}

function Component23() {
  return (
    <div className="relative shrink-0 w-full z-[11]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-[0_0_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative w-full">
          <Component22 />
        </div>
      </div>
    </div>
  );
}

function Component24() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#1b2129] text-[14px] text-ellipsis whitespace-nowrap">4F</p>
    </div>
  );
}

function Component25() {
  return (
    <div className="relative shrink-0 w-full z-[10]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-[0_0_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative w-full">
          <Component24 />
        </div>
      </div>
    </div>
  );
}

function Component26() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col isolate items-start min-h-px min-w-px overflow-clip relative" data-name="列内容">
      <Component17 />
      <Component19 />
      <Component21 />
      <Component23 />
      <Component25 />
    </div>
  );
}

function Component27() {
  return (
    <div className="content-stretch flex items-start relative shrink-0 w-[63px] z-[3]" data-name="列">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-r border-solid inset-[0_-1px_0_0] pointer-events-none" />
      <Component26 />
    </div>
  );
}

function Component28() {
  return (
    <div className="bg-[#ebf4fe] h-[38px] relative shrink-0 w-full z-[15]" data-name="表头">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-[0_0_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[10px] relative size-full">
          <p className="font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[18px] leading-[20px] not-italic relative shrink-0 text-[#626c78] text-[12px] w-full whitespace-pre-wrap">空间名称</p>
        </div>
      </div>
    </div>
  );
}

function Component29() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#246fe5] text-[14px] text-ellipsis whitespace-nowrap">强电间#1</p>
    </div>
  );
}

function Component30() {
  return (
    <div className="relative shrink-0 w-full z-[14]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-[0_0_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative w-full">
          <Component29 />
        </div>
      </div>
    </div>
  );
}

function Component31() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#246fe5] text-[14px] text-ellipsis whitespace-nowrap">多功能会议室#1</p>
    </div>
  );
}

function Component32() {
  return (
    <div className="relative shrink-0 w-full z-[13]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-[0_0_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative w-full">
          <Component31 />
        </div>
      </div>
    </div>
  );
}

function Component33() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#246fe5] text-[14px] text-ellipsis whitespace-nowrap">多功能会议室#1</p>
    </div>
  );
}

function Component34() {
  return (
    <div className="relative shrink-0 w-full z-[12]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-[0_0_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative w-full">
          <Component33 />
        </div>
      </div>
    </div>
  );
}

function Component35() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#246fe5] text-[14px] text-ellipsis whitespace-nowrap">电能监测室#1</p>
    </div>
  );
}

function Component36() {
  return (
    <div className="relative shrink-0 w-full z-[11]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-[0_0_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative w-full">
          <Component35 />
        </div>
      </div>
    </div>
  );
}

function Component37() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="内容">
      <p className="flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#246fe5] text-[14px] text-ellipsis whitespace-nowrap">储能室#1</p>
    </div>
  );
}

function Component38() {
  return (
    <div className="relative shrink-0 w-full z-[10]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-solid inset-[0_0_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[13px] relative w-full">
          <Component37 />
        </div>
      </div>
    </div>
  );
}

function Component39() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col isolate items-start min-h-px min-w-px overflow-clip relative" data-name="列内容">
      <Component28 />
      <Component30 />
      <Component32 />
      <Component34 />
      <Component36 />
      <Component38 />
    </div>
  );
}

function Component40() {
  return (
    <div className="content-stretch flex items-start relative shrink-0 w-[199px] z-[2]" data-name="列">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-r border-solid inset-[0_-1px_0_0] pointer-events-none" />
      <Component39 />
    </div>
  );
}

function Component41() {
  return (
    <div className="bg-[#ebf4fe] h-[38px] relative shrink-0 w-full z-[6]" data-name="表头">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid border-t inset-[-0.5px_-0.5px_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[10px] relative size-full">
          <p className="font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[18px] leading-[20px] not-italic overflow-hidden relative shrink-0 text-[#626c78] text-[12px] text-ellipsis w-full whitespace-nowrap">09:00</p>
        </div>
      </div>
    </div>
  );
}

function Component42() {
  return (
    <div className="h-[48px] relative shrink-0 w-full z-[5]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-[0_-0.5px_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center p-[2px] relative size-full">
          <div className="bg-[#b6e9c7] flex-[1_0_0] min-h-px min-w-px w-full" />
        </div>
      </div>
    </div>
  );
}

function Component43() {
  return (
    <div className="h-[48px] relative shrink-0 w-full z-[4]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-[0_-0.5px_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center p-[2px] relative size-full">
          <div className="bg-[#b6e9c7] flex-[1_0_0] min-h-px min-w-px w-full" />
        </div>
      </div>
    </div>
  );
}

function Component44() {
  return (
    <div className="h-[48px] relative shrink-0 w-full z-[3]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-[0_-0.5px_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center p-[2px] relative size-full">
          <div className="bg-[#b6e9c7] flex-[1_0_0] min-h-px min-w-px w-full" />
        </div>
      </div>
    </div>
  );
}

function Component45() {
  return (
    <div className="h-[48px] relative shrink-0 w-full z-[2]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-[0_-0.5px_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center p-[2px] relative size-full">
          <div className="bg-[#b6e9c7] flex-[1_0_0] min-h-px min-w-px w-full" />
        </div>
      </div>
    </div>
  );
}

function Component46() {
  return (
    <div className="h-[48px] relative shrink-0 w-full z-[1]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-[0_-0.5px_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center p-[2px] relative size-full">
          <div className="bg-[#b6e9c7] flex-[1_0_0] min-h-px min-w-px w-full" />
        </div>
      </div>
    </div>
  );
}

function Component47() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col isolate items-start min-h-px min-w-px overflow-clip relative" data-name="列内容">
      <Component41 />
      <Component42 />
      <Component43 />
      <Component44 />
      <Component45 />
      <Component46 />
    </div>
  );
}

function Component48() {
  return (
    <div className="content-stretch flex flex-[1_0_0] items-start min-h-px min-w-px relative" data-name="列">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-r border-solid inset-[0_-1px_0_0] pointer-events-none" />
      <Component47 />
    </div>
  );
}

function Component49() {
  return (
    <div className="bg-[#ebf4fe] h-[38px] relative shrink-0 w-full z-[6]" data-name="表头">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-[0_-0.5px_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[10px] relative size-full">
          <p className="font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[18px] leading-[20px] not-italic overflow-hidden relative shrink-0 text-[#626c78] text-[12px] text-ellipsis w-full whitespace-nowrap">10:00</p>
        </div>
      </div>
    </div>
  );
}

function Component50() {
  return (
    <div className="h-[48px] relative shrink-0 w-full z-[5]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-[0_-0.5px_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center p-[2px] relative size-full">
          <div className="bg-[#b6e9c7] flex-[1_0_0] min-h-px min-w-px w-full" />
        </div>
      </div>
    </div>
  );
}

function Component51() {
  return (
    <div className="h-[48px] relative shrink-0 w-full z-[4]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-[0_-0.5px_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center p-[2px] relative size-full">
          <div className="bg-[#b6e9c7] flex-[1_0_0] min-h-px min-w-px w-full" />
        </div>
      </div>
    </div>
  );
}

function Component52() {
  return (
    <div className="h-[48px] relative shrink-0 w-full z-[3]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-[0_-0.5px_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center p-[2px] relative size-full">
          <div className="bg-[#b6e9c7] flex-[1_0_0] min-h-px min-w-px w-full" />
        </div>
      </div>
    </div>
  );
}

function Component53() {
  return (
    <div className="h-[48px] relative shrink-0 w-full z-[2]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-[0_-0.5px_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center p-[2px] relative size-full">
          <div className="bg-[#b6e9c7] flex-[1_0_0] min-h-px min-w-px w-full" />
        </div>
      </div>
    </div>
  );
}

function Component54() {
  return (
    <div className="h-[48px] relative shrink-0 w-full z-[1]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-[0_-0.5px_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center p-[2px] relative size-full">
          <div className="bg-[#b6e9c7] flex-[1_0_0] min-h-px min-w-px w-full" />
        </div>
      </div>
    </div>
  );
}

function Component55() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col isolate items-start min-h-px min-w-px overflow-clip relative" data-name="列内容">
      <Component49 />
      <Component50 />
      <Component51 />
      <Component52 />
      <Component53 />
      <Component54 />
    </div>
  );
}

function Component56() {
  return (
    <div className="content-stretch flex flex-[1_0_0] items-start min-h-px min-w-px relative" data-name="列">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-r border-solid inset-[0_-1px_0_0] pointer-events-none" />
      <Component55 />
    </div>
  );
}

function Component57() {
  return (
    <div className="bg-[#ebf4fe] h-[38px] relative shrink-0 w-full z-[6]" data-name="表头">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-[0_-0.5px_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[10px] relative size-full">
          <p className="font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[18px] leading-[20px] not-italic overflow-hidden relative shrink-0 text-[#626c78] text-[12px] text-ellipsis w-full whitespace-nowrap">11:00</p>
        </div>
      </div>
    </div>
  );
}

function Component58() {
  return (
    <div className="h-[48px] relative shrink-0 w-full z-[5]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-[0_-0.5px_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center p-[2px] relative size-full">
          <div className="bg-[#b6e9c7] flex-[1_0_0] min-h-px min-w-px w-full" />
        </div>
      </div>
    </div>
  );
}

function Component59() {
  return (
    <div className="h-[48px] relative shrink-0 w-full z-[4]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-[0_-0.5px_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center p-[2px] relative size-full">
          <div className="bg-[#ffd873] flex-[1_0_0] min-h-px min-w-px w-full" />
        </div>
      </div>
    </div>
  );
}

function Component60() {
  return (
    <div className="h-[48px] relative shrink-0 w-full z-[3]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-[0_-0.5px_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center p-[2px] relative size-full">
          <div className="bg-[#b6e9c7] flex-[1_0_0] min-h-px min-w-px w-full" />
        </div>
      </div>
    </div>
  );
}

function Component61() {
  return (
    <div className="h-[48px] relative shrink-0 w-full z-[2]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-[0_-0.5px_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center p-[2px] relative size-full">
          <div className="bg-[#b6e9c7] flex-[1_0_0] min-h-px min-w-px w-full" />
        </div>
      </div>
    </div>
  );
}

function Component62() {
  return (
    <div className="h-[48px] relative shrink-0 w-full z-[1]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-[0_-0.5px_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center p-[2px] relative size-full">
          <div className="bg-[#b6e9c7] flex-[1_0_0] min-h-px min-w-px w-full" />
        </div>
      </div>
    </div>
  );
}

function Component63() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col isolate items-start min-h-px min-w-px overflow-clip relative" data-name="列内容">
      <Component57 />
      <Component58 />
      <Component59 />
      <Component60 />
      <Component61 />
      <Component62 />
    </div>
  );
}

function Component64() {
  return (
    <div className="content-stretch flex flex-[1_0_0] items-start min-h-px min-w-px relative" data-name="列">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-r border-solid inset-[0_-1px_0_0] pointer-events-none" />
      <Component63 />
    </div>
  );
}

function Component65() {
  return (
    <div className="bg-[#ebf4fe] h-[38px] relative shrink-0 w-full z-[6]" data-name="表头">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-[0_-0.5px_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[10px] relative size-full">
          <p className="font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[18px] leading-[20px] not-italic overflow-hidden relative shrink-0 text-[#626c78] text-[12px] text-ellipsis w-full whitespace-nowrap">12:00</p>
        </div>
      </div>
    </div>
  );
}

function Component66() {
  return (
    <div className="h-[48px] relative shrink-0 w-full z-[5]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-[0_-0.5px_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center p-[2px] relative size-full">
          <div className="bg-[#b6e9c7] flex-[1_0_0] min-h-px min-w-px w-full" />
        </div>
      </div>
    </div>
  );
}

function Component67() {
  return (
    <div className="h-[48px] relative shrink-0 w-full z-[4]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-[0_-0.5px_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center p-[2px] relative size-full">
          <div className="bg-[#b6e9c7] flex-[1_0_0] min-h-px min-w-px w-full" />
        </div>
      </div>
    </div>
  );
}

function Component68() {
  return (
    <div className="h-[48px] relative shrink-0 w-full z-[3]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-[0_-0.5px_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center p-[2px] relative size-full">
          <div className="bg-[#b6e9c7] flex-[1_0_0] min-h-px min-w-px w-full" />
        </div>
      </div>
    </div>
  );
}

function Component69() {
  return (
    <div className="h-[48px] relative shrink-0 w-full z-[2]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-[0_-0.5px_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center p-[2px] relative size-full">
          <div className="bg-[#ffd873] flex-[1_0_0] min-h-px min-w-px w-full" />
        </div>
      </div>
    </div>
  );
}

function Component70() {
  return (
    <div className="h-[48px] relative shrink-0 w-full z-[1]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-[0_-0.5px_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center p-[2px] relative size-full">
          <div className="bg-[#b6e9c7] flex-[1_0_0] min-h-px min-w-px w-full" />
        </div>
      </div>
    </div>
  );
}

function Component71() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col isolate items-start min-h-px min-w-px overflow-clip relative" data-name="列内容">
      <Component65 />
      <Component66 />
      <Component67 />
      <Component68 />
      <Component69 />
      <Component70 />
    </div>
  );
}

function Component72() {
  return (
    <div className="content-stretch flex flex-[1_0_0] items-start min-h-px min-w-px relative" data-name="列">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-r border-solid inset-[0_-1px_0_0] pointer-events-none" />
      <Component71 />
    </div>
  );
}

function Component73() {
  return (
    <div className="bg-[#ebf4fe] h-[38px] relative shrink-0 w-full z-[6]" data-name="表头">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-[0_-0.5px_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[10px] relative size-full">
          <p className="font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[18px] leading-[20px] not-italic overflow-hidden relative shrink-0 text-[#626c78] text-[12px] text-ellipsis w-full whitespace-nowrap">13:00</p>
        </div>
      </div>
    </div>
  );
}

function Component74() {
  return (
    <div className="h-[48px] relative shrink-0 w-full z-[5]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-[0_-0.5px_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center p-[2px] relative size-full">
          <div className="bg-[#b6e9c7] flex-[1_0_0] min-h-px min-w-px w-full" />
        </div>
      </div>
    </div>
  );
}

function Component75() {
  return (
    <div className="h-[48px] relative shrink-0 w-full z-[4]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-[0_-0.5px_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center p-[2px] relative size-full">
          <div className="bg-[#b6e9c7] flex-[1_0_0] min-h-px min-w-px w-full" />
        </div>
      </div>
    </div>
  );
}

function Component76() {
  return (
    <div className="h-[48px] relative shrink-0 w-full z-[3]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-[0_-0.5px_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center p-[2px] relative size-full">
          <div className="bg-[#f8766f] flex-[1_0_0] min-h-px min-w-px w-full" />
        </div>
      </div>
    </div>
  );
}

function Component77() {
  return (
    <div className="h-[48px] relative shrink-0 w-full z-[2]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-[0_-0.5px_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center p-[2px] relative size-full">
          <div className="bg-[#b6e9c7] flex-[1_0_0] min-h-px min-w-px w-full" />
        </div>
      </div>
    </div>
  );
}

function Component78() {
  return (
    <div className="h-[48px] relative shrink-0 w-full z-[1]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-[0_-0.5px_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center p-[2px] relative size-full">
          <div className="bg-[#b6e9c7] flex-[1_0_0] min-h-px min-w-px w-full" />
        </div>
      </div>
    </div>
  );
}

function Component79() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col isolate items-start min-h-px min-w-px overflow-clip relative" data-name="列内容">
      <Component73 />
      <Component74 />
      <Component75 />
      <Component76 />
      <Component77 />
      <Component78 />
    </div>
  );
}

function Component80() {
  return (
    <div className="content-stretch flex flex-[1_0_0] items-start min-h-px min-w-px relative" data-name="列">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-r border-solid inset-[0_-1px_0_0] pointer-events-none" />
      <Component79 />
    </div>
  );
}

function Component81() {
  return (
    <div className="bg-[#ebf4fe] h-[38px] relative shrink-0 w-full z-[6]" data-name="表头">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-[0_-0.5px_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[10px] relative size-full">
          <p className="font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[18px] leading-[20px] not-italic overflow-hidden relative shrink-0 text-[#626c78] text-[12px] text-ellipsis w-full whitespace-nowrap">14:00</p>
        </div>
      </div>
    </div>
  );
}

function Component82() {
  return (
    <div className="h-[48px] relative shrink-0 w-full z-[5]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-[0_-0.5px_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center p-[2px] relative size-full">
          <div className="bg-[#b6e9c7] flex-[1_0_0] min-h-px min-w-px w-full" />
        </div>
      </div>
    </div>
  );
}

function Component83() {
  return (
    <div className="h-[48px] relative shrink-0 w-full z-[4]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-[0_-0.5px_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center p-[2px] relative size-full">
          <div className="bg-[#b6e9c7] flex-[1_0_0] min-h-px min-w-px w-full" />
        </div>
      </div>
    </div>
  );
}

function Component84() {
  return (
    <div className="h-[48px] relative shrink-0 w-full z-[3]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-[0_-0.5px_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center p-[2px] relative size-full">
          <div className="bg-[#b6e9c7] flex-[1_0_0] min-h-px min-w-px w-full" />
        </div>
      </div>
    </div>
  );
}

function Component85() {
  return (
    <div className="h-[48px] relative shrink-0 w-full z-[2]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-[0_-0.5px_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center p-[2px] relative size-full">
          <div className="bg-[#b6e9c7] flex-[1_0_0] min-h-px min-w-px w-full" />
        </div>
      </div>
    </div>
  );
}

function Component86() {
  return (
    <div className="h-[48px] relative shrink-0 w-full z-[1]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-[0_-0.5px_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center p-[2px] relative size-full">
          <div className="bg-[#b6e9c7] flex-[1_0_0] min-h-px min-w-px w-full" />
        </div>
      </div>
    </div>
  );
}

function Component87() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col isolate items-start min-h-px min-w-px overflow-clip relative" data-name="列内容">
      <Component81 />
      <Component82 />
      <Component83 />
      <Component84 />
      <Component85 />
      <Component86 />
    </div>
  );
}

function Component88() {
  return (
    <div className="content-stretch flex flex-[1_0_0] items-start min-h-px min-w-px relative" data-name="列">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-r border-solid inset-[0_-1px_0_0] pointer-events-none" />
      <Component87 />
    </div>
  );
}

function Component89() {
  return (
    <div className="bg-[#ebf4fe] h-[38px] relative shrink-0 w-full z-[6]" data-name="表头">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-[0_-0.5px_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[10px] relative size-full">
          <p className="font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[18px] leading-[20px] not-italic overflow-hidden relative shrink-0 text-[#626c78] text-[12px] text-ellipsis w-full whitespace-nowrap">15:00</p>
        </div>
      </div>
    </div>
  );
}

function Component90() {
  return (
    <div className="h-[48px] relative shrink-0 w-full z-[5]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-[0_-0.5px_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center p-[2px] relative size-full">
          <div className="bg-[#f8766f] flex-[1_0_0] min-h-px min-w-px w-full" />
        </div>
      </div>
    </div>
  );
}

function Component91() {
  return (
    <div className="h-[48px] relative shrink-0 w-full z-[4]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-[0_-0.5px_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center p-[2px] relative size-full">
          <div className="bg-[#b6e9c7] flex-[1_0_0] min-h-px min-w-px w-full" />
        </div>
      </div>
    </div>
  );
}

function Component92() {
  return (
    <div className="h-[48px] relative shrink-0 w-full z-[3]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-[0_-0.5px_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center p-[2px] relative size-full">
          <div className="bg-[#f8766f] flex-[1_0_0] min-h-px min-w-px w-full" />
        </div>
      </div>
    </div>
  );
}

function Component93() {
  return (
    <div className="h-[48px] relative shrink-0 w-full z-[2]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-[0_-0.5px_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center p-[2px] relative size-full">
          <div className="bg-[#b6e9c7] flex-[1_0_0] min-h-px min-w-px w-full" />
        </div>
      </div>
    </div>
  );
}

function Component94() {
  return (
    <div className="h-[48px] relative shrink-0 w-full z-[1]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-[0_-0.5px_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center p-[2px] relative size-full">
          <div className="bg-[#b6e9c7] flex-[1_0_0] min-h-px min-w-px w-full" />
        </div>
      </div>
    </div>
  );
}

function Component95() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col isolate items-start min-h-px min-w-px overflow-clip relative" data-name="列内容">
      <Component89 />
      <Component90 />
      <Component91 />
      <Component92 />
      <Component93 />
      <Component94 />
    </div>
  );
}

function Component96() {
  return (
    <div className="content-stretch flex flex-[1_0_0] items-start min-h-px min-w-px relative" data-name="列">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-r border-solid inset-[0_-1px_0_0] pointer-events-none" />
      <Component95 />
    </div>
  );
}

function Component97() {
  return (
    <div className="bg-[#ebf4fe] h-[38px] relative shrink-0 w-full z-[6]" data-name="表头">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-[0_-0.5px_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[10px] relative size-full">
          <p className="font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[18px] leading-[20px] not-italic overflow-hidden relative shrink-0 text-[#626c78] text-[12px] text-ellipsis w-full whitespace-nowrap">16:00</p>
        </div>
      </div>
    </div>
  );
}

function Component98() {
  return (
    <div className="h-[48px] relative shrink-0 w-full z-[5]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-[0_-0.5px_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center p-[2px] relative size-full">
          <div className="bg-[#b6e9c7] flex-[1_0_0] min-h-px min-w-px w-full" />
        </div>
      </div>
    </div>
  );
}

function Component99() {
  return (
    <div className="h-[48px] relative shrink-0 w-full z-[4]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-[0_-0.5px_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center p-[2px] relative size-full">
          <div className="bg-[#b6e9c7] flex-[1_0_0] min-h-px min-w-px w-full" />
        </div>
      </div>
    </div>
  );
}

function Component100() {
  return (
    <div className="h-[48px] relative shrink-0 w-full z-[3]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-[0_-0.5px_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center p-[2px] relative size-full">
          <div className="bg-[#b6e9c7] flex-[1_0_0] min-h-px min-w-px w-full" />
        </div>
      </div>
    </div>
  );
}

function Component101() {
  return (
    <div className="h-[48px] relative shrink-0 w-full z-[2]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-[0_-0.5px_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center p-[2px] relative size-full">
          <div className="bg-[#7ee2f0] flex-[1_0_0] min-h-px min-w-px w-full" />
        </div>
      </div>
    </div>
  );
}

function Component102() {
  return (
    <div className="h-[48px] relative shrink-0 w-full z-[1]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-[0_-0.5px_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center p-[2px] relative size-full">
          <div className="bg-[#b6e9c7] flex-[1_0_0] min-h-px min-w-px w-full" />
        </div>
      </div>
    </div>
  );
}

function Component103() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col isolate items-start min-h-px min-w-px overflow-clip relative" data-name="列内容">
      <Component97 />
      <Component98 />
      <Component99 />
      <Component100 />
      <Component101 />
      <Component102 />
    </div>
  );
}

function Component104() {
  return (
    <div className="content-stretch flex flex-[1_0_0] items-start min-h-px min-w-px relative" data-name="列">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-r border-solid inset-[0_-1px_0_0] pointer-events-none" />
      <Component103 />
    </div>
  );
}

function Component105() {
  return (
    <div className="bg-[#ebf4fe] h-[38px] relative shrink-0 w-full z-[6]" data-name="表头">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-[0_-0.5px_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[10px] relative size-full">
          <p className="font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[18px] leading-[20px] not-italic overflow-hidden relative shrink-0 text-[#626c78] text-[12px] text-ellipsis w-full whitespace-nowrap">17:00</p>
        </div>
      </div>
    </div>
  );
}

function Component106() {
  return (
    <div className="h-[48px] relative shrink-0 w-full z-[5]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-[0_-0.5px_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center p-[2px] relative size-full">
          <div className="bg-[#b6e9c7] flex-[1_0_0] min-h-px min-w-px w-full" />
        </div>
      </div>
    </div>
  );
}

function Component107() {
  return (
    <div className="h-[48px] relative shrink-0 w-full z-[4]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-[0_-0.5px_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center p-[2px] relative size-full">
          <div className="bg-[#b6e9c7] flex-[1_0_0] min-h-px min-w-px w-full" />
        </div>
      </div>
    </div>
  );
}

function Component108() {
  return (
    <div className="h-[48px] relative shrink-0 w-full z-[3]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-[0_-0.5px_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center p-[2px] relative size-full">
          <div className="bg-[#b6e9c7] flex-[1_0_0] min-h-px min-w-px w-full" />
        </div>
      </div>
    </div>
  );
}

function Component109() {
  return (
    <div className="h-[48px] relative shrink-0 w-full z-[2]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-[0_-0.5px_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center p-[2px] relative size-full">
          <div className="bg-[#b6e9c7] flex-[1_0_0] min-h-px min-w-px w-full" />
        </div>
      </div>
    </div>
  );
}

function Component110() {
  return (
    <div className="h-[48px] relative shrink-0 w-full z-[1]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-[0_-0.5px_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center p-[2px] relative size-full">
          <div className="bg-[#b6e9c7] flex-[1_0_0] min-h-px min-w-px w-full" />
        </div>
      </div>
    </div>
  );
}

function Component111() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col isolate items-start min-h-px min-w-px overflow-clip relative" data-name="列内容">
      <Component105 />
      <Component106 />
      <Component107 />
      <Component108 />
      <Component109 />
      <Component110 />
    </div>
  );
}

function Component112() {
  return (
    <div className="content-stretch flex flex-[1_0_0] items-start min-h-px min-w-px relative" data-name="列">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-r border-solid inset-[0_-1px_0_0] pointer-events-none" />
      <Component111 />
    </div>
  );
}

function Component113() {
  return (
    <div className="bg-[#ebf4fe] h-[38px] relative shrink-0 w-full z-[6]" data-name="表头">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-[0_-0.5px_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[10px] relative size-full">
          <p className="font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[18px] leading-[20px] not-italic overflow-hidden relative shrink-0 text-[#626c78] text-[12px] text-ellipsis w-full whitespace-nowrap">18:00</p>
        </div>
      </div>
    </div>
  );
}

function Component114() {
  return (
    <div className="h-[48px] relative shrink-0 w-full z-[5]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-[0_-0.5px_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center p-[2px] relative size-full">
          <div className="bg-[#b6e9c7] flex-[1_0_0] min-h-px min-w-px w-full" />
        </div>
      </div>
    </div>
  );
}

function Component115() {
  return (
    <div className="h-[48px] relative shrink-0 w-full z-[4]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-[0_-0.5px_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center p-[2px] relative size-full">
          <div className="bg-[#b6e9c7] flex-[1_0_0] min-h-px min-w-px w-full" />
        </div>
      </div>
    </div>
  );
}

function Component116() {
  return (
    <div className="h-[48px] relative shrink-0 w-full z-[3]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-[0_-0.5px_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center p-[2px] relative size-full">
          <div className="bg-[#b6e9c7] flex-[1_0_0] min-h-px min-w-px w-full" />
        </div>
      </div>
    </div>
  );
}

function Component117() {
  return (
    <div className="h-[48px] relative shrink-0 w-full z-[2]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-[0_-0.5px_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center p-[2px] relative size-full">
          <div className="bg-[#72acf3] flex-[1_0_0] min-h-px min-w-px w-full" />
        </div>
      </div>
    </div>
  );
}

function Component118() {
  return (
    <div className="h-[48px] relative shrink-0 w-full z-[1]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-[0_-0.5px_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center p-[2px] relative size-full">
          <div className="bg-[#b6e9c7] flex-[1_0_0] min-h-px min-w-px w-full" />
        </div>
      </div>
    </div>
  );
}

function Component119() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col isolate items-start min-h-px min-w-px overflow-clip relative" data-name="列内容">
      <Component113 />
      <Component114 />
      <Component115 />
      <Component116 />
      <Component117 />
      <Component118 />
    </div>
  );
}

function Component120() {
  return (
    <div className="content-stretch flex flex-[1_0_0] items-start min-h-px min-w-px relative" data-name="列">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-r border-solid inset-[0_-1px_0_0] pointer-events-none" />
      <Component119 />
    </div>
  );
}

function Component121() {
  return (
    <div className="bg-[#ebf4fe] h-[38px] relative shrink-0 w-full z-[6]" data-name="表头">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-[0_-0.5px_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[10px] relative size-full">
          <p className="font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[18px] leading-[20px] not-italic overflow-hidden relative shrink-0 text-[#626c78] text-[12px] text-ellipsis w-full whitespace-nowrap">19:00</p>
        </div>
      </div>
    </div>
  );
}

function Component122() {
  return (
    <div className="h-[48px] relative shrink-0 w-full z-[5]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-[0_-0.5px_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center p-[2px] relative size-full">
          <div className="bg-[#b6e9c7] flex-[1_0_0] min-h-px min-w-px w-full" />
        </div>
      </div>
    </div>
  );
}

function Component123() {
  return (
    <div className="h-[48px] relative shrink-0 w-full z-[4]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-[0_-0.5px_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center p-[2px] relative size-full">
          <div className="bg-[#b6e9c7] flex-[1_0_0] min-h-px min-w-px w-full" />
        </div>
      </div>
    </div>
  );
}

function Component124() {
  return (
    <div className="h-[48px] relative shrink-0 w-full z-[3]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-[0_-0.5px_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center p-[2px] relative size-full">
          <div className="bg-[#b6e9c7] flex-[1_0_0] min-h-px min-w-px w-full" />
        </div>
      </div>
    </div>
  );
}

function Component125() {
  return (
    <div className="h-[48px] relative shrink-0 w-full z-[2]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-[0_-0.5px_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center p-[2px] relative size-full">
          <div className="bg-[#b6e9c7] flex-[1_0_0] min-h-px min-w-px w-full" />
        </div>
      </div>
    </div>
  );
}

function Component126() {
  return (
    <div className="h-[48px] relative shrink-0 w-full z-[1]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-[0_-0.5px_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center p-[2px] relative size-full">
          <div className="bg-[#b6e9c7] flex-[1_0_0] min-h-px min-w-px w-full" />
        </div>
      </div>
    </div>
  );
}

function Component127() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col isolate items-start min-h-px min-w-px overflow-clip relative" data-name="列内容">
      <Component121 />
      <Component122 />
      <Component123 />
      <Component124 />
      <Component125 />
      <Component126 />
    </div>
  );
}

function Component128() {
  return (
    <div className="content-stretch flex flex-[1_0_0] items-start min-h-px min-w-px relative" data-name="列">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-r border-solid inset-[0_-1px_0_0] pointer-events-none" />
      <Component127 />
    </div>
  );
}

function Component129() {
  return (
    <div className="bg-[#ebf4fe] h-[38px] relative shrink-0 w-full z-[6]" data-name="表头">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-[0_-0.5px_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center pl-[16px] pr-[12px] py-[10px] relative size-full">
          <p className="font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[18px] leading-[20px] not-italic overflow-hidden relative shrink-0 text-[#626c78] text-[12px] text-ellipsis w-full whitespace-nowrap">20:00</p>
        </div>
      </div>
    </div>
  );
}

function Component130() {
  return (
    <div className="h-[48px] relative shrink-0 w-full z-[5]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-[0_-0.5px_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center p-[2px] relative size-full">
          <div className="bg-[#b6e9c7] flex-[1_0_0] min-h-px min-w-px w-full" />
        </div>
      </div>
    </div>
  );
}

function Component131() {
  return (
    <div className="h-[48px] relative shrink-0 w-full z-[4]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-[0_-0.5px_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center p-[2px] relative size-full">
          <div className="bg-[#b6e9c7] flex-[1_0_0] min-h-px min-w-px w-full" />
        </div>
      </div>
    </div>
  );
}

function Component132() {
  return (
    <div className="h-[48px] relative shrink-0 w-full z-[3]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-[0_-0.5px_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center p-[2px] relative size-full">
          <div className="bg-[#b6e9c7] flex-[1_0_0] min-h-px min-w-px w-full" />
        </div>
      </div>
    </div>
  );
}

function Component133() {
  return (
    <div className="h-[48px] relative shrink-0 w-full z-[2]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-[0_-0.5px_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center p-[2px] relative size-full">
          <div className="bg-[#b6e9c7] flex-[1_0_0] min-h-px min-w-px w-full" />
        </div>
      </div>
    </div>
  );
}

function Component134() {
  return (
    <div className="h-[48px] relative shrink-0 w-full z-[1]" data-name="单元格">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-b border-r border-solid inset-[0_-0.5px_-0.5px_0] pointer-events-none" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center p-[2px] relative size-full">
          <div className="bg-[#b6e9c7] flex-[1_0_0] min-h-px min-w-px w-full" />
        </div>
      </div>
    </div>
  );
}

function Component135() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col isolate items-start min-h-px min-w-px overflow-clip relative" data-name="列内容">
      <Component129 />
      <Component130 />
      <Component131 />
      <Component132 />
      <Component133 />
      <Component134 />
    </div>
  );
}

function Component136() {
  return (
    <div className="content-stretch flex flex-[1_0_0] items-start min-h-px min-w-px relative" data-name="列">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-r border-solid inset-[0_-1px_0_0] pointer-events-none" />
      <Component135 />
    </div>
  );
}

function Frame68() {
  return (
    <div className="content-stretch flex flex-[1_0_0] items-center min-h-px min-w-px relative z-[1]">
      <Component48 />
      <Component56 />
      <Component64 />
      <Component72 />
      <Component80 />
      <Component88 />
      <Component96 />
      <Component104 />
      <Component112 />
      <Component120 />
      <Component128 />
      <Component136 />
    </div>
  );
}

function Frame50() {
  return (
    <div className="content-stretch flex isolate items-start relative shrink-0 w-full">
      <div aria-hidden="true" className="absolute border-[#e1e5eb] border-[0.5px] border-solid inset-[-0.5px] pointer-events-none" />
      <Component27 />
      <Component40 />
      <Frame68 />
    </div>
  );
}

function Frame67() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full z-[1]">
      <Frame50 />
    </div>
  );
}

function Component153() {
  return (
    <div className="bg-white relative rounded-[8px] shrink-0 w-full" data-name="Component 390">
      <div aria-hidden="true" className="absolute border border-solid border-white inset-0 pointer-events-none rounded-[8px] shadow-[0px_4px_20px_0px_rgba(0,0,0,0.04)]" />
      <div className="content-stretch flex flex-col gap-[6px] isolate items-start px-[12px] py-[16px] relative w-full">
        <Frame64 />
        <Frame67 />
      </div>
    </div>
  );
}

function Frame60() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
      <Component153 />
    </div>
  );
}

function Frame61() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
      <Frame60 />
    </div>
  );
}

function Frame25() {
  return (
    <div className="bg-[rgba(255,255,255,0.5)] content-stretch flex flex-col gap-[12px] items-start p-[16px] relative rounded-[8px] shrink-0 w-[1200px]">
      <div aria-hidden="true" className="absolute border border-solid border-white inset-0 pointer-events-none rounded-[8px] shadow-[0px_4px_20px_0px_rgba(0,0,0,0.04)]" />
      <Frame2 />
      <p className="font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[22px] min-w-full not-italic relative shrink-0 text-[#626c78] text-[0px] text-[14px] w-[min-content] whitespace-pre-wrap">
        <span>{`管理了 `}</span>
        <span className="font-['Microsoft_YaHei_UI:Bold',sans-serif]">50</span>
        <span>{` 个空间的温度数据，整体温度达标率为 `}</span>
        <span className="font-['Microsoft_YaHei_UI:Bold',sans-serif]">96.5%</span>
        <span>{`；其中 `}</span>
        <span className="font-['Microsoft_YaHei_UI:Bold',sans-serif] text-[#246fe5]">40</span>
        <span>{` 个空间出现过冷、`}</span>
        <span className="font-['Microsoft_YaHei_UI:Bold',sans-serif] text-[#246fe5]">17</span>
        <span>{` 个空间出现持续偏冷、`}</span>
        <span className="font-['Microsoft_YaHei_UI:Bold',sans-serif] text-[#246fe5]">15</span>
        <span>{` 个空间出现持续偏热、`}</span>
        <span className="font-['Microsoft_YaHei_UI:Bold',sans-serif] text-[#246fe5]">16</span>
        <span>{` 个空间出现过热。其中持续偏热时间最长的空间为 `}</span>
        <span className="font-['Microsoft_YaHei_UI:Bold',sans-serif] text-[#246fe5]">制冷间#1</span>
        <span>{`，过热最严重的空间（与过热门限相比偏离最远）为 `}</span>
        <span className="font-['Microsoft_YaHei_UI:Bold',sans-serif] text-[#246fe5]">强电间#1</span>
      </p>
      <Frame61 />
    </div>
  );
}

function Frame3() {
  return (
    <div className="content-stretch flex flex-col isolate items-start pb-[12px] pt-0 px-0 relative shrink-0">
      <p className="font-['Microsoft_YaHei_UI:Bold',sans-serif] leading-[28px] not-italic relative shrink-0 text-[#2e3742] text-[20px] whitespace-pre z-[2]">冷站系统运行</p>
      <div className="bg-[rgba(0,148,255,0.2)] h-[12px] mb-[-12px] shrink-0 w-full z-[1]" />
    </div>
  );
}

function Frame59() {
  return (
    <div className="relative rounded-[4px] shrink-0 w-full">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[4px] size-full" src={imgFrame1937107242} />
      <div className="content-stretch flex flex-col items-start px-[12px] py-[8px] relative w-full">
        <p className="font-['Microsoft_YaHei_UI:Bold',sans-serif] leading-[22px] not-italic relative shrink-0 text-[#2e3742] text-[16px] whitespace-pre">大商业冷站</p>
      </div>
    </div>
  );
}

function Frame53() {
  return (
    <div className="content-stretch flex h-[24px] items-center justify-center relative shrink-0">
      <p className="font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[22px] not-italic relative shrink-0 text-[#626c78] text-[14px] whitespace-pre">冷站当日未运行</p>
    </div>
  );
}

function Frame30() {
  return (
    <div className="bg-white relative rounded-[8px] shrink-0 w-full">
      <div aria-hidden="true" className="absolute border border-solid border-white inset-0 pointer-events-none rounded-[8px]" />
      <div className="content-stretch flex flex-col items-start px-[12px] py-[16px] relative w-full">
        <Frame53 />
      </div>
    </div>
  );
}

function Frame26() {
  return (
    <div className="bg-[rgba(255,255,255,0.5)] content-stretch flex flex-col gap-[12px] items-start p-[16px] relative rounded-[8px] shrink-0 w-[1200px]">
      <div aria-hidden="true" className="absolute border border-solid border-white inset-0 pointer-events-none rounded-[8px] shadow-[0px_4px_20px_0px_rgba(0,0,0,0.04)]" />
      <Frame3 />
      <Frame59 />
      <Frame30 />
    </div>
  );
}

function Frame27() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full">
      <Component10 />
      <Frame24 />
      <Frame25 />
      <Frame26 />
    </div>
  );
}

function Frame28() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-[1200px]">
      <Frame7 />
      <Frame27 />
    </div>
  );
}

function Component137() {
  return (
    <div className="content-stretch flex flex-col h-[700px] items-start px-0 py-[40px] relative shrink-0 w-[1200px] z-[2]" data-name="内容">
      <Frame28 />
    </div>
  );
}

function Component138() {
  return <div className="bg-[#246fe5] h-[18px] shrink-0 w-[2px]" data-name="选中条" />;
}

function Component139() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative rounded-[4px]" data-name="内容">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center px-[12px] py-[8px] relative w-full">
          <p className="flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#246fe5] text-[14px] text-ellipsis whitespace-nowrap">运行概述</p>
        </div>
      </div>
    </div>
  );
}

function Component1Level() {
  return (
    <div className="content-stretch flex gap-[3px] items-center relative shrink-0 w-[128px]" data-name="_基础组件/1&Level">
      <Component138 />
      <Component139 />
    </div>
  );
}

function Component140() {
  return <div className="h-[18px] shrink-0 w-[2px]" data-name="选中条" />;
}

function Component141() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative rounded-[4px]" data-name="内容">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center px-[12px] py-[8px] relative w-full">
          <p className="flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#626c78] text-[14px] text-ellipsis whitespace-nowrap">环境品质</p>
        </div>
      </div>
    </div>
  );
}

function Component1Level1() {
  return (
    <div className="content-stretch flex gap-[3px] items-center relative shrink-0 w-full" data-name="_基础组件/1&Level">
      <Component140 />
      <Component141 />
    </div>
  );
}

function Component1Level2() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-[128px]" data-name="_基础组件/1&Level">
      <Component1Level1 />
    </div>
  );
}

function Component142() {
  return <div className="h-[18px] shrink-0 w-[2px]" data-name="选中条" />;
}

function Component143() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative rounded-[4px]" data-name="内容">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center px-[12px] py-[8px] relative w-full">
          <p className="flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#626c78] text-[14px] text-ellipsis whitespace-nowrap">能效分析</p>
        </div>
      </div>
    </div>
  );
}

function Component1Level3() {
  return (
    <div className="content-stretch flex gap-[3px] items-center relative shrink-0 w-full" data-name="_基础组件/1&Level">
      <Component142 />
      <Component143 />
    </div>
  );
}

function Component144() {
  return <div className="h-[18px] shrink-0 w-[2px]" data-name="选中条" />;
}

function Component145() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative rounded-[4px]" data-name="内容">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center pl-[26px] pr-[12px] py-[8px] relative w-full">
          <p className="flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#626c78] text-[14px] text-ellipsis whitespace-nowrap">冷站系统</p>
        </div>
      </div>
    </div>
  );
}

function Component2Level() {
  return (
    <div className="content-stretch flex gap-[3px] items-center relative shrink-0 w-full" data-name="_基础组件/2&Level">
      <Component144 />
      <Component145 />
    </div>
  );
}

function Component1Level4() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-[128px]" data-name="_基础组件/1&Level">
      <Component1Level3 />
      <Component2Level />
    </div>
  );
}

function Component146() {
  return <div className="h-[18px] shrink-0 w-[2px]" data-name="选中条" />;
}

function Component147() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative rounded-[4px]" data-name="内容">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center px-[12px] py-[8px] relative w-full">
          <p className="flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#626c78] text-[14px] text-ellipsis whitespace-nowrap">系统调节</p>
        </div>
      </div>
    </div>
  );
}

function Component1Level5() {
  return (
    <div className="content-stretch flex gap-[3px] items-center relative shrink-0 w-full" data-name="_基础组件/1&Level">
      <Component146 />
      <Component147 />
    </div>
  );
}

function Component148() {
  return <div className="h-[18px] shrink-0 w-[2px]" data-name="选中条" />;
}

function Component149() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative rounded-[4px]" data-name="内容">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center pl-[26px] pr-[12px] py-[8px] relative w-full">
          <p className="flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#626c78] text-[14px] text-ellipsis whitespace-nowrap">冷站系统</p>
        </div>
      </div>
    </div>
  );
}

function Component2Level1() {
  return (
    <div className="content-stretch flex gap-[3px] items-center relative shrink-0 w-full" data-name="_基础组件/2&Level">
      <Component148 />
      <Component149 />
    </div>
  );
}

function Component150() {
  return <div className="h-[18px] shrink-0 w-[2px]" data-name="选中条" />;
}

function Component151() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative rounded-[4px]" data-name="内容">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center pl-[26px] pr-[12px] py-[8px] relative w-full">
          <p className="flex-[1_0_0] font-['Microsoft_YaHei_UI:Regular',sans-serif] h-[22px] leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[#626c78] text-[14px] text-ellipsis whitespace-nowrap">空调系统</p>
        </div>
      </div>
    </div>
  );
}

function Component2Level2() {
  return (
    <div className="content-stretch flex gap-[3px] items-center relative shrink-0 w-full" data-name="_基础组件/2&Level">
      <Component150 />
      <Component151 />
    </div>
  );
}

function Component1Level6() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-[128px]" data-name="_基础组件/1&Level">
      <Component1Level5 />
      <Component2Level1 />
      <Component2Level2 />
    </div>
  );
}

function Component1Level7() {
  return <div className="content-stretch flex flex-col gap-[4px] items-start shrink-0 w-[128px]" data-name="_基础组件/1&Level" />;
}

function Anchor() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[1420px] opacity-0 top-[39.05px] w-[117px] z-[1]" data-name="锚点&Anchor">
      <div aria-hidden="true" className="absolute border-[#e8ecf0] border-l border-solid inset-0 pointer-events-none" />
      <Component1Level />
      <Component1Level2 />
      <Component1Level4 />
      <Component1Level6 />
      <Component1Level7 />
    </div>
  );
}

function Component152() {
  return (
    <div className="flex-[1_0_0] h-[11323px] min-h-px min-w-px relative" data-name="内容表格">
      <div className="flex flex-col items-center size-full">
        <div className="content-stretch flex flex-col isolate items-center px-[16px] py-0 relative size-full">
          <Component137 />
          <Anchor />
        </div>
      </div>
    </div>
  );
}

function Frame16() {
  return (
    <div className="content-stretch flex h-[12209px] items-start justify-center relative shrink-0 w-full z-[2]">
      <Component152 />
    </div>
  );
}

function Group() {
  return <div className="absolute bottom-full contents left-0 right-full top-0" />;
}

function Group2() {
  return (
    <div className="absolute contents left-0 top-0">
      <Group />
    </div>
  );
}

function Objects() {
  return (
    <div className="h-[1221.141px] relative w-[462.192px]" data-name="objects">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 462.192 1221.14">
        <g id="objects" opacity="0.4">
          <path d={svgPaths.pddb9f00} fill="url(#paint0_linear_1_10972)" id="Vector" />
          <path d={svgPaths.pd10200} fill="url(#paint1_linear_1_10972)" id="Vector_2" />
          <path d={svgPaths.p191e8180} fill="url(#paint2_linear_1_10972)" id="Vector_3" />
          <path d={svgPaths.p7ac7e00} fill="url(#paint3_linear_1_10972)" id="Vector_4" />
          <path d={svgPaths.p31a19c80} fill="url(#paint4_linear_1_10972)" id="Vector_5" />
          <path d={svgPaths.p289be500} fill="url(#paint5_linear_1_10972)" id="Vector_6" />
          <path d={svgPaths.p1bfaa580} fill="url(#paint6_linear_1_10972)" id="Vector_7" />
          <path d={svgPaths.p8129280} fill="url(#paint7_linear_1_10972)" id="Vector_8" />
          <path d={svgPaths.p1cf80980} fill="url(#paint8_linear_1_10972)" id="Vector_9" />
          <path d={svgPaths.p13d56c00} fill="url(#paint9_linear_1_10972)" id="Vector_10" />
          <path d={svgPaths.p2e4dd100} fill="url(#paint10_linear_1_10972)" id="Vector_11" />
          <path d={svgPaths.p2e83ae00} fill="url(#paint11_linear_1_10972)" id="Vector_12" />
          <path d={svgPaths.p81f7d00} fill="url(#paint12_linear_1_10972)" id="Vector_13" />
          <path d={svgPaths.p34731300} fill="url(#paint13_linear_1_10972)" id="Vector_14" />
          <path d={svgPaths.p2ada2b00} fill="url(#paint14_linear_1_10972)" id="Vector_15" />
          <path d={svgPaths.p39810e80} fill="url(#paint15_linear_1_10972)" id="Vector_16" />
          <path d={svgPaths.p10575d00} fill="url(#paint16_linear_1_10972)" id="Vector_17" />
          <path d={svgPaths.pc30af00} fill="url(#paint17_linear_1_10972)" id="Vector_18" />
          <path d={svgPaths.p2b0db80} fill="url(#paint18_linear_1_10972)" id="Vector_19" />
          <path d={svgPaths.p24b64d00} fill="url(#paint19_linear_1_10972)" id="Vector_20" />
          <path d={svgPaths.p1ba7ee70} fill="url(#paint20_linear_1_10972)" id="Vector_21" />
          <path d={svgPaths.p18d42d80} fill="url(#paint21_linear_1_10972)" id="Vector_22" />
          <path d={svgPaths.p106ea100} fill="url(#paint22_linear_1_10972)" id="Vector_23" />
          <path d={svgPaths.p19026c00} fill="url(#paint23_linear_1_10972)" id="Vector_24" />
          <path d={svgPaths.p2b9c9600} fill="url(#paint24_linear_1_10972)" id="Vector_25" />
          <path d={svgPaths.p159e9600} fill="url(#paint25_linear_1_10972)" id="Vector_26" />
          <path d={svgPaths.p23199300} fill="url(#paint26_linear_1_10972)" id="Vector_27" />
          <path d={svgPaths.p19f99df0} fill="url(#paint27_linear_1_10972)" id="Vector_28" />
          <path d={svgPaths.p2f1acb00} fill="url(#paint28_linear_1_10972)" id="Vector_29" />
          <path d={svgPaths.p305df380} fill="url(#paint29_linear_1_10972)" id="Vector_30" />
          <path d={svgPaths.p56e7f00} fill="url(#paint30_linear_1_10972)" id="Vector_31" />
          <path d={svgPaths.p12fb8780} fill="url(#paint31_linear_1_10972)" id="Vector_32" />
          <path d={svgPaths.p17035800} fill="url(#paint32_linear_1_10972)" id="Vector_33" />
          <path d={svgPaths.p1b257600} fill="url(#paint33_linear_1_10972)" id="Vector_34" />
          <path d={svgPaths.p3dd23980} fill="url(#paint34_linear_1_10972)" id="Vector_35" />
          <path d={svgPaths.p2da400} fill="url(#paint35_linear_1_10972)" id="Vector_36" />
          <path d={svgPaths.p23556a00} fill="url(#paint36_linear_1_10972)" id="Vector_37" />
          <path d={svgPaths.p2bd92dc0} fill="url(#paint37_linear_1_10972)" id="Vector_38" />
          <path d={svgPaths.p3af20700} fill="url(#paint38_linear_1_10972)" id="Vector_39" />
          <path d={svgPaths.p377e3580} fill="url(#paint39_linear_1_10972)" id="Vector_40" />
          <path d={svgPaths.p176d5a00} fill="url(#paint40_linear_1_10972)" id="Vector_41" />
          <path d={svgPaths.p31ef5300} fill="url(#paint41_linear_1_10972)" id="Vector_42" />
          <path d={svgPaths.p20059600} fill="url(#paint42_linear_1_10972)" id="Vector_43" />
          <path d={svgPaths.p2cede200} fill="url(#paint43_linear_1_10972)" id="Vector_44" />
          <path d={svgPaths.p90a2600} fill="url(#paint44_linear_1_10972)" id="Vector_45" />
          <path d={svgPaths.p18c8dc00} fill="url(#paint45_linear_1_10972)" id="Vector_46" />
          <path d={svgPaths.p7fb000} fill="url(#paint46_linear_1_10972)" id="Vector_47" />
          <path d={svgPaths.p1f39d100} fill="url(#paint47_linear_1_10972)" id="Vector_48" />
          <path d={svgPaths.p323400e0} fill="url(#paint48_linear_1_10972)" id="Vector_49" />
          <path d={svgPaths.p3608d000} fill="url(#paint49_linear_1_10972)" id="Vector_50" />
          <path d={svgPaths.p115ee0f0} fill="url(#paint50_linear_1_10972)" id="Vector_51" />
          <path d={svgPaths.p1836a100} fill="url(#paint51_linear_1_10972)" id="Vector_52" />
          <path d={svgPaths.p1e90ed80} fill="url(#paint52_linear_1_10972)" id="Vector_53" />
          <path d={svgPaths.pae65d00} fill="url(#paint53_linear_1_10972)" id="Vector_54" />
          <path d={svgPaths.p2b7ef500} fill="url(#paint54_linear_1_10972)" id="Vector_55" />
          <path d={svgPaths.p3091d800} fill="url(#paint55_linear_1_10972)" id="Vector_56" />
          <path d={svgPaths.p33033a80} fill="url(#paint56_linear_1_10972)" id="Vector_57" />
          <path d={svgPaths.p33782d00} fill="url(#paint57_linear_1_10972)" id="Vector_58" />
          <path d={svgPaths.p3d45b400} fill="url(#paint58_linear_1_10972)" id="Vector_59" />
          <path d={svgPaths.p1c6c3c40} fill="url(#paint59_linear_1_10972)" id="Vector_60" />
          <path d={svgPaths.p4102b00} fill="url(#paint60_linear_1_10972)" id="Vector_61" />
          <path d={svgPaths.p2ce21300} fill="url(#paint61_linear_1_10972)" id="Vector_62" />
          <path d={svgPaths.p1c965570} fill="url(#paint62_linear_1_10972)" id="Vector_63" />
          <path d={svgPaths.p3cc48900} fill="url(#paint63_linear_1_10972)" id="Vector_64" />
          <path d={svgPaths.p17f5eb80} fill="url(#paint64_linear_1_10972)" id="Vector_65" />
          <path d={svgPaths.p3bd7180} fill="url(#paint65_linear_1_10972)" id="Vector_66" />
          <path d={svgPaths.p29c3c500} fill="url(#paint66_linear_1_10972)" id="Vector_67" />
          <path d={svgPaths.p8691100} fill="url(#paint67_linear_1_10972)" id="Vector_68" />
          <path d={svgPaths.p37961c00} fill="url(#paint68_linear_1_10972)" id="Vector_69" />
          <path d={svgPaths.pad0c380} fill="url(#paint69_linear_1_10972)" id="Vector_70" />
          <path d={svgPaths.p280fcf00} fill="url(#paint70_linear_1_10972)" id="Vector_71" />
          <path d={svgPaths.p1724d600} fill="url(#paint71_linear_1_10972)" id="Vector_72" />
          <path d={svgPaths.p2c7ce940} fill="url(#paint72_linear_1_10972)" id="Vector_73" />
        </g>
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_1_10972" x1="386.293" x2="386.293" y1="8.10936" y2="1213.58">
            <stop offset="0.479167" stopColor="#246FE5" />
            <stop offset="1" stopColor="#24E5AB" stopOpacity="0.49" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint1_linear_1_10972" x1="383.486" x2="383.486" y1="7.98827" y2="1213.43">
            <stop offset="0.479167" stopColor="#246FE5" />
            <stop offset="1" stopColor="#24E5AB" stopOpacity="0.49" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint2_linear_1_10972" x1="381.084" x2="381.084" y1="7.85155" y2="1213.33">
            <stop offset="0.479167" stopColor="#246FE5" />
            <stop offset="1" stopColor="#24E5AB" stopOpacity="0.49" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint3_linear_1_10972" x1="378.983" x2="378.983" y1="7.73046" y2="1213.23">
            <stop offset="0.479167" stopColor="#246FE5" />
            <stop offset="1" stopColor="#24E5AB" stopOpacity="0.49" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint4_linear_1_10972" x1="376.927" x2="376.927" y1="7.59374" y2="1213.11">
            <stop offset="0.479167" stopColor="#246FE5" />
            <stop offset="1" stopColor="#24E5AB" stopOpacity="0.49" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint5_linear_1_10972" x1="374.962" x2="374.962" y1="7.4414" y2="1213.06">
            <stop offset="0.479167" stopColor="#246FE5" />
            <stop offset="1" stopColor="#24E5AB" stopOpacity="0.49" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint6_linear_1_10972" x1="372.965" x2="372.965" y1="7.3496" y2="1213">
            <stop offset="0.479167" stopColor="#246FE5" />
            <stop offset="1" stopColor="#24E5AB" stopOpacity="0.49" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint7_linear_1_10972" x1="370.952" x2="370.952" y1="7.21288" y2="1212.85">
            <stop offset="0.479167" stopColor="#246FE5" />
            <stop offset="1" stopColor="#24E5AB" stopOpacity="0.49" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint8_linear_1_10972" x1="368.89" x2="368.89" y1="7.09201" y2="1212.64">
            <stop offset="0.479167" stopColor="#246FE5" />
            <stop offset="1" stopColor="#24E5AB" stopOpacity="0.49" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint9_linear_1_10972" x1="366.873" x2="366.873" y1="6.95531" y2="1212.53">
            <stop offset="0.479167" stopColor="#246FE5" />
            <stop offset="1" stopColor="#24E5AB" stopOpacity="0.49" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint10_linear_1_10972" x1="364.76" x2="364.76" y1="6.83398" y2="1212.55">
            <stop offset="0.479167" stopColor="#246FE5" />
            <stop offset="1" stopColor="#24E5AB" stopOpacity="0.49" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint11_linear_1_10972" x1="362.702" x2="362.702" y1="6.69708" y2="1212.41">
            <stop offset="0.479167" stopColor="#246FE5" />
            <stop offset="1" stopColor="#24E5AB" stopOpacity="0.49" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint12_linear_1_10972" x1="360.588" x2="360.588" y1="6.57421" y2="1212.33">
            <stop offset="0.479167" stopColor="#246FE5" />
            <stop offset="1" stopColor="#24E5AB" stopOpacity="0.49" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint13_linear_1_10972" x1="358.527" x2="358.527" y1="6.45312" y2="1212.35">
            <stop offset="0.479167" stopColor="#246FE5" />
            <stop offset="1" stopColor="#24E5AB" stopOpacity="0.49" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint14_linear_1_10972" x1="356.458" x2="356.458" y1="6.3164" y2="1212.22">
            <stop offset="0.479167" stopColor="#246FE5" />
            <stop offset="1" stopColor="#24E5AB" stopOpacity="0.49" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint15_linear_1_10972" x1="354.321" x2="354.321" y1="6.19726" y2="1212.23">
            <stop offset="0.479167" stopColor="#246FE5" />
            <stop offset="1" stopColor="#24E5AB" stopOpacity="0.49" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint16_linear_1_10972" x1="352.209" x2="352.209" y1="6.05859" y2="1211.98">
            <stop offset="0.479167" stopColor="#246FE5" />
            <stop offset="1" stopColor="#24E5AB" stopOpacity="0.49" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint17_linear_1_10972" x1="350.09" x2="350.09" y1="5.92187" y2="1211.83">
            <stop offset="0.479167" stopColor="#246FE5" />
            <stop offset="1" stopColor="#24E5AB" stopOpacity="0.49" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint18_linear_1_10972" x1="348.063" x2="348.063" y1="5.80078" y2="1211.6">
            <stop offset="0.479167" stopColor="#246FE5" />
            <stop offset="1" stopColor="#24E5AB" stopOpacity="0.49" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint19_linear_1_10972" x1="343.056" x2="343.056" y1="5.48242" y2="1211.77">
            <stop offset="0.479167" stopColor="#246FE5" />
            <stop offset="1" stopColor="#24E5AB" stopOpacity="0.49" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint20_linear_1_10972" x1="338.118" x2="338.118" y1="5.16211" y2="1212.22">
            <stop offset="0.479167" stopColor="#246FE5" />
            <stop offset="1" stopColor="#24E5AB" stopOpacity="0.49" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint21_linear_1_10972" x1="333.161" x2="333.161" y1="4.84375" y2="1211.94">
            <stop offset="0.479167" stopColor="#246FE5" />
            <stop offset="1" stopColor="#24E5AB" stopOpacity="0.49" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint22_linear_1_10972" x1="328.247" x2="328.247" y1="4.52539" y2="1212.18">
            <stop offset="0.479167" stopColor="#246FE5" />
            <stop offset="1" stopColor="#24E5AB" stopOpacity="0.49" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint23_linear_1_10972" x1="323.307" x2="323.307" y1="4.19336" y2="1212.27">
            <stop offset="0.479167" stopColor="#246FE5" />
            <stop offset="1" stopColor="#24E5AB" stopOpacity="0.49" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint24_linear_1_10972" x1="318.354" x2="318.354" y1="3.87109" y2="1212.25">
            <stop offset="0.479167" stopColor="#246FE5" />
            <stop offset="1" stopColor="#24E5AB" stopOpacity="0.49" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint25_linear_1_10972" x1="313.422" x2="313.422" y1="3.55492" y2="1212.39">
            <stop offset="0.479167" stopColor="#246FE5" />
            <stop offset="1" stopColor="#24E5AB" stopOpacity="0.49" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint26_linear_1_10972" x1="308.479" x2="308.479" y1="3.23633" y2="1212.55">
            <stop offset="0.479167" stopColor="#246FE5" />
            <stop offset="1" stopColor="#24E5AB" stopOpacity="0.49" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint27_linear_1_10972" x1="305.135" x2="305.135" y1="2.88672" y2="1212.5">
            <stop offset="0.479167" stopColor="#246FE5" />
            <stop offset="1" stopColor="#24E5AB" stopOpacity="0.49" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint28_linear_1_10972" x1="307.576" x2="307.576" y1="2.58203" y2="1212.74">
            <stop offset="0.479167" stopColor="#246FE5" />
            <stop offset="1" stopColor="#24E5AB" stopOpacity="0.49" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint29_linear_1_10972" x1="307.636" x2="307.636" y1="2.26378" y2="1212.8">
            <stop offset="0.479167" stopColor="#246FE5" />
            <stop offset="1" stopColor="#24E5AB" stopOpacity="0.49" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint30_linear_1_10972" x1="307.202" x2="307.202" y1="1.94336" y2="1212.88">
            <stop offset="0.479167" stopColor="#246FE5" />
            <stop offset="1" stopColor="#24E5AB" stopOpacity="0.49" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint31_linear_1_10972" x1="306.708" x2="306.708" y1="1.625" y2="1213.05">
            <stop offset="0.479167" stopColor="#246FE5" />
            <stop offset="1" stopColor="#24E5AB" stopOpacity="0.49" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint32_linear_1_10972" x1="306.327" x2="306.327" y1="1.36719" y2="1213.18">
            <stop offset="0.479167" stopColor="#246FE5" />
            <stop offset="1" stopColor="#24E5AB" stopOpacity="0.49" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint33_linear_1_10972" x1="305.994" x2="305.994" y1="0.972655" y2="1213.21">
            <stop offset="0.479167" stopColor="#246FE5" />
            <stop offset="1" stopColor="#24E5AB" stopOpacity="0.49" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint34_linear_1_10972" x1="305.651" x2="305.651" y1="0.652343" y2="1213.32">
            <stop offset="0.479167" stopColor="#246FE5" />
            <stop offset="1" stopColor="#24E5AB" stopOpacity="0.49" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint35_linear_1_10972" x1="305.311" x2="305.311" y1="0.333983" y2="1213.44">
            <stop offset="0.479167" stopColor="#246FE5" />
            <stop offset="1" stopColor="#24E5AB" stopOpacity="0.49" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint36_linear_1_10972" x1="301.9" x2="301.9" y1="0" y2="1213.58">
            <stop offset="0.479167" stopColor="#246FE5" />
            <stop offset="1" stopColor="#24E5AB" stopOpacity="0.49" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint37_linear_1_10972" x1="293.573" x2="293.573" y1="0.425781" y2="1213.97">
            <stop offset="0.479167" stopColor="#246FE5" />
            <stop offset="1" stopColor="#24E5AB" stopOpacity="0.49" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint38_linear_1_10972" x1="284.708" x2="284.708" y1="0.652344" y2="1214.4">
            <stop offset="0.479167" stopColor="#246FE5" />
            <stop offset="1" stopColor="#24E5AB" stopOpacity="0.49" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint39_linear_1_10972" x1="274.892" x2="274.892" y1="0.988282" y2="1214.82">
            <stop offset="0.479167" stopColor="#246FE5" />
            <stop offset="1" stopColor="#24E5AB" stopOpacity="0.49" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint40_linear_1_10972" x1="265.238" x2="265.238" y1="1.32227" y2="1215.25">
            <stop offset="0.479167" stopColor="#246FE5" />
            <stop offset="1" stopColor="#24E5AB" stopOpacity="0.49" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint41_linear_1_10972" x1="255.851" x2="255.851" y1="1.7168" y2="1215.66">
            <stop offset="0.479167" stopColor="#246FE5" />
            <stop offset="1" stopColor="#24E5AB" stopOpacity="0.49" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint42_linear_1_10972" x1="246.515" x2="246.515" y1="1.97656" y2="1216.09">
            <stop offset="0.479167" stopColor="#246FE5" />
            <stop offset="1" stopColor="#24E5AB" stopOpacity="0.49" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint43_linear_1_10972" x1="235.935" x2="235.935" y1="2.32422" y2="1216.51">
            <stop offset="0.479167" stopColor="#246FE5" />
            <stop offset="1" stopColor="#24E5AB" stopOpacity="0.49" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint44_linear_1_10972" x1="223.992" x2="223.992" y1="2.70508" y2="1216.94">
            <stop offset="0.479167" stopColor="#246FE5" />
            <stop offset="1" stopColor="#24E5AB" stopOpacity="0.49" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint45_linear_1_10972" x1="212.48" x2="212.48" y1="3.03907" y2="1217.35">
            <stop offset="0.479167" stopColor="#246FE5" />
            <stop offset="1" stopColor="#24E5AB" stopOpacity="0.49" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint46_linear_1_10972" x1="201.292" x2="201.292" y1="3.26563" y2="1217.77">
            <stop offset="0.479167" stopColor="#246FE5" />
            <stop offset="1" stopColor="#24E5AB" stopOpacity="0.49" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint47_linear_1_10972" x1="190.585" x2="190.585" y1="3.61524" y2="1218.19">
            <stop offset="0.479167" stopColor="#246FE5" />
            <stop offset="1" stopColor="#24E5AB" stopOpacity="0.49" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint48_linear_1_10972" x1="180.474" x2="180.474" y1="3.87306" y2="1218.62">
            <stop offset="0.479167" stopColor="#246FE5" />
            <stop offset="1" stopColor="#24E5AB" stopOpacity="0.49" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint49_linear_1_10972" x1="171.052" x2="171.052" y1="4.26954" y2="1219.05">
            <stop offset="0.479167" stopColor="#246FE5" />
            <stop offset="1" stopColor="#24E5AB" stopOpacity="0.49" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint50_linear_1_10972" x1="162.404" x2="162.404" y1="4.67775" y2="1219.45">
            <stop offset="0.479167" stopColor="#246FE5" />
            <stop offset="1" stopColor="#24E5AB" stopOpacity="0.49" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint51_linear_1_10972" x1="154.443" x2="154.443" y1="4.85939" y2="1219.88">
            <stop offset="0.479167" stopColor="#246FE5" />
            <stop offset="1" stopColor="#24E5AB" stopOpacity="0.49" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint52_linear_1_10972" x1="146.691" x2="146.691" y1="5.28517" y2="1220.31">
            <stop offset="0.479167" stopColor="#246FE5" />
            <stop offset="1" stopColor="#24E5AB" stopOpacity="0.49" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint53_linear_1_10972" x1="137.68" x2="137.68" y1="5.51173" y2="1220.81">
            <stop offset="0.479167" stopColor="#246FE5" />
            <stop offset="1" stopColor="#24E5AB" stopOpacity="0.49" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint54_linear_1_10972" x1="127.349" x2="127.349" y1="5.92384" y2="1221.14">
            <stop offset="0.479167" stopColor="#246FE5" />
            <stop offset="1" stopColor="#24E5AB" stopOpacity="0.49" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint55_linear_1_10972" x1="123.483" x2="123.483" y1="5.92384" y2="1220.59">
            <stop offset="0.479167" stopColor="#246FE5" />
            <stop offset="1" stopColor="#24E5AB" stopOpacity="0.49" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint56_linear_1_10972" x1="119.514" x2="119.514" y1="5.78517" y2="1220.18">
            <stop offset="0.479167" stopColor="#246FE5" />
            <stop offset="1" stopColor="#24E5AB" stopOpacity="0.49" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint57_linear_1_10972" x1="114.267" x2="114.267" y1="5.709" y2="1219.57">
            <stop offset="0.479167" stopColor="#246FE5" />
            <stop offset="1" stopColor="#24E5AB" stopOpacity="0.49" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint58_linear_1_10972" x1="108.574" x2="108.574" y1="5.64845" y2="1219.09">
            <stop offset="0.479167" stopColor="#246FE5" />
            <stop offset="1" stopColor="#24E5AB" stopOpacity="0.49" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint59_linear_1_10972" x1="102.832" x2="102.832" y1="5.57228" y2="1218.53">
            <stop offset="0.479167" stopColor="#246FE5" />
            <stop offset="1" stopColor="#24E5AB" stopOpacity="0.49" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint60_linear_1_10972" x1="97.0733" x2="97.0733" y1="5.51369" y2="1218.1">
            <stop offset="0.479167" stopColor="#246FE5" />
            <stop offset="1" stopColor="#24E5AB" stopOpacity="0.49" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint61_linear_1_10972" x1="91.2823" x2="91.2823" y1="5.43947" y2="1217.54">
            <stop offset="0.479167" stopColor="#246FE5" />
            <stop offset="1" stopColor="#24E5AB" stopOpacity="0.49" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint62_linear_1_10972" x1="85.462" x2="85.462" y1="5.37502" y2="1216.98">
            <stop offset="0.479167" stopColor="#246FE5" />
            <stop offset="1" stopColor="#24E5AB" stopOpacity="0.49" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint63_linear_1_10972" x1="81.6779" x2="81.6779" y1="5.29884" y2="1216.49">
            <stop offset="0.479167" stopColor="#246FE5" />
            <stop offset="1" stopColor="#24E5AB" stopOpacity="0.49" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint64_linear_1_10972" x1="78.3063" x2="78.3063" y1="5.24025" y2="1215.93">
            <stop offset="0.479167" stopColor="#246FE5" />
            <stop offset="1" stopColor="#24E5AB" stopOpacity="0.49" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint65_linear_1_10972" x1="75.7935" x2="75.7935" y1="5.17775" y2="1215.44">
            <stop offset="0.479167" stopColor="#246FE5" />
            <stop offset="1" stopColor="#24E5AB" stopOpacity="0.49" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint66_linear_1_10972" x1="75.2275" x2="75.2275" y1="5.10158" y2="1214.81">
            <stop offset="0.479167" stopColor="#246FE5" />
            <stop offset="1" stopColor="#24E5AB" stopOpacity="0.49" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint67_linear_1_10972" x1="74.3694" x2="74.3694" y1="5.04494" y2="1214.36">
            <stop offset="0.479167" stopColor="#246FE5" />
            <stop offset="1" stopColor="#24E5AB" stopOpacity="0.49" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint68_linear_1_10972" x1="72.8994" x2="72.8994" y1="4.96681" y2="1213.87">
            <stop offset="0.479167" stopColor="#246FE5" />
            <stop offset="1" stopColor="#24E5AB" stopOpacity="0.49" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint69_linear_1_10972" x1="70.3425" x2="70.3425" y1="4.90432" y2="1213.33">
            <stop offset="0.479167" stopColor="#246FE5" />
            <stop offset="1" stopColor="#24E5AB" stopOpacity="0.49" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint70_linear_1_10972" x1="66.8558" x2="66.8558" y1="4.8301" y2="1212.77">
            <stop offset="0.479167" stopColor="#246FE5" />
            <stop offset="1" stopColor="#24E5AB" stopOpacity="0.49" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint71_linear_1_10972" x1="63.2095" x2="63.2095" y1="4.7676" y2="1212.35">
            <stop offset="0.479167" stopColor="#246FE5" />
            <stop offset="1" stopColor="#24E5AB" stopOpacity="0.49" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint72_linear_1_10972" x1="59.5403" x2="59.5403" y1="4.69338" y2="1211.73">
            <stop offset="0.479167" stopColor="#246FE5" />
            <stop offset="1" stopColor="#24E5AB" stopOpacity="0.49" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

function Frame4() {
  return (
    <div className="absolute h-[266.649px] left-0 mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[0px_0px] mask-size-[1599.895px_266.649px] top-0 w-[1599.895px]" style={{ maskImage: `url('${imgFrame852824547}')` }}>
      <div className="absolute flex h-[902.163px] items-center justify-center left-0 top-[-56.66px] w-[1599.895px]">
        <div className="flex-none rotate-[180deg]">
          <div className="bg-gradient-to-t from-[6.098%] from-[rgba(36,105,229,0.1)] h-[902.163px] to-[106.22%] to-[rgba(36,111,229,0.07)] w-[1599.895px]" />
        </div>
      </div>
      <Group2 />
      <div className="absolute flex h-[462.192px] items-center justify-center right-[-287.87px] top-[-292.2px] w-[1221.141px]" style={{ "--transform-inner-width": "0", "--transform-inner-height": "0" } as React.CSSProperties}>
        <div className="flex-none rotate-[90deg]">
          <Objects />
        </div>
      </div>
    </div>
  );
}

function Bg() {
  return (
    <div className="absolute h-[845.5px] left-0 overflow-clip top-[46.05px] w-[1599.895px] z-[1]" data-name="bg">
      <Frame4 />
    </div>
  );
}

export default function Frame69() {
  return (
    <div className="bg-[#ebf6ff] content-stretch flex flex-col isolate items-start relative size-full">
      <XFrame1 />
      <Frame16 />
      <Bg />
    </div>
  );
}