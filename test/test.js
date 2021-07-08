const assert = require('assert');
const swaggerParser = require('../lib/index');
const path = require('path');
const fs = require('fs');

describe('parser', function () {
    it('should throw error when path is not exist', function (done) {
        (async function () {
            try {
                await swaggerParser(path.join(__dirname, 'xxx.yaml'));
                done('error');
            } catch (e) {
                done();
            }
        })();
    });
    it('should throw error when path not endswith .yaml', function (done) {
        (async function () {
            try {
                await swaggerParser(path.join(__dirname, 'swagger.text'));
                done('error');
            } catch (e) {
                done();
            }
        })();
    });
    it('should throw error when yaml is not right', function (done) {
        (async function () {
            try {
                await swaggerParser(path.join(__dirname, 'swagger2.yaml'));
                done('error');
            } catch (e) {
                done();
            }
        })();
    });
    it('should return data when yaml is right', function (done) {
        (async function () {
            try {
                let result = await swaggerParser(path.join(__dirname, 'swagger.yaml')),
                    swaggerJsonInfo = JSON.parse(fs.readFileSync(path.join(__dirname, 'swagger-info.json')));
                assert.strictEqual(JSON.stringify(result), JSON.stringify(swaggerJsonInfo));
                done();
            } catch (e) {
                done('error');
            }
        })();
    });
});