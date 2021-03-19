const path = require("path");

const crawlDirectory = require("./crawlDirectory");
const indexPage = require("./indexPage");
const rollup = require("./rollup");
const fileSystem = require("./fileSystem");

let lib;

function onJsFile(rootPath, srcRoot, destRoot, subPath, type, name) {
  rollup.build(rootPath, srcRoot, destRoot, subPath, name);
  indexPage.create(destRoot, subPath, name);
}

function onEnter(rootPath, srcRoot, destRoot, subPath) {
  fileSystem.mkdir(path.join(rootPath, destRoot, subPath));
  fileSystem.mkdir(path.join(rootPath, destRoot, "build", subPath));
}

function purgeFile(rootPath, srcRoot, destRoot, subPath, type, name) {
  if (subPath.startsWith("build") || name.endsWith(".html")) {
    fileSystem.removeFile(path.join(srcRoot, subPath, name));
  }
}

function purgeDir(rootPath, srcRoot, destRoot, subPath) {
  if (path.join(srcRoot, subPath) !== srcRoot) {
    fileSystem.removeDir(path.join(srcRoot, subPath));
  }
}

function build() {
  fileSystem.mkdir("public");
  fileSystem.mkdir("src");
  crawlDirectory(
    ".", //projectRoot,
    "public",
    "public", //path.join("public", "build"),
    ".",
    {
      exit: purgeDir,
      file: purgeFile,
    }
  );

  //console.log("projectRoot", projectRoot);
  crawlDirectory(
    ".", //projectRoot,
    "src",
    "public", //path.join("public", "build"),
    ".",
    {
      enter: onEnter,
      js: onJsFile,
    }
  );
}

lib = {
  build,
};

module.exports = lib.build;
module.exports.lib = lib;
