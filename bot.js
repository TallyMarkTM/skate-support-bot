const { Client, GatewayIntentBits, Events, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ButtonBuilder } = require('discord.js');
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
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessageReactions
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

    // Debug command to check if bot is seeing messages
    if (message.content === '!debug') {
        const userRoles = message.member?.roles.cache.map(role => role.name) || [];
        const isTicket = message.channel.name && (
            message.channel.name.startsWith('ticket-') || 
            message.channel.name.startsWith('closed-')
        );
        
        message.reply(`**Debug Info:**\n**Channel:** ${message.channel.name}\n**Is Ticket:** ${isTicket}\n**Your Roles:** ${userRoles.join(', ')}\n**Message:** "${message.content}"`);
    }

    // Flow debug command for support to trace why bot isn't responding
    if (message.content === '!flowdebug') {
        const supportRoles = ['Support', 'Moderator', 'Server Manager'];
        const userRoles = message.member?.roles.cache.map(role => role.name) || [];
        const hasSupport = userRoles.some(roleName => supportRoles.includes(roleName));
        
        if (!hasSupport) {
            return message.reply('❌ Only support team members can use flow debug.');
        }

        const isTicket = message.channel.name && (
            message.channel.name.startsWith('ticket-') || 
            message.channel.name.startsWith('closed-')
        );
        const alreadyResponded = isTicket && respondedTickets.has(message.channel.id);
        
        // Get recent messages to see who asked the question
        const recentMessages = await message.channel.messages.fetch({ limit: 10 });
        const lastUserMessage = [...recentMessages.values()].find(msg => 
            !msg.author.bot && 
            !msg.content.startsWith('!') && 
            msg.id !== message.id
        );
        
        let lastUserInfo = 'No recent user message found';
        if (lastUserMessage) {
            const lastUserRoles = lastUserMessage.member?.roles.cache.map(role => role.name) || [];
            const lastUserIsSupport = lastUserRoles.some(roleName => supportRoles.includes(roleName));
            lastUserInfo = `User: ${lastUserMessage.author.username}, Roles: [${lastUserRoles.join(', ')}], Is Support: ${lastUserIsSupport}, Message: "${lastUserMessage.content}"`;
        }
        
        message.reply(`**Flow Debug:**
**Channel:** ${message.channel.name}
**Is Ticket Channel:** ${isTicket}
**Already Responded:** ${alreadyResponded}
**Channel Type:** ${message.channel.type}
**Responded Tickets Set Size:** ${respondedTickets.size}
**Last User Message:** ${lastUserInfo}`);
    }

    // Test command for support team to test bot responses (moved up to bypass restrictions)
    if (message.content.startsWith('!test ')) {
        // Check if user has support permissions
        const supportRoles = ['Support', 'Moderator', 'Server Manager'];
        const userRoles = message.member?.roles.cache.map(role => role.name) || [];
        const hasSupport = userRoles.some(roleName => supportRoles.includes(roleName));
        
        if (!hasSupport) {
            return message.reply(`❌ Only support team members can use the test command.\n\n**Your roles:** ${userRoles.length > 0 ? userRoles.join(', ') : 'None'}\n**Required roles:** ${supportRoles.join(', ')}`);
        }

        const testQuestion = message.content.slice(6); // Remove '!test '
        const bestSolution = findBestSolution(testQuestion);
        
        if (bestSolution && bestSolution.confidence > 0.3) {
            const embed = new EmbedBuilder()
                .setColor(0xFF9900) // Orange color to distinguish test responses
                .setTitle('🧪 Coach Frank Says (TEST MODE)')
                .setDescription(bestSolution.solution)
                .addFields(
                    { name: 'Confidence Score', value: `${(bestSolution.confidence * 100).toFixed(1)}%`, inline: true },
                    { name: 'Category', value: bestSolution.category, inline: true },
                    { name: 'Issue Type', value: bestSolution.issue, inline: false }
                )
                .setFooter({ text: 'This is a test response - not sent to a real user' })
                .setTimestamp();

            const reply = await message.reply(bestSolution.solution);
            await reply.react('✅');
            await reply.react('❌');
        } else {
            const embed = new EmbedBuilder()
                .setColor(0xFF0000)
                .setTitle('🧪 Test Result: No Match Found')
                .setDescription(`No solution found for: "${testQuestion}"`)
                .addFields({
                    name: 'Confidence Threshold',
                    value: 'Minimum confidence needed: 30%',
                    inline: false
                })
                .setFooter({ text: 'Consider adding this to the knowledge base if it\'s a common question' });

            const reply = await message.reply({ embeds: [embed] });
            await reply.react('✅');
            await reply.react('❌');
        }

        // Only show dropdown in ticket-6181
        if (message.channel.name === 'ticket-6181') {
            const categoryMenu = new ActionRowBuilder().addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId('help_category')
                    .setPlaceholder('Select all categories that match your issue...')
                    .setMinValues(1) // Minimum selections required
                    .setMaxValues(5) // Maximum selections allowed (adjust as needed)
                    .addOptions([
                        { label: 'RPCS3 Setup Issues', value: 'rpcs3' },
                        { label: 'Savefile/Gamesave Issues', value: 'savefiles' },
                        { label: 'Graphics/Savefile Issues', value: 'graphics' },
                        { label: 'Black Screen Issues', value: 'blackscreen' },
                        { label: 'Native Menu Issues', value: 'nativemenu' },
                        { label: 'Mod Installation Issues', value: 'mods' },
                        { label: 'High FPS and Render Issues', value: 'performance' },
                        { label: 'General Help', value: 'general' },
                        { label: "CFSS (Coach Frank's Skate Shop) Issues", value: 'cfss' },
                        { label: 'Maps and Mods', value: 'maps' },
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

            const submitRow = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId('submit_help')
                    .setLabel('✅ Submit')
                    .setStyle('Success')
            );

            await message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(0xFF0000)
                        .setTitle('🚨 Select ALL issues that apply and click Submit!')
                        .setDescription('**Check all that match your problem, then hit Submit below.**')
                ],
                components: [categoryMenu, submitRow]
            });
            return; // Prevents the rest of the !test logic from running
        }
        return;
    }

    // KB debug command for support to view relevance scoring and matches
    if (message.content.startsWith('!kbtest ')) {
        const supportRoles = ['Support', 'Moderator', 'Server Manager'];
        const userRoles = message.member?.roles.cache.map(role => role.name) || [];
        const hasSupport = userRoles.some(roleName => supportRoles.includes(roleName));

        if (!hasSupport) {
            return message.reply('❌ Only support team members can use the KB debug command.');
        }

        const query = message.content.slice(8).trim();
        const results = getRelevantSolutions(query, 5);

        if (results.length === 0) {
            return message.reply('No matching KB entries found for that query.');
        }

        const fields = results.map((res, idx) => ({
            name: `${idx + 1}. ${res.issue} (${res.category})`,
            value: `Score: ${res.keywordScore.toFixed(2)} • Exact: ${res.exactMatches} • Partial: ${res.partialMatches} • Confidence: ${res.confidence}`
        }));

        const embed = new EmbedBuilder()
            .setTitle('KB Debug: Relevance Results')
            .setColor(0xFFA500)
            .setDescription(`Query: "${query}"`)
            .addFields(fields)
            .setTimestamp();

        await message.reply({ embeds: [embed] });
        return;
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

    // Only block bot responses if the current message author is a support member
    // (Don't respond to support team questions, but DO respond to regular users even if support is present)
    if (isTicketChannel) {
        const supportRoles = ['Support', 'Moderator', 'Server Manager'];
        const userRoles = message.member?.roles.cache.map(role => role.name) || [];
        const messageAuthorIsSupport = userRoles.some(roleName => supportRoles.includes(roleName));
        
        // Don't respond to questions FROM support team members (but do respond to regular users)
        if (messageAuthorIsSupport) {
            return; // Support team members don't need bot help
        }
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
        content.includes('blurry') || content.includes('looks bad') || content.includes('bad quality') || content.includes('resolution') ||
        content.includes('xenia') || content.includes('xbox') || content.includes('dlc') ||
        content.includes('error') || message.mentions.has(client.user) || message.content.startsWith('!support') ||
        isTicketChannel; // Always try to help in ticket channels

    if (shouldRespond) {
        
        // Try to find the best solution
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

            const reply = await message.reply({ embeds: [embed] });
            await reply.react('✅');
            await reply.react('❌');

            // Send follow-up message after a short delay
            setTimeout(async () => {
                try {
                    await message.channel.send("If this solution doesn't help, please ping @Support for human assistance! 🙋‍♂️");
                } catch (error) {
                    console.error('Error sending follow-up message:', error);
                }
            }, 3000); // 3 second delay
            
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

        message.reply({ embeds: [helpEmbed] });
    }

    // Menu command for ticket-6181
    if (message.content === '!menu') {
        // Only allow in ticket-6181
        if (message.channel.name !== 'ticket-6181') return;

        const categoryMenu = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder()
                .setCustomId('help_category')
                .setPlaceholder('Select all categories that match your issue...')
                .setMinValues(1) // Minimum selections required
                .setMaxValues(5) // Maximum selections allowed (adjust as needed)
                .addOptions([
                    { label: 'RPCS3 Setup Issues', value: 'rpcs3' },
                    { label: 'Savefile/Gamesave Issues', value: 'savefiles' },
                    { label: 'Graphics/Savefile Issues', value: 'graphics' },
                    { label: 'Black Screen Issues', value: 'blackscreen' },
                    { label: 'Native Menu Issues', value: 'nativemenu' },
                    { label: 'Mod Installation Issues', value: 'mods' },
                    { label: 'High FPS and Render Issues', value: 'performance' },
                    { label: 'General Help', value: 'general' },
                    { label: "CFSS (Coach Frank's Skate Shop) Issues", value: 'cfss' },
                    { label: 'Maps and Mods', value: 'maps' },
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

        await message.reply({
            content: 'What do you need help with?',
            components: [categoryMenu]
        });
    }
});

// Handle interaction create events (for select menus)
client.on('interactionCreate', async interaction => {
    if (interaction.isStringSelectMenu() && interaction.customId === 'help_category') {
        // Get all selected categories
        const selectedCategories = interaction.values;
        const { knowledgeBase } = require('./knowledge-base.js');

        // Gather solutions for each selected category
        let response = '';
        for (const category of selectedCategories) {
            const categoryData = knowledgeBase[category];
            if (categoryData && categoryData.solutions && categoryData.solutions.length > 0) {
                // Get the highest confidence solution for each category
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
    console.log(`Reaction detected: ${reaction.emoji.name} by ${user.username}`);
    
    // Ignore bot reactions
    if (user.bot) return;
    
    // Only handle reactions on bot messages
    if (reaction.message.author.id !== client.user.id) return;
    
    console.log(`Reaction on bot message: ${reaction.emoji.name}`);
    
    // Check if it's in a ticket channel
    const isTicketChannel = reaction.message.channel.name && (
        reaction.message.channel.name.startsWith('ticket-') || 
        reaction.message.channel.name.startsWith('closed-')
    );
    
    if (!isTicketChannel) return;
    
    if (reaction.emoji.name === '❌') {
        // User clicked X - ping @Support
        try {
            await reaction.message.channel.send(`❌ This solution didn't help ${user}. @Support, please assist!`);
        } catch (error) {
            console.error('Error sending support ping:', error);
        }
    } else if (reaction.emoji.name === '✅') {
        // User clicked check mark - just acknowledge, don't allow re-responding
        try {
            const followUpMessage = await reaction.message.channel.send(`✅ Great! Glad that helped ${user}! If you need more help, please tag @Support.`);
        } catch (error) {
            console.error('Error sending follow-up message:', error);
        }
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
