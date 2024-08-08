import {
  getFiguresFromACS,
  getFiguresFromNature,
  getFiguresFromWiley,
} from "@/Parsers/parsers";
import type { FiguresData } from "./types/parser";

function handleGetData(
  request: { current: "nature" | "acs" | "wiley" },
  sender: any,
  sendResponse: (arg0: FiguresData) => void
) {
  console.log("Journal", request.current);
  switch (request.current) {
    case "nature":
      const figsDataNature = getFiguresFromNature();
      sendResponse(figsDataNature);
      break;
    case "acs":
      const figsDataACS = getFiguresFromACS();
      sendResponse(figsDataACS);
      break;
    case "wiley":
      const figsDataWiley = getFiguresFromWiley();
      sendResponse(figsDataWiley);
      break;
  }
}
chrome.runtime.onMessage.addListener(handleGetData);
