var expect = require('chai').expect;
const fs = require('fs');
const path = require('path');
describe('YAPEXIL validate test', function() {


    it('', function(done) {
        this.timeout(10000);
        new Promise(async(resolve) => {
            let filenames = fs.readdirSync(path.resolve("./", "resources"))
            const f = await Promise.all(filenames.map(file => {
                return execShellCommand(`YAPEXIL --validate --dir ./resources --filename  ${file} --silent`)

            }));
            console.log(f)
            filenames.forEach((element, index) => {
                if (element.indexOf("correct") != -1 && f[index] != 0) {
                    expect(false).to.equal(true)

                }
                if (element.indexOf("warnning") != -1 && f[index] != 2) {
                    expect(false).to.equal(true)

                }
                if (element.indexOf("error") != -1 && f[index] != 1) {
                    expect(false).to.equal(true)


                }
            });

            expect(true).to.equal(true)


            resolve();
        }).then(done);






    });


});


function execShellCommand(cmd) {
    const exec = require('child_process').exec;
    return new Promise((resolve, reject) => {
        exec(cmd, (error, stdout, stderr) => {
            // console.log(cmd)
            if (stdout.includes("[{")) {
                stdout = "1"
            }
            stdout = (stdout.trim())
            resolve(stdout ? stdout : stderr);
        });
    });
}