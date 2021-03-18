const fs = require("fs");
const path = require("path");

const { execSync } = require("child_process");

const crawlDirectory = require("./lib/crawlDirectory");
const copyFile = require("./lib/copyFile");
const indexPage = require("./lib/indexPage");
const transformRollup = require("./lib/transformRollup");

let lib;

function onJsFile(rootPath, srcRoot, destRoot, subPath, type, name) {
  copyFile(
    path.join(rootPath, "rollup.config.js"),
    path.join(rootPath, "temp.config.js"),
    transformRollup(srcRoot, destRoot, subPath, name)
  );
  execSync("npm run build temp.config.js");
  execSync("rm temp.config.js");
  fs.writeFileSync(
    path.join(destRoot, subPath, path.parse(name).name + ".html"),
    indexPage(path.parse(name).name, subPath, name),
    {
      encoding: "utf8",
      flag: "w",
    }
  );
}

function onEnter(rootPath, srcRoot, destRoot, subPath) {
  let fullPath;
  fullPath = path.join(rootPath, destRoot, subPath);
  if (!fs.existsSync(fullPath)) {
    console.log("mkdir", fullPath);
    fs.mkdirSync(fullPath);
  }
  fullPath = path.join(rootPath, destRoot, "build", subPath);
  if (!fs.existsSync(fullPath)) {
    console.log("mkdir", fullPath);
    fs.mkdirSync(fullPath);
  }
}

function purgeFile(rootPath, srcRoot, destRoot, subPath, type, name) {
  if (subPath.startsWith("build") || name.endsWith(".html")) {
    console.log("rm", path.join(srcRoot, subPath, name));
    fs.unlinkSync(path.join(srcRoot, subPath, name));
  }
}

function purgeDir(rootPath, srcRoot, destRoot, subPath) {
  if (path.join(srcRoot, subPath) !== srcRoot) {
    console.log("rmdir", path.join(srcRoot, subPath));
    fs.rmdirSync(path.join(srcRoot, subPath));
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
