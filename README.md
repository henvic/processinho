# processinho

## Search engine
Save search: save the search parameters.

## Running the server
You can run the server by invoking `node .` on the project's root directory.

Use [nodemon](http://nodemon.io/) to automatically restart your server on changes.

## Gulp tasks
Currently there are two groups of gulp tasks.

The main is defined by the gulpfile.js on the root directory.

`gulp help` lists the available commands.

The front-end tasks are defined by the gulpfile.js on the web directory and they expose [gulp-metal](https://www.npmjs.com/package/gulp-metal) tasks.

These different sets of tasks should be merged. The front-end tasks should use the `metal:` namespace and be documented with the default help command as well. The merge is currently a work-in-progress.

While the merge doesn't happen, you can execute any `metal:` task by calling it on the web directory without the `metal:` prefix.
