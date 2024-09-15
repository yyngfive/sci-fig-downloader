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

import { getFiguresFromNature, getFilesFromNature } from "@/Parsers/nature";
import { getFiguresFromACS, getFilesFromACS } from "@/Parsers/acs";
import { getFiguresFromWiley, getFilesFromWiley } from "@/Parsers/wiley";
import { getFiguresFromScience, getFilesFromScience } from "./science";
import { getFiguresFromScienceDirect,getFilesFromScienceDirect } from "./sciencedirect";
import { getFiguresFromOUP,getFilesFromOUP } from "./oup";
import { FiguresData, FilesData } from "@/types/parser";

export function findJournalForUrl(url: string): string | null {
  const supportWebsites = ["nature", "acs", "wiley", "science","sciencedirect","oup"];
  console.log(url);
  if (!url.startsWith("http")) {
    return null;
  }
  const domain = url.split("/")[2].split(".");
  if (domain.length >= 2) {
    const top = domain[domain.length - 2];
    console.log(top, "top");

    if (supportWebsites.includes(top)) {
      return top;
    }
  }
  return null;
}

export const figParsers: Record<FiguresData["from"], () => FiguresData> = {
  nature: getFiguresFromNature,
  acs: getFiguresFromACS,
  wiley: getFiguresFromWiley,
  science: getFiguresFromScience,
  sciencedirect:getFiguresFromScienceDirect,
  oup:getFiguresFromOUP,
};

export const fileParsers: Record<FilesData["from"], () => FilesData> = {
  acs: getFilesFromACS,
  nature: getFilesFromNature,
  science: getFilesFromScience,
  wiley: getFilesFromWiley,
  sciencedirect:getFilesFromScienceDirect,
  oup:getFilesFromOUP,
};

export function getFiguresFrom(Journal: FiguresData["from"]) {
  return figParsers[Journal]();
}

export function getFilesFrom(Journal: FilesData["from"]) {
  return fileParsers[Journal]();
}
