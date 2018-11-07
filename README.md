# Introduction

1. [ContentService.io](http://contentservice.io) adds CMS functionality to VueJS and Nuxt projects.

2. ContentService can be extended with custom _widgets_, allowing you to create reusable, application-specific widgets.

3. This project provides a template for creating **npm** packages of reusable custom widgets.

# What you get

When you use this template, you will get an npm package that can be used in VueJS and Nuxt projects:

- Example widget added to the toolbox on pages that use contentservice.io.

- Example Vuex store.

- Example code calling a remote service.

- Example code to read config files.

- Example Nuxt plugin.

- Build scripts.

- A local test harness.

- testing framework.



# Getting Started

Clone this project, and push it to your own repo, then play at will:

    git clone https://github.com/tooltwist/vue-whatever.git myProject
    cd myProject
    rm -rf .git; git init; git add .; git commit -m 'Cloned from vue-whatever'
    git remote add origin <your repos URL>
    git push --set-upstream origin master
    
Open the project in your edit and...

1. Update `package.json` with your project name
1. Globally substitute 'whatever' with your project name with the first character _in lower case_.
1. Globally substitute 'Whatever' with your project name with the first character _in upper case_.
1. git mv src/lib/Whatever.js src/lib/**Projectname**.js
1. git mv src/store/WhateverStore.js src/store/**Projectname**Store.js
1. git mv src/components/widgets/ContentWhatever.vue src/components/widgets/Content**Projectname**.vue
1. git mv src/components/widgets/ContentWhateverProps.vue src/components/widgets/Content**Projectname**Props.vue
1. Modify README.md to explain what this widget library does.

Commit to github, then publish at will:

    yarn install
    yarn build-bundle
    yarn patch-release

To create new widgets, you can copy and modify the example widget files in src/components/widgets:

- ContentWhatever.vue = the component displayed on the page
- ContentWhateverProps.vue = a component to edit the properties when in editing mode.

You can register your new widget using `$content.registerWidget` inside `src/components/index.js`.

[See the wiki](https://github.com/tooltwist/vue-whatever/wiki) for a full description of how to use this template.
