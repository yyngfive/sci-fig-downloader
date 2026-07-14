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
import {
  getFiguresFromScienceDirect,
  getFilesFromScienceDirect,
} from "./sciencedirect";
import { getFiguresFromOUP, getFilesFromOUP } from "./oup";
import { getFiguresFromRSC, getFilesFromRSC } from "./rsc";
import { getFiguresFromPNAS, getFilesFromPNAS } from "./pnas";
// publisher-generator:imports
import type { FiguresData, FilesData, Publisher } from "@/types/parser";

export const publisherHosts: Record<Publisher, string[]> = {
  nature: ["nature.com"],
  acs: ["pubs.acs.org"],
  wiley: ["onlinelibrary.wiley.com"],
  science: ["science.org"],
  sciencedirect: ["sciencedirect.com", "sciencedirectassets.com"],
  oup: ["academic.oup.com"],
  rsc: ["pubs.rsc.org"],
  pnas: ["pnas.org"],
  // publisher-generator:hosts
};

export function findJournalForUrl(url: string): Publisher | null {
  let hostname: string;
  try {
    hostname = new URL(url).hostname.toLowerCase();
  } catch {
    return null;
  }

  for (const [publisher, hosts] of Object.entries(publisherHosts) as [
    Publisher,
    string[],
  ][]) {
    if (hosts.some((host) => hostname === host || hostname.endsWith(`.${host}`))) {
      return publisher;
    }
  }
  return null;
}

export const figParsers: Record<
  Publisher,
  () => FiguresData | Promise<FiguresData>
> = {
  nature: getFiguresFromNature,
  acs: getFiguresFromACS,
  wiley: getFiguresFromWiley,
  science: getFiguresFromScience,
  sciencedirect: getFiguresFromScienceDirect,
  oup: getFiguresFromOUP,
  rsc: getFiguresFromRSC,
  pnas: getFiguresFromPNAS,
  // publisher-generator:figure-parsers
};

export const fileParsers: Record<Publisher, () => FilesData> = {
  acs: getFilesFromACS,
  nature: getFilesFromNature,
  science: getFilesFromScience,
  wiley: getFilesFromWiley,
  sciencedirect: getFilesFromScienceDirect,
  oup: getFilesFromOUP,
  rsc: getFilesFromRSC,
  pnas: getFilesFromPNAS,
  // publisher-generator:file-parsers
};

export function getFiguresFrom(publisher: Publisher) {
  return figParsers[publisher]();
}

export function getFilesFrom(publisher: Publisher) {
  return fileParsers[publisher]();
}
