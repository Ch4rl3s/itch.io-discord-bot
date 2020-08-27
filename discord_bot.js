const { Client, MessageAttachment,  MessageEmbed } = require('discord.js');
const client = new Client();
let prefix = "!"
var listenChannel;
var date = new Date();
var http = require('https');
var TOKEN = '';
var itchApiKey
var options = {
  host: 'itch.io',
  path: `/api/1/${itchApiKey}/my-games`
};
function toWords(a){
  let arr = [];
  let CurStr = ''
  for (let i = 0; i < a.length;i++){
     if (a[i] == ' '){
         arr.push(CurStr);
         CurStr = '';
         
     }
     else if (i+1 == a.length){
         CurStr= CurStr + a[i]
         arr.push(CurStr)
         }
     else{
         CurStr= CurStr + a[i];
     }
     
  }
  return arr;
 }
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  
  //if (msg.content === prefix+'setchannel'){
  //  listenChannel = msg.channel.name;
  //  msg.channel.send(`Listen channel set to ${listenChannel}`);
  //}
  //if (msg.channel.name == listenChannel && msg.content === '!testing'){
  //  msg.channel.send("Yes");
  //}
  if (msg.content === prefix+'ping') {
    msg.channel.send('Pong!');
  }
  if (msg.content === prefix+"time"){
    date = new Date();
    msg.channel.send(date.getHours()+":"+date.getMinutes());
  }
  if (msg.content === prefix+"timer"){
    msg.channel.send("Started timer for 5 seconds!")
    setTimeout(() => msg.channel.send("Timer Ended!"), 5000);
  }
  if (toWords(msg.content)[0] == '!setApiKey'){
  	itchApiKey = toWords(msg.content)[1];
  	options['path'] = `/api/1/${itchApiKey}/my-games`
  	//console.log(options['path'])
  	msg.channel.send(`API key set to ${itchApiKey}!`)
  }



if (toWords(msg.content)[0] == '!check' && itchApiKey!=null){
    let msgArr = toWords(msg.content);
   	var req = http.get(options, function(res) {
   	//console.log('STATUS: ' + res.statusCode);
   	//console.log('HEADERS: ' + JSON.stringify(res.headers));
   	//console.log('HEADERS: ' + JSON.stringify(res.headers));
   	var bodyChunks = [];
   	res.on('data', function(chunk) {
   	  bodyChunks.push(chunk);
   	}).on('end', function() {
    var body = Buffer.concat(bodyChunks);
  	let a = JSON.parse(body);
  	if (msgArr[1] == undefined){
    	msg.channel.send('no paramets given')
    }  else if (a['games'][msgArr[1]] == undefined) {
    	msg.channel.send('No game with that id!')
    } 
    	else{
    	    const embed = new MessageEmbed()
    	    .setTitle( a['games'][msgArr[1]]['title'])
    	    .setColor('#0099ff')
        	.setThumbnail(a['games'][msgArr[1]]['cover_url'])
        	.setDescription((`Downloads : ${a['games'][msgArr[1]]['downloads_count']}
Views : ${a['games'][msgArr[1]]['views_count']}
Classification : ${a['games'][msgArr[1]]['classification']}`));
        	//.setFooter('made by XdS', 'https://i.imgur.com/wSTFkRM.png');

        		msg.channel.send(embed);

      			}
      //console.log(a);
      //console.log('-----------------');
      
    		})
  		});
  	
}

if (msg.content === '!status'){
  var req = http.get(options, function(res) {
    msg.channel.send(`Itch.io status : ${res.statusCode}` + '\n' + `Server type : ${res.headers.server}`);
  });
}
if (msg.content === '!itch.io'){
  
  var req = http.get(options, function(res) {
    //console.log('STATUS: ' + res.statusCode);
   // console.log('HEADERS: ' + JSON.stringify(res.headers));
    //console.log('HEADERS: ' + JSON.stringify(res.headers));
    var bodyChunks = [];
    res.on('data', function(chunk) {
      bodyChunks.push(chunk);
    }).on('end', function() {
      var body = Buffer.concat(bodyChunks);
      let a = JSON.parse(body);
      //console.log(a);
      //console.log('-----------------');
      const embed = new MessageEmbed()
      .setTitle( a['games'][0]['title'])
      .setColor(0xff0000)
      .setThumbnail(a['games'][0]['cover_url'])
      .setDescription('Downloads : ' + a['games'][0]['downloads_count'] + '\n' + 'Views : ' + a['games'][0]['views_count']);
      msg.channel.send(embed);
      //msg.channel.send('STATUS: ' + res.statusCode);
      //msg.channel.send(res.rawHeaders);
    })
  });
}

  if (msg.content.startsWith('!kick')) {
    const user = msg.mentions.users.first();
    if (user) {
      const member = msg.guild.member(user);
      if (member) {

        member
          .kick('Optional reason that will display in the audit logs')
          .then(() => {
            msg.reply(`Successfully kicked ${user.tag}`);
          })
          .catch(err => {
            msg.reply('I was unable to kick the member');
            console.error(err);
          });
      } else {
        msg.reply("That user isn't in this guild!");
      }
    } else {
      msg.reply("You didn't mention the user to kick!");
    }
  }
});

client.login(TOKEN);

