const path = require("path");

let lib;

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

lib = {
  indexPage,
};

module.exports = lib.indexPage;
module.exports.lib = lib;
