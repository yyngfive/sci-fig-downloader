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

export function getFilesFromPNAS(): FilesData {
  let filesData: FilesData = {
    from: "pnas",
    files: [],
    hasSrc: false,
    title: "Supporting Information",
    article: default_file,
  };

  const title = document.querySelector("h1")?.textContent;
  if (!title) {
    return filesData;
  }
  const article_title = title;
  const article_url = document.querySelector(
    'a[aria-label="Open full-text in eReader"]'
  );
  if (article_url instanceof HTMLAnchorElement) {
    const article: FileInfo = {
      id: 0,
      name: article_title,
      fileType: "pdf",
      originUrl: article_url.href.replace("reader", "pdf"),
      selected: false,
    };
    filesData.article = article;
  }

  const si_files = document.querySelectorAll(".core-supplementary-material");
  si_files.forEach((si, index) => {
    const id = index + 1;
    const name = si
      .querySelector(".core-description div")
      ?.textContent?.replace(/\([^()]*\)/g, '').trim()!;

    const originUrl = si.querySelector("a")?.href as string;
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

export function getFiguresFromPNAS(): FiguresData {
  let figuresData: FiguresData = {
    title: "",
    hasSi: false,
    hasToc: false,
    mainFigs: [],
    siFigs: [],
    from: "pnas",
  };

  const title = document.querySelector("h1")?.textContent;
  if (title) {
    figuresData.title = title;
  }

  const figureList = document.querySelectorAll(".figure-wrap");
  figureList.forEach((element, index) => {
    const figure_class = element.querySelector("figure")?.getAttribute("class");
    if (!figure_class?.includes("graphic")) {
      return;
    }
    const type_id = element.querySelector("header")?.textContent?.split(" ")[1];
    if (!type_id) {
      return;
    }
    const id = Number(type_id.replace("S", ""));
    const name = element.querySelector("figcaption")?.textContent as string;
    const img = element.querySelector("img");
    const htmlUrl = img?.src
      ? (img?.src as string)
      : (img?.getAttribute("data-src") as string);
    const originUrl = htmlUrl;
    const figure_info: FigInfo = {
      id,
      name,
      htmlUrl,
      originUrl,
      selected: false,
    };
    if (type_id.startsWith("S")) {
      figuresData.siFigs?.push(figure_info);
    } else {
      figuresData.mainFigs.push(figure_info);
    }
  });

  if (figuresData.siFigs?.length !== 0) {
    figuresData.hasSi = true;
    figuresData.siTitle = "SI Figure";
  }

  return figuresData;
}
