const SwaggerParser = require("@apidevtools/swagger-parser");
const fs = require('fs');
const R = require('ramda');
const _ = require('lodash-compat');

//this func comes from swagger-tools->swagger-router.js
var getMockValue = function (version, schema) {
    var type = _.isPlainObject(schema) ? schema.type : schema;
    var value;

    if (!type) {
        type = 'object';
    }

    switch (type) {
        case 'array':
            value = [getMockValue(version, _.isArray(schema.items) ? schema.items[0] : schema.items)];
            break;

        case 'boolean':
            if (version === '1.2' && !_.isUndefined(schema.defaultValue)) {
                value = schema.defaultValue;
            } else if (version === '2.0' && !_.isUndefined(schema.default)) {
                value = schema.default;
            } else if (_.isArray(schema.enum)) {
                value = schema.enum[0];
            } else {
                value = 'true';
            }

            // Convert value if necessary
            value = value === 'true' || value === true ? true : false;
            break;

        case 'file':
        case 'File':
            value = 'Pretend this is some file content';
            break;

        case 'integer':
            if (version === '1.2' && !_.isUndefined(schema.defaultValue)) {
                value = schema.defaultValue;
            } else if (version === '2.0' && !_.isUndefined(schema.default)) {
                value = schema.default;
            } else if (_.isArray(schema.enum)) {
                value = schema.enum[0];
            } else {
                value = 1;
            }

            // Convert value if necessary
            if (!_.isNumber(value)) {
                value = parseInt(value, 10);
            }

            // TODO: Handle constraints and formats
            break;

        case 'object':
            value = {};

            _.each(schema.allOf, function (parentSchema) {
                _.each(parentSchema.properties, function (property, propName) {
                    value[propName] = getMockValue(version, property);
                });
            });

            _.each(schema.properties, function (property, propName) {
                value[propName] = getMockValue(version, property);
            });
            break;

        case 'number':
            if (version === '1.2' && !_.isUndefined(schema.defaultValue)) {
                value = schema.defaultValue;
            } else if (version === '2.0' && !_.isUndefined(schema.default)) {
                value = schema.default;
            } else if (_.isArray(schema.enum)) {
                value = schema.enum[0];
            } else {
                value = 1.0;
            }

            // Convert value if necessary
            if (!_.isNumber(value)) {
                value = parseFloat(value);
            }

            // TODO: Handle constraints and formats
            break;

        case 'string':
            if (version === '1.2' && !_.isUndefined(schema.defaultValue)) {
                value = schema.defaultValue;
            } else if (version === '2.0' && !_.isUndefined(schema.default)) {
                value = schema.default;
            } else if (_.isArray(schema.enum)) {
                value = schema.enum[0];
            } else {
                if (schema.format === 'date') {
                    value = '1970-01-01';
                } else if (schema.format === 'date-time') {
                    value = '1970-01-01 00:00:00';
                } else {
                    value = '';
                }
            }
            break;
    }

    return value;
};

module.exports = async function parseSwaggerSimple(yamlFilePath = '') {
    if (!yamlFilePath.endsWith('.yaml')) {
        throw new Error('yamlFilePath must endswith .yaml！');
    }
    if (!fs.existsSync(yamlFilePath)) {
        throw new Error('yamlFilePath is invalid');
    }
    let api = await SwaggerParser.validate(yamlFilePath);
    let result = {
        version: api.swagger || '2.0',
        host: api.host,
        basePath: api.basePath,
        schemes: api.schemes,
        paths: [],
    };
    for (let url in api.paths) {
        let methodsConf = api.paths[url];
        for (let method in methodsConf) {
            let interfaceConf = methodsConf[method],
                interface = {
                    url,
                    method,
                    summary: interfaceConf.summary || '',
                    description: interfaceConf.description || '',
                    consumes: interfaceConf.consumes || [],
                    produces: interfaceConf.produces || [],
                    parameters: R.map(param => {
                        return {
                            name: param.name || '',
                            in: param.in || '',
                            description: param.description || '',
                            required: param.required || false,
                            type: param.type,
                        }
                    })(interfaceConf.parameters || []),
                    responses: R.mapObjIndexed((text, code) => {
                        let exampleData = {
                            description: text.description || '',
                            data: getMockValue(result.version, text.schema || {}),
                        }
                        return exampleData;
                    })(interfaceConf.responses || {}),
                };
            result.paths.push(interface);
        }
    }
    return result;
}