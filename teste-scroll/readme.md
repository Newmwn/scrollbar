![Built With Stencil](https://img.shields.io/badge/-Built%20With%20Stencil-16161d.svg?logo=data%3Aimage%2Fsvg%2Bxml%3Bbase64%2CPD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE5LjIuMSwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IgoJIHZpZXdCb3g9IjAgMCA1MTIgNTEyIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA1MTIgNTEyOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI%2BCjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI%2BCgkuc3Qwe2ZpbGw6I0ZGRkZGRjt9Cjwvc3R5bGU%2BCjxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik00MjQuNywzNzMuOWMwLDM3LjYtNTUuMSw2OC42LTkyLjcsNjguNkgxODAuNGMtMzcuOSwwLTkyLjctMzAuNy05Mi43LTY4LjZ2LTMuNmgzMzYuOVYzNzMuOXoiLz4KPHBhdGggY2xhc3M9InN0MCIgZD0iTTQyNC43LDI5Mi4xSDE4MC40Yy0zNy42LDAtOTIuNy0zMS05Mi43LTY4LjZ2LTMuNkgzMzJjMzcuNiwwLDkyLjcsMzEsOTIuNyw2OC42VjI5Mi4xeiIvPgo8cGF0aCBjbGFzcz0ic3QwIiBkPSJNNDI0LjcsMTQxLjdIODcuN3YtMy42YzAtMzcuNiw1NC44LTY4LjYsOTIuNy02OC42SDMzMmMzNy45LDAsOTIuNywzMC43LDkyLjcsNjguNlYxNDEuN3oiLz4KPC9zdmc%2BCg%3D%3D&colorA=16161d&style=flat-square)

# Stencil Component Starter

This is a starter project for building a standalone Web Component using Stencil.

Stencil is also great for building entire apps. For that, use the [stencil-app-starter](https://github.com/ionic-team/stencil-app-starter) instead.

# Stencil

Stencil is a compiler for building fast web apps using Web Components.

Stencil combines the best concepts of the most popular frontend frameworks into a compile-time rather than run-time tool. Stencil takes TypeScript, JSX, a tiny virtual DOM layer, efficient one-way data binding, an asynchronous rendering pipeline (similar to React Fiber), and lazy-loading out of the box, and generates 100% standards-based Web Components that run in any browser supporting the Custom Elements v1 spec.

Stencil components are just Web Components, so they work in any major framework or with no framework at all.

## Getting Started

To start building a new web component using Stencil, clone this repo to a new directory:

```bash
git clone https://github.com/ionic-team/stencil-component-starter.git my-component
cd my-component
git remote rm origin
```

and run:

```bash
npm install
npm start
```

To build the component for production, run:

```bash
npm run build
```

To run the unit tests for the components, run:

```bash
npm test
```

Need help? Check out our docs [here](https://stenciljs.com/docs/my-first-component).

## Naming Components

When creating new component tags, we recommend _not_ using `stencil` in the component name (ex: `<stencil-datepicker>`). This is because the generated component has little to nothing to do with Stencil; it's just a web component!

Instead, use a prefix that fits your company or any name for a group of related components. For example, all of the Ionic generated web components use the prefix `ion`.

## Using this component

There are three strategies we recommend for using web components built with Stencil.

The first step for all three of these strategies is to [publish to NPM](https://docs.npmjs.com/getting-started/publishing-npm-packages).

### Script tag

- Put a script tag similar to this `<script type='module' src='https://unpkg.com/my-component@0.0.1/dist/my-component.esm.js'></script>` in the head of your index.html
- Then you can use the element anywhere in your template, JSX, html etc

### Node Modules

- Run `npm install my-component --save`
- Put a script tag similar to this `<script type='module' src='node_modules/my-component/dist/my-component.esm.js'></script>` in the head of your index.html
- Then you can use the element anywhere in your template, JSX, html etc

### In a stencil-starter app

- Run `npm install my-component --save`
- Add an import to the npm packages `import my-component;`
- Then you can use the element anywhere in your template, JSX, html etc

# niup/devkit / niup-angular/devkit / niup-react/devkit

<h5> Main library for Niup Front End Angular Components</h5>

- The most recent version is placed on top of the file (is orderent in a descendant way of versions); <br><br>
- Every time a developer makes changes to the lib, he must comment in the correspondant version what has been done, and that should be included in the pull request; <br><br>
- Changes/Additions on component outputs, use the (), and on inputs use the []; <br><br>
- If its a renaming of property, the => should be used; <br><br>
- If its an addition of property or event, it should end with +; <br><br>
- If its a removal of property or event, it should end with -; <br><br>
- Other changes, should be commented in the simplest and most concise way, in ordinary text without special markdown; <br><br>
- The added lines on this file, should also be included in the PR description containing them; <br><br>

## Changelog

<h4>0.0.15</h4>
  - Virtuall Scroller
    - [bufferItems] +
    - [customAutoFlowStyle] +
    - [viewPortItemStyles] +
    - Fixed resizable event not working
    - Fixed virtuall scroller not rendering the correct amount of items when the scroller had an height/width of 0
    - Css bug fix
---

<h2 style="font-weight: bold">0.0.14</h2>

---

<h2 style="font-weight: bold">0.0.13</h2>

---

<h2 style="font-weight: bold">0.0.12</h2>

- ImagesHelper
  - getImageViaAuthentication() +
- Virtual Scroller
  - Improves the speed in which the list takes to render the items
  - Fixed identifiers error when we were sending it's value as null or []
  - Virtual scroller now uses shadow root
  - Fixed the item height/width being 0
  - [itemContainerStyles] +
  - Virtual scroller has it's own key board navigation logic
  - [hasTabNavigation] -> [tabNavigation]
  - [itemClassName] -> [elemFocusClass]
  - [elemToFocus] +
  - Fixed scrollToNextItem and scrollToPreviousItem not working
- Key Nav
  - Bug Fixes and improves

---

<h2 style="font-weight: bold">0.0.11</h2>

- Key Nav
  - Now we pass an config object in the contructor
  - Bug fix
  - focusFirstItem +

---

<h2 style="font-weight: bold">0.0.10</h2>

---

<h2 style="font-weight: bold">0.0.9</h2>

- Key Nav
  - Fixed not being able to navigate from the last item to the first
  - Fixed not being able to navigate, if the container's item had more than one class
- Virtual Scroller
  - Improves
- Enums
  - Direction Enum now start with an upper case

---

<h2 style="font-weight: bold">0.0.9</h2>

---

<h2 style="font-weight: bold">0.0.8</h2>

---

<h2 style="font-weight: bold">0.0.7</h2>

- Virtual Scroller
  - [keyboardNavigation] +
  - [hasTabNavigation] +
  - Fixed getting the incorrect value of item height/width and host height/width, the value was being rounded
  - Item's height, width and list's gap value are now converted to TBU's
- Key Nav
  - Now key nav works on virtual scrollers
  - Fixed navigation not working correctly when in horizontal mode and with more than one row
  - Fixed not being able to focus on the first item of the list
  - Fixed events listeners not being removed
  - Bug fix
- Reset Scss (User Agent StyleSheet)

---

<h2 style="font-weight: bold">0.0.6</h2>

- Fixed items being rendered without having the "children" array updated
- Now list updates correctly when updating "direction" property

---

 <h2 style="font-weight: bold">0.0.5</h2>

- Exported missing enum -> color-type.enum

---

> <h2 style="font-weight: bold">0.0.4</h2>

- Fixed scrollStartEvent and scrollStopEvent not emiting when they were supposed to
- (scrollEndEvent) -> (scrollStopEvent)
- (scrollEvent) +
- (scrollHeightChangeEvent) +
- performance improve

---

> <h2 style="font-weight: bold">0.0.3</h2>

- Remove stencil from lib name
- Rename "tag-components.ts" for "exclude.components.ts"

---
