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

import type { Updater } from "use-immer";
import React, { useEffect, useState } from "react";
import { useImmer } from "use-immer";
import { storage } from 'wxt/storage';
import IconLink from "@/assets/svg/IconLink";
function OptionCard({
  title,
  children,
}: React.PropsWithChildren<{ title: string }>) {
  return (
    <>
      <div className="flex justify-between items-center">
        <h2 className="text-base my-2">{title}</h2>
      </div>
      <div className="w-full">
        <ul className="">{children}</ul>
      </div>
    </>
  );
}

function OptionItem({
  key,
  children,
  onClick,
}: React.PropsWithChildren<{ key: number; onClick?: () => void }>) {
  return (
    <li
      className="flex gap-1 my-1 justify-start items-center"
      key={key}
      onClick={onClick}
    >
      {children}
    </li>
  );
}

function DownloadOptionCard() {
  const [options, setOptions] = useImmer(()=>{
    
    return {
      folder:false,
      conflict:'uniquify'
    }
  });

  async function init(){
    
    const res = await storage.getItem<boolean>('local:download-folder')
    console.log(res);
    const res2 = await storage.getItem<string>('local:download-conflict')
    console.log(res2);
  }
  
  

  useEffect(()=>{
    init()
  },[options])

  return (
    <OptionCard title="下载设置">
      <OptionItem
        key={0}
        onClick={() => {
          setOptions((draft) => {
            draft.folder = !options.folder;
            storage.setItem('local:download-folder',!options.folder)
          });
        }}
      >
        <input
          type="checkbox"
          className="checkbox checkbox-sm"
          checked={options.folder}
        ></input>
        <span className="cursor-pointer">
          将文件下载到期刊文件夹
          <span className="text-error">（开启后可能与其他插件冲突）</span>
        </span>
      </OptionItem>
      <span className="my-1">文件名冲突时</span>
      <OptionItem key={1}>
        <input
          type="radio"
          name="radio-conflict"
          className="radio radio-sm"
          checked={options.conflict === "uniquify" ? true : false}
        />
        <span>唯一</span>
      </OptionItem>
      <OptionItem key={2}>
        <input
          type="radio"
          name="radio-conflict"
          className="radio radio-sm"
          checked={options.conflict === "overwrite" ? true : false}
        />
        <span>覆盖</span>
      </OptionItem>
    </OptionCard>
  );
}

export { DownloadOptionCard };
