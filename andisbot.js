var Discord = require("discord.js")
var request = require("request")
var fs = require('fs')
var bot = new Discord.Client({
  autoReconnect: true
})

var util = require('util');
var log_file = fs.createWriteStream(__dirname + '/debugging.log', {flags : 'w'});
var log_stdout = process.stdout;

console.log = function(d) { //
  log_file.write(util.format(d) + '\n');
  log_stdout.write(util.format(d) + '\n');
};

// Discord BOT Token
var token = '';

var counter = 0;
var currentPlayer = 0;

var userList = [];

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function search(myArray, nameKey){
    for (var i=0; i < myArray.length; i++) {
        if (myArray[i] === nameKey) {
            return myArray[i];
        }
    }
}

function searchIndex(myArray, index){
    for (var i=0; i < myArray.length; i++) {
        if (myArray[i] === index) {
            return myArray[i];
        }
    }
}

var join = "To invite this bot click https://discordapp.com/oauth2/authorize?&client_id=174237165042008075&scope=bot and select your server !"
var help = "Truth and Dare is a popular game. How it's played is a player asks a Truth or a dare and gets from another person. To play it on the server call the bot with it's username and Truth next to it for Truth and Dare for a dare."
var info = "The TruthAndDareBot is made by @UnknownDeveloper that power this bot. The bot is licensed under the MIT License. For More information visit the GitHub page at this page https://github.com/TheRealUnknownDeveloper/TruthAndDareBot-Discord-Edition/"

bot.on("ready", function(msg) {
	console.log("Woops! Bot logged in under the name of " + bot.user.username + " and the user ID of " + bot.user.id)
	})
	
	//Msg comes in start
	bot.on("message", function(msg) {

		var oldOGMsg = msg.content;
		var myMsg = msg.content.toLowerCase();

		if (myMsg.indexOf("<@" + bot.user.id + "> truth") == 0) {
			var askerName, playerName, newMsg;
			
			if(currentPlayer == 0) askerName = userList[userList.length() -1];
			else askerName = userList[currentPlayer -1];
			
			playerName = searchIndex(userList, currentPlayer);
			newMsg = "You called Truth! Player " + playerName + 
			" wants to get a Question! Player " + askerName + " please ask him a Question!";
			currentPlayer++;
			msg.reply(newMsg);
		}

		if (myMsg.indexOf("<@" + bot.user.id + "> dare") == 0) {
			var askerName, playerName, newMsg;
			
			if(currentPlayer == 0) askerName = userList[userList.length -1];
			else askerName = userList[currentPlayer -1];
			
			playerName = searchIndex(userList, currentPlayer);
			newMsg = "You called Dare! Player " + playerName + 
			" wants to get a Dare! Player " + askerName + " please give the other player something to do!";
			currentPlayer++;
			msg.reply(newMsg);
		}
		
		if (myMsg.indexOf("<@" + bot.user.id + "> join") == 0) {
		  console.log(oldOGMsg);
		  userList[counter] = oldOGMsg.split(" ")[2];
		  
		  counter++;
		  currentPlayer++;
		  msg.reply(userList[counter-1] + " joined the game!");
		}

		if (myMsg.indexOf("<@" + bot.user.id + "> leave") == 0) {
			console.log(myMsg);
			counter--;
			var resultObject = search(userList, myMsg.split(" ")[2]);

			var filtered = userList.filter(function(el) {
			return el !== resultObject;
			});

			userList = filtered;
			msg.reply(userList[counter] + " leaved the game!");
		}

		if (myMsg.indexOf("<@" + bot.user.id + "> show") == 0) {
		  var reply = "--- Current userlist ---" + "\n";
		  
		  for(var i = 1; i < userList.length; i++){
			  if((i-1) === currentPlayer){
				  reply = reply + "--> ";
			  }
			  reply = reply + i + ": " + userList[i-1] + "\n";
		  }
		  
		  reply = reply + "--- To randomize use the command shuffle! The player with --> is the current player ---";
		  msg.reply(reply);

		}

		if (myMsg.indexOf("<@" + bot.user.id + "> shuffle") == 0) {
		  userList = shuffle(userList);
		  currentPlayer = 0;
		  var reply = "The list was shuffled. Use the Show Command to view the current list!";
		  msg.reply(reply);

		}

		if (myMsg.indexOf("<@" + bot.user.id + "> info") == 0) {
		  var infomsg =
		  "Available Commands:\n" +
		  "Info and Help: Name says it all\n" + 
		  "Show: Shows the current list of people playing\n" + 
		  "Join NAME: the person NAME enters the game!\n" +
		  "Leave NAME: this person leaves the list\n"+
		  "Truth: The player chooses Truth\n"+
		  "Dare: The player chooses Dare\n"+
		  "Shuffle: Shuffles the list randomly. Use this at the end of the round. or let me do it...\n" +
		  "Clear: Only use this if you want to end the whole game";
		  msg.reply(infomsg);
		}

		if (myMsg.indexOf("<@" + bot.user.id + "> help") == 0) {
		msg.reply("This bot was created by Ezio and only works locally at the moment. Drop him a DM if you need something <3");
		}

		if (myMsg.indexOf("<@" + bot.user.id + "> clear") == 0) {
		  userList = [];
		  counter = 0;
		  currentPlayer = 0;
		msg.reply("List got cleared!");
		}
	});
	//Msg comes in end
	
bot.login(token);
