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
export function getFilesFromNature(): FilesData {
  let filesData: FilesData = {
    from: "nature",
    files: [],
    hasSrc: false,
    srcFiles: [],
    title: "Supplementary Information",
  };
  const supportedList = document.querySelector(
    'section[data-title="Supplementary information"],section[data-title="Supplementary Information"]'
  );
  if (!supportedList) {
    return filesData;
  }
  //TODO :修改逻辑
  const fileLinks = supportedList.querySelectorAll(
    "div.c-article-supplementary__item"
  );

  fileLinks.forEach((si, index) => {
    const id = index + 1;
    const link = si.querySelector("a.print-link") as HTMLAnchorElement;
    let name = link.textContent as string;
    const subName = si.querySelector(".c-article-supplementary__description");

    if (subName !== null) {
      name = `${name}: ${subName.textContent}`;
    }
    const originUrl = link.href;
    const fileType = getFileType(originUrl.split("/").pop() as string);
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

//TODO：未解锁文章的图片抓取

export function getFiguresFromNature(): FiguresData {
  let figuresData: FiguresData = {
    title: "",
    hasSi: false,
    hasToc: false,
    mainFigs: [],
    siFigs: [],
    from: "nature",
  };

  const title = document.querySelector("h1")?.textContent;
  console.log("title", title);
  if (typeof title !== "string") {
    return figuresData;
  }
  figuresData.title = title;

  const abs = document.querySelector('section[data-title="Abstract"]');
  const img = abs?.querySelector("img");
  if (img) {
    figuresData.hasToc = true;
    const id = 1;
    const name = "Graphical Abstract";

    const htmlUrl = img.src
      ? (img.src as string)
      : (img.getAttribute("data-src") as string);
    const originUrl = htmlUrl.replace("lw685", "full");
    const figInfo: FigInfo = {
      id,
      name,
      htmlUrl,
      originUrl,
      selected: false,
    };
    figuresData.tocFig = figInfo;
  }

  const figureList = document.querySelector(".main-content");
  if (!figureList) {
    return figuresData;
  }
  const figures = figureList.querySelectorAll("figure");
  figures.forEach((element) => {
    const caption = element.querySelector("b")?.textContent as string;
    const { id, name } = extractFigureInfo(caption);
    const img = element.querySelector("img");
    if (!img || id === 0) {
      return;
    }
    const htmlUrl = img?.src
      ? (img?.src as string)
      : (img?.getAttribute("data-src") as string);

    const originUrl = htmlUrl.replace("lw685", "full");

    const fig_info: FigInfo = {
      id,
      name,
      htmlUrl,
      originUrl,
      selected: false,
    };
    figuresData.mainFigs.push(fig_info);
  });

  const siFigTitles = [
    "Integrated supplementary information",
    "Extended data figures and tables",
    "Extended data",
  ];

  const sections = document.querySelectorAll("section");
  let siFigList;
  for (const e of sections) {
    if (siFigTitles.includes(e.getAttribute("data-title") as string)) {
      siFigList = e;
      break;
    }
  }

  console.log(siFigList?.querySelectorAll("a"), "AAA");
  if (!siFigList) {
    return figuresData;
  }
  siFigList.querySelectorAll("a.print-link").forEach((link) => {
    const caption = link.textContent as string;
    const { id, name } = extractFigureInfo(caption);
    if (id === 0) {
      return;
    }
    const htmlUrl = ("https:" +
      link.getAttribute("data-supp-info-image")) as string;
    const originUrl = htmlUrl.replace("lw685", "full");
    const figInfo: FigInfo = {
      id,
      name,
      htmlUrl,
      originUrl,
      selected: false,
    };
    figuresData.siFigs?.push(figInfo);
  });
  console.log(figuresData.siFigs);

  if (figuresData.siFigs?.length !== 0) {
    figuresData.hasSi = true;
    figuresData.siTitle = "Extended Data Figure";
  }
  return figuresData;
}

function extractFigureInfo(input: string): { id: number; name: string } {
  const regex =
    /(Figure|Fig\.|Extended Data Fig\.|Supplementary Figure) (\d+):?\s*(.*)/;
  const match = input.match(regex);
  if (match) {
    return {
      id: Number(match[2]),
      name: match[3],
    };
  }
  return {
    id: 0,
    name: "",
  };
}
