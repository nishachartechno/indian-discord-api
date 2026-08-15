const axios = require("axios");
const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Discord Meta fetch logic
app.get("/api/guild/:id", async (req, res) => {
    const guildId = req.params.id;
    const token = process.env.DISCORD_TOKEN;

    if (!token) {
        return res.status(500).json({ error: "Bot token not configured on server." });
    }

    try {
        const response = await axios.get(`https://discord.com/api/v10/guilds/${guildId}?with_counts=true`, {
            headers: { Authorization: `Bot ${token}` }
        });
        const data = response.data;
        res.json({
            guildId: data.id,
            name: data.name,
            iconUrl: data.icon ? `https://cdn.discordapp.com/icons/${data.id}/${data.icon}.png` : null,
            memberCount: data.approximate_member_count || 0
        });
    } catch (error) {
        console.error("Discord API Error:", error.response ? error.response.data : error.message);
        res.status(404).json({ error: "Discord server not found." });
    }
});

// Health check for Render
app.get("/", (req, res) => res.send("Discord API is running!"));

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
