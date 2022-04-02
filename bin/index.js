#!/usr/bin/env node

const yargs = require('yargs')
const chalk = require("chalk");
const boxen = require("boxen");
const fs = require('fs');
const chalkAnimation = require('chalk-animation');
const axios = require('axios').default;
const { loadSchemaYAPEXIL, ProgrammingExercise } = require('programming-exercise-juezlti');
var JSZip = require("jszip");
const path = require("path");
const { files } = require('jszip');

var out;
var promise = (new Promise((resolve, reject) => {


    yargs.command('$0', 'YAPEXIL generator', () => {
        // message("YAPEXIL CLI", "Welcome", "green", "black")
    }, async(argv) => {
        out = argv.out;
        if ("create" in argv) {
            let data = fs.readFileSync(argv.dir, { encoding: 'utf8', flag: 'r' });
            data = JSON.parse(data)
            await loadSchemaYAPEXIL();
            var exercise = new ProgrammingExercise(data)
            var arr = [],
                solutionsContents = [],
                testsContentsIn = [],
                testsContentsOut = [],
                statementsContent = []

            if (argv.base.indexOf("http://") != -1 || argv.base.indexOf("https://") != -1) {
                arr = await axios.all(exercise.solutions.map((value) => axios.get(`${argv.base}/${value.pathname}`)))

            } else exercise.solutions.map((value) =>
                arr.push(JSON.parse('{"data":' + fs.readFileSync(`${argv.base}/${value.pathname}`, { encoding: 'utf8', flag: 'r' }) + '}'))
                //  console.log('{"data":' + fs.readFileSync(`${argv.base}/${value.pathname}`, { encoding: 'utf8', flag: 'r' }) + '}')
            );
            for (let response of arr) {
                solutionsContents.push(response.data)
            }

            exercise.solutions_contents = []
            for (let data of solutionsContents) {
                exercise.solutions_contents[data.id] = data.content
            }



            if (argv.base.indexOf("http://") != -1 || argv.base.indexOf("https://") != -1) {
                arr = await axios.all(exercise.tests.map((value) => axios.get(`${argv.base}/${value.input}`)))

            } else
                exercise.tests.map((value) =>
                    arr.push(JSON.parse('{"data":' + fs.readFileSync(`${argv.base}/${value.input}`, { encoding: 'utf8', flag: 'r' }) + '}')));


            for (let response of arr) {
                testsContentsIn.push(response.data)
            }
            exercise.tests_contents_in = []
            for (let data of testsContentsIn) {
                exercise.tests_contents_in[data.id] = data.content
            }


            if (argv.base.indexOf("http://") != -1 || argv.base.indexOf("https://") != -1) {
                arr = await axios.all(exercise.tests.map((value) => axios.get(`${argv.base}/${value.output}`)))


            } else
                exercise.tests.map((value) =>
                    arr.push(JSON.parse('{"data":' + fs.readFileSync(`${argv.base}/${value.output}`, { encoding: 'utf8', flag: 'r' }) + '}')));

            for (let response of arr) {
                testsContentsOut.push(response.data)
            }
            exercise.tests_contents_out = []
            for (let data of testsContentsOut) {
                exercise.tests_contents_out[data.id] = data.content
            }


            if (argv.base.indexOf("http://") != -1 || argv.base.indexOf("https://") != -1) {
                arr = await axios.all(exercise.statements.map((value) => axios.get(`${argv.base}/${value.pathname}`)))

            } else
                exercise.statements.forEach((value) =>
                    arr.push(JSON.parse('{"data":' + fs.readFileSync(`${argv.base}/${value.pathname}`, { encoding: 'utf8', flag: 'r' }) + '}')));

            for (let response of arr) {
                statementsContent.push(response.data)
            }
            exercise.statements_contents = []
            for (let data of statementsContent) {
                exercise.statements_contents[data.id] = data.content
            }


            resolve(exercise);
        } else if ("validate" in argv) {
            await loadSchemaYAPEXIL();
            try {
                ProgrammingExercise.deserialize(argv.dir, argv.filename).then((programmingExercise) => {
                    if (!ProgrammingExercise.isValid(programmingExercise)) {

                        throw 'Invalid Exercise';
                    }
                    //console.log(programmingExercise.solutions)
                    fs.readFile(argv.dir, function(err, data) {
                        if (err) throw err;
                        JSZip.loadAsync(data).then(function(zip) {
                            const pSolutions = new Array();
                            const pStatments = new Array();
                            const pTests = new Array();
                            var solutionsArchiveCount = 0;
                            var statementArchiveCount = 0;
                            var testsArchiveCount = 0;

                            var warning = false;
                            var text = ""
                            let files = Object.keys(zip.files);
                            //console.log(files);
                            //  console.log(("verifying solutions folder"))

                            programmingExercise.solutions.forEach((solutions, index) => {
                                pSolutions.push(solutions.id)
                            })
                            programmingExercise.statements.forEach((statements, index) => {
                                pStatments.push(statements.id)
                            })
                            programmingExercise.tests.forEach((tests, index) => {
                                pTests.push(tests.id)

                            })
                            files.forEach((element, index) => {
                                if (element != "metadata.json") {
                                    if (element.indexOf("solutions/") == -1 && element.indexOf("statements/") == -1 && element.indexOf("tests/") == -1) {
                                        warning = true
                                        text += `There is files in the root folder that differ from solutions/  statements/  tests/`
                                    }

                                    if (element != "solutions/" && element.indexOf("solutions/") != -1) {
                                        if (!pSolutions.includes(getUUID(element))) {
                                            warning = true
                                            text += `There is solution with UUID ${element} declared in the meta file \n`
                                        }
                                        if (element.length > 47)
                                            solutionsArchiveCount++;
                                        //console.log(element)
                                    }
                                    if (element != "statements/" && element.indexOf("statements/") != -1) {
                                        if (!pStatments.includes(getUUID(element))) {
                                            warning = true
                                            text += `There is statements with UUID ${element} declared in the meta file \n`
                                        }
                                        if (element.length > 48)
                                            statementArchiveCount++
                                            // console.log(element)
                                    }
                                    if (element != "tests/" && element.indexOf("tests/") != -1) {
                                        if (!pTests.includes(getUUID(element))) {
                                            warning = true
                                            text += `There is tests with UUID ${element} declared in the meta file \n`
                                        }
                                        if (element.length > 43)

                                            testsArchiveCount++

                                    }
                                }



                            })

                            if (programmingExercise.solutions.length * 2 != solutionsArchiveCount) {
                                warning = true
                                text += `There is more files in solutions folder than declared\n`

                            }

                            if (programmingExercise.statements.length * 2 != statementArchiveCount) {
                                warning = true

                                text += `There is more statements in statements folder than declared \n`

                            }

                            if (programmingExercise.tests.length * 3 != testsArchiveCount) {
                                // console.log(testsArchiveCount)
                                //  console.log(programmingExercise.tests.length)
                                warning = true
                                text += `There are more tests in the tests folder than declared \n`

                            }

                            if (warning) {
                                if (!argv.silent)
                                    message("Warning!!!", text, "red", "black")
                                resolve(2);

                            } else {
                                if (!argv.silent)
                                    message("Success", "The tested YAPEXIL exercise is valid and does not have any extra files", "green", "black")
                                resolve(0);
                            }

                        });
                    });
                }).catch((err) => {
                    if (!argv.silent)
                        message("ERROR!!!", "The YAPEXIL exercise is invalid", "red", "black")
                    resolve(1);
                });
            } catch (err) {
                if (!argv.silent)
                    message("ERROR!!!", "The YAPEXIL exercise is invalid", "red", "black")
                resolve(1);
            }

        }



    }).middleware(argv => {

        return argv;
    }).parse()



}))

promise.then((result) => {
    if (!Number.isInteger(result)) {
        message("Success", "The YAPEXIL exercise was created", "yellow", "black")

        result.serialize(out == undefined ? "~" : out)
    } else {
        console.log(result)
    }
}).catch((err) => {
    message("ERROR!!!", err, "red", "black")

})


function message(title, msg, color, bg) {
    chalkAnimation.rainbow(title).start();

    const msgD = chalk.white.bold(msg);

    const boxenOptions = {
        padding: 1,
        margin: 1,
        borderStyle: "round",
        borderColor: color,
        backgroundColor: bg
    };
    const msgBox = boxen(msgD, boxenOptions);

    console.log(msgBox);
}

function getUUID(str) {
    const regex = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gm;

    // Alternative syntax using RegExp constructor
    // const regex = new RegExp('[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}', 'gm')

    let m;

    while ((m = regex.exec(str)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (m.index === regex.lastIndex) {
            regex.lastIndex++;
        }

        // The result can be accessed through the `m`-variable.
        //console.log(m[0]);
        return m[0];
    }

}