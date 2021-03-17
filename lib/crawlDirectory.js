const fs = require("fs");
const path = require("path");

let lib;

function _caseInsensitive(a, b) {
  if (a.toLowerCase() < b.toLowerCase()) return -1;
  if (a.toLowerCase() > b.toLowerCase()) return 1;
  return 0;
}

function crawlDirectory(rootPath, srcRoot, destRoot, subPath, callbacks) {
  callbacks["enter"] &&
    callbacks["enter"](rootPath, srcRoot, destRoot, subPath);

  const dirents = fs.readdirSync(path.join(rootPath, srcRoot, subPath), {
    withFileTypes: true,
  });

  const dirNames = dirents
    .filter((y) => y.isDirectory())
    .map((y) => y.name)
    .sort(lib._caseInsensitive);
  const fileNames = dirents
    .filter((y) => y.isFile())
    .map((y) => y.name)
    .sort(lib._caseInsensitive);
  const types = Object.keys(callbacks);

  dirNames.forEach((dirName) => {
    lib.crawlDirectory(
      rootPath,
      srcRoot,
      destRoot,
      path.join(subPath, dirName),
      callbacks
    );
  });

  fileNames.forEach((fileName) => {
    if (callbacks["file"]) {
      callbacks["file"](rootPath, srcRoot, destRoot, subPath, null, fileName);
    } else {
      types
        .filter((type) => type !== "enter")
        .filter((type) => type !== "exit")
        .filter((type) => fileName.endsWith("." + type))
        .forEach((type) =>
          callbacks[type](rootPath, srcRoot, destRoot, subPath, type, fileName)
        );
    }
  });

  callbacks["exit"] && callbacks["exit"](rootPath, srcRoot, destRoot, subPath);
}

lib = {
  _caseInsensitive,

  crawlDirectory,
};

module.exports = lib.crawlDirectory;
module.exports.lib = lib;
