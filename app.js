// some scrappy code I wrote in F20 to recursively find package.json and run npm install.
// make sure you have enough gb space, run 'node app.js', and go make some coffee.

const fs = require('fs');
const execSync = require('child_process').execSync;

const myArgs = process.argv.slice(2);

const BASE_PATH = myArgs[0];
// const BASE_PATH = 'D:/YourPath/YourFolder/UseTheseSlashes/IncludeEndingSlash/'
let packageJsonLocations = [];

let students = fs.readdirSync(BASE_PATH);
students.forEach(student => {
    findPackageJson(BASE_PATH + student);
});

packageJsonLocations.forEach(location => {
    console.log("Executing pnpm i for " + location);
    try {
        execSync("cd " + location + " && pnpm i");
    } catch (error) {
        console.error("ERROR ON " + location);
    }
});

console.log("Complete!");

function findPackageJson(path) {
    path = path + "/";
    let dir = fs.readdirSync(path);
    let foundPkg = false;
    dir.forEach(file => {
        if (!fs.lstatSync(path + file).isDirectory() && file === "package.json") {
            packageJsonLocations.push(path);
            foundPkg = true;
        }
    })
    if (!foundPkg) {
        dir.forEach(file => {
            if (fs.lstatSync(path + file).isDirectory() && !file.includes("node_modules")) {
                findPackageJson(path + file);
            }
        })
    }
}