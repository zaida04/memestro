const tsNode = require("ts-node");
const { join } = require("path");

tsNode.register({
    project: join(__dirname, "..", "tsconfig.eslint.json")
})