var request = require('request');
var Q = require('q');

var baseUrl = 'http://localhost:5000/api/';
var buildId = 1;

function createRelease() {
    var createDeferred = Q.defer();

    request.post(baseUrl + 'create_release', {
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

    request.post(baseUrl + 'request_run', {
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

var tests = require('./tests');

createRelease()
    .then(function (body) {
        var promises = [];
        for (var i = 0; i < tests.length; i++) {
            var test = tests[i];
            var promise = requestRun(body.release_name, body.release_number, test.name, test.url);

            promises.push(promise);
        }

        return Q.all(promises);
    })
    .then(function (results) {
        console.log(results);
    });