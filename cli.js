#!/usr/bin/env node

var program = require('commander');

var pkg = require('./package.json');


program
    .version(pkg.version)
    .usage('<command>');

program
    .command('hash <password>')
    .description('Hash a password')
    .action(function(password) {
        console.log(require('./phpbb.js').hash(password));
    });

program
    .command('verify <password> <hash>')
    .description('Verify a password against a hash')
    .action(function(password, hash) {
        console.dir(require('./phpbb.js').check_hash(password, hash));
    });

program.on('*', function() {
    program.help();
});

program.parse(process.argv);

if (!program.args.length) {
    program.help();
}
