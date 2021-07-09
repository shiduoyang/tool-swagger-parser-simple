# swagger-parser-simple
在swagger-parser功能的基础上，提供对接口文档*.yaml更为简略，对开发更为友好的解析。

## Features

* 将接口文档*.yaml中定义的接口，转化成js对象的形式，并返回
* 上述的结果，也可以通过命令行的方式写入json文件中
* **解析结果包含每个接口的返回结构及其默认值**

## install

```
npm install -g swagger-parser-simple
```
or
```
npm install swagger-parser-simple
```

## Using

### 1 normal parse
```
swagger-parser-simple parse -y ./test/swagger.yaml  -t ./swagger.json
```
result: 
```
{ yaml: './test/swagger.yaml', target: './swagger.json' }
result >> ./swagger.json done
```

### 2 help
```
swagger-parser-simple parse --help
```
result:
```
Usage: swagger-parser-simple parse [options]

parse yaml to simple data and >> jsonfile

Options:
  -V, --version          output the version number
  -y, --yaml [string]    yaml file path (default: "")
  -t, --target [string]  target yaml.json path (default: "./yaml.json")
  -h, --help             display help for command
```

## Test
```
npm run test
```