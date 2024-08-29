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

import type { FiguresData, FigInfo,FileInfo,FilesData } from "@/types/parser";
import { getFileType } from "@/utils/fileType";
import { parseQueryParameters } from "@/utils/parseUrl";
export function getFilesFromWiley(): FilesData {
  let filesData: FilesData = {
    from: "wiley",
    files: [],
    hasSrc:false,
    title: "Supporting Information",
  };
  const supportedTable = document.querySelector(".support-info__table");
  if (!supportedTable) {
    return filesData;
  }
  console.log(window.location.href);
  
  const fileLinks = supportedTable?.querySelectorAll("tr");
  fileLinks?.forEach((si, index) => {
    if(index === 0){return}
    const id = index;
    const cells = si.querySelectorAll('td')
    const name = cells[1].textContent as string
    const originUrl = cells[0].querySelector('a')?.href as string

    const fileName = parseQueryParameters(originUrl)
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

export function getFiguresFromWiley(): FiguresData {
  
  const title = document.querySelector(".citation__title")
    ?.textContent as string;
  console.log("title", title);

  let figuresData: FiguresData = {
    title: title,
    hasSi: false,
    hasToc: false,
    mainFigs: [],
    siFigs: [],
    from: "wiley",
  };

  const figureList = document.querySelector(
    ".article-section__full"
  );
  if(!figureList){return figuresData}
  const figures = figureList.querySelectorAll("figure");
  console.log(figureList);

  figures.forEach((element) => {
    const captionText = element.querySelector(
      ".figure__caption-text"
    )
    if(!captionText){return}
    const name = getTextWithoutClass(captionText as HTMLElement, "bibLink");
    const captionTitle = element.querySelector(".figure__title")
      ?.textContent as string;
    const type = captionTitle.split(" ")[0];
    const id = Number(captionTitle.split(" ")[1]);
    const htmlUrl = element.querySelector("img")?.src as string;
    const baseUrl = element
      .querySelector("img")
      ?.getAttribute("data-lg-src") as string;
    let domain;
    if (htmlUrl.startsWith("https://online")) {
      domain = "https://onlinelibrary.wiley.com";
    } else {
      domain = "https://chemistry-europe.onlinelibrary.wiley.com";
    }
    const originUrl = domain + baseUrl;
    const figInfo: FigInfo = {
      id,
      name,
      htmlUrl,
      originUrl,
      selected: false,
    };
    console.log(figInfo);
    

    if (type.startsWith("Scheme")) {
      figuresData.siFigs?.push(figInfo);
    } else {
      figuresData.mainFigs.push(figInfo);
    }
  });
  if (figuresData.siFigs?.length !== 0) {
    figuresData.hasSi = true;
    figuresData.siTitle = "Scheme";
  }

  const abstract = document.querySelector(".abstract-group");
  const abstractFigElement = abstract
    ?.querySelector("figure")
    ?.querySelector("img");
  if (abstractFigElement) {
    const id = 1;
    const name = "Graphical Abstract";
    const baseUrl = abstractFigElement.src;
    const htmlUrl = `${baseUrl}`;
    const originUrl = abstractFigElement.getAttribute("data-lg-src") as string;
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

  return figuresData;
}

function getTextWithoutClass(element: HTMLElement, className: string) {
  const children: HTMLElement[] = Array.from(element.childNodes).filter(
    (node): node is HTMLElement => {
      return node.nodeType === Node.ELEMENT_NODE;
    }
  );
  // 过滤掉具有指定类名的节点
  const filteredChildren = children.filter(
    (child) => !child.classList.contains(className)
  );

  // 将过滤后的节点的textContent合并
  return filteredChildren.map((node) => node.textContent).join("");
}