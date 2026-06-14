// Karma configuration for Angular unit tests.
const fs = require('fs');
const path = require('path');

const localBraveBin = '/Applications/Brave Browser.app/Contents/MacOS/Brave Browser';

if (!process.env.CHROME_BIN && fs.existsSync(localBraveBin)) {
    process.env.CHROME_BIN = localBraveBin;
}

module.exports = function (config) {
    config.set({
        basePath: '',
        frameworks: ['jasmine', '@angular-devkit/build-angular'],
        plugins: [
            require('karma-jasmine'),
            require('karma-chrome-launcher'),
            require('karma-jasmine-html-reporter'),
            require('karma-coverage'),
            require('@angular-devkit/build-angular/plugins/karma'),
        ],
        client: {
            clearContext: false,
        },
        jasmineHtmlReporter: {
            suppressAll: true,
        },
        coverageReporter: {
            dir: path.join(__dirname, './coverage/frontend'),
            subdir: '.',
            reporters: [{ type: 'html' }, { type: 'text-summary' }],
        },
        reporters: ['progress', 'kjhtml'],
        browsers: ['ChromeHeadless'],
        restartOnFileChange: true,
        singleRun: false,
    });
};
