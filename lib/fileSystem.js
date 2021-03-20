const fs = require("fs");
const path = require("path");

let lib;

function _caseInsensitive(a, b) {
  if (a.toLowerCase() < b.toLowerCase()) return -1;
  if (a.toLowerCase() > b.toLowerCase()) return 1;
  return 0;
}

function exists(fullPath) {
  return fs.existsSync(fullPath);
}

function missing(fullPath) {
  return !fs.existsSync(fullPath);
}

function mkdir(fullPath) {
  const parts = fullPath.split("/");
  if (parts.length > 1) {
    parts.pop();
    const newPath = path.join(...parts);
    lib.mkdir(newPath);
  }
  if (lib.missing(fullPath)) {
    console.log("mkdir", fullPath);
    fs.mkdirSync(fullPath);
  }
}

function write(fullPath, lines) {
  console.log("creating", fullPath);
  const content = Array.isArray(lines) ? lines.join("\n") : lines;
  fs.writeFileSync(fullPath, content, {
    encoding: "utf8",
    flag: "w",
  });
}

function read(fullPath, defaultValue) {
  if (lib.missing(fullPath)) {
    return defaultValue;
  } else {
    console.log("reading", fullPath);
    return fs.readFileSync(fullPath, {
      encoding: "utf8",
      flag: "r",
    });
  }
}

function list(fullPath) {
  return fs.readdirSync(fullPath, {
    withFileTypes: true,
  });
}

function dirNames(dirents) {
  return dirents
    .filter((y) => y.isDirectory())
    .map((y) => y.name)
    .sort(lib._caseInsensitive);
}

function fileNames(dirents) {
  return dirents
    .filter((y) => y.isFile())
    .map((y) => y.name)
    .sort(lib._caseInsensitive);
}

function parse(contents, transform = (x) => x) {
  return contents.split(/\r?\n/).map((x) => transform(x));
}

function removeFile(fullPath) {
  console.log("rm", fullPath);
  fs.unlinkSync(fullPath);
}

function removeDir(fullPath) {
  console.log("rmdir", fullPath);
  fs.rmdirSync(fullPath);
}

function copy(srcPath, destPath, transform) {
  const contents = lib.read(srcPath);
  const lines = lib.parse(contents, transform);
  lib.write(destPath, lines);
}

lib = {
  _caseInsensitive,
  copy,
  dirNames,
  exists,
  fileNames,
  list,
  mkdir,
  missing,
  parse,
  read,
  removeDir,
  removeFile,
  write,
};

module.exports = lib;
