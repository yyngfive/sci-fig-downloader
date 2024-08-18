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
  jpg: "figure",
  png: "figure",
  jpeg: "figure",
};
