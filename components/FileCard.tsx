import type { FileInfo, FilesData } from "@/types/parser";
import type { Updater } from "use-immer";
import { useState } from "react";

function FileCard({
  title,
  filesData,
  setFilesData,
}: {
  title: string;
  filesData: FilesData;
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
    });
    setSelectAll(selected.every((item) => item === true));
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
            <li className="flex gap-1 my-1" key={index}>
              <input
                type="checkbox"
                className="checkbox checkbox-sm"
                checked={fileInfo.selected}
                onChange={() => {
                  handleSelect(fileInfo);
                }}
              />
              <button
                className="truncate"
                onClick={() => {
                  handleSelect(fileInfo);
                }}
              >
                {fileInfo.id}. {fileInfo.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export { FileCard };
