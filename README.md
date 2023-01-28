<div align="center">

<img src="./public/icon.png" style="width:82px;"/>

# Calcium Calculator

[![Author](https://img.shields.io/badge/Author-NriotHrreion-red.svg "Author")](https://github.com/NriotHrreion)
[![LICENSE](https://img.shields.io/badge/license-MIT-green.svg "LICENSE")](./LICENSE)
[![Stars](https://img.shields.io/github/stars/nocpiun/calcium.svg?label=Stars)](https://github.com/nocpiun/calcium/stargazers)
[![Netlify Status](https://api.netlify.com/api/v1/badges/41b2bd01-9404-4d8b-99c4-7dea623f720a/deploy-status)](https://app.netlify.com/sites/courageous-bublanina-6857c1/deploys)

> A web-based calculator app

</div>

## Description

Calcium is a web-based calculator written in React + Typescript.

If you have any problem or idea, it's welcome to open an issue to let me know.

#### Why its name is Calcium?

```
Calculator -> calc -> Ca (Chemical Element) -> Calcium
```

## Deploy & Use

**It's recommended to use Calcium by [calc.nin.red](https://calc.nin.red). But if you want to deploy it locally, please continue reading the following content.**

First, you need to make sure that your server (or computer) has installed Nodejs.

1. Download and install

```bash
git clone https://github.com/nocpiun/calcium.git
cd calcium
npm i
```

2. Run the app

```bash
npm run start
```

3. Enter `http://localhost:3000`, and you can start using Calcium.

### To get update

Do the following commands, then do `npm run start`.

```bash
git fetch origin main:temp
git merge temp
npm i
```

## Contributing

Contributions to Ferrum Explorer are welcomed. You can fork this project and start your contributing. If you don't know how to do, please follow the instruction [Creating a Pull Request from a Fork](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/creating-a-pull-request-from-a-fork).

I'll check the Pull Request list in my spare time. I can't make sure that every Pull Request will be seen by me at once.

## Scripts

An explanation of the `package.json` scripts.

- **`start`** Launch the app
- **`build`** Create a production build
- **`test`** Run tests

## LICENSE

[MIT](./LICENSE)
