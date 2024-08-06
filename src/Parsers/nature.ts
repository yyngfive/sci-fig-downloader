import type { FiguresData, FigInfo } from "@/types/parser";

//BUG 窄屏下侧栏未加载会导致爬取错误（改成根据正文爬取:需要区分正文和extended data）
function getFiguresFromNature(): FiguresData {
  const figureList = document.getElementsByClassName(
    "c-reading-companion__figures-list"
  )[0];
  const title = document.querySelector("h1")?.textContent as string;
  console.log('title',title);
  
  let figuresData: FiguresData = {
    title: title,
    hasSi: false,
    hasToc: false,
    mainFigs: [],
    siFigs: [],
    from: "nature",
  };

  const figures = figureList.querySelectorAll("figure");
  figures.forEach((element) => {
    const caption = element.querySelector("b")?.textContent as string;
    const { id, name } = extractFigureInfo(caption);
    const htmlUrl = element.querySelector("img")?.src
      ? (element.querySelector("img")?.src as string)
      : (element.querySelector("img")?.getAttribute("data-src") as string);
    const originUrl = htmlUrl.replace("lw685", "full");
    const fig_info: FigInfo = {
      id,
      name,
      htmlUrl,
      originUrl,
      selected: false,
    };

    if (caption?.startsWith("Extended")) {
      figuresData.siFigs?.push(fig_info);
    } else {
      figuresData.mainFigs.push(fig_info);
    }
  });
  if(figuresData.siFigs?.length !== 0){
    figuresData.hasSi = true
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

export { getFiguresFromNature };
