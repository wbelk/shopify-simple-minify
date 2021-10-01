Check out my Shopify apps: [https://apps.shopify.com/partners/william-belk](https://apps.shopify.com/partners/william-belk)

## Overview

This is a simple Shopify theme minifier and module router that follows existing `.liquid` concepts like `include`, does not use Webpack. Changed files/modules will be watched and built automatically. This does not require a proxy and will play nicely with Themekit.

- Minifiyer (js, css, html, liquid)
- Liquid compressor (adds `{%- ... -%}` to liquid tags (except `assign` or `capture`))
- Transpiler (ES6 => ES5) for files and any javascript that does not contain `liquid` tags
- Simple module router using `{% minifiy_module 'stuff/myfile.html %}`
- Watches for changes and rebuilds

## Assumptions

- Minfying is awesome
- Complex ES6 => ES5 compilers, routers, and bundlers make life harder, not easier. We're not building rockets, we're coding a (hopefully simple and ultra lightweight) Shopify theme.
- If we could build every theme using raw javascript, we should. It's what Clint Eastwood would do... think about it.
- Liquid is pretty handy, so we don't need to come up with a complex deal to replace what it already does.
- Reliably minifying javascript + liquid is almost impossible (there is no npm pacakge for it, so that means it's a problem so hard that the community hasn't cracked it yet), so we need to start thinking about that in our code and trying to extract liquid from javascript as much as possible. That's what will maximize our potential to minify. A bit of architecture and patterns can go a long way.

## Local Requirements

- `node.js v12+`
- `npm`

## Getting Started

All directories/files of `./minify_modules/source_theme` are minified/compiled/copied over to `./`.

Init an npm project if you haven't already done so.

```
npm init
```

Install this npm package.

```
npm install --save-dev @wbelk/shopify-simple-minify
```

Add a script to `package.json`:

```
"minify": "node node_modules/@wbelk/shopify-simple-minify/src/index.js"
```

`npm run minify` will build directories watch for file changes and build on any new or change.

Copy all (or parts) of your existing Shopify theme to `./minify_modules/source_theme`. For example, if you just want to minify a few files, create your Shopify directory like `./minify_modules/source_theme/snippets` and copy your selected snippets over, open the files and save, then they will be minified into `./snippets`.

All contents of `./minify_modules/source_theme` will be minified/transpiled/compiled or copied over to Shopify theme directories in the root of the repo, i.e. `./minify_modules/source_theme/assets` => `./assets`.

If you're copying files into `./minify_modules/source_theme` for the first time, you'll want to restart `npm run minify`.

## Modules

Insert modules into other files using `{% minifiy_module 'stuff/myfile.html %}`. Modules are located in the `./minify_modules/modules` directory and function just like an include. However, `./minify_modules/modules` directory supports subdirectories, and you can add your preferred file type suffix so that your IDE will give you better formatting than the `.liquid` helpers which are not great for VS Code, Atom, etc.

** You cannot include a module inside of another module (unlike with the Shopify liquid `include`) **

## Important Notes

- Any `js` or `css` in `/assets` will be outputted with `.min.js` or `.min.css`, so be sure to change your references to include `.min`
- Any source assets from `minify_modules/source_theme` already containing `.min` will not be minified again, only copied over to the root `./assets` directory if new or changed.
- To rebuild all files, either delete the file `./.minify_changelog` which is generated on build, or delete the root Shopify directories. If you need to prune old files, it's best to delete the root Shopify directories as this library does not track/handle deletions.

## Troubleshooting

- If your theme cannot complete building/minifying javascript that contains liquid tags, there may be issues with your quotes. Try changing single to double, or vice versa: `class="{{ 'foo' }}` change to `class="{{ "foo" }}`.
- Minifying Javascript that contains Liquid is dang-near impossible, so this package just removes multiple spaces and line breaks from Javascript that contains Liquid tags.
- If want to control your node version check out `nvm`
