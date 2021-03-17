const fs = require("fs");

let lib;

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
}

lib = {
  readFile,
};

module.exports = lib.readFile;
module.exports.lib = lib;
