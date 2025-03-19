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

import { getFileType,default_file } from "@/utils/fileType";

//BUG: https://pubs.rsc.org/en/content/articlelanding/2023/cp/d3cp01147j
export function getFilesFromRSC(): FilesData {
  let filesData: FilesData = {
    from: "rsc",
    files: [],
    hasSrc: false,
    srcFiles: [],
    title: "Supplementary files",
    article: default_file,
  };

  const article_section = document.querySelector("#DownloadOption")?.querySelector("a")
  if(!article_section) {
    return filesData; 
  }
  const titleNode = document
    .querySelector(".article__title")
    ?.querySelector("h2");
  if (!titleNode) {
    return filesData;
  }
  const title = getTextOnly(titleNode).trim();
  if (typeof title !== "string") {
    return filesData;
  }
  const article:FileInfo = {
    id: 0,
    name: title,
    fileType: "pdf",
    originUrl: article_section.href,
    selected: false,
  }
  filesData.article = article;

  const sections = document.querySelector("div.list-control ul.list__collection");
  if (!sections) {
    return filesData;
  }
  const files = sections.querySelectorAll("li");
  console.log(files);
  
  files.forEach((si, index) => {
    const id = index + 1;
    const link = si.querySelector("a") as HTMLAnchorElement;
    let name = getTextOnly(link.querySelector('span') as HTMLSpanElement).trim();
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

export function getFiguresFromRSC(): FiguresData {
  let figuresData: FiguresData = {
    title: "",
    hasSi: false,
    hasToc: false,
    mainFigs: [],
    siFigs: [],
    from: "rsc",
  };

  const titleNode = document
    .querySelector(".article__title")
    ?.querySelector("h2");
  if (!titleNode) {
    return figuresData;
  }
  const title = getTextOnly(titleNode).trim();
  console.log("title", title);
  if (typeof title !== "string") {
    return figuresData;
  }
  figuresData.title = title;

  const abs = document.querySelector(".capsule__article-image");
  const img = abs?.querySelector("img");
  if (img) {
    figuresData.hasToc = true;
    const id = 1;
    const name = "Graphical Abstract";
    const htmlUrl = img.src
      ? (img.src as string)
      : (img.getAttribute("data-src") as string);
    const originUrl = htmlUrl;
    const figInfo: FigInfo = {
      id,
      name,
      htmlUrl,
      originUrl,
      selected: false,
    };
    figuresData.tocFig = figInfo;
  }

  const figureList = document.querySelectorAll("figure.img-tbl__image");
  figureList.forEach((element, index) => {
    const caption = element.querySelectorAll("figcaption span");
    if (!caption) {
      return;
    }

    const type_id = caption[0]?.textContent?.trim() as string;

    const id = Number(type_id.split(" ")[1]);
    const name = caption[1]?.textContent?.trim() as string;
    const img = element.querySelector("img");
    const htmlUrl = img?.src
      ? (img?.src as string)
      : (img?.getAttribute("data-src") as string);
    const originUrl = element.querySelector("a")?.href as string;
    const figInfo: FigInfo = {
      id,
      name,
      htmlUrl,
      originUrl,
      selected: false,
    };
    if (type_id.startsWith("Fig")) {
      figuresData.mainFigs.push(figInfo);
    } else {
      figuresData.siFigs?.push(figInfo);
    }
  });
  if (figuresData.siFigs?.length !== 0) {
    figuresData.hasSi = true;
    figuresData.siTitle = "Scheme";
  }
  return figuresData;
}

function getTextOnly(node: Node): string {
  const text = Array.from(node.childNodes)
    .filter((node) => node.nodeType === Node.TEXT_NODE)
    .map((node) => node.nodeValue)
    .join("")
  return text;
}
