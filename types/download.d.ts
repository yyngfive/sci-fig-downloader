import type { FileInfo, FigInfo } from "./parser";

export interface DownloadItem {
  id: number;
  //fileType: "pdf" | "video" | "audio" | "word" | "excel" | "figure" | "other";
  originUrl: string;
  article: string;
  name: string;
}
