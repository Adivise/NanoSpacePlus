const { green, white } = require("chalk");

module.exports = async (client, node, error) => {
	console.log(white('[') + green('INFO') + white('] ') + green('Node ') + white(node.options.identifier) + green(' Created!'));
}