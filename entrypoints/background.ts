////This TS File

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

////Image Downloader Code //https://github.com/PactInteractive/image-downloader
// Copyright (c) 2012-2021 Vladimir Sabev

// Permission is hereby granted, free of charge, to any person
// obtaining a copy of this software and associated documentation
// files (the "Software"), to deal in the Software without
// restriction, including without limitation the rights to use,
// copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the
// Software is furnished to do so, subject to the following
// conditions:

// The above copyright notice and this permission notice shall be
// included in all copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
// OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
// HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
// WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
// FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
// OTHER DEALINGS IN THE SOFTWARE.

import type { DownloadItem, downloadStatus, Task } from "@/types/download";

const tasks = new Set<Task>();

function handleRename(
  downloadItem: chrome.downloads.DownloadItem,
  suggest: (suggestion?: chrome.downloads.DownloadFilenameSuggestion) => void
) {
  storage
    .getItems(["local:download-folder", "local:download-conflict"])
    .then((res) => {
      const folder = res[0].value;
      const conflict = res[1].value;

      if (folder) {
        const ext = downloadItem.filename.split(".").pop()!;
        const task = [...tasks][0];
        if (!task) {
          suggest();
          return;
        }

        const file = task.currentFile;
        let filename = `${file.article}/${file.name} ${file.id}.${ext}`;
        console.log(file);

        suggest({ filename: filename, conflictAction: conflict });
        task.next();
      }
    });
  return true;
}
function handleDownload(
  request: {
    fileList: DownloadItem[];
    action: "download";
  },
  sender: chrome.runtime.MessageSender,
  sendResponse: (arg0: boolean) => void
) {
  let conflict: chrome.downloads.FilenameConflictAction;

  storage
    .getItem<chrome.downloads.FilenameConflictAction>("local:download-conflict")
    .then((res) => {
      conflict = res ?? "uniquify";
    });

  if (request.action === "download") {
    const fileList = request.fileList;
    downloadImages({
      numberOfProcessedFiles: 0,
      filesToDownload: fileList,
      currentFile: fileList[0],
      next() {
        this.numberOfProcessedFiles += 1;

        if (this.numberOfProcessedFiles === this.filesToDownload.length) {
          tasks.delete(this);
        }
        this.currentFile = this.filesToDownload[this.numberOfProcessedFiles];
      },
    }).then(() => {
      sendResponse(true);
    });

    return true;
  }
}
async function downloadImages(task: Task) {
  tasks.add(task);
  let currentFile = 0;
  const total = task.filesToDownload.length;
  for (const image of task.filesToDownload) {
    await new Promise<number>((resolve) => {
      chrome.downloads.download({ url: image.originUrl }, (downloadId) => {
        if (downloadId == null) {
          if (chrome.runtime.lastError) {
            console.error(`${image.name}:`, chrome.runtime.lastError.message);
          }
          task.next();
        }
        currentFile += 1;
        resolve(currentFile);
      });
    }).then((res) => {
      browser.runtime.sendMessage({
        action: "downloading",
        downloadStatus: {
          currentId: res,
          total: total,
          downloaded: res === total ? true : false,
        },
      });
    });
  }
}

export default defineBackground(() => {
  console.log("Hello background!", { id: browser.runtime.id });
  browser.runtime.onMessage.addListener(handleDownload);
  browser.downloads.onDeterminingFilename.addListener(handleRename);
  browser.runtime.onInstalled.addListener(async (details) => {
    if (details.reason === "update") {
      // Get the current version from manifest
      const currentVersion = browser.runtime.getManifest().version;
      console.log(currentVersion, "current");

      // Get the previously stored version from storage
      const { previousVersion } = await browser.storage.local.get(
        "previousVersion"
      );

      // Compare versions and show popup if different
      if (currentVersion !== previousVersion) {
        // Open a new tab or popup
        console.log(previousVersion, "previous");
        browser.tabs.create({
          url: browser.runtime.getURL("/changelog.html"),
          active: true,
        });

        // Update the stored version
        await browser.storage.local.set({ previousVersion: currentVersion });
      }
    }
  });
});
