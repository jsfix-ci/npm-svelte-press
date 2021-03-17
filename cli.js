#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const { execSync } = require("child_process");

const crawlDirectory = require("./lib/crawlDirectory");
const readFile = require("./lib/readFile");
const indexPage = require("./lib/indexPage");

function onJsFile(rootPath, srcRoot, destRoot, subPath, type, name) {
  readFile(
    path.join(rootPath, "rollup.config.js"),
    path.join(rootPath, "temp.config.js"),
    tempRollup(srcRoot, destRoot, subPath, name)
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

function tempRollup(srcRoot, destRoot, subPath, name) {
  return function (line) {
    const inputRegex = new RegExp("input[:]");
    const fileRegex = new RegExp("file[:]");
    const cssRegex = new RegExp("css.+output[:]");
    if (inputRegex.test(line)) {
      return `input: '${path.join(srcRoot, subPath, name)}',`;
    } else if (fileRegex.test(line)) {
      return `file: '${path.join(destRoot, "build", subPath, name)}',`;
    } else if (cssRegex.test(line)) {
      return `css({ output: '${path.parse(name).name}.css' }),`;
    } else {
      return line;
    }
  };
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
