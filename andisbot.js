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
//var token = ""


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

bot.on("ready", function(msg) {
	console.log("TorD Bot is online master! Bot logged in under the name of " + bot.user.username + " and the user ID of " + bot.user.id);
	})
	
	//Msg comes in start
	bot.on("message", function(msg) {

		var oldOGMsg = msg.content;
		var myMsg = msg.content.toLowerCase();

		if (myMsg.indexOf("<@" + bot.user.id + "> truth") == 0) {
			console.log("Truth was called");
			var askerName, playerName, newMsg;
			
			if(currentPlayer == 0) askerName = userList[userList.length -1];
			else askerName = userList[currentPlayer -1];
			
			playerName = userList[currentPlayer];
			
			if(currentPlayer >= userList.length) newMsg = "End of round! Use the Shuffle command to start another round!";
			else{
				newMsg = "You called Truth! Player " + playerName + 
				" wants to get a Question! Player " + askerName + " please ask him a Question!";
				currentPlayer++;
			}
			
			msg.reply(newMsg);
		}

		if (myMsg.indexOf("<@" + bot.user.id + "> dare") == 0) {
			console.log("Dare was called");
			var askerName, playerName, newMsg;
			
			if(currentPlayer == 0) askerName = userList[userList.length -1];
			else askerName = userList[currentPlayer -1];
			
			playerName = userList[currentPlayer];
			
			if(currentPlayer >= userList.length) newMsg = "End of round! Use the Shuffle command to start another round!";
			else{
				newMsg = "You called Dare! Player " + playerName + 
				" wants to get a Dare! Player " + askerName + " please give the other player something to do!";
				currentPlayer++;
			}
			
			msg.reply(newMsg);
		}
		
		if (myMsg.indexOf("<@" + bot.user.id + "> join") == 0) {
		  console.log("Join was called");
		  userList[counter] = oldOGMsg.split(" ")[2];
		  
		  counter++;
		  //currentPlayer++;
		  msg.reply(userList[counter-1] + " joined the game!");
		}

		if (myMsg.indexOf("<@" + bot.user.id + "> leave") == 0) {
			console.log("Leave was called");
			var playername = myMsg.split(" ")[2];
			counter--;
			var resultObject = search(userList, playername);

			var filtered = userList.filter(function(el) {
			return el !== resultObject;
			});

			userList = filtered;
			msg.reply(playername + " left the game!");
		}

		if (myMsg.indexOf("<@" + bot.user.id + "> show") == 0) {
			console.log("Show was called");
			
			var reply = "--- Current user list ---" + "\n";

			for(var i = 0; i < userList.length; i++){
				if((i) === currentPlayer){
					reply = reply + "--> ";
				}
				reply = reply + (i+1) + ": " + userList[i] + "\n";
			}

			reply = reply + "--- To randomize use the command shuffle! The player with --> is the current player ---";
			msg.reply(reply);

		}

		if (myMsg.indexOf("<@" + bot.user.id + "> shuffle") == 0) {
			console.log("Shuffle was called");
			userList = shuffle(userList);
			currentPlayer = 0;
			var reply = "The list was shuffled. Use the Show Command to view the current list!";
			msg.reply(reply);
		}

		if (myMsg.indexOf("<@" + bot.user.id + "> info") == 0) {
			console.log("Info was called");
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
			console.log("Help was called");
			msg.reply("This bot was created by Ezio#2364 and only works locally at the moment. Drop him a DM if you need something");
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
