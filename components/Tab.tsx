import React from "react";

interface TabProps {
  name: string;
  defaultChecked?: boolean;
}

function Tab({
  children,
  name,
  defaultChecked,
}: React.PropsWithChildren<TabProps>) {
  return (
    <>
      <input
        type="radio"
        name="tabs"
        role="tab"
        className="tab whitespace-nowrap"
        aria-label={name}
        defaultChecked={defaultChecked}
      />
      <div
        role="tabpanel"
        className="tab-content bg-base-100 border-base-300 rounded-box px-3 pb-3 max-w-[476px]"
      >
        <div className="max-h-[400px] overflow-auto ">{children}</div>
      </div>
    </>
  );
}

export { Tab };
