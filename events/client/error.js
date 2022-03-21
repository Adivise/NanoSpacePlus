const { white, red } = require('chalk');

module.exports = async (client) => {
    console.log(white('[') + red('WARN') + white('] ') + red('Errored ') + white(`${client.user.tag} (${client.user.id})`) + red(' '));
};
