import { useState, useEffect } from "react";
import { useImmer, type Updater } from "use-immer";
import "./App.css";

import type { FiguresData, FigInfo } from "./types/parser";

function App() {
  const [figsData, setFigsData] = useImmer<FiguresData>({
    title: "",
    hasSi: false,
    hasToc: false,
    mainFigs: [],
    from: "nature",
  });
  const [files, setFiles] = useImmer<FigInfo[]>([]);

  useEffect(() => {
    let selectedFiles = [];
    if (figsData.tocFig && figsData.tocFig.selected) {
      selectedFiles.push(figsData.tocFig);
    }
    figsData.mainFigs.forEach((figInfo) => {
      if (figInfo.selected) {
        selectedFiles.push(figInfo);
      }
    });
    if (figsData.siFigs) {
      figsData.siFigs.forEach((figInfo) => {
        if (figInfo.selected) {
          selectedFiles.push(figInfo);
        }
      });
    }
    setFiles(selectedFiles);
  }, [figsData]);

  let siTitle;
  switch (figsData.from) {
    case "nature":
      siTitle = "Extended Data Figures";
      break;
    case "acs":
      siTitle = "Schemes";
      break;
    default:
      siTitle = "Extended Data Figures";
      break;
  }

  async function getFigsData() {
    const [tab] = await chrome.tabs.query({
      active: true,
      lastFocusedWindow: true,
    });
    if (tab.id) {
      const currentUrl = tab.url as string;
      if (findJournalForUrl(currentUrl)) {
        chrome.tabs.sendMessage(
          tab.id,
          { current: findJournalForUrl(currentUrl) },
          (res) => {
            console.log(res);
            setFigsData(res);
          }
        );
      }
    }
  }

  function handleDownload() {
    files.forEach((item) => {
      if (item.selected) {
        chrome.downloads.download({
          url: item.originUrl,
        });
      }
    });
  }

  useEffect(() => {
    getFigsData();
  }, []);

  return (
    <>
      <div className="mx-3 mt-3">
        <h1 className="font-bold text-xl my-1">{figsData.title}</h1>
        <div className="w-full max-h-[400px] overflow-auto mr-1">
          {figsData.hasToc && (
            <>
              <FigCardTOC
                title="Graphical Abstract"
                figsData={figsData}
                setFigsData={setFigsData}
              />
            </>
          )}
          <FigCard
            title="Figures"
            figsData={figsData}
            setFigsData={setFigsData}
            type="mainFigs"
          />
          {figsData.hasSi && (
            <>
              <FigCard
                title={siTitle}
                figsData={figsData}
                type="siFigs"
                setFigsData={setFigsData}
              />
            </>
          )}
        </div>
      </div>
      <div className="m-3 flex shadow-lg justify-end items-center w-full h-12 relative">
        <button
          className="btn btn-primary btn-sm mr-6"
          onClick={() => {
            handleDownload();
          }}
        >
          下载已选项({files.length})
        </button>
      </div>
    </>
  );
}

function FigCardTOC({
  title,
  figsData,
  setFigsData,
}: {
  title: string;
  figsData: FiguresData;
  setFigsData: Updater<FiguresData>;
}) {
  return (
    <>
      <div className="flex justify-between items-center">
        <h2 className="text-lg my-2">{title}</h2>
      </div>
      <div className="w-full">
        <ul>
          <div className="flex gap-1 my-1">
            <input
              type="checkbox"
              className="checkbox checkbox-sm"
              checked={figsData.tocFig?.selected}
              onChange={() => {
                setFigsData((draft) => {
                  let figInfo = draft.tocFig as FigInfo;
                  figInfo.selected = !figsData.tocFig?.selected;
                });
              }}
            />
            <li key={0} className="">
              Fig {figsData.tocFig?.id}. {figsData.tocFig?.name}
            </li>
          </div>
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
  return (
    <>
      <div className="flex justify-between items-center">
        <h2 className="text-lg my-2">{title}</h2>
        <span className="flex gap-1">
          <input
            type="checkbox"
            className="checkbox checkbox-sm"
            checked={selectAll}
            onChange={() => {
              const current = !selectAll;
              setSelectAll(current);
              setFigsData((draft) => {
                draft[type]?.forEach((figInfo) => {
                  figInfo.selected = current;
                });
              });
            }}
          />
          <p>选择全部</p>
        </span>
      </div>
      <div className="w-full">
        <ul>
          {figsData[type]?.map((figInfo, index) => (
            <div className="flex gap-1 my-1">
              <input
                type="checkbox"
                className="checkbox checkbox-sm"
                checked={figInfo.selected}
                onChange={() => {
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
                }}
              />
              <li key={index} className="truncate">
                Fig {figInfo.id}.{" "}
                {figInfo.name}
              </li>
            </div>
          ))}
        </ul>
      </div>
    </>
  );
}

function findJournalForUrl(url: string): string | null {
  const supportedWebsites: { [key: string]: RegExp } = {
    nature: /^https:\/\/(www\.)?nature\.com\//,
    acs: /^https:\/\/pubs\.acs\.org\//,
  };
  for (const key in supportedWebsites) {
    const pattern = supportedWebsites[key];
    if (pattern.test(url)) {
      return key;
    }
  }
  return null;
}

export default App;
