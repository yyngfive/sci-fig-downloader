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

import { type Updater } from "use-immer";
import type { FiguresData, FigInfo } from "@/types/parser";
import { useState } from "react";
import IconLink from "@/assets/svg/IconLink";

function FigCardTOC({
  title,
  figsData,
  setFigsData,
}: {
  title: string;
  figsData: FiguresData;
  setFigsData: Updater<FiguresData>;
}) {
  function handleSelect(figsData: FiguresData) {
    setFigsData((draft) => {
      let figInfo = draft.tocFig as FigInfo;
      figInfo.selected = !figsData.tocFig?.selected;
    });
  }

  return (
    <>
      <div className="flex justify-between items-center">
        <h2 className="text-lg my-2">{title}</h2>
      </div>
      <div className="">
        <ul>
          <li className="flex gap-1 my-1 justify-between items-center" key={0}>
            <div className="flex gap-1 w-[calc(100%-20px)]">
              <input
                type="checkbox"
                className="checkbox checkbox-sm"
                checked={figsData.tocFig?.selected}
                onChange={() => {
                  handleSelect(figsData);
                }}
              />
              <button
                className="truncate"
                onClick={() => {
                  handleSelect(figsData);
                }}
              >
                Fig {figsData.tocFig?.id}. {figsData.tocFig?.name}
              </button>
            </div>
            <div className="size-4 p-0">
                <a
                  className=""
                  href={figsData.tocFig?.originUrl}
                  target="_blank"
                >
                  <IconLink width={3} />
                </a>
              </div>
          </li>
        </ul>
      </div>
    </>
  );
}

function FigCard({
  title,
  figsData,
  setFigsData,
  type,
}: {
  title: string;
  figsData: FiguresData;
  setFigsData: Updater<FiguresData>;
  type: "mainFigs" | "siFigs";
}) {
  const [selectAll, setSelectAll] = useState(false);

  function handleSelectAll() {
    const current = !selectAll;
    setSelectAll(current);
    setFigsData((draft) => {
      draft[type]?.forEach((figInfo) => {
        figInfo.selected = current;
      });
    });
  }

  function handleSelect(figInfo: FigInfo) {
    let selected: boolean[] = [];
    setFigsData((draft) => {
      draft[type]?.forEach((figInfoDraft) => {
        if (figInfo.id === figInfoDraft.id) {
          figInfoDraft.selected = !figInfo.selected;
        }
        selected.push(figInfoDraft.selected);
      });
      setSelectAll(selected.every((item) => item === true));
    });
  }

  return (
    <>
      <div className="flex justify-between items-center">
        <h2 className="text-lg my-2">{title}</h2>
        {(figsData[type]?.length as number) > 1 && (
          <span className="flex gap-1">
            <input
              type="checkbox"
              className="checkbox checkbox-sm"
              checked={selectAll}
              onChange={handleSelectAll}
            />
            <button onClick={handleSelectAll}>选择全部</button>
          </span>
        )}
      </div>
      <div className="w-full">
        <ul>
          {figsData[type]?.map((figInfo, index) => (
            <li
              className="flex gap-1 my-1 justify-between items-center w-full"
              key={index}
            >
              <div className="flex gap-1 w-[calc(100%-20px)]">
                <input
                  type="checkbox"
                  className="checkbox checkbox-sm"
                  checked={figInfo.selected}
                  onChange={() => {
                    handleSelect(figInfo);
                  }}
                />
                <div className="truncate">
                  <span
                    className="truncate"
                    onClick={() => {
                      handleSelect(figInfo);
                    }}
                  >
                    Fig {figInfo.id}. {figInfo.name}
                  </span>
                </div>
              </div>
              <div className="size-4 p-0">
                <a
                  className=""
                  href={figInfo.originUrl}
                  target="_blank"
                >
                  <IconLink width={3} />
                </a>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export { FigCard, FigCardTOC };
