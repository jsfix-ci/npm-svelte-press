const path = require("path");
const { program } = require("commander");

const fileSystem = require("./fileSystem");

let lib;

function page() {
  program.version("0.0.1");
  program.option("-t, --title <title>", "Title");
  program.option("-p, --path <path>", "Path", ".");

  program.parse(process.argv);

  const options = program.opts();

  fileSystem.mkdir(path.join("src", options.path));
  fileSystem.write(
    path.join("src", options.path, options.title.toLowerCase() + ".js"),
    `
import ${options.title} from "./${options.title + ".svelte"}";

const app = new ${options.title}({
  target: document.body,
  props: {
    name: "${options.title}",
  },
});

export default app;
    `
  );

  fileSystem.write(
    path.join("src", options.path, options.title + ".svelte"),
    `
    <script>
    	export let name;
    </script>

    <main>
    	<h1>Hello {name}!</h1>
    </main>

    <style>
    	main {
    		text-align: center;
    		padding: 1em;
    		max-width: 240px;
    		margin: 0 auto;
    	}

    	h1 {
    		color: #ff3e00;
    		text-transform: uppercase;
    		font-size: 4em;
    		font-weight: 100;
    	}

    	@media (min-width: 640px) {
    		main {
    			max-width: none;
    		}
    	}
    </style>
    `
  );
}

lib = {
  page,
};

module.exports = lib.page;
module.exports.lib = lib;
