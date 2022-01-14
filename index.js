require("dotenv").config();

const axios = require("axios").default;
const { Client, MessageEmbed, Intents } = require("discord.js");
const client = new Client({ intents: ["GUILDS", "GUILD_MESSAGES"] });
const prefix = process.env.PREFIX;

client.on("ready", () => {
  client.user.setActivity("!mmr <username>");
  console.log("I AM ONLINE");
});

client.on("messageCreate", (message) => {
  // * Check if the bot was called on propose
  if (message.author.bot) return;
  if (!message.guild) return;
  if (!message.content.startsWith(prefix)) return;
  if (!message.member) message .member = message.guild.fetchMember(message);

  // * Split the arguments and make it lowercase
  let arguments = message .content.slice(prefix.length).trim().split(/ +/g);
  let username = arguments.shift().toLowerCase();

  // * Make sure that there is a username
  if (username.length === 0) return;

  // * Fetch data from api
  axios
    .get(`https://eune.whatismymmr.com/api/v1/summoner?name=${username}`)
    .then(function (response) {
      data = response.data.ranked;
      const embed = new MessageEmbed()
        .setColor("#0099ff")
        .setTitle(username.toUpperCase())
        .setURL(`https://eune.whatismymmr.com/${username}`)
        .setDescription(
          `Top ${100 - data.percentile}% din ${
            data.closestRank
          }`
        );

      message.channel.send({ embeds: [embed] });
    })
    .catch(function (error) {
      const embed = new MessageEmbed()
        .setColor("#DF0101")
        .setTitle("Nu am găsit jucătorul!");

      message.channel.send({ embeds: [embed] });
    });
});

client.login(process.env.TOKEN);
