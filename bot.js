const { Client, GatewayIntentBits, Events, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const { findBestSolution, getRelevantSolutions } = require('./knowledge-base.js');
const fs = require('fs');
const path = require('path');

// Track which ticket channels the bot has already responded in
const respondedTickets = new Set();

// Track active interactions and timeouts
const activeInteractions = new Map(); // channelId -> { dropdownMessage, timeout, userInteracted }
const feedbackMessages = new Map(); // messageId -> { originalMessage, user }

// Volume-related variables removed - no persistent storage needed

// Stats functions removed - no file system access needed

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
function sendDropdown(message, isResend = false) {
    
    const categoryMenu = new ActionRowBuilder().addComponents(
        new StringSelectMenuBuilder()
            .setCustomId('help_category')
            .setPlaceholder('Select the category that matches your issue...')
            .setMinValues(1)
            .setMaxValues(1)
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
                { label: 'Game Performance Issues (RPCS3 Only)', value: 'gameperformance' },
                { label: 'Physics and Clipping Issues', value: 'physics' },
                { label: 'Display Issues', value: 'display' },
                { label: 'RPCS3 Software Detection', value: 'software' },
                { label: 'RPCS3 Crashes and Stability', value: 'crashes' },
                { label: 'Game Crashes After Loading', value: 'gamecrashes' },
                { label: 'Audio Issues', value: 'audio' },
                { label: 'Skate 3 Online Help', value: 'online' },
                { label: 'Force Higher FPS', value: 'fps' }
            ])
    );
    
    const content = isResend ? 
        `👇 ${message.author} Please select the category that matches your issue:` : 
        '👇 Please select the category that matches your issue:';
    
    return message.reply({
        content: content,
        components: [categoryMenu]
    });
}

function setupDropdownTimeout(channelId, dropdownMessage, user) {
    // Clear any existing timeout for this channel
    const existingInteraction = activeInteractions.get(channelId);
    if (existingInteraction && existingInteraction.timeout) {
        clearTimeout(existingInteraction.timeout);
    }
    
    // Set up new timeout
    const timeout = setTimeout(async () => {
        const interaction = activeInteractions.get(channelId);
        // Double-check that user hasn't interacted and the interaction still exists
        if (interaction && !interaction.userInteracted && interaction.timeout === timeout) {
            try {
                // Send a reminder message with @user mention
                await interaction.dropdownMessage.channel.send(`👆 ${user} Please interact with the dropdown menu above to get help with your issue.`);
                
                // Clear the timeout since we've sent the reminder
                activeInteractions.set(channelId, {
                    dropdownMessage: interaction.dropdownMessage,
                    timeout: null,
                    userInteracted: false
                });
            } catch (error) {
                console.error('Error handling dropdown timeout:', error);
            }
        }
    }, 20000); // 20 seconds
    
    // Store the interaction
    activeInteractions.set(channelId, {
        dropdownMessage,
        timeout,
        userInteracted: false
    });
}

function checkForSupportMention(message) {
    const content = message.content.toLowerCase();
    const supportRoles = ['Support', 'Moderator', 'Server Manager'];
    
    // Check for @support mention
    if (content.includes('@support')) {
        return true;
    }
    
    // Check for support role mentions
    const userRoles = getUserRoles(message);
    return userRoles.some(role => supportRoles.includes(role));
}

// Main message handler
client.on(Events.MessageCreate, async message => {
    if (message.author.bot) return;

    // Basic commands
    if (message.content === '!ping') return message.reply('Pong! 🏓');
    if (message.content === '!hello') return message.reply(`Hello ${message.author.username}! 👋 Welcome to the Skate 3 modding community!`);
    if (message.content === '!testdropdown') {
        // Send dropdown for testing
        const dropdownMessage = await sendDropdown(message);
        setupDropdownTimeout(message.channel.id, dropdownMessage, message.author);
        return;
    }
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
    // All coinflip commands removed - no file system access needed
    if (message.content === '!help') {
        const helpEmbed = new EmbedBuilder()
            .setColor(0x00AE86)
            .setTitle('🤖 Skate 3 Support Bot Commands')
            .setDescription('I can help with common Skate 3 modding issues!')
            .addFields(
                { name: '🔧 Automatic Support', value: 'Just describe your issue and I\'ll try to help! Keywords like "rpcs3", "graphics", "mods", etc. trigger automatic responses.', inline: false },
                { name: '!ask [question]', value: 'Search for specific solutions (e.g., `!ask rpcs3 black screen`)', inline: false },
                { name: '!test [question]', value: '🧪 **Support Only** - Test bot responses with detailed info (e.g., `!test catastrophic failure`)', inline: false },
                { name: '!testdropdown', value: '🧪 **Testing Command** - Send dropdown for testing interactions', inline: false },
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

    // Check if user mentioned support - if so, stop responding
    if (checkForSupportMention(message)) {
        // Clear any active interactions for this channel
        const existingInteraction = activeInteractions.get(message.channel.id);
        if (existingInteraction) {
            if (existingInteraction.timeout) {
                clearTimeout(existingInteraction.timeout);
            }
            activeInteractions.delete(message.channel.id);
        }
        return; // Stop responding
    }

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
        const dropdownMessage = await sendDropdown(message);
        setupDropdownTimeout(message.channel.id, dropdownMessage, message.author);
        return;
    }


    // --- Allow support team to test in their own tickets ---
    if (isTicketChannel(message.channel) && isSupport(message)) {
        // Check if this is a support member's own ticket (for testing)
        // Method 1: Check if channel topic contains the user's ID
        const channelTopic = message.channel.topic || '';
        const isOwnTicket = channelTopic.includes(message.author.id);
        
        // Method 2: Check if channel name contains the user's ID (fallback)
        const channelName = message.channel.name || '';
        const isOwnTicketByName = channelName.includes(message.author.id);
        
        if (isOwnTicket || isOwnTicketByName) {
            // This is a support member's own ticket - allow them to test
            const dropdownMessage = await sendDropdown(message);
            setupDropdownTimeout(message.channel.id, dropdownMessage, message.author);
            return;
        }
        // Otherwise ignore support team messages in other tickets
        return;
    }

    // --- Only send dropdown once per ticket channel for regular users ---
    if (isTicketChannel(message.channel) && !respondedTickets.has(message.channel.id)) {
        const dropdownMessage = await sendDropdown(message);
        setupDropdownTimeout(message.channel.id, dropdownMessage, message.author);
        respondedTickets.add(message.channel.id);
        return;
    }
});

// Handle interaction create events (for select menus and buttons)
client.on('interactionCreate', async interaction => {
    
    if (interaction.isStringSelectMenu() && interaction.customId === 'help_category') {
        // Clear any existing timeout since user has interacted
        const channelId = interaction.channel.id;
        const existingInteraction = activeInteractions.get(channelId);
        if (existingInteraction && existingInteraction.timeout) {
            clearTimeout(existingInteraction.timeout);
            activeInteractions.set(channelId, {
                dropdownMessage: existingInteraction.dropdownMessage,
                timeout: null,
                userInteracted: true
            });
        }
        
        // Process the selected categories immediately
        const selectedCategories = interaction.values;
        const { knowledgeBase } = require('./knowledge-base.js');
        let response = '';
        for (const category of selectedCategories) {
            const categoryData = knowledgeBase[category];
            if (categoryData && categoryData.solutions && categoryData.solutions.length > 0) {
                // Show all solutions for the category, sorted by confidence (highest first)
                const sortedSolutions = categoryData.solutions.sort((a, b) => b.confidence - a.confidence);
                response += `**${category.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}**\n`;
                for (const solution of sortedSolutions) {
                    response += `${solution.solution}\n\n`;
                }
            }
        }
        if (response.length === 0) {
            response = 'Sorry, no help available for your selections.';
        }
        
        // Send the solution
        const solutionMessage = await interaction.reply({ 
            content: response, 
            ephemeral: false 
        });
        
        // Add feedback reactions
        if (solutionMessage && !solutionMessage.ephemeral) {
            const message = await interaction.fetchReply();
            await message.react('✅');
            await message.react('❌');
            
            // Store feedback message info
            feedbackMessages.set(message.id, {
                originalMessage: message,
                user: interaction.user
            });
        }
        
        // Don't clear activeInteractions yet - keep it for feedback system
    }
});

// Handle reaction events
client.on(Events.MessageReactionAdd, async (reaction, user) => {
    console.log('Reaction added:', reaction.emoji.name, 'by', user.username, 'on message', reaction.message.id);
    
    if (user.bot) return;
    if (reaction.message.author.id !== client.user.id) return;
    
    console.log('Reaction is on bot message, checking feedback data');
    
    // Check if this is a feedback message
    const feedbackData = feedbackMessages.get(reaction.message.id);
    console.log('Feedback data:', feedbackData);
    if (feedbackData && feedbackData.user.id === user.id) {
        if (reaction.emoji.name === '✅') {
            // User confirmed the solution was helpful
            await reaction.message.channel.send(`✅ Great! Glad that helped ${user}! If you need more help, please tag @Support.`);
            
            // Clean up feedback tracking
            feedbackMessages.delete(reaction.message.id);
            
            // Clear any active interactions for this channel
            const existingInteraction = activeInteractions.get(reaction.message.channel.id);
            if (existingInteraction) {
                if (existingInteraction.timeout) {
                    clearTimeout(existingInteraction.timeout);
                }
                activeInteractions.delete(reaction.message.channel.id);
            }
            
        } else if (reaction.emoji.name === '❌') {
            // User said the solution didn't help - send new dropdown
            try {
                const channel = reaction.message.channel;
                
                // Delete the old dropdown message if it exists
                const existingInteraction = activeInteractions.get(channel.id);
                console.log('Negative feedback - existingInteraction:', existingInteraction);
                if (existingInteraction && existingInteraction.dropdownMessage) {
                    console.log('Deleting old dropdown message');
                    await existingInteraction.dropdownMessage.delete().catch(() => {});
                } else {
                    console.log('No existing interaction or dropdown message found');
                }
                
                // Delete the solution message that got the ❌ reaction
                await reaction.message.delete().catch(() => {});
                
                // Send new dropdown with confirm button using the channel directly
                const categoryMenu = new ActionRowBuilder().addComponents(
                    new StringSelectMenuBuilder()
                        .setCustomId('help_category')
                        .setPlaceholder('Select the category that matches your issue...')
                        .setMinValues(1)
                        .setMaxValues(1)
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
                            { label: 'Game Performance Issues (RPCS3 Only)', value: 'gameperformance' },
                            { label: 'Physics and Clipping Issues', value: 'physics' },
                            { label: 'Display Issues', value: 'display' },
                            { label: 'RPCS3 Software Detection', value: 'software' },
                            { label: 'RPCS3 Crashes and Stability', value: 'crashes' },
                            { label: 'Game Crashes After Loading', value: 'gamecrashes' },
                            { label: 'Audio Issues', value: 'audio' },
                            { label: 'Skate 3 Online Help', value: 'online' },
                            { label: 'Increase Native FPS', value: 'fps' }
                        ])
                );
                
                const newDropdown = await channel.send({
                    content: '👇 Please select the category that matches your issue:',
                    components: [categoryMenu]
                });
                
                setupDropdownTimeout(channel.id, newDropdown, user);
                
                await channel.send(`❌ This solution didn't help ${user}. Please try selecting a different category above.`);
                
                // Clean up feedback tracking
                feedbackMessages.delete(reaction.message.id);
                
                // Clear active interactions
                activeInteractions.delete(reaction.message.channel.id);
            } catch (error) {
                console.error('Error handling negative feedback:', error);
            }
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