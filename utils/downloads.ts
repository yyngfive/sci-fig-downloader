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

function info2Download(
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

/**
 * 判断一个字符串是否是合法的 Windows 文件名
 * @param filename - 要检查的文件名
 */
function isValidFilename(filename: string): boolean {
    if (!filename) return false;

    // Windows 中不允许的字符： \ / : * ? " < > |
    const illegalChars = /[\\/:*?"<>|]/;
    return !illegalChars.test(filename);
}

/**
 * 规范化 Windows 文件名：替换非法字符、去除空格、限制长度等
 * @param filename - 原始文件名
 * @param replaceChar - 替换非法字符的字符，默认 '_'
 */
function normalizeFilename(filename: string, replaceChar: string = '_'): string {
    if (!filename) return 'unnamed';

    // 替换非法字符
    let normalized = filename.replace(/[\\/:*?"<>|]/g, replaceChar);

    // 去除首尾空白
    normalized = normalized.trim();

    // 限制最大长度（Windows 文件名最大长度为 255 字符）
    const maxLength = 255;
    if (normalized.length > maxLength) {
        normalized = normalized.slice(0, maxLength);
    }

    // 如果全是替换字符或空白，则返回默认名称
    if (!normalized || /^[_\s]+$/.test(normalized)) {
        return 'unnamed';
    }

    return normalized;
}

export{info2Download, isValidFilename, normalizeFilename};