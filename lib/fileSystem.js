const fs = require("fs");

let lib;

function _caseInsensitive(a, b) {
  if (a.toLowerCase() < b.toLowerCase()) return -1;
  if (a.toLowerCase() > b.toLowerCase()) return 1;
  return 0;
}

function mkdir(fullPath) {
  if (!fs.existsSync(fullPath)) {
    console.log("mkdir", fullPath);
    fs.mkdirSync(fullPath);
  }
}

function write(fullPath, lines) {
  const content = Array.isArray(lines) ? lines : lines.join("\n");
  fs.writeFileSync(fullPath, content, {
    encoding: "utf8",
    flag: "w",
  });
}

function read(fullPath) {
  return fs.readFileSync(fullPath, {
    encoding: "utf8",
    flag: "r",
  });
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

lib = {
  _caseInsensitive,
  mkdir,
  write,
};

module.exports = lib;
