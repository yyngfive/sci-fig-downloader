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

import type { FiguresData, FigInfo, FileInfo, FilesData } from "@/types/parser";
import { getFileType } from "@/utils/fileType";

export function getFilesFromOUP(): FilesData {
  let filesData: FilesData = {
    from: "oup",
    files: [],
    hasSrc: false,
    srcFiles: [],
    title: "Supplementary Data",
  };
  return filesData;
}

export function getFiguresFromOUP(): FiguresData {
  let figuresData: FiguresData = {
    title: "",
    hasSi: false,
    hasToc: false,
    mainFigs: [],
    siFigs: [],
    from: "oup",
  };

  const title = document.querySelector("h1.wi-article-title")?.textContent;
  console.log("title", title);
  if (typeof title !== "string") {
    return figuresData;
  }
  figuresData.title = title;

  const abs = document.querySelector('section.abstract')
  const toc = abs?.querySelector('div[class="fig fig-section"]')
  if(toc){
    const img = toc.querySelector('img')!
    figuresData.hasToc = true;
    const id = 1;
    const name = "Graphical Abstract";

    const htmlUrl = img.src
      ? (img.src as string)
      : (img.getAttribute("data-src") as string);
    const originUrl = ''
    const figInfo: FigInfo = {
      id,
      name,
      htmlUrl,
      originUrl,
      selected: false,
    };
    figuresData.tocFig = figInfo;
  }

  return figuresData;
}
