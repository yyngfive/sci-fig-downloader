interface FigInfo {
  id: number; //正文中图片的编号
  name: string; //图片名称，没有明确名称的直接使用图片注解
  htmlUrl: string; //用于网页上预览的低分辨率版本图片
  originUrl: string; //可以下载的高清版本图片
  selected: boolean; //默认为False
}

interface FiguresData {
  title: string; //文章标题
  hasToc: boolean; //是否有图片摘要
  hasSi: boolean; //是否提供可直接下载的补充材料图片或者反应体系图（有机反应文章常见）
  from: "nature" | "acs" | "wiley"; //支持的杂志网站
  siTitle?: "Scheme" | "Extended Data Figures"; //补充图片的类别
  tocFig?: FigInfo; //图片摘要
  mainFigs: FigInfo[]; //正文图片
  siFigs?: FigInfo[]; //补充图片或反应体系
}

interface FileInfo {
  id: number;
  name: string;
  type: "pdf" | "video" | "audio" | "word" | "excel" | "other";
  url: string;
  selected: boolean;
}

interface FilesData {
  from: "acs";
  files: FileInfo[];
}

export { FiguresData, FigInfo,FileInfo,FilesData };
