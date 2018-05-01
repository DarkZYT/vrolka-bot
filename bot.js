const Discord = require('discord.js');
const client = new Discord.Client();
//const YoutubeDL = require('youtube-dl');
//const ytdl = require('ytdl-core');
//const jsonf = require('json-file');
require("node-jsdom").env("", function(err, window) {
    if (err) {
        console.error(err);
        return;
    }

    const $ = require("jquery")(window);
});
const file = 'guildsdata.json'
var commandPrefix = "";
var commands = [];
var commandsdesc = [];
commands.push("info");
commandsdesc.push("Affiche des informations sur le serveur.");
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
			message.channel.send("**" +commands[i]+ "** : " + commandsdesc[i]);
		}
	} else if ((command === "info") || (command === "informations")) {
		message.channel.send("Le serveur discord **" + message.guild.name + "** contient **" + message.guild.members.size + "** membres .")
	} else if (command === "status"){
		message.channel.send("https://use.gameapis.net/mc/query/banner/VrolkaNetwork.lcmc.pro:25565")
		var url ="https://use.gameapis.net/mc/query/players/VrolkaNetwork.lcmc.pro:25565";
		$.ajax({
		  url: url,
		  dataType: 'html',
		  success: function(data){
			     var response = data;
			   }

		})
		var k = JSON.parse(response);
		message.send(k.players.online + "/" + k.players.max)
	}
    	
    }
});
// THIS  MUST  BE  THIS  WAY
client.login(process.env.BOT_TOKEN);


