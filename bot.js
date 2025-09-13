const { Client, GatewayIntentBits, Events, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const { findBestSolution, getRelevantSolutions } = require('./knowledge-base.js');

// Track which ticket channels the bot has already responded in
const respondedTickets = new Set();

// Use environment variable for token in production, fallback to config.json for local development
let config;
try {
    config = require('./config.json');
} catch (error) {
    config = {};
}

// Create a new client instance
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessageReactions
    ]
});

client.once(Events.ClientReady, readyClient => {
    console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

// Helper functions
const supportRoles = ['Support', 'Moderator', 'Server Manager'];
function isTicketChannel(channel) {
    return channel.name && (
        channel.name.startsWith('ticket-') ||
        channel.name.startsWith('closed-')
    );
}
function getUserRoles(message) {
    return message.member?.roles.cache.map(role => role.name) || [];
}
function isSupport(message) {
    const roles = getUserRoles(message);
    return roles.some(role => supportRoles.includes(role));
}
function sendDropdown(message) {
    const categoryMenu = new ActionRowBuilder().addComponents(
        new StringSelectMenuBuilder()
            .setCustomId('help_category')
            .setPlaceholder('Select all categories that match your issue...')
            .setMinValues(1)
            .setMaxValues(5)
            .addOptions([
                { label: 'RPCS3 Setup Issues', value: 'rpcs3' },
                { label: 'Savefile/Gamesave Issues', value: 'savefiles' },
                { label: 'Graphics/Savefile Issues', value: 'graphics' },
                { label: 'Black Screen Issues', value: 'blackscreen' },
                { label: 'Native Menu Issues', value: 'nativemenu' },
                { label: 'Mod Installation Issues', value: 'mods' },
                { label: 'High FPS and Render Issues', value: 'performance' },
                { label: 'General Help', value: 'general' },
                { label: "CFSS/CUSTOM TEXTURES", value: 'cfss' },
                { label: 'Skate 2 Maps New San Van', value: 'maps' },
                { label: 'Graphics Quality Issues', value: 'quality' },
                { label: 'Updates and DLC', value: 'updates' },
                { label: 'File Extraction Issues', value: 'extraction' },
                { label: 'Game Performance Issues', value: 'gameperformance' },
                { label: 'Physics and Clipping Issues', value: 'physics' },
                { label: 'Display Issues', value: 'display' },
                { label: 'RPCS3 Software Detection', value: 'software' },
                { label: 'RPCS3 Crashes and Stability', value: 'crashes' },
                { label: 'Game Crashes After Loading', value: 'gamecrashes' }
            ])
    );
    return message.reply({
        content: '👇 Please select the category that matches your issue:',
        components: [categoryMenu]
    });
}

// Main message handler
client.on(Events.MessageCreate, async message => {
    if (message.author.bot) return;

    // Basic commands
    if (message.content === '!ping') return message.reply('Pong! 🏓');
    if (message.content === '!hello') return message.reply(`Hello ${message.author.username}! 👋 Welcome to the Skate 3 modding community!`);
    if (message.content === '!serverinfo') {
        const guild = message.guild;
        const embed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle('Server Information')
            .addFields(
                { name: 'Server Name', value: guild.name, inline: true },
                { name: 'Total Members', value: guild.memberCount.toString(), inline: true },
                { name: 'Created On', value: guild.createdAt.toDateString(), inline: true }
            )
            .setTimestamp();
        return message.reply({ embeds: [embed] });
    }
    if (message.content === '!help') {
        const helpEmbed = new EmbedBuilder()
            .setColor(0x00AE86)
            .setTitle('🤖 Skate 3 Support Bot Commands')
            .setDescription('I can help with common Skate 3 modding issues!')
            .addFields(
                { name: '🔧 Automatic Support', value: 'Just describe your issue and I\'ll try to help! Keywords like "rpcs3", "graphics", "mods", etc. trigger automatic responses.', inline: false },
                { name: '!ask [question]', value: 'Search for specific solutions (e.g., `!ask rpcs3 black screen`)', inline: false },
                { name: '!test [question]', value: '🧪 **Support Only** - Test bot responses with detailed info (e.g., `!test catastrophic failure`)', inline: false },
                { name: '!support', value: 'Force trigger the support system', inline: false },
                { name: '!ping', value: 'Test if the bot is working', inline: false },
                { name: '!hello', value: 'Get a friendly greeting', inline: false },
                { name: '!serverinfo', value: 'Show server information', inline: false }
            )
            .addFields({
                name: '📚 Quick Links',
                value: '• <#807348308451655730> (Beginners Guide) - Complete setup\n• <#998366877233463386> (FAQ) - Common questions\n• <#947211395747966996> (Official Mods) - Verified mods\n• <#764082333623386123> (Tutorials) - Additional guides\n• <#726599125122023456> (Downloads) - Files and tools\n• Tag @Support for human help',
                inline: false
            })
            .setFooter({ text: 'Skate 3 Modding Support Bot' })
            .setTimestamp();
        return message.reply({ embeds: [helpEmbed] });
    }

    // Only respond in ticket channels or DMs
    if (!isTicketChannel(message.channel) && message.channel.type !== 'DM') return;

    // --- Support: !test command ---
    if (message.content.startsWith('!test ')) {
        if (!isSupport(message)) {
            return message.reply('❌ Only support team members can use the test command.');
        }
        if (!isTicketChannel(message.channel)) return;

        const testQuestion = message.content.slice(6);
        const bestSolution = findBestSolution(testQuestion);
        if (bestSolution && bestSolution.confidence > 0.3) {
            const embed = new EmbedBuilder()
                .setColor(0x00FF00)
                .setTitle('💡 Coach Frank Says')
                .setDescription(bestSolution.solution)
                .setFooter({ text: 'Tag @Support if you need more help!' });
            await message.reply({ embeds: [embed] });
        } else {
            await message.reply('❓ No solutions found. Try rephrasing your question or tag @Support for human assistance.');
        }
        await sendDropdown(message);
        return;
    }

    // --- Ignore support team messages in ticket channels (except !test) ---
    if (isTicketChannel(message.channel) && isSupport(message)) return;

    // --- Only send dropdown once per ticket channel for regular users ---
    if (isTicketChannel(message.channel) && !respondedTickets.has(message.channel.id)) {
        await sendDropdown(message);
        respondedTickets.add(message.channel.id);
        return;
    }
});

// Handle interaction create events (for select menus)
client.on('interactionCreate', async interaction => {
    if (interaction.isStringSelectMenu() && interaction.customId === 'help_category') {
        const selectedCategories = interaction.values;
        const { knowledgeBase } = require('./knowledge-base.js');
        let response = '';
        for (const category of selectedCategories) {
            const categoryData = knowledgeBase[category];
            if (categoryData && categoryData.solutions && categoryData.solutions.length > 0) {
                const bestSolution = categoryData.solutions.reduce((a, b) => a.confidence > b.confidence ? a : b);
                response += `**${category.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}**\n${bestSolution.solution}\n\n`;
            }
        }
        if (response.length === 0) {
            response = 'Sorry, no help available for your selections.';
        }
        await interaction.reply({ content: response, ephemeral: true });
    }
});

// Handle reaction events
client.on(Events.MessageReactionAdd, async (reaction, user) => {
    if (user.bot) return;
    if (reaction.message.author.id !== client.user.id) return;
    if (!isTicketChannel(reaction.message.channel)) return;
    if (reaction.emoji.name === '❌') {
        await reaction.message.channel.send(`❌ This solution didn't help ${user}. @Support, please assist!`);
    } else if (reaction.emoji.name === '✅') {
        await reaction.message.channel.send(`✅ Great! Glad that helped ${user}! If you need more help, please tag @Support.`);
    }
});

// Error handling
client.on(Events.Error, error => {
    console.error('Discord client error:', error);
});
process.on('unhandledRejection', error => {
    console.error('Unhandled promise rejection:', error);
});

// Log in to Discord with your client's token (environment variable or config file)
const token = process.env.DISCORD_TOKEN || config.token;
client.login(token);