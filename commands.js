module.exports = function(dpxdtUrl, buildNumber, releaseName) {

    var Q = require('q');
    var fs = require('fs');
    var client = require('./apiClient')(dpxdtUrl + '/api/', buildNumber, releaseName);


    function runTestsOnNewRelease(path) {
        client.createRelease()
            .then(function (body) {
                return loadTests(path)
                    .then(function (testFile) {
                        return runTests(body.release_name, body.release_number, testFile);
                    });
            })
            .done(console.log);
    }


    function loadTests(path) {
        var walk = require('walk');
        var testFile = {
            baseUrl: 'http://localhost:3000/', //todo: load from command line or config file or set on dpxdt server
            tests: []
        };
        var testPattern = /\.dpxdtTest.js$/;
        
        var walker = walk.walk(path);
        
        var promises = [];
        var scanFinishedDeferred = Q.defer();
        
        promises.push(scanFinishedDeferred.promise);
        
        walker.on('file', function(root, stat, next){
            
            if (testPattern.exec(stat.name)) {
                promises.push(Q(loadTest(root + '/' + stat.name)).then(function(test){
                    testFile.tests.push(test);
                }));
            }
            
            next();
        });
        
        walker.on('end', function(){
            scanFinishedDeferred.resolve();
        });
        
        
        return Q.all(promises).then(function(){
            return testFile;
        });
    }
    
    function loadTest(fileName) {
        var testFile = require(fileName); //synchronous :(
        return processTest(testFile);
    }
    
    function processTest(file) {
        var test = {
            name: file.name,
            url: file.url,
            config: file.config
        };
        
        if (typeof file.test === 'function') {
            test.config.injectJs = '(' + file.test.toString() + '());';
        }
        
        return test;
    }

    function runTests(releaseName, releaseNumber, testFile) {
        
        var promises = [];
        var tests = testFile.tests;
        for (var i = 0; i < tests.length; i++) {
            var test = tests[i];
            var promise = client.requestRun(releaseName, releaseNumber, test.name, testFile.baseUrl + test.url, test.config);

            promises.push(promise);
        }

        return Q.all(promises);
    }

    return {
        runTestsOnNewRelease: runTestsOnNewRelease
    };
}
