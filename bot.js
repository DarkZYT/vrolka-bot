const Discord = require('discord.js');
const client = new Discord.Client();
//const YoutubeDL = require('youtube-dl');
//const ytdl = require('ytdl-core');
//const jsonf = require('json-file');
const file = 'guildsdata.json'
var commandPrefix = "";
var commands = [];
commands.push("info").desc = "Affiche des informations sur le serveur.";
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
    if (message.channel.name === "commandes-bot") {
	const args = message.content.slice(commandPrefix.length).trim().split(/ +/g);
   	const command = args.shift().toLowerCase();
	if (command === "aide"){
		message.channel.send("```Commandes Bot:```")
		for(i = 0;i < commands.length;i++)
		{
			message.channel.send("**" +command[i]+ "** : " + command[i].desc);
		}
	} else if ((command === "info") || (command === "informations"))
		message.channel.send("Le serveur **" + message.guild.info + "** contient **" + message.guild.members.size + "** membres .")	
    	
    }
});
// THIS  MUST  BE  THIS  WAY
client.login(process.env.BOT_TOKEN);


