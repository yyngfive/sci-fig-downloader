// Copyright (C) 2024  yyngfive 

// Email: chenhye5@outlook.com

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

interface Info {
  id: number; //正文中图片的编号
  name: string; //图片名称，没有明确名称的直接使用图片注解
  originUrl: string; //可以下载的高清版本图片
  selected: boolean; //默认为False
}

interface FigInfo extends Info {
  htmlUrl: string; //用于网页上预览的低分辨率版本图片
}

interface FileInfo extends Info {
  fileType: "pdf" | "video" | "audio" | "word" | "excel" |"figure"| "other";
}

interface FiguresData {
  title: string; //文章标题
  hasToc: boolean; //是否有图片摘要
  hasSi: boolean; //是否提供可直接下载的补充材料图片或者反应体系图（有机反应文章常见）
  from: "nature" | "acs" | "wiley" | "science" | "sciencedirect"; //支持的杂志网站
  siTitle?: "Scheme" | "Extended Data Figures"; //补充图片的类别
  tocFig?: FigInfo; //图片摘要
  mainFigs: FigInfo[]; //正文图片
  siFigs?: FigInfo[]; //补充图片或反应体系
}

interface FilesData {
  title: string;
  from: "acs" | "nature" | "science" | "wiley"|"sciencedirect";
  hasSrc: boolean;
  srcFiles?: FileInfo[];
  files: FileInfo[];
}

export { FiguresData, FigInfo, FileInfo, FilesData };
