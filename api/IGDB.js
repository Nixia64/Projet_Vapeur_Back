const fetch = require("node-fetch");

module.exports = (app) => {
    const CLIENT_ID = process.env.IGDB_CLIENT_ID;
    const CLIENT_SECRET = process.env.IGDB_CLIENT_SECRET;

    app.get("/api/igdb/token", async (req, res) => {
        const url = `https://id.twitch.tv/oauth2/token?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&grant_type=client_credentials`;

        try {
            const response = await fetch(url, { method: "POST" });
            const data = await response.json();

            if (response.ok) {
                res.json({ access_token: data.access_token });
            } else {
                res.status(response.status).json({ error: data.message });
            }
        } catch (error) {
            console.error("Error fetching IGDB token:", error);
            res.status(500).json({ error: "Failed to fetch IGDB token" });
        }
    });
};