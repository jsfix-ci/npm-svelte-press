const _ = require("lodash");
const path = require("path");
const fileSystem = require("./fileSystem");

let lib;

const JSON_NAME = "svelte-press.config.json";
const JS_NAME = "svelte-press.js";

function read() {
  const defaultValue = {
    layouts: [],
    pages: {},
  };
  return JSON.parse(
    fileSystem.read(lib.JSON_NAME, JSON.stringify(defaultValue))
  );
}

function write(json) {
  fileSystem.write(lib.JSON_NAME, JSON.stringify(json, null, 2));
  fileSystem.write(
    path.join("src", lib.JS_NAME),
    `
    // THIS FILE IS GENERATED.  DO NOT EDIT. SEE ${lib.JSON_NAME}
    export default ${JSON.stringify(json, null, 2)}
    `
  );
}

function pageKey(path, permalink) {
  return (path === "."
    ? ["pages", permalink]
    : ["pages", path.replace(/[\/]/g, "."), permalink]
  ).join(".");
}

function addPage(path, permalink, subKey, value) {
  const key = [lib.pageKey(path, permalink), subKey].join(".");

  const json = lib.read();

  _.set(json, key, value);

  lib.write(json);
}

function addLayout(permalink) {
  const json = lib.read();

  const layouts = _.get(json, "layouts", []);
  _.set(
    json,
    "layouts",
    _.uniq(_.compact(_.concat(layouts, permalink)).sort())
  );

  lib.write(json);
}

lib = {
  JSON_NAME,
  JS_NAME,
  read,
  write,
  pageKey,
  addPage,
  addLayout,
};

module.exports = lib;
