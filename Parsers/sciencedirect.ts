import type { FiguresData, FigInfo, FileInfo, FilesData } from "@/types/parser";
import { getFileType } from "@/assets/utils/fileType";
export function getFilesFromScienceDirect(): FilesData {
  let filesData: FilesData = {
    from: "sciencedirect",
    files: [],
    hasSrc: false,
    title: "",
  };
  //抓display class
  const supportedList = document.querySelector(".Appendices");
  if (!supportedList) {
    return filesData;
  }
  const title = supportedList.querySelector("h2")?.textContent;
  if (typeof title !== "string") {
    return filesData;
  }
  filesData.title = title;
  const fileLinks = supportedList?.querySelectorAll(".display");
  fileLinks?.forEach((si, index) => {
    const id = index + 1;
    const name = si.querySelector(".captions")?.textContent as string;
    const link = si.querySelector("a.download-link") as HTMLAnchorElement;
    let originUrl = link.href;
    const fileType = getFileType(originUrl.split("/").pop() as string);
    if (fileType === "figure") {
      const figList = si.querySelectorAll("ul li");
      const hasHiRes = figList.length >= 2 ? true : false;
      originUrl = hasHiRes
        ? (figList[0].querySelector("a")?.href as string)
        : (figList[1].querySelector("a")?.href as string);
    }
    const fileInfo: FileInfo = {
      id,
      name,
      fileType,
      originUrl,
      selected: false,
    };
    filesData.files.push(fileInfo);
  });

  return filesData;
}

export function getFiguresFromScienceDirect(): FiguresData {
  let figuresData: FiguresData = {
    title: "请等待页面加载完成后重新加载",
    hasSi: false,
    hasToc: false,
    mainFigs: [],
    siFigs: [],
    from: "sciencedirect",
  };

  const title = document.querySelector("h1 .title-text")?.textContent;
  console.log("title", title);
  if (typeof title !== "string") {
    return figuresData;
  }
  figuresData.title = title;

  const abstract = document.querySelector('div[class="abstract graphical"]');

  if (abstract) {
    const id = 1;
    const name = "Graphical Abstract";
    const figList = abstract.querySelectorAll("ol li");
    const hasHiRes = figList.length >= 2 ? true : false;
    const htmlUrl = hasHiRes
      ? (figList[1].querySelector("a")?.href as string)
      : (figList[0].querySelector("a")?.href as string);
    const originUrl = hasHiRes
      ? (figList[0].querySelector("a")?.href as string)
      : htmlUrl;
    const figInfo: FigInfo = {
      id,
      name,
      htmlUrl,
      originUrl,
      selected: false,
    };
    figuresData.tocFig = figInfo;
    figuresData.hasToc = true;
  }

  const figureList = document.querySelector("#body");

  if (!figureList) {
    return figuresData;
  }

  const figures = figureList.querySelectorAll("figure.figure");
  figures.forEach((element) => {
    const caption = element.querySelector(".captions")?.textContent as string;

    const name = caption
      .replace(/(\s|&nbsp;)+/g, " ")
      .replace(/^(Figure|Fig\.|Scheme)(?:\s\d+\.?)?\s*/, "");

    let { type, id } = extractFigureInfo(element.id);
    const figList = element.querySelectorAll("ol li");
    const hasHiRes = figList.length >= 2 ? true : false;
    const htmlUrl = hasHiRes
      ? (figList[1].querySelector("a")?.href as string)
      : (figList[0].querySelector("a")?.href as string);
    const originUrl = hasHiRes
      ? (figList[0].querySelector("a")?.href as string)
      : htmlUrl;
    const figInfo: FigInfo = {
      id,
      name,
      htmlUrl,
      originUrl,
      selected: false,
    };

    if (type === "sch") {
      figuresData.siFigs?.push(figInfo);
    } else {
      figuresData.mainFigs.push(figInfo);
    }
  });
  if (figuresData.siFigs?.length !== 0) {
    figuresData.hasSi = true;
    figuresData.siTitle = "Scheme";
  }

  return figuresData;
}

function extractFigureInfo(input: string): {
  type: string;
  id: number;
} {
  if (/^\d+$/.test(input)) {
    return {
      type: "fig",
      id: Number(input),
    };
  }
  const match = input.match(/\d+/);
  if (match) {
    return {
      type: input.startsWith("sch") ? "sch" : "fig",
      id: Number(match[0]),
    };
  }
  return {
    type: "",
    id: 0,
  };
}
