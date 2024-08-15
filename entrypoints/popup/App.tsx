import { useEffect } from "react";
import { useImmer } from "use-immer";
import "./App.css";
import { FigCard, FigCardTOC } from "@/components/FigCard";
import { FileCard } from "@/components/FileCard";
import type { FiguresData, FigInfo, FilesData, FileInfo } from "@/types/parser";
import { Tab } from "@/components/Tab";

function App() {
  const [figsData, setFigsData] = useImmer<FiguresData>({
    title: "",
    hasSi: false,
    hasToc: false,
    mainFigs: [],
    from: "acs",
  });
  const [filesData, setFilesData] = useImmer<FilesData>({
    files: [],
    from: "acs",
    title: "",
  });
  const [downloads, setDownloads] = useImmer<FigInfo[] | FileInfo[]>([]);

  //将选中的文件加入State
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
    filesData.files.forEach((fileInfo) => {
      if (fileInfo.selected) {
        selectedFiles.push(fileInfo);
      }
    });
    setDownloads(selectedFiles);
  }, [figsData, filesData]);

  async function getFigsData() {
    const [tab] = await browser.tabs.query({
      active: true,
      lastFocusedWindow: true,
    });
    if (tab.id) {
      const currentUrl = tab.url as string;
      if (findJournalForUrl(currentUrl)) {
        browser.tabs
          .sendMessage(tab.id, {
            from: findJournalForUrl(currentUrl),
            type: "fig",
          })
          .then((res) => {
            console.log(res);
            if (res !== undefined) {
              setFigsData(res);
            }
          });
      }
    }
  }

  async function getFilesData() {
    const [tab] = await browser.tabs.query({
      active: true,
      lastFocusedWindow: true,
    });
    if (tab.id) {
      const currentUrl = tab.url as string;
      if (findJournalForUrl(currentUrl)) {
        browser.tabs
          .sendMessage(tab.id, {
            from: findJournalForUrl(currentUrl),
            type: "file",
          })
          .then((res) => {
            console.log(res);
            if (res !== undefined) {
              setFilesData(res);
            }
          });
      }
    }
  }

  function handleDownload() {
    downloads.forEach((item) => {
      if (item.selected) {
        browser.downloads.download({
          url: item.originUrl,
        });
      }
    });
  }

  useEffect(() => {
    getFigsData();
    getFilesData();
  }, []);

  return (
    <>
      <div className="m-3">
        <h1 className="font-bold text-xl my-2">{figsData.title}</h1>
        <div role="tablist" className="tabs tabs-lifted w-[476px]">
          <Tab name="图片" defaultChecked>
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
            <div className="max-h-[400px] overflow-auto ">
              {filesData.files.length !== 0 && (
                <FileCard
                  title={filesData.title}
                  filesData={filesData}
                  setFilesData={setFilesData}
                />
              )}
            </div>
          </Tab>
        </div>
      </div>
      <div className="m-3 flex justify-between items-center h-12 z-50">
        <span>
          <a
            href="https://github.com/yyngfive/sci-fig-downloader/issues"
            className="link link-hover"
            target="_blank"
          >
            问题反馈
          </a>
        </span>
        <button
          className="btn btn-primary btn-sm mx-1"
          onClick={() => {
            handleDownload();
          }}
        >
          下载已选项({downloads.length})
        </button>
      </div>
    </>
  );
}

function findJournalForUrl(url: string): string | null {
  const supportWebsites = ["nature", "acs", "wiley"];
  console.log(url);
  if(!url.startsWith('http')){return null}
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
