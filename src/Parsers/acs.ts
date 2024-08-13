import type { FiguresData, FigInfo } from "@/types/parser";

export function getFiguresFromACS(): FiguresData {
  const figureList = document.getElementsByClassName("article_content")[0];
  const title = document.querySelector(".hlFld-Title")?.textContent as string;
  console.log("title", title);

  let figuresData: FiguresData = {
    title: title,
    hasSi: false,
    hasToc: false,
    mainFigs: [],
    siFigs: [],
    from: "acs",
  };

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

  const abstract = document.querySelector(".article_abstract");
  const abstractFigElement = abstract
    ?.querySelector("figure")
    ?.querySelector("img");
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