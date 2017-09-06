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

// var token = 'TOKEN HERE'; 
var token = 'MzUyMjYyOTUzMTU3OTE4NzIx.DIfB5w.BEXI7N5Dziq--5fL2izRR5uQr48';


//var truths = "TRUTHS API";
//var dares = "DARES API";
var truths = "http://dobij5.com/truths.php";
var dares = "http://dobij5.com/dares.php";
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

function search(nameKey, myArray){
    for (var i=0; i < myArray.length; i++) {
        if (myArray[i] === nameKey) {
            return myArray[i];
        }
    }
}

var join = "To invite this bot click https://discordapp.com/oauth2/authorize?&client_id=174237165042008075&scope=bot and select your server !"
var help = "Truth and Dare is a popular game. How it's played is a player asks a Truth or a dare and gets from another person. To play it on the server call the bot with it's username and Truth next to it for Truth and Dare for a dare."
var info = "The TruthAndDareBot is made by @UnknownDeveloper that power this bot. The bot is licensed under the MIT License. For More information visit the GitHub page at this page https://github.com/TheRealUnknownDeveloper/TruthAndDareBot-Discord-Edition/"

bot.on("ready", function(msg) {
  console.log("Woop! Bot logged in under the name of " + bot.user.username + " and the user ID of " + bot.user.id)
})
bot.on("message", function(msg) {
	//message comes in
	
  var myMsg = msg.content.toLowerCase();
  
  if (myMsg.indexOf("<@" + bot.user.id + "> truth") == 0) {
	var newMsg = "You called Truth! Player #" + 
	(currentPlayer+1) + " wants to get a Question!";
	currentPlayer++;
	msg.reply(newMsg);
  }
  
  if (myMsg.indexOf("<@" + bot.user.id + "> dare") == 0) {
	var newMsg = "You called Dare! Player #" + 
	(currentPlayer+1) + " wants to get a Dare!";
	currentPlayer++;
	msg.reply(newMsg);
  }
  
  if (myMsg.indexOf("<@" + bot.user.id + "> queue") == 0) {
	  console.log(myMsg);
	  counter++;
	  currentPlayer++;
	  userList[counter] = myMsg.split(" ")[2];
	  //list = list + counter + " - " + myMsg.split(" ")[2] + "\n";
	  msg.reply(userList[counter] + " joined the game!");
  }
  
  if (myMsg.indexOf("<@" + bot.user.id + "> leave") == 0) {
	  console.log(myMsg);
	  counter--;
	  var resultObject = search(myMsg.split(" ")[2], userList);
	  
		var filtered = userList.filter(function(el) {
			return el !== resultObject;
		});
	  
	  userList = filtered;
	  //list = list + counter + " - " + myMsg.split(" ")[2] + "\n";
	  msg.reply(userList[counter] + " joined the game!");
  }
  
  if (myMsg.indexOf("<@" + bot.user.id + "> show") == 0) {
	  var reply = "--- Current userlist ---" + "\n";
	  
	  for(var i = 1; i < userList.length; i++){
		  if(userList[i] == currentPlayer){
			  reply = reply + "--> ";
		  }
		  reply = reply + i + ": " + userList[i] + "\n";
	  }
	  
	  reply = reply + "--- To randomize use the command shuffle! The player with --> is the current player ---";
	  msg.reply(reply);
	
  }
  
  if (myMsg.indexOf("<@" + bot.user.id + "> shuffle") == 0) {
	  userList = shuffle(userList)
	  var reply = "The list was shuffled. Use the Show Command to view the current list!";
	  msg.reply(reply);
	
  }
  
  if (myMsg.indexOf("<@" + bot.user.id + "> info") == 0) {
	  var infomsg =
	  "Available Commands:\n" +
	  "Info and Help: Name says it all\n" + 
	  "Show: Shows the current list of people playing\n" + 
	  "Queue NAME: the person NAME enters the game!\n" +
	  "Leave NAME: this person leaves the list\n"+
	  "Truth: The player chooses Truth\n"+
	  "Dare: The player chooses Dare"+
	  "\nClear: Only use this if you want to end the whole game";
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
bot.login(token);