#!/usr/bin/env node
var program = require('commander');

program
    .version('0.0.0')
    .option('-t, --test-file <path>', 'JSON file describing all of your tests')
    .option('-d, --dpxdt-url <url>', 'Base url for the dpxdt server. Defaults to http://localhost:5000')
    .option('-r, --release-name <name>', 'Name of the release for which you want to queue all of your tests')
    .option('-b, --build-number <number>', 'Build number for the dpxdt server.  Defaults to 1.');

program
    .command('new <testFileName>')
    .description('start a new release')
    .action(function (testFileName) {
        var commands = getCommands();
        commands.runTestsOnNewRelease(testFileName);
    });

program
    .command('rerun <testFileName>')
    .description('Run the specified tests on the most recent release')
    .action(function (testFileName) {
        console.log("Rerunning");
    });

program.parse(process.argv);


function getCommands() {

    var dpxdtUrl = !!program.dpxdtUrl ? program.dpxdtUrl : 'http://localhost:5000';
    var releaseName = !!program.releaseName ? program.releaseName : (new Date()).toJSON();
    var buildNumber = !!program.buildNumber ? program.buildNumber : 1;

    if (!dpxdtUrl || !releaseName || !buildNumber) {
        program.help(); //exits immediately
    }

    var commands = require('./commands')(dpxdtUrl, buildNumber, releaseName);
    return commands;
}