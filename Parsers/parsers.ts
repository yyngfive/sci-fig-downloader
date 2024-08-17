import { getFiguresFromNature, getFilesFromNature } from "@/Parsers/nature";
import { getFiguresFromACS, getFilesFromACS } from "@/Parsers/acs";
import { getFiguresFromWiley, getFilesFromWiley } from "@/Parsers/wiley";
import { getFiguresFromScience, getFilesFromScience } from "./science";
import { FiguresData, FilesData } from "@/types/parser";

export function findJournalForUrl(url: string): string | null {
  const supportWebsites = ["nature", "acs", "wiley", "science"];
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
};

export const fileParsers: Record<FilesData["from"], () => FilesData> = {
  acs: getFilesFromACS,
  nature: getFilesFromNature,
  science: getFilesFromScience,
  wiley: getFilesFromWiley,
};

export function getFiguresFrom(Journal: FiguresData["from"]) {
  return figParsers[Journal]();
}

export function getFilesFrom(Journal: FilesData["from"]) {
  return fileParsers[Journal]();
}
