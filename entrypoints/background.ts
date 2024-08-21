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
import type { DownloadItem } from "@/types/download";
let current:DownloadItem

export default defineBackground(() => {
  console.log("Hello background!", { id: browser.runtime.id });
  function handleRename(
    downloadItem: chrome.downloads.DownloadItem,
    suggest: (suggestion?: chrome.downloads.DownloadFilenameSuggestion) => void
  ) {
    const ext = downloadItem.filename.split('.').pop()!
    storage.getItems(["local:download-folder","local:download-conflict"]).then(res=>{
      const folder = res[0].value
      const conflict = res[1].value
      console.log(current,downloadItem.filename);
      
      if(folder){
        suggest({
          filename:`${current.article}/${current.name} ${current.id}.${ext}`,
          conflictAction:conflict
        })
      }
    })
    return true
    //suggest({filename:'fdfdfs'})
  }
  function handleDownload(
    request: {
      fileList: DownloadItem[];
      action: "download";
    },
    sender: any,
    sendResponse: () => void
  ) {
    let conflict: chrome.downloads.FilenameConflictAction;

    storage
      .getItem<chrome.downloads.FilenameConflictAction>(
        "local:download-conflict"
      )
      .then((res) => {
        conflict = res ?? "uniquify";
      });

    if (request.action === "download") {
      const fileList = request.fileList;
      fileList.forEach((item) => {
        current = item
        browser.downloads.download({
          url: item.originUrl,
          conflictAction: conflict,
        });
      });
    }
  }
  browser.runtime.onMessage.addListener(handleDownload);
  browser.downloads.onDeterminingFilename.addListener(handleRename);
});
