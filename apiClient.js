var Q = require('q');
var request = require('request');

module.exports = createApiClientForRelease;

function createApiClientForRelease(baseUrl, buildId) {
    return {
        createRelease: createRelease,
        requestRun: requestRun,
        markRunsDone: markRunsDone
    };

    function createRelease() {
        return makeCall('create_release',
            {
                build_id: buildId,
                release_name: (new Date()).toJSON()
            });
    }

    function requestRun(releaseName, releaseNumber, testName, url, config) {
        return makeCall('request_run',
            {
                build_id: buildId,
                release_name: releaseName,
                release_number: releaseNumber,
                run_name: testName,
                config: JSON.stringify(config), //The receiving API doesn't know how to accept a multi-key value
                url: url
            }
        );
    }

    function markRunsDone(buildId, releaseName, releaseNumber) {
        return makeCall('runs_done',
            {
                build_id: buildId,
                release_name: releaseName,
                release_number: releaseNumber
            }
        );
    }

    function makeCall(functionName, form) {
        var deferred = Q.defer();

        request.post(baseUrl + functionName, {
            form: form
        }, function (error, response, body) {
            if (error) {
                throw 'Error calling ' + functionName + ': ' + error;
            } else {
                var body = JSON.parse(body);
                if (body.error) {
                    throw 'Error calling ' + functionName + ': ' + error;
                }

                deferred.resolve(body);
            }
        });

        return deferred.promise;
    }
}

