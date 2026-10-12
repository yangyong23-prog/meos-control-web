function Component() {
  return (
    <div className="content-stretch flex gap-[4px] items-center justify-center relative shrink-0" data-name="内容">
      <p className="css-ew64yg font-['Microsoft_YaHei_UI:Regular',sans-serif] leading-[22px] not-italic relative shrink-0 text-[#1b2129] text-[14px] text-center">编辑</p>
    </div>
  );
}

function Component1() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center relative shrink-0" data-name="限制宽度">
      <Component />
    </div>
  );
}

export default function Button() {
  return (
    <div className="bg-white content-stretch flex items-center justify-center px-[16px] py-[5px] relative rounded-[4px] size-full" data-name="按钮&Button">
      <div aria-hidden="true" className="absolute border border-[#c4c9cf] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <Component1 />
    </div>
  );
}