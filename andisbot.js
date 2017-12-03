var Discord = require("discord.js");
var request = require("request");
var fs = require('fs');


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

function loadMemes() {
	var location = __dirname + "/memes";
	console.log(location);
}

function readTextFile(file) {
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                return allText = rawFile.responseText;
            }
        }
    }
    rawFile.send(null);
}

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

//mode: 0 = truth, 1 = dare. Maybe I will also build in Players Choice at some point
function TorDFunctionality(userList, currentPlayer, mode){
	var askerName, playerName, msg;
	
	if(currentPlayer == 0) askerName = userList[userList.length -1];
	else askerName = userList[currentPlayer -1];
	
	playerName = userList[currentPlayer];
	
	if(currentPlayer >= userList.length) msg = "End of round! Use the Shuffle command to start another round!";
	else if(mode == 0){
		msg = "Truth was called! Player " + playerName + 
			" wants to get a Question! Player " + askerName + " please ask the other player a Question!";
	}
	else {
		msg = "Dare was called! Player " + playerName + 
			" wants to get a Dare! Player " + askerName + " please give the other player a Dare!";
	}
	
	return msg;
}

//returns -1 if the user is not in the list, or the index of the user in the list
function isUserInList(user){
	var output = -1;
	for(var i = 0; i < userList.length; i++){
		if(userList[i] == user) output = i;
	}
	return output;
}

//Bot Token
var token = fs.readFileSync("token.txt", "utf8");
//Total number of players
var counter = 0;
//Current Player
var currentPlayer = 0;
//List of all players
var userList = [];

bot.on("ready", function(msg) {
	console.log("TorD Bot is online! Bot logged in under the name of " + bot.user.username + " and the user ID of " + bot.user.id);
	})
	//loadMemes();
	
	//Msg comes in
	bot.on("message", function(msg) {

		var oldOGMsg = msg.content;
		var myMsg = oldOGMsg.toLowerCase();
		var author = msg.author;
		var outMsg = "";
		

		if (myMsg.indexOf("<@" + bot.user.id + "> truth") == 0) {
			console.log("Truth was called");
			
			if(currentPlayer == userList.length){
				outMsg = "this round has ended. please use the shuffle command!";
			}
			else if(author !== userList[currentPlayer]){
				outMsg = "it is not your turn. " + userList[currentPlayer] + " has to call Truth or Dare."
			}
			else{
				outMsg = TorDFunctionality(userList, currentPlayer, 0)
				currentPlayer++;
			}
			
			msg.reply(outMsg);
		}

		if (myMsg.indexOf("<@" + bot.user.id + "> dare") == 0) {
			console.log("Dare was called");
			
			if(currentPlayer == userList.length){
				outMsg = "this round has ended. please use the shuffle command!";
			}
			else if(author !== userList[currentPlayer]){
				outMsg = "it is not your turn. " + userList[currentPlayer] + " has to call Truth or Dare."
			}
			else{
				outMsg = TorDFunctionality(userList, currentPlayer, 1)
				currentPlayer++;
			}
			
			msg.reply(outMsg);
		}
		
		if (myMsg.indexOf("<@" + bot.user.id + "> join") == 0) {
			console.log("Join was called");
			
			var index = isUserInList(author);
			if(index == -1){
				userList[counter] = author;
				counter++;
				outMsg = "you joined the game!"
			}
			else{
				outMsg = "you are on the list already!"
			}
			msg.reply(outMsg);
		}

		if (myMsg.indexOf("<@" + bot.user.id + "> leave") == 0) {
			console.log("Leave was called");
			
			var index = isUserInList(author);
			if(index == -1){
				outMsg = "you are not on the list!";
			}
			else{
				var filtered = userList.filter(function(el) {
					return el !== author;
				});
				userList = filtered;
				counter--;
			
				outMsg = "you left the game!"
			}
			msg.reply(outMsg);
		}

		if (myMsg.indexOf("<@" + bot.user.id + "> list") == 0) {
			console.log("List was called");
			
			outMsg = "--- Current user list ---\n";
			for(var i = 0; i < userList.length; i++){
				if((i) === currentPlayer){
					outMsg += "--> ";
				}
				outMsg += (i+1) + ": " + userList[i] + "\n";
			}
			outMsg += "--- To randomize use the command shuffle! The player with --> is the current player ---";
			
			msg.reply(outMsg);
		}

		if (myMsg.indexOf("<@" + bot.user.id + "> shuffle") == 0) {
			console.log("Shuffle was called");
			
			if(currentPlayer != userList.length){
				outMsg = "the round is not over yet!";
			}
			else {
				userList = shuffle(userList);
				currentPlayer = 0;
				
				outMsg = "The list was shuffled.\n" +
					"--- Current user list ---\n";
				for(var i = 0; i < userList.length; i++){
					if((i) === currentPlayer){
						outMsg += "--> ";
					}
					outMsg += (i+1) + ": " + userList[i] + "\n";
				}
				outMsg += "--- To randomize use the command shuffle! The player with --> is the current player ---";
			}
			
			msg.reply(outMsg);
		}

		if (myMsg.indexOf("<@" + bot.user.id + "> info") == 0) {
			console.log("Info was called");
			
			outMsg = "Available Commands:\n" +
			"Info: Show the information message.\n" +
			"Help: Show the help message.\n" +
			"List: Shows the current list of people.\n" +
			"Join: The player enters the game.\n" +
			"Leave: The player leaves the game.\n" +
			"Truth: The player chooses Truth.\n" +
			"Dare: The player chooses Dare.\n" +
			"Shuffle: Shuffles the list randomly. Use this at the end of the round.\n" +
			"Clear: Only use this if you want to end the whole game.";
			
			msg.reply(outMsg);
		}

		if (myMsg.indexOf("<@" + bot.user.id + "> help") == 0) {
			console.log("Help was called");
			
			msg.reply("This bot was created by Ezio#2364 and only works locally at the moment. This means that the bot is offline normally. " + 
				"But there are some events on servers already.");
				
		}

		if (myMsg.indexOf("<@" + bot.user.id + "> clear") == 0) {
			console.log("Clear was called");
			
			userList = [];
			counter = 0;
			currentPlayer = 0;
			outMsg = "List got cleared!";
			
			msg.reply(outMsg);
		}
	});
	//Msg comes in end
	
bot.login(token);
