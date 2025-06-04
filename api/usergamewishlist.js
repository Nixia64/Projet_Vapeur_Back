const UserGameWishlistService = require('../services/usergamewishlist');

module.exports = (app, db, jwt) => {
    const service = new UserGameWishlistService(db);

    // Récupérer la wishlist de l'utilisateur connecté
    app.get('/api/wishlist', jwt.validateJWT, async (req, res) => {
        try {
            const user_id = req.user.id;
            const games = await service.getGames(user_id);
            res.json(games);
        } catch (e) {
            res.status(500).json({ error: "Erreur lors de la récupération de la wishlist" });
        }
    });

    // Ajouter un jeu à la wishlist
    app.post('/api/wishlist', jwt.validateJWT, async (req, res) => {
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
                return res.status(409).json({ error: "Ce jeu est déjà dans votre wishlist" });
            }
            res.json({ success: true, id: result });
        } catch (e) {
            res.status(500).json({ error: "Erreur lors de l'ajout du jeu à la wishlist" });
        }
    });

    // Supprimer un jeu de la wishlist
    app.delete('/api/wishlist/:igdb_id', jwt.validateJWT, async (req, res) => {
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