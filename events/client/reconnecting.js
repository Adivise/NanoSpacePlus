const { white, yellow } = require('chalk');

module.exports = async (client) => {
    console.log(white('[') + yellow('WARN') + white('] ') + yellow('Reconnected ') + white(`${client.user.tag} (${client.user.id})`) + yellow(' '));
};
