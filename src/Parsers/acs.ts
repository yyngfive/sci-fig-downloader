import type { FiguresData, FigInfo, FileInfo, FilesData } from "@/types/parser";

export function getFilesFromACS(): FilesData {
  let filesData: FilesData = {
    from: "acs",
    files: [],
  };
  const supportedList = document.querySelector("#silist");
  if (supportedList === undefined) {
    return filesData;
  }

  const fileLinks = supportedList?.querySelectorAll("p");
  fileLinks?.forEach((si, index) => {
    const id = index + 1;
    const text = si.firstChild as Text;
    const name = text.wholeText.split("(")[0];
    const link = si.querySelector("a.ext-link") as HTMLAnchorElement;
    const url = link.href;
    const type = getFileType(url.split("/").pop() as string);
    const fileInfo: FileInfo = {
      id,
      name,
      type,
      url,
      selected: false,
    };
    filesData.files.push(fileInfo);
  });

  return filesData;
}

function getFileType(filename: string): FileInfo["type"] {
  const ext = filename
    .toLowerCase()
    .split(".")
    .pop() as keyof typeof fileExtensions;
  return fileExtensions[ext] || "other";
}

const fileExtensions: Record<string, FileInfo["type"]> = {
  pdf: "pdf",
  mp4: "video",
  mov: "video",
  avi: "video",
  mp3: "audio",
  wav: "audio",
  doc: "word",
  docx: "word",
  xls: "excel",
  xlsx: "excel",
};

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
  if (!abstract) {
    return figuresData;
  }
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
