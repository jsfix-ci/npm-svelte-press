const path = require("path");
const fileSystem = require("./fileSystem");

let lib;

function _includeCss(subPath, name) {
  const fullPath = path.join(
    "public",
    "build",
    subPath,
    path.parse(name).name + ".css"
  );
  if (fileSystem.exists(fullPath)) {
    const link = path.join("build", subPath, path.parse(name).name + ".css");
    return `	<link rel='stylesheet' href='/${link}'>`;
  } else {
    return "";
  }
}

function _generate(title, subPath, name) {
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
    lib._includeCss(subPath, name),
    "",
    `	<script defer src='/${path.join("build", subPath, name)}'></script>`,
    "</head>",
    "",
    "<body>",
    "</body>",
    "</html>",
  ].join("\n");
}

function create(destRoot, subPath, name) {
  fileSystem.write(
    path.join(destRoot, subPath, path.parse(name).name + ".html"),
    lib._generate(path.parse(name).name, subPath, name)
  );
}
lib = {
  _generate,
  _includeCss,
  create,
};

module.exports = lib;
