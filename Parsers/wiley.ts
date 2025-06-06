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
import { getFileType, default_file } from "@/utils/fileType";
import { parseQueryParameters } from "@/utils/parseUrl";
export function getFilesFromWiley(): FilesData {
  let filesData: FilesData = {
    from: "wiley",
    files: [],
    hasSrc: false,
    title: "Supporting Information",
    article: default_file,
  };

  const title = document.querySelector(".citation__title")?.textContent;
  if (typeof title === "string") {
    const article_title = title;
    const article_url = document.querySelector("a.pdf-download");
    if (article_url instanceof HTMLAnchorElement) {
      const article: FileInfo = {
        id: 0,
        name: article_title,
        fileType: "pdf",
        originUrl: article_url.href.replace("epdf", "pdf"),
        selected: false,
      };
      console.log("article", article);
      
      filesData.article = article;
    }
  }

  const supportedTable = document.querySelector(".support-info__table");
  if (!supportedTable) {
    return filesData;
  }

  const fileLinks = supportedTable?.querySelectorAll("tr");
  fileLinks?.forEach((si, index) => {
    if (index === 0) {
      return;
    }
    const id = index;
    const cells = si.querySelectorAll("td");
    const name = cells[1].textContent as string;
    const originUrl = cells[0].querySelector("a")?.href as string;

    const fileName = parseQueryParameters(originUrl);
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
  let figuresData: FiguresData = {
    title: "请等待页面加载完成后重新加载",
    hasSi: false,
    hasToc: false,
    mainFigs: [],
    siFigs: [],
    from: "wiley",
  };

  const title = document.querySelector(".citation__title")?.textContent;
  if (typeof title !== "string") {
    return figuresData;
  }
  console.log("title", title);
  figuresData.title = title;

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

  const figureList = document.querySelector(".article-section__full");
  if (!figureList) {
    return figuresData;
  }
  const figures = figureList.querySelectorAll("figure");

  figures.forEach((element) => {
    const captionText = element.querySelector(".figure__caption-text");
    if (!captionText) {
      return;
    }
    const name = getTextWithoutRef(captionText as HTMLElement, "bibLink").trim();
  
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

  return figuresData;
}

function getTextWithoutRef(element: HTMLElement, className: string) {
  // const children: HTMLElement[] = Array.from(element.childNodes).filter(
  //   (node): node is HTMLElement => {
  //     console.log('node '+node);

  //     return node.nodeType === Node.ELEMENT_NODE;
  //   }
  // );

  // 过滤掉具有指定类名的节点
  // const filteredChildren = children.filter(
  //   (child) => !child.classList.contains(className)
  // );

  // 将过滤后的节点的textContent合并
  //return filteredChildren.map((node) => node.textContent).join("");
  const node = element.cloneNode(true) as HTMLElement;
  const refLinks = node.querySelectorAll(`a.${className}`);
  refLinks.forEach((e) => {
    e.remove();
  });
  const text = node.textContent!;
  return text;
}
