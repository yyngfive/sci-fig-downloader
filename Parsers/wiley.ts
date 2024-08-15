import type { FiguresData, FigInfo } from "@/types/parser";

export function getFiguresFromWiley(): FiguresData {
  const figureList = document.getElementsByClassName(
    "article-section__full"
  )[0];
  const title = document.querySelector(".citation__title")
    ?.textContent as string;
  console.log("title", title);

  let figuresData: FiguresData = {
    title: title,
    hasSi: false,
    hasToc: false,
    mainFigs: [],
    siFigs: [],
    from: "wiley",
  };

  const figures = figureList.querySelectorAll("figure");
  console.log(figureList);

  figures.forEach((element) => {
    const captionText = element.querySelector(
      ".figure__caption-text"
    ) as HTMLElement;
    const name = getTextWithoutClass(captionText, "bibLink");
    const captionTitle = element.querySelector(".figure__title")
      ?.textContent as string;
    const type = captionTitle.split(" ")[0];
    const id = Number(captionTitle.split(" ")[1]);
    const htmlUrl = element.querySelector("img")?.src as string;
    const baseUrl = element
      .querySelector("img")
      ?.getAttribute("data-lg-src") as string;
    let domain;
    if (htmlUrl.startsWith("http://online")) {
      domain = "https://onlinelibrary.wiley.com";
    } else {
      domain = "https://chemistry-europe.onlinelibrary.wiley.com";
    }
    const originUrl = domain + baseUrl;
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

  const abstract = document.querySelector(".abstract-group");
  const abstractFigElement = abstract
    ?.querySelector("figure")
    ?.querySelector("img");
  if (abstractFigElement) {
    const id = 1;
    const name = "Graphical Abstract";
    const baseUrl = abstractFigElement.src;
    const htmlUrl = `${baseUrl}`;
    const originUrl = abstractFigElement.getAttribute("data-lg-src") as string;
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

function getTextWithoutClass(element: HTMLElement, className: string) {
  const children: HTMLElement[] = Array.from(element.childNodes).filter(
    (node): node is HTMLElement => {
      return node.nodeType === Node.ELEMENT_NODE;
    }
  );
  // 过滤掉具有指定类名的节点
  const filteredChildren = children.filter(
    (child) => !child.classList.contains(className)
  );

  // 将过滤后的节点的textContent合并
  return filteredChildren.map((node) => node.textContent).join("");
}