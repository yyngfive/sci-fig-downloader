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

import {
  getFiguresFrom,
  getFilesFrom,
  figParsers,
  fileParsers,
} from "@/Parsers/parsers";
import type { FiguresData, FilesData } from "@/types/parser";

export default defineContentScript({
  matches: [
    "https://www.nature.com/*",
    "https://nature.com/*",
    "https://pubs.acs.org/*",
    "https://onlinelibrary.wiley.com/*",
    "https://*.onlinelibrary.wiley.com/*",
    "https://*.science.org/*",
    "https://*.sciencedirect.com/*",
    "https://academic.oup.com/*",
  ],
  main() {
    function isPromise<T>(value: any): value is Promise<T> {
      return value instanceof Promise;
    }
    function handleGetFigsData(
      request: {
        from: FiguresData["from"];
        action: string;
      },
      sender: chrome.runtime.MessageSender,
      sendResponse: (arg0: FiguresData) => void
    ) {
      if (request.action !== "fig") {
        return;
      }
      if (!Object.keys(figParsers).includes(request.from)) {
        return;
      }
      console.log("Journal (Figure)", request.from);
      const data = getFiguresFrom(request.from);
      if (isPromise<FiguresData>(data)) {
        data.then((figsData) => {
          console.log(figsData,'promise');
          sendResponse(figsData);
        })
      }else{
        const figsData = data;
        console.log(figsData);
        sendResponse(figsData);
      }
      return true;
    }

    function handleGetFilesData(
      request: {
        from: FilesData["from"];
        action: string;
      },
      sender: chrome.runtime.MessageSender,
      sendResponse: (arg0: FilesData) => void
    ) {
      if (request.action !== "file") {
        return;
      }
      if (!Object.keys(fileParsers).includes(request.from)) {
        return;
      }
      console.log("Journal (File)", request.from);
      const filesData = getFilesFrom(request.from);
      console.log(filesData);

      sendResponse(filesData);
      return true;
    }

    browser.runtime.onMessage.addListener(handleGetFigsData);
    browser.runtime.onMessage.addListener(handleGetFilesData);
  },
});
