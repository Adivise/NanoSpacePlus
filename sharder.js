const { ShardingManager } = require('discord.js'); //imports the sharding manager

const manager = new ShardingManager('./index.js', { 
  token: 'paste your token', //paste your token here
  respawn: true,
  autoSpawn: true,
  totalShards: 1, //amount of shards
  shardList: "auto", //edit it only if you know what are you doing
});

manager.on('shardCreate', shard => console.log(`Launched shard ${shard.id}`));

manager.spawn();
