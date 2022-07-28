#!/usr/bin/env node

const yargs = require('yargs')
const chalk = require("chalk");
const boxen = require("boxen");
const crypto = require('crypto');
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
        message("YAPEXIL CLI", "Welcome", "green", "black")
    }, async(argv) => {
        out = argv.out;
        await loadSchemaYAPEXIL();

        try {

            if ("modify" in argv) {
                if ("exercise" in argv) {
                    var exercise = await ProgrammingExercise.deserialize(path.join(__dirname, "../exercises/"), argv.exercise)

                    if ("solution_remove" in argv) {
                        if ("solution_id" in argv) {
                            let new_solutions = []
                            let new_solutions_content = {}

                            exercise.solutions.forEach((element, index) => {
                                if (element.id != argv.solution_id) {
                                    new_solutions.push(element)
                                    new_solutions_content[element.id] = exercise.solutions_contents[element.id]
                                }

                            })
                            exercise.solutions = new_solutions
                            exercise.solutions_contents = new_solutions_content

                        } else {
                            throw new Error("Please, supply a solution id to be removed ");

                        }

                    }


                    if ("statement_remove" in argv) {
                        if ("statement_id" in argv) {
                            let new_statements = []
                            let new_statements_content = {}

                            exercise.statements.forEach((element, index) => {
                                if (element.id != argv.statement_id) {
                                    new_statements.push(element)
                                    new_statements_content[element.id] = exercise.statements_contents[element.id]
                                }

                            })
                            exercise.statements = new_statements
                            exercise.statements_contents = new_statements_content

                        } else {
                            throw new Error("Please, supply a statement id to be removed ");

                        }

                    }

                    if ("test_remove" in argv) {
                        if ("test_id" in argv) {
                            let new_tests = []
                            let new_tests_contents_in = {}
                            let new_tests_contents_out = {}

                            exercise.tests.forEach((element, index) => {
                                if (element.id != argv.test_id) {
                                    new_tests.push(element)
                                    new_tests_contents_in[element.id] = exercise.tests_contents_in[element.id]
                                    new_tests_contents_out[element.id] = exercise.tests_contents_out[element.id]

                                }

                            })
                            exercise.tests = new_tests
                            exercise.tests_contents_in = new_tests_contents_in
                            exercise.tests_contents_out = new_tests_contents_out


                        } else {
                            throw new Error("Please, supply a test id to be removed ");

                        }

                    }



                    if ("solution_addition" in argv) {
                        if ("solution_lang" in argv) {
                            if ("solution_content" in argv) {
                                let id = crypto.randomUUID()
                                exercise.solutions.push({
                                    id: id,
                                    pathname: `solution.${argv.solution_lang}`,
                                    lang: argv.solution_lang,
                                })
                                let content = fs.readFileSync(argv.solution_content, { encoding: 'utf8', flag: 'r' });
                                exercise.solutions_contents[id] = content
                            } else {
                                throw new Error("Please, supply a solution content ");

                            }

                        } else {
                            throw new Error("Please, supply a solution lang ");

                        }
                    }

                    if ("statement_addition" in argv) {
                        if ("statement_format" in argv) {
                            if ("statement_nat_lang" in argv) {
                                if ("statement_content" in argv) {

                                    let id = crypto.randomUUID()
                                    exercise.statements.push({
                                        id: id,
                                        pathname: `statment.${argv.statement_format}`,
                                        nat_lang: argv.statement_nat_lang,
                                        format: argv.statement_format,

                                    })
                                    let content = fs.readFileSync(argv.statement_content, { encoding: 'utf8', flag: 'r' });
                                    exercise.statements_contents[id] = content
                                } else {
                                    throw new Error("Please, supply a  statement content ");

                                }
                            } else {
                                throw new Error("Please, supply a  statement natural language ");

                            }

                        } else {
                            throw new Error("Please, supply a  statement format ");

                        }
                    }



                    if ("test_addition" in argv) {
                        if ("test_visible" in argv) {
                            if ("test_input_content" in argv) {
                                if ("test_output_content" in argv) {

                                    let id = crypto.randomUUID()
                                    exercise.tests.push({
                                        id: id,
                                        arguments: [],
                                        weight: 1,
                                        visible: eval(argv.test_visible),
                                        input: 'input.txt',
                                        output: 'output.txt'

                                    })
                                    let content_in = fs.readFileSync(argv.test_input_content, { encoding: 'utf8', flag: 'r' });
                                    let content_out = fs.readFileSync(argv.test_output_content, { encoding: 'utf8', flag: 'r' });
                                    exercise.tests_contents_in[id] = content_in
                                    exercise.tests_contents_out[id] = content_out

                                } else {
                                    throw new Error("Please, supply a  test output content  ");

                                }
                            } else {
                                throw new Error("Please, supply a  test input content");

                            }

                        } else {
                            throw new Error("Please, supply a  test visible (true/false) ");

                        }
                    }
                    fs.unlinkSync(path.join(__dirname, "../exercises/", argv.exercise))
                    console.log(exercise)
                    exercise.serialize(path.join(__dirname, "../", "exercises"))



                } else {
                    throw new Error("Please, supply an exercise ");

                }

            }
        } catch (msg) {
            message("ERROR", msg, "red", "yellow")


        }


        if ("create" in argv) {
            var exercise = new ProgrammingExercise(undefined, true)
            exercise.id = crypto.randomUUID()
            if ("title" in argv) {
                exercise.title = argv.title;

            }
            if ("keywords" in argv) {
                exercise.keywords = argv.keywords.split("-");

            }
            if ("type" in argv) {
                exercise.type = argv.type;

            }
            if ("author" in argv) {
                exercise.author = argv.author;

            }
            if ("status" in argv) {
                exercise.status = argv.status;

            }
            console.log(exercise)
            exercise.serialize(path.join(__dirname, "../", "exercises"))

        }

        if ("packaging" in argv) {
            let data = fs.readFileSync(argv.dir, { encoding: 'utf8', flag: 'r' });
            data = JSON.parse(data)
            var exercise = new ProgrammingExercise(data)
            var arr = [],
                solutionsContents = [],
                testsContentsIn = [],
                testsContentsOut = [],
                statementsContent = []

            if (argv.base.indexOf("http://") != -1 || argv.base.indexOf("https://") != -1) {
                arr = await axios.all(exercise.solutions.map((value) => axios.get(`${argv.base}/${value.pathname}`)))

            } else {
                //**-------------------------------------------------------------------------------------------------------**//
                exercise.solutions.map((value) =>
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
                arr = [];
                //**-------------------------------------------------------------------------------------------------------**//
                exercise.tests.map((value) =>
                    arr.push(JSON.parse('{"data":' + fs.readFileSync(`${argv.base}/${value.input}`, { encoding: 'utf8', flag: 'r' }) + '}')));
                for (let response of arr) {
                    testsContentsIn.push(response.data)
                }
                exercise.tests_contents_in = []
                for (let data of testsContentsIn) {
                    exercise.tests_contents_in[data.id] = data.content
                }
                arr = [];
                //**-------------------------------------------------------------------------------------------------------**//
                exercise.tests.map((value) =>
                    arr.push(JSON.parse('{"data":' + fs.readFileSync(`${argv.base}/${value.output}`, { encoding: 'utf8', flag: 'r' }) + '}')));

                for (let response of arr) {
                    testsContentsOut.push(response.data)
                }
                exercise.tests_contents_out = []
                for (let data of testsContentsOut) {
                    exercise.tests_contents_out[data.id] = data.content
                }
                arr = [];
                //**-------------------------------------------------------------------------------------------------------**//

                exercise.statements.forEach((value) =>
                    arr.push(JSON.parse('{"data":' + fs.readFileSync(`${argv.base}/${value.pathname}`, { encoding: 'utf8', flag: 'r' }) + '}')));

                for (let response of arr) {
                    statementsContent.push(response.data)
                }
                exercise.statements_contents = []
                for (let data of statementsContent) {
                    exercise.statements_contents[data.id] = data.content
                }
                arr = [];
                //**-------------------------------------------------------------------------------------------------------**//


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
                    fs.readFile(path.join(argv.dir, argv.filename), function(err, data) {
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


                            if (!argv.silent)
                                message("Success", "This excercise is a valid YAPEXIL exercise", "green", "black")
                            resolve(0);


                        });
                    });
                }).catch((err) => {
                    console.log(err)
                    if (!argv.silent)
                        message("ERROR!!!", "The YAPEXIL exercise is invalid", "red", "black")
                    resolve(1);
                });
            } catch (err) {
                console.log(err)
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