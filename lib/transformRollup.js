let lib;

function transformRollup(srcRoot, destRoot, subPath, name) {
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

lib = {
  transformRollup,
};

module.exports = lib.transformRollup;
module.exports.lib = lib;
