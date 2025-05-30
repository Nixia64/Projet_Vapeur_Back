const UserGameLibraryService = require('../services/usergamelibrary');

module.exports = (app, db) => {
    const service = new UserGameLibraryService(db);

    // Récupérer la bibliothèque de l'utilisateur
    app.get('/api/library', async (req, res) => {
        // À adapter selon ton système d'authentification
        const user_id = req.session?.user?.id || req.user?.id || req.query.user_id;
        if (!user_id) return res.status(401).json({ error: "Not authenticated" });
        const games = await service.getGames(user_id);
        res.json(games);
    });

    // Ajouter un jeu à la bibliothèque
    app.post('/api/library', async (req, res) => {
        const user_id = req.session?.user?.id || req.user?.id || req.body.user_id;
        const { igdb_id, game_name, cover_url } = req.body;
        if (!user_id || !igdb_id || !game_name) {
            return res.status(400).json({ error: "Missing parameters" });
        }
        const result = await service.addGame(user_id, igdb_id, game_name, cover_url);
        res.json({ success: !!result });
    });

    // Supprimer un jeu de la bibliothèque
    app.delete('/api/library', async (req, res) => {
        const user_id = req.session?.user?.id || req.user?.id || req.body.user_id;
        const { igdb_id } = req.body;
        if (!user_id || !igdb_id) {
            return res.status(400).json({ error: "Missing parameters" });
        }
        await service.removeGame(user_id, igdb_id);
        res.json({ success: true });
    });
};