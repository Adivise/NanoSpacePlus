const { white, green } = require("chalk");

module.exports = async (client, id) => {
    console.log(white('[') + green('INFO') + white('] ') + green('Shard ') + white(id) + green(' Shard Ready!'));
}