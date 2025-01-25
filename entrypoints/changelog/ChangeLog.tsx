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

const content = [
  {
    version: "0.3.0",
    description: [
     "新增了对Oxford期刊的支持", 
     "新增了对RSC期刊的支持",
     "可以下载文章的正文PDF文件(部分出版社)",
    ]
  },
  {
    version: "0.2.1",
    description: [
      "修复了部分Nature系列期刊页面插件显示空图片名称的问题",
      "修复了部分Nature系列期刊页面插件无法识别补充材料的问题",
      "修复了部分Science系列期刊页面插件无法显示图片名称的问题",
      "修复了部分ACS系列期刊特殊文章页面导致插件崩溃的问题",
      "修复了部分ACS期刊因为补充材料无文件名无法识别的问题",
    ],
  },
];

function ChangeLog() {
  return <div className="m-3 p-3">
    <div>
        <h1 className="text-3xl font-bold my-2">ChangeLog</h1>
    </div>
    <div>
      {content.map((item, index) => (
        <div key={index}>
          <h2 className="text-xl font-bold my-1">{item.version}</h2>
          <ul>
            {item.description.map((desc, descIndex) => (
              <li className="my-1 text-lg" key={descIndex}>{desc}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  </div>;
}

export default ChangeLog;
