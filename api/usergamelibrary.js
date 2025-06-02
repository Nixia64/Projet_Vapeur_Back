const UserGameLibraryService = require('../services/usergamelibrary');

module.exports = (app, db, jwt) => {
    const service = new UserGameLibraryService(db);

    // Protéger les routes avec le middleware JWT
    app.get('/api/library', jwt.validateJWT, async (req, res) => {
        const user_id = req.user?.id;
        if (!user_id) return res.status(401).json({ error: "Not authenticated" });
        const games = await service.getGames(user_id);
        res.json(games);
    });

    app.post('/api/library', jwt.validateJWT, async (req, res) => {
        const user_id = req.user?.id;
        const { igdb_id, game_name } = req.body;
        if (!user_id || !igdb_id || !game_name) {
            return res.status(400).json({ error: "Missing parameters" });
        }
        const result = await service.addGame(user_id, igdb_id, game_name);
        res.json({ success: !!result });
    });

    app.delete('/api/library', jwt.validateJWT, async (req, res) => {
        const user_id = req.user?.id;
        const { igdb_id } = req.body;
        if (!user_id || !igdb_id) {
            return res.status(400).json({ error: "Missing parameters" });
        }
        await service.removeGame(user_id, igdb_id);
        res.json({ success: true });
    });
};