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

import type { FileInfo, FilesData } from "@/types/parser";
import type { Updater } from "use-immer";
import { useState } from "react";
import { IconLink } from "@/assets/svg/Icons";
import { Truncate } from "@re-dev/react-truncate";
function FileCard({
  title,
  filesData,
  type,
  setFilesData,
}: {
  title: string;
  filesData: FilesData;
  type: "sources" | "files";
  setFilesData: Updater<FilesData>;
}) {
  const [selectAll, setSelectAll] = useState(false);

  function handleSelectAll() {
    const current = !selectAll;
    setSelectAll(current);
    setFilesData((draft) => {
      draft.files.forEach((figInfo) => {
        figInfo.selected = current;
      });
    });
  }

  function handleSelect(figInfo: FileInfo) {
    let selected: boolean[] = [];
    setFilesData((draft) => {
      draft.files.forEach((fileInfoDraft) => {
        if (figInfo.id === fileInfoDraft.id) {
          fileInfoDraft.selected = !figInfo.selected;
        }
        selected.push(fileInfoDraft.selected);
      });
      setSelectAll(selected.every((item) => item === true));
    });
  }

  return (
    <>
      <div className="flex justify-between items-center">
        <h2 className="text-lg my-2">{title}</h2>
        {filesData.files.length > 1 && (
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
          {filesData.files.map((fileInfo, index) => (
            <li key={index}>
              <div
                className={`flex gap-1  justify-between items-center box-content rounded-lg hover:bg-base-200`}
                key={index}
              >
                <div className="flex gap-1 w-[calc(100%-24px)] ml-1 my-1">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-sm"
                    checked={fileInfo.selected}
                    onChange={() => {
                      handleSelect(fileInfo);
                    }}
                  />
                  <span
                    className="grow truncate"
                    onClick={() => {
                      handleSelect(fileInfo);
                    }}
                  >
                    <Truncate className="text-sm">
                      {fileInfo.id}. {fileInfo.name}
                    </Truncate>
                  </span>
                </div>
                <div className="size-5 p-0.5 rounded-md hover:bg-base-300 my-1 mr-1">
                  {(fileInfo.fileType === "pdf" ||
                    fileInfo.fileType === "figure") && (
                    <a className="" href={fileInfo.originUrl} target="_blank">
                      <IconLink width={3} />
                    </a>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

function FileCardArticle({
  title,
  filesData,
  type,
  setFilesData,
}: {
  title: string;
  filesData: FilesData;
  type: "article";
  setFilesData: Updater<FilesData>;
}) {
  function handleSelect(figInfo: FileInfo) {
    let selected: boolean;
    setFilesData((draft) => {
      let draftInfo = draft[type] as FileInfo;
      draftInfo.selected = !figInfo.selected;
    });
  }

  const fileInfo = filesData.article;
  const from = filesData.from;
  let from_flag = false;
  if (from === "wiley" || from === "sciencedirect") {
    from_flag = true;
  }
  console.log(from);
  

  return (
    <>
      <div className="flex justify-between items-center">
        <h2 className="text-lg my-2">{title}</h2>
      </div>
      <div className="w-full">
        <ul>
          <li key={0}>
            <div
              className={`flex gap-1  justify-between items-center box-content rounded-lg hover:bg-base-200`}
              key={0}
            >
              <div className="flex gap-1 w-[calc(100%-24px)] ml-1 my-1">
                <input
                  type="checkbox"
                  disabled={from_flag}
                  className="checkbox checkbox-sm"
                  checked={fileInfo.selected}
                  onChange={() => {
                    handleSelect(fileInfo);
                  }}
                />
                <span
                  className="grow truncate"
                  onClick={() => {
                    if(!from_flag) {
                      handleSelect(fileInfo);
                    }
                    
                  }}
                >
                  <Truncate className="text-sm">{fileInfo.name}</Truncate>
                </span>
              </div>
              <div className="size-5 p-0.5 rounded-md hover:bg-base-300 my-1 mr-1">
                {(fileInfo.fileType === "pdf" ||
                  fileInfo.fileType === "figure") && (
                  <a className="" href={fileInfo.originUrl} target="_blank">
                    <IconLink width={3} />
                  </a>
                )}
              </div>
            </div>
          </li>
        </ul>
      </div>
    </>
  );
}

export { FileCard, FileCardArticle };
