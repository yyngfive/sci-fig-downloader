import type { FiguresData, FigInfo, FileInfo, FilesData } from "@/types/parser";
import { getFileType } from "@/assets/utils/fileType";

export function getFiguresFromScience(): FiguresData {
  let figuresData: FiguresData = {
    title: "请等待页面加载完成后重新加载",
    hasSi: false,
    hasToc: false,
    mainFigs: [],
    siFigs: [],
    from: "science",
  };

  const title = document.querySelector("h1")?.textContent;
  console.log("title", title);
  
  if (typeof title !== "string") {
    return figuresData;
  }
  figuresData.title = title;

//   const abstract = document.querySelector(".article_abstract");
//   const abstractFigElement = abstract?.querySelector("img");
//   if (abstractFigElement) {
//     const id = 1;
//     const name = "Graphical Abstract";
//     const baseUrl = abstractFigElement.src
//       ? abstractFigElement.src
//       : abstractFigElement.querySelector("img")?.getAttribute("data-src");
//     const htmlUrl = `${baseUrl}`;
//     const originUrl = htmlUrl.replace("medium", "large").replace("gif", "jpeg");
//     const figInfo: FigInfo = {
//       id,
//       name,
//       htmlUrl,
//       originUrl,
//       selected: false,
//     };
//     figuresData.tocFig = figInfo;
//     figuresData.hasToc = true;
//   }

  const figureList = document.querySelector("#bodymatter");
  if (!figureList) {
    return figuresData;
  }

  const figures = figureList.querySelectorAll("figure");
  figures.forEach((element) => {
    let captionElement = element.querySelector("figcaption")
    if(captionElement?.querySelector('.caption')){
        captionElement = captionElement.querySelector('.caption')
    }
    const caption = captionElement?.textContent?.replace(/(\s|&nbsp;)+/g,' ').split('. ') as string[];
    const [type,id,name] = caption
    const baseUrl = element.querySelector("img")?.src
      ? (element.querySelector("img")?.src as string)
      : (element.querySelector("img")?.getAttribute("data-src") as string);
    const htmlUrl = `${baseUrl}`;
    const originUrl = htmlUrl

    const figInfo: FigInfo = {
      id:Number(id),
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
