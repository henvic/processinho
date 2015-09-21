var metal = require('gulp-metal');

metal.registerTasks({
    bundleCssFileName: 'processinho.css',
    bundleFileName: 'processinho.js',
    globalName: 'metal',
    mainBuildJsTasks: ['build:globals'],
    moduleName: 'metal-processinho'
});
