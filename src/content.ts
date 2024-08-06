import { getFiguresFromNature } from "./Parsers/nature";
import { getFiguresFromACS } from "./Parsers/acs";
import type { FiguresData } from "./types/parser";

function handleGetData(
  request: { current: "nature" | "acs" },
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
  }
}
chrome.runtime.onMessage.addListener(handleGetData);
