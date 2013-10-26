var testFileName = process.argv[2];

var Q = require('q');
var fs = require('fs');
var client = require('./apiClient')('http://localhost:5000/api/', 1);


client.createRelease()
    .then(function (body) {
        return loadTests()
            .then(function (testFile) {
                return runTests(body.release_name, body.release_number, testFile);
            });
    })
    .done(console.log);


function loadTests() {
    console.log("Loading " + testFileName);
    return Q.nfcall(fs.readFile, testFileName).then(function (fileData) {
        return JSON.parse(fileData);
    });
}

function runTests(releaseName, releaseNumber, testFile) {
    console.log("Enqueueing tests for " + releaseName + ":" + releaseNumber);
    var promises = [];
    var tests = testFile.tests;
    for (var i = 0; i < tests.length; i++) {
        var test = tests[i];
        var promise = client.requestRun(releaseName, releaseNumber, test.name, testFile.baseUrl + test.url, test.config);

        promises.push(promise);
    }

    return Q.all(promises);
}