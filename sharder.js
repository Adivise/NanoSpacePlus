const { ShardingManager } = require('discord.js'); //imports the sharding manager

const manager = new ShardingManager('./index.js', { token: 'paste your token' }); //paste your token here

manager.on('shardCreate', shard => console.log(`Launched shard ${shard.id}`));

manager.spawn();
