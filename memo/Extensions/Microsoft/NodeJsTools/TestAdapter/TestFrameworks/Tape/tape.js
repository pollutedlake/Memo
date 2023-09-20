//@ts-check
"use strict";
var EOL = require('os').EOL;
var fs = require('fs');
var path = require('path');

function find_tests(testFileList, discoverResultFile, projectFolder) {
    var test = findTape(projectFolder);
    if (test === null) {
        return;
    }

    var harness = test.getHarness({ exit: false });
    var tests = harness['_tests'];

    var count = 0;
    var testList = [];
    testFileList.split(';').forEach(function (testFile) {
        var testCases = loadTestCases(testFile);
        if (testCases === null) return; // continue to next testFile

        for (; count < tests.length; count++) {
            var t = tests[count];
            t._skip = true; // don't run tests
            testList.push({
                name: t.name,
                suite: '',
                filepath: testFile,
                line: 0,
                column: 0
            });
        }
    });

    var fd = fs.openSync(discoverResultFile, 'w');
    fs.writeSync(fd, JSON.stringify(testList));
    fs.closeSync(fd);
}
module.exports.find_tests = find_tests;

function run_tests(context) {

    var tape = findTape(context.testCases[0].projectFolder);
    if (tape === null) {
        return;
    }

    // Since the test events don't come in order we store all of them in this array
    // in the 'onFinish' event we loop through them and process anything remaining.
    var testState = [];
    var harness = tape.getHarness({ objectMode: true });

    harness.createStream({ objectMode: true }).on('data', function (evt) {
        var result;

        switch (evt.type) {
            case 'test':
                result = {
                    fullyQualifiedName: context.getFullyQualifiedName(evt.name),
                    passed: undefined,
                    stdout: '',
                    stderr: ''
                };

                testState[evt.id] = result;

                // Test is starting. Reset the result object. Send a "test start" event.
                context.post({
                    type: 'test start',
                    fullyQualifiedName: result.fullyQualifiedName
                });
                break;
            case 'assert':
                result = testState[evt.test];
                if (!result) { break; }

                // Correlate the success/failure asserts for this test. There may be multiple per test
                var msg = "Operator: " + evt.operator + ". Expected: " + evt.expected + ". Actual: " + evt.actual + ". evt: " + JSON.stringify(evt) + "\n";
                if (evt.ok) {
                    result.stdout += msg;
                    result.passed = result.passed === undefined ? true : result.passed;
                } else {
                    result.stderr += msg + (evt.error.stack || evt.error.message) + "\n";
                    result.passed = false;
                }
                break;
            case 'end':
                result = testState[evt.test];
                if (!result) { break; }
                // Test is done. Send a "result" event.
                context.post({
                    type: 'result',
                    fullyQualifiedName: result.fullyQualifiedName,
                    result
                });
                context.clearOutputs();
                testState[evt.test] = undefined;
                break;
            default:
                break;
        }
    });

    loadTestCases(context.testCases[0].testFile);

    // Skip those not selected to run. The rest will start running on the next tick.
    harness['_tests'].forEach(function (test) {
        if (!context.testCases.some(function (ti) { return ti.fullyQualifiedName === context.getFullyQualifiedName(test.name); })) {
            test._skip = true;
        }
    });

    harness.onFinish(function () {
        // TODO: Not used?
        // loop through items in testState
        for (var i = 0; i < testState.length; i++) {
            if (testState[i]) {
                var result = testState[i];
                if (!result.passed) { result.passed = false; }
                //callback({
                //    'type': 'result',
                //    'fullyQualifiedName': result.fullyQualifiedName,
                //    'result': result
                //});
            }
        }
        process.exit(0);
    });
}
module.exports.run_tests = run_tests;

function loadTestCases(testFile) {
    try {
        process.chdir(path.dirname(testFile));
        return require(testFile);
    } catch (e) {
        // we would like continue discover other files, so swallow, log and continue;
        logError("Test discovery error:", e, "in", testFile);
        return null;
    }
}

function findTape(projectFolder) {
    try {
        var tapePath = path.join(projectFolder, 'node_modules', 'tape');
        return require(tapePath);
    } catch (e) {
        logError(
            'Failed to find Tape package.  Tape must be installed in the project locally.' + EOL +
            'Install Tape locally using the npm manager via solution explorer' + EOL +
            'or with ".npm install tape --save-dev" via the Node.js interactive window.');
        return null;
    }
}

function logError() {
    var errorArgs = Array.prototype.slice.call(arguments);
    errorArgs.unshift("NTVS_ERROR:");
    console.error.apply(console, errorArgs);
}
