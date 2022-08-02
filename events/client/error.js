const { white, red } = require('chalk');

module.exports = async (client, error) => {
    console.log(white('[') + red('WARN') + white('] ') + red('Errored ') + white(`${client.user.tag} (${client.user.id}) ${error}`) + red(' '));
};
