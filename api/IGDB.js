const fetch = require("node-fetch");

module.exports = (app) => {
    const CLIENT_ID = process.env.IGDB_CLIENT_ID;
    const CLIENT_SECRET = process.env.IGDB_CLIENT_SECRET;
    let accessToken = null;

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

    app.post("/api/igdb/games", async (req, res) => {
        if (!accessToken) {
            const url = `https://id.twitch.tv/oauth2/token?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&grant_type=client_credentials`;
            const response = await fetch(url, { method: "POST" });
            const data = await response.json();
            accessToken = data.access_token;
        }
        try {
            const igdbRes = await fetch("https://api.igdb.com/v4/games", {
                method: "POST",
                headers: {
                    "Client-ID": CLIENT_ID,
                    "Authorization": `Bearer ${accessToken}`,
                    "Content-Type": "text/plain"
                },
                body: req.body // <-- utilise directement le texte reçu
            });
            const result = await igdbRes.json();
            console.log("IGDB API result:", result); // Ajoute ce log
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: "Failed to fetch games from IGDB" });
        }
    });

    app.get("/api/igdb/genres", async (req, res) => {
        try {
            // Utilise le même système d'auth que pour les jeux
            if (!accessToken) {
                const url = `https://id.twitch.tv/oauth2/token?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&grant_type=client_credentials`;
                const response = await fetch(url, { method: "POST" });
                const data = await response.json();
                accessToken = data.access_token;
            }
            const igdbRes = await fetch("https://api.igdb.com/v4/genres", {
                method: "POST",
                headers: {
                    "Client-ID": CLIENT_ID,
                    "Authorization": `Bearer ${accessToken}`,
                    "Content-Type": "text/plain"
                },
                body: "fields id,name; limit 100;"
            });
            const result = await igdbRes.json();
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: "Failed to fetch genres from IGDB" });
        }
    });

    app.get("/api/igdb/themes", async (req, res) => {
        try {
            if (!accessToken) {
                const url = `https://id.twitch.tv/oauth2/token?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&grant_type=client_credentials`;
                const response = await fetch(url, { method: "POST" });
                const data = await response.json();
                accessToken = data.access_token;
            }
            const igdbRes = await fetch("https://api.igdb.com/v4/themes", {
                method: "POST",
                headers: {
                    "Client-ID": CLIENT_ID,
                    "Authorization": `Bearer ${accessToken}`,
                    "Content-Type": "text/plain"
                },
                body: "fields id,name; limit 100;"
            });
            const result = await igdbRes.json();
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: "Failed to fetch themes from IGDB" });
        }
    });

    app.get("/api/igdb/modes", async (req, res) => {
        try {
            if (!accessToken) {
                const url = `https://id.twitch.tv/oauth2/token?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&grant_type=client_credentials`;
                const response = await fetch(url, { method: "POST" });
                const data = await response.json();
                accessToken = data.access_token;
            }
            const igdbRes = await fetch("https://api.igdb.com/v4/game_modes", {
                method: "POST",
                headers: {
                    "Client-ID": CLIENT_ID,
                    "Authorization": `Bearer ${accessToken}`,
                    "Content-Type": "text/plain"
                },
                body: "fields id,name; limit 100;"
            });
            const result = await igdbRes.json();
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: "Failed to fetch modes from IGDB" });
        }
    });

    app.get("/api/igdb/perspectives", async (req, res) => {
        try {
            if (!accessToken) {
                const url = `https://id.twitch.tv/oauth2/token?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&grant_type=client_credentials`;
                const response = await fetch(url, { method: "POST" });
                const data = await response.json();
                accessToken = data.access_token;
            }
            const igdbRes = await fetch("https://api.igdb.com/v4/player_perspectives", {
                method: "POST",
                headers: {
                    "Client-ID": CLIENT_ID,
                    "Authorization": `Bearer ${accessToken}`,
                    "Content-Type": "text/plain"
                },
                body: "fields id,name; limit 100;"
            });
            const result = await igdbRes.json();
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: "Failed to fetch perspectives from IGDB" });
        }
    });
};