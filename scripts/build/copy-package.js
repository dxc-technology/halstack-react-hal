const fs = require('fs');

fs.createReadStream('./package.json').pipe(fs.createWriteStream('./lib/dist/package.json'));
