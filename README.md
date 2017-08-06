[![Build Status](https://travis-ci.org/hmil/topside.svg?branch=master)](https://travis-ci.org/hmil/topside)
[![Dependencies Status](https://david-dm.org/hmil/topside/status.svg)](https://david-dm.org/hmil/topside)
[![Dev Dependencies](https://david-dm.org/hmil/topside/dev-status.svg)](https://david-dm.org/hmil/topside?type=dev)

# Topside

Topside is a templating language and compiler targetting TypeScript to bring type-safety to the view layer.

## Motivation

![front-end fail](https://raw.githubusercontent.com/hmil/topside/master/resources/front-end.png)  
*It was at this moment Matt knew he should've used Topside.*


The view layer is often times a weak spot in web application frameworks. Unsafe templates allow you to publish code with typos and errors. Refactoring is hard because no tool can efficiently find references in the templates.

Topside introduces type checking to the view layer. By doing so, common mistakes don't make it past the compilation stage. Moreover, editor features such as type-based autocompletion, definition and usage lookup and assisted refactoring are made possible.

### Scope

Topside is not meant to be a replacement for front-end frameworks such as Vue or React. Topside templates produce text only, there is no event-binding or DOM parsing involved. This library targets server-side rendering.
Topside is particularly suited for server-only apps or hybrid apps where a substancial amount of the view is generated on the server.

## Usage

**Hint:** To make the most of Topside, I recommend using [VSCode](https://code.visualstudio.com/) with the [topside-vscode](https://github.com/hmil/topside-vscode) plugin (available in the extensions Marketplace).

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


## Template syntax

The syntax is based off of the [Blade templating engine](https://laravel.com/docs/5.4/blade) used in [Laravel](https://laravel.com/).
While there is no intention to be 100% compatible with Blade, templates should be easily convertible from one to the other.

**Work in progress:** Many features are missing compared to Blade. Those will be added eventually but development effort is currently focused on tooling and IDE integration.  
Take a look at the `spec/fixtures/templates` directory for a comprehensive list of features.

### Basics & Differences with Blade

In topside, all instructions start with `@`. Use braces to pass parameters to a rule. eg:
```
@if(data == 'world')
    Rule the @(data)!
@endif
```

Note that contrary to many templating languages, including Blade, topside doesn't support curly-braces based syntax.

```
DON'T: {{ something }}
DO: @( something )
```

_side note: You may omit the braces when you pass data to a rule (eg. @if data == 'world') in which case everything until the end-of-line is evaluated and the end-of-line is not rendered. We recommend you stick to the brace-based syntax unless you need to hide the line-break from the rendered text._

The other main difference is that topside introduces the rules `@param` and `@include` in order to define the template interface. All template parameters must be declared with `@param` otherwise a type error will be raised.

### Text interpolation

Display javascript expressions using the `@` directive:

```
<h1>Hello @("John")</h1>
```

By default, values are html-escaped. Use `@html` to display unescaped text:

```
<h1>Hello @html("<b>John</b>")</h1>
```

**To Blade users:** Don't use brackets-based syntax (`{{ text }}` and similar). In topside, all instructions start with `@`.

### Parameters

Declare the parameters expected by your template using the `@param` directive:

```
@param name: string

<h1>Hello @(name)</h1>
```

### Imports

Often times you will need to pass custom models to your templates. Import the type definition like you would in a regular typescript file but with `@import` instead of `import`

```
@import User from 'path/to/User'

@param user: User

<h1>Hello @(user.name)</h1>
```

### Conditionals

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

### Loops

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

### Litteral '@' symbol

You could print a literal `@` by using string interpolation `@('@')` but topside provides a cleaner alternative: Simply type `@@` to print one `@`.  
`hello@@world` => `hello@world`

### Comments

The `--` rule allows you to write comments in the template. Such comments are completely removed from the produced output.

```
@--  Comments
@-- This comment will be stripped
@-- entirely from the output

I @--(don't)like the cake@--( is a lie)
```

### Template Inheritance

Template inheritance works very much like in Blade (as of Laravel 5.4). Since they made a great job of explaining how it works, the following section has been mostly copy-pasted from the Laravel docs.

**warning:** In Topside, you should avoid quoting the section name
    DO: @section(foobar)
    NOT: @section('foobar')

#### Defining A Layout

Two of the primary benefits of using ~~Blade~~ Topside are _template inheritance_ and _sections_. To get started, let's take a look at a simple example. First, we will examine a "master" page layout. Since most web applications maintain the same general layout across various pages, it's convenient to define this layout as a single ~~Blade~~ Topside view:

    <!-- Stored in templates/layouts/app.top.html -->

    <html>
        <head>
            <title>App Name - @yield(title)</title>
        </head>
        <body>
            @section(sidebar)
                This is the master sidebar.
            @show

            <div class="container">
                @yield(content)
            </div>
        </body>
    </html>

As you can see, this file contains typical HTML mark-up. However, take note of the `@section` and `@yield` directives. The `@section` directive, as the name implies, defines a section of content, while the `@yield` directive is used to display the contents of a given section.

Now that we have defined a layout for our application, let's define a child page that inherits the layout.

#### Extending A Layout

When defining a child view, use the Blade `@extends` directive to specify which layout the child view should "inherit". Views which extend a ~~Blade~~ Topside layout may inject content into the layout's sections using `@section` directives. Remember, as seen in the example above, the contents of these sections will be displayed in the layout using `@yield`:

    <!-- Stored in templates/child.top.html -->

    @extends './layouts/app.top'

    @section(title, 'Page Title')

    @section(sidebar)
        @parent

        <p>This is appended to the master sidebar.</p>
    @endsection

    @section(content)
        <p>This is my body content.</p>
    @endsection

In this example, the `sidebar` section is utilizing the `@parent` directive to append (rather than overwriting) content to the layout's sidebar. The `@parent` directive will be replaced by the content of the layout when the view is rendered.
