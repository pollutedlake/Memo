//@ts-check
var framework;
var readline = require('readline');
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.on('line', function (line) {
    rl.close();

    // strip the BOM in case of UTF-8
    if (line.charCodeAt(0) === 0xFEFF) {
        line = line.slice(1);
    }

    const context = createContext(line);

    // get rid of leftover quotations from C# (necessary?)
    for (var test in context.testCases) {
        for (var value in context.testCases[test]) {
            context.testCases[test][value] = context.testCases[test][value].replace(/["]+/g, '');
        }
    }

    try {
        framework = require('./' + context.testCases[0].framework + '/' + context.testCases[0].framework + '.js');
    } catch (exception) {
        console.log("NTVS_ERROR:Failed to load TestFramework (" + context.testCases[0].framework + "), " + exception);
        process.exit(1);
    }

    // run the test
    framework.run_tests(context);
});

function createContext(line) {
    function setFullTitle(testCases) {
        // FullyQualifiedName looks like `<filepath>::<suite><subSuite>::<testName>`.
        // <suite> will be `global` for all tests on the "global" scope.
        // The result would be something like `<suite> <subSuite> <testName>`. Removes `global` as well.
        const cleanRegex = /.*?::(global::)?/;

        for (let testCase of testCases) {
            testCase.fullTitle = testCase.fullyQualifiedName.replace(cleanRegex, "").replace("::", " ");
        }
    }

    function getFullyQualifiedName(testCases, fullTitle) {
        // TODO: Don't do linear search, instead use a property or cache the fullTitle, fullyQualifiedName.
        for (let testCase of testCases) {
            if (testCase.fullTitle === fullTitle) {
                return testCase.fullyQualifiedName;
            }
        }
    }

    function post(event) {
        if (event) {
            if (event.result) {
                // Some test frameworks report the result on the stdout/stderr so the event will be empty. Set only stdout and stderr if that's the case.
                event.result.stdout = event.result.stdout || newOutputs.stdout;
                event.result.stderr = event.result.stderr || newOutputs.stderr;
            }

            // We need to unhook the outputs as we want to post the event to the test explorer.
            // Then hook again to continue capturing the stdout
            unhookOutputs();
            console.log(JSON.stringify(event));
            hookOutputs();
        }
    }

    function clearOutputs() {
        newOutputs = {
            stdout: '',
            stderr: ''
        };
    }

    let testCases = JSON.parse(line);
    setFullTitle(testCases);

    return {
        testCases: testCases,
        getFullyQualifiedName: (fullTitle) => getFullyQualifiedName(testCases, fullTitle),
        post,
        clearOutputs
    };
}

function hookOutputs() {
    oldOutputs = {
        stdout: process.stdout.write,
        stderr: process.stderr.write
    };

    process.stdout.write = (str, encording, callback) => {
        newOutputs.stdout += str;
        return true;
    };
    process.stderr.write = (str, encording, callback) => {
        newOutputs.stderr += str;
        return true;
    };
}

function unhookOutputs() {
    process.stdout.write = oldOutputs.stdout;
    process.stderr.write = oldOutputs.stderr;
}

let oldOutputs = {};
let newOutputs = {
    stdout: '',
    stderr: ''
};

hookOutputs();