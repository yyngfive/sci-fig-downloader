#!/usr/bin/env node

import {
  existsSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const MARKERS = {
  publisher: "  // publisher-generator:publisher",
  imports: "// publisher-generator:imports",
  hosts: "  // publisher-generator:hosts",
  figures: "  // publisher-generator:figure-parsers",
  files: "  // publisher-generator:file-parsers",
  matches: "    // publisher-generator:matches",
};

const HELP = `Add a publisher parser scaffold.

Usage:
  pnpm add:publisher -- --key <key> [--symbol <PascalCase>] \\
    --host <hostname> [--host <hostname>...] \\
    --match <pattern> [--match <pattern>...] [--dry-run]

Options:
  --key       Lowercase parser key and filename, for example: cell
  --symbol    Function suffix, defaults to the key in PascalCase
  --host      Hostname used for publisher detection; repeatable
  --match     WXT content-script match pattern; repeatable
  --dry-run   Validate and print the plan without writing files
  --help      Show this help
`;

function unique(values) {
  return [...new Set(values)];
}

function takeValue(argv, index, option) {
  const value = argv[index + 1];
  if (!value || value.startsWith("--")) {
    throw new Error(`${option} requires a value`);
  }
  return value;
}

function isValidHostname(host) {
  if (host.length > 253 || !/^[a-z0-9.-]+$/.test(host)) return false;
  return host.split(".").every(
    (label) =>
      label.length > 0 &&
      label.length <= 63 &&
      /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(label),
  );
}

function isValidMatchPattern(pattern) {
  if (pattern === "<all_urls>") return true;
  const match = pattern.match(/^(?:\*|https?):\/\/([^/]+)\/(.*)$/i);
  if (!match) return false;
  const host = match[1].toLowerCase();
  if (host === "*") return true;
  return host.startsWith("*.")
    ? isValidHostname(host.slice(2))
    : isValidHostname(host);
}

export function parseArgs(argv) {
  const values = { hosts: [], matches: [], dryRun: false, help: false };

  for (let index = 0; index < argv.length; index += 1) {
    const option = argv[index];
    if (option === "--help") {
      values.help = true;
    } else if (option === "--dry-run") {
      values.dryRun = true;
    } else if (["--key", "--symbol", "--host", "--match"].includes(option)) {
      const value = takeValue(argv, index, option);
      index += 1;
      if (option === "--key") values.key = value;
      if (option === "--symbol") values.symbol = value;
      if (option === "--host") values.hosts.push(value.toLowerCase());
      if (option === "--match") values.matches.push(value);
    } else {
      throw new Error(`Unknown option: ${option}`);
    }
  }

  if (values.help) return values;
  if (!values.key || !/^[a-z][a-z0-9]*$/.test(values.key)) {
    throw new Error("--key must match ^[a-z][a-z0-9]*$");
  }
  values.symbol ??= values.key[0].toUpperCase() + values.key.slice(1);
  if (!/^[A-Z][A-Za-z0-9]*$/.test(values.symbol)) {
    throw new Error("--symbol must be a PascalCase TypeScript identifier");
  }

  values.hosts = unique(values.hosts);
  values.matches = unique(values.matches);
  if (values.hosts.length === 0 || values.hosts.some((host) => !isValidHostname(host))) {
    throw new Error("At least one valid --host hostname is required");
  }
  if (
    values.matches.length === 0 ||
    values.matches.some((pattern) => !isValidMatchPattern(pattern))
  ) {
    throw new Error("At least one valid WXT --match pattern is required");
  }
  return values;
}

function newlineFor(source) {
  return source.includes("\r\n") ? "\r\n" : "\n";
}

function assertOneMarker(source, marker, filename) {
  const count = source.split(marker).length - 1;
  if (count !== 1) {
    throw new Error(`${filename}: expected exactly one ${marker}, found ${count}`);
  }
}

function insertBefore(source, marker, entry, filename) {
  assertOneMarker(source, marker, filename);
  return source.replace(marker, `${entry}${newlineFor(source)}${marker}`);
}

function hostOwners(registrySource) {
  const start = registrySource.indexOf("export const publisherHosts");
  const end = registrySource.indexOf(MARKERS.hosts);
  if (start < 0 || end < start) return [];

  const owners = [];
  const entryPattern = /^\s*([a-z][a-z0-9]*):\s*\[([^\]]*)\],/gm;
  for (const entry of registrySource.slice(start, end).matchAll(entryPattern)) {
    for (const quoted of entry[2].matchAll(/"([^"]+)"/g)) {
      owners.push({ publisher: entry[1], host: quoted[1] });
    }
  }
  return owners;
}

function hostsOverlap(left, right) {
  return (
    left === right ||
    left.endsWith(`.${right}`) ||
    right.endsWith(`.${left}`)
  );
}

export function parserTemplate({ key, symbol }) {
  return `// SPDX-License-Identifier: GPL-3.0-or-later

import type { FiguresData, FilesData } from "@/types/parser";
import { default_file } from "@/utils/fileType";

export function getFilesFrom${symbol}(): FilesData {
  // TODO: Parse article and supplementary files from the current page DOM.
  return {
    from: "${key}",
    files: [],
    hasSrc: false,
    title: "",
    article: { ...default_file },
  };
}

export function getFiguresFrom${symbol}(): FiguresData {
  // TODO: Parse article figures from the current page DOM.
  return {
    from: "${key}",
    title: "",
    hasSi: false,
    hasToc: false,
    mainFigs: [],
    siFigs: [],
  };
}
`;
}

export function buildChanges(root, options) {
  const files = {
    types: path.join(root, "types", "parser.d.ts"),
    registry: path.join(root, "Parsers", "parsers.ts"),
    content: path.join(root, "entrypoints", "content.ts"),
    parser: path.join(root, "Parsers", `${options.key}.ts`),
  };

  for (const [name, filename] of Object.entries(files)) {
    if (name !== "parser" && !existsSync(filename)) {
      throw new Error(`Required file not found: ${filename}`);
    }
  }
  if (existsSync(files.parser)) {
    throw new Error(`Parser already exists: ${files.parser}`);
  }

  let typesSource = readFileSync(files.types, "utf8");
  let registrySource = readFileSync(files.registry, "utf8");
  let contentSource = readFileSync(files.content, "utf8");

  for (const [markerName, marker] of Object.entries(MARKERS)) {
    const source = markerName === "publisher" ? typesSource
      : markerName === "matches" ? contentSource
        : registrySource;
    const filename = markerName === "publisher" ? files.types
      : markerName === "matches" ? files.content
        : files.registry;
    assertOneMarker(source, marker, filename);
  }

  if (typesSource.includes(`| "${options.key}"`)) {
    throw new Error(`Publisher key already exists: ${options.key}`);
  }
  if (
    registrySource.includes(`getFilesFrom${options.symbol}`) ||
    registrySource.includes(`getFiguresFrom${options.symbol}`)
  ) {
    throw new Error(`Publisher symbol already exists: ${options.symbol}`);
  }

  for (const { publisher, host } of hostOwners(registrySource)) {
    const conflict = options.hosts.find((candidate) => hostsOverlap(candidate, host));
    if (conflict) {
      throw new Error(`Host ${conflict} overlaps ${host} registered to ${publisher}`);
    }
  }
  for (const pattern of options.matches) {
    if (contentSource.includes(JSON.stringify(pattern))) {
      throw new Error(`Match pattern already exists: ${pattern}`);
    }
  }

  typesSource = insertBefore(
    typesSource,
    MARKERS.publisher,
    `  | "${options.key}"`,
    files.types,
  );
  registrySource = insertBefore(
    registrySource,
    MARKERS.imports,
    `import { getFiguresFrom${options.symbol}, getFilesFrom${options.symbol} } from "./${options.key}";`,
    files.registry,
  );
  registrySource = insertBefore(
    registrySource,
    MARKERS.hosts,
    `  ${options.key}: [${options.hosts.map((host) => JSON.stringify(host)).join(", ")}],`,
    files.registry,
  );
  registrySource = insertBefore(
    registrySource,
    MARKERS.figures,
    `  ${options.key}: getFiguresFrom${options.symbol},`,
    files.registry,
  );
  registrySource = insertBefore(
    registrySource,
    MARKERS.files,
    `  ${options.key}: getFilesFrom${options.symbol},`,
    files.registry,
  );
  contentSource = insertBefore(
    contentSource,
    MARKERS.matches,
    options.matches.map((pattern) => `    ${JSON.stringify(pattern)},`).join(newlineFor(contentSource)),
    files.content,
  );

  return [
    { action: "update", filename: files.types, content: typesSource },
    { action: "update", filename: files.registry, content: registrySource },
    { action: "update", filename: files.content, content: contentSource },
    { action: "create", filename: files.parser, content: parserTemplate(options) },
  ];
}

export function execute(root, options, log = console.log) {
  const changes = buildChanges(root, options);
  log(`${options.dryRun ? "Dry run" : "Adding"} publisher ${options.key} (${options.symbol})`);
  log(`Hosts: ${options.hosts.join(", ")}`);
  log(`Matches: ${options.matches.join(", ")}`);
  for (const change of changes) {
    log(`${change.action.toUpperCase()} ${path.relative(root, change.filename)}`);
  }

  if (!options.dryRun) {
    for (const change of changes) {
      writeFileSync(change.filename, change.content, "utf8");
    }
    log("Next: implement both parser functions, run pnpm compile, test real articles, then update support docs.");
  }
  return changes;
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    process.stdout.write(HELP);
    return;
  }
  execute(process.cwd(), options);
}

const isMain = process.argv[1]
  && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url;
if (isMain) {
  try {
    main();
  } catch (error) {
    console.error(`add-publisher: ${error.message}`);
    process.exitCode = 1;
  }
}

