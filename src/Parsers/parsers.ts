import { getFiguresFromNature } from "@/Parsers/nature";
import { getFiguresFromACS } from "@/Parsers/acs";
import { getFiguresFromWiley } from "@/Parsers/wiley";

export function findJournalForUrl(url: string): string | null {
    const supportWebsites = ["nature", "acs", "wiley"];
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

export const figParsers = {
    nature:getFiguresFromNature,
    acs:getFiguresFromACS,
    wiley:getFiguresFromWiley
}
