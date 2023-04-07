require('dotenv/config');



const {Client, IntentsBitField,Events, ActivityType } = require("discord.js");
const {Configuration, OpenAIApi} = require("openai");

const client = new Client({
    intents : [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ],
}) ;


/* client.on('ready', () => {
    console.log("bot ready!")
    setInterval(async ()=>{
        let textList = ['Welcome to UltimateX',"Use ai-chat to chat with me",'Dev by dudu49#3517']
        var text = textList[Math.floor(Math.random() * textList.length)];
        client.user.setActivity("Hello" , { type: 'WATCHING' })
    },60000) // milliseconds
}); */

client.once(Events.ClientReady, c => {
    
	console.log(`Ready! Logged in as ${c.user.tag}`);

   setInterval(async ()=>{
    let textList = ['Welcome to UltimateX',"Use ai-chat to chat with me",'Dev by dudu49#3517']
    var text = textList[Math.floor(Math.random(0,textList.length))];
    c.user.setPresence({
		activities: [
		  { name: text /* `${client.guilds.cache.size} Servers!` */, type: ActivityType.Watching, setInterval: 5000},
		],
		status: "online",
	  });
},5000)
 
});

const configuration = new Configuration({
    apiKey: process.env.API_KEY,
})
const openai = new OpenAIApi(configuration);

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;
    if (message.channel.id !== process.env.CHANNEL_ID) return;
    if (message.content.startsWith('!')) return;

    let conversationLog = [{ role: "system", content: 'You are a friendly chatbot.'}];

    await message.channel.sendTyping();

    let prevMessages = await message.channel.messages.fetch({ limit: 15});
    prevMessages.reverse();

    prevMessages.forEach((msg) => {
        if (message.content.startsWith('!')) return;
        if (msg.author.id !== client.user.id && message.author.bot) return;
        if (msg.author.id !== message.author.id) return;

        conversationLog.push({
            role: "user",
            content: msg.content,
        })
     });

     const result = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: conversationLog,
     });
try{
    if(result.data.choices[0].message.content.length < 2000){
        message.reply(result.data.choices[0].message)
    }
    else{
        message.reply("Content is to big! i need nitro to send it :joy:")
    }

}catch (error) {
console.log(error)
};
   
});

client.login(process.env.TOKEN);


