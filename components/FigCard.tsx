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
import { useEffect, useState } from "react";
import { IconEyeOpen, IconEyeClose, IconLink } from "@/assets/svg/Icons";
import { Truncate } from "@re-dev/react-truncate";
import { motion, AnimatePresence } from "framer-motion";
function FigCardTOC({
  title,
  figsData,
  setFigsData,
}: {
  title: string;
  figsData: FiguresData;
  setFigsData: Updater<FiguresData>;
}) {
  const [show, setShow] = useState<false | number>(false);
  function handleSelect(figInfo: FigInfo) {
    setFigsData((draft) => {
      let draftInfo = draft.tocFig as FigInfo;
      draftInfo.selected = !figInfo.selected;
    });
  }

  return (
    <>
      <div className="flex justify-between items-center">
        <h2 className="text-lg my-2">{title}</h2>
      </div>
      <div className="">
        <ul>
          <FigCardItem
            figInfo={figsData.tocFig!}
            index={0}
            handleSelect={handleSelect}
            show={show}
            setShow={setShow}
          />
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
  const [show, setShow] = useState<false | number>(false);

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
            <FigCardItem
              figInfo={figInfo}
              index={index}
              handleSelect={handleSelect}
              show={show}
              setShow={setShow}
            />
          ))}
        </ul>
      </div>
    </>
  );
}

interface FigCardItemProps {
  figInfo: FigInfo;
  index: number;
  handleSelect: (figInfo: FigInfo) => void;
  show: false | number;
  setShow: (arg0: false | number) => void;
}

function FigCardItem({
  figInfo,
  index,
  handleSelect,
  show,
  setShow,
}: FigCardItemProps) {
  const expand = show === index;

  return (
    <li key={index}>
      <div
        className={`flex gap-1 justify-between items-center w-full  box-content  hover:bg-base-200 ${
          expand ? "bg-base-200 rounded-t-lg" : "rounded-lg"
        }`}
        key={index}
      >
        {/* 名称和选择框 */}
        <div className="flex gap-1 w-[calc(100%-56px)] ml-1 my-1">
          <input
            type="checkbox"
            className="checkbox checkbox-sm"
            checked={figInfo.selected}
            onChange={() => {
              handleSelect(figInfo);
            }}
          />
          <span
            className="grow truncate"
            onClick={() => {
              handleSelect(figInfo);
            }}
          >
            <Truncate className="text-sm">
              {figInfo.id}. {figInfo.name}
            </Truncate>
          </span>
        </div>
        {/* 显示或隐藏详细 */}
        <div
          className="size-5 p-0.5 rounded-md hover:bg-base-300 my-1"
          onClick={() => {
            setShow(expand ? false : index);
          }}
        >
          <label className={`swap ${expand ? "swap-active" : ""}`}>
            <IconEyeOpen className="swap-on" width={4} />
            <IconEyeClose className="swap-off" width={4} />
          </label>
        </div>
        {/* 外部链接 */}
        <div className="size-5 p-0.5 rounded-md hover:bg-base-300 my-1 mr-1 ">
          <a className="" href={figInfo.originUrl} target="_blank">
            <IconLink width={4} />
          </a>
        </div>
      </div>
      {/*动画来自 https://codesandbox.io/p/sandbox/framer-motion-accordion-qx958?file=%2Fsrc%2FExample.tsx%3A21%2C26 */}
      <AnimatePresence initial={false}>
        {expand && (
          <motion.section
            key="content"
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={{
              open: { opacity: 1, height: "auto" },
              collapsed: { opacity: 0, height: 0 },
            }}
            //transition={{ duration: 0.8, ease: [0.04, 0.62, 0.23, 0.98] }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <FigureItemDetail figInfo={figInfo} />
            <button
              className="btn btn-sm hidden"
              onClick={() => {
                setShow(expand ? false : index);
              }}
            >
              隐藏
            </button>
          </motion.section>
        )}
      </AnimatePresence>
    </li>
  );
}

function FigureItemDetail({ figInfo }: { figInfo: FigInfo }) {
  const [loading, setLoading] = useState(true);
  return (
    <div className="flex justify-center flex-col px-7 pt-3 mt-0 mb-1 box-content rounded-b-lg bg-base-200">
      {loading && <div className="skeleton h-40"></div>}
      <img
        src={figInfo.htmlUrl}
        alt=""
        className={`rounded-lg box-content ${loading ? "hidden" : ""}`}
        onLoad={() => {
          setLoading(false);
        }}
      />
      <p className="my-3">{figInfo.name}</p>
    </div>
  );
}

export { FigCard, FigCardTOC };
