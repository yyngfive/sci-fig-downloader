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
export function getFilesFromScienceDirect(): FilesData {
  let filesData: FilesData = {
    from: "sciencedirect",
    files: [],
    hasSrc: false,
    title: "",
  };
  //抓display class
  const supportedList = document.querySelector(".Appendices");
  if (!supportedList) {
    return filesData;
  }
  const title = supportedList.querySelector("h2")?.textContent;
  if (typeof title !== "string") {
    return filesData;
  }
  filesData.title = title;
  const fileLinks = supportedList?.querySelectorAll(".display");
  fileLinks?.forEach((si, index) => {
    const id = index + 1;
    let name = si.querySelector(".captions")?.textContent;
    if(typeof name !== 'string'){name = ''}
    const link = si.querySelector("a.download-link") as HTMLAnchorElement;
    let originUrl = link.href;
    const fileType = getFileType(originUrl.split("/").pop() as string);
    if (fileType === "figure") {
      const figList = si.querySelectorAll("ul li");
      const hasHiRes = figList.length >= 2 ? true : false;
      originUrl = hasHiRes
        ? (figList[0].querySelector("a")?.href as string)
        : (figList[1].querySelector("a")?.href as string);
    }
    const fileInfo: FileInfo = {
      id,
      name,
      fileType,
      originUrl,
      selected: false,
    };
    filesData.files.push(fileInfo);
  });

  return filesData;
}

export function getFiguresFromScienceDirect(): FiguresData {
  let figuresData: FiguresData = {
    title: "请等待页面加载完成后重新加载",
    hasSi: false,
    hasToc: false,
    mainFigs: [],
    siFigs: [],
    from: "sciencedirect",
  };

  const title = document.querySelector("h1 .title-text")?.textContent;
  console.log("title", title);
  if (typeof title !== "string") {
    return figuresData;
  }
  figuresData.title = title;

  const abstract = document.querySelector('div[class="abstract graphical"]');

  if (abstract) {
    const id = 1;
    const name = "Graphical Abstract";
    const figList = abstract.querySelectorAll("ol li");
    const hasHiRes = figList.length >= 2 ? true : false;
    const htmlUrl = hasHiRes
      ? (figList[1].querySelector("a")?.href as string)
      : (figList[0].querySelector("a")?.href as string);
    const originUrl = hasHiRes
      ? (figList[0].querySelector("a")?.href as string)
      : htmlUrl;
    const figInfo: FigInfo = {
      id,
      name,
      htmlUrl,
      originUrl,
      selected: false,
    };
    figuresData.tocFig = figInfo;
    figuresData.hasToc = true;
  }

  const figureList = document.querySelector("#body");

  if (!figureList) {
    return figuresData;
  }

  const figures = figureList.querySelectorAll("figure.figure");
  figures.forEach((element) => {
    let caption = element.querySelector(".captions")?.textContent;
    if(!caption){
      caption = ''
    }
    
    const name = caption
      .replace(/(\s|&nbsp;)+/g, " ")
      .replace(/^(Figure|Fig\.|Scheme)(?:\s\d+\.?)?\s*/, "");

    let { type, id } = extractFigureInfo(element.id);
    const figList = element.querySelectorAll("ol li");
    const hasHiRes = figList.length >= 2 ? true : false;
    const htmlUrl = hasHiRes
      ? (figList[1].querySelector("a")?.href as string)
      : (figList[0].querySelector("a")?.href as string);
    const originUrl = hasHiRes
      ? (figList[0].querySelector("a")?.href as string)
      : htmlUrl;
    const figInfo: FigInfo = {
      id,
      name,
      htmlUrl,
      originUrl,
      selected: false,
    };

    if (type === "sch") {
      figuresData.siFigs?.push(figInfo);
    } else {
      figuresData.mainFigs.push(figInfo);
    }
  });
  figuresData.mainFigs.forEach((e,i)=>{
    e.id = i +1
  })
  if (figuresData.siFigs?.length !== 0) {
    figuresData.hasSi = true;
    figuresData.siTitle = "Scheme";
  }

  return figuresData;
}

function extractFigureInfo(input: string): {
  type: string;
  id: number;
} {
  //BUG https://www.sciencedirect.com/science/article/pii/S1385894724022514#f0005
  if (/^\d+$/.test(input)) {
    return {
      type: "fig",
      id: Number(input),
    };
  }
  const match = input.match(/\d+/);
  if (match) {
    return {
      type: input.startsWith("sch") ? "sch" : "fig",
      id: Number(match[0]),
    };
  }
  return {
    type: "",
    id: 0,
  };
}
