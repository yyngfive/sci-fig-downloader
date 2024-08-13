import { useEffect } from "react";
import { useImmer } from "use-immer";
import "./App.css";
import { FigCard, FigCardTOC } from "./components/FigCards";
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
      <div className="m-3">
        <h1 className="font-bold text-xl my-2">{figsData.title}</h1>
        <div role="tablist" className="tabs tabs-lifted w-[476px]">
          <input
            type="radio"
            name="tabs"
            role="tab"
            className="tab whitespace-nowrap"
            aria-label="图片"
            defaultChecked
          />
          <div
            role="tabpanel"
            className="tab-content bg-base-100 border-base-300 rounded-box px-3 pb-3 max-w-[476px]"
          >
            <div className="max-h-[400px] overflow-auto ">
              {figsData.hasToc && (
                <>
                  <FigCardTOC
                    title="Graphical Abstract"
                    figsData={figsData}
                    setFigsData={setFigsData}
                  />
                </>
              )}
              {figsData.mainFigs.length !== 0 && (
                <FigCard
                  title="Figures"
                  figsData={figsData}
                  setFigsData={setFigsData}
                  type="mainFigs"
                />
              )}
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

          <input
            type="radio"
            name="tabs"
            role="tab"
            className="tab whitespace-nowrap"
            aria-label="文件"
          />
          <div
            role="tabpanel"
            className="tab-content bg-base-100 border-base-300 rounded-box px-3 pb-3 max-w-full"
          >
            补充材料
          </div>
        </div>
      </div>
      <div className="m-3 flex justify-end items-center h-12 z-50">
        <button
          className="btn btn-primary btn-sm mx-1"
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

function findJournalForUrl(url: string): string | null {
  const supportWebsites = ["nature", "acs", "wiley"];
  const domain = url.split("/")[2].split(".");
  if (domain.length >= 2) {
    const top = domain[domain.length - 2];
    console.log(top, "top");

    if (supportWebsites.includes(top)) {
      return top;
    }
  }
  return null;
}

export default App;
