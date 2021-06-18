tree-sitter-d
=============

This repository hosts a [tree-sitter](https://tree-sitter.github.io/) grammar for the [D programming language](https://dlang.org/).

About
-----

The process of generating the grammar consists of a number of steps. The following lists the full process that the grammar goes through.

1. The origin of the grammar described here is [the official specification of the D programming language](https://dlang.org/spec/spec.html).

   Though it can be perused online, we use the source code, which is written in [DDoc](https://dlang.org/spec/ddoc.html) (the D documentation macro processor)
   and is maintained in the [dlang/dlang.org GitHub repository](https://github.com/dlang/dlang.org/tree/master/spec).

   The `generated/dlang.org` submodule points to the copy that is used by this repository, which may contain some fixes
   (whether to make it more machine-readable or to more accurately describe the language) which have not been upstreamed yet.

2. The grammar is then consumed by a custom program which attempts to automatically convert it as much as feasible into a tree-sitter grammar.
   This program and its output are located in [the `generated` branch](https://github.com/CyberShadow/tree-sitter-d/tree/generated).

   The first step of processing the grammar is to parse it.
   Thus, the grammar specification above is parsed into a DOM representing the document structure, with one node per DDoc macro.

   Though the canonical way to consume DDoc documents is to specify a file with custom macro definitions and to run DMD's DDoc macro processor using it,
   the approach used here was to implement a [simple DDoc parser](https://github.com/CyberShadow/tree-sitter-d/blob/master/generator/source/ddoc.d) instead
   (which also helped validate our assumptions about DDoc syntax).

3. The DDoc DOM is then converted to the initial grammar definition, which roughly corresponds to tree-sitter grammar structure.
   The conversion is done in the [parser](https://github.com/CyberShadow/tree-sitter-d/blob/master/generator/source/parser.d) module.

4. After conversion, the grammar passes through a few preprocessing steps.
   These mold the grammar into a shape which is more useful to be used for typical tree-sitter applications.

   Two main preprocessing steps are:

   - De-recursion, which converts definitions for lists of things from a recursive definition to one using explicit repetition.  
     (Example: [`ImportList`](https://dlang.org/spec/module.html#ImportList))

   - Body extraction, which splits some definitions into two, in which one is the definition "body" containing the operation actually described by the definition's name,
     and the other is a hidden rule which resolves either to the body or to the next operation with higher precedence.  
     (Example: [`OrOrExpression`](https://dlang.org/spec/expression.html#OrOrExpression))

   The grammar is then optimized to reduce redundancies manifested during preprocessing.

5. The grammar is now ready to be saved to `grammar.js`, the tree-sitter definition of the grammar.

   The latest version of this generated file can be found [in the root of the `generated` branch](https://github.com/CyberShadow/tree-sitter-d/blob/generated/grammar.js).

6. The generated file is not quite ready to be used, and requires some manual fixups.

   For this purpose, the `master` branch holds these fixes on top of the `generated` branch (which is merged into `master` regularly).

   You can see all manual fixes by [comparing the two branches](https://github.com/CyberShadow/tree-sitter-d/compare/generated..master#diff-919ac210accac9ecc55a76d10a7590e3d85ca3f0e165b52d30f08faee486d0cb).

   The `master` branch also hosts the test suite, as well as the [custom scanner](https://github.com/CyberShadow/tree-sitter-d/blob/master/src/scanner.cc),
   which implements D-specific syntax which cannot be described using the declarative tree-sitter grammar, such as nested comments or delimited string literals.

7. From this point, `grammar.js` is ready to be passed on to tree-sitter's build process, so the steps below simply describe how any tree-sitter grammar is compiled.

   `tree-sitter-cli` is used to generate the parser C source code from `grammar.js`. If installed via `npm` (i.e. `npm install`), this can be done by running:

   ```
   ./node_modules/.bin/tree-sitter generate
   ```

   This will populate the `src` directory, as well as create [additional build files](https://github.com/cybershadow/tree-sitter-d/blob/master/.gitignore#L4-L9).

8. Finally, the C source code is compiled into a loadable shared library, which can be directly used by a tree-sitter-enabled application.

   This step happens automatically when running `tree-sitter test`.
   Alternatively, invoking `tree-sitter build-wasm` builds a WebAssembly module instead of a native shared object.

Contributing
------------

If you would like to help, please have a look at the [list of open issues](https://github.com/CyberShadow/tree-sitter-d/issues).

If you spot an error in the grammar or the way it behaves and would like to fix it, the first step would be to identify the correct place to perform the fix.

- If the problem is due to an incorrect grammar definition, and the error is also present in [the official specification](https://dlang.org/spec/spec.html),
  then please fix and send a pull request there.

- Otherwise, if you believe that the problem is due to a translation error between the official grammar and the generated `grammar.js` file,
  then it may be due to a bug in [the generator program](https://github.com/CyberShadow/tree-sitter-d/tree/generated/generator).

- Finally, if the problem is tree-sitter specific or cannot be fixed through the above avenues,
  then the fix should be applied to [`grammar.js` on the master branch](https://github.com/CyberShadow/tree-sitter-d/blob/master/grammar.js).

If you are having trouble with anything, please don't hesitate to [open an issue](https://github.com/CyberShadow/tree-sitter-d/issues/new).
