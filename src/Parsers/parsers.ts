import { getFiguresFromNature } from "@/Parsers/nature";
import { getFiguresFromACS } from "@/Parsers/acs";
import { getFiguresFromWiley } from "@/Parsers/wiley";
import { FiguresData } from "@/types/parser";

const figParsers = {
    nature:getFiguresFromNature,
    acs:getFiguresFromACS,
    wiley:getFiguresFromWiley
}



export function getFiguresFrom(Journal:FiguresData['from']){
    return figParsers[Journal]()
}
