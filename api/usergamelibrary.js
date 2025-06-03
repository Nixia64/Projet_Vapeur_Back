const UserGameLibraryService = require('../services/usergamelibrary');

module.exports = (app, db, jwt) => {
    const service = new UserGameLibraryService(db);

    // Récupérer la bibliothèque de l'utilisateur connecté
    app.get('/api/library', jwt.validateJWT, async (req, res) => {
        try {
            const user_id = req.user.id;
            const games = await service.getGames(user_id);
            res.json(games);
        } catch (e) {
            res.status(500).json({ error: "Erreur lors de la récupération de la bibliothèque" });
        }
    });

    // Ajouter un jeu à la bibliothèque
    app.post('/api/library', jwt.validateJWT, async (req, res) => {
        try {
            const user_id = req.user.id;
            const {
                igdb_id, game_name, cover_url, developer,
                release_date, rating, genres, themes, modes, perspectives, description
            } = req.body;

            if (!igdb_id || !game_name) {
                return res.status(400).json({ error: "Paramètres manquants" });
            }

            const result = await service.addGame(
                user_id, igdb_id, game_name, cover_url, developer,
                release_date, rating, genres, themes, modes, perspectives, description
            );
            if (result === null) {
                return res.status(409).json({ error: "Ce jeu est déjà dans votre bibliothèque" });
            }
            res.json({ success: true, id: result });
        } catch (e) {
            res.status(500).json({ error: "Erreur lors de l'ajout du jeu à la bibliothèque" });
        }
    });

    // Supprimer un jeu de la bibliothèque
    app.delete('/api/library/:igdb_id', jwt.validateJWT, async (req, res) => {
        try {
            const user_id = req.user.id;
            const igdb_id = parseInt(req.params.igdb_id, 10);
            await service.removeGame(user_id, igdb_id);
            res.json({ success: true });
        } catch (e) {
            res.status(500).json({ error: "Erreur lors de la suppression du jeu" });
        }
    });
};