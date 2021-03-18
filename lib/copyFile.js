const fileSystem = require("./fileSystem");

let lib;

function copyFile(srcPath, destPath, transform) {
  const contents = fileSystem.read(srcPath);
  const lines = fileSystem.parse(contents, transform);
  fileSystem.write(destPath, lines);
}

lib = {
  copyFile,
};

module.exports = lib.copyFile;
module.exports.lib = lib;
