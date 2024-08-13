import { figParsers } from "@/Parsers/parsers";
import type { FiguresData } from "./types/parser";

function handleGetData(
  request: { current: FiguresData["from"] },
  sender: any,
  sendResponse: (arg0: FiguresData) => void
) {
  console.log("Journal", request.current);
  const figsData = figParsers[request.current]();
  sendResponse(figsData);
}
chrome.runtime.onMessage.addListener(handleGetData);
