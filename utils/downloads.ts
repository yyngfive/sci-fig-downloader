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

import type { DownloadItem } from "@/types/download";
import type { FigInfo, FileInfo } from "@/types/parser";

export function info2Download(
  item: FigInfo | FileInfo,
  article: string,
  name: string
): DownloadItem {
  const articleTitle = article.replace(/[\\/:*?<>|]/g, "");

  return {
    id: item.id,
    originUrl: item.originUrl,
    article: articleTitle,
    name,
  };
}
