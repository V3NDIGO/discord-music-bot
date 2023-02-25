const ytdl = require('ytdl-core');
const Discord = require("discord.js");
const prefix= "!";

const client = new Discord.Client({
    ws: { intents: Discord.Intents.ALL },
  });
  
  client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
  });
  
  client.on('message', msg => {
    if (msg.content === 'ping') {
      msg.reply('Pong!');
    }
  });
  
  client.login('MTA3MzA2NTg4OTI3ODIwMTg2Nw.G4GoDN.FgO2sBfD2VYNfZldyjqBsbHKmYrK7oi9mIaOKs');

  

let dispatcher;
let queue = [];

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  if (msg.content.startsWith('!play')) {
    const voiceChannel = msg.member.voice.channel;
    if (!voiceChannel) return msg.reply('Please join a voice channel first!');

    const song = msg.content.split(' ').slice(1).join(' ');

    if (!dispatcher) {
      voiceChannel.join().then(connection => {
        queue.push(song);
        playSong(connection, msg);
      });
    } else {
      queue.push(song);
      msg.reply('Song added to the queue!');
    }
  }
});

client.on('message', msg => {
  if (msg.content === '!stop') {
    const voiceChannel = msg.member.voice.channel;
    if (!voiceChannel) return msg.reply('Please join a voice channel first!');

    queue = [];
    dispatcher.end();
    voiceChannel.leave();
  }
});

client.on('message', msg => {
  if (msg.content === '!skip') {
    if (!dispatcher) return msg.reply('Nothing is playing to skip.');
    dispatcher.end();
  }
});

function playSong(connection, msg) {
  if (!queue.length) {
    msg.reply('All songs have been played. Queue is empty!');
    connection.disconnect();
    return;
  }

  const stream = ytdl(queue.shift(), { filter: 'audioonly' });
  dispatcher = connection.play(stream);

  dispatcher.on('finish', () => playSong(connection, msg));
}

client.login('MTA3MzA2NTg4OTI3ODIwMTg2Nw.G4GoDN.FgO2sBfD2VYNfZldyjqBsbHKmYrK7oi9mIaOKs');
