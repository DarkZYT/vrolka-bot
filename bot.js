const Discord = require('discord.js');
const client = new Discord.Client();
//const YoutubeDL = require('youtube-dl');
//const ytdl = require('ytdl-core');
//const jsonf = require('json-file');
const file = 'guildsdata.json'
var commandPrefix = "_";
function globalVar()
{
    this.__enabled = true;    
}
var global = new globalVar();
client.on('ready', () => {
    console.log('I am ready!');
    console.log('Bot got ready , join now discord!')
});
client.on('message', message => {
	if (message.author.muted == true) {return;}
    if (message.channel.name === "commandes-bot") {
	const args = message.content.slice(message.guild.commandPrefix.length).trim().split(/ +/g);
   	const command = args.shift().toLowerCase();
	if (command === "salut"){
		message.channel.send("Salut! Cava ? <@"+message.author.id+">");	
	}
});
// THIS  MUST  BE  THIS  WAY
client.login(process.env.BOT_TOKEN);


