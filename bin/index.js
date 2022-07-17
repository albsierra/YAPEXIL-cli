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
const { create } = require('domain');
const uuid = require('uuid');
var XLSX = require("yxw-xlsx");

var out;
var promise = (new Promise((resolve, reject) => {


    yargs.command('$0', 'YAPEXIL generator', () => {
        message("YAPEXIL CLI", "Welcome", "green", "black")
    }, async(argv) => {
        await loadSchemaYAPEXIL();
        out = argv.out;
        if ("create" in argv) {
            const exercise = await createFromMetadata(argv)
            resolve(exercise);
        } else if ("validate" in argv) {
            const result = await validateSerializedExercise(argv)
            if(result) resolve(result);
        } else if ("import" in argv) {
            if (from = argv.from) {
                let metadatas = getMetadatas(argv)
                let exercisesP = []
                metadatas.forEach((metadata) => {
                    let argvCreate = {
                        _: [],
                        create: true,
                        dir: path.join(argv.out, metadata.id, 'metadata.json'),
                        out: argv.out,
                        base: path.join(argv.out, metadata.id),
                        '$0': 'YAPEXIL'
                      }
                    exercisesP.push(createFromMetadata(argvCreate))
                })
                Promise.all(exercisesP).then(exercises => {
                    if(exercises.length > 0)
                        resolve(exercises.length)
                })
            }
        }

    }).middleware(argv => {

        return argv;
    }).parse()

}))

promise.then((result) => {
    if (!Number.isInteger(result)) {
        message("Success", "The YAPEXIL exercise was created", "yellow", "black")
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

async function createFromMetadata(argv) {
    let data = fs.readFileSync(argv.dir, { encoding: 'utf8', flag: 'r' });
    data = JSON.parse(data)
    var exercise = new ProgrammingExercise(data)
    var arr = [],
        solutionsContents = [],
        testsContentsIn = [],
        testsContentsOut = [],
        statementsContent = [],
        librariesContent = []

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

        exercise.libraries.forEach((value) =>
            arr.push(JSON.parse('{"data":' + fs.readFileSync(`${argv.base}/${value.pathname}`, { encoding: 'utf8', flag: 'r' }) + '}')));

        for (let response of arr) {
            librariesContent.push(response.data)
        }
        exercise.libraries_contents = []
        for (let data of librariesContent) {
            exercise.libraries_contents[data.id] = data.content
        }
        arr = [];
        //**-------------------------------------------------------------------------------------------------------**//


    }

    exercise.serialize(argv.out == undefined ? "~" : argv.out)
    return exercise
}

async function validateSerializedExercise(argv) {

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
                    const pLibraries = new Array();
                    var solutionsArchiveCount = 0;
                    var statementArchiveCount = 0;
                    var testsArchiveCount = 0;
                    var librariesArchiveCount = 0;

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
                    programmingExercise.libraries.forEach((library, index) => {
                        pLibraries.push(library.id)

                    })
                    files.forEach((element, index) => {
                        if (element != "metadata.json") {
                            if (element.indexOf("solutions/") == -1
                                && element.indexOf("statements/") == -1
                                && element.indexOf("tests/") == -1
                                && element.indexOf("libraries/") == -1
                                ) {
                                warning = true
                                text += `There is files in the root folder that differ from solutions/ statements/ tests/ libraries/`
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

                            if (element != "libraries/" && element.indexOf("libraries/") != -1) {
                                if (!pLibraries.includes(getUUID(element))) {
                                    warning = true
                                    text += `There is library with UUID ${element} declared in the meta file \n`
                                }
                                if (element.length > 47)
                                    librariesArchiveCount++;
                                //console.log(element)
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
                    if (programmingExercise.libraries.length * 2 != librariesArchiveCount) {
                        warning = true
                        text += `There is more files in solutions folder than declared\n`
                    }

                    if (warning) {
                        if (!argv.silent)
                            message("Warning!!!", text, "red", "black")
                        return(2);

                    } else {
                        if (!argv.silent)
                            message("Success", "The tested YAPEXIL exercise is valid and does not have any extra files", "green", "black")
                        return(0);
                    }

                });
            });
        }).catch((err) => {
            console.log(err)
            if (!argv.silent)
                message("ERROR!!!", "The YAPEXIL exercise is invalid", "red", "black")
            return(1);
        });
    } catch (err) {
        console.log(err)
        if (!argv.silent)
            message("ERROR!!!", "The YAPEXIL exercise is invalid", "red", "black")
        return(1);
    }

}

function getMetadatas(argv) {
    let metadatas = []
    message("Creating metadata.json from: ", argv.from)
    let read_opts = { // https://docs.sheetjs.com/docs/api/parse-options/
        sheetRows: 3
    }
    var workbook = XLSX.readFile(argv.from, read_opts);
    let json_opts = {} //https://docs.sheetjs.com/docs/api/utilities/#array-of-objects-input
    var jsonExercises = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], json_opts);

    jsonExercises.forEach((jsonExercise) => {
        const uuidExercise = uuid.v4()
        const uuidPath = path.join(argv.out, uuidExercise)
        fs.mkdirSync(uuidPath)
        metadatas.push(parseJsonExercise(jsonExercise, uuidExercise, uuidPath))
    })
    return metadatas
}

function parseJsonExercise(jsonExercise, uuidExercise, uuidPath) {
    const currentTime = (new Date()).toISOString();
    let metadata = {
        id: uuidExercise, // "c9d68b4f-e306-41f5-bba3-cafdcd024bfb",
        title: jsonExercise.question_txt.substring(0,20), // "Selecting all links to Google within a document",
        module: "",
        owner: "JuezLTI Erasmus+",
        keywords: [],
        type: "BLANK_SHEET",
        event: "",
        platform: "PostgreSQL",
        difficulty: "EASY",
        status: "DRAFT",
        timeout: 0,
        programmingLanguages: [
            "SQL-DQL"
        ],
        created_at: currentTime, // "2021-12-11T17:21:06.419Z",
        updated_at: currentTime, // "2021-12-11T17:21:06.419Z",
        author: "JuezLTI",
        solutions: getSolutions(jsonExercise, uuidPath),

        tests: getTests(jsonExercise, uuidPath),

        statements: getStatements(jsonExercise, uuidPath),

        libraries: getLibraries(jsonExercise, uuidPath)
    }
    const metadataPath = path.join(uuidPath, "metadata.json")
    fs.writeFileSync(metadataPath, JSON.stringify(metadata))

    return metadata
}

function getSolutions(jsonExercise, uuidPath) {
    const solutionPath = path.join(uuidPath, "solution.txt")
    const idSolution = uuid.v4()
    let fileContent =  `{"id": "${idSolution}","content":"${jsonExercise.question_solution.replace(/"/g, '\\\"')}"}`
    fs.writeFileSync(solutionPath, fileContent)
    let solutions = [{
        id: idSolution,
        pathname: "solution.txt",
        lang: "pqsql"
    }]
    return solutions
}

function getTests(jsonExercise, uuidPath) {
    const idTest = uuid.v4()
    const inputPath = path.join(uuidPath, "in.txt")
    const inContent = jsonExercise.question_probe.length > 0 ? jsonExercise.question_probe.replace(/"/g, '\\\"') : '-- '
    let fileContent =  `{"id": "${idTest}","content":"${inContent}"}`
    fs.writeFileSync(inputPath, fileContent)

    const outputPath = path.join(uuidPath, "out.txt")
    // TODO change question_txt to question_output
    fileContent =  `{"id": "${idTest}","content":"${jsonExercise.question_txt.replace(/"/g, '\\\"')}"}`
    fs.writeFileSync(outputPath, fileContent)
    let tests= [{
        id: idTest,
        arguments: [],
        weight: 5,
        visible: true,
        input: "in.txt",
        output: "out.txt",
        feedback: []
    }]
    return tests
}

function getStatements(jsonExercise, uuidPath) {
    const statementPath = path.join(uuidPath, "statement.txt")
    const idStatement = uuid.v4()
    let fileContent =  `{"id": "${idStatement}","content":"${jsonExercise.question_txt.replace(/"/g, '\\\"')}"}`
    fs.writeFileSync(statementPath, fileContent)
    let statements = [{
            id: idStatement,
            pathname: "statement.txt",
            nat_lang: "es",
            format: "HTML"
        }]
    return statements
}

function getLibraries(jsonExercise, uuidPath) {
    const librariesPath = path.join(uuidPath, "library.txt")
    const idLibraries = uuid.v4()
    let fileContent =  `{"id": "${idLibraries}","content":"${jsonExercise.question_onfly.replace(/"/g, '\\\"')}"}`
    fs.writeFileSync(librariesPath, fileContent)
    let libraries = [{
        id: idLibraries,
        pathname: "library.txt",
        type: "EMBEDDABLE"
    }]
    return libraries
}
