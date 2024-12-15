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

export function getFilesFromACS(): FilesData {
  let filesData: FilesData = {
    from: "acs",
    files: [],
    hasSrc:false,
    title: "Supporting Information",
  };
  const supportedList = document.querySelector(".NLM_list-list_type-label");
  let supportedAnchor
  if (!supportedList) {
    supportedAnchor = document.querySelector(".supInfoBoxOnFTP ");
    if(!supportedAnchor) {
      return filesData;
    }
  }

  let fileLinks
  if(!supportedList?.querySelectorAll("p")) {
    fileLinks = supportedAnchor?.querySelectorAll("li");
  }else{
    fileLinks = supportedList.querySelectorAll("p");
  }
  fileLinks?.forEach((si, index) => {
    const id = index + 1;
    const name = si.textContent?.replace(/\(.*?\)$/, '') as string
    const link = si.querySelector("a.ext-link") ? si.querySelector("a.ext-link") as HTMLAnchorElement : si.querySelector("a") as HTMLAnchorElement;
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

export function getFiguresFromACS(): FiguresData {
  let figuresData: FiguresData = {
    title: "请等待页面加载完成后重新加载",
    hasSi: false,
    hasToc: false,
    mainFigs: [],
    siFigs: [],
    from: "acs",
  };

  const title = document.querySelector(".hlFld-Title")?.textContent;
  console.log("title", title);
  if (typeof title !== "string") {
    return figuresData;
  }
  figuresData.title = title;

  const abstract = document.querySelector(".article_abstract");
  const abstractFigElement = abstract?.querySelector("img");
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

  const figureList = document.querySelectorAll(".article_content")[0];
  if (!figureList) {
    return figuresData;
  }
  
  const figures = figureList.querySelectorAll("figure");
  console.log(figures.length);
  
  figures.forEach((element) => {
    const caption = element.querySelector("figcaption")?.textContent;
    if (!caption) {
      return figuresData;
    }
    const { type, id, name } = extractFigureInfo(caption);
   
    const baseUrl = element.querySelector("img")?.src
      ? (element.querySelector("img")?.src as string)
      : (element.querySelector("img")?.getAttribute("data-src") as string);
    const htmlUrl = `${baseUrl}`;
    const originUrl = htmlUrl.replace("medium", "large").replace("gif", "jpeg");

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

function extractFigureInfo(input: string): {
  type: string;
  id: number;
  name: string;
} {
  const regex = /(Scheme|Figure)\s+(\d+)\.\s*(.*)/;
  
  const match_title = input.match(regex);
  
  if (match_title) {
    
    return {
      type: match_title[1],
      id: Number(match_title[2]),
      name: match_title[3],
    };
  }
  return {
    type: "Figure",
    id: 0,
    name: "",
  };
}
