const fs = require("fs");

let lib;

function copyFile(srcPath, destPath, transform) {
  const contents = fs.readFileSync(srcPath, {
    encoding: "utf8",
    flag: "r",
  });
  const lines = contents.split(/\r?\n/).map((x) => transform(x));
  fs.writeFileSync(destPath, lines.join("\n"), {
    encoding: "utf8",
    flag: "w",
  });
}

lib = {
  copyFile,
};

module.exports = lib.copyFile;
module.exports.lib = lib;
