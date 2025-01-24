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
export function getFilesFromRSC(): FilesData {
  let filesData: FilesData = {
    from: "rsc",
    files: [],
    hasSrc: false,
    srcFiles: [],
    title: "Supplementary Information",
  };

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

  const titleNode = document.querySelector(".article__title")?.querySelector("h2");
  if (!titleNode) {
    return figuresData;
  }
  const title = Array.from(titleNode.childNodes)
  .filter(node => node.nodeType === Node.TEXT_NODE)
  .map(node => node.nodeValue)
  .join('').trim();
  console.log("title", title);
  if (typeof title !== "string") {
    return figuresData;
  }
  figuresData.title = title;

  
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
