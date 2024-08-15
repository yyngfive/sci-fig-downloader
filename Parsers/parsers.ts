import { getFiguresFromNature } from "@/Parsers/nature";
import { getFiguresFromACS,getFilesFromACS } from "@/Parsers/acs";
import { getFiguresFromWiley } from "@/Parsers/wiley";
import { FiguresData,FilesData } from "@/types/parser";

export const figParsers:Record<FiguresData['from'],()=>FiguresData> = {
    nature:getFiguresFromNature,
    acs:getFiguresFromACS,
    wiley:getFiguresFromWiley
}

export const fileParsers:Record<FilesData['from'],()=>FilesData> = {
    acs:getFilesFromACS
}

export function getFiguresFrom(Journal:FiguresData['from']){
    return figParsers[Journal]()
}

export function getFilesFrom(Journal:FilesData['from']){
    return fileParsers[Journal]()
}
