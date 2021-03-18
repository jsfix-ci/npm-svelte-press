const path = require("path");
const fileSystem = require("./fileSystem");

let lib;

function crawlDirectory(rootPath, srcRoot, destRoot, subPath, callbacks) {
  callbacks["enter"] &&
    callbacks["enter"](rootPath, srcRoot, destRoot, subPath);

  const dirents = fileSystem.list(path.join(rootPath, srcRoot, subPath));

  const dirNames = fileSystem.dirNames(dirents);
  const fileNames = fileSystem.fileNames(dirents);
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
  crawlDirectory,
};

module.exports = lib.crawlDirectory;
module.exports.lib = lib;
