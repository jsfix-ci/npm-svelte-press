const path = require("path");
const fileSystem = require("./fileSystem");

let lib;

function _transform(srcRoot, destRoot, subPath, name) {
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

function build(rootPath, srcRoot, destRoot, subPath, name) {
  const tempConfigJs = "temp.config.js";
  fileSystem.copy(
    path.join(rootPath, "rollup.config.js"),
    path.join(rootPath, tempConfigJs),
    lib._transform(srcRoot, destRoot, subPath, name)
  );
  execSync(`npm run build ${tempConfigJs}`);
  fileSystem.removeFile(tempConfigJs);
}

lib = {
  _transform,
  build,
};

module.exports = lib;
