import {
  getFiguresFrom,
  getFilesFrom,
  figParsers,
  fileParsers,
} from "@/Parsers/parsers";
import type { FiguresData, FilesData } from "@/types/parser";

function handleGetFigsData(
  request: {
    from: FiguresData["from"];
    type: string;
  },
  sender: any,
  sendResponse: (arg0: FiguresData) => void
) {
  if (request.type !== "fig") {
    return;
  }
  if (!Object.keys(figParsers).includes(request.from)) {
    return;
  }
  console.log("Journal (Figure)", request.from);
  const figsData = getFiguresFrom(request.from);
  sendResponse(figsData);
}
chrome.runtime.onMessage.addListener(handleGetFigsData);

function handleGetFilesData(
  request: {
    from: FilesData["from"];
    type: string;
  },
  sender: any,
  sendResponse: (arg0: FilesData) => void
) {
  if (request.type !== "file") {
    return;
  }
  if (!Object.keys(fileParsers).includes(request.from)) {
    return;
  }
  console.log("Journal (File)", request.from);
  const filesData = getFilesFrom(request.from);
  console.log(filesData);

  sendResponse(filesData);
}
chrome.runtime.onMessage.addListener(handleGetFilesData);
