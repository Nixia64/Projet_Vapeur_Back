const UserGameWishlistDAO = require('../datamodel/usergamewishlistdao');

module.exports = class UserGameWishlistService {
    constructor(db) {
        this.dao = new UserGameWishlistDAO(db);
    }

    async addGame(user_id, igdb_id, game_name, cover_url, developer, release_date, rating, genres, themes, modes, perspectives, description) {
        if (await this.dao.hasGame(user_id, igdb_id)) {
            return null;
        }
        return this.dao.addGame(
            user_id, igdb_id, game_name, cover_url, developer,
            release_date, rating, genres, themes, modes, perspectives, description
        );
    }

    async getGames(user_id) {
        return this.dao.getGamesByUser(user_id);
    }

    async removeGame(user_id, igdb_id) {
        return this.dao.removeGame(user_id, igdb_id);
    }
};