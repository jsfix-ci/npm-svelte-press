const path = require("path");

const { execSync } = require("child_process");

const crawlDirectory = require("./lib/crawlDirectory");
const indexPage = require("./lib/indexPage");
const transformRollup = require("./lib/transformRollup");
const fileSystem = require("./lib/fileSystem");

let lib;

function onJsFile(rootPath, srcRoot, destRoot, subPath, type, name) {
  fileSystem.copy(
    path.join(rootPath, "rollup.config.js"),
    path.join(rootPath, "temp.config.js"),
    transformRollup(srcRoot, destRoot, subPath, name)
  );
  execSync("npm run build temp.config.js");
  execSync("rm temp.config.js");
  fileSystem.write(
    path.join(destRoot, subPath, path.parse(name).name + ".html"),
    indexPage(path.parse(name).name, subPath, name)
  );
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

function main() {
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
  main,
};

module.exports = lib.main;
module.exports.lib = lib;
