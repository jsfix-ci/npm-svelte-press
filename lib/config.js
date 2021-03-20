const _ = require("lodash");
const fileSystem = require("./fileSystem");

let lib;

const FILE_NAME = "svelte-press.config.json";

function _read() {
  const defaultValue = {
    layouts: [],
    pages: {},
  };
  return JSON.parse(
    fileSystem.read(lib.FILE_NAME, JSON.stringify(defaultValue))
  );
}

function _write(json) {
  fileSystem.write(lib.FILE_NAME, JSON.stringify(json, null, 2));
}

function addPage(path, permalink, subKey, value) {
  const key = (path === "."
    ? ["pages", permalink, subKey]
    : ["pages", path.replace(/[\/]/g, "."), permalink, subKey]
  ).join(".");

  const json = lib._read();
  _.set(json, key, value);
  lib._write(json);
}

function addLayout(permalink) {
  const json = lib._read();
  _.set(
    json,
    "layouts",
    _.uniq(_.get(json, "layouts").concat([permalink]).sort())
  );
  lib._write(json);
}

lib = {
  FILE_NAME,
  _read,
  _write,
  addPage,
  addLayout,
};

module.exports = lib;
