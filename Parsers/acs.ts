import type { FiguresData, FigInfo, FileInfo, FilesData } from "@/types/parser";
import { getFileType } from "@/assets/utils/fileType";
export function getFilesFromACS(): FilesData {
  let filesData: FilesData = {
    from: "acs",
    files: [],
    hasSrc:false,
    title: "Supporting Information",
  };
  const supportedList = document.querySelector(".NLM_list-list_type-label");
  if (!supportedList) {
    return filesData;
  }

  const fileLinks = supportedList?.querySelectorAll("p");
  fileLinks?.forEach((si, index) => {
    const id = index + 1;
    // const names = si.cloneNode(true) as HTMLParagraphElement;
    // const aTags = names.querySelectorAll("a");
    // aTags.forEach((node) => {
    //   names.removeChild(node);
    // });
    // const name = names.textContent?.slice(0, -3) as string;
    const name = si.textContent?.replace(/\(.*?\)$/, '') as string
    const link = si.querySelector("a.ext-link") as HTMLAnchorElement;
    const originUrl = link.href;
    const fileType = getFileType(originUrl.split("/").pop() as string);
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



export function getFiguresFromACS(): FiguresData {
  let figuresData: FiguresData = {
    title: "请等待页面加载完成后重新加载",
    hasSi: false,
    hasToc: false,
    mainFigs: [],
    siFigs: [],
    from: "acs",
  };

  const title = document.querySelector(".hlFld-Title")?.textContent;
  console.log("title", title);
  if (typeof title !== "string") {
    return figuresData;
  }
  figuresData.title = title;

  const abstract = document.querySelector(".article_abstract");
  const abstractFigElement = abstract?.querySelector("img");
  if (abstractFigElement) {
    const id = 1;
    const name = "Graphical Abstract";
    const baseUrl = abstractFigElement.src
      ? abstractFigElement.src
      : abstractFigElement.querySelector("img")?.getAttribute("data-src");
    const htmlUrl = `${baseUrl}`;
    const originUrl = htmlUrl.replace("medium", "large").replace("gif", "jpeg");
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

  const figureList = document.querySelectorAll(".article_content")[0];
  if (figureList === undefined) {
    return figuresData;
  }
  console.log('figure list');
  
  const figures = figureList.querySelectorAll("figure");
  figures.forEach((element) => {
    const caption = element.querySelector("figcaption")?.textContent as string;
    const { type, id, name } = extractFigureInfo(caption);
    const baseUrl = element.querySelector("img")?.src
      ? (element.querySelector("img")?.src as string)
      : (element.querySelector("img")?.getAttribute("data-src") as string);
    const htmlUrl = `${baseUrl}`;
    const originUrl = htmlUrl.replace("medium", "large").replace("gif", "jpeg");

    const figInfo: FigInfo = {
      id,
      name,
      htmlUrl,
      originUrl,
      selected: false,
    };
    console.log(figInfo,'info');
    

    if (type.startsWith("Scheme")) {
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
  name: string;
} {
  const regex = /(Scheme|Figure)\s+(\d+)\.\s*(.*)/;
  const match = input.match(regex);
  if (match) {
    return {
      type: match[1],
      id: Number(match[2]),
      name: match[3],
    };
  }
  return {
    type: "Figure",
    id: 0,
    name: "",
  };
}
