[![Express Logo](https://i.cloudup.com/zfY6lL7eFa-3000x3000.png)](http://expressjs.com/)

[Express'](https://www.npmjs.com/package/express) application template with examples included.

# express-template-ts with example and test included

This is a template for node with express + typescript that includes the following stack:

- Winston for logs
- Jest and supertest for unit test and integration tests (with examples included)
- Eslint as linter
- Prettier as formatter
- Zod for validating params and body data
- Husky for validating what we are committing

And the best of all it is configured and ready to use with simple examples, ideal for starting to understand how all the ecosystem mentioned before works together. Ideal for beginner and get involved in the https verbs.

## Problem statement

Problem that I want to solve is to have a ready to use template to start a new project in node with express + typescript to create REST APIs friendly for beginner.

## Installation

The below command install this package at global level so you can create your template everywhere.

```sh
$ npm install -g express-template-typescript
```

The below command creates the template with the name defined.

```sh
$ express-template-typescript myprojectName
```

---

You can also run with the `npx` command (available since Node.js 8.2.0).

```sh
$ npx express-template-typescript myprojectName
```

## Quick Start

initialize as a git repository:

```bash
$ git init
```

Change npmignore to gitignore.

Install dependencies:

```bash
$ npm install
```

Start your Express.js app at `http://localhost:3000/`:

You can rename the env-example.txt to .env and use it.

```bash
$ npm run dev
```

Now you can use it and play with what was built.

- you can play with the routes, controllers and services
- you can check the unit tests and integration tests
- you can start from there to build you REST API

### But we have some more script to check

As we are working in typescript (ts for friends), we can create the build with below command but what is build, simple explanation "javascript (js) is what the node and browser understand, typescript doesn't, so you need to transpile "transform" your ts to js so they can understand it:

```bash
$ npm run build
```

With the below command you can execute your builded "js" code created in "dist" folder.

```bash
$ npm start
```

Also you can execute the test created and check the coverage level. Please read more about it in jest and supertest documentation or check some youtube videos.

```bash
$ npm run test
```

You can execute the linter with the below command, it will be one of your best friend.

```bash
$ npm run linter
```

About husky, check the documentation, it's pretty helpful for a coworking environment.

## Command Line Options

This template generator has the following options.

        --version        output the version number

## License

[MIT](LICENSE)

## Author

Víctor José López

- Github: [@vjlkof](https://github.com/vjlkof)

## Show your support

Give a ⭐️ if this project helped you!.
