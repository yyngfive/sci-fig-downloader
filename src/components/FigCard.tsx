import { type Updater } from "use-immer";
import type { FiguresData, FigInfo } from "@/types/parser";
import { useState } from "react";

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
          <li className="flex gap-1 my-1" key={0}>
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
        <span className="flex gap-1">
          <input
            type="checkbox"
            className="checkbox checkbox-sm"
            checked={selectAll}
            onChange={handleSelectAll}
          />
          <button onClick={handleSelectAll}>选择全部</button>
        </span>
      </div>
      <div className="w-full">
        <ul>
          {figsData[type]?.map((figInfo, index) => (
            <li className="flex gap-1 my-1" key={index}>
              <input
                type="checkbox"
                className="checkbox checkbox-sm"
                checked={figInfo.selected}
                onChange={() => {
                  handleSelect(figInfo);
                }}
              />
              <button
                className="truncate"
                onClick={() => {
                  handleSelect(figInfo);
                }}
              >
                Fig {figInfo.id}. {figInfo.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export { FigCard, FigCardTOC };
