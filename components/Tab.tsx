// Copyright (C) 2024  yyngfive 

// Email: chenhye5@outlook.com

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

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
        <div className="max-h-[350px] overflow-auto ">{children}</div>
      </div>
    </>
  );
}

export { Tab };
