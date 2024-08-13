import { useEffect } from "react";
import { useImmer } from "use-immer";
import "./App.css";
import { FigCard, FigCardTOC } from "./components/FigCards";
import type { FiguresData, FigInfo } from "@/types/parser";
import { Tab } from "./components/Tab";

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

  async function getFilesData() {
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
          <Tab name="图片" defaultChecked >
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
          </Tab>

          <Tab name="文件">
            
          </Tab>
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
