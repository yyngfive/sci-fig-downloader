import { useEffect } from "react";
import { useImmer } from "use-immer";
import "./App.css";
import { FigCard, FigCardTOC } from "./components/FigCards";
import { findJournalForUrl } from "./Parsers/parsers";
import type { FiguresData, FigInfo } from "@/types/parser";

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
                title={figsData.siTitle as string}
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

export default App;
