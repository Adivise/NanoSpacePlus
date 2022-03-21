const { yellow, white } = require("chalk");

module.exports = async (client, error, id) => {
    console.log(white('[') + yellow('WARN') + white('] ') + yellow('Shard ') + white(id) + yellow(' Shard Disconnected!'));
}