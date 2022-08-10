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
const { create } = require('domain');
const uuid = require('uuid');
var XLSX = require("yxw-xlsx");

let sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

var out;
var promise = (new Promise((resolve, reject) => {


    yargs.command('$0', 'YAPEXIL generator', () => {
        message("YAPEXIL CLI", "Welcome", "green", "black")
    }, async(argv) => {
        await loadSchemaYAPEXIL();
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




                    if ("skeleton_addition" in argv) {
                        if ("skeleton_lang" in argv) {
                            if ("skeleton_content" in argv) {
                                let id = crypto.randomUUID()
                                exercise.skeletons = []
                                exercise.skeletons_contents = {}

                                exercise.skeletons.push({
                                    id: id,
                                    pathname: `skeleton_${crypto.randomUUID()}_.${argv.skeleton_lang}`,
                                    lang: argv.skeleton_lang,
                                })
                                let content = fs.readFileSync(argv.skeleton_content, { encoding: 'utf8', flag: 'r' });
                                exercise.skeletons_contents[id] = content
                            } else {
                                throw new Error("Please, supply a skeleton content ");

                            }

                        } else {
                            throw new Error("Please, supply a skeleton lang ");

                        }
                    }



                    if ("solution_addition" in argv) {
                        if ("solution_lang" in argv) {
                            if ("solution_content" in argv) {
                                let id = crypto.randomUUID()
                                exercise.solutions.push({
                                    id: id,
                                    pathname: `solution_${crypto.randomUUID()}_.${argv.solution_lang}`,
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
                                        pathname: `statment_${crypto.randomUUID()}_.${argv.statement_format}`,
                                        nat_lang: argv.statement_nat_lang,
                                        format: argv.statement_format,

                                    })
                                    let content;
                                    if (argv.statement_format == "PDF") {
                                        console.log("Aqui")
                                        content = fs.readFileSync(argv.statement_content, { encoding: 'base64', flag: 'r' });

                                    } else {
                                        content = fs.readFileSync(argv.statement_content, { encoding: 'utf8', flag: 'r' });
                                    }



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
                        if ("test_visibility" in argv) {
                            if ("test_input_content" in argv) {
                                if ("test_output_content" in argv) {
                                    let id = crypto.randomUUID()

                                    let obj = {
                                        id: id,
                                        arguments: [],
                                        weight: 1,
                                        visible: eval(argv.test_visibility),
                                        input: 'input.txt',
                                        output: 'output.txt'
                                    }
                                    if ("test_feedback" in argv) {
                                        let feedback = []
                                        argv.test_feedback.split('-').forEach((element) => {
                                            let parsed = element.replaceAll('_', ' ')
                                            feedback.push({ message: parsed, weight: 0 })
                                        })
                                        obj['feedback'] = feedback

                                    } else {

                                        obj['feedback'] = [{ message: "", weight: "0" }]
                                    }
                                    exercise.tests.push(obj)
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
                    console.log("Done")
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

            if ("id" in argv) {
                exercise.id = argv.id;

            } else {

                exercise.id = crypto.randomUUID()
            }
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
            console.log(exercise.id)
            exercise.serialize(path.join(__dirname, "../", "exercises"))

        }

        if ("create_from_metadata" in argv) {
            const exercise = await createFromMetadata(argv)
            resolve(exercise);
        } else if ("validate" in argv) {
            const result = await validateSerializedExercise(argv)
            if (result) resolve(result);
        } else if ("import" in argv) {
            if (from = argv.from) {
                let metadatas = await getMetadatas(argv)
                let exercisesP = []
                for( let metadata of metadatas) {
                    let argvCreate = {
                        _: [],
                        create: true,
                        dir: path.join(argv.out, metadata.id, 'metadata.json'),
                        out: argv.out,
                        base: path.join(argv.out, metadata.id),
                        '$0': 'YAPEXIL'
                    }
                    exercisesP.push(createFromMetadata(argvCreate))
                }
                Promise.all(exercisesP).then(exercises => {
                    if (exercises.length > 0)
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
                            if (element.indexOf("solutions/") == -1 &&
                                element.indexOf("statements/") == -1 &&
                                element.indexOf("tests/") == -1 &&
                                element.indexOf("libraries/") == -1
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
                        return (2);

                    } else {
                        if (!argv.silent)
                            message("Success", "The tested YAPEXIL exercise is valid and does not have any extra files", "green", "black")
                        return (0);
                    }

                });
            });
        }).catch((err) => {
            console.log(err)
            if (!argv.silent)
                message("ERROR!!!", "The YAPEXIL exercise is invalid", "red", "black")
            return (1);
        });
    } catch (err) {
        console.log(err)
        if (!argv.silent)
            message("ERROR!!!", "The YAPEXIL exercise is invalid", "red", "black")
        return (1);
    }

}

async function getMetadatas(argv) {
    let metadatas = [],
        rows = argv.rows ? argv.rows : 0
    message("Creating metadata.json from: ", argv.from)
    let read_opts = { // https://docs.sheetjs.com/docs/api/parse-options/
        sheetRows: rows
    }
    var workbook = XLSX.readFile(argv.from, read_opts);
    let json_opts = {} //https://docs.sheetjs.com/docs/api/utilities/#array-of-objects-input
    var jsonExercises = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], json_opts);

    if(argv.initRow && argv.initRow > 0) {
        jsonExercises.splice(0,argv.initRow)
    }

    for(let jsonExercise of jsonExercises) {
        const uuidExercise = uuid.v4()
        const uuidPath = path.join(argv.out, uuidExercise)
        fs.mkdirSync(uuidPath)
        let parsedJsonExercise = await parseJsonExercise(jsonExercise, uuidExercise, uuidPath)
        metadatas.push(parsedJsonExercise)
    }
    return metadatas
}

async function parseJsonExercise(jsonExercise, uuidExercise, uuidPath) {
    const currentTime = (new Date()).toISOString();
    let statements = await getStatements(jsonExercise, uuidPath)
    let metadata = {
        id: uuidExercise, // "c9d68b4f-e306-41f5-bba3-cafdcd024bfb",
        title: jsonExercise.title, // "Selecting all links to Google within a document",
        module: jsonExercise.module,
        owner: "JuezLTI Erasmus+",
        keywords: jsonExercise.keywords.split(','),
        type: "BLANK_SHEET",
        event: "",
        platform: "PostgreSQL",
        difficulty: "EASY",
        status: "DRAFT",
        timeout: 0,
        programmingLanguages: jsonExercise.programmingLanguages.split(','),
        created_at: currentTime, // "2021-12-11T17:21:06.419Z",
        updated_at: currentTime, // "2021-12-11T17:21:06.419Z",
        author: "JuezLTI",
        solutions: getSolutions(jsonExercise, uuidPath),

        tests: getTests(jsonExercise, uuidPath),

        statements: statements,

        libraries: getLibraries(jsonExercise, uuidPath)
    }
    const metadataPath = path.join(uuidPath, "metadata.json")
    fs.writeFileSync(metadataPath, JSON.stringify(metadata))

    return metadata
}

function getSolutions(jsonExercise, uuidPath) {
    const solutionPath = path.join(uuidPath, "solution.txt")
    const idSolution = uuid.v4()
    let fileContent = `{"id": "${idSolution}","content":"${jsonExercise.solution.replace(/"/g, '\\\"')}"}`
    fs.writeFileSync(solutionPath, fileContent)
    let solutions = [{
        id: idSolution,
        pathname: "solution.txt",
        lang: jsonExercise.solutionLang
    }]
    return solutions
}

function getTests(jsonExercise, uuidPath) {
    jsonExercise.tests = getTestItems(jsonExercise)
    let tests = []
    jsonExercise.tests.forEach((test, index, array) => {
        let idTest = uuid.v4()
        let inputPath = path.join(uuidPath, `in_${index}.txt`)
        let inContent = test.in.length > 0 ? test.in.replace(/"/g, '\\\"') : '-- '
        let fileContent = `{"id": "${idTest}","content":"${inContent}"}`
        fs.writeFileSync(inputPath, fileContent)

        let outputPath = path.join(uuidPath, `out_${index}.txt`)
        let outContent = test.out.length > 0 ? test.out.replace(/"/g, '\\\"') : ''
        fileContent = `{"id": "${idTest}","content":"${outContent.substr(0, 15000)}"}`
        fs.writeFileSync(outputPath, fileContent)
        tests.push({
            id: idTest,
            arguments: [],
            weight: 5,
            visible: true,
            input: `in_${index}.txt`,
            output: `out_${index}.txt`,
            feedback: []
        })
    })
    return tests
}

function getTestItems(jsonExercise) {
    let tests = []
    for (element in jsonExercise) {
        if (element.startsWith("testIn")) {
            let index = element.substr(element.indexOf("[") + 1, (element.indexOf("]") - element.indexOf("[")) - 1)
            tests.push({
                'in': jsonExercise[element],
                'out': jsonExercise[element.replace("In", "Out")]
            })
        }
    }
    return tests
}

async function getStatements(jsonExercise, uuidPath) {
    jsonExercise.statements = getStatementLanguages(jsonExercise)
    let statements = []
    let originLang, originStatement, targetContent
    for(let statement of jsonExercise.statements) {
        if(!originLang) { // using first lang as the source for translation
            originLang = statement.lang
            originStatement = statement.content
        }
        let statementPath = path.join(uuidPath, `statement_${statement.lang}.txt`)
        let idStatement = uuid.v4()
        if(statement.lang != originLang && statement.content.toLowerCase() == 'translate') {
            targetContent = await translate(originStatement, originLang, statement.lang)
        } else {
            targetContent = statement.content
        }
        let fileContent = `{"id": "${idStatement}","content":"${targetContent.replace(/"/g, '\\\"')}"}`
        fs.writeFileSync(statementPath, fileContent)
        statements.push({
            id: idStatement,
            pathname: `statement_${statement.lang}.txt`,
            nat_lang: statement.lang,
            format: "HTML"
        })
    }
    return statements
}

function getStatementLanguages(jsonExercise) {
    let statements = []
    for (element in jsonExercise) {
        if (element.startsWith("statement")) {
            let lang = element.substr(element.indexOf("[") + 1, (element.indexOf("]") - element.indexOf("[")) - 1)
            statements.push({
                'lang': lang,
                'content': jsonExercise[element]
            })
        }
    }
    return statements
}

function getLibraries(jsonExercise, uuidPath) {
    const librariesPath = path.join(uuidPath, "library.txt")
    const idLibraries = uuid.v4()
    let fileContent
    if (jsonExercise.library.toLowerCase().startsWith("file:")) {
        let schemaContent = fs.readFileSync(jsonExercise.library.substr(5))
        fileContent = `{"id": "${idLibraries}","content":"${schemaContent}"}`
    } else {
        fileContent = `{"id": "${idLibraries}","content":"${jsonExercise.library.replace(/"/g, '\\\"')}"}`
    }
    fs.writeFileSync(librariesPath, fileContent)
    let libraries = [{
        id: idLibraries,
        pathname: "library.txt",
        type: "EMBEDDABLE"
    }]
    return libraries
}

async function translate(content, source, target) {
    let contentSplited = []
    if(content.length > 1900) { // characters limit in libreTranslate API
        contentSplited = content.split("</p>")
    } else {
        contentSplited.push(content)
    }

    if(content.length > 1900) {
        for(let contentPiece in contentSplited) {
            contentSplited[contentPiece] += "</p>"
        }
    }
    var translatedText = ""
    for(let contentPiece in contentSplited) {
        await sleep(1000); // no more than request 80/min
        const res = await axios.post("https://libretranslate.com/translate", {
            q: contentSplited[contentPiece],
            source: source,
            target: target,
            format: "html",
            api_key: process.env.TRANSLATE_KEY
        });
        translatedText += res.data?.translatedText
    }
    console.log(translatedText)
    return(translatedText);
}
