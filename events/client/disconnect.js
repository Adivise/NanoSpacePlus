const { white, yellow } = require('chalk');

module.exports = async (client) => {
    console.log(white('[') + yellow('WARN') + white('] ') + yellow('Disconnected ') + white(`${client.user.tag} (${client.user.id})`) + yellow(' '));
};
