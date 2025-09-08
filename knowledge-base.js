// Knowledge base extracted from ticket patterns
const knowledgeBase = {
    // RPCS3 Setup Issues
    rpcs3: {
        keywords: ['rpcs3', 'rpcs', 'setup', 'download', 'install', 'emulator', 'how do i', 'how to setup', 'setting up'],
        solutions: [
            {
                issue: "RPCS3 download/setup issues",
                solution: "Follow the complete guide in <#807348308451655730> (Beginners Guide). This covers everything from downloading RPCS3 to proper setup.",
                confidence: 0.9
            },
            {
                issue: "RPCS3 version compatibility",
                solution: "Make sure you're using a compatible RPCS3 version. Check <#807348308451655730> (Beginners Guide) for the recommended version.",
                confidence: 0.8
            }
        ]
    },

    // Savefile/Gamesave Issues
    savefiles: {
        keywords: ['skate.p', 'savefile', 'save file', 'gamesave', 'where is skate.p', 'install savefile', 'savedata', 'save location'],
        solutions: [
            {
                issue: "Skate.p location and savefile installation",
                solution: "**Skate.p Location:** `\\dev_hdd0\\home\\00000001\\savedata`\n\n**Installation Guide:** https://docs.google.com/document/d/1RasRan4QzcogBZtr5GnkKiG6WS_ZQQOh/edit\n\nThis covers installing gamesaves for all platforms.",
                confidence: 0.95
            }
        ]
    },

    // Graphics/Savefile Issues
    graphics: {
        keywords: ['graphics', 'blank deck', 'board graphics', 'missing graphics', 'rpcn', 'deck is blank', 'no graphics', 'graphics are missing'],
        solutions: [
            {
                issue: "Missing board graphics after savefile replacement",
                solution: "You need to connect to RPCN first:\n1. Enable RPCN in RPCS3 network settings\n2. Connect to RPCN in your network settings\n3. If graphics still don't show, delete your _install folder: `RPCS3\\dev_hdd0\\game\\BLUS30464_INSTALL`",
                confidence: 0.95
            },
            {
                issue: "Graphics not loading properly",
                solution: "Try connecting to RPCN and deleting the _install folder if the issue persists.",
                confidence: 0.8
            }
        ]
    },

    // Black Screen Issues
    blackscreen: {
        keywords: ['black screen', 'blackscreen', 'won\'t load', 'freezes', 'crash', 'loading'],
        solutions: [
            {
                issue: "Black screen on game launch",
                solution: "This is often caused by:\n1. RPCN connection issues - try disabling RPCN temporarily\n2. Corrupted install folder - delete `RPCS3\\dev_hdd0\\game\\BLUS30464_INSTALL`\n3. Incompatible RPCS3 version\n4. Missing game updates - make sure you have the latest game update installed",
                confidence: 0.9
            }
        ]
    },

    // Native Menu Issues
    nativemenu: {
        keywords: ['native menu', 'nativemenu', 'native', 'menu', 'wont work', 'won\'t work', 'doesn\'t work', 'not working', 'menu not working', 'menu wont open', 'menu won\'t open', 'scanning for aob', 'scanning aob', 'stuck on scanning', 'aobs'],
        solutions: [
            {
                issue: "Native menu stuck on 'scanning for AoB's'",
                solution: "This is a common issue! Download this fix: https://www.mediafire.com/file/ng36nd3ndxa8yhp/RPCS3_BLUS_Build.7z/file\n\n**Important:** This RPCS3 build comes with Skate 3 and all DLC already installed and has been tested to work with native menu. Just get this build - **DO NOT UPDATE IT** as updating will break the mods.\n\nIf you need setup help, follow <#807348308451655730> (Beginners Guide).",
                confidence: 0.95
            },
            {
                issue: "Native menu says 'please update your game'",
                solution: "You need to follow <#807348308451655730> (Beginners Guide) exactly. If you manually updated your game or used a different installation method, you'll need to delete everything RPCS3-related and start fresh with our guide.",
                confidence: 0.9
            },
            {
                issue: "Native menu quit working after it was working before",
                solution: "Check <#998366877233463386> (📣-news) - this usually happens after RPCS3 updates. The news channel will have the latest fixes. Remember: **DO NOT UPDATE** your RPCS3 build as updating will break the mods.",
                confidence: 0.85
            }
        ]
    },

    // Mod Installation Issues
    mods: {
        keywords: ['mods', 'big files', 'quickbms', 'big gui', 'unpacking', 'content folder', 'mod installation'],
        solutions: [
            {
                issue: "Mod installation problems",
                solution: "For mod installation:\n1. Use Big GUI Tool (not QuickBMS) for unpacking .big files\n2. Always backup your original content folder first\n3. Check <#947211395747966996> (Official Mods) for verified mods\n4. If game won't start after mods, restore original .big files and try again",
                confidence: 0.85
            },
            {
                issue: "Game won't start after installing mods",
                solution: "Restore your original content .big files and make sure the game runs fine first. Then use Big GUI Tool to properly install mods one at a time.",
                confidence: 0.9
            }
        ]
    },

    // High FPS and Render Issues
    performance: {
        keywords: ['high fps', 'render distance', 'fps mod', 'clipping', 'render issues', 'performance'],
        solutions: [
            {
                issue: "High FPS mod causing render/clipping issues",
                solution: "The high FPS mod reduces render distance which causes clipping in buildings and terrain. You can use SmokeyFE's enhanced native menu that includes render distance options to compensate for this.",
                confidence: 0.9
            }
        ]
    },

    // General Help
    general: {
        keywords: ['help', 'guide', 'tutorial', 'how to', 'setup', 'beginner'],
        solutions: [
            {
                issue: "General help needed",
                solution: "Check out these helpful channels:\n<#807348308451655730> (Beginners Guide) - Complete setup tutorial\n<#998366877233463386> (FAQ) - Common questions and latest fixes\n<#947211395747966996> (Official Mods) - Verified mods and tools\n<#764082333623386123> (Tutorials) - Additional tutorials\n<#726599125122023456> (Downloads) - Game files and tools\n\n**Game Updates:** https://drive.google.com/drive/folders/1qv6p9MNn3Nw76shC7E8LCtuxyj9JXVLz",
                confidence: 0.7
            }
        ]
    },

    // CFSS Issues
    cfss: {
        keywords: ['cfss', 'coach franks skate shop', 'skate shop', 'how do i use cfss', 'cfss help', 'coach frank skate shop', 'cfss textures', 'make textures', 'cfss files', 'texture tutorial'],
        solutions: [
            {
                issue: "CFSS (Coach Frank's Skate Shop) help",
                solution: "For CFSS (Coach Frank's Skate Shop) help, check these resources:\n\n**Discord Guides:**\n• FAQ: https://discord.com/channels/725753042087182406/998366877233463386/1406568130318307432\n• Additional Guide: https://discord.com/channels/725753042087182406/854455211035459616/1407139941992890470\n\n**YouTube Tutorials:**\n• How to make CFSS textures: https://www.youtube.com/watch?v=U8KN6qek97Q\n• How to use CFSS files: https://www.youtube.com/watch?v=83jknFbNOk8\n\nThese cover everything you need to know about using Coach Frank's Skate Shop!",
                confidence: 0.95
            }
        ]
    },

    // Maps and Mods
    maps: {
        keywords: ['skate 2 maps', 'skate 2', 'new san van', 'san van', 'maps', 'custom maps', 'map mod', 'install maps'],
        solutions: [
            {
                issue: "Skate 2 maps and New San Van mod installation",
                solution: "For installing Skate 2 maps and the New San Van mod, check this guide: https://discord.com/channels/725753042087182406/1078574501383643166/1354402773944242206\n\nThis covers everything you need to install custom maps including the popular New San Van mod.",
                confidence: 0.95
            }
        ]
    },

    // Graphics Quality Issues
    quality: {
        keywords: ['blurry', 'blury', 'game is blurry', 'looks bad', 'doesnt look good', 'doesn\'t look good', 'bad quality', 'low quality', 'pixelated', 'resolution', 'graphics quality', 'game quality', 'looks terrible', 'looks awful'],
        solutions: [
            {
                issue: "Game is blurry or doesn't look good",
                solution: "To improve graphics quality:\n\n1. **Close the game**\n2. **Right-click the game** on the game list\n3. **Click \"Create or change custom configuration\"** from default settings\n4. **Go to the GPU tab**\n5. **Increase resolution scale to 200 or 300 percent**\n6. **Click Save**\n7. **Boot the game**\n\nThis will significantly improve the visual quality!",
                confidence: 0.95
            }
        ]
    },

    // Updates and DLC (Universal)
    updates: {
        keywords: ['update', 'updates', 'dlc', 'version', 'blus', 'bles', 'game update', 'pkg', 'how to update', 'update my game', 'game version', 'xenia', 'xenia update', 'xenia dlc', 'xbox', 'xbox 360', 'console', 'get updates', 'get dlc'],
        solutions: [
            {
                issue: "Game updates and DLC for all platforms",
                solution: "For updates and DLC on any platform (RPCS3, Xenia, or console), check this comprehensive guide: https://discord.com/channels/725753042087182406/764082333623386123/1363643991458975825\n\nThis covers everything you need regardless of your platform.",
                confidence: 0.95
            }
        ]
    },

    // File Extraction Issues
    extraction: {
        keywords: ['catastrophic failure', 'extract', 'extraction', 'skate 3 file', 'can\'t extract', 'cannot extract', 'won\'t extract', 'wont extract', 'extraction failed', 'failed to extract', 'error extracting', 'zip error', 'rar error', 'archive error'],
        solutions: [
            {
                issue: "Catastrophic failure when extracting Skate 3 files",
                solution: "If you get a 'catastrophic failure' error when trying to extract Skate 3 files:\n\n**Primary Solution:**\n• Use **7-Zip** or **WinRAR** to extract the file instead of Windows' built-in extractor\n\n**If 7-Zip/WinRAR doesn't work either:**\n• Your antivirus might be blocking the file - temporarily disable it or add an exception\n• Your hard drive might be too low on space - free up some disk space and try again\n\nDownload 7-Zip: https://www.7-zip.org/\nDownload WinRAR: https://www.win-rar.com/",
                confidence: 0.95
            }
        ]
    }
};

// Function to find the best matching solution
function findBestSolution(userMessage) {
    const message = userMessage.toLowerCase();
    let bestMatch = null;
    let highestScore = 0;

    // Check each category
    for (const [category, data] of Object.entries(knowledgeBase)) {
        let score = 0;
        
        // Count keyword matches
        for (const keyword of data.keywords) {
            if (message.includes(keyword.toLowerCase())) {
                score += 1;
            }
        }
        
        // If we found keyword matches, check solutions
        if (score > 0) {
            for (const solution of data.solutions) {
                const totalScore = score * solution.confidence;
                if (totalScore > highestScore) {
                    highestScore = totalScore;
                    bestMatch = {
                        category,
                        solution: solution.solution,
                        confidence: solution.confidence,
                        issue: solution.issue
                    };
                }
            }
        }
    }

    return bestMatch;
}

// Function to get multiple relevant solutions
function getRelevantSolutions(userMessage, limit = 3) {
    const message = userMessage.toLowerCase();
    const solutions = [];

    for (const [category, data] of Object.entries(knowledgeBase)) {
        let score = 0;
        
        for (const keyword of data.keywords) {
            if (message.includes(keyword.toLowerCase())) {
                score += 1;
            }
        }
        
        if (score > 0) {
            for (const solution of data.solutions) {
                solutions.push({
                    category,
                    solution: solution.solution,
                    confidence: solution.confidence * score,
                    issue: solution.issue,
                    keywordMatches: score
                });
            }
        }
    }

    return solutions
        .sort((a, b) => b.confidence - a.confidence)
        .slice(0, limit);
}

module.exports = {
    knowledgeBase,
    findBestSolution,
    getRelevantSolutions
};
