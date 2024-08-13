import { getFiguresFromNature } from "@/Parsers/nature";
import { getFiguresFromACS,getFilesFromACS } from "@/Parsers/acs";
import { getFiguresFromWiley } from "@/Parsers/wiley";
import { FiguresData,FilesData } from "@/types/parser";

const figParsers = {
    nature:getFiguresFromNature,
    acs:getFiguresFromACS,
    wiley:getFiguresFromWiley
}

const fileParsers = {
    acs:getFilesFromACS
}
export function getFiguresFrom(Journal:FiguresData['from']){
    return figParsers[Journal]()
}

export function getFilesFrom(Journal:FilesData['from']){
    return fileParsers[Journal]()
}
