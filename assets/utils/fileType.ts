import type { FileInfo } from "@/types/parser";

export function getFileType(filename: string): FileInfo["fileType"] {
  const ext = filename
    .toLowerCase()
    .split(".")
    .pop() as keyof typeof fileExtensions;
  return fileExtensions[ext] || "other";
}

const fileExtensions: Record<string, FileInfo["fileType"]> = {
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
  jpg:"figure",
  png:"figure",
  jpeg:"figure",
};
