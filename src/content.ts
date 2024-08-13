import { getFiguresFrom } from "@/Parsers/parsers";
import type { FiguresData } from "./types/parser";

function handleGetData(
  request: { current: FiguresData["from"] },
  sender: any,
  sendResponse: (arg0: FiguresData) => void
) {
  console.log("Journal", request.current);
  const figsData = getFiguresFrom(request.current);
  // const figsData: FiguresData = {
  //   title: "Test",
  //   hasSi: true,
  //   hasToc: true,
  //   siFigs: [
  //     {
  //       id: 1,
  //       name: "SI 1",
  //       htmlUrl: "url1",
  //       originUrl: "url2",
  //       selected: false,
  //     },
  //   ],
  //   mainFigs: [
  //     {
  //       id: 1,
  //       name: "Fig 1 Erat feugiat gubergren consectetuer. Dolores duo eros vero nonumy magna sit magna eum elit. Facilisi elit commodo est ut et rebum accumsan vulputate labore diam dolore consequat dolore no vero sit suscipit. Accusam sed labore in at dolore. Sadipscing rebum delenit rebum dolor dolor voluptua ipsum zzril erat amet lorem euismod amet ",
  //       htmlUrl: "url1",
  //       originUrl: "url2",
  //       selected: false,
  //     },
  //   ],
  //   siTitle: "Extended Data Figures",
  //   from: "nature",
  //   tocFig: {
  //     id: 1,
  //     name: "Abstract",
  //     htmlUrl: "url1",
  //     originUrl: "url2",
  //     selected: false,
  //   },
  // };
  sendResponse(figsData);
}
chrome.runtime.onMessage.addListener(handleGetData);
