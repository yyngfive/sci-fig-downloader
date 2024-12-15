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

export function getFilesFromScience(): FilesData {
  let filesData: FilesData = {
    from: "science",
    files: [],
    hasSrc: false,
    title: "Supplementary Materials",
  };
  const supportedList = document.querySelector("#supplementary-materials");
  if (!supportedList) {
    return filesData;
  }

  const fileLinks = supportedList.querySelectorAll(
    ".core-supplementary-material"
  );
  fileLinks?.forEach((si, index) => {
    const id = index + 1;
    const description = si
      .querySelector(".core-description")
      ?.querySelectorAll("div, span") as NodeListOf<HTMLDivElement>;
    const name = Array.from(description)
      .map((element) => {
        return element.textContent || "";
      })
      .join(" ");
    const link = si
      .querySelector(".core-link")
      ?.querySelector("a") as HTMLAnchorElement;
    const originUrl = link.href;
    console.log(link);

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

export function getFiguresFromScience(): FiguresData {
  let figuresData: FiguresData = {
    title: "请等待页面加载完成后重新加载",
    hasSi: false,
    hasToc: false,
    mainFigs: [],
    siFigs: [],
    from: "science",
  };

  const title = document.querySelector("h1")?.textContent;
  console.log("title", title);

  if (typeof title !== "string") {
    return figuresData;
  }
  figuresData.title = title;

  const abstract = document.querySelectorAll('section[property="abstract"]');
  let abstractFigElement:undefined | HTMLImageElement | null = undefined;
  abstract.forEach((e) => {});
  for (let e of abstract) {
    if (e.querySelector("figure")?.querySelector("img")) {
      abstractFigElement = e.querySelector("figure")?.querySelector("img");
      break;
    }
  }
  if (abstractFigElement) {
    const id = 1;
    const name = "Graphical Abstract";
    const baseUrl = abstractFigElement.src
      ? abstractFigElement.src
      : abstractFigElement.querySelector("img")?.getAttribute("data-src");
    const htmlUrl = `${baseUrl}`;
    const originUrl = htmlUrl.replace("medium", "large").replace("gif", "jpeg");
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

  const figureList = document.querySelector("#bodymatter");
  if (!figureList) {
    return figuresData;
  }

  const figures = figureList.querySelectorAll("figure");
  figures.forEach((element) => {
    let captionElement = element.querySelector("figcaption");
    if (captionElement?.querySelector(".caption")) {
      captionElement = captionElement.querySelector(".caption");
    }
    const heading = captionElement?.querySelector(".heading")?.textContent?.replace(/(\s|&nbsp;)+/g, " ") as string;
    let captionCopy = captionElement?.cloneNode(true) as HTMLDivElement;
    captionCopy.removeChild(captionCopy.querySelector(".heading") as Node)
    const figName = captionCopy.textContent?.replace(/(\s|&nbsp;)+/g, " ") as string;
    const name = figName.slice(0,2) === ". " ? figName.slice(2)  : figName;
    const [type, id] = heading.split(". ") || ["",""]
    const baseUrl = element.querySelector("img")?.src
      ? (element.querySelector("img")?.src as string)
      : (element.querySelector("img")?.getAttribute("data-src") as string);
    const htmlUrl = `${baseUrl}`;
    const originUrl = htmlUrl;

    const figInfo: FigInfo = {
      id: Number(id),
      name,
      htmlUrl,
      originUrl,
      selected: false,
    };

    if (type.startsWith("Sch")) {
      figuresData.siFigs?.push(figInfo);
    } else if (type.startsWith("Fig")) {
      figuresData.mainFigs.push(figInfo);
    } else {
      return;
    }
  });
  if (figuresData.siFigs?.length !== 0) {
    figuresData.hasSi = true;
    figuresData.siTitle = "Scheme";
  }

  return figuresData;
}
