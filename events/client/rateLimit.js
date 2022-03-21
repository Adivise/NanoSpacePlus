const { white, red } = require('chalk');

module.exports = async (client, info) => {
    console.log(white(' [') + red('ERROR') + white('] ') + red('Rate Limited, Sleeping for ') + white(0) + red(' seconds'));
}