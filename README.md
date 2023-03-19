# 1. Prerequisites
## 1.0 Project Structure
### 1.0.1 Project layout
```bash
├── app-routing.module.ts
├── app.component.html
├── app.component.scss
├── app.component.spec.ts
├── app.component.ts
├── app.module.ts
├── constants
├── core
├── features
├── helpers
├── material
├── components
├── shared
└── types
```

###  **Core Module**
Core module is dedicated to singleton providers
These services contain business logic used by other core services or app’s features.
###  **Features Module**
Contain different feature modules
###  Helpers
Contain Classes which adds functionality, but too big to be inserted
###  Pages
Contain Pages for routing
###  **Shared Module**
It is place to store all the reusable  components, directives, pipes, helpers and types


## 1.1 Configure Git

```bash
# Perform the next commands in the terminal/cmd
git config --global user.name "Name Surname"
git config --global user.email name_surname@epam.com
 
# Also for Windows based OSes it's important to set the next config:
git config --global core.autocrlf true
# For Linux or MacOS set the next config:
git config --global core.autocrlf input
 
# For convenience it's also useful to set this config
git config --global push.default current
 
# For Windows OSes it's useful to set Notepad as default editor
# as Vim and Nano has issues on Windows
git config --global core.editor notepad
```

**P.S.** Usually such Git configuration is common for most projects but If you have some other projects not connected to EPAM or with another configuration you may set all these settings with flag `--local` instead of `--global` to avoid configuration conflicts with other projects. In this case it's necessary to clone the repository first and navigate to it.

## 1.2 Generate SSH key and put its public part into GitLab

```bash
# Run the command and follow the instructions:
ssh-keygen
...
...
...
# Copy public key (id_rsa.pub) into GitLab -> Settings -> SSH Keys
cat ~/.ssh/id_rsa.pub
```


## 1.3 Install NVM

For Unix systems execute:

```bash
# Download NVM installation script:
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.34.0/install.sh | bash
 
# Reload terminal:
source ~/.bashrc
nvm --version
```
For Windows systems follow the instructions provided in [NVM for Windows](https://github.com/coreybutler/nvm-windows)

## 1.4 Install Angular-CLI

```
npm install -g @angular/cli
```
To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

# 2. Install the Client application
## 2.1 Install the app

- Install NodeJS using NVM

```bash
nvm install v16.13.0
nvm use 16.13.0
```

- Clone repository and install the dependencies

```bash
# Create some project folder and navigate into it:
mkdir epam
cd epam
 
# Clone Client repository:
git clone git@git.epam.com:epm-lstr/<YOUR_REPO>.git
 
# Switch to "develop" branch and install all the dependencies:
git checkout develop
npm install
```

In case of failure with `node-gyp` installation (that means Python or Visual C++ build tools are not installed in the system) open PowerShell as administrator and do the following:

```bash
npm install --global --production windows-build-tools
npm install --global node-gyp
```

In some cases it can be necessary to set `PYTHON` environment variable manually.
    
**P.S.** In case of some issues with `node-gyp` installation follow the [official instructions](https://github.com/nodejs/node-gyp#on-windows).

## 2.2 Run the app
```
npm start
// or
ng serve

```

# 3. The list of available commands

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 13.1.3. So, you can use the next commands:

## 3.1 Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## 3.2 Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## 3.3 Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## 3.4 Running unit tests

Run `npm run test` or `npm run test:ci` to execute the unit tests via [Karma](https://karma-runner.github.io).

## 3.5 Lint project

Run `npm run lint` to execute project linters (stylelint, eslint, prettier) and generate a report. Doesn't perform autofixing. This script is used on CI as a quality gate.
