#!/usr/bin/env node
var program = require('commander');

program
    .version('0.0.0')
    .option('-d, --dpxdt-url <url>', 'Base url for the dpxdt server. Defaults to http://localhost:5000', 'http://localhost:5000')
    .option('-r, --release-name <name>', 'Name of the release for which you want to queue all of your tests', (new Date()).toJSON())
    .option('-b, --build-number <number>', 'Build number for the dpxdt server.  Defaults to 1.', 1);

program
    .command('* <testFileName>')
    .description('start a new release')
    .action(function (testFileName) {
        var commands = getCommands();
        commands.runTestsOnNewRelease(testFileName);
    });

program.parse(process.argv);


function getCommands() {
    var commands = require('./commands')(program.dpxdtUrl, program.buildNumber, program.releaseName);
    return commands;
}