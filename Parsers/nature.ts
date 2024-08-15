import type { FiguresData, FigInfo, FileInfo, FilesData } from "@/types/parser";
import { getFileType } from "@/assets/utils/fileType";
export function getFilesFromNature(): FilesData {
  let filesData: FilesData = {
    from: "nature",
    files: [],
    hasSrc: false,
    srcFiles: [],
    title: "Supplementary Information",
  };
  const supportedList = document.querySelector(
    'section[data-title="Supplementary information"]'
  );
  if (!supportedList) {
    return filesData;
  }

  const fileLinks = supportedList.querySelectorAll(
    "div.c-article-supplementary__item"
  );
  fileLinks.forEach((si, index) => {
    const id = index + 1;
    const link = si.querySelector('a.print-link') as HTMLAnchorElement
    let name = link.textContent as string
    const subName = si.querySelector('.c-article-supplementary__description')
    
    if(subName !== null){
      name = `${name}: ${subName.textContent}`
    }
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

export function getFiguresFromNature(): FiguresData {
  let figuresData: FiguresData = {
    title: "",
    hasSi: false,
    hasToc: false,
    mainFigs: [],
    siFigs: [],
    from: "nature",
  };

  const title = document.querySelector("h1")?.textContent;
  console.log("title", title);
  if (typeof title !== "string") {
    return figuresData;
  }
  figuresData.title = title;

  const abs = document.querySelector('section[data-title="Abstract"]');
  const img = abs?.querySelector("img");
  if (img) {
    figuresData.hasToc = true;
    const id = 1;
    const name = "Graphical Abstract";

    const htmlUrl = img.src
      ? (img.src as string)
      : (img.getAttribute("data-src") as string);
    const originUrl = htmlUrl.replace("lw685", "full");
    const figInfo: FigInfo = {
      id,
      name,
      htmlUrl,
      originUrl,
      selected: false,
    };
    figuresData.tocFig = figInfo;
  }

  const figureList = document.querySelector(".main-content");
  if (!figureList) {
    return figuresData;
  }
  const figures = figureList.querySelectorAll("figure");
  figures.forEach((element) => {
    const caption = element.querySelector("b")?.textContent as string;
    const { id, name } = extractFigureInfo(caption);
    const img = element.querySelector("img");
    if (!img || id === 0) {
      return;
    }
    const htmlUrl = img?.src
      ? (img?.src as string)
      : (img?.getAttribute("data-src") as string);

    const originUrl = htmlUrl.replace("lw685", "full");

    const fig_info: FigInfo = {
      id,
      name,
      htmlUrl,
      originUrl,
      selected: false,
    };
    figuresData.mainFigs.push(fig_info);
  });

  const siFigList = document.querySelector(
    'section[data-title="Extended data figures and tables"],section[data-title="Extended data"]'
  );

  console.log(siFigList?.querySelectorAll("a"), "AAA");
  if (!siFigList) {
    return figuresData;
  }
  siFigList.querySelectorAll("a.print-link").forEach((link) => {
    const caption = link.textContent as string;
    const { id, name } = extractFigureInfo(caption);
    if (id === 0) {
      return;
    }
    const htmlUrl = ("https:" +
      link.getAttribute("data-supp-info-image")) as string;
    const originUrl = htmlUrl.replace("lw685", "full");
    const figInfo: FigInfo = {
      id,
      name,
      htmlUrl,
      originUrl,
      selected: false,
    };
    figuresData.siFigs?.push(figInfo);
  });
  console.log(figuresData.siFigs);

  if (figuresData.siFigs?.length !== 0) {
    figuresData.hasSi = true;
    figuresData.siTitle = "Extended Data Figures";
  }
  return figuresData;
}

function extractFigureInfo(input: string): { id: number; name: string } {
  const regex = /(Fig\.|Extended Data Fig\.) (\d+):?\s*(.*)/;
  const match = input.match(regex);
  if (match) {
    return {
      id: Number(match[2]),
      name: match[3],
    };
  }
  return {
    id: 0,
    name: "",
  };
}
