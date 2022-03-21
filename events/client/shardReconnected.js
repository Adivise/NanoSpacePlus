const { white, yellow } = require("chalk");

module.exports = async (client, id) => {
    console.log(white('[') + yellow('WARN') + white('] ') + yellow('Shard ') + white(id) + yellow(' Shard Reconnected!'));
}