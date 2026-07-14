import assert from "node:assert/strict";
import { cpSync, mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { execute, parseArgs } from "./add-publisher.mjs";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function fixture() {
  const root = mkdtempSync(path.join(os.tmpdir(), "add-publisher-"));
  mkdirSync(path.join(root, "types"));
  mkdirSync(path.join(root, "Parsers"));
  mkdirSync(path.join(root, "entrypoints"));
  cpSync(path.join(projectRoot, "types", "parser.d.ts"), path.join(root, "types", "parser.d.ts"));
  cpSync(path.join(projectRoot, "Parsers", "parsers.ts"), path.join(root, "Parsers", "parsers.ts"));
  cpSync(path.join(projectRoot, "entrypoints", "content.ts"), path.join(root, "entrypoints", "content.ts"));
  return root;
}

function snapshot(root) {
  return ["types/parser.d.ts", "Parsers/parsers.ts", "entrypoints/content.ts"]
    .map((filename) => readFileSync(path.join(root, filename), "utf8"));
}

function options(...extra) {
  return parseArgs([
    "--key", "cell",
    "--symbol", "Cell",
    "--host", "www.cell.com",
    "--host", "www.cell.com",
    "--host", "assets.cell.com",
    "--match", "https://www.cell.com/*",
    "--match", "https://www.cell.com/*",
    "--match", "https://assets.cell.com/*",
    ...extra,
  ]);
}

test("creates a parser and updates every registration once", () => {
  const root = fixture();
  try {
    const parsed = options();
    assert.deepEqual(parsed.hosts, ["www.cell.com", "assets.cell.com"]);
    assert.deepEqual(parsed.matches, ["https://www.cell.com/*", "https://assets.cell.com/*"]);
    execute(root, parsed, () => {});

    const parser = readFileSync(path.join(root, "Parsers", "cell.ts"), "utf8");
    const types = readFileSync(path.join(root, "types", "parser.d.ts"), "utf8");
    const registry = readFileSync(path.join(root, "Parsers", "parsers.ts"), "utf8");
    const content = readFileSync(path.join(root, "entrypoints", "content.ts"), "utf8");
    assert.match(parser, /getFilesFromCell\(\): FilesData/);
    assert.match(parser, /getFiguresFromCell\(\): FiguresData/);
    assert.match(parser, /article: \{ \.\.\.default_file \}/);
    assert.equal((types.match(/\| "cell"/g) ?? []).length, 1);
    assert.equal((registry.match(/cell: getFiguresFromCell/g) ?? []).length, 1);
    assert.equal((registry.match(/cell: getFilesFromCell/g) ?? []).length, 1);
    assert.equal((content.match(/https:\/\/www\.cell\.com\/\*/g) ?? []).length, 1);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("dry-run validates and writes nothing", () => {
  const root = fixture();
  try {
    const before = snapshot(root);
    const messages = [];
    execute(root, { ...options(), dryRun: true }, (message) => messages.push(message));
    assert.deepEqual(snapshot(root), before);
    assert.match(messages.join("\n"), /Dry run publisher cell/);
    assert.equal(exists(path.join(root, "Parsers", "cell.ts")), false);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("conflicts and missing markers fail before writing", () => {
  const root = fixture();
  try {
    const before = snapshot(root);
    assert.throws(
      () => execute(root, parseArgs([
        "--key", "newnature",
        "--host", "sub.nature.com",
        "--match", "https://sub.nature.com/*",
      ]), () => {}),
      /overlaps nature\.com/,
    );
    assert.deepEqual(snapshot(root), before);

    const contentFile = path.join(root, "entrypoints", "content.ts");
    writeFileSync(
      contentFile,
      readFileSync(contentFile, "utf8").replace("    // publisher-generator:matches", ""),
    );
    const withoutMarker = snapshot(root);
    assert.throws(() => execute(root, options(), () => {}), /expected exactly one/);
    assert.deepEqual(snapshot(root), withoutMarker);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("existing keys, parser files, and match patterns fail before writing", () => {
  const root = fixture();
  try {
    const before = snapshot(root);
    assert.throws(
      () => execute(root, parseArgs([
        "--key", "nature",
        "--host", "new.example.com",
        "--match", "https://new.example.com/*",
      ]), () => {}),
      /Publisher key already exists/,
    );
    assert.deepEqual(snapshot(root), before);

    writeFileSync(path.join(root, "Parsers", "cell.ts"), "existing parser\n");
    const withParser = snapshot(root);
    assert.throws(() => execute(root, options(), () => {}), /Parser already exists/);
    assert.deepEqual(snapshot(root), withParser);
    rmSync(path.join(root, "Parsers", "cell.ts"));

    const existingMatch = parseArgs([
      "--key", "cell",
      "--host", "cell.example.com",
      "--match", "https://www.nature.com/*",
    ]);
    assert.throws(() => execute(root, existingMatch, () => {}), /Match pattern already exists/);
    assert.deepEqual(snapshot(root), withParser);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("rejects invalid arguments", () => {
  assert.throws(() => parseArgs(["--key", "Bad-Key"]), /--key/);
  assert.throws(
    () => parseArgs(["--key", "cell", "--symbol", "cell", "--host", "cell.com", "--match", "https://cell.com/*"]),
    /--symbol/,
  );
  assert.throws(
    () => parseArgs(["--key", "cell", "--host", "https://cell.com", "--match", "https://cell.com/*"]),
    /--host/,
  );
  assert.throws(
    () => parseArgs(["--key", "cell", "--host", "cell.com", "--match", "cell.com/*"]),
    /--match/,
  );
  assert.throws(() => parseArgs(["--unknown"]), /Unknown option/);
});

function exists(filename) {
  try {
    readFileSync(filename);
    return true;
  } catch {
    return false;
  }
}
