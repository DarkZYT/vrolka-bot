const Discord = require('discord.js');
const client = new Discord.Client();
//const YoutubeDL = require('youtube-dl');
//const ytdl = require('ytdl-core');
//const jsonf = require('json-file');
const file = 'guildsdata.json'
var commandPrefix = "";
function globalVar()
{
    this.__enabled = true;    
}
client.on('message', msg => {
    message = msg.content.trim();
	if (msg.channel.name !== "commandes-musique") {return;}

      const command = message.substring(commandPrefix.length).split(/[ \n]/)[0].toLowerCase().trim();
      const suffix = message.substring(commandPrefix.length + command.length).trim();

      switch (command) {
        case 'play':
	{
          return play(msg, suffix);
	  msg.delete();
	}
	case 'queue':
	{
	  return play(msg, suffix);
	  msg.delete();
	}
	case 'stop':
	{
			stopQueue(msg)
	}
	case 'join':
	{
			joinChannel(msg)
	}
	case 'showqueue':
	{
			showQueue(msg)
	}	
		   
      }


  });

  var play = function(msg, suffix) {
    var voiceChannel = msg.member.voiceChannel;
    msg.channel.send('```Chargement du lien...```').then(response => {
      var searchstring = suffix;

      if (!suffix.toLowerCase().startsWith('http')) {
        searchstring = 'gvsearch1:' + suffix;
      }

      YoutubeDL.getInfo(searchstring, ['-q', '--no-warnings', '--force-ipv4'], (err, info) => {
        if (err || info.format_id === undefined || info.format_id.startsWith('0')) {
          return response.edit('```Video ou lien invalide !```');
        }

        response.edit('```Ajout à la queue: ' + info.title + "```").then(() => {
	  if (msg.guild.queue == null){msg.guild.queue = [];}
          msg.guild.queue.push({
            'name': info.title,
            'url': info.webpage_url,
            'requested_by': msg.author.id,
          });
          if (msg.guild.queue.length === 1) playQueue(msg, suffix);
        }).catch(console.log);
      });
    }).catch(console.log);
  };

  var skipCurrentSong = function(msg){
	if (msg.guild.queue == null){msg.guild.queue = [];}
	if (msg.guild.queue.length !== 0)
	{
		if (msg.guild.joinedChannel != null)
		{
			msg.channel.send("```Clip loopé : " + msg.guild.queue.shift().name + "```")
			playQueue(msg,"");
		} else {
			msg.channel.send("**Je ne suis pas dans un salon vocal.**")
		}
	} else {
		msg.channel.send("**La queue est dèja vide.**")
	}
  }
  var stopQueue = function(msg){
  if (msg.guild.joinedChannel !== null)
  {
	  msg.guild.queue = [];
	  msg.guild.joinedChannel.leave();
	  msg.guild.joinedChannel = null;
	  msg.channel.send("**La queue a été clear et j'ai quitté le salon vocal.**")
  } else {
	  msg.channel.send("Je ne suis pas actuellement dans un salon vocal.");
  }
  }
  var showQueue = function(msg) {
	  var queues = "```Liste de la queue :\n";
	  if (msg.guild.queue == null){msg.guild.queue = [];}
		if(msg.guild.queue.length == 0){msg.channel.send("```La queue est vide.```"); return;}
	  for(i = 0;msg.guild.queue[i] != null;i++)
	  {
			if(msg.guild.queue[i+1] != null){
		  queues += (i+1) + " - " + msg.guild.queue[i].name + "\n";
			} else {
			queues += (i+1) + " - " + msg.guild.queue[i].name;
			}
	  }
		queues += "```";
		msg.channel.send(queues)
  }
  var joinChannel = function(msg){
    if(msg.member.voiceChannel != null)
    {
	msg.member.voiceChannel.join()
	msg.channel.send("**J'ai rejoin : " + msg.member.voiceChannel.name + "**")
	    if(msg.guild.queue.length != 0)
			{
				playQueue(msg,"");
			}
    } else {
	msg.channel.send("Vous n'etes pas actuellement dans un salon vocal.")    
    }
  }
  var playQueue = function(msg, suffix, voiceChannel = msg.member.voiceChannel) {
    msg.guild.joinedChannel = voiceChannel;
    voiceChannel.join()
      .then(connection => {
        var stream = ytdl(msg.guild.queue[0].url, {
          audioonly: true,
          quality: 'highestaudio'
        });
        return connection.playStream(stream, {
          seek: 0,
          volume: 1
        });
      })
      .then(dispatcher => {
        dispatcher.on('error', error => {
          msg.guild.queue.shift();

          if (msg.guild.queue.length === 0) {
            voiceChannel.leave();
		msg.guild.joinedChannel = null;
            return;
          }

          playQueue(msg, suffix);

          console.error;
        });

        dispatcher.on("end", end => {
          msg.guild.queue.shift();

          if (msg.guild.queue.length === 0) {
            voiceChannel.leave();
		  msg.guild.joinedChannel = null;
            return;
          }

          playQueue(msg, suffix);
        });
      })
      .catch(console.error);
      
      return module;
  };


var global = new globalVar();
client.on('ready', () => {
    console.log('I am ready!');
    console.log('Bot got ready , join now discord!')
});

var commands = [];
var commandsdesc = [];
commands.push("info");
commandsdesc.push("Affiche des informations sur le serveur Discord : *info/informations*");
commands.push("status-joueur");
commandsdesc.push("[Expérimental] Affiche des informations sur un joueur Minecraft : *status-joueur*");
commands.push("status-serveur");
commandsdesc.push("Affiche des informations sur le serveur Minecraft : *status*");
commands.push("play");
commandsdesc.push("Joue un clip musical : *play/queue <lien/nom>*");
commands.push("stop");
commandsdesc.push("Arrêt du jeu de musique: *stop/leave*");
commands.push("showqueue");
commandsdesc.push("Affiche la liste des clips ajoutés a la queue : *showqueue*");
commands.push("join");
commandsdesc.push("Rejoin votre salon actuel : *join*");

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
	} else if (command === "status-serveur"){
		message.channel.send("**Status du serveur :**")
		message.channel.send({
		  files: [{
		      attachment: 'https://use.gameapis.net/mc/query/banner/VrolkaNetwork.lcmc.pro:25565',
		      name: 'banner.jpg'
		   }]
		})
		  .then()
		  .catch(console.error);
	}
    	
    }
});
// THIS  MUST  BE  THIS  WAY
client.login(process.env.BOT_TOKEN);


