import svgPaths from "./svg-67z6cixicp";

function Component() {
  return (
    <div className="absolute h-[45.917px] left-[-19px] top-[-19.46px] w-[38px]" data-name="标记">
      <div className="-translate-x-1/2 -translate-y-1/2 absolute flex flex-col font-['PingFang_SC:Semibold',sans-serif] h-[39.583px] justify-center leading-[0] left-[19px] not-italic text-[22.167px] text-center text-white top-[19.79px] w-[38px]">
        <p className="css-4hzbpn leading-[normal]">9</p>
      </div>
      <div className="absolute h-[45.917px] left-0 top-0 w-[38px]">
        <div className="absolute inset-[0_0_0.62%_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 38 45.6319">
            <path d={svgPaths.p36e70000} fill="var(--fill-0, #CD47FF)" id="Ellipse 8" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Component1() {
  return (
    <div className="absolute bg-[#fdf8ff] content-stretch flex flex-col gap-[16px] items-start left-[120.63px] px-[20px] py-[24px] rounded-[8px] top-[78px] w-[710px]" data-name="交互组件-3纯文本">
      <div aria-hidden="true" className="absolute border border-[#cd47ff] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <p className="css-4hzbpn font-['Microsoft_YaHei_UI:Bold',sans-serif] leading-[36px] min-w-full not-italic relative shrink-0 text-[#1b2129] text-[24px] w-[min-content]">查看AI策略</p>
      <ol className="block css-y54urs font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[0] min-w-full not-italic relative shrink-0 text-[#1b2129] text-[20px] w-[min-content]" start="1">
        <li className="css-4hzbpn mb-0 ms-[30px]">
          <span className="leading-[40px]">目前只显示「冷站系统开关」、「冷机台数」、「冷机出水温度」；</span>
        </li>
        <li className="css-4hzbpn mb-0 ms-[30px]">
          <span className="leading-[40px]">整体交互和冷站时间表一致，具体规则如下（一致）：</span>
        </li>
        <li className="css-4hzbpn mb-0 ms-[30px]">
          <span className="leading-[40px]">整体宽度和适配如下；</span>
        </li>
        <li className="css-4hzbpn mb-0 ms-[30px]">
          <span className="leading-[40px]">出现滚动时第一列固定，后面的可以进行滚动；</span>
        </li>
        <li className="css-4hzbpn mb-0 ms-[30px]">
          <span className="leading-[40px]">第一列参数固定用黑色显示，后面只显示有变化的时间点，比如12点-12点59没变化，13点才变化，此时只显示13点的值，且没变化的置灰，有变化的则进行底色加深；</span>
        </li>
        <li className="css-4hzbpn ms-[30px]">
          <span className="leading-[40px]">下方的表格高度固定40px，内容显示不下...表示，如果整体内容过多，则滚动显示</span>
        </li>
      </ol>
      <Component />
    </div>
  );
}

export default function Frame() {
  return (
    <div className="bg-white relative size-full">
      <Component1 />
    </div>
  );
}