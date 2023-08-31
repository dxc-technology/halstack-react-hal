const fs = require("fs");

fs.createReadStream("../README.md").pipe(fs.createWriteStream("./README.md"));
fs.createReadStream("./package.json").pipe(
  fs.createWriteStream("./dist/package.json")
);
