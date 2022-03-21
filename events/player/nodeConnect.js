const { white, green } = require("chalk");

module.exports = async (client, node) => {
	console.log(white('[') + green('INFO') + white('] ') + green('Node ') + white(node.options.identifier) + green(' Connected!'));
}