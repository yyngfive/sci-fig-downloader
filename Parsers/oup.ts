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

  const fileLinks = document.querySelectorAll("div.dataSuppLink");

  fileLinks.forEach((si, index) => {
    const id = index + 1;
    const link = si.querySelector("a") as HTMLAnchorElement;
    let name = link.textContent as string;
    const originUrl = link.href;
    const fileType = getFileType(
      originUrl.split("?")[0].split("/").pop() as string
    );
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

export async function getFiguresFromOUP(): Promise<FiguresData> {
  let figuresData: FiguresData = {
    title: "",
    hasSi: false,
    hasToc: false,
    mainFigs: [],
    siFigs: [],
    from: "oup",
  };

  const title = document.querySelector("h1.wi-article-title")?.textContent;
  console.log("title", title?.trim());
  if (typeof title !== "string") {
    return figuresData;
  }
  figuresData.title = title.trim();

  const toc = document.querySelector('div[class="fig fig-section"]');

  const figureList = document.querySelectorAll(
    'div[class="fig fig-section js-fig-section"]'
  );
  await Promise.all(
    Array.from(figureList).map(async (e) => {
      const img = e.querySelector("img")!;
      const label = e.querySelector("div.fig-label");
      const caption = e.querySelector("div.fig-caption");
      const idString = label?.textContent?.split(" ")[1].split(".")[0];
      if (idString === undefined) {
        return;
      }
      const id = Number(idString);
      const name = caption?.textContent!;
      const htmlUrl = img.src
        ? (img.src as string)
        : (img.getAttribute("data-src") as string);
      const originElemet = e.querySelector(
        "a.fig-view-orig"
      ) as HTMLAnchorElement;
      fetchOriginUrlParams(originElemet.href).then((originUrl) => {
        const figInfo: FigInfo = {
          id,
          name,
          htmlUrl,
          originUrl,
          selected: false,
        };
        //console.log(figInfo, "figinfo", label?.textContent);

        if (label?.textContent?.startsWith("Fig")) {
          figuresData.mainFigs.push(figInfo);
        } else if (label?.textContent?.startsWith("Sch")) {
          figuresData.siFigs?.push(figInfo);
        }
      });
    })
  );

  console.log(figuresData.mainFigs);

  if (figuresData.siFigs?.length !== 0) {
    figuresData.hasSi = true;
    figuresData.siTitle = "Scheme";
  }

  if (toc) {
    const img = toc.querySelector("img")!;

    const id = 1;
    const name = "Graphical Abstract";

    const htmlUrl = img.src
      ? (img.src as string)
      : (img.getAttribute("data-src") as string);
    const originElement = toc.querySelector(
      "a.fig-view-orig"
    ) as HTMLAnchorElement;

    const originUrl = await fetchOriginUrlParams(originElement.href);
    const figInfo: FigInfo = {
      id,
      name,
      htmlUrl,
      originUrl,
      selected: false,
    };
    figuresData.tocFig = figInfo;
    figuresData.hasToc = true;
    console.log("1", figuresData);
  }

  figuresData = {
    ...figuresData,
    mainFigs: sortFigsById(figuresData.mainFigs),
    siFigs: sortFigsById(figuresData.siFigs as FigInfo[]),
  };
  console.log("2", figuresData);

  return figuresData;
}

async function fetchOriginUrlParams(imgUrl: string) {
  const originUrl = await fetch(imgUrl)
    .then((res) => res.text())
    .then((html) => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");
      const imgLink = doc.querySelector("a.fig-view-orig");
      if (imgLink) {
        return (imgLink as HTMLAnchorElement).href;
      } else {
        return "";
      }
    })
    .catch((error) => {
      console.error("Error fetching origin url:", error);
      return "";
    });

  return originUrl;
}

function sortFigsById(arr: FigInfo[]): FigInfo[] {
  return arr.sort((a, b) => a.id - b.id);
}
