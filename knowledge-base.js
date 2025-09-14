// Knowledge base extracted from ticket patterns
const knowledgeBase = {
    // RPCS3 Setup Issues
    rpcs3: {
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
        solutions: [
            {
                issue: "High FPS mod causing render/clipping issues",
                solution: "The high FPS mod reduces render distance which causes clipping in buildings and terrain. You can use SmokeyFE's enhanced native menu that includes render distance options to compensate for this.\n\n**Download Smokey's Comp Menu:** https://drive.google.com/file/d/1ZkIkJ-1uHfpLC8ZmgYFysRsFKVynwuUW/view?usp=sharing",
                confidence: 0.9
            }
        ]
    },

    // General Help
    general: {
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
        solutions: [
            {
                issue: "Catastrophic failure when extracting Skate 3 files",
                solution: "If you get a 'catastrophic failure' error when trying to extract Skate 3 files:\n\n**Primary Solution:**\n• Use **7-Zip** or **WinRAR** to extract the file instead of Windows' built-in extractor\n• Download 7-Zip: https://www.7-zip.org/\n• Download WinRAR: https://www.win-rar.com/\n\n**Important:** Your antivirus software might interfere with the extraction process. If 7-Zip/WinRAR still doesn't work:\n• Temporarily disable your antivirus while extracting\n• Add the file/folder to your antivirus exceptions list\n• Some antivirus programs are more aggressive - try disabling real-time protection during extraction\n\n**Other possible causes:**\n• Your hard drive might be too low on space - free up some disk space and try again\n• The download may be corrupted - try re-downloading the file",
                confidence: 0.99
            }
        ]
    },

    // Game Performance Issues (RPCS3 Only)
    gameperformance: {
        solutions: [
            {
                issue: "Game is in slow motion (RPCS3 Only)",
                solution: "**Note: This fix is only for RPCS3 users.**\n\nTo fix slow motion gameplay:\n\n1. **Close the game**\n2. **Right-click the game** on the game list\n3. **Click \"Create or change custom configuration\"** from default settings\n4. **Go to the CPU tab**\n5. **Enable SPU loop detection**\n6. **Click Save**\n7. **Boot the game**\n\nThis should resolve the slow motion issue.",
                confidence: 0.95
            }
        ]
    },

    // Physics and Clipping Issues
    physics: {
        solutions: [
            {
                issue: "Skater keeps falling through the floor",
                solution: "To fix clipping/falling through floor issues:\n\n1. **Close the game**\n2. **Right-click the game** on the game list\n3. **Click \"Create or change custom configuration\"** from default settings\n4. **Go to the CPU tab**\n5. **Change the XFloat to \"Accurate XFloat\"**\n6. **Click Save**\n7. **Boot the game**\n\nThis will fix physics issues causing you to fall through the floor.",
                confidence: 0.95
            }
        ]
    },

    // Display Issues
    display: {
        solutions: [
            {
                issue: "Billboards and edit skater preview pictures are blacked out",
                solution: "To fix black billboards and skater preview pictures:\n\n1. **Close the game**\n2. **Right-click the game** on the game list\n3. **Click \"Create or change custom configuration\"** from default settings\n4. **Go to the GPU tab**\n5. **Enable \"Write Color Buffers\"**\n6. **Click Save**\n7. **Boot the game**\n\nThis will restore the missing billboard and preview images.",
                confidence: 0.95
            }
        ]
    },

    // RPCS3 Software Detection
    software: {
        solutions: [
            {
                issue: "RPCS3 says it could not find any software",
                solution: "If RPCS3 can't find any software, get the custom RPCS3 build that comes with Skate 3 pre-installed:\n\nhttps://www.mediafire.com/file/ng36nd3ndxa8yhp/RPCS3_BLUS_Build.7z/file\n\nThis build has been tested and includes everything you need.",
                confidence: 0.98
            }
        ]
    },

    // RPCS3 Crashes and Stability
    crashes: {
        solutions: [
            {
                issue: "RPCS3 crashes or freezes - CPU requirements",
                solution: "**CPU Requirements:** The RPCS3 developers recommend a strong 6-core CPU or greater for optimal gameplay. If you have an old CPU, then RPCS3 crashing is expected because it's not powerful enough.",
                confidence: 0.9
            },
            {
                issue: "RPCS3 crashes during compiling with powerful CPU",
                solution: "If your CPU is powerful but RPCS3 crashes specifically during the compiling part, you need to **lower your CPU core voltage**.\n\nGo to https://chatgpt.com or google.com and ask: \"How do I lower my core CPU voltage?\" For the best results and help, use ChatGPT.",
                confidence: 0.85
            },
            {
                issue: "RPCS3 crashes on Windows 11 with OneDrive",
                solution: "If you're on **Windows 11**, make sure **OneDrive** is not part of your RPCS3's path line. Move the RPCS3 folder to another hard drive or location that doesn't go through OneDrive.\n\nGo to https://chatgpt.com and ask: \"Can I remove OneDrive from Windows 11 without issues and without losing my files that are in a OneDrive path?\" Follow the instructions carefully and **DO NOT RUSH**.",
                confidence: 0.9
            }
        ]
    },

    // Game Crashes After Loading
    gamecrashes: {
        solutions: [
            {
                issue: "Game loads but crashes after a few seconds or minutes",
                solution: "If your CPU and GPU are good enough for RPCS3 but the game crashes quickly, use the custom RPCS3 build:\n\nhttps://www.mediafire.com/file/ng36nd3ndxa8yhp/RPCS3_BLUS_Build.7z/file\n\nIf the custom build also crashes fast after playing, ask for further assistance in the support channels.",
                confidence: 0.9
            }
        ]
    },

    // Audio Issues
    audio: {
        solutions: [
            {
                issue: "RPCS3 audio issues like popping, crackling, or stuttering",
                solution: "To fix RPCS3 audio issues like popping, crackling, or stuttering, you can adjust the audio buffering settings by reducing the slider to 20ms or less in the Configuration > Audio menu. You can also try changing the audio output driver to Cubeb or try different SPU settings, such as adjusting the SPU thread count or disabling SPU loop detection, to better suit your system's CPU and the specific game you are playing.\n\n**Adjusting Audio Settings:**\n1. Open RPCS3 and go to the main menu\n2. Click on Configuration\n3. Select the Audio tab\n4. Reduce the buffering slider from 100ms to 20ms or less\n5. Click Apply and then Save\n\nIf this does not work then you will need a better CPU.",
                confidence: 0.95
            }
        ]
    },

    // Skate 3 Online Help
    online: {
        solutions: [
            {
                issue: "Skate 3 online help and multiplayer support",
                solution: "Please join this Discord server and ask for help: https://discord.gg/CbmnY23vYu",
                confidence: 0.95
            }
        ]
    },

    // Increase Native FPS
    fps: {
        solutions: [
            {
                issue: "How to increase native FPS in RPCS3",
                solution: "To increase your native FPS in RPCS3:\n\n**Step 1:** Close the game completely\n\n**Step 2:** Right-click on Skate 3 in your game list\n\n**Step 3:** Click \"Create or change custom configuration\" from default settings\n\n**Step 4:** Go to the **GPU** tab\n\n**Step 5:** Turn **Frame Limit** to **Off**\n\n**Step 6:** Go to the **Advanced Settings** tab\n\n**Step 7:** Turn your **VBlank Frequency** up (increase the value)\n\n**Step 8:** Click **Save**\n\n**Step 9:** Boot the game\n\nThis will increase your native FPS for better performance!",
                confidence: 0.95
            }
        ]
    }
};

// Function to find the best matching solution (simplified for !test command)
function findBestSolution(userMessage) {
    const message = userMessage.toLowerCase();
    
    // Simple keyword matching for common terms
    const keywordMap = {
        'rpcs3': 'rpcs3',
        'setup': 'rpcs3',
        'install': 'rpcs3',
        'download': 'rpcs3',
        'savefile': 'savefiles',
        'skate.p': 'savefiles',
        'graphics': 'graphics',
        'blank deck': 'graphics',
        'black screen': 'blackscreen',
        'native menu': 'nativemenu',
        's3m': 'nativemenu',
        'mods': 'mods',
        'performance': 'performance',
        'fps': 'performance',
        'cfss': 'cfss',
        'maps': 'maps',
        'quality': 'quality',
        'blurry': 'quality',
        'update': 'updates',
        'dlc': 'updates',
        'extract': 'extraction',
        'catastrophic': 'extraction',
        'slow motion': 'gameperformance',
        'physics': 'physics',
        'clipping': 'physics',
        'display': 'display',
        'billboards': 'display',
        'software': 'software',
        'crashes': 'crashes',
        'crash': 'crashes',
        'audio': 'audio',
        'sound': 'audio',
        'online': 'online',
        'multiplayer': 'online',
        'increase fps': 'fps',
        'native fps': 'fps'
    };
    
    // Find matching category
    for (const [keyword, category] of Object.entries(keywordMap)) {
        if (message.includes(keyword)) {
            const categoryData = knowledgeBase[category];
            if (categoryData && categoryData.solutions && categoryData.solutions.length > 0) {
                const bestSolution = categoryData.solutions.reduce((a, b) => a.confidence > b.confidence ? a : b);
                return {
                    category,
                    solution: bestSolution.solution,
                    confidence: bestSolution.confidence,
                    issue: bestSolution.issue
                };
            }
        }
    }
    
    return null;
}

module.exports = {
    knowledgeBase,
    findBestSolution
};
