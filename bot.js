const { Client, GatewayIntentBits, Events, EmbedBuilder } = require('discord.js');
const { findBestSolution, getRelevantSolutions } = require('./knowledge-base.js');

// Track which ticket channels the bot has already responded in
const respondedTickets = new Set();

// Use environment variable for token in production, fallback to config.json for local development
let config;
try {
    config = require('./config.json');
} catch (error) {
    config = {}; // Empty config if file doesn't exist in production
}

// Create a new client instance
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

// When the client is ready, run this code (only once)
client.once(Events.ClientReady, readyClient => {
    console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

// Listen for messages
client.on(Events.MessageCreate, async message => {
    // Ignore messages from bots
    if (message.author.bot) return;

    const content = message.content.toLowerCase();

    // Admin Commands (for ticket management)
    if (message.content.startsWith('!admin')) {
        // Check if user has admin permissions
        if (!message.member?.permissions.has('Administrator')) {
            return message.reply('❌ You need administrator permissions to use admin commands.');
        }

        if (message.content === '!admin close') {
            message.reply('🎫 Ticket closed by admin.');
        }
        return;
    }

    // Simple ping command
    if (message.content === '!ping') {
        message.reply('Pong! 🏓');
    }

    // Hello command
    if (message.content === '!hello') {
        message.reply(`Hello ${message.author.username}! 👋 Welcome to the Skate 3 modding community!`);
    }

    // Server info command
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
        
        message.reply({ embeds: [embed] });
    }

    // Check if we're in a ticket channel (ONLY respond in ticket channels)
    const isTicketChannel = message.channel.name && (
        message.channel.name.startsWith('ticket-') || 
        message.channel.name.startsWith('closed-')
    );

    // ONLY respond in ticket channels or DMs, ignore all other channels
    if (!isTicketChannel && message.channel.type !== 'DM') {
        return;
    }

    // Check if we've already responded in this ticket channel
    if (isTicketChannel && respondedTickets.has(message.channel.id)) {
        return; // Don't respond again in this ticket
    }

    // AI-Powered Support System - Only works in ticket channels now
    const shouldRespond = 
        content.includes('help') || content.includes('issue') || content.includes('problem') || 
        content.includes('rpcs3') || content.includes('mod') || content.includes('graphics') ||
        content.includes('black screen') || content.includes('crash') || content.includes('fps') ||
        content.includes('savefile') || content.includes('save file') || content.includes('skate.p') || 
        content.includes('gamesave') || content.includes('savedata') || content.includes('rpcn') || content.includes('setup') ||
        content.includes('download') || content.includes('install') || content.includes('update') ||
        content.includes('freeze') || content.includes('loading') || content.includes('won\'t') ||
        content.includes('wont') || content.includes('can\'t') || content.includes('cant') ||
        content.includes('doesn\'t') || content.includes('doesnt') || content.includes('not working') ||
        content.includes('native menu') || content.includes('native') || content.includes('menu') ||
        content.includes('cfss') || content.includes('skate shop') || content.includes('coach frank') ||
        content.includes('textures') || content.includes('texture') ||
        content.includes('maps') || content.includes('skate 2') || content.includes('san van') ||
        content.includes('xenia') || content.includes('xbox') || content.includes('dlc') ||
        content.includes('error') || message.mentions.has(client.user) || message.content.startsWith('!support') ||
        isTicketChannel; // Always try to help in ticket channels

    if (shouldRespond) {
        
        // Try to find a solution
        const bestSolution = findBestSolution(message.content);
        
        // Lower confidence threshold for ticket channels to be more helpful
        const confidenceThreshold = isTicketChannel ? 0.3 : 0.5;
        
        if (bestSolution && bestSolution.confidence > confidenceThreshold) {
            // Add a small delay in ticket channels to feel more natural
            if (isTicketChannel) {
                await new Promise(resolve => setTimeout(resolve, 2000)); // 2 second delay
            }

            const embed = new EmbedBuilder()
                .setColor(0x00FF00)
                .setTitle('💡 Coach Frank Says')
                .setDescription(bestSolution.solution)
                .setFooter({ 
                    text: isTicketChannel ? 
                        `If this doesn't solve it, tag @Support for human help!` :
                        `If this doesn't help, please provide more details!`
                })
                .setTimestamp();

            await message.reply({ embeds: [embed] });
            
            // Add helpful reactions
            await message.react('✅'); // Mark as helpful
            await message.react('❌'); // Mark as not helpful
            
            // Mark this ticket as responded to
            if (isTicketChannel) {
                respondedTickets.add(message.channel.id);
            }
            
        } else {
            // Provide general help if no specific solution found - only in ticket channels
            if (isTicketChannel) {
                const embed = new EmbedBuilder()
                    .setColor(0x3498db)
                    .setDescription('👋 Hey! I noticed you might need help. Check out these resources while you wait for support:\n\n<#807348308451655730> - **Beginners Guide** for setup help\n<#998366877233463386> - **FAQ** for common questions and latest fixes\n\nTag @Support if you need human assistance!')
                    .setTimestamp();

                await message.reply({ embeds: [embed] });
                
                // Mark this ticket as responded to
                if (isTicketChannel) {
                    respondedTickets.add(message.channel.id);
                }
            }
        }
        return;
    }

    // Manual support command
    if (message.content.startsWith('!ask ')) {
        const question = message.content.slice(5); // Remove '!ask '
        const solutions = getRelevantSolutions(question, 2);
        
        if (solutions.length > 0) {
            const topSolution = solutions[0];
            const embed = new EmbedBuilder()
                .setColor(0x00FF00)
                .setTitle('💡 Coach Frank Says')
                .setDescription(topSolution.solution)
                .setFooter({ text: 'Tag @Support if you need more help!' });

            await message.reply({ embeds: [embed] });
        } else {
            message.reply('❓ No solutions found. Try rephrasing your question or tag @Support for human assistance.');
        }
        return;
    }

    // Help command
    if (message.content === '!help') {
        const helpEmbed = new EmbedBuilder()
            .setColor(0x00AE86)
            .setTitle('🤖 Skate 3 Support Bot Commands')
            .setDescription('I can help with common Skate 3 modding issues!')
            .addFields(
                { name: '🔧 Automatic Support', value: 'Just describe your issue and I\'ll try to help! Keywords like "rpcs3", "graphics", "mods", etc. trigger automatic responses.', inline: false },
                { name: '!ask [question]', value: 'Search for specific solutions (e.g., `!ask rpcs3 black screen`)', inline: false },
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

        message.reply({ embeds: [helpEmbed] });
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
