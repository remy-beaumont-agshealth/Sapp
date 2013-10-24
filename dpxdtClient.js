var testFileName = process.argv[2];

var request = require('request');
var Q = require('q');
var fs = require('fs');

var baseUrlForDpxdtServer = 'http://localhost:5000/api/';
var buildId = 1;

function createRelease() {
    var createDeferred = Q.defer();

    request.post(baseUrlForDpxdtServer + 'create_release', {
        form: {
            build_id: buildId,
            release_name: (new Date()).toJSON()
        }
    }, function (error, response, body) {
        createDeferred.resolve(JSON.parse(body));
    });

    return createDeferred.promise;
}

function requestRun(releaseName, releaseNumber, testName, url) {
    console.log("Trying to request " + releaseName + ":" + releaseNumber + ' (' + url + ')');

    var deferred = Q.defer();

    request.post(baseUrlForDpxdtServer + 'request_run', {
        form: {
            build_id: buildId,
            release_name: releaseName,
            release_number: releaseNumber,
            run_name: testName,
            url: url
        }
    }, function (err, response, body) {
        console.log("Requested " + releaseName + ":" + releaseNumber + ' (' + url + '): ');
        deferred.resolve(body);
    });

    return deferred.promise;
}

function loadTests() {
    console.log("Loading " + testFileName);
    return Q.nfcall(fs.readFile, testFileName).then(function (fileData) {
        return JSON.parse(fileData);
    });
}

function runTests(releaseName, releaseNumber, testFile) {
    var promises = [];
    var tests = testFile.tests;
    for (var i = 0; i < tests.length; i++) {
        var test = tests[i];
        var promise = requestRun(releaseName, releaseNumber, test.name, testFile.baseUrl + test.url);

        promises.push(promise);
    }

    return Q.all(promises);
}


createRelease()
    .then(function (body) {
        return loadTests().then(function (testFile) {
            return runTests(body.release_name, body.release_number, testFile);
        });
    })
    .then(console.log);