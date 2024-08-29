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

import { useEffect } from "react";
import { useImmer } from "use-immer";
import "./App.css";
import { FigCard, FigCardTOC } from "@/components/FigCard";
import { FileCard } from "@/components/FileCard";
import type { FiguresData, FigInfo, FilesData, FileInfo } from "@/types/parser";
import type { DownloadItem } from "@/types/download";
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
  });
  const [downloads, setDownloads] = useImmer<DownloadItem[]>([]);

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
        selectedFiles.push(info2Download(figInfo, figsData.title, "Figure"));
      }
    });
    if (figsData.siFigs) {
      figsData.siFigs.forEach((figInfo) => {
        if (figInfo.selected) {
          selectedFiles.push(
            info2Download(figInfo, figsData.title, figsData.siTitle!)
          );
        }
      });
    }
    filesData.files.forEach((fileInfo) => {
      if (fileInfo.selected) {
        selectedFiles.push(
          info2Download(fileInfo, figsData.title, filesData.title)
        );
      }
    });
    setDownloads(selectedFiles);
  }, [figsData, filesData]);

  async function getFigsData() {
    const [tab] = await browser.tabs.query({
      active: true,
      lastFocusedWindow: true,
    });
    if (tab.id && figsData.title === "") {
      const currentUrl = tab.url as string;
      if (findJournalForUrl(currentUrl)) {
        const res = await browser.tabs.sendMessage(tab.id, {
          from: findJournalForUrl(currentUrl),
          action: "fig",
        });
        console.log(res);
        if (res !== undefined) {
          setFigsData(res);
        }
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

  function handleDownload() {
    browser.runtime.sendMessage({
      action: "download",
      fileList: downloads,
    });
  }

  useEffect(() => {
    getFigsData();
    getFilesData();
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
          <Tab name="图片" defaultChecked>
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

          <Tab name="文件">
            {filesData.files.length !== 0 && (
              <FileCard
                title={filesData.title}
                filesData={filesData}
                setFilesData={setFilesData}
              />
            )}
          </Tab>
          {/* <Tab name="设置">
            <DownloadOptionCard/>
          </Tab> */}
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

export default App;
