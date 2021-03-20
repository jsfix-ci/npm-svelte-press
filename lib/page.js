const path = require("path");
const { program } = require("commander");

const fileSystem = require("./fileSystem");

let lib;

function _generateRoot(componentName) {
  return `
import ${componentName} from "./${componentName + ".svelte"}";

const app = new ${componentName}({
  target: document.body,
  props: {
    name: "${componentName}",
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

function _generateComponent(subPath, layout) {
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

function page() {
  program.version("0.0.1");
  program.requiredOption("-t, --title <title>", "Title");
  program.option("-p, --path <path>", "Path", ".");
  program.option("-l, --layout <component>", "Layout");

  program.parse(process.argv);

  const options = program.opts();

  fileSystem.mkdir(path.join("src", options.path));
  fileSystem.write(
    path.join("src", options.path, options.title.toLowerCase() + ".js"),
    lib._generateRoot(options.title)
  );

  fileSystem.write(
    path.join("src", options.path, options.title + ".svelte"),
    lib._generateComponent(options.path, options.layout)
  );

  if (options.layout) {
    const fullPath = path.join("_layouts", options.layout + ".svelte");
    if (fileSystem.missing(fullPath)) {
      fileSystem.mkdir("_layouts");
      fileSystem.write(fullPath, lib._generateLayout(options.layout));
    }
  }
}

lib = {
  _generateLayout,
  _generateSubPath,
  _generateScript,
  _generateMain,
  _generateStyle,
  _generateRoot,
  _generateComponent,
  page,
};

module.exports = lib.page;
module.exports.lib = lib;
