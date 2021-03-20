const _ = require("lodash");
const path = require("path");
const { program } = require("commander");

const fileSystem = require("./fileSystem");
const config = require("./config");

let lib;

function _generateRootComponent(subPath, permalink, title, componentName) {
  return `
${lib._generateImportPeer(componentName, componentName, "svelte")}
${lib._generateImportRoot("sveltePress", subPath, config.JS_NAME)}

const app = new ${componentName}({
  target: document.body,
  props: {
    name: sveltePress.${config.pageKey(subPath, permalink)}.title,
    sveltePress
  },
});

export default app;
    `;
}

function _generateSubPath(subPath) {
  return path.join(...subPath.split("/").map(() => ".."));
}

function _generateImportPeer(object, fileName, extension) {
  const fullName = _.compact([fileName, extension]).join(".");
  return `import ${object} from './${fullName}'`;
}

function _generateImportRoot(object, subPath, fileName, extension) {
  const fullName = _.compact([fileName, extension]).join(".");
  const fullPath =
    subPath === "."
      ? [subPath, fullName].join("/")
      : [lib._generateSubPath(subPath), fullName].join("/");
  return `import ${object} from '${fullPath}'`;
}

function _generateImportOther(object, subPath, subPath2, fileName, extension) {
  const fullName = _.compact([fileName, extension]).join(".");
  const fullPath =
    subPath === "."
      ? [subPath2, fullName].join("/")
      : [lib._generateSubPath(subPath), subPath2, fullName].join("/");
  return `import ${object} from '${fullPath}'`;
}

function _generateScript(subPath, layout) {
  if (layout) {
    return `
    <script>
    	export let sveltePress;
    	export let name;
      ${lib._generateImportOther(
        layout,
        subPath,
        ["..", "_layouts"].join("/"),
        layout,
        "svelte"
      )}
    </script>
    `;
  } else {
    return `
    <script>
    	export let sveltePress;
    	export let name;
    </script>
    `;
  }
}

function _generateMain(layout) {
  if (layout) {
    return `
    <${layout}>
      ${lib._generateMain()}
    </${layout}>
    `;
  } else {
    return `
    <main>
    	<h2>{name}!</h2>
    </main>
    `;
  }
}

function _generateStyle() {
  return `
    <style>
    	main {
    		text-align: center;
    		padding: 1em;
    		max-width: 240px;
    		margin: 0 auto;
    	}

    	h2 {
    		color: #ff3e00;
    		text-transform: uppercase;
    		font-size: 2em;
    		font-weight: 50;
    	}
    </style>
    `;
}

function _generatePageComponent(subPath, layout) {
  return `
    ${lib._generateScript(subPath, layout)}

    ${lib._generateMain(layout)}

    ${lib._generateStyle()}
    `;
}

function _generateLayout(layout) {
  return `
    <div>
       <h1>${layout}</h1>
       <slot></slot>
    </div>

    <style>
    	h1 {
    		text-align: center;
    		padding: 1em;
    		max-width: 240px;
    		margin: 0 auto;
    		color: #ff3e00;
    		text-transform: uppercase;
    		font-size: 4em;
    		font-weight: 100;
    	}
    </style>
`;
}

function _pascalCase(title) {
  if (title === undefined || title === null) {
    return title;
  } else {
    return title
      .toLowerCase()
      .replace(/-+/g, " ")
      .trim()
      .split(/\s+/)
      .map((x) => x.replace(/[^0-9a-z]/g, ""))
      .map((x) => x.charAt(0).toUpperCase() + x.slice(1))
      .join("");
  }
}

function _kebabCase(title) {
  if (title === undefined || title === null) {
    return title;
  } else {
    return title
      .toLowerCase()
      .replace(/-+/g, " ")
      .trim()
      .split(/\s+/)
      .map((x) => x.replace(/[^0-9a-z]/g, ""))
      .join("-");
  }
}

function _camelCase(title) {
  if (title === undefined || title === null) {
    return title;
  } else {
    const pascalCase = lib._pascalCase(title);
    return pascalCase.charAt(0).toLowerCase() + pascalCase.slice(1);
  }
}

function page() {
  program.version("0.0.1");
  program.requiredOption("-t, --title <title>", "Title");
  program.option("-p, --path <path>", "Path", ".");
  program.option("-l, --layout <component>", "Layout");

  program.parse(process.argv);

  const options = program.opts();

  const kebabTitle = lib._kebabCase(options.title);
  const pascalTitle = lib._pascalCase(options.title);
  const camelTitle = lib._camelCase(options.title);

  const pascalLayout = lib._pascalCase(options.layout);
  const kebabLayout = lib._kebabCase(options.layout);

  fileSystem.mkdir(path.join("src", options.path));

  config.addPage(options.path, camelTitle, "title", options.title);
  config.addPage(options.path, camelTitle, "permalink", kebabTitle);
  config.addPage(options.path, camelTitle, "layout", kebabLayout);
  config.addLayout(kebabLayout);

  fileSystem.write(
    path.join("src", options.path, kebabTitle + ".js"),
    lib._generateRootComponent(
      options.path,
      camelTitle,
      options.title,
      pascalTitle
    )
  );

  fileSystem.write(
    path.join("src", options.path, pascalTitle + ".svelte"),
    lib._generatePageComponent(options.path, pascalLayout)
  );

  if (pascalLayout) {
    const fullPath = path.join("_layouts", pascalLayout + ".svelte");
    if (fileSystem.missing(fullPath)) {
      fileSystem.mkdir("_layouts");
      fileSystem.write(fullPath, lib._generateLayout(pascalLayout));
    }
  }
}

lib = {
  _kebabCase,
  _pascalCase,
  _camelCase,
  _generateImportPeer,
  _generateImportRoot,
  _generateImportOther,
  _generateLayout,
  _generateSubPath,
  _generateScript,
  _generateMain,
  _generateStyle,
  _generateRootComponent,
  _generatePageComponent,
  page,
};

module.exports = lib.page;
module.exports.lib = lib;
