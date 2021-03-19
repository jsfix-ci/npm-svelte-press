# Simple static site generator for Svelte

## Quick Start

Create a new Svelte project

```bash
npx degit sveltejs/template my-static-site
cd my-static-site
npm install
```

Install svelte-press

```bash
npm install svelte-press --save-dev
```

Add a script to package.json

```json
"scripts": {
  "press-build": "press-build"
},
```

Create some pages

```bash
cp src/main.js src/index.js
cp src/main.js src/about.js
```

Generate the static site

```bash
npm run press
```

Start web server

```bash
npm run start
```

View pages

- [http://localhost:5000/](http://localhost:5000/)
- [http://localhost:5000/index.html](http://localhost:5000/index.html)
- [http://localhost:5000/main.html](http://localhost:5000/main.html)
- [http://localhost:5000/about.html](http://localhost:5000/about.html)
