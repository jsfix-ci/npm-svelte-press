#!/usr/bin/env node

const fs = require("fs");
const readline = require("readline");
const path = require("path");
const { argv } = require("process");

const { execSync } = require("child_process");

//const projectRoot = path.join(__dirname, "..");

function caseInsensitive(a, b) {
  if (a.toLowerCase() < b.toLowerCase()) return -1;
  if (a.toLowerCase() > b.toLowerCase()) return 1;
  return 0;
}

function crawlFileSystem(rootPath, srcRoot, destRoot, subPath, callbacks) {
  callbacks["enter"] &&
    callbacks["enter"](rootPath, srcRoot, destRoot, subPath);

  const dirents = fs.readdirSync(path.join(rootPath, srcRoot, subPath), {
    withFileTypes: true,
  });

  const dirNames = dirents
    .filter((y) => y.isDirectory())
    .map((y) => y.name)
    .sort(caseInsensitive);
  dirNames.forEach((dirName) => {
    crawlFileSystem(
      rootPath,
      srcRoot,
      destRoot,
      path.join(subPath, dirName),
      callbacks
    );
  });

  const fileNames = dirents
    .filter((y) => y.isFile())
    .map((y) => y.name)
    .sort(caseInsensitive);
  const types = Object.keys(callbacks);
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

function readFile(srcPath, destPath, transform) {
  const rollupConfig = fs.readFileSync(srcPath, {
    encoding: "utf8",
    flag: "r",
  });
  const lines = rollupConfig.split(/\r?\n/).map((x) => transform(x));
  fs.writeFileSync(destPath, lines.join("\n"), {
    encoding: "utf8",
    flag: "w",
  });
  // const readFile = readline.createInterface({
  //   input: fs.createReadStream(srcPath),
  //   output: fs.createWriteStream(destPath),
  //   terminal: false,
  // });
  //
  // readFile.on("line", _transform).on("close", function () {
  //   console.log(`Created "${this.output.path}"`);
  // });
  //
  // function _transform(line) {
  //   this.output.write(`${transform(line)}\n`);
  // }
}

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

function indexPage(title, subPath, name) {
  return [
    "<!DOCTYPE html>",
    '<html lang="en">',
    "<head>",
    "	<meta charset='utf-8'>",
    "	<meta name='viewport' content='width=device-width,initial-scale=1'>",
    "",
    `	<title>${title}</title>`,
    "",
    "	<link rel='icon' type='image/png' href='/favicon.png'>",
    //    "	<link rel='stylesheet' href='/global.css'>",
    `	<link rel='stylesheet' href='/${path.join(
      "build",
      subPath,
      path.parse(name).name
    )}.css'>`,
    "",
    `	<script defer src='/${path.join("build", subPath, name)}'></script>`,
    "</head>",
    "",
    "<body>",
    "</body>",
    "</html>",
  ].join("\n");
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

crawlFileSystem(
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
crawlFileSystem(
  ".", //projectRoot,
  "src",
  "public", //path.join("public", "build"),
  ".",
  {
    enter: onEnter,
    js: onJsFile,
  }
);
