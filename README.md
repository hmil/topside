[![Build Status](https://travis-ci.org/hmil/topside.svg?branch=master)](https://travis-ci.org/hmil/topside)
[![Dev Dependencies](https://david-dm.org/hmil/topside/dev-status.svg)](https://david-dm.org/hmil/topside?type=dev)

# Topside

Topside is a templating library for TypeScript providing type-safety to the view layer.

### Motivation

The view layer is often times a weak spot in web application frameworks. Unsafe templates allow you to publish code with typos and errors and make it hard to refactor views.

Topside prevents your app from compiling if there are any discrepancy between app code and templates. Moreover, with proper tooling, topside could leverage TypeScript support in common IDEs to provide comprehensive and accurate auto-completion while you write your templates!

#### Scope

Topside is not meant to be a replacement for front-end frameworks such as Vue or React. Topside templates produce text only, there is no event-binding. This library targets server-side rendering.
Topside is particularly suited for server-only apps or hybrid apps where a substancial amount of the view is generated on the server.

### Usage

This package allows you to compile topside templates to TypeScript module. Each template exports a default function that takes named parameters as input and returns a string.

Install the CLI compiler package and the TypeScript compiler.

```bash
# Topside and its peer dependencies:
npm install topside @types/escape-html escape-html
# ts-node and typescript for this demo:
npm install ts-node typescript
```

Create a file `template.top.html`
```
@param name: string;

Hello @(name)!
```

Then compile the template to typescript with:
```bash
node_modules/.bin/topside template.top.html
```

Use the generated template in your typescript project. For instance, use the following `main.ts` file:
```typescript
import template from './template.top';

console.log(template({
    name: 'Jason'
}));
```

```bash
node_modules/.bin/ts-node main.ts
```


### Template syntax

The syntax is based off of the [Blade templating engine](https://laravel.com/docs/5.4/blade) used in [Laravel](https://laravel.com/).
While there is no intention to be 100% compatible with Blade, templates should be easily convertible from one to the other.

**Work in progress:** Many features are missing compared to Blade. Those will be added eventually but development effort is currently focused on tooling and IDE integration.  
Take a look at the `spec/fixtures/tempaltes` directory for a comprehensive list of features.

#### Basics & differences with Blade

In topside, all instructions start with `@`. Use braces to pass parameters to a rule. eg:
```
@if(data == 'world')
    Rule the @(data)!
@endif
```

Not that contrary to many templating languages, including Blade, topside doesn't support curly-braces based syntax.

```
DON'T: {{ something }}
DO: @( something )
```

_side note: You may omit the braces when you pass data to a rule (eg. @if data == 'world') in which case everything until the end-of-line is evaluated and the end-of-line is not rendered. We recommend you stick to the brace-based syntax unless you need to hide the line-break from the rendered text._

#### Text interpolation

Display javascript expressions using the `@` directive:

```
<h1>Hello @("John")</h1>
```

By default, values are html-escaped. Use `@html` to display unescaped text:

```
<h1>Hello @html("<b>John</b>")</h1>
```

**To Blade users:** Don't use brackets-based syntax (`{{ text }}` and similar). In topside, all instructions start with `@`.

#### Parameters

Declare the parameters expected by your template using the `@param` directive:

```
@param name: string

<h1>Hello @(name)</h1>
```

#### Imports

Often times you will need to pass custom models to your templates. Import the type definition like you would in a regular typescript file but with `@import` instead of `import`

```
@import User from 'path/to/User'

@param user: User

<h1>Hello @(user.name)</h1>
```

#### Conditionals

Use `@if`, `@elsif`, `@else` and `@endif` to render text conditionnally.

```
@if (user.role === Role.King)
  All hail the king!
@elsif (user.role === Role.Queen)
  All hail the queen!
@else
  Move it!
@endif
```

#### Loops

The `@for` rule is merely a translation to the `for` TypeScript construct.

```
@param animals: string[];

In the farm there are:
@for(animal of animals)
- @(animal)
@endfor

Each has a number:
@for(i = 0 ; i < 10 ; i++)
- @(i): @(animals[i])
@endfor
```
