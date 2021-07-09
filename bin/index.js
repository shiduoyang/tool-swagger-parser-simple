#!/usr/bin/env node
const parser = require('../lib/index');
const program = require('commander');
const fs = require('fs');

program
    .command('parse')
    .version('1.0.0')
    .description('parse yaml to simple data and >> jsonfile')
    .option('-y, --yaml [string]', 'yaml file path', '')
    .option('-t, --target [string]', 'target yaml.json path', './yaml.json')
    .action(function (options) {
        console.log(options);
        parser(options.yaml).then(val => {
            fs.writeFileSync(options.target, JSON.stringify(val));
            console.log(`result >> ${options.target} done`);
        });
    });
program.parse(process.argv);