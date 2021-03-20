const path = require("path");
const { program } = require("commander");

const fileSystem = require("./fileSystem");
const config = require("./config");

let lib;

function _generateRootComponent(title, componentName) {
  return `
import ${componentName} from "./${componentName + ".svelte"}";

const app = new ${componentName}({
  target: document.body,
  props: {
    name: "${title}",
  },
});

export default app;
    `;
}

function _generateSubPath(subPath) {
  if (subPath === ".") {
    return path.join("..", "_layouts");
  } else {
    return path.join(...subPath.split("/").map(() => ".."), "..", "_layouts");
  }
}

function _generateScript(subPath, layout) {
  if (layout) {
    return `
    <script>
    	export let name;
      import ${layout} from '${lib._generateSubPath(subPath)}/${layout}.svelte'
    </script>
    `;
  } else {
    return `
    <script>
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

function page() {
  program.version("0.0.1");
  program.requiredOption("-t, --title <title>", "Title");
  program.option("-p, --path <path>", "Path", ".");
  program.option("-l, --layout <component>", "Layout");

  program.parse(process.argv);

  const options = program.opts();

  const kebabTitle = lib._kebabCase(options.title);
  const pascalTitle = lib._pascalCase(options.title);
  const pascalLayout = lib._pascalCase(options.layout);
  const kebabLayout = lib._kebabCase(options.layout);

  config.addPage(options.path, kebabTitle, "title", options.title);
  config.addPage(options.path, kebabTitle, "layout", kebabLayout);
  config.addLayout(kebabLayout);

  fileSystem.mkdir(path.join("src", options.path));
  fileSystem.write(
    path.join("src", options.path, kebabTitle + ".js"),
    lib._generateRootComponent(options.title, pascalTitle)
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
