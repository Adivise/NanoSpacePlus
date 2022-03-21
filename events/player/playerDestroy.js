const { white, red }= require("chalk");

module.exports = async (client, player) => {
	console.log(white('[') + red('DEBUG') + white('] ') + red('Player Destroyed from (') + white(`${player.guild}`) + red(')'));
}