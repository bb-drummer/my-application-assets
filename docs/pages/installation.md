---
title: Installation
description: There are many ways to install Foundation, but if you're just getting started, we have a few suggestions.
---

## Source Installation


see [https://gitlab.bjoernbartels.earth/zf2/application-base](https://gitlab.bjoernbartels.earth/zf2/application-base) for details

---



## Styles/Script 'CDN' Links

Just drop one of these `<script>` tags into your HTML and you're set:

```html
<!-- Compressed CSS -->
<link rel="stylesheet" href="https://my-application.net/assets/css/myapplication.min.css">

<!-- Compressed JavaScript -->
<script src="https://my-application.net/assets/js/myapplication.min.js"></script>
```

---



## Package Managers

[MyAppliction] is available on PAckagist/Composer. The package includes all of the source Sass and JavaScript files, as well as compiled CSS and JavaScript and complete php sources , in uncompressed and compressed flavors.

- Composer: `php composer.phar creapte project my-application/application-base`

### Package Contents

Here's what comes in the package.

- `scss/`: Source Sass files. Use this folder as a load path in Sass.
- `js/`: Source JavaScript files. If you're using a build system, make sure `myapplication.core.js` is loaded first.
- `dist/`: Compiled files.
  - `css/`: Compiled CSS files. Includes minified and unminified files.
  - `js/`: Concatenated JavaScript files. Includes minified and unminified files.

---

## Other Integrations

...
