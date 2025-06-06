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

//TODO：缓存机制，临时保存页面解析结果，定时清除。
import { useEffect, useState } from "react";
import { useImmer } from "use-immer";
import "./App.css";
import { FigCard, FigCardTOC } from "@/components/FigCard";
import { FileCard, FileCardArticle } from "@/components/FileCard";
import type { FiguresData, FilesData } from "@/types/parser";
import { default_file } from "@/utils/fileType";
import type { DownloadItem, downloadStatus } from "@/types/download";
import { Tab } from "@/components/Tab";
import { findJournalForUrl } from "@/Parsers/parsers";
import { ShowMore } from "@re-dev/react-truncate";
import { DownloadOptionCard } from "@/components/OptionCard";
import { info2Download } from "@/utils/downloads";

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
    hasSrc: false,
    article: default_file,
  });
  const [downloads, setDownloads] = useImmer<DownloadItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [downloadStatus, setDownloadStatus] = useImmer<downloadStatus>({
    downloaded: true,
    currentId: 0,
    total: 0,
  });

  //将选中的文件加入State
  useEffect(() => {
    let selectedFiles = [];
    if (figsData.tocFig && figsData.tocFig.selected) {
      selectedFiles.push(
        info2Download(figsData.tocFig, figsData.title, "Abstract")
      );
    }
    figsData.mainFigs.forEach((figInfo) => {
      if (figInfo.selected) {
        selectedFiles.push(
          info2Download(figInfo, figsData.title, "Figure " + figInfo.id)
        );
      }
    });
    if (figsData.siFigs) {
      figsData.siFigs.forEach((figInfo) => {
        if (figInfo.selected) {
          selectedFiles.push(
            info2Download(
              figInfo,
              figsData.title,
              figsData.siTitle! + " " + figInfo.id
            )
          );
        }
      });
    }
    filesData.files.forEach((fileInfo) => {
      if (fileInfo.selected) {
        selectedFiles.push(
          info2Download(fileInfo, figsData.title, fileInfo.name)
        );
      }
    });
    if (filesData.article.selected) {
      selectedFiles.push(
        info2Download(filesData.article, figsData.title, figsData.title)
      );
    }
    setDownloads(selectedFiles);
  }, [figsData, filesData]);

  function handleDownload() {
    setDownloadStatus({
      downloaded: false,
      currentId: 0,
      total: downloads.length,
    });

    browser.runtime.sendMessage({
      action: "download",
      fileList: downloads,
    });
  }

  function requestFiguresData(id: number, from: string) {
    return new Promise<FiguresData>((resolve, reject) => {
      browser.tabs.sendMessage(
        id,
        {
          from: from,
          action: "fig",
        },
        (res) => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
          } else {
            resolve(res);
          }
        }
      );
    });
  }

  useEffect(() => {
    async function getFigsData() {
      const [tab] = await browser.tabs.query({
        active: true,
        lastFocusedWindow: true,
      });
      if (tab.id && figsData.title === "") {
        const currentUrl = tab.url as string;
        if (findJournalForUrl(currentUrl)) {
          requestFiguresData(tab.id, findJournalForUrl(currentUrl)!).then(
            (res) => {
              console.log(res);
              if (res !== undefined) {
                setFigsData(res);
              }
            }
          );
        }
      }
    }

    async function getFilesData() {
      const [tab] = await browser.tabs.query({
        active: true,
        lastFocusedWindow: true,
      });
      if (tab.id && filesData.title === "") {
        const currentUrl = tab.url as string;
        if (findJournalForUrl(currentUrl)) {
          browser.tabs
            .sendMessage(tab.id, {
              from: findJournalForUrl(currentUrl),
              action: "file",
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
    getFigsData();
    getFilesData();
    console.log("loaded");
    setLoaded(true);

    //TODO：显示下载进度条
    function handleDownloading(
      request: {
        action: string;
        downloadStatus: downloadStatus;
      },
      sender: chrome.runtime.MessageSender,
      sendResponse: () => void
    ) {
      if (request.action === "downloading") {
        console.log(request.downloadStatus);
        setDownloadStatus(request.downloadStatus);
      }
    }

    browser.runtime.onMessage.addListener(handleDownloading);

    return () => {
      browser.runtime.onMessage.removeListener(handleDownloading);
    };
  }, []);

  return (
    <>
      <div className="m-3">
        <h1 className="font-bold text-xl my-2">
          <ShowMore lines={3} more={null}>
            {figsData.title}
          </ShowMore>
        </h1>

        <div role="tablist" className="tabs tabs-lifted w-[476px]">
          <Tab name="图片" defaultChecked loaded={loaded}>
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
                title="Figure"
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
          </Tab>

          <Tab name="文件" loaded={loaded}>
            {filesData.article.originUrl !== "" && (
              <FileCardArticle
                title="Article"
                filesData={filesData}
                type="article"
                setFilesData={setFilesData}
              />
            )}
            {filesData.files.length !== 0 && (
              <FileCard
                title={filesData.title}
                filesData={filesData}
                type="files"
                setFilesData={setFilesData}
              />
            )}
          </Tab>
          <Tab name="设置">
            <DownloadOptionCard />
          </Tab>
        </div>
      </div>
      {/* TODO：问题反馈直接获取当前url，发送提交信息 */}
      <div className="m-3 flex justify-between items-center h-12 z-50">
        <span className="tooltip tooltip-right" data-tip="chenhye5@outlook.com">
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
            if (downloads.length > 0) {
              handleDownload();
            }
          }}
        >
          {downloadStatus.downloaded ? (
            <>下载已选项({downloads.length})</>
          ) : (
            <>
              <span className="loading loading-spinner loading-xs"></span>
              正在处理({downloadStatus.currentId}/{downloadStatus.total})
            </>
          )}
        </button>
      </div>
    </>
  );
}

export default App;
