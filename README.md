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
  "press-build": "press-build",
  "press-page": "press-page"
},
```

Create some pages

```bash
npm run press-page -- -t Index
npm run press-page -- -t Home -l Default
npm run press-page -- -t About -l Default
npm run press-page -- -t Contact -l Default
npm run press-page -- -p account -t Login -l Account
npm run press-page -- -p account -t Signup -l Account
npm run press-page -- -p account -t Reset -l Account
```

Generate the static site

```bash
npm run press-build
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
- [http://localhost:5000/account/login.html](http://localhost:5000/account/login.html)
- [http://localhost:5000/account/signup.html](http://localhost:5000/account/signup.html)
- [http://localhost:5000/account/reset.html](http://localhost:5000/account/reset.html)
