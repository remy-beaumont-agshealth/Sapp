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

function requestRun(releaseName, releaseNumber, url) {
    console.log("Trying to request " + releaseName + ":" + releaseNumber + ' (' + url + ')');

    var deferred = Q.defer();

    request.post(baseUrl + 'request_run', {
        form: {
            build_id: buildId,
            release_name: releaseName,
            release_number: releaseNumber,
            url: url,
            run_name: 'Rando-Dando!'
        }
    }, function (err, response, body) {
        console.log("Requested " + releaseName + ":" + releaseNumber + ' (' + url + '): ');
        deferred.resolve(body);
    });

    return deferred.promise;
}

createRelease().then(function (body) {
    return requestRun(body.release_name,
        body.release_number,
        '/Users/rel/Documents/Personal/dpxdt/dependencies/WTForms/docs/html/_static/comment-bright.png');
}).then(function(body){
        console.log(body);
    });
