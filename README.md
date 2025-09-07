# Skate 3 Modding Support Bot

An AI-powered Discord bot built specifically for Skate 3 modding communities. This bot can automatically detect and respond to common support questions based on real ticket data, helping reduce support team burnout.

## Features

### 🤖 AI-Powered Support System
- **Automatic Issue Detection** - Bot automatically detects when users need help based on keywords
- **Smart Solutions** - Provides relevant solutions based on a knowledge base of real support tickets
- **Confidence Scoring** - Shows how confident the bot is in its suggested solution
- **Multiple Solution Search** - Can find and rank multiple relevant solutions

### 🔧 Support Commands
- **!ask [question]** - Search for specific solutions (e.g., `!ask rpcs3 black screen`)
- **!support** - Force trigger the support system
- **Automatic Detection** - Just mention keywords like "rpcs3", "graphics", "mods", "black screen", etc.

### 📋 General Commands
- **!ping** - Test if the bot is working
- **!hello** - Get a friendly greeting
- **!serverinfo** - Shows server information
- **!help** - Shows all available commands

### 👑 Admin Commands
- **!admin close** - Close tickets (requires Administrator permission)

### 🧠 Knowledge Base Categories
The bot can help with:
- **RPCS3 Setup Issues** - Download, installation, and configuration problems
- **Graphics Problems** - Missing board graphics, savefile issues, RPCN connection
- **Black Screen Issues** - Game launch problems, crashes, freezing
- **Mod Installation** - Big file unpacking, native menu, content folder issues
- **Performance Issues** - High FPS mod problems, render distance issues
- **Game Updates** - Installing PKG updates for BLUS/BLES versions

## Setup Instructions

### 1. Create a Discord Application

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click "New Application" and give it a name
3. Go to the "Bot" section in the left sidebar
4. Click "Add Bot"
5. Copy the bot token (keep this secret!)

### 2. Get Your Bot's Client ID

1. In the Discord Developer Portal, go to the "General Information" section
2. Copy the "Application ID" (this is your Client ID)

### 3. Invite Your Bot to a Server

1. Go to the "OAuth2" → "URL Generator" section
2. Select "bot" in scopes
3. Select the permissions your bot needs (at minimum: "Send Messages", "Read Messages", "Read Message History")
4. Copy the generated URL and open it in your browser
5. Select a server to add the bot to

### 4. Configure the Bot

1. Open `config.json`
2. Replace `YOUR_BOT_TOKEN_HERE` with your actual bot token
3. Replace `YOUR_CLIENT_ID_HERE` with your application's Client ID
4. (Optional) Replace `YOUR_GUILD_ID_HERE` with your server's ID if needed

### 5. Install Dependencies

```bash
npm install
```

### 6. Run the Bot

```bash
npm start
```

Or for development with auto-restart:

```bash
npm run dev
```

## Important Notes

- **Never share your bot token publicly!** It's like a password for your bot
- The `config.json` file is excluded from git to keep your token safe
- Make sure your bot has the necessary permissions in the server

## Adding New Commands

To add new commands, edit the `bot.js` file and add new `if` statements in the message event handler:

```javascript
if (message.content === '!yourcommand') {
    message.reply('Your response here!');
}
```

## Troubleshooting

- **Bot doesn't respond**: Check if the bot is online and has permission to read/send messages
- **"Missing Permissions" error**: Make sure the bot has the required permissions in the server
- **"Invalid Token" error**: Double-check that you copied the token correctly in `config.json`
