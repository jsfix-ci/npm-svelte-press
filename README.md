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
  "press-page": "press-page",
  "press-start": "npm run press-build && npm run start"
},
```

Create some pages

```bash
npm run press-page -- -t Index
npm run press-page -- -t Home    -l Layout
npm run press-page -- -t About   -l Layout
npm run press-page -- -t Contact -l Layout
npm run press-page -- -t Login   -l Layout -p account
npm run press-page -- -t Signup  -l Layout -p account
npm run press-page -- -t Reset   -l Layout -p account
```

Update Layout found in `_layouts/Layout.svelte`

```html
<div>
  <h1>I am layout Layout</h1>
  <div>
    <a href="/">Index</a>
    <a href="/home.html">Home</a>
    <a href="/about.html">About</a>
    <a href="/contact.html">Contact</a>
    <a href="/account/login.html">Login</a>
    <a href="/account/signup.html">Signup</a>
    <a href="/account/reset.html">Reset</a>
  </div>
  <slot></slot>
</div>
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
- [http://localhost:5000/home.html](http://localhost:5000/home.html)
- [http://localhost:5000/about.html](http://localhost:5000/about.html)
- [http://localhost:5000/contact.html](http://localhost:5000/contact.html)
- [http://localhost:5000/account/login.html](http://localhost:5000/account/login.html)
- [http://localhost:5000/account/signup.html](http://localhost:5000/account/signup.html)
- [http://localhost:5000/account/reset.html](http://localhost:5000/account/reset.html)
