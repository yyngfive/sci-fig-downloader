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

export function parseQueryParameters(url: string): { [key: string]: string } {
    // 创建一个URL对象
    const urlObj = new URL(url);
    // 使用URLSearchParams解析查询字符串
    const queryParams = new URLSearchParams(urlObj.search);
    
    // 将查询参数转换为键值对对象
    const params: { [key: string]: string } = {};
    queryParams.forEach((value, key) => {
        params[key] = value;
    });
    
    return params;
}